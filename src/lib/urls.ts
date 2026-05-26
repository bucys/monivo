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

/**
 * True when `host` looks like a local/dev origin: `localhost`, `127.0.0.1`,
 * `0.0.0.0`, an `.local` mDNS name, or a private IPv4 range (`10.0.0.0/8`,
 * `172.16.0.0/12`, `192.168.0.0/16`). Accepts a raw `Host` header (port-tolerant).
 *
 * Host detection in middleware uses this so the two-domain routing only fires
 * on the actual public surfaces (monivo.lt / app.monivo.lt) — never on a dev
 * laptop or a phone hitting the dev server via LAN IP.
 */
export function isLanOrLocalHost(host: string): boolean {
  const h = host.split(":")[0]?.toLowerCase();
  if (!h) return false;
  if (h === "localhost" || h === "127.0.0.1" || h === "0.0.0.0") return true;
  if (h.endsWith(".local")) return true;
  const m = h.match(/^(\d{1,3})\.(\d{1,3})\.\d{1,3}\.\d{1,3}$/);
  if (!m) return false;
  const a = Number(m[1]);
  const b = Number(m[2]);
  if (a === 10) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  return false;
}
