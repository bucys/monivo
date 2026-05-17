"use client";

import { usePathname } from "next/navigation";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import { getAppRouteMeta } from "./app-route-meta";

export function AppTopBar() {
  const pathname = usePathname();
  const { title } = getAppRouteMeta(pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-hair bg-cream/85 pt-[env(safe-area-inset-top)] backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-cream/70 lg:hidden">
      <div className="mx-auto flex h-14 max-w-screen-sm items-center justify-between gap-3 px-5">
        <h1 className="text-[18px] font-semibold tracking-tight text-ink-900/90">
          {title}
        </h1>
        <NotificationBell />
      </div>
    </header>
  );
}
