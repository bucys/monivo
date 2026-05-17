import { formatDayShort, formatEur } from "@/lib/format";

export type RecentEntry = {
  id: string;
  kind: "income" | "expense";
  label: string;
  amountCents: number;
  occurredAt: string;
  sortKey: string;
};

const EXPENSE_LABELS: Record<string, string> = {
  supplies: "Priemonės",
  rent: "Nuoma",
  marketing: "Marketingas",
  education: "Mokymai",
  equipment: "Įranga",
  other: "Kita",
};

export function expenseLabel(slug: string) {
  return EXPENSE_LABELS[slug] ?? "Išlaidos";
}

export function RecentActivity({
  entries,
}: {
  entries: ReadonlyArray<RecentEntry>;
}) {
  if (entries.length === 0) return null;

  return (
    <section
      aria-label="Naujausi įrašai"
      className="rounded-[24px] border border-hair bg-white p-4 sm:p-5 lg:p-6"
    >
      <div className="flex items-baseline justify-between px-1 pb-3">
        <h2 className="text-[14px] font-semibold tracking-tight text-ink-900/90">
          Naujausi įrašai
        </h2>
      </div>
      <ul className="flex flex-col">
        {entries.slice(0, 5).map((e, i) => (
          <RecentRow
            key={e.id}
            entry={e}
            desktopOnly={i >= 3}
          />
        ))}
      </ul>
    </section>
  );
}

function RecentRow({
  entry,
  desktopOnly,
}: {
  entry: RecentEntry;
  desktopOnly?: boolean;
}) {
  const isIncome = entry.kind === "income";
  const sign = isIncome ? "+" : "−";
  const tone = isIncome
    ? "bg-accent-soft text-accent-deep"
    : "bg-expense-bg text-expense";
  const date = new Date(`${entry.occurredAt}T00:00:00`);

  return (
    <li
      className={`items-center gap-3 border-t border-hair px-1 py-3 first:border-t-0 ${
        desktopOnly ? "hidden lg:flex" : "flex"
      }`}
    >
      <span
        aria-hidden
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold ${tone}`}
      >
        {sign}
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[14px] font-medium text-ink-900/90">
          {entry.label}
        </span>
        <span className="text-[11px] text-ink-500">{formatDayShort(date)}</span>
      </div>
      <span className="shrink-0 text-[15px] font-semibold tabular-nums text-ink-900/90">
        {sign}
        {formatEur(entry.amountCents).replace("−", "")}
      </span>
    </li>
  );
}
