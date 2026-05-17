"use client";

import { dispatchOpenIncomeEntry } from "@/components/add-entry/add-entry-sheet";

export function EmptyPrompt({ canWrite }: { canWrite: boolean }) {
  return (
    <section className="flex flex-col items-center rounded-[24px] border border-hair bg-white px-6 py-10 text-center shadow-card">
      <h2 className="text-[18px] font-semibold tracking-[-0.018em] text-ink-900/90">
        Dar nepridėjai jokių įrašų.
      </h2>
      <p className="mt-2 max-w-[320px] text-[13px] leading-[1.55] text-ink-500">
        Pridėk pirmas pajamas — pamatysi, kiek lieka po mokesčių.
      </p>
      {canWrite ? (
        <button
          type="button"
          onClick={() => dispatchOpenIncomeEntry()}
          className="mt-5 inline-flex items-center gap-2 rounded-[14px] bg-accent px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-accent-deep"
        >
          <span aria-hidden className="text-[14px] leading-none">
            +
          </span>
          Pridėti pirmas pajamas
        </button>
      ) : (
        <p className="mt-5 rounded-[12px] bg-accent-soft/60 px-3.5 py-2.5 text-[12px] text-accent-deep">
          Įrašyti naujus pajamas galėsi, kai prenumerata bus aktyvi.
        </p>
      )}
    </section>
  );
}
