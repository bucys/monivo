"use client";

import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/locale-provider";

export function LandingContactForm() {
  const t = useT();
  const f = t.landing.contactForm;
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-[20px] border border-hair bg-white p-7 shadow-card sm:p-8">
        <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-accent">
          {f.sentEyebrow}
        </span>
        <h2 className="mt-2 text-[20px] font-semibold tracking-[-0.022em] text-ink-900/90">
          {f.sentTitle}
        </h2>
        <p className="mt-2 text-[14px] leading-[1.55] text-ink-500">{f.sentBody}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 rounded-[20px] border border-hair bg-white p-7 shadow-card sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-[12px] font-medium text-ink-500">
          {f.name}
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            className="rounded-[12px] border border-hair bg-cream px-3.5 py-2.5 text-[14px] text-ink-900 placeholder:text-ink-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            placeholder={f.namePlaceholder}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-[12px] font-medium text-ink-500">
          {f.email}
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="rounded-[12px] border border-hair bg-cream px-3.5 py-2.5 text-[14px] text-ink-900 placeholder:text-ink-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            placeholder={f.emailPlaceholder}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-[12px] font-medium text-ink-500">
        {f.subject}
        <input
          type="text"
          name="subject"
          required
          className="rounded-[12px] border border-hair bg-cream px-3.5 py-2.5 text-[14px] text-ink-900 placeholder:text-ink-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          placeholder={f.subjectPlaceholder}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-[12px] font-medium text-ink-500">
        {f.message}
        <textarea
          name="message"
          required
          rows={5}
          className="resize-none rounded-[12px] border border-hair bg-cream px-3.5 py-3 text-[14px] leading-[1.5] text-ink-900 placeholder:text-ink-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          placeholder={f.messagePlaceholder}
        />
      </label>

      <div className="mt-2 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12px] text-ink-500">{f.footnote}</p>
        <Button
          variant="primary"
          type="submit"
          className="!h-auto !w-auto !rounded-[14px] !px-6 !py-3 !text-[14px]"
        >
          {f.submit}
        </Button>
      </div>
    </form>
  );
}
