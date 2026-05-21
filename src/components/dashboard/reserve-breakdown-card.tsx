"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { useT } from "@/i18n/locale-provider";
import { formatEur } from "@/lib/format";
import type { ReserveBreakdown } from "@/lib/tax";

/** Rounds to the nearest whole euro so reserve numbers read as friendly
 *  estimates ("apie 312 €") instead of precise figures ("312,47 €"). */
function roundToEuro(cents: number) {
  return Math.round(cents / 100) * 100;
}

type Line = { key: "vl" | "gpm" | "vsd" | "psd"; label: string; cents: number };

export function ReserveBreakdownCard({ reserve }: { reserve: ReserveBreakdown }) {
  const t = useT();
  const labels = t.dashboard;
  const explain = t.settings.tax.explain;
  const [open, setOpen] = useState(false);

  const lines: ReadonlyArray<Line> = [
    reserve.vlCents !== undefined
      ? { key: "vl", label: labels.reserveBreakdownVl, cents: reserve.vlCents }
      : null,
    reserve.gpmCents !== undefined
      ? { key: "gpm", label: labels.reserveBreakdownGpm, cents: reserve.gpmCents }
      : null,
    reserve.vsdCents !== undefined
      ? { key: "vsd", label: labels.reserveBreakdownVsd, cents: reserve.vsdCents }
      : null,
    reserve.psdCents !== undefined
      ? { key: "psd", label: labels.reserveBreakdownPsd, cents: reserve.psdCents }
      : null,
  ].filter((x): x is Line => x !== null);

  return (
    <section className="rounded-[22px] bg-white shadow-[0_1px_2px_rgba(23,33,29,0.04),_0_8px_24px_rgba(23,33,29,0.05)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="reserve-breakdown-body"
        className="flex w-full items-start gap-3 rounded-[22px] p-5 text-left transition-colors hover:bg-cream/40 active:bg-cream/60 sm:p-6"
      >
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-500">
            {labels.reservePlannedTitle}
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5 tabular-nums text-ink-900/90">
            <span className="text-[13px] font-medium text-ink-500">
              {labels.reserveAboutPrefix}
            </span>
            <span className="text-[28px] font-semibold leading-none tracking-[-0.025em]">
              {formatEur(roundToEuro(reserve.totalCents))}
            </span>
          </div>
          {!open && lines.length > 0 ? (
            <p className="mt-2 text-[12px] leading-[1.5] text-ink-500">
              {labels.reserveTapHint}
            </p>
          ) : null}
        </div>
        <span
          aria-hidden
          className={cn(
            "mt-1 shrink-0 text-ink-500 transition-transform duration-200 ease-out",
            open ? "rotate-180" : "rotate-0",
          )}
        >
          <Chevron />
        </span>
      </button>

      <div
        id="reserve-breakdown-body"
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-hair px-5 pb-5 pt-3 sm:px-6 sm:pb-6">
            {lines.length > 0 ? (
              <ul className="flex flex-col gap-2.5">
                {lines.map((line) => (
                  <li
                    key={line.key}
                    className="flex items-baseline justify-between text-[13px]"
                  >
                    <span className="text-ink-500">{line.label}</span>
                    <span className="font-medium tabular-nums text-ink-900/90">
                      {labels.reserveAboutPrefix}{" "}
                      {formatEur(roundToEuro(line.cents))}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="mt-3 text-[11px] leading-[1.5] text-ink-500">
              {explain.footnote}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Chevron() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
