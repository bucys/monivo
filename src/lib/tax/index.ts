import { IV_RATES, VL_RATES } from "./rates";

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
  /** Inclusive date the current VL is valid through (ISO yyyy-mm-dd). */
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
  /** Present when PSD is included (IV or VL). */
  psdCents?: number;
  /** Present for IV mode and for VL Phase-1 planning. */
  vsdCents?: number;
  /** Present for VL mode — the prorated VL certificate cost reserve. */
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
  // Taxable profit: lump-sum (30% costs) or actual logged expenses.
  const taxableProfit =
    profile.ivExpenseMode === "fixed_30"
      ? input.incomeCents * (1 - IV_RATES.fixedCostsRatio)
      : nonNeg(input.incomeCents - input.expenseCents);

  // Sodra (VSD + PSD) is computed on 90% of taxable profit.
  const sodraBase = taxableProfit * IV_RATES.sodraBaseRatio;

  // Safer GPM estimate (15%) — see comment on IV_RATES.gpm.
  const gpmCents = roundCents(taxableProfit * IV_RATES.gpm);
  const vsdCents = roundCents(sodraBase * IV_RATES.vsd);
  const psdCents = profile.includePsd
    ? Math.max(
        roundCents(sodraBase * IV_RATES.psd),
        IV_RATES.minMonthlyPsdCents,
      )
    : 0;

  return {
    mode: "iv",
    gpmCents,
    vsdCents,
    psdCents: profile.includePsd ? psdCents : undefined,
    totalCents: gpmCents + vsdCents + psdCents,
  };
}

/** Count of inclusive calendar months from `now`'s month through `validUntil`'s
 *  month. Returns 0 when `validUntil` is in the past. Exported for tests. */
export function monthsRemainingThroughValidity(
  validUntil: string | null,
  now: Date = new Date(),
): number {
  if (!validUntil) return 0;
  const ts = Date.parse(validUntil);
  if (Number.isNaN(ts)) return 0;
  const end = new Date(ts);
  const startYM = now.getFullYear() * 12 + now.getMonth();
  const endYM = end.getFullYear() * 12 + end.getMonth();
  if (endYM < startYM) return 0;
  return endYM - startYM + 1;
}

/**
 * Phase-1 VL reserve. Spreads the entered certificate cost across the
 * remaining months of validity (or 12 if no end date), plus a lightweight
 * VSD planning slice on income and the statutory minimum PSD.
 *
 * No VL GPM is computed — that's typically pre-paid with the certificate;
 * the certificate-cost line *is* the GPM reserve.
 */
export function calculateVlReserve(
  profile: TaxProfile,
  input: ReserveInputs,
  now: Date = new Date(),
): ReserveBreakdown {
  const yearly = profile.vlYearlyCostCents ?? 0;
  let vlCents = 0;
  if (yearly > 0) {
    const months = monthsRemainingThroughValidity(profile.vlValidUntil, now);
    vlCents = roundCents(yearly / (months > 0 ? months : 12));
  }

  const psdCents = profile.includePsd ? IV_RATES.minMonthlyPsdCents : 0;
  const vsdCents = roundCents(input.incomeCents * VL_RATES.vsd);

  return {
    mode: "vl",
    vlCents,
    psdCents: profile.includePsd ? psdCents : undefined,
    vsdCents,
    totalCents: vlCents + psdCents + vsdCents,
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

export { IV_RATES, VL_RATES };
