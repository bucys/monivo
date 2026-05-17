"use client";

import { useMemo, useState } from "react";
import type { RecentEntry } from "@/components/dashboard/recent-activity";
import {
  dayLabel,
  filterEntries,
  groupByDay,
  type ActivityKind,
} from "@/lib/activity";
import { ActivityDayGroup } from "./activity-day-group";
import { ActivityEmpty } from "./activity-empty";
import { ActivityFilters, type PillCounts } from "./activity-filters";

export function ActivityFeed({
  entries,
}: {
  entries: ReadonlyArray<RecentEntry>;
}) {
  const [kind, setKind] = useState<ActivityKind>("all");

  const counts = useMemo<PillCounts>(() => {
    let income = 0;
    let expense = 0;
    for (const e of entries) {
      if (e.kind === "income") income += 1;
      else expense += 1;
    }
    return { all: entries.length, income, expense };
  }, [entries]);

  const groups = useMemo(
    () => groupByDay(filterEntries(entries, kind)),
    [entries, kind],
  );

  const hasAny = entries.length > 0;
  const showEmpty = groups.length === 0;

  return (
    <div className="flex flex-col gap-[18px] lg:gap-[22px]">
      <div className="lg:hidden">
        <p className="text-[13px] font-medium tracking-[0.01em] text-ink-500">
          Šis mėnuo
        </p>
        <h1 className="mt-0.5 text-[28px] font-semibold leading-tight tracking-[-0.028em] text-ink-900/95">
          Veikla
        </h1>
      </div>

      <ActivityFilters value={kind} onChange={setKind} counts={counts} />

      {showEmpty ? (
        <ActivityEmpty
          filtered={hasAny}
          onReset={hasAny ? () => setKind("all") : undefined}
        />
      ) : (
        groups.map((group) => (
          <ActivityDayGroup
            key={group.date}
            group={group}
            label={dayLabel(group.date)}
          />
        ))
      )}
    </div>
  );
}
