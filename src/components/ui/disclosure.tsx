"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Disclosure({
  label,
  labelOpen,
  children,
  className,
}: {
  label: string;
  labelOpen?: string;
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("flex flex-col gap-[18px] lg:gap-[22px]", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1.5 text-[13px] font-medium text-ink-500 transition-colors hover:bg-cream/60 hover:text-ink-900/90"
      >
        <span>{open ? labelOpen ?? label : label}</span>
        <span
          aria-hidden
          className={cn(
            "transition-transform duration-200 ease-out",
            open ? "rotate-180" : "rotate-0",
          )}
        >
          <Chevron />
        </span>
      </button>
      {open ? <>{children}</> : null}
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
