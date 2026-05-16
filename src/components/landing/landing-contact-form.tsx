"use client";

import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

export function LandingContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-[20px] border border-hair bg-white p-7 shadow-card sm:p-8">
        <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-accent">
          Ačiū
        </span>
        <h2 className="mt-2 text-[20px] font-semibold tracking-[-0.022em] text-ink-900/90">
          Susisieksime greitai.
        </h2>
        <p className="mt-2 text-[14px] leading-[1.55] text-ink-500">
          Žinutė užfiksuota. Atsakome per kelias darbo dienas.
        </p>
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
          Vardas
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            className="rounded-[12px] border border-hair bg-cream px-3.5 py-2.5 text-[14px] text-ink-900 placeholder:text-ink-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            placeholder="Vardas"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-[12px] font-medium text-ink-500">
          El. paštas
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="rounded-[12px] border border-hair bg-cream px-3.5 py-2.5 text-[14px] text-ink-900 placeholder:text-ink-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            placeholder="vardas@pastas.lt"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-[12px] font-medium text-ink-500">
        Tema
        <input
          type="text"
          name="subject"
          required
          className="rounded-[12px] border border-hair bg-cream px-3.5 py-2.5 text-[14px] text-ink-900 placeholder:text-ink-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          placeholder="Apie ką norite parašyti?"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-[12px] font-medium text-ink-500">
        Žinutė
        <textarea
          name="message"
          required
          rows={5}
          className="resize-none rounded-[12px] border border-hair bg-cream px-3.5 py-3 text-[14px] leading-[1.5] text-ink-900 placeholder:text-ink-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          placeholder="Parašykite, ko reikia — atsakysime paprastai."
        />
      </label>

      <div className="mt-2 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12px] text-ink-500">
          Atsakome per kelias darbo dienas. Lietuviškai arba angliškai.
        </p>
        <Button
          variant="primary"
          type="submit"
          className="!h-auto !w-auto !rounded-[14px] !px-6 !py-3 !text-[14px]"
        >
          Siųsti žinutę →
        </Button>
      </div>
    </form>
  );
}
