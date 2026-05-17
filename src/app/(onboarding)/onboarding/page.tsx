"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { completeOnboarding } from "./actions";

type Profession = "nails" | "lashes" | "cosmetology" | "hair" | "other";

type ProfessionCard = {
  key: string;
  id: Profession;
  title: string;
  sub: string;
};

const PROFESSIONS: ReadonlyArray<ProfessionCard> = [
  {
    key: "hair",
    id: "hair",
    title: "Plaukai",
    sub: "Kirpimai, dažymai, barberis",
  },
  {
    key: "nails",
    id: "nails",
    title: "Nagai",
    sub: "Manikiūras, pedikiūras, nagų dizainas",
  },
  {
    key: "face",
    id: "cosmetology",
    title: "Veidas ir oda",
    sub: "Kosmetologija, blakstienos, antakiai",
  },
  {
    key: "body",
    id: "other",
    title: "Kūno procedūros",
    sub: "Masažai, SPA, kūno procedūros",
  },
];

const FALLBACK_KEY = "none";

const TAX_PRESETS: ReadonlyArray<number> = [20, 25, 30];

export default function OnboardingPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [professionKey, setProfessionKey] = useState<string>(FALLBACK_KEY);
  const profession: Profession =
    PROFESSIONS.find((p) => p.key === professionKey)?.id ?? "other";
  const [presetPercent, setPresetPercent] = useState<number | null>(25);
  const [customPercent, setCustomPercent] = useState<string>("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const customParsed =
    customPercent === "" ? null : parseInt(customPercent, 10);
  const customOutOfRange =
    customParsed !== null &&
    (Number.isFinite(customParsed) ? customParsed < 0 || customParsed > 35 : true);

  const submitDisabled =
    pending ||
    customOutOfRange ||
    (presetPercent === null && (customParsed === null || !Number.isFinite(customParsed)));

  const submit = () => {
    if (submitDisabled) return;
    setError(null);
    const value = presetPercent !== null ? presetPercent : customParsed!;
    const fd = new FormData();
    fd.set("profession", profession);
    fd.set("taxPercent", String(value));
    startTransition(async () => {
      try {
        await completeOnboarding(fd);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Įvyko klaida");
      }
    });
  };

  return (
    <div className="w-full max-w-[440px]">
      <Link
        href="/dashboard"
        className="mb-8 flex items-center justify-center gap-2.5"
        aria-label="Monivo"
      >
        <span
          aria-hidden
          className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-gradient-to-br from-accent to-accent-deep text-[18px] font-bold leading-none tracking-tight text-white"
        >
          M
        </span>
        <span className="text-[18px] font-semibold tracking-tight text-ink-900">
          Monivo
        </span>
      </Link>

      <article className="rounded-[24px] border border-hair bg-white p-7 shadow-card sm:p-8">
        <StepDots current={step} total={2} />

        {step === 1 ? (
          <ProfessionStep
            value={professionKey}
            onChange={setProfessionKey}
            onContinue={() => setStep(2)}
            onSkip={() => {
              setProfessionKey(FALLBACK_KEY);
              setStep(2);
            }}
          />
        ) : (
          <TaxStep
            preset={presetPercent}
            custom={customPercent}
            customOutOfRange={customOutOfRange}
            submitDisabled={submitDisabled}
            onPickPreset={(p) => {
              setPresetPercent(p);
              setCustomPercent("");
            }}
            onCustomChange={(v) => {
              setCustomPercent(v);
              setPresetPercent(null);
            }}
            onBack={() => setStep(1)}
            onSubmit={submit}
            pending={pending}
            error={error}
          />
        )}
      </article>

      <p className="mt-6 text-center text-[12px] text-ink-500">
        Šiuos pasirinkimus galėsi pakeisti bet kada nustatymuose.
      </p>
    </div>
  );
}

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div
      className="mb-6 flex items-center justify-center gap-1.5"
      aria-label={`Žingsnis ${current} iš ${total}`}
    >
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          aria-hidden
          className={`h-1.5 rounded-full transition-all ${
            i + 1 === current ? "w-6 bg-accent" : "w-1.5 bg-ink-100"
          }`}
        />
      ))}
    </div>
  );
}

function ProfessionStep({
  value,
  onChange,
  onContinue,
  onSkip,
}: {
  value: string;
  onChange: (key: string) => void;
  onContinue: () => void;
  onSkip: () => void;
}) {
  return (
    <>
      <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-accent/[0.08] px-3 py-1.5 text-eyebrow text-accent">
        <span aria-hidden className="block h-1.5 w-1.5 rounded-full bg-accent" />
        1 žingsnis iš 2
      </span>
      <h1 className="mt-5 text-[26px] font-semibold leading-[1.1] tracking-[-0.028em] text-ink-900/90 text-balance sm:text-[28px]">
        Kokia tavo sritis?
      </h1>
      <p className="mt-2 text-[14px] leading-[1.55] text-ink-500">
        Pasirink artimiausią sritį. Vėliau galėsi pridėti konkrečias paslaugas
        ir kainas.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {PROFESSIONS.map((p) => {
          const active = value === p.key;
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => onChange(p.key)}
              aria-pressed={active}
              className={`flex flex-col items-start gap-1 rounded-[18px] border px-5 py-4 text-left transition-colors ${
                active
                  ? "border-accent bg-accent-soft"
                  : "border-hair bg-cream hover:border-accent/40 hover:bg-white"
              }`}
            >
              <span
                className={`text-[16px] font-semibold tracking-[-0.018em] ${
                  active ? "text-accent-deep" : "text-ink-900/90"
                }`}
              >
                {p.title}
              </span>
              <span className="text-[12px] leading-[1.45] text-ink-500">
                {p.sub}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onChange(FALLBACK_KEY)}
        aria-pressed={value === FALLBACK_KEY}
        className={`mt-3 w-full rounded-[14px] border px-4 py-3 text-[13px] font-medium transition-colors ${
          value === FALLBACK_KEY
            ? "border-accent bg-accent-soft text-accent-deep"
            : "border-hair bg-transparent text-ink-500 hover:border-accent/40 hover:text-ink-900/90"
        }`}
      >
        Mano srities nėra
      </button>

      <div className="mt-7 flex flex-col gap-2">
        <Button
          variant="primary"
          type="button"
          onClick={onContinue}
          className="!h-auto !rounded-[14px] !px-5 !py-3 !text-[14px]"
        >
          Tęsti →
        </Button>
        <button
          type="button"
          onClick={onSkip}
          className="self-center px-2 py-1 text-[13px] text-ink-500 hover:text-ink-900/90"
        >
          Praleisti
        </button>
      </div>
    </>
  );
}

function TaxStep({
  preset,
  custom,
  customOutOfRange,
  submitDisabled,
  onPickPreset,
  onCustomChange,
  onBack,
  onSubmit,
  pending,
  error,
}: {
  preset: number | null;
  custom: string;
  customOutOfRange: boolean;
  submitDisabled: boolean;
  onPickPreset: (v: number) => void;
  onCustomChange: (v: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  pending: boolean;
  error: string | null;
}) {
  return (
    <>
      <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-accent/[0.08] px-3 py-1.5 text-eyebrow text-accent">
        <span aria-hidden className="block h-1.5 w-1.5 rounded-full bg-accent" />
        2 žingsnis iš 2
      </span>
      <h1 className="mt-5 text-[26px] font-semibold leading-[1.1] tracking-[-0.028em] text-ink-900/90 text-balance sm:text-[28px]">
        Kiek atidėti mokesčiams?
      </h1>
      <p className="mt-2 text-[14px] leading-[1.55] text-ink-500">
        Monivo nuo kiekvienos pajamos paskaičiuos, kiek verta atsidėti.
        Pinigai lieka tavo banko sąskaitoje.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-2">
        {TAX_PRESETS.map((p) => {
          const active = preset === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPickPreset(p)}
              aria-pressed={active}
              className={`flex flex-col items-center rounded-[16px] border px-3 py-4 transition-colors ${
                active
                  ? "border-accent bg-accent-soft"
                  : "border-hair bg-cream hover:border-accent/40"
              }`}
            >
              <span
                className={`text-[26px] font-semibold leading-none tracking-tight tabular-nums ${
                  active ? "text-accent-deep" : "text-ink-900/90"
                }`}
              >
                {p}%
              </span>
            </button>
          );
        })}
      </div>

      <label className="mt-5 flex flex-col gap-1.5 text-[12px] font-medium text-ink-500">
        Arba įvesk savo
        <div
          className={`flex items-center rounded-[14px] border bg-white px-3.5 py-2.5 transition-colors focus-within:ring-2 focus-within:ring-accent/30 ${
            customOutOfRange
              ? "border-expense focus-within:border-expense focus-within:ring-expense/20"
              : custom !== ""
                ? "border-accent focus-within:border-accent"
                : "border-hair focus-within:border-accent"
          }`}
        >
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={2}
            value={custom}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/\D/g, "").slice(0, 2);
              onCustomChange(cleaned);
            }}
            aria-invalid={customOutOfRange || undefined}
            placeholder="Pvz. 27"
            className="w-full bg-transparent text-[16px] font-medium tabular-nums text-ink-900/90 placeholder:text-ink-500 focus:outline-none"
          />
          <span
            aria-hidden
            className="ml-2 text-[14px] font-medium text-ink-500"
          >
            %
          </span>
        </div>
        {customOutOfRange ? (
          <span className="text-[12px] font-normal text-expense">
            Įvesk skaičių nuo 0 iki 35.
          </span>
        ) : null}
      </label>

      {error ? (
        <p className="mt-5 rounded-[12px] bg-expense-bg px-3.5 py-2.5 text-[13px] text-expense">
          {error}
        </p>
      ) : null}

      <div className="mt-7 flex flex-col gap-2">
        <Button
          variant="primary"
          type="button"
          onClick={onSubmit}
          isLoading={pending}
          disabled={submitDisabled}
          className="!h-auto !rounded-[14px] !px-5 !py-3 !text-[14px]"
        >
          Baigti →
        </Button>
        <button
          type="button"
          onClick={onBack}
          disabled={pending}
          className="self-center px-2 py-1 text-[13px] text-ink-500 hover:text-ink-900/90 disabled:opacity-50"
        >
          Atgal
        </button>
      </div>
    </>
  );
}
