import { StatMiniCard } from "@/components/dashboard/monthly-stats";

export type InsightsSummaryLabels = {
  remaining: string;
  income: string;
  expense: string;
  taxReserve: string;
};

/**
 * Monthly financial summary for a PREVIOUS Insights month. Reuses the
 * dashboard's StatMiniCard so the income / expense / tax-reserve cards are
 * styled identically (same colors, spacing, typography). A fourth "remaining"
 * card (income − expenses − tax reserve) completes the picture. The page only
 * renders this for past months — the current month already lives on the
 * dashboard, so showing it here would duplicate that card.
 */
export function InsightsSummaryCard({
  incomeCents,
  expenseCents,
  taxReserveCents,
  remainingCents,
  labels,
}: {
  incomeCents: number;
  expenseCents: number;
  taxReserveCents: number;
  remainingCents: number;
  labels: InsightsSummaryLabels;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
      <StatMiniCard label={labels.income} cents={incomeCents} tone="income" arrow="up" />
      <StatMiniCard label={labels.expense} cents={expenseCents} tone="expense" arrow="down" />
      <StatMiniCard label={labels.taxReserve} cents={taxReserveCents} tone="tax" arrow="up" />
      <StatMiniCard label={labels.remaining} cents={remainingCents} tone="neutral" />
    </div>
  );
}
