import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type SectionHeaderProps = {
  title: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function SectionHeader({ title, action, className }: SectionHeaderProps) {
  return (
    <header
      className={cn("flex items-center justify-between px-1 py-2", className)}
    >
      <h2 className="text-h2 text-ink-900">{title}</h2>
      {action ? <div>{action}</div> : null}
    </header>
  );
}
