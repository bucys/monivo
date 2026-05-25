import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isSelected?: boolean;
  children: ReactNode;
};

export function Chip({
  isSelected,
  className,
  type = "button",
  children,
  ...rest
}: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={isSelected}
      className={cn(
        "inline-flex min-h-10 items-center rounded-sm px-3 text-body-strong transition-colors",
        isSelected
          ? "bg-accent-soft text-accent"
          : "border border-ink-300 bg-surface text-ink-900",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
