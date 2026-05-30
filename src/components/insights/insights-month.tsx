"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { MonthPicker } from "@/components/ui/month-picker";
import { useLocale } from "@/i18n/locale-provider";
import type { MonthOption } from "@/lib/activity";

/**
 * Insights month selector. Reuses the same available-months list and the same
 * MonthPicker modal as Activity. Insights has no week/month pills, so it is a
 * single control showing the selected month; the current month is always
 * included so the user can return to "now" even when it has no data yet.
 */
export function InsightsMonth({
  months,
  selectedValue,
  currentValue,
  currentLabel,
}: {
  /** Months with data — identical to Activity's list (income + expense). */
  months: ReadonlyArray<MonthOption>;
  /** YYYY-MM currently shown. */
  selectedValue: string;
  /** YYYY-MM of the real current month. */
  currentValue: string;
  /** Display label for the current month, e.g. "Gegužė 2026". */
  currentLabel: string;
}) {
  const router = useRouter();
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const list = months.some((m) => m.value === currentValue)
    ? months
    : [{ value: currentValue, label: currentLabel }, ...months];

  const selectedLabel =
    list.find((m) => m.value === selectedValue)?.label ?? currentLabel;

  const pick = (value: string) => {
    setOpen(false);
    startTransition(() => {
      router.push(
        value === currentValue ? "/insights" : `/insights?month=${value}`,
        { scroll: false },
      );
    });
  };

  return (
    <div className="flex">
      <button
        type="button"
        disabled={pending}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3.5 py-1.5 text-[13px] font-medium tracking-[-0.008em] text-ink-700 shadow-[0_1px_2px_rgba(23,33,29,0.04),_0_8px_24px_rgba(23,33,29,0.05)] ring-1 ring-hair transition-colors hover:text-ink-900/90 disabled:opacity-60"
      >
        {selectedLabel}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <MonthPicker
          monthValue={selectedValue}
          months={list}
          title={t.activity.period.modalTitle}
          emptyLabel={t.activity.period.empty}
          closeLabel={t.common.close}
          onClose={() => setOpen(false)}
          onPick={pick}
        />
      ) : null}
    </div>
  );
}
