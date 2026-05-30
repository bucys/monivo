"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { MonthPicker } from "@/components/ui/month-picker";
import { useLocale } from "@/i18n/locale-provider";
import type { MonthOption, PeriodMode } from "@/lib/activity";

export function ActivityPeriod({
  mode,
  monthValue,
  months,
}: {
  mode: PeriodMode;
  monthValue?: string;
  months: ReadonlyArray<MonthOption>;
}) {
  const router = useRouter();
  const { t } = useLocale();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const items: ReadonlyArray<{ mode: PeriodMode; label: string }> = [
    { mode: "week", label: t.activity.period.week },
    { mode: "month", label: t.activity.period.month },
    { mode: "custom", label: t.activity.period.choose },
  ];

  const navigate = (search: string) => {
    startTransition(() => {
      router.push(`/activity${search}`, { scroll: false });
    });
  };

  const handlePill = (next: PeriodMode) => {
    if (next === "custom") {
      setOpen(true);
      return;
    }
    if (next === "month") navigate("");
    else navigate(`?period=${next}`);
  };

  const handleMonthPick = (value: string) => {
    setOpen(false);
    navigate(`?period=${value}`);
  };

  const customLabel =
    mode === "custom" && monthValue
      ? months.find((m) => m.value === monthValue)?.label ?? t.activity.period.choose
      : t.activity.period.choose;

  return (
    <div data-testid="activity-period-wrapper" className="flex">
      <div
        role="tablist"
        aria-label={t.activity.period.ariaLabel}
        className="inline-flex max-w-full items-center gap-1 rounded-full bg-surface p-1 shadow-[0_1px_2px_rgba(23,33,29,0.04),_0_8px_24px_rgba(23,33,29,0.05)] ring-1 ring-hair"
      >
        {items.map((item) => {
          const active = item.mode === mode;
          const label = item.mode === "custom" ? customLabel : item.label;
          return (
            <button
              key={item.mode}
              type="button"
              role="tab"
              aria-selected={active}
              disabled={pending}
              onClick={() => handlePill(item.mode)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-medium tracking-[-0.008em] transition-colors disabled:opacity-60 ${
                active
                  ? "bg-accent text-white shadow-[0_1px_3px_rgba(0,0,0,0.18)]"
                  : "text-ink-700 hover:text-ink-900/90"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      {open ? (
        <MonthPicker
          monthValue={monthValue}
          months={months}
          title={t.activity.period.modalTitle}
          emptyLabel={t.activity.period.empty}
          closeLabel={t.common.close}
          onClose={() => setOpen(false)}
          onPick={handleMonthPick}
        />
      ) : null}
    </div>
  );
}
