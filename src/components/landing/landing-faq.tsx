"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { LandingContainer } from "./landing-container";
import { LandingSection } from "./landing-section";

type Faq = { q: string; a: string };

const faqs: ReadonlyArray<Faq> = [
  {
    q: "Ar Monivo tinka dirbant su individualia veikla?",
    a: "Taip. Monivo sukurta būtent individualiai dirbantiems grožio specialistams — kai pajamos ateina dalimis (grynais, pavedimu, kortele), o mokesčius už save tvarkaisi pats.",
  },
  {
    q: "Ar reikia buhalterinių žinių?",
    a: "Ne. Monivo nėra apskaitos programa. Visa kalba — paprasta: paslauga, pajamos, išlaidos, mokesčių rezervas. Be sąskaitų plano, be kategorijų medžio.",
  },
  {
    q: "Ar galiu naudoti telefone?",
    a: "Taip. Monivo pirmiausia sukurta telefonui — greitam ir patogiam naudojimui kasdien. Jei patogiau, gali naudoti ir naršyklėje kompiuteryje.",
  },
  {
    q: "Kaip veikia mokesčių rezervas?",
    a: "Tu pasirenki procentą, kurį nori atsidėti mokesčiams. Monivo paskaičiuoja ir parodo, kiek verta atsidėti — pinigai lieka tavo banko sąskaitoje, tu pats sprendi, kada juos perkelti.",
  },
  {
    q: "Ar galiu eksportuoti savo duomenis?",
    a: "Taip. Bet kada gali atsisiųsti savo pajamų ir išlaidų suvestinę CSV formatu — galėsi perduoti buhalteriui arba pasilikti archyvui.",
  },
];

const ChevronIcon = (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
    <path
      d="M3 4.5L6 7.5L9 4.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function FaqItem({
  faq,
  open,
  onToggle,
  isLast,
}: {
  faq: Faq;
  open: boolean;
  onToggle: () => void;
  isLast: boolean;
}) {
  return (
    <div className={isLast ? "" : "border-b border-hair"}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-ink-900/[0.015]"
      >
        <span className="text-[15px] font-medium tracking-tight text-ink-900">
          {faq.q}
        </span>
        <span
          aria-hidden
          className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-deep transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        >
          {ChevronIcon}
        </span>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-6 text-[14px] leading-[1.55] text-ink-500">
            {faq.a}
          </p>
        </div>
      </div>
    </div>
  );
}

function ContactCard() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <article className="flex flex-col rounded-[24px] border border-hair bg-white p-7 shadow-card sm:p-8">
      <h3 className="text-[20px] font-semibold tracking-[-0.022em] text-ink-900">
        Vis dar turi klausimų?
      </h3>
      <p className="mt-2 text-[14px] leading-[1.55] text-ink-500">
        Parašyk mums.
      </p>

      {submitted ? (
        <p className="mt-6 rounded-[14px] bg-accent-soft px-4 py-3 text-[13px] text-accent-deep">
          Ačiū — susisieksime greitai.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3">
          <label className="flex flex-col gap-1.5 text-[12px] font-medium text-ink-500">
            Vardas
            <input
              type="text"
              required
              className="rounded-[12px] border border-hair bg-cream px-3.5 py-2.5 text-[14px] text-ink-900 placeholder:text-ink-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              placeholder="Vardas"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-[12px] font-medium text-ink-500">
            El. paštas
            <input
              type="email"
              required
              className="rounded-[12px] border border-hair bg-cream px-3.5 py-2.5 text-[14px] text-ink-900 placeholder:text-ink-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              placeholder="vardas@pastas.lt"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-[12px] font-medium text-ink-500">
            Klausimas
            <textarea
              required
              rows={3}
              className="resize-none rounded-[12px] border border-hair bg-cream px-3.5 py-2.5 text-[14px] text-ink-900 placeholder:text-ink-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              placeholder="Apie ką norėtum sužinoti?"
            />
          </label>
          <Button
            variant="primary"
            type="submit"
            className="!mt-2 !h-auto !rounded-[14px] !px-5 !py-3 !text-[14px]"
          >
            Susisiekti →
          </Button>
        </form>
      )}
    </article>
  );
}

export function LandingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <LandingSection id="duk" className="!pb-20 !pt-10 sm:!pb-24 sm:!pt-14">
      <LandingContainer>
        <div className="mx-auto max-w-[1040px]">
          <div className="mb-12 flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-accent/[0.08] px-3 py-1.5 text-eyebrow text-accent">
              <span aria-hidden className="block h-1.5 w-1.5 rounded-full bg-accent" />
              Dažniausi klausimai
            </span>
            <h2 className="mt-5 text-[32px] font-semibold leading-[1.05] tracking-[-0.033em] text-ink-900 text-balance sm:text-[44px]">
              Viskas aiškiau prieš pradedant.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-[1fr_1.4fr] md:gap-10">
            <div className="order-2 md:order-1">
              <ContactCard />
            </div>
            <div className="order-1 overflow-hidden rounded-[24px] border border-hair bg-white shadow-card md:order-2">
              {faqs.map((faq, i) => (
                <FaqItem
                  key={faq.q}
                  faq={faq}
                  open={openIndex === i}
                  onToggle={() =>
                    setOpenIndex((current) => (current === i ? null : i))
                  }
                  isLast={i === faqs.length - 1}
                />
              ))}
            </div>
          </div>
        </div>
      </LandingContainer>
    </LandingSection>
  );
}
