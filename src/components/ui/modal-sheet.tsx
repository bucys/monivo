"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { useChromeBlocker } from "@/components/app/ui-chrome";
import { cn } from "@/lib/cn";

export type ModalSheetProps = {
  open: boolean;
  onClose: () => void;
  ariaLabel: string;
  closeLabel: string;
  children: ReactNode;
};

export function ModalSheet({
  open,
  onClose,
  ariaLabel,
  closeLabel,
  children,
}: ModalSheetProps) {
  // Suppresses chrome (FAB, etc.) while open — see ui-chrome.tsx.
  useChromeBlocker(open);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  // Auto-close on navigation: record the pathname when the sheet opens and
  // close as soon as it changes. Guarantees overlays don't survive a route
  // transition (e.g. tapping a link inside the sheet), so every consumer
  // gets this for free without wiring up a router listener.
  const pathname = usePathname();
  const openedAtPath = useRef<string | null>(null);
  useEffect(() => {
    if (!open) {
      openedAtPath.current = null;
      return;
    }
    if (openedAtPath.current === null) {
      openedAtPath.current = pathname;
      return;
    }
    if (pathname !== openedAtPath.current) {
      onClose();
    }
  }, [open, pathname, onClose]);

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-50",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      <button
        type="button"
        aria-label={closeLabel}
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-inverse/40 transition-opacity duration-200 ease-out",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={cn(
          "absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-xl bg-surface pb-[env(safe-area-inset-bottom)] shadow-hero transition-transform duration-200 ease-out",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div aria-hidden className="mx-auto mt-3 h-1 w-10 rounded-full bg-ink-300" />
        <div className="px-5 pb-5 pt-3">{children}</div>
      </div>
    </div>
  );
}
