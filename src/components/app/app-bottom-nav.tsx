"use client";

import { usePathname } from "next/navigation";
import { BottomNav, type BottomNavItem } from "@/components/ui/bottom-nav";

export function AppBottomNav() {
  const pathname = usePathname();

  const items: ReadonlyArray<BottomNavItem> = [
    {
      label: "Pagrindinis",
      href: "/dashboard",
      icon: <HomeIcon />,
      isActive: isActive(pathname, "/dashboard"),
    },
    {
      label: "Veikla",
      href: "/activity",
      icon: <ActivityIcon />,
      isActive: isActive(pathname, "/activity"),
    },
    {
      label: "Įžvalgos",
      href: "/insights",
      icon: <InsightsIcon />,
      isActive: isActive(pathname, "/insights"),
    },
    {
      label: "Nustatymai",
      href: "/settings",
      icon: <SettingsIcon />,
      isActive: isActive(pathname, "/settings"),
    },
  ];

  return <BottomNav items={items} ariaLabel="Pagrindinė navigacija" />;
}

function isActive(pathname: string | null, prefix: string): boolean {
  if (!pathname) return false;
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function HomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10.5V20h14v-9.5" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7h13" />
      <path d="M4 12h13" />
      <path d="M4 17h9" />
    </svg>
  );
}

function InsightsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 17 9 12l4 4 7-9" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.65 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9a1.7 1.7 0 0 0 1.56 1.03H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.56 1.03Z" />
    </svg>
  );
}
