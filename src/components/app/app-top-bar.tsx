"use client";

import { usePathname } from "next/navigation";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { useT } from "@/i18n/locale-provider";
import { getAppRouteMeta } from "./app-route-meta";

export function AppTopBar() {
  const pathname = usePathname();
  const t = useT();
  const { title } = getAppRouteMeta(t, pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-hair bg-cream pt-[env(safe-area-inset-top)] lg:hidden">
      <div className="mx-auto flex h-14 max-w-screen-sm items-center justify-between gap-3 px-5">
        <h1 className="text-[18px] font-semibold tracking-tight text-ink-900/90">
          {title}
        </h1>
        <NotificationBell />
      </div>
    </header>
  );
}
