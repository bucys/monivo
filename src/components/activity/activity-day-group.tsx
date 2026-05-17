import { formatEur } from "@/lib/format";
import { DesktopActivityRow } from "./activity-row-desktop";
import { MobileActivityRow } from "./activity-row";
import type { DayGroup } from "@/lib/activity";

export function ActivityDayGroup({
  group,
  label,
}: {
  group: DayGroup;
  label: string;
}) {
  return (
    <div>
      <MobileGroup group={group} label={label} />
      <DesktopGroup group={group} label={label} />
    </div>
  );
}

function MobileGroup({ group, label }: { group: DayGroup; label: string }) {
  return (
    <div className="lg:hidden">
      <DayHeader
        label={label}
        incomeCents={group.incomeCents}
        expenseCents={group.expenseCents}
        className="mb-2.5 flex items-baseline justify-between px-1"
      />
      <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_1px_2px_rgba(23,33,29,0.04),_0_8px_24px_rgba(23,33,29,0.05)]">
        {group.entries.map((e, i, arr) => (
          <MobileActivityRow key={e.id} entry={e} last={i === arr.length - 1} />
        ))}
      </div>
    </div>
  );
}

function DesktopGroup({ group, label }: { group: DayGroup; label: string }) {
  return (
    <div className="hidden overflow-hidden rounded-[22px] bg-white shadow-[0_1px_2px_rgba(23,33,29,0.04),_0_8px_24px_rgba(23,33,29,0.05)] lg:block">
      <DayHeader
        label={label}
        incomeCents={group.incomeCents}
        expenseCents={group.expenseCents}
        className="flex items-center justify-between border-b border-hair bg-cream/60 px-[22px] py-3.5"
      />
      {group.entries.map((e, i, arr) => (
        <DesktopActivityRow key={e.id} entry={e} last={i === arr.length - 1} />
      ))}
    </div>
  );
}

function DayHeader({
  label,
  incomeCents,
  expenseCents,
  className,
}: {
  label: string;
  incomeCents: number;
  expenseCents: number;
  className: string;
}) {
  const incomeText = formatEur(incomeCents).replace(/\s?€/, "");
  const expenseText = formatEur(expenseCents).replace(/\s?€/, "").replace("−", "");
  return (
    <div className={className}>
      <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-ink-500">
        {label}
      </span>
      <span className="text-[12px] font-medium text-ink-500 tabular-nums">
        <span className="font-semibold text-[#1F7A4B]">+{incomeText}</span>
        <span className="mx-1.5">·</span>
        <span className="font-semibold text-[#A03A3A]">−{expenseText}</span>
        <span className="ml-1.5">€</span>
      </span>
    </div>
  );
}
