import { formatEur } from "@/lib/format";
import type { RecentEntry, PaymentMethod } from "./recent-activity";

export type MobileTodayLabels = {
  aria: string;
  title: string;
  seeAll: string;
  emptyTitle: string;
  emptyBody: string;
  payCash: string;
  payCard: string;
  payTransfer: string;
};

function payLabelFor(pay: PaymentMethod, labels: MobileTodayLabels) {
  if (pay === "cash") return labels.payCash;
  if (pay === "card") return labels.payCard;
  return labels.payTransfer;
}

export function MobileTodayList({
  entries,
  labels,
}: {
  entries: ReadonlyArray<RecentEntry>;
  labels: MobileTodayLabels;
}) {
  return (
    <section aria-label={labels.aria} className="lg:hidden">
      <SectionHeader title={labels.title} seeAll={labels.seeAll} />
      {entries.length > 0 ? (
        <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_1px_2px_rgba(23,33,29,0.04),_0_8px_24px_rgba(23,33,29,0.05)]">
          {entries.slice(0, 6).map((e, i, arr) => (
            <Row key={e.id} entry={e} last={i === arr.length - 1} labels={labels} />
          ))}
        </div>
      ) : (
        <EmptyCard emptyTitle={labels.emptyTitle} emptyBody={labels.emptyBody} />
      )}
    </section>
  );
}

function SectionHeader({ title, seeAll }: { title: string; seeAll: string }) {
  return (
    <div className="mb-3 flex items-center justify-between px-0.5">
      <h2 className="text-[14px] font-semibold tracking-[-0.012em] text-ink-900/90">
        {title}
      </h2>
      <span className="text-[13px] font-medium text-accent">{seeAll}</span>
    </div>
  );
}

function Row({
  entry,
  last,
  labels,
}: {
  entry: RecentEntry;
  last: boolean;
  labels: MobileTodayLabels;
}) {
  const isIncome = entry.kind === "income";
  const sign = isIncome ? "+" : "−";
  const amount = formatEur(entry.amountCents).replace(/\s?€/, "").replace("−", "");
  const time = formatTime(entry.createdAt);
  return (
    <div
      className={`flex items-center gap-3.5 px-5 py-3.5 ${
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
              <span>{payLabelFor(entry.paymentMethod, labels)}</span>
              <span aria-hidden>·</span>
            </>
          ) : null}
          <span>{time}</span>
        </div>
      </div>
      <div
        className={`shrink-0 text-[15px] font-semibold tabular-nums tracking-[-0.012em] ${
          isIncome ? "text-[#1F7A4B]" : "text-[#A03A3A]"
        }`}
      >
        {sign}
        {amount} €
      </div>
    </div>
  );
}

function EmptyCard({
  emptyTitle,
  emptyBody,
}: {
  emptyTitle: string;
  emptyBody: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-[22px] bg-white px-6 py-10 text-center shadow-[0_1px_2px_rgba(23,33,29,0.04),_0_8px_24px_rgba(23,33,29,0.05)]">
      <span
        aria-hidden
        className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-accent-soft text-accent-deep"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4" y="5" width="16" height="15" rx="3" />
          <path d="M8 3v4M16 3v4M4 10h16" />
        </svg>
      </span>
      <h3 className="mt-3.5 text-[15px] font-semibold tracking-[-0.012em] text-ink-900/90">
        {emptyTitle}
      </h3>
      <p className="mt-1.5 max-w-[260px] text-[13px] leading-[1.5] text-ink-500">
        {emptyBody}
      </p>
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
