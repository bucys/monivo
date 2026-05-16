import Link from "next/link";
import { Button } from "@/components/ui/button";

type NavLink = { href: string; label: string };

const navLinks: ReadonlyArray<NavLink> = [
  { href: "#galimybes", label: "Galimybės" },
  { href: "#kaip-veikia", label: "Kaip veikia" },
  { href: "#kainos", label: "Kainos" },
  { href: "#duk", label: "D.U.K." },
];

export function LandingHeader() {
  return (
    <header className="sticky top-4 z-50 mx-auto mt-0 w-full max-w-[1180px] px-4 sm:px-8">
      <div className="relative overflow-hidden rounded-full border border-hair bg-white/25 shadow-nav ring-1 ring-inset ring-white/40 backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/5">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 via-white/25 to-white/5"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"
        />
        <div className="relative z-10 flex items-center justify-between gap-3 py-2 pl-3 pr-3 sm:gap-4 sm:py-2.5 sm:pl-[18px] sm:pr-3">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Monivo">
          <span
            aria-hidden
            className="flex h-[30px] w-[30px] items-center justify-center rounded-[10px] bg-gradient-to-br from-accent to-accent-deep text-[16px] font-bold leading-none tracking-tight text-white"
          >
            M
          </span>
          <span className="text-[16px] font-semibold tracking-tight text-ink-900">
            Monivo
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-[10px] px-3 py-2 text-[13px] font-medium tracking-tight text-ink-500 transition-colors hover:bg-ink-900/[0.04] hover:text-ink-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/login"
            className="hidden px-3 py-2 text-[13px] font-medium tracking-tight text-ink-900 sm:inline-block"
          >
            Prisijungti
          </Link>
          <Link href="/register">
            <Button
              variant="primary"
              className="!h-auto !w-auto !rounded-[12px] !px-3.5 !py-2.5 !text-[13px] sm:!px-4 sm:!py-2.5 sm:!text-[13px]"
            >
              <span className="sm:hidden">Pradėti →</span>
              <span className="hidden sm:inline">Pradėti nemokamai →</span>
            </Button>
          </Link>
        </div>
        </div>
      </div>
    </header>
  );
}
