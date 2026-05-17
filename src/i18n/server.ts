import { cookies } from "next/headers";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  getDictionary,
  isLocale,
  type Dictionary,
  type Locale,
} from "./index";

/**
 * Read the active locale on the server. Falls back to DEFAULT_LOCALE when the
 * cookie is missing or invalid. Use inside server components / route handlers.
 */
export async function getServerLocale(): Promise<Locale> {
  const store = await cookies();
  const raw = store.get(LOCALE_COOKIE)?.value;
  return isLocale(raw) ? raw : DEFAULT_LOCALE;
}

/**
 * Convenience: get both the active locale and its dictionary in one call.
 * Server-only — uses next/headers cookies().
 */
export async function getT(): Promise<{ locale: Locale; t: Dictionary }> {
  const locale = await getServerLocale();
  return { locale, t: getDictionary(locale) };
}
