import type { ReactNode } from "react";
import { LandingContainer } from "./landing-container";
import { LandingSection } from "./landing-section";

type Step = {
  number: string;
  title: string;
  body: string;
  visual: ReactNode;
};

type Service = {
  initial: string;
  name: string;
  price: number;
  toneBg: string;
  toneText: string;
};

const services: ReadonlyArray<Service> = [
  {
    initial: "M",
    name: "Manikiūras",
    price: 35,
    toneBg: "bg-income-bg",
    toneText: "text-income",
  },
  {
    initial: "P",
    name: "Pedikiūras",
    price: 45,
    toneBg: "bg-tax-bg",
    toneText: "text-tax",
  },
  {
    initial: "A",
    name: "Antakiai",
    price: 25,
    toneBg: "bg-accent-soft",
    toneText: "text-accent-deep",
  },
  {
    initial: "B",
    name: "Blakstienos",
    price: 60,
    toneBg: "bg-[#EDE6FF]",
    toneText: "text-[#5B3FAA]",
  },
];

const ServiceListVisual = (
  <div className="flex flex-col gap-2">
    {services.slice(0, 3).map((s) => (
      <div
        key={s.initial}
        className="flex items-center gap-3 rounded-[14px] border border-hair bg-cream px-3.5 py-2.5"
      >
        <span
          aria-hidden
          className={`flex h-8 w-8 items-center justify-center rounded-[10px] text-[12px] font-bold text-ink-900 ${s.toneBg}`}
        >
          {s.initial}
        </span>
        <span className="flex-1 text-[14px] font-medium text-ink-900">
          {s.name}
        </span>
        <span className="whitespace-nowrap text-[15px] font-semibold tracking-tight text-ink-900 tabular-nums">
          {s.price} €
        </span>
      </div>
    ))}
  </div>
);

const ChipsVisual = (
  <div className="relative flex min-h-[180px] items-center justify-center md:min-h-[150px]">
    <div className="flex flex-wrap justify-center gap-2.5">
      {services.map((s, i) => {
        const selected = i === 1;
        return (
          <span
            key={s.initial}
            className={`inline-flex items-center gap-2 rounded-full border border-hair bg-white px-3.5 py-2 text-[13px] font-medium text-ink-900 shadow-card ${
              selected ? "scale-105 -rotate-2 outline outline-2 outline-offset-2 outline-accent" : ""
            }`}
          >
            <span
              aria-hidden
              className={`flex h-[22px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-ink-900 ${s.toneBg}`}
            >
              +{s.price}
            </span>
            {s.name}
          </span>
        );
      })}
    </div>
    <span className="absolute right-0 top-0 inline-flex items-center gap-1.5 rounded-full bg-income-bg px-3 py-1.5 text-[12px] font-bold text-income shadow-card">
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden>
        <path
          d="M2 5.5L4.5 8L9 3"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Įrašyta
    </span>
  </div>
);

const BalanceVisual = (
  <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#2E8E7D] via-accent to-accent-deep p-6 text-white shadow-hero">
    <div
      aria-hidden
      className="pointer-events-none absolute -right-8 -top-10 h-[180px] w-[180px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.2),transparent_60%)]"
    />
    <div className="relative">
      <div className="text-[11px] font-medium tracking-wide opacity-85">
        ✦ Kiek gali laisvai išleisti
      </div>
      <div className="mt-2 flex items-baseline gap-1 text-[44px] font-semibold tracking-[-0.03em] leading-none">
        <span className="tabular-nums">1 350</span>
        <span className="text-[22px] font-normal opacity-70">€</span>
      </div>
      <div className="mt-2 text-[12px] opacity-75">
        Po išlaidų ir mokesčių rezervo
      </div>
    </div>
  </div>
);

const steps: ReadonlyArray<Step> = [
  {
    number: "01",
    title: "Pridėk savo paslaugas ir kainas",
    body: "Susikuri savo paslaugas vieną kartą — ir greitai jas pridėsi kiekvieną dieną.",
    visual: ServiceListVisual,
  },
  {
    number: "02",
    title: "Sek pajamas per sekundes",
    body: "Pasirenki paslaugą, patvirtini — ir viskas.",
    visual: ChipsVisual,
  },
  {
    number: "03",
    title: "Matai aiškų likutį",
    body: "Po mokesčių ir išlaidų. Jokio spėliojimo, jokios buhalterijos.",
    visual: BalanceVisual,
  },
];

export function LandingHowItWorks() {
  return (
    <LandingSection
      id="kaip-veikia"
      className="!pb-20 !pt-10 sm:!pb-24 sm:!pt-14"
    >
      <LandingContainer>
        <div className="mx-auto max-w-[1040px] lg:max-w-[960px]">
          <div className="mb-14 flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-accent/[0.08] px-3 py-1.5 text-eyebrow text-accent">
              <span aria-hidden className="block h-1.5 w-1.5 rounded-full bg-accent" />
              Kaip veikia
            </span>
            <h2 className="mt-5 text-[32px] font-semibold leading-[1.05] tracking-[-0.033em] text-ink-900/90 text-balance sm:text-[44px]">
              Trys žingsniai — ir aišku.
            </h2>
          </div>

          <ol className="flex flex-col gap-6 lg:gap-5">
            {steps.map((step, i) => {
              const textFirst = i % 2 === 0;
              return (
                <li
                  key={step.number}
                  className="grid gap-8 rounded-[28px] border border-hair bg-white p-8 shadow-card md:grid-cols-2 md:items-center md:gap-10 md:p-7 lg:gap-12 lg:px-9 lg:py-7"
                >
                  <div className={textFirst ? "md:order-1" : "md:order-2"}>
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] bg-accent-soft text-[18px] font-bold tracking-tight text-accent-deep tabular-nums">
                      {step.number}
                    </span>
                    <h3 className="mt-4 text-[24px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink-900/90 sm:text-[28px]">
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-[420px] text-[15px] leading-[1.5] text-ink-500">
                      {step.body}
                    </p>
                  </div>
                  <div className={textFirst ? "md:order-2" : "md:order-1"}>
                    {step.visual}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </LandingContainer>
    </LandingSection>
  );
}
