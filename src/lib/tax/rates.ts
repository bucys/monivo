// Approximate Lithuanian tax-reserve rates — *estimation only*.
// The product positions these as "Planuojamas mokesčių rezervas" / planned
// reserve, never as an official calculation.
//
// 2026 fallback values. Replace later with a proper tax-config sync layer
// (per-year MMA, progressive GPM brackets, NPD, VL price tables, etc.).

/** Lithuanian minimum monthly wage (MMA) in cents — 2026 fallback. */
export const MMA_CENTS_2026 = 115300;

export const PSD_RATE = 0.0698;

export const IV_RATES = {
  /**
   * Safer Phase-1 GPM estimate. The legal rate is 5 % below certain profit
   * thresholds and rises after that. 15 % is intentionally conservative so
   * the reserve never under-saves. Replace with a proper progressive /
   * effective-rate model in Phase 2.
   */
  gpm: 0.15,
  /** VSD (social insurance) on the Sodra contribution base. */
  vsd: 0.1252,
  /** PSD (health insurance) on the Sodra contribution base. */
  psd: PSD_RATE,
  /** Share of taxable profit that becomes the Sodra contribution base. */
  sodraBaseRatio: 0.9,
  /** Lump-sum "30 % costs" deduction. */
  fixedCostsRatio: 0.3,
  /**
   * Minimum monthly PSD contribution in cents (≈ MMA × PSD rate).
   * 2026: round(115 300 × 0.0698) ≈ 8 048 cents (€80.48).
   * Update when the annual MMA is revised.
   */
  minMonthlyPsdCents: Math.round(MMA_CENTS_2026 * PSD_RATE),
} as const;

export const VL_RATES = {
  /**
   * Lightweight VSD planning estimate for Business Certificate holders.
   * Applied to income, not to a Sodra base. Replace with a more accurate
   * model once activity/municipality pricing is wired up.
   */
  vsd: 0.0872,
} as const;
