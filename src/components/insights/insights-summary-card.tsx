import { formatEur } from "@/lib/format";

export type InsightsSummaryLabels = {
  remaining: string;
  income: string;
  expense: string;
  taxReserve: string;
};

// Tone colors mirror the dashboard MonthlyStats mini-cards.
const TONE = {
  income: "#1F7A4B",
  expense: "#A03A3A",
  tax: "#8A6418",
} as const;

/**
 * Compact monthly financial summary for the selected Insights month:
 * remaining (income − expenses − tax reserve) up top, with the three
 * components below. Tax reserve is computed by the page via the shared
 * calculateTaxReserve — this card only renders the figures.
 */
export function InsightsSummaryCard({
  title,
  incomeCents,
  expenseCents,
  taxReserveCents,
  remainingCents,
  labels,
}: {
  /** Month-aware heading, e.g. "Šį mėnesį" / "Balandį". */
  title: string;
  incomeCents: number;
  expenseCents: number;
  taxReserveCents: number;
  remainingCents: number;
  labels: InsightsSummaryLabels;
}) {
  return (
    <section
      aria-label={title}
      className="rounded-[22px] bg-surface p-6 shadow-[0_1px_2px_rgba(23,33,29,0.04),_0_8px_24px_rgba(23,33,29,0.05)] lg:p-[30px]"
    >
      <div className="text-[13px] font-semibold tracking-tight text-ink-900/90">
        {title}
      </div>
      <div className="mt-2 text-[40px] font-semibold leading-tight tracking-[-0.028em] tabular-nums text-ink-900/90 lg:text-[44px] lg:tracking-[-0.032em]">
        {formatEur(remainingCents)}
      </div>
      <div className="mt-1 text-[13px] text-ink-500">{labels.remaining}</div>

      <div className="mt-5 grid grid-cols-3 gap-2.5">
        <Stat label={labels.income} cents={incomeCents} color={TONE.income} />
        <Stat label={labels.expense} cents={expenseCents} color={TONE.expense} />
        <Stat
          label={labels.taxReserve}
          cents={taxReserveCents}
          color={TONE.tax}
        />
      </div>
    </section>
  );
}

function Stat({
  label,
  cents,
  color,
}: {
  label: string;
  cents: number;
  color: string;
}) {
  return (
    <div className="min-w-0 rounded-[14px] bg-cream/70 p-3">
      <div className="flex items-center gap-1.5">
        <span
          aria-hidden
          className="block h-1.5 w-1.5 flex-shrink-0 rounded-full"
          style={{ background: color }}
        />
        <span className="truncate text-[11px] font-medium text-ink-500">
          {label}
        </span>
      </div>
      <div className="mt-1.5 text-[15px] font-semibold tabular-nums tracking-[-0.01em] text-ink-900/90">
        {formatEur(cents)}
      </div>
    </div>
  );
}
