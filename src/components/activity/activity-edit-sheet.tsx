"use client";

import { ModalSheet } from "@/components/ui/modal-sheet";
import {
  ExpenseForm,
  EXPENSE_CATEGORIES,
  type ExpenseInitial,
} from "@/components/add-entry/expense-form";
import {
  IncomeForm,
  type IncomeInitial,
  type ServiceChip,
} from "@/components/add-entry/income-form";
import type { RecentEntry } from "@/components/dashboard/recent-activity";

type CategorySlug = ExpenseInitial["category"];

const VALID_CATEGORIES = new Set<string>(
  EXPENSE_CATEGORIES.map((c) => c.slug),
);

export function ActivityEditSheet({
  entry,
  services,
  onClose,
  onSaved,
}: {
  entry: RecentEntry | null;
  services: ReadonlyArray<ServiceChip>;
  onClose: () => void;
  onSaved: () => void;
}) {
  const ariaLabel =
    entry?.kind === "expense" ? "Redaguoti išlaidas" : "Redaguoti pajamas";

  return (
    <ModalSheet open={entry !== null} onClose={onClose} ariaLabel={ariaLabel}>
      {entry?.kind === "income" ? (
        <div className="flex flex-col gap-4 pb-1">
          <h2 className="text-[20px] font-semibold tracking-[-0.022em] text-ink-900/90">
            Redaguoti pajamas
          </h2>
          <IncomeForm
            key={entry.id}
            mode="edit"
            entryId={entry.rawId}
            services={services}
            onAdded={onSaved}
            initial={incomeInitial(entry)}
          />
        </div>
      ) : entry?.kind === "expense" ? (
        <ExpenseForm
          key={entry.id}
          mode="edit"
          entryId={entry.rawId}
          onAdded={onSaved}
          initial={expenseInitial(entry)}
        />
      ) : null}
    </ModalSheet>
  );
}

function incomeInitial(entry: RecentEntry): IncomeInitial {
  return {
    amountCents: entry.amountCents,
    serviceId: entry.serviceId ?? null,
    paymentMethod: entry.paymentMethod ?? "cash",
    note: entry.note ?? null,
  };
}

function expenseInitial(entry: RecentEntry): ExpenseInitial {
  const slug = entry.categorySlug && VALID_CATEGORIES.has(entry.categorySlug)
    ? (entry.categorySlug as CategorySlug)
    : "other";
  return {
    amountCents: entry.amountCents,
    category: slug,
    note: entry.note ?? null,
  };
}
