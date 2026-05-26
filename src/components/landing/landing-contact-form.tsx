"use client";

import { type FormEvent, useState, useTransition } from "react";
import { sendContactMessage } from "@/app/(landing)/contact-actions";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/locale-provider";

export function LandingContactForm() {
  const { t, locale } = useLocale();
  const f = t.landing.contactForm;
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setError(null);
    startTransition(async () => {
      try {
        const result = await sendContactMessage({
          name: String(fd.get("name") ?? ""),
          email: String(fd.get("email") ?? ""),
          subject: String(fd.get("subject") ?? ""),
          message: String(fd.get("message") ?? ""),
          locale,
        });
        if (result.ok) {
          setSubmitted(true);
        } else {
          setError(result.reason);
        }
      } catch {
        setError("SEND_FAILED");
      }
    });
  };

  if (submitted) {
    return (
      <div className="rounded-[20px] border border-hair bg-surface p-7 shadow-card sm:p-8">
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
      className="flex flex-col gap-4 rounded-[20px] border border-hair bg-surface p-7 shadow-card sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-[12px] font-medium text-ink-500">
          {f.name}
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            maxLength={80}
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
            maxLength={120}
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
          maxLength={140}
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
          maxLength={4000}
          className="resize-none rounded-[12px] border border-hair bg-cream px-3.5 py-3 text-[14px] leading-[1.5] text-ink-900 placeholder:text-ink-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          placeholder={f.messagePlaceholder}
        />
      </label>

      {error ? (
        <p className="rounded-[12px] bg-expense-bg px-3.5 py-2.5 text-[13px] text-expense">
          {f.errorGeneric}
        </p>
      ) : null}

      <div className="mt-2 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12px] text-ink-500">{f.footnote}</p>
        <Button
          variant="primary"
          type="submit"
          isLoading={pending}
          className="!h-auto !w-auto !rounded-[14px] !px-6 !py-3 !text-[14px]"
        >
          {pending ? f.sending : error ? f.retry : f.submit}
        </Button>
      </div>
    </form>
  );
}
