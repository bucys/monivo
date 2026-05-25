import { format } from "@/i18n";
import type { Locale } from "@/i18n";
import { formatEur } from "@/lib/format";
import {
  WEEKDAY_LONG_EN,
  WEEKDAY_LONG_LT,
  WEEKDAY_SHORT_EN,
  WEEKDAY_SHORT_LT,
  type WeekdayTally,
} from "@/lib/insights";

export type BestDayLabels = {
  eyebrow: string;
  emptyBody: string;
  summary: string;
  countOne: string;
  countFew: string;
  countMany: string;
};

function countLabelFor(n: number, labels: BestDayLabels) {
  if (n === 1) return labels.countOne;
  if (n % 10 >= 2 && n % 10 <= 9 && (n % 100 < 10 || n % 100 >= 20))
    return labels.countFew;
  return labels.countMany;
}

export function BestDayCard({
  tallies,
  best,
  labels,
  locale,
}: {
  tallies: ReadonlyArray<WeekdayTally>;
  best: WeekdayTally | null;
  labels: BestDayLabels;
  locale: Locale;
}) {
  const longNames = locale === "en" ? WEEKDAY_LONG_EN : WEEKDAY_LONG_LT;
  const shortNames = locale === "en" ? WEEKDAY_SHORT_EN : WEEKDAY_SHORT_LT;
  return (
    <section
      aria-label={labels.eyebrow}
      className="self-start rounded-[22px] bg-surface p-6 shadow-[0_1px_2px_rgba(23,33,29,0.04),_0_8px_24px_rgba(23,33,29,0.05)] lg:p-[26px]"
    >
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-500">
        {labels.eyebrow}
      </div>

      {best ? (
        <>
          <div className="mt-2 text-[24px] font-semibold leading-tight tracking-[-0.022em] text-ink-900/90 lg:text-[26px]">
            {longNames[best.index]}
          </div>
          <div className="mt-1 text-[13px] text-ink-500 tabular-nums">
            {format(labels.summary, {
              amount: formatEur(best.totalCents).replace(/\s?€/, ""),
              count: best.count,
              label: countLabelFor(best.count, labels),
            })}
          </div>
        </>
      ) : (
        <p className="mt-2 text-[13px] leading-[1.55] text-ink-500">
          {labels.emptyBody}
        </p>
      )}

      <div className="mt-5">
        <DayBars
          tallies={tallies}
          bestIndex={best?.index ?? null}
          shortNames={shortNames}
        />
      </div>
    </section>
  );
}

function DayBars({
  tallies,
  bestIndex,
  shortNames,
}: {
  tallies: ReadonlyArray<WeekdayTally>;
  bestIndex: number | null;
  shortNames: ReadonlyArray<string>;
}) {
  const max = Math.max(...tallies.map((t) => t.totalCents), 1);
  return (
    <div className="flex items-end gap-2">
      {tallies.map((t) => {
        const active = t.index === bestIndex;
        const ratio = t.totalCents > 0 ? t.totalCents / max : 0;
        return (
          <div key={t.index} className="flex flex-1 flex-col items-center gap-2">
            <div className="relative h-[64px] w-full overflow-hidden rounded-[8px] bg-[#F1EDE4]">
              {ratio > 0 ? (
                <div
                  className="absolute inset-x-0 bottom-0"
                  style={{
                    height: `${Math.max(ratio * 100, 14)}%`,
                    background: active
                      ? "linear-gradient(180deg, #1F7A6B, #185E53)"
                      : "#C9EBDF",
                  }}
                />
              ) : null}
            </div>
            <div
              className={`text-[10px] font-semibold ${
                active ? "text-accent-deep" : "text-ink-500"
              }`}
            >
              {shortNames[t.index]}
            </div>
          </div>
        );
      })}
    </div>
  );
}
