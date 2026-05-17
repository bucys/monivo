"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  dispatchOpenExpenseEntry,
  dispatchOpenIncomeEntry,
} from "@/components/add-entry/add-entry-sheet";

type NavGroup = {
  eyebrow: string;
  items: ReadonlyArray<{ label: string; href: string; icon: ReactNode }>;
};

const groups: ReadonlyArray<NavGroup> = [
  {
    eyebrow: "Naršyti",
    items: [
      { label: "Apžvalga", href: "/dashboard", icon: <HomeIcon /> },
      { label: "Veikla", href: "/activity", icon: <ActivityIcon /> },
      { label: "Įžvalgos", href: "/insights", icon: <InsightsIcon /> },
    ],
  },
  {
    eyebrow: "Verslas",
    items: [
      { label: "Paslaugos ir kainos", href: "/services", icon: <ServiceIcon /> },
      { label: "Nustatymai", href: "/settings", icon: <SettingsIcon /> },
    ],
  },
];

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:flex lg:h-dvh lg:w-[260px] lg:flex-col lg:gap-5 lg:overflow-y-auto lg:border-r lg:border-hair lg:bg-[#F4F1EA] lg:p-[22px]">
      <Link
        href="/dashboard"
        className="flex items-center gap-2.5 px-1.5"
        aria-label="Monivo"
      >
        <span
          aria-hidden
          className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-accent to-accent-deep text-[17px] font-bold leading-none tracking-tight text-white"
        >
          M
        </span>
        <span className="text-[17px] font-semibold tracking-tight text-ink-900">
          Monivo
        </span>
      </Link>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={dispatchOpenIncomeEntry}
          className="flex items-center gap-2.5 rounded-[14px] bg-accent px-3.5 py-3 text-[14px] font-semibold text-white shadow-fab transition-transform active:scale-[0.98]"
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
          onClick={dispatchOpenExpenseEntry}
          className="flex items-center gap-2.5 rounded-[14px] border border-hair bg-white px-3.5 py-3 text-[14px] font-medium text-ink-900/90"
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

      <nav aria-label="Šoninė navigacija" className="flex flex-col gap-5">
        {groups.map((group) => (
          <div key={group.eyebrow} className="flex flex-col gap-1">
            <span className="px-2.5 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-500">
              {group.eyebrow}
            </span>
            {group.items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-[14px] px-3.5 py-2.5 text-[14px] font-medium tracking-tight transition-colors ${
                    active
                      ? "bg-white text-ink-900/90 shadow-card"
                      : "text-ink-500 hover:bg-white/60 hover:text-ink-900/90"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`block h-5 w-5 ${active ? "text-accent" : "text-ink-500"}`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="flex-1" />

      {/* Tax reserve mini-card — visual stub; data wired later */}
      <div className="rounded-[16px] border border-hair bg-white p-3.5 shadow-card">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-ink-500">
          <span aria-hidden className="block h-1.5 w-1.5 rounded-full bg-[#E2B673]" />
          Mokesčių rezervas
        </div>
        <div className="mt-1.5 text-[18px] font-semibold tracking-tight text-ink-900/90">
          — <span className="text-[11px] font-medium text-ink-500">nuo pajamų</span>
        </div>
      </div>

      {/* Profile chip — visual stub; data wired later */}
      <Link
        href="/settings"
        className="flex items-center gap-2.5 rounded-[14px] border border-hair bg-transparent p-2 transition-colors hover:bg-white/60"
      >
        <span
          aria-hidden
          className="flex h-8 w-8 items-center justify-center rounded-full border border-hair bg-gradient-to-br from-accent-soft to-[#C9EBDF] text-[12px] font-semibold text-accent-deep"
        >
          —
        </span>
        <span className="flex flex-1 flex-col text-left">
          <span className="text-[13px] font-semibold text-ink-900/90">—</span>
          <span className="mt-0.5 text-[11px] text-ink-500">Individuali veikla</span>
        </span>
        <svg
          width="11"
          height="11"
          viewBox="0 0 11 11"
          fill="none"
          className="text-ink-500"
          aria-hidden
        >
          <path
            d="M3 4l2.5 2.5L8 4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </aside>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10.5V20h14v-9.5" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h13" />
      <path d="M4 12h13" />
      <path d="M4 17h9" />
    </svg>
  );
}

function InsightsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 17 9 12l4 4 7-9" />
    </svg>
  );
}

function ServiceIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M4 12h16M4 17h10" />
      <circle cx="18" cy="17" r="2" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13.5a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V20a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H4a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 5.65 8a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H10a1.7 1.7 0 0 0 1.03-1.56V2a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V8a1.7 1.7 0 0 0 1.56 1.03H22a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.56 1.03Z" />
    </svg>
  );
}
