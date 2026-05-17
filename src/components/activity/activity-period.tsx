"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ModalSheet } from "@/components/ui/modal-sheet";
import {
  lastTwelveMonths,
  type PeriodMode,
} from "@/lib/activity";

const ITEMS: ReadonlyArray<{ mode: PeriodMode; label: string }> = [
  { mode: "week", label: "Ši savaitė" },
  { mode: "month", label: "Šis mėnuo" },
  { mode: "custom", label: "Pasirinkti" },
];

export function ActivityPeriod({
  mode,
  monthValue,
}: {
  mode: PeriodMode;
  monthValue?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const months = lastTwelveMonths();

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
      ? months.find((m) => m.value === monthValue)?.label ?? "Pasirinkti"
      : "Pasirinkti";

  return (
    <div data-testid="activity-period-wrapper" className="flex">
      <div
        role="tablist"
        aria-label="Periodas"
        className="inline-flex max-w-full items-center gap-1 rounded-full bg-white p-1 shadow-[0_1px_2px_rgba(23,33,29,0.04),_0_8px_24px_rgba(23,33,29,0.05)] ring-1 ring-hair"
      >
        {ITEMS.map((item) => {
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
                  ? "bg-ink-900 text-white shadow-[0_1px_2px_rgba(23,33,29,0.18)]"
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
          onClose={() => setOpen(false)}
          onPick={handleMonthPick}
        />
      ) : null}
    </div>
  );
}

function MonthPicker({
  monthValue,
  months,
  onClose,
  onPick,
}: {
  monthValue?: string;
  months: ReadonlyArray<{ value: string; label: string }>;
  onClose: () => void;
  onPick: (value: string) => void;
}) {
  return (
    <ModalSheet open onClose={onClose} ariaLabel="Pasirinkti mėnesį">
      <h2 className="px-1 pb-3 text-[15px] font-semibold tracking-[-0.012em] text-ink-900/90">
        Pasirinkti mėnesį
      </h2>
      <ul className="flex flex-col pb-2">
        {months.map((m) => {
          const selected = m.value === monthValue;
          return (
            <li key={m.value}>
              <button
                type="button"
                onClick={() => onPick(m.value)}
                className={`flex w-full items-center justify-between rounded-[12px] px-3 py-3 text-left text-[15px] font-medium tracking-[-0.012em] transition-colors hover:bg-cream/60 ${
                  selected ? "text-accent-deep" : "text-ink-900/90"
                }`}
              >
                <span>{m.label}</span>
                {selected ? <Check /> : null}
              </button>
            </li>
          );
        })}
      </ul>
    </ModalSheet>
  );
}

function Check() {
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
      className="text-accent-deep"
    >
      <path d="M5 12l5 5 9-11" />
    </svg>
  );
}
