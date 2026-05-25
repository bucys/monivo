"use client";

import { useState, useTransition, type FormEvent } from "react";
import { sendContactMessage } from "@/app/(landing)/contact-actions";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/locale-provider";
import type { Dictionary, Locale } from "@/i18n";
import { LandingContainer } from "./landing-container";
import { LandingSection } from "./landing-section";

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
  faq: { q: string; a: string };
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

function ContactCard({ t, locale }: { t: Dictionary; locale: Locale }) {
  const c = t.landing.faq.contact;
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      try {
        await sendContactMessage({
          name: String(fd.get("name") ?? ""),
          email: String(fd.get("email") ?? ""),
          subject: "FAQ",
          message: String(fd.get("question") ?? ""),
          locale,
        });
        setSubmitted(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : c.errorGeneric);
      }
    });
  };

  return (
    <article className="flex flex-col rounded-[24px] border border-hair bg-surface p-7 shadow-card sm:p-8">
      <h3 className="text-[20px] font-semibold tracking-[-0.022em] text-ink-900">
        {c.title}
      </h3>
      <p className="mt-2 text-[14px] leading-[1.55] text-ink-500">{c.body}</p>

      {submitted ? (
        <p className="mt-6 rounded-[14px] bg-accent-soft px-4 py-3 text-[13px] text-accent-deep">
          {c.sent}
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3">
          <label className="flex flex-col gap-1.5 text-[12px] font-medium text-ink-500">
            {c.name}
            <input
              type="text"
              name="name"
              required
              maxLength={80}
              className="rounded-[12px] border border-hair bg-cream px-3.5 py-2.5 text-[14px] text-ink-900 placeholder:text-ink-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              placeholder={c.namePlaceholder}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-[12px] font-medium text-ink-500">
            {c.email}
            <input
              type="email"
              name="email"
              required
              maxLength={120}
              className="rounded-[12px] border border-hair bg-cream px-3.5 py-2.5 text-[14px] text-ink-900 placeholder:text-ink-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              placeholder={c.emailPlaceholder}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-[12px] font-medium text-ink-500">
            {c.question}
            <textarea
              name="question"
              required
              rows={3}
              maxLength={4000}
              className="resize-none rounded-[12px] border border-hair bg-cream px-3.5 py-2.5 text-[14px] text-ink-900 placeholder:text-ink-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              placeholder={c.questionPlaceholder}
            />
          </label>
          {error ? (
            <p className="rounded-[12px] bg-expense-bg px-3.5 py-2.5 text-[13px] text-expense">
              {c.errorGeneric}
            </p>
          ) : null}
          <Button
            variant="primary"
            type="submit"
            isLoading={pending}
            className="!mt-2 !h-auto !rounded-[14px] !px-5 !py-3 !text-[14px]"
          >
            {pending ? c.sending : error ? c.retry : c.submit}
          </Button>
        </form>
      )}
    </article>
  );
}

export function LandingFaq() {
  const { t, locale } = useLocale();
  const f = t.landing.faq;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <LandingSection id="duk" className="!pb-20 !pt-10 sm:!pb-24 sm:!pt-14">
      <LandingContainer>
        <div className="mx-auto max-w-[1040px]">
          <div className="mb-12 flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-accent/[0.08] px-3 py-1.5 text-eyebrow text-accent">
              <span aria-hidden className="block h-1.5 w-1.5 rounded-full bg-accent" />
              {f.eyebrow}
            </span>
            <h2 className="mt-5 text-[32px] font-semibold leading-[1.05] tracking-[-0.033em] text-ink-900 text-balance sm:text-[44px]">
              {f.title}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-[1fr_1.4fr] md:gap-10">
            <div className="order-2 md:order-1">
              <ContactCard t={t} locale={locale} />
            </div>
            <div className="order-1 overflow-hidden rounded-[24px] border border-hair bg-surface shadow-card md:order-2">
              {f.items.map((faq, i) => (
                <FaqItem
                  key={faq.q}
                  faq={faq}
                  open={openIndex === i}
                  onToggle={() =>
                    setOpenIndex((current) => (current === i ? null : i))
                  }
                  isLast={i === f.items.length - 1}
                />
              ))}
            </div>
          </div>
        </div>
      </LandingContainer>
    </LandingSection>
  );
}
