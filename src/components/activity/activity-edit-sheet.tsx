"use client";

import { useT } from "@/i18n/locale-provider";
import { ModalSheet } from "@/components/ui/modal-sheet";
import {
  ExpenseForm,
  EXPENSE_CATEGORY_SLUGS,
  type ExpenseInitial,
} from "@/components/add-entry/expense-form";
import {
  IncomeForm,
  type IncomeInitial,
  type ServiceChip,
} from "@/components/add-entry/income-form";
import type { RecentEntry } from "@/components/dashboard/recent-activity";

type CategorySlug = ExpenseInitial["category"];

const VALID_CATEGORIES = new Set<string>(EXPENSE_CATEGORY_SLUGS);

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
  const t = useT();
  const ariaLabel =
    entry?.kind === "expense"
      ? t.activity.edit.expenseTitle
      : t.activity.edit.incomeTitle;

  return (
    <ModalSheet open={entry !== null} onClose={onClose} ariaLabel={ariaLabel}>
      {entry?.kind === "income" ? (
        <div className="flex flex-col gap-4 pb-1">
          <h2 className="text-[20px] font-semibold tracking-[-0.022em] text-ink-900/90">
            {t.activity.edit.incomeTitle}
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
