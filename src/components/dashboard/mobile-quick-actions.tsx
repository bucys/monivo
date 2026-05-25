"use client";

import Link from "next/link";
import { dispatchOpenIncomeEntry } from "@/components/add-entry/add-entry-sheet";
import { useT } from "@/i18n/locale-provider";
import type { QuickService } from "./quick-actions";

const TONE_PALETTE = ["#DDF4EC", "#FFE7E7", "#FFF2D9", "#E5E0F4", "#F4E5DC"];

function toneFor(id: string, index: number) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return (
    TONE_PALETTE[Math.abs(hash) % TONE_PALETTE.length] ??
    TONE_PALETTE[index % TONE_PALETTE.length]!
  );
}

export function MobileQuickActions({
  services,
  canWrite,
}: {
  services: ReadonlyArray<QuickService>;
  canWrite: boolean;
}) {
  const t = useT();
  if (services.length === 0) return null;

  return (
    <section aria-label={t.dashboard.quickActions} className="lg:hidden">
      <div className="mb-3 flex items-center justify-between px-0.5">
        <h2 className="text-[14px] font-semibold tracking-[-0.012em] text-ink-900/90">
          {t.dashboard.quickActions}
        </h2>
        <Link
          href="/services"
          className="text-[13px] font-medium text-accent"
        >
          {t.dashboard.quickActionsSeeAll}
        </Link>
      </div>
      <div className="-mx-5 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ul className="flex w-max gap-2.5">
          {services.map((s, i) => (
            <li key={s.id}>
              <Chip
                service={s}
                tone={toneFor(s.id, i)}
                disabled={!canWrite}
              />
            </li>
          ))}
          <li>
           
          </li>
        </ul>
      </div>
    </section>
  );
}

function Chip({
  service,
  tone,
  disabled,
}: {
  service: QuickService;
  tone: string;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => !disabled && dispatchOpenIncomeEntry(service.id)}
      disabled={disabled}
      className="flex shrink-0 items-center gap-2.5 rounded-full border border-hair bg-surface py-3 pl-2 pr-4 text-[14px] font-medium text-ink-900/90 shadow-[0_1px_2px_rgba(23,33,29,0.04),_0_8px_24px_rgba(23,33,29,0.05)] transition-transform active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span
        aria-hidden
        className="flex h-[26px] min-w-[26px] items-center justify-center rounded-full px-2 text-[11px] font-semibold tracking-[-0.012em] text-inverse"
        style={{ background: tone }}
      >
        +{Math.round(service.price_cents / 100)}
      </span>
      <span className="whitespace-nowrap">{service.name}</span>
    </button>
  );
}


