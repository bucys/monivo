"use client";

import { useState } from "react";
import { ModalSheet } from "@/components/ui/modal-sheet";
import { Button } from "@/components/ui/button";
import {
  deleteExpenseEntry,
  deleteIncomeEntry,
} from "@/app/(app)/entries/actions";
import type { RecentEntry } from "@/components/dashboard/recent-activity";

export function ActivityDeleteConfirm({
  entry,
  onClose,
  onDeleted,
}: {
  entry: RecentEntry | null;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirm = async () => {
    if (!entry || pending) return;
    setPending(true);
    setError(null);
    try {
      if (entry.kind === "income") await deleteIncomeEntry(entry.rawId);
      else await deleteExpenseEntry(entry.rawId);
      onDeleted();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Įvyko klaida");
    } finally {
      setPending(false);
    }
  };

  return (
    <ModalSheet
      open={entry !== null}
      onClose={pending ? () => {} : onClose}
      ariaLabel="Ištrinti įrašą"
    >
      <div className="flex flex-col gap-4 pb-1">
        <div>
          <h2 className="text-[18px] font-semibold tracking-[-0.018em] text-ink-900/90">
            Ištrinti įrašą?
          </h2>
          <p className="mt-1.5 text-[13px] leading-[1.5] text-ink-500">
            Šio veiksmo atšaukti nepavyks.
          </p>
        </div>
        {error ? (
          <p className="rounded-[12px] bg-expense-bg px-3.5 py-2.5 text-[13px] text-expense">
            {error}
          </p>
        ) : null}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={pending}
            className="!h-auto !flex-1 !rounded-[14px] !px-5 !py-3 !text-[14px]"
          >
            Atšaukti
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={confirm}
            isLoading={pending}
            className="!h-auto !flex-1 !rounded-[14px] !px-5 !py-3 !text-[14px]"
          >
            Ištrinti
          </Button>
        </div>
      </div>
    </ModalSheet>
  );
}
