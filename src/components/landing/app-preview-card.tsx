import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type AppPreviewCardProps = {
  label?: ReactNode;
  value?: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function AppPreviewCard({
  label,
  value,
  footer,
  className,
}: AppPreviewCardProps) {
  return (
    <div className={cn("rounded-lg bg-white p-4 shadow-card", className)}>
      {label ? (
        <div className="text-caption text-ink-500">{label}</div>
      ) : null}
      {value ? (
        <div className="mt-1 text-h1 text-ink-900 tabular-nums">{value}</div>
      ) : null}
      {footer ? (
        <div className="mt-2 text-caption text-ink-500">{footer}</div>
      ) : null}
    </div>
  );
}
