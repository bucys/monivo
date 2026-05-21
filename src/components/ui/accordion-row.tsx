"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Compact accordion row. Whole header is the click target. The body uses the
 * grid-rows trick for a smooth height transition without measuring layout.
 *
 * Keyboard-accessible via the underlying <button>; aria-expanded reflects state.
 */
export function AccordionRow({
  header,
  children,
  trailing,
  initialOpen = false,
  rounded = "rounded-[14px]",
  className,
}: {
  header: ReactNode;
  children: ReactNode;
  trailing?: ReactNode;
  initialOpen?: boolean;
  rounded?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(initialOpen);
  return (
    <div
      className={cn(
        rounded,
        "border transition-colors duration-200",
        open
          ? "border-hair/80 bg-cream/50"
          : "border-transparent bg-transparent",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "flex w-full items-center gap-3 px-3.5 py-2.5 text-left",
          rounded,
          "transition-colors hover:bg-cream/40 active:bg-cream/60",
        )}
      >
        <span className="flex-1 min-w-0">{header}</span>
        {trailing ? (
          <span className="shrink-0 text-[13px] tabular-nums">{trailing}</span>
        ) : null}
        <span
          aria-hidden
          className={cn(
            "shrink-0 text-ink-500 transition-transform duration-200 ease-out",
            open ? "rotate-180" : "rotate-0",
          )}
        >
          <Chevron />
        </span>
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="px-3.5 pb-3 pt-0 text-[12.5px] leading-[1.55] text-ink-500">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function Chevron() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
