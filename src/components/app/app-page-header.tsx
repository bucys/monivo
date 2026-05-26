"use client";

import { usePathname } from "next/navigation";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { useT } from "@/i18n/locale-provider";
import { getAppRouteMeta } from "./app-route-meta";

/**
 * Inline desktop page header for non-dashboard app routes. Renders the route
 * title + sub on the left and the notification bell on the right, inside the
 * page's own `AppScreen` container so the bell occupies the exact same slot
 * as the inline bell on the Dashboard (right edge of `max-w-[1100px]`, top of
 * the page's content area). Hidden on mobile — the mobile top bar handles
 * that surface.
 */
export function AppPageHeader() {
  const pathname = usePathname();
  const t = useT();
  const { title, sub } = getAppRouteMeta(t, pathname);
  return (
    <header className="mb-5 hidden items-start justify-between gap-4 lg:mb-9 lg:flex">
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
      <NotificationBell />
    </header>
  );
}
