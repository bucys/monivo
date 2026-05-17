"use client";

import type { ActivityKind } from "@/lib/activity";

export type PillCounts = Record<ActivityKind, number>;

const ITEMS: ReadonlyArray<{ id: ActivityKind; label: string }> = [
  { id: "all", label: "Visi" },
  { id: "income", label: "Pajamos" },
  { id: "expense", label: "Išlaidos" },
];

export function ActivityFilters({
  value,
  onChange,
  counts,
}: {
  value: ActivityKind;
  onChange: (k: ActivityKind) => void;
  counts: PillCounts;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 lg:gap-2.5">
      {ITEMS.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
              active
                ? "bg-ink-900 text-white"
                : "border border-hair bg-white text-ink-900/90 shadow-[0_1px_2px_rgba(23,33,29,0.04),_0_8px_24px_rgba(23,33,29,0.05)] hover:bg-cream/60"
            }`}
          >
            <span>{item.label}</span>
            <span
              className={`hidden rounded-full px-2 py-[2px] text-[11px] font-semibold lg:inline-flex ${
                active
                  ? "bg-white/20 text-white"
                  : "bg-cream text-ink-500"
              }`}
            >
              {counts[item.id]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
