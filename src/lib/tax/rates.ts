// Approximate Lithuanian self-employed (IV) rates used for *estimation only*.
// These are intentionally rounded — the product positioning is
// "Planuojamas mokesčių rezervas" (planned reserve), not exact taxes.
// Update only when the legal rates change.

export const IV_RATES = {
  /** GPM (income tax) on taxable income, simplified. */
  gpm: 0.15,
  /** VSD (social insurance), approximate. */
  vsd: 0.1252,
  /** PSD (health insurance), approximate. */
  psd: 0.0698,
  /** Lump-sum "30% costs" deduction. */
  fixedCostsRatio: 0.3,
} as const;
