import { formatEur } from "@/lib/format";

export type StatTone = "income" | "expense" | "tax" | "neutral";

const TONES: Record<StatTone, { bg: string; fg: string }> = {
  income: { bg: "#D8F5E5", fg: "#1F7A4B" },
  expense: { bg: "#FFE7E7", fg: "#A03A3A" },
  tax: { bg: "#FFF2D9", fg: "#8A6418" },
  neutral: { bg: "#EFEDE9", fg: "#3D3D3D" },
};

export function MonthlyStats({
  incomeCents,
  expenseCents,
  taxReserveCents,
  labels,
}: {
  incomeCents: number;
  expenseCents: number;
  taxReserveCents: number;
  labels: { income: string; expense: string; taxReserve: string };
}) {
  return (
    <div className="grid grid-cols-3 gap-2.5 lg:hidden">
      <StatMiniCard label={labels.income} cents={incomeCents} tone="income" arrow="up" />
      <StatMiniCard label={labels.expense} cents={expenseCents} tone="expense" arrow="down" />
      <StatMiniCard label={labels.taxReserve} cents={taxReserveCents} tone="tax" arrow="up" />
    </div>
  );
}

/**
 * Single stat mini-card. Shared so Insights can render the same income /
 * expense / tax-reserve cards as the dashboard. Pass `arrow` for the tinted
 * corner chip; omit it (e.g. for "remaining") to render a plain card.
 */
export function StatMiniCard({
  label,
  cents,
  tone,
  arrow,
}: {
  label: string;
  cents: number;
  tone: StatTone;
  arrow?: "up" | "down";
}) {
  const t = TONES[tone];
  const amount = formatEur(cents).replace(/\s?€/, "");
  return (
    <div className="relative min-w-0 overflow-hidden rounded-[18px] bg-surface p-3.5 shadow-[0_1px_2px_rgba(23,33,29,0.04),_0_8px_24px_rgba(23,33,29,0.05)]">
      {arrow ? (
        <span
          aria-hidden
          className="absolute right-3 top-3 flex h-[22px] w-[22px] items-center justify-center rounded-[8px]"
          style={{ background: t.bg, color: t.fg }}
        >
          <Arrow dir={arrow} />
        </span>
      ) : null}
      <div className="text-[11px] font-medium text-ink-500">{label}</div>
      <div className="mt-2.5 flex items-baseline gap-0.5 tracking-[-0.02em] tabular-nums">
        <span className="text-[19px] font-semibold text-ink-900/90">{amount}</span>
        <span className="text-[13px] font-medium text-ink-500">€</span>
      </div>
    </div>
  );
}

function Arrow({ dir }: { dir: "up" | "down" }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ transform: dir === "down" ? "rotate(180deg)" : undefined }}
    >
      <path d="M12 19V5" />
      <path d="M6 11l6-6 6 6" />
    </svg>
  );
}
