import type { ReactNode } from "react";
import { AddEntryMount } from "@/components/add-entry/add-entry-mount";
import { NotificationsProvider } from "@/components/notifications/notifications-provider";
import type { AppNotification } from "@/lib/notifications";
import { AppBottomNav } from "./app-bottom-nav";
import { AppDesktopTopBar } from "./app-desktop-topbar";
import { AppFab } from "./app-fab";
import { AppSidebar } from "./app-sidebar";
import { AppTopBar } from "./app-top-bar";

export function AppShell({
  children,
  notifications,
}: {
  children: ReactNode;
  notifications: AppNotification[];
}) {
  return (
    <NotificationsProvider initial={notifications}>
      <div className="min-h-dvh bg-cream">
        <AppSidebar />
        <div className="flex min-h-dvh min-w-0 flex-col lg:pl-[260px]">
          <AppTopBar />
          <AppDesktopTopBar />
          <main className="flex-1 pb-32 lg:pb-12">{children}</main>
        </div>
        <AppBottomNav />
        <AppFab />
        <AddEntryMount />
      </div>
    </NotificationsProvider>
  );
}
