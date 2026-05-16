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
    <header className="sticky top-4 z-50 mx-auto mt-4 w-full max-w-[1180px] px-5 sm:px-8">
      <div className="flex items-center justify-between gap-4 rounded-[22px] border border-hair bg-white/85 py-2.5 pl-4 pr-3 shadow-nav backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/70 sm:pl-[18px] sm:pr-3">
        <Link href="#top" className="flex items-center gap-2.5" aria-label="Monivo">
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
          <Button
            variant="primary"
            className="!h-auto !w-auto !rounded-[12px] !px-4 !py-2.5 !text-[13px]"
          >
            Pradėti nemokamai →
          </Button>
        </div>
      </div>
    </header>
  );
}
