// Approximate Lithuanian self-employed (IV) rates used for *estimation only*.
// These are intentionally rounded — the product positioning is
// "Planuojamas mokesčių rezervas" (planned reserve), not exact taxes.
// Update only when the legal rates change.

export const IV_RATES = {
  /** GPM (income tax) on taxable profit. Reduced rate for self-employed. */
  gpm: 0.05,
  /** VSD (social insurance) on the Sodra contribution base. */
  vsd: 0.1252,
  /** PSD (health insurance) on the Sodra contribution base. */
  psd: 0.0698,
  /** Share of taxable profit that becomes the Sodra contribution base. */
  sodraBaseRatio: 0.9,
  /** Lump-sum "30% costs" deduction. */
  fixedCostsRatio: 0.3,
  /**
   * Minimum monthly PSD contribution in cents.
   * Used as a floor when include_psd is true. Tracks the statutory minimum
   * tied to the Lithuanian MMA (minimum monthly wage) × PSD rate.
   * TODO 2026: re-check after the annual MMA review.
   */
  minMonthlyPsdCents: 7250,
} as const;
