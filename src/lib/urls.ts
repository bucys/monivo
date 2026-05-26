/**
 * Public URL helpers for the two-surface deploy:
 *   - marketing site at NEXT_PUBLIC_MARKETING_URL (e.g. https://monivo.lt)
 *   - authenticated app at NEXT_PUBLIC_SITE_URL  (e.g. https://app.monivo.lt)
 *
 * In local dev both surfaces share one origin, so leaving the env vars unset
 * makes the helpers fall back to relative paths (same-origin behavior).
 */

const stripTrail = (s: string) => s.replace(/\/$/, "");

export const APP_URL = stripTrail(process.env.NEXT_PUBLIC_SITE_URL ?? "");
export const MARKETING_URL = stripTrail(
  process.env.NEXT_PUBLIC_MARKETING_URL ?? "",
);

/** Link target for app routes (login, register, dashboard…). */
export function appHref(path: string): string {
  return APP_URL ? `${APP_URL}${path}` : path;
}

/** Link target for marketing routes (landing, legal, contact). */
export function marketingHref(path: string): string {
  return MARKETING_URL ? `${MARKETING_URL}${path}` : path;
}
