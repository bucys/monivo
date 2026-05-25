import { formatEur } from "@/lib/format";

export type WeeklyEarningsLabels = {
  eyebrow: string;
  emptyBody: string;
  weekShort: string;
};

export function WeeklyEarningsCard({
  weeks,
  totalCents,
  currentWeekIndex,
  labels,
}: {
  weeks: ReadonlyArray<number>;
  totalCents: number;
  currentWeekIndex: number;
  labels: WeeklyEarningsLabels;
}) {
  const hasAny = weeks.some((w) => w > 0);
  const max = Math.max(...weeks, 1);

  return (
    <section
      aria-label={labels.eyebrow}
      className="flex h-full flex-col rounded-[22px] bg-surface p-6 shadow-[0_1px_2px_rgba(23,33,29,0.04),_0_8px_24px_rgba(23,33,29,0.05)] lg:p-[30px]"
    >
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-500">
        {labels.eyebrow}
      </div>
      <div className="mt-2 flex items-baseline gap-1.5 whitespace-nowrap tabular-nums text-ink-900/90">
        <span className="text-[32px] font-semibold leading-none tracking-[-0.024em] lg:text-[40px] lg:tracking-[-0.03em]">
          {formatEur(totalCents).replace(/\s?€/, "")}
        </span>
        <span className="text-[18px] font-medium text-ink-500 lg:text-[22px]">
          €
        </span>
      </div>

      {hasAny ? (
        <div className="mt-8 flex h-[180px] items-end gap-5 lg:mt-10 lg:h-[220px] lg:gap-[26px]">
          {weeks.map((v, i) => {
            const h = (v / max) * 100;
            const active = i === currentWeekIndex;
            const isEmpty = v === 0;
            return (
              <div
                key={i}
                className="flex h-full flex-1 flex-col items-center justify-end gap-3"
              >
                <div
                  className={`text-[12px] font-semibold tabular-nums ${
                    active
                      ? "text-ink-900/90"
                      : isEmpty
                        ? "text-transparent"
                        : "text-ink-500"
                  }`}
                >
                  {isEmpty ? "·" : `${formatEur(v).replace(/\s?€/, "")} €`}
                </div>
                <div
                  className="w-full rounded-[12px]"
                  style={{
                    height: `${Math.max(h, isEmpty ? 2 : 8)}%`,
                    background: active
                      ? "linear-gradient(180deg, #1F7A6B, #185E53)"
                      : isEmpty
                        ? "#F1EDE4"
                        : "#DDF4EC",
                  }}
                />
                <div
                  className={`text-[11px] font-medium ${
                    active ? "text-ink-900/90" : "text-ink-500"
                  }`}
                >
                  {labels.weekShort} {i + 1}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-8 rounded-[14px] bg-cream/60 px-4 py-6 text-[13px] leading-[1.55] text-ink-500">
          {labels.emptyBody}
        </p>
      )}
    </section>
  );
}
