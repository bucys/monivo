import { formatEur } from "@/lib/format";

export function WeeklyEarnings({
  weeks,
  totalCents,
  currentWeekIndex,
  title,
  weekLabel,
}: {
  weeks: ReadonlyArray<number>;
  totalCents: number;
  currentWeekIndex: number;
  title: string;
  weekLabel: string;
}) {
  const max = Math.max(...weeks, 1);

  return (
    <section
      aria-label={title}
      className="flex h-full flex-col rounded-[20px] bg-surface p-[26px] shadow-[0_1px_2px_rgba(23,33,29,0.04),_0_8px_24px_rgba(23,33,29,0.05)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-500">
            {title}
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 whitespace-nowrap text-[28px] font-semibold leading-none tracking-[-0.02em] tabular-nums text-ink-900/90">
            <span>{formatEur(totalCents).replace(/\s?€/, "")}</span>
            <span className="text-[16px] font-normal text-ink-500">€</span>
          </div>
        </div>
      </div>

      <div className="mt-[22px] flex h-[180px] items-end gap-[22px]">
        {weeks.map((v, i) => {
          const h = max > 0 ? (v / max) * 160 : 0;
          const active = i === currentWeekIndex;
          return (
            <div
              key={i}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2.5"
            >
              <div
                className={`text-[12px] font-semibold tabular-nums ${
                  active ? "text-ink-900/90" : "text-ink-500"
                }`}
              >
                {formatEur(v).replace(/\s?€/, "")} €
              </div>
              <div
                className="w-full rounded-[10px]"
                style={{
                  height: Math.max(h, v > 0 ? 6 : 2),
                  background: active
                    ? "linear-gradient(180deg, #1F7A6B, #185E53)"
                    : "#DDF4EC",
                }}
              />
              <div className="text-[11px] font-medium text-ink-500">
                {weekLabel} {i + 1}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
