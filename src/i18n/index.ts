import { en } from "./en";
import { lt, type Dictionary } from "./lt";

export type Locale = "lt" | "en";

export const LOCALES: ReadonlyArray<Locale> = ["lt", "en"];
export const DEFAULT_LOCALE: Locale = "lt";
export const LOCALE_COOKIE = "monivo_locale";

const DICTS: Record<Locale, Dictionary> = { lt, en };

export function getDictionary(locale: Locale): Dictionary {
  return DICTS[locale] ?? DICTS[DEFAULT_LOCALE];
}

export function isLocale(value: unknown): value is Locale {
  return value === "lt" || value === "en";
}

/** Replace {key} tokens with the values map */
export function format(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_m, key) =>
    key in vars ? String(vars[key]) : `{${key}}`,
  );
}

export type { Dictionary };
