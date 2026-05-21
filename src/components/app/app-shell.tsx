import type { ReactNode } from "react";
import { AddEntryMount } from "@/components/add-entry/add-entry-mount";
import { NotificationsProvider } from "@/components/notifications/notifications-provider";
import type { AppNotification } from "@/lib/notifications";
import { AppBottomNav } from "./app-bottom-nav";
import { AppDesktopTopBar } from "./app-desktop-topbar";
import { AppFab } from "./app-fab";
import { AppSidebar } from "./app-sidebar";
import { AppTopBar } from "./app-top-bar";
import { UIChromeProvider } from "./ui-chrome";

export type SidebarData = {
  displayName: string;
  /** Active tax/legal activity form label (e.g. "Individuali veikla"). */
  activityLabel: string;
  /** Tax reserved for the current month, in cents. Null = hide the card. */
  reserveCents: number | null;
};

export function AppShell({
  children,
  notifications,
  canWrite,
  sidebar,
}: {
  children: ReactNode;
  notifications: AppNotification[];
  canWrite: boolean;
  sidebar: SidebarData;
}) {
  return (
    <UIChromeProvider>
      <NotificationsProvider initial={notifications}>
        <div className="min-h-dvh bg-cream">
          <AppSidebar sidebar={sidebar} />
          <div className="flex min-h-dvh min-w-0 flex-col lg:pl-[260px]">
            <AppTopBar />
            <AppDesktopTopBar />
            <main className="flex-1 pb-32 lg:pb-12">{children}</main>
          </div>
          <AppBottomNav />
          <AppFab canWrite={canWrite} />
          <AddEntryMount />
        </div>
      </NotificationsProvider>
    </UIChromeProvider>
  );
}
