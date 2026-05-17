"use client";

import { dispatchOpenIncomeEntry } from "@/components/add-entry/add-entry-sheet";

export function EmptyPrompt({ canWrite }: { canWrite: boolean }) {
  return (
    <section className="flex flex-col items-center rounded-[24px] border border-hair bg-white/70 px-6 py-12 text-center sm:py-14">
      <span
        aria-hidden
        className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent-deep"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <path d="M12 6v12M6 12h12" />
        </svg>
      </span>
      <h2 className="mt-5 text-[18px] font-semibold tracking-[-0.018em] text-ink-900/90">
        Dar tuščia.
      </h2>
      <p className="mt-2 max-w-[320px] text-[13px] leading-[1.55] text-ink-500">
        Pridėk pirmas pajamas — pamatysi, kiek lieka po mokesčių.
      </p>
      {canWrite ? (
        <button
          type="button"
          onClick={() => dispatchOpenIncomeEntry()}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[13px] font-semibold text-white shadow-fab transition-colors hover:bg-accent-deep"
        >
          Pridėti pajamas
        </button>
      ) : (
        <p className="mt-6 rounded-[12px] bg-accent-soft/60 px-3.5 py-2.5 text-[12px] text-accent-deep">
          Įrašyti naujus pajamas galėsi, kai prenumerata bus aktyvi.
        </p>
      )}
    </section>
  );
}
