import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type StatCardProps = {
  label: ReactNode;
  value: ReactNode;
  className?: string;
};

export function StatCard({ label, value, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col gap-1 rounded-lg bg-white p-4 shadow-card",
        className,
      )}
    >
      <span className="text-caption text-ink-500">{label}</span>
      <span className="text-h2 text-ink-900 tabular-nums">{value}</span>
    </div>
  );
}
