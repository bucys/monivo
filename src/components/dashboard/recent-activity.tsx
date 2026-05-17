import { formatEur } from "@/lib/format";

export type PaymentMethod = "cash" | "card" | "transfer";

export type RecentEntry = {
  id: string;
  kind: "income" | "expense";
  label: string;
  amountCents: number;
  occurredAt: string;
  createdAt: string;
  sortKey: string;
  paymentMethod?: PaymentMethod | null;
  note?: string | null;
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

const PAY_LABEL: Record<PaymentMethod, string> = {
  cash: "Grynais",
  card: "Kortele",
  transfer: "Pavedimu",
};

const PAY_RIGHT: Record<PaymentMethod, string> = {
  cash: "Grynais",
  card: "Kortele",
  transfer: "Pavedimu",
};

export function TodayCard({
  entries,
  incomeCents,
  expenseCents,
}: {
  entries: ReadonlyArray<RecentEntry>;
  incomeCents: number;
  expenseCents: number;
}) {
  const count = entries.length;
  const countLabel =
    count === 1 ? "įrašas" : count > 1 && count < 10 ? "įrašai" : "įrašų";

  return (
    <section
      aria-label="Šios dienos įrašai"
      className="overflow-hidden rounded-[20px] bg-white shadow-[0_1px_2px_rgba(23,33,29,0.04),_0_8px_24px_rgba(23,33,29,0.05)]"
    >
      <div className="flex items-center justify-between border-b border-hair px-6 py-5">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-500">
            Šiandien
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
        <TodayRow key={e.id} entry={e} last={i === arr.length - 1} />
      ))}
    </section>
  );
}

function TodayRow({ entry, last }: { entry: RecentEntry; last: boolean }) {
  const isIncome = entry.kind === "income";
  const sign = isIncome ? "+" : "−";
  const amountText = formatEur(entry.amountCents).replace(/\s?€/, "").replace("−", "");
  const time = formatTime(entry.createdAt);
  const payRight = isIncome && entry.paymentMethod
    ? PAY_RIGHT[entry.paymentMethod]
    : "Išlaida";

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
          {entry.label}
          {entry.note ? (
            <span className="font-normal text-ink-500"> · {entry.note}</span>
          ) : null}
        </div>
        <div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-ink-500">
          {isIncome && entry.paymentMethod ? (
            <>
              <PayIcon pay={entry.paymentMethod} />
              <span>{PAY_LABEL[entry.paymentMethod]}</span>
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
