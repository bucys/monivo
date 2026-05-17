"use client";

import { usePathname } from "next/navigation";
import { dispatchOpenAddEntry } from "@/components/add-entry/add-entry-sheet";
import { getAppRouteMeta } from "./app-route-meta";

export function AppDesktopTopBar() {
  const pathname = usePathname();
  const { title, sub } = getAppRouteMeta(pathname);
  const onServices =
    pathname === "/services" || pathname?.startsWith("/services/");

  return (
    <header className="sticky top-0 z-20 hidden border-b border-hair bg-cream/85 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-cream/70 lg:block">
      <div className="flex items-center justify-between px-8 py-5">
        <div>
          {sub ? (
            <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-500">
              {sub}
            </div>
          ) : null}
          <h1 className="mt-1 text-[26px] font-semibold leading-tight tracking-[-0.023em] text-ink-900/90">
            {title}
          </h1>
        </div>
        {onServices ? null : (
          <button
            type="button"
            onClick={() => dispatchOpenAddEntry()}
            className="inline-flex items-center gap-1.5 rounded-[12px] bg-accent px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-accent-deep"
          >
            <span aria-hidden className="text-[15px] leading-none">
              +
            </span>
            Pridėti
          </button>
        )}
      </div>
    </header>
  );
}
