import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LandingContainer } from "./landing-container";
import { LandingSection } from "./landing-section";

export function LandingClosing() {
  return (
    <LandingSection className="!pb-20 !pt-8 sm:!pb-24 sm:!pt-12">
      <LandingContainer>
        <div className="relative mx-auto max-w-[820px] overflow-hidden rounded-[32px] bg-gradient-to-br from-accent via-accent to-accent-deep px-7 py-12 text-center text-white shadow-card sm:px-14 sm:py-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-28 h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.14),transparent_65%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-28 -left-24 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(221,244,236,0.16),transparent_65%)]"
          />

          <div className="relative">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
              ✦ Monivo
            </span>
            <h2 className="mx-auto mt-4 max-w-[14ch] text-[34px] font-semibold leading-[1.04] tracking-[-0.034em] text-balance sm:max-w-none sm:text-[52px]">
              Žinok, kas iš tikrųjų{" "}
              <span className="inline-block bg-gradient-to-r from-white to-white/90 bg-clip-text pb-1 pr-2 font-medium italic tracking-[-0.038em] text-transparent">
                tavo
              </span>
              .
            </h2>
            <p className="mx-auto mt-4 max-w-[420px] text-[15px] leading-[1.55] text-white/80 sm:text-[16px]">
              Be Excel. Be buhalterinės kalbos. Be streso.
            </p>
            <Link href="/register" className="mt-7 inline-flex">
              <Button
                variant="primary"
                className="!h-auto !w-auto !rounded-[14px] !bg-white !px-[22px] !py-3 !text-[14px] !text-accent-deep"
              >
                Pradėti nemokamai →
              </Button>
            </Link>
          </div>
        </div>
      </LandingContainer>
    </LandingSection>
  );
}
