"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  createExpenseEntry,
  updateExpenseEntry,
} from "@/app/(app)/entries/actions";
import { Button } from "@/components/ui/button";

type CategorySlug =
  | "supplies"
  | "rent"
  | "marketing"
  | "education"
  | "equipment"
  | "other";

export const EXPENSE_CATEGORIES: ReadonlyArray<{
  slug: CategorySlug;
  label: string;
}> = [
  { slug: "supplies", label: "Priemonės" },
  { slug: "rent", label: "Nuoma" },
  { slug: "marketing", label: "Marketingas" },
  { slug: "education", label: "Mokymai" },
  { slug: "equipment", label: "Įranga" },
  { slug: "other", label: "Kita" },
];

export type ExpenseInitial = {
  amountCents: number;
  category: CategorySlug;
  note: string | null;
};

function centsToInput(cents: number) {
  return (cents / 100).toFixed(2).replace(".", ",");
}

function cleanAmount(raw: string) {
  const normalized = raw.replace(/[^\d.,]/g, "").replace(/\./g, ",");
  const first = normalized.indexOf(",");
  if (first === -1) return normalized;
  return (
    normalized.slice(0, first + 1) +
    normalized.slice(first + 1).replace(/,/g, "").slice(0, 2)
  );
}

export function ExpenseForm({
  onAdded,
  mode = "create",
  entryId,
  initial,
}: {
  onAdded: () => void;
  mode?: "create" | "edit";
  entryId?: string;
  initial?: ExpenseInitial;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState(
    initial ? centsToInput(initial.amountCents) : "",
  );
  const [category, setCategory] = useState<CategorySlug | null>(
    initial?.category ?? null,
  );
  const [noteOpen, setNoteOpen] = useState(Boolean(initial?.note));
  const [note, setNote] = useState(initial?.note ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const parsedAmount = Number(amount.replace(",", "."));
  const submitDisabled =
    pending ||
    amount === "" ||
    !Number.isFinite(parsedAmount) ||
    parsedAmount <= 0 ||
    category === null;

  const submit = () => {
    if (submitDisabled || !category) return;
    setError(null);
    const fd = new FormData();
    fd.set("amount", amount);
    fd.set("category", category);
    if (noteOpen && note.trim() !== "") fd.set("note", note.trim());

    startTransition(async () => {
      try {
        if (mode === "edit" && entryId) {
          await updateExpenseEntry(entryId, fd);
        } else {
          await createExpenseEntry(fd);
          setAmount("");
          setCategory(null);
          setNoteOpen(false);
          setNote("");
        }
        router.refresh();
        onAdded();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Įvyko klaida");
      }
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex flex-col gap-5"
    >
      <h2 className="text-[20px] font-semibold tracking-[-0.022em] text-ink-900/90">
        {mode === "edit" ? "Redaguoti išlaidas" : "Pridėti išlaidas"}
      </h2>

      <label className="flex flex-col gap-2">
        <span className="text-[12px] font-medium text-ink-500">Suma</span>
        <div className="flex items-baseline rounded-[16px] border border-hair bg-white px-4 py-3 focus-within:border-expense focus-within:ring-2 focus-within:ring-expense/20">
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(cleanAmount(e.target.value))}
            placeholder="0,00"
            autoFocus
            className="w-full bg-transparent text-[32px] font-semibold leading-none tracking-[-0.02em] tabular-nums text-ink-900/90 placeholder:text-ink-300 focus:outline-none"
          />
          <span className="ml-2 text-[18px] font-medium text-ink-500">€</span>
        </div>
      </label>

      <div className="flex flex-col gap-2">
        <span className="text-[12px] font-medium text-ink-500">Kategorija</span>
        <div className="grid grid-cols-2 gap-2">
          {EXPENSE_CATEGORIES.map((c) => {
            const active = category === c.slug;
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => setCategory(c.slug)}
                aria-pressed={active}
                className={`rounded-[14px] border px-3.5 py-3 text-left text-[14px] font-medium transition-colors ${
                  active
                    ? "border-expense bg-expense-bg text-expense"
                    : "border-hair bg-white text-ink-700 hover:border-expense/40"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {noteOpen ? (
        <label className="flex flex-col gap-1.5 text-[12px] font-medium text-ink-500">
          Pastaba
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={200}
            placeholder="Nebūtina"
            className="rounded-[14px] border border-hair bg-white px-3.5 py-2.5 text-[14px] text-ink-900/90 placeholder:text-ink-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </label>
      ) : (
        <button
          type="button"
          onClick={() => setNoteOpen(true)}
          className="self-start rounded-[10px] px-2 py-1 text-[13px] font-medium text-ink-500 hover:text-ink-900/90"
        >
          + Pridėti pastabą
        </button>
      )}

      {error ? (
        <p className="rounded-[12px] bg-expense-bg px-3.5 py-2.5 text-[13px] text-expense">
          {error}
        </p>
      ) : null}

      <Button
        variant="primary"
        type="submit"
        isLoading={pending}
        disabled={submitDisabled}
        className="!h-auto !rounded-[14px] !px-5 !py-3 !text-[14px]"
      >
        {mode === "edit" ? "Išsaugoti" : "Pridėti išlaidas"}
      </Button>
    </form>
  );
}
