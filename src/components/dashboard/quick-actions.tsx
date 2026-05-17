"use client";

import Link from "next/link";
import { dispatchOpenIncomeEntry } from "@/components/add-entry/add-entry-sheet";
import { useT } from "@/i18n/locale-provider";

export type QuickService = {
  id: string;
  name: string;
  price_cents: number;
};

const TONE_PALETTE = [
  "#DDF4EC",
  "#FFE7E7",
  "#FFF2D9",
  "#E5E0F4",
  "#F4E5DC",
];

function toneFor(id: string, index: number) {
  const fallback = TONE_PALETTE[index % TONE_PALETTE.length]!;
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return TONE_PALETTE[Math.abs(hash) % TONE_PALETTE.length] ?? fallback;
}

export function QuickActions({
  services,
  canWrite,
}: {
  services: ReadonlyArray<QuickService>;
  canWrite: boolean;
}) {
  const t = useT();
  const top = services.slice(0, 5);

  return (
    <section
      aria-label={t.dashboard.quickActions}
      className="flex h-full flex-col rounded-[20px] bg-white p-6 shadow-[0_1px_2px_rgba(23,33,29,0.04),_0_8px_24px_rgba(23,33,29,0.05)]"
    >
      <div className="mb-3.5 flex items-baseline justify-between gap-3">
        <h2 className="text-[14px] font-semibold tracking-[-0.012em] text-ink-900/90">
          {t.dashboard.quickActions}
        </h2>
        <span className="text-[11px] font-medium text-ink-500">
          {t.dashboard.quickActionsHint}
        </span>
      </div>

      {top.length === 0 ? (
        <EmptyState canWrite={canWrite} />
      ) : (
        <ul className="flex flex-col gap-2">
          {top.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => canWrite && dispatchOpenIncomeEntry(s.id)}
                disabled={!canWrite}
                className="group flex w-full items-center gap-3 rounded-[14px] border border-hair bg-cream px-3.5 py-[11px] text-left transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-cream"
              >
                <span
                  aria-hidden
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-[12px] font-bold tracking-[-0.012em] text-ink-900/90"
                  style={{ background: toneFor(s.id, i) }}
                >
                  +{Math.round(s.price_cents / 100)}
                </span>
                <span className="flex-1 truncate text-[14px] font-medium tracking-[-0.006em] text-ink-900/90">
                  {s.name}
                </span>
                <Chevron />
              </button>
            </li>
          ))}
          <li>
            <Link
              href="/services"
              className="flex items-center justify-between rounded-[14px] px-3.5 py-2.5 text-[12px] font-medium text-ink-500 transition-colors hover:text-ink-900/90"
            >
              {t.dashboard.quickActionsAllLink}
              <Chevron />
            </Link>
          </li>
        </ul>
      )}
    </section>
  );
}

function EmptyState({ canWrite }: { canWrite: boolean }) {
  const t = useT();
  return (
    <div className="flex flex-1 flex-col items-start justify-center gap-4 rounded-[14px] bg-cream/60 p-5">
      <div>
        <p className="text-[13px] font-medium text-ink-900/90">
          {t.dashboard.quickActionsEmptyTitle}
        </p>
        <p className="mt-1 text-[12px] leading-[1.5] text-ink-500">
          {t.dashboard.quickActionsEmptyBody}
        </p>
      </div>
      {canWrite ? (
        <Link
          href="/services"
          className="rounded-full bg-accent px-4 py-2 text-[12px] font-semibold text-white shadow-fab transition-colors hover:bg-accent-deep"
        >
          {t.dashboard.quickActionsEmptyCta}
        </Link>
      ) : null}
    </div>
  );
}

function Chevron() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-ink-500"
      aria-hidden
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
