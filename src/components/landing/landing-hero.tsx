import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LandingContainer } from "./landing-container";
import { LandingSection } from "./landing-section";

const reassurances: ReadonlyArray<string> = [
  "Be buhalterijos žinių",
  "Paruošta per 2 min.",
  "Pritaikyta mobiliam",
];

export function LandingHero() {
  return (
    <LandingSection id="top" className="relative !pb-16 !pt-16 sm:!pb-24 sm:!pt-24">
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-20 -z-0 hidden h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(31,122,107,0.10),transparent_60%)] sm:block"
      />
      <LandingContainer className="relative z-[1]">
        <div className="grid items-center gap-14 sm:grid-cols-[1.05fr_0.95fr] sm:gap-[60px]">
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-accent/[0.08] px-3 py-1.5 text-eyebrow text-accent">
              <span aria-hidden className="block h-1.5 w-1.5 rounded-full bg-accent" />
              Grožio profesionalams · Lietuvoje
            </span>

            <h1 className="mt-5 text-[40px] font-semibold leading-[1.06] tracking-[-0.034em] text-ink-900 text-balance sm:text-display-lg sm:leading-[1.05]">
              Pagaliau aišku{" "}
              <span className="inline-block bg-gradient-to-r from-accent-deep to-accent bg-clip-text pb-1 pr-2 font-medium italic tracking-[-0.038em] text-transparent">
                kiek lieka tau
              </span>
              <span className="text-ink-900">.</span>
            </h1>

            <p className="mt-5 max-w-[480px] text-[17px] leading-[1.55] text-ink-500 sm:text-body-lg">
              Sek pajamas, išlaidas ir mokesčius be buhalterijos streso. Sukurta
              tau — grožio profesionalui.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:justify-start">
              <Button
                variant="primary"
                className="!h-auto !w-auto !rounded-[14px] !px-[22px] !py-[13px] !text-[14px]"
              >
                Pradėti 30 d. nemokamai →
              </Button>
              <Button
                variant="secondary"
                className="!h-auto !w-auto !rounded-[14px] !border-hair !px-[22px] !py-[13px] !text-[14px]"
              >
                <span aria-hidden className="mr-2 inline-block">
                  <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                    <path d="M1.5 1L11 7L1.5 13V1Z" fill="currentColor" />
                  </svg>
                </span>
                Žiūrėti demo
              </Button>
            </div>

            <p className="mt-3 text-[12px] font-medium text-ink-500">
              30 dienų nemokamai · Be kortelės
            </p>

            <ul className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[12px] font-medium text-ink-500 sm:justify-start">
              {reassurances.map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <span
                    aria-hidden
                    className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-accent-soft text-accent"
                  >
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path
                        d="M2 5.5L4.5 8L9 3"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-9 border-t border-hair pt-6 text-[13px] text-ink-500">
              Sukurta individualiai dirbantiems.
              Be Excel. Be buhalterinės kalbos. Be streso.
            </p>
          </div>

          <div className="relative mx-auto flex w-full max-w-[440px] justify-center sm:mt-14 sm:max-w-[590px] sm:translate-y-10">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(221,244,236,0.7),transparent_65%)] blur-[8px]"
            />
            <div className="relative z-[2] w-full -rotate-3">
              <Image
                src="/landing/hero-phone.png"
                alt="Monivo aplikacijos peržiūra: galiu išleisti €1 350, mokesčiams atidėta €145, šios dienos pajamų ir išlaidų sąrašas."
                width={464}
                height={538}
                priority
                sizes="(min-width: 640px) 590px, 440px"
                className="h-auto w-full"
              />
            </div>

            <div className="absolute -left-2 top-10 z-[3] flex -rotate-6 items-center gap-2.5 rounded-[14px] border border-hair bg-white px-3 py-2 shadow-card sm:left-0 sm:top-[60px] sm:px-3.5 sm:py-2.5">
              <span
                aria-hidden
                className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-income-bg text-[16px] font-bold leading-none text-income"
              >
                +
              </span>
              <span className="flex flex-col">
                <span className="text-[11px] font-medium text-ink-500">
                  Manikiūras · grynais
                </span>
                <span className="text-[15px] font-semibold tracking-tight text-income">
                  +35 €
                </span>
              </span>
            </div>

            <div className="absolute -right-2 bottom-16 z-[3] flex rotate-[4deg] items-center gap-2.5 rounded-[14px] border border-hair bg-white px-3 py-2 shadow-card sm:bottom-20 sm:right-2.5 sm:px-3.5 sm:py-2.5">
              <span
                aria-hidden
                className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-tax-bg text-tax"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M7 1L8.5 5.5L13 7L8.5 8.5L7 13L5.5 8.5L1 7L5.5 5.5L7 1Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <span className="flex flex-col">
                <span className="text-[11px] font-medium text-ink-500">
                  Mokesčiams atidėta
                </span>
                <span className="text-[15px] font-semibold tracking-tight text-tax">
                  145 €
                </span>
              </span>
            </div>
          </div>
        </div>
      </LandingContainer>
    </LandingSection>
  );
}
