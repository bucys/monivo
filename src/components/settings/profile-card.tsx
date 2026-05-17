"use client";

import { useState } from "react";
import { ModalSheet } from "@/components/ui/modal-sheet";
import { DisplayNameField } from "./profile-form";
import { IconChevron } from "./settings-icons";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "M";
  return parts
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

export function ProfileCard({
  displayName,
  subline,
  editLabel,
}: {
  displayName: string;
  subline: string;
  editLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const visibleName = displayName.trim() || "—";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3.5 rounded-[22px] bg-white p-[18px] text-left shadow-[0_1px_2px_rgba(23,33,29,0.04),_0_8px_24px_rgba(23,33,29,0.05)] transition-colors hover:bg-white active:bg-cream/40"
      >
        <span
          aria-hidden
          className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-hair text-[18px] font-semibold text-accent-deep"
          style={{ background: "linear-gradient(135deg, #DDF4EC, #C9EBDF)" }}
        >
          {initials(displayName)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[16px] font-semibold tracking-[-0.012em] text-ink-900/90">
            {visibleName}
          </span>
          <span className="mt-0.5 block truncate text-[12px] text-ink-500">
            {subline}
          </span>
        </span>
        <span className="text-ink-500">
          <IconChevron />
        </span>
      </button>

      <ModalSheet open={open} onClose={() => setOpen(false)} ariaLabel={editLabel}>
        <h2 className="px-1 pb-3 text-[15px] font-semibold tracking-[-0.012em] text-ink-900/90">
          {editLabel}
        </h2>
        <div className="pb-2">
          <DisplayNameField initial={displayName} onDone={() => setOpen(false)} />
        </div>
      </ModalSheet>
    </>
  );
}
