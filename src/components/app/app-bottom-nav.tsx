"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useT } from "@/i18n/locale-provider";

type Tab = { label: string; href: string; icon: ReactNode };

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppBottomNav() {
  const pathname = usePathname();
  const t = useT();
  const leftTabs: ReadonlyArray<Tab> = [
    { label: t.nav.home, href: "/dashboard", icon: <HomeIcon /> },
    { label: t.nav.activity, href: "/activity", icon: <ActivityIcon /> },
  ];
  const rightTabs: ReadonlyArray<Tab> = [
    { label: t.nav.insights, href: "/insights", icon: <InsightsIcon /> },
    { label: t.nav.more, href: "/settings", icon: <MoreIcon /> },
  ];

  return (
    <nav
      aria-label={t.nav.mobileNavAria}
      className="fixed inset-x-4 bottom-6 z-30 rounded-[32px] border border-hair bg-surface/90 px-2 pb-[env(safe-area-inset-bottom)] shadow-card backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-surface/75 lg:hidden"
    >
      <ul className="relative flex items-center">
        {leftTabs.map((tab) => (
          <NavItem key={tab.href} tab={tab} active={isActive(pathname, tab.href)} />
        ))}
        <li aria-hidden className="w-[64px] flex-shrink-0" />
        {rightTabs.map((tab) => (
          <NavItem key={tab.href} tab={tab} active={isActive(pathname, tab.href)} />
        ))}
      </ul>
    </nav>
  );
}

function NavItem({ tab, active }: { tab: Tab; active: boolean }) {
  return (
    <li className="flex flex-1">
      <Link
        href={tab.href}
        aria-current={active ? "page" : undefined}
        className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-semibold transition-colors ${
          active ? "text-accent" : "text-ink-700"
        }`}
      >
        <span aria-hidden className="block h-[22px] w-[22px]">
          {tab.icon}
        </span>
        <span>{tab.label}</span>
      </Link>
    </li>
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

function MoreIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="12" r="1.4" fill="currentColor" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" />
      <circle cx="18" cy="12" r="1.4" fill="currentColor" />
    </svg>
  );
}
