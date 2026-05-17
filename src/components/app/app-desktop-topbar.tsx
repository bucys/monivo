"use client";

import { usePathname } from "next/navigation";
import { getAppRouteMeta } from "./app-route-meta";

export function AppDesktopTopBar() {
  const pathname = usePathname();
  const { title, sub } = getAppRouteMeta(pathname);
  const isDashboard = pathname === "/dashboard";

  if (isDashboard) return null;

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
      </div>
    </header>
  );
}
