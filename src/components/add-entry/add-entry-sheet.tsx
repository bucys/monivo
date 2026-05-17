"use client";

import { useEffect, useState } from "react";
import { ModalSheet } from "@/components/ui/modal-sheet";
import { ExpenseForm } from "./expense-form";
import { IncomeForm, type ServiceChip } from "./income-form";

const OPEN_INCOME_EVENT = "monivo:open-income-entry";
const OPEN_EXPENSE_EVENT = "monivo:open-expense-entry";

export function dispatchOpenIncomeEntry() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_INCOME_EVENT));
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
  const [mode, setMode] = useState<Mode>(null);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!canWrite) return;
    const openIncome = () => setMode("income");
    const openExpense = () => setMode("expense");
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
    mode === "expense" ? "Pridėti išlaidą" : "Pridėti pajamas";

  return (
    <>
      <ModalSheet open={mode !== null} onClose={close} ariaLabel={ariaLabel}>
        {mode === "income" ? (
          <IncomeForm services={services} onAdded={onAdded} />
        ) : mode === "expense" ? (
          <ExpenseForm onAdded={onAdded} />
        ) : null}
      </ModalSheet>

      {justAdded ? (
        <div
          role="status"
          className="pointer-events-none fixed bottom-[112px] left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink-900/90 px-4 py-2 text-[13px] font-medium text-white shadow-card lg:bottom-8"
        >
          Pridėta ✓
        </div>
      ) : null}
    </>
  );
}

