"use client";

import { useLocale } from "@/i18n/locale-provider";
import type { Locale } from "@/i18n";

export function LandingLanguageToggle() {
  const { locale, setLocale, t } = useLocale();
  const labels = t.landing.languageToggle;
  const pick = (next: Locale) => {
    if (next === locale) return;
    setLocale(next);
  };
  return (
    <div
      role="group"
      aria-label={labels.aria}
      className="hidden items-center rounded-full border border-hair bg-white/40 p-0.5 text-[12px] font-semibold tracking-tight sm:inline-flex"
    >
      <button
        type="button"
        onClick={() => pick("lt")}
        aria-pressed={locale === "lt"}
        className={`rounded-full px-2.5 py-1 transition-colors ${
          locale === "lt"
            ? "bg-ink-900 text-white"
            : "text-ink-500 hover:text-ink-900"
        }`}
      >
        {labels.lt}
      </button>
      <button
        type="button"
        onClick={() => pick("en")}
        aria-pressed={locale === "en"}
        className={`rounded-full px-2.5 py-1 transition-colors ${
          locale === "en"
            ? "bg-ink-900 text-white"
            : "text-ink-500 hover:text-ink-900"
        }`}
      >
        {labels.en}
      </button>
    </div>
  );
}
