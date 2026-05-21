"use client";

import { useT } from "@/i18n/locale-provider";
import { ModalSheet } from "@/components/ui/modal-sheet";

export function ActivityRowActions({
  open,
  onClose,
  onEdit,
  onDelete,
}: {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const t = useT();
  return (
    <ModalSheet
      open={open}
      onClose={onClose}
      ariaLabel={t.activity.actions.menuAria}
      closeLabel={t.common.close}
    >
      <ul className="flex flex-col pb-1">
        <li>
          <button
            type="button"
            onClick={onEdit}
            className="flex w-full items-center gap-3 rounded-[12px] px-3 py-3.5 text-left text-[15px] font-medium tracking-[-0.012em] text-ink-900/90 transition-colors hover:bg-cream/60"
          >
            <PencilIcon />
            {t.activity.actions.edit}
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={onDelete}
            className="flex w-full items-center gap-3 rounded-[12px] px-3 py-3.5 text-left text-[15px] font-medium tracking-[-0.012em] text-expense transition-colors hover:bg-expense-bg/60"
          >
            <TrashIcon />
            {t.activity.actions.delete}
          </button>
        </li>
      </ul>
    </ModalSheet>
  );
}

function PencilIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    </svg>
  );
}
