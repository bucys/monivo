"use client";

import { useLocale } from "@/i18n/locale-provider";
import { LOCALES, type Locale } from "@/i18n";

const LABEL: Record<Locale, string> = { lt: "LT", en: "EN" };

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();
  return (
    <div className="inline-flex rounded-full bg-cream p-1">
      {LOCALES.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLocale(l)}
            className={`min-w-[44px] rounded-full px-3 py-1.5 text-[12px] font-semibold uppercase transition-colors ${
              active
                ? "bg-surface text-ink-900/90 shadow-[0_1px_2px_rgba(23,33,29,0.08)]"
                : "text-ink-500 hover:text-ink-900/90"
            }`}
          >
            {LABEL[l]}
          </button>
        );
      })}
    </div>
  );
}
