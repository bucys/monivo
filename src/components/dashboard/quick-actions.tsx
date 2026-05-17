"use client";

import {
  dispatchOpenExpenseEntry,
  dispatchOpenIncomeEntry,
} from "@/components/add-entry/add-entry-sheet";

export function QuickActions({ canWrite }: { canWrite: boolean }) {
  return (
    <section
      aria-label="Greiti veiksmai"
      className="flex h-full flex-col rounded-[24px] border border-hair bg-white p-6 lg:p-7"
    >
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-500">
        Greiti veiksmai
      </h2>
      <div className="mt-4 flex flex-col gap-2.5">
        <button
          type="button"
          onClick={() => dispatchOpenIncomeEntry()}
          disabled={!canWrite}
          className="flex items-center gap-2.5 rounded-[14px] bg-accent px-4 py-3 text-[14px] font-semibold text-white shadow-fab transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span
            aria-hidden
            className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-white/20 text-[14px] font-bold"
          >
            +
          </span>
          Pridėti pajamas
        </button>
        <button
          type="button"
          onClick={() => dispatchOpenExpenseEntry()}
          disabled={!canWrite}
          className="flex items-center gap-2.5 rounded-[14px] border border-hair bg-white px-4 py-3 text-[14px] font-semibold text-ink-900/90 transition-colors hover:border-expense/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span
            aria-hidden
            className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-expense-bg text-[14px] font-bold text-expense"
          >
            −
          </span>
          Pridėti išlaidas
        </button>
      </div>
      {!canWrite ? (
        <p className="mt-4 text-[12px] text-ink-500">
          Įrašyti galėsi, kai prenumerata bus aktyvi.
        </p>
      ) : null}
    </section>
  );
}
