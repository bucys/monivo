"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "@/i18n";
import { useT } from "@/i18n/locale-provider";
import type { Dictionary } from "@/i18n";
import { completeOnboarding } from "./actions";

type Profession = "nails" | "lashes" | "cosmetology" | "hair" | "other";

type ProfessionCardId = "hair" | "nails" | "face" | "body";

type ProfessionCard = {
  key: ProfessionCardId;
  id: Profession;
};

const PROFESSIONS: ReadonlyArray<ProfessionCard> = [
  { key: "hair", id: "hair" },
  { key: "nails", id: "nails" },
  { key: "face", id: "cosmetology" },
  { key: "body", id: "other" },
];

const FALLBACK_KEY = "none";

type ActivityType = "iv" | "vl" | "simple";

function cleanAmount(raw: string) {
  const normalized = raw.replace(/[^\d.,]/g, "").replace(/\./g, ",");
  const first = normalized.indexOf(",");
  if (first === -1) return normalized;
  return (
    normalized.slice(0, first + 1) +
    normalized.slice(first + 1).replace(/,/g, "").slice(0, 2)
  );
}

export default function OnboardingPage() {
  const t = useT();
  const to = t.onboarding;
  const [step, setStep] = useState<1 | 2>(1);
  const [professionKey, setProfessionKey] = useState<string>(FALLBACK_KEY);
  const profession: Profession =
    PROFESSIONS.find((p) => p.key === professionKey)?.id ?? "other";
  const [activity, setActivity] = useState<ActivityType>("simple");
  const [vlYearly, setVlYearly] = useState<string>("");
  const [vlValidUntil, setVlValidUntil] = useState<string>("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (pending) return;
    setError(null);
    const fd = new FormData();
    fd.set("profession", profession);
    fd.set("activity", activity);
    if (activity === "vl") {
      if (vlYearly.trim() !== "") fd.set("vl_yearly_cost", vlYearly);
      if (vlValidUntil) fd.set("vl_valid_until", vlValidUntil);
    }
    startTransition(async () => {
      try {
        await completeOnboarding(fd);
      } catch (e) {
        setError(e instanceof Error ? e.message : to.errors.generic);
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

      <article className="rounded-[24px] border border-hair bg-surface p-7 shadow-card sm:p-8">
        <StepDots current={step} total={2} ariaTemplate={to.stepAria} />

        {step === 1 ? (
          <ProfessionStep
            value={professionKey}
            onChange={setProfessionKey}
            onContinue={() => setStep(2)}
            onSkip={() => {
              setProfessionKey(FALLBACK_KEY);
              setStep(2);
            }}
            t={t}
          />
        ) : (
          <ActivityStep
            value={activity}
            onChange={setActivity}
            vlYearly={vlYearly}
            onVlYearlyChange={setVlYearly}
            vlValidUntil={vlValidUntil}
            onVlValidUntilChange={setVlValidUntil}
            onBack={() => setStep(1)}
            onSubmit={submit}
            pending={pending}
            error={error}
            t={t}
          />
        )}
      </article>

      <p className="mt-6 text-center text-[12px] text-ink-500">{to.footer}</p>
    </div>
  );
}

function StepDots({
  current,
  total,
  ariaTemplate,
}: {
  current: number;
  total: number;
  ariaTemplate: string;
}) {
  return (
    <div
      className="mb-6 flex items-center justify-center gap-1.5"
      aria-label={format(ariaTemplate, { current, total })}
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
  t,
}: {
  value: string;
  onChange: (key: string) => void;
  onContinue: () => void;
  onSkip: () => void;
  t: Dictionary;
}) {
  const to = t.onboarding;
  return (
    <>
      <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-accent/[0.08] px-3 py-1.5 text-eyebrow text-accent">
        <span aria-hidden className="block h-1.5 w-1.5 rounded-full bg-accent" />
        {format(to.stepCounter, { current: 1, total: 2 })}
      </span>
      <h1 className="mt-5 text-[26px] font-semibold leading-[1.1] tracking-[-0.028em] text-ink-900/90 text-balance sm:text-[28px]">
        {to.profession.title}
      </h1>
      <p className="mt-2 text-[14px] leading-[1.55] text-ink-500">
        {to.profession.subtitle}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {PROFESSIONS.map((p) => {
          const active = value === p.key;
          const card = to.profession.cards[p.key];
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => onChange(p.key)}
              aria-pressed={active}
              className={`flex flex-col items-start gap-1 rounded-[18px] border px-5 py-4 text-left transition-colors ${
                active
                  ? "border-accent bg-accent-soft"
                  : "border-hair bg-cream hover:border-accent/40 hover:bg-surface"
              }`}
            >
              <span
                className={`text-[16px] font-semibold tracking-[-0.018em] ${
                  active ? "text-accent-deep" : "text-ink-900/90"
                }`}
              >
                {card.title}
              </span>
              <span className="text-[12px] leading-[1.45] text-ink-500">
                {card.sub}
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
        {to.profession.none}
      </button>

      <div className="mt-7 flex flex-col gap-2">
        <Button
          variant="primary"
          type="button"
          onClick={onContinue}
          className="!h-auto !rounded-[14px] !px-5 !py-3 !text-[14px]"
        >
          {to.actions.continue}
        </Button>
        <button
          type="button"
          onClick={onSkip}
          className="self-center px-2 py-1 text-[13px] text-ink-500 hover:text-ink-900/90"
        >
          {to.actions.skip}
        </button>
      </div>
    </>
  );
}

const ACTIVITY_OPTIONS: ReadonlyArray<ActivityType> = ["iv", "vl", "simple"];

function ActivityStep({
  value,
  onChange,
  vlYearly,
  onVlYearlyChange,
  vlValidUntil,
  onVlValidUntilChange,
  onBack,
  onSubmit,
  pending,
  error,
  t,
}: {
  value: ActivityType;
  onChange: (v: ActivityType) => void;
  vlYearly: string;
  onVlYearlyChange: (v: string) => void;
  vlValidUntil: string;
  onVlValidUntilChange: (v: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  pending: boolean;
  error: string | null;
  t: Dictionary;
}) {
  const to = t.onboarding;
  return (
    <>
      <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-accent/[0.08] px-3 py-1.5 text-eyebrow text-accent">
        <span aria-hidden className="block h-1.5 w-1.5 rounded-full bg-accent" />
        {format(to.stepCounter, { current: 2, total: 2 })}
      </span>
      <h1 className="mt-5 text-[26px] font-semibold leading-[1.1] tracking-[-0.028em] text-ink-900/90 text-balance sm:text-[28px]">
        {to.tax.title}
      </h1>
      <p className="mt-2 text-[14px] leading-[1.55] text-ink-500">
        {to.tax.subtitle}
      </p>

      <div className="mt-6 flex flex-col gap-2">
        {ACTIVITY_OPTIONS.map((option) => {
          const card = to.tax.cards[option];
          const active = value === option;
          const vlExpanded = option === "vl" && active;
          return (
            <div
              key={option}
              className={`overflow-hidden rounded-[18px] border transition-colors ${
                active
                  ? "border-accent bg-accent-soft"
                  : "border-hair bg-cream hover:border-accent/40"
              }`}
            >
              <button
                type="button"
                onClick={() => onChange(option)}
                aria-pressed={active}
                aria-expanded={option === "vl" ? active : undefined}
                className="flex w-full flex-col items-start gap-1 px-5 py-4 text-left"
              >
                <span
                  className={`text-[15px] font-semibold tracking-[-0.012em] ${
                    active ? "text-accent-deep" : "text-ink-900/90"
                  }`}
                >
                  {card.title}
                </span>
                <span className="text-[12px] leading-[1.45] text-ink-500">
                  {card.sub}
                </span>
              </button>

              {option === "vl" ? (
                <div
                  className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                    vlExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                  aria-hidden={!vlExpanded}
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-col gap-3 border-t border-accent/20 px-5 pb-5 pt-4">
                      <p className="text-[12px] leading-[1.5] text-ink-500">
                        {to.tax.vlHelper}
                      </p>
                      <label className="flex flex-col gap-1.5 text-[12px] font-medium text-ink-500">
                        {t.settings.tax.vl.yearlyCostLabel}
                        <div className="flex items-center rounded-[14px] border border-hair bg-surface px-3.5 py-2.5 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={vlYearly}
                            onChange={(e) =>
                              onVlYearlyChange(cleanAmount(e.target.value))
                            }
                            placeholder={t.settings.tax.vl.yearlyCostPlaceholder}
                            tabIndex={vlExpanded ? 0 : -1}
                            className="w-full bg-transparent text-[16px] font-medium tabular-nums text-ink-900/90 placeholder:text-ink-500 focus:outline-none"
                          />
                          <span
                            aria-hidden
                            className="ml-2 text-[14px] font-medium text-ink-500"
                          >
                            €
                          </span>
                        </div>
                      </label>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[12px] font-medium text-ink-500">
                          {t.settings.tax.vl.validUntilLabel}
                        </span>
                        <DatePicker
                          value={vlValidUntil}
                          onChange={onVlValidUntilChange}
                          placeholder={t.settings.tax.vl.validUntilLabel}
                          ariaLabel={t.settings.tax.vl.validUntilLabel}
                          disabled={!vlExpanded}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-[12px] leading-[1.5] text-ink-500">
        {to.tax.hint}
      </p>

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
          disabled={pending}
          className="!h-auto !rounded-[14px] !px-5 !py-3 !text-[14px]"
        >
          {to.actions.finish}
        </Button>
        <button
          type="button"
          onClick={onBack}
          disabled={pending}
          className="self-center px-2 py-1 text-[13px] text-ink-500 hover:text-ink-900/90 disabled:opacity-50"
        >
          {to.actions.back}
        </button>
      </div>
    </>
  );
}
