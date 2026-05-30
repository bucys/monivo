"use client";

import { ModalSheet } from "@/components/ui/modal-sheet";

/**
 * Shared month-selection modal. Lists the months that have data and lets the
 * user pick one. Used by both the Activity period selector and the Insights
 * month selector so the picker UI / month list stay identical across the app.
 */
export function MonthPicker({
  monthValue,
  months,
  title,
  emptyLabel,
  closeLabel,
  onClose,
  onPick,
}: {
  monthValue?: string;
  months: ReadonlyArray<{ value: string; label: string }>;
  title: string;
  emptyLabel: string;
  closeLabel: string;
  onClose: () => void;
  onPick: (value: string) => void;
}) {
  return (
    <ModalSheet open onClose={onClose} ariaLabel={title} closeLabel={closeLabel}>
      <h2 className="px-1 pb-3 text-[15px] font-semibold tracking-[-0.012em] text-ink-900/90">
        {title}
      </h2>
      {months.length === 0 ? (
        <p className="px-3 py-6 text-center text-[14px] text-ink-500">
          {emptyLabel}
        </p>
      ) : (
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
      )}
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
