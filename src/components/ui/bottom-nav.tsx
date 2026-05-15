import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BottomNavItem = {
  label: string;
  href: string;
  icon: ReactNode;
  isActive?: boolean;
};

export type BottomNavProps = {
  items: ReadonlyArray<BottomNavItem>;
  ariaLabel?: string;
};

export function BottomNav({ items, ariaLabel = "Primary" }: BottomNavProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className="fixed inset-x-0 bottom-0 z-30 border-t border-ink-100 bg-white/85 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-[backdrop-filter]:bg-white/70"
    >
      <ul className="mx-auto flex h-16 max-w-screen-sm items-stretch justify-around">
        {items.map((item) => (
          <li key={item.href} className="flex flex-1">
            <Link
              href={item.href}
              aria-current={item.isActive ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 text-caption",
                item.isActive ? "text-ink-900" : "text-ink-500",
              )}
            >
              <span aria-hidden className="block h-6 w-6">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
