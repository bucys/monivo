"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { ServiceChip } from "@/components/add-entry/income-form";
import type { RecentEntry } from "@/components/dashboard/recent-activity";
import { useLocale } from "@/i18n/locale-provider";
import {
  dayLabel,
  filterEntries,
  groupByDay,
  type ActivityKind,
  type MonthOption,
  type PeriodMode,
} from "@/lib/activity";
import { ActivityDayGroup } from "./activity-day-group";
import { ActivityDeleteConfirm } from "./activity-delete-confirm";
import { ActivityEditSheet } from "./activity-edit-sheet";
import { ActivityEmpty } from "./activity-empty";
import { ActivityFilters, type PillCounts } from "./activity-filters";
import { ActivityPeriod } from "./activity-period";
import { ActivityRowActions } from "./activity-row-actions";

export function ActivityFeed({
  entries,
  periodMode,
  periodLabel,
  monthValue,
  availableMonths,
  services,
  canWrite,
}: {
  entries: ReadonlyArray<RecentEntry>;
  periodMode: PeriodMode;
  periodLabel: string;
  monthValue?: string;
  availableMonths: ReadonlyArray<MonthOption>;
  services: ReadonlyArray<ServiceChip>;
  canWrite: boolean;
}) {
  const router = useRouter();
  const { t, locale } = useLocale();
  const [kind, setKind] = useState<ActivityKind>("all");
  const [actionsEntry, setActionsEntry] = useState<RecentEntry | null>(null);
  const [editingEntry, setEditingEntry] = useState<RecentEntry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<RecentEntry | null>(null);

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
  const openActions = canWrite ? setActionsEntry : undefined;

  const handleEdit = () => {
    if (!actionsEntry) return;
    setEditingEntry(actionsEntry);
    setActionsEntry(null);
  };
  const handleDelete = () => {
    if (!actionsEntry) return;
    setDeletingEntry(actionsEntry);
    setActionsEntry(null);
  };
  const onSaved = () => {
    setEditingEntry(null);
    router.refresh();
  };
  const onDeleted = () => {
    setDeletingEntry(null);
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-[18px] lg:gap-[22px]">
      <div className="lg:hidden">
        <p className="text-[13px] font-medium tracking-[0.01em] text-ink-500">
          {periodLabel}
        </p>
        <h1 className="mt-0.5 text-[28px] font-semibold leading-tight tracking-[-0.028em] text-ink-900/95">
          {t.activity.title}
        </h1>
      </div>

      <div className="flex flex-col gap-3">
        <ActivityPeriod
          mode={periodMode}
          monthValue={monthValue}
          months={availableMonths}
        />
        <ActivityFilters value={kind} onChange={setKind} counts={counts} />
      </div>

      {showEmpty ? (
        <ActivityEmpty
          periodMode={periodMode}
          filtered={hasAny}
          onReset={hasAny ? () => setKind("all") : undefined}
        />
      ) : (
        groups.map((group) => (
          <ActivityDayGroup
            key={group.date}
            group={group}
            label={dayLabel(group.date, locale, t.activity.day)}
            onActions={openActions}
          />
        ))
      )}

      <ActivityRowActions
        open={actionsEntry !== null}
        onClose={() => setActionsEntry(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <ActivityEditSheet
        entry={editingEntry}
        services={services}
        onClose={() => setEditingEntry(null)}
        onSaved={onSaved}
      />
      <ActivityDeleteConfirm
        entry={deletingEntry}
        onClose={() => setDeletingEntry(null)}
        onDeleted={onDeleted}
      />
    </div>
  );
}
