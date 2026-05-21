import { IV_RATES } from "./rates";

export type TaxMode = "iv" | "vl" | "custom";
export type IvExpenseMode = "fixed_30" | "actual";

export type TaxProfile = {
  taxMode: TaxMode;
  ivExpenseMode: IvExpenseMode;
  includePsd: boolean;
  /** 0–60. Used when taxMode === "custom". */
  customTaxPercent: number | null;
  /** Annual VL cost in cents. Used when taxMode === "vl". */
  vlYearlyCostCents: number | null;
  /** Inclusive date the current VL is valid through. */
  vlValidUntil: string | null;
};

export type ReserveInputs = {
  incomeCents: number;
  expenseCents: number;
};

export type ReserveBreakdown = {
  totalCents: number;
  mode: TaxMode;
  /** Present for IV mode. */
  gpmCents?: number;
  /** Present for IV mode and for VL when PSD is included. */
  psdCents?: number;
  /** Present for IV mode. */
  vsdCents?: number;
  /** Present for VL mode — the prorated VL license cost. */
  vlCents?: number;
};

function nonNeg(n: number): number {
  return n < 0 ? 0 : n;
}

function roundCents(n: number): number {
  return Math.round(n);
}

export function calculateIvReserve(
  profile: TaxProfile,
  input: ReserveInputs,
): ReserveBreakdown {
  const taxable =
    profile.ivExpenseMode === "fixed_30"
      ? input.incomeCents * (1 - IV_RATES.fixedCostsRatio)
      : nonNeg(input.incomeCents - input.expenseCents);

  const gpmCents = roundCents(taxable * IV_RATES.gpm);
  const vsdCents = roundCents(taxable * IV_RATES.vsd);
  const psdCents = profile.includePsd
    ? roundCents(taxable * IV_RATES.psd)
    : 0;

  return {
    mode: "iv",
    gpmCents,
    vsdCents,
    psdCents: profile.includePsd ? psdCents : undefined,
    totalCents: gpmCents + vsdCents + psdCents,
  };
}

/** Phase-1 VL reserve: simple monthly proration of the yearly license cost
 *  plus optional PSD on the period's income. */
export function calculateVlReserve(
  profile: TaxProfile,
  input: ReserveInputs,
): ReserveBreakdown {
  const yearly = profile.vlYearlyCostCents ?? 0;
  const vlCents = roundCents(yearly / 12);
  const psdCents = profile.includePsd
    ? roundCents(input.incomeCents * IV_RATES.psd)
    : 0;
  return {
    mode: "vl",
    vlCents,
    psdCents: profile.includePsd ? psdCents : undefined,
    totalCents: vlCents + psdCents,
  };
}

export function calculateCustomReserve(
  profile: TaxProfile,
  input: ReserveInputs,
): ReserveBreakdown {
  const pct = Math.max(0, Math.min(60, profile.customTaxPercent ?? 0));
  return {
    mode: "custom",
    totalCents: roundCents(input.incomeCents * (pct / 100)),
  };
}

export function calculateTaxReserve(
  profile: TaxProfile,
  input: ReserveInputs,
): ReserveBreakdown {
  switch (profile.taxMode) {
    case "iv":
      return calculateIvReserve(profile, input);
    case "vl":
      return calculateVlReserve(profile, input);
    case "custom":
    default:
      return calculateCustomReserve(profile, input);
  }
}

export { IV_RATES };
