"use client";

import { useEffect, useState } from "react";
import { ModalSheet } from "@/components/ui/modal-sheet";
import { useT } from "@/i18n/locale-provider";
import { ExpenseForm } from "./expense-form";
import { IncomeForm, type ServiceChip } from "./income-form";

const OPEN_INCOME_EVENT = "monivo:open-income-entry";
const OPEN_EXPENSE_EVENT = "monivo:open-expense-entry";

export function dispatchOpenIncomeEntry(serviceId?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(OPEN_INCOME_EVENT, {
      detail: serviceId ? { serviceId } : undefined,
    }),
  );
}

export function dispatchOpenExpenseEntry() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_EXPENSE_EVENT));
}

type Mode = "income" | "expense" | null;

export function AddEntrySheet({
  services,
  canWrite,
}: {
  services: ReadonlyArray<ServiceChip>;
  canWrite: boolean;
}) {
  const t = useT();
  const [mode, setMode] = useState<Mode>(null);
  const [presetServiceId, setPresetServiceId] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!canWrite) return;
    const openIncome = (e: Event) => {
      const detail = (e as CustomEvent<{ serviceId?: string }>).detail;
      setPresetServiceId(detail?.serviceId ?? null);
      setMode("income");
    };
    const openExpense = () => {
      setPresetServiceId(null);
      setMode("expense");
    };
    window.addEventListener(OPEN_INCOME_EVENT, openIncome);
    window.addEventListener(OPEN_EXPENSE_EVENT, openExpense);
    return () => {
      window.removeEventListener(OPEN_INCOME_EVENT, openIncome);
      window.removeEventListener(OPEN_EXPENSE_EVENT, openExpense);
    };
  }, [canWrite]);

  useEffect(() => {
    if (!justAdded) return;
    const t = window.setTimeout(() => setJustAdded(false), 1500);
    return () => window.clearTimeout(t);
  }, [justAdded]);

  const close = () => setMode(null);
  const onAdded = () => {
    setMode(null);
    setJustAdded(true);
  };

  const ariaLabel =
    mode === "expense"
      ? t.addEntry.expense.sheetTitle
      : t.addEntry.income.sheetTitle;

  return (
    <>
      <ModalSheet
        open={mode !== null}
        onClose={close}
        ariaLabel={ariaLabel}
        closeLabel={t.common.close}
      >
        {mode === "income" ? (
          <IncomeForm
            key={presetServiceId ?? "no-preset"}
            services={services}
            onAdded={onAdded}
            initialServiceId={presetServiceId}
          />
        ) : mode === "expense" ? (
          <ExpenseForm onAdded={onAdded} />
        ) : null}
      </ModalSheet>

      {justAdded ? (
        <div
          role="status"
          className="pointer-events-none fixed bottom-[112px] left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink-900/90 px-4 py-2 text-[13px] font-medium text-white shadow-card lg:bottom-8"
        >
          {t.addEntry.fab.addedToast}
        </div>
      ) : null}
    </>
  );
}

