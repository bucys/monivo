import type { ReactNode } from "react";
import { AddEntryMount } from "@/components/add-entry/add-entry-mount";
import { AppBottomNav } from "./app-bottom-nav";
import { AppDesktopTopBar } from "./app-desktop-topbar";
import { AppFab } from "./app-fab";
import { AppSidebar } from "./app-sidebar";
import { AppTopBar } from "./app-top-bar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-cream">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopBar />
        <AppDesktopTopBar />
        <main className="flex-1 pb-32 lg:pb-12">{children}</main>
      </div>
      <AppBottomNav />
      <AppFab />
      <AddEntryMount />
    </div>
  );
}
