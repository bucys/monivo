import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getT } from "@/i18n/server";
import { LandingContainer } from "./landing-container";
import { LandingSection } from "./landing-section";

const CheckIcon = (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
    <path
      d="M2.5 6.2L4.8 8.5L9.5 3.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export async function LandingPricing() {
  const { t } = await getT();
  const p = t.landing.pricing;
  return (
    <LandingSection id="kainos" className="!pb-20 !pt-10 sm:!pb-24 sm:!pt-14">
      <LandingContainer>
        <div className="mx-auto max-w-[760px]">
          <div className="mb-12 flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-accent/[0.08] px-3 py-1.5 text-eyebrow text-accent">
              <span aria-hidden className="block h-1.5 w-1.5 rounded-full bg-accent" />
              {p.eyebrow}
            </span>
            <h2 className="mt-5 text-[32px] font-semibold leading-[1.05] tracking-[-0.033em] text-ink-900/90 text-balance sm:text-[44px]">
              {p.title}
            </h2>
            <p className="mt-4 max-w-[520px] text-[17px] leading-[1.55] text-ink-500">
              {p.subtitle}
            </p>
          </div>

          <article className="relative mx-auto max-w-[480px] rounded-[28px] border border-hair bg-white p-8 shadow-card sm:p-10">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-semibold tracking-tight text-ink-900/90">
                Monivo
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-semibold tracking-tight text-accent-deep">
                <span aria-hidden className="block h-1.5 w-1.5 rounded-full bg-accent" />
                {p.badge}
              </span>
            </div>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-[56px] font-semibold leading-none tracking-[-0.035em] text-ink-900 tabular-nums">
                4.90 €
              </span>
              <span className="text-[16px] font-medium tracking-tight text-ink-500">
                {p.perMonth}
              </span>
            </div>
            <p className="mt-2 text-[13px] text-ink-500">{p.trialNote}</p>

            <ul className="mt-7 flex flex-col gap-3">
              {p.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 text-[14px] text-ink-900/90"
                >
                  <span
                    aria-hidden
                    className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-deep"
                  >
                    {CheckIcon}
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <Link href="/register" className="mt-8 block">
              <Button
                variant="primary"
                className="!h-auto !rounded-[14px] !px-5 !py-[14px] !text-[14px]"
              >
                {p.cta}
              </Button>
            </Link>

            <p className="mt-4 text-center text-[12px] text-ink-500">{p.cancelNote}</p>
          </article>
        </div>
      </LandingContainer>
    </LandingSection>
  );
}
