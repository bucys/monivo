export function TodayEmpty({
  incomeCents,
  expenseCents,
  labels,
}: {
  incomeCents: number;
  expenseCents: number;
  labels: {
    aria: string;
    title: string;
    countZero: string;
    emptyTitle: string;
    emptyBody: string;
  };
}) {
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
            {labels.countZero}
          </div>
        </div>
        <div className="text-[12px] font-medium text-ink-500">
          <span className="font-semibold text-[#1F7A4B]">+0</span>
          <span className="mx-1.5">·</span>
          <span className="font-semibold text-expense">−0</span>
          <span className="ml-1.5">€</span>
        </div>
      </div>
      <div className="flex flex-col items-center px-6 py-12 text-center">
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
        <h3 className="mt-4 text-[15px] font-semibold tracking-[-0.012em] text-ink-900/90">
          {labels.emptyTitle}
        </h3>
        <p className="mt-1.5 max-w-[320px] text-[13px] leading-[1.5] text-ink-500">
          {labels.emptyBody}
        </p>
        {incomeCents > 0 || expenseCents > 0 ? null : null}
      </div>
    </section>
  );
}
