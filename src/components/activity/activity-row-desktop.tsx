import { formatEur } from "@/lib/format";
import type {
  PaymentMethod,
  RecentEntry,
} from "@/components/dashboard/recent-activity";

const PAY_LABEL: Record<PaymentMethod, string> = {
  cash: "Grynais",
  card: "Kortele",
  transfer: "Pavedimu",
};

export function DesktopActivityRow({
  entry,
  last,
  onActions,
}: {
  entry: RecentEntry;
  last: boolean;
  onActions?: (entry: RecentEntry) => void;
}) {
  const isIncome = entry.kind === "income";
  const sign = isIncome ? "+" : "−";
  const amount = formatEur(entry.amountCents).replace(/\s?€/, "").replace("−", "");
  const time = formatTime(entry.createdAt);
  const rightLabel = isIncome && entry.paymentMethod
    ? PAY_LABEL[entry.paymentMethod]
    : "Išlaidos";

  return (
    <div
      className={`group flex items-center gap-4 px-[22px] py-4 ${
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
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-medium tracking-[-0.012em] text-ink-900/90">
          {entry.label}
          {entry.note ? (
            <span className="font-normal text-ink-500"> · {entry.note}</span>
          ) : null}
        </div>
        <div className="mt-[3px] flex items-center gap-1.5 text-[12px] text-ink-500">
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
      <div className="w-20 shrink-0 whitespace-nowrap text-right text-[12px] font-medium text-ink-500">
        {rightLabel}
      </div>
      <div
        className={`w-[110px] shrink-0 whitespace-nowrap text-right text-[16px] font-semibold tabular-nums tracking-[-0.018em] ${
          isIncome ? "text-[#1F7A4B]" : "text-[#A03A3A]"
        }`}
      >
        {sign}
        {amount} €
      </div>
      {onActions ? (
        <button
          type="button"
          aria-label="Veiksmai"
          onClick={() => onActions(entry)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-500 opacity-0 transition-opacity hover:bg-cream/60 hover:text-ink-900/90 focus-visible:opacity-100 group-hover:opacity-100"
        >
          <MoreIcon />
        </button>
      ) : null}
    </div>
  );
}

function MoreIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </svg>
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
