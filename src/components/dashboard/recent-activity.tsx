import { formatEur } from "@/lib/format";

export type PaymentMethod = "cash" | "card" | "transfer";

export type RecentEntry = {
  id: string;
  /** raw uuid without the `i_` / `e_` prefix — used by edit/delete actions */
  rawId: string;
  kind: "income" | "expense";
  /** Server-provided display label (service name or expense category). Null when the row should fall back to a dictionary-translated default. */
  label: string | null;
  amountCents: number;
  occurredAt: string;
  createdAt: string;
  sortKey: string;
  paymentMethod?: PaymentMethod | null;
  note?: string | null;
  /** income only — preset service id when one is associated */
  serviceId?: string | null;
  /** expense only — raw category slug */
  categorySlug?: string | null;
};

export type TodayLabels = {
  aria: string;
  title: string;
  countSingle: string;
  countFew: string;
  countMany: string;
  payCash: string;
  payCard: string;
  payTransfer: string;
  payExpense: string;
};

function pluralizeCount(n: number, labels: TodayLabels) {
  if (n === 1) return labels.countSingle;
  if (n > 1 && n < 10) return labels.countFew;
  return labels.countMany;
}

function payLabelFor(pay: PaymentMethod, labels: TodayLabels) {
  if (pay === "cash") return labels.payCash;
  if (pay === "card") return labels.payCard;
  return labels.payTransfer;
}

export function TodayCard({
  entries,
  incomeCents,
  expenseCents,
  labels,
}: {
  entries: ReadonlyArray<RecentEntry>;
  incomeCents: number;
  expenseCents: number;
  labels: TodayLabels;
}) {
  const count = entries.length;
  const countLabel = pluralizeCount(count, labels);

  return (
    <section
      aria-label={labels.aria}
      className="overflow-hidden rounded-[20px] bg-surface shadow-[0_1px_2px_rgba(23,33,29,0.04),_0_8px_24px_rgba(23,33,29,0.05)]"
    >
      <div className="flex items-center justify-between border-b border-hair px-6 py-5">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-500">
            {labels.title}
          </div>
          <div className="mt-1 text-[18px] font-semibold tracking-[-0.018em] text-ink-900/90">
            {count} {countLabel}
          </div>
        </div>
        <div className="text-[12px] font-medium text-ink-500">
          <span className="font-semibold text-[#1F7A4B]">
            +{formatEur(incomeCents).replace(/\s?€/, "")}
          </span>
          <span className="mx-1.5">·</span>
          <span className="font-semibold text-expense">
            −{formatEur(expenseCents).replace(/\s?€/, "")}
          </span>
          <span className="ml-1.5">€</span>
        </div>
      </div>
      {entries.slice(0, 6).map((e, i, arr) => (
        <TodayRow key={e.id} entry={e} last={i === arr.length - 1} labels={labels} />
      ))}
    </section>
  );
}

function TodayRow({
  entry,
  last,
  labels,
}: {
  entry: RecentEntry;
  last: boolean;
  labels: TodayLabels;
}) {
  const isIncome = entry.kind === "income";
  const sign = isIncome ? "+" : "−";
  const amountText = formatEur(entry.amountCents).replace(/\s?€/, "").replace("−", "");
  const time = formatTime(entry.createdAt);
  const payRight = isIncome && entry.paymentMethod
    ? payLabelFor(entry.paymentMethod, labels)
    : labels.payExpense;

  return (
    <div
      className={`flex items-center gap-4 px-[22px] py-4 ${
        last ? "" : "border-b border-hair"
      }`}
    >
      <span
        aria-hidden
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] text-[16px] font-semibold ${
          isIncome
            ? "bg-[#D8F5E5] text-[#1F7A4B]"
            : "bg-[#FFE7E7] text-[#A03A3A]"
        }`}
      >
        {sign}
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="truncate text-[15px] font-medium tracking-[-0.008em] text-ink-900/90">
          {entry.label ?? ""}
          {entry.note ? (
            <span className="font-normal text-ink-500"> · {entry.note}</span>
          ) : null}
        </div>
        <div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-ink-500">
          {isIncome && entry.paymentMethod ? (
            <>
              <PayIcon pay={entry.paymentMethod} />
              <span>{payLabelFor(entry.paymentMethod, labels)}</span>
              <span aria-hidden>·</span>
            </>
          ) : null}
          <span>{time}</span>
        </div>
      </div>
      <div className="hidden w-20 shrink-0 text-right text-[12px] font-medium text-ink-500 sm:block">
        {payRight}
      </div>
      <div
        className={`w-[110px] shrink-0 text-right text-[16px] font-semibold tabular-nums tracking-[-0.012em] ${
          isIncome ? "text-[#1F7A4B]" : "text-[#A03A3A]"
        }`}
      >
        {sign}
        {amountText} €
      </div>
    </div>
  );
}

function PayIcon({ pay }: { pay: PaymentMethod }) {
  if (pay === "cash") {
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    );
  }
  if (pay === "card") {
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
      </svg>
    );
  }
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 7h13l-3-3" />
      <path d="M20 17H7l3 3" />
    </svg>
  );
}

function formatTime(iso: string) {
  const d = new Date(iso);
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}
