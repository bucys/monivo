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

const DEFAULT_MARKETING_BASE = "https://monivo.lt";
const DEFAULT_APP_BASE = "https://app.monivo.lt";

/**
 * Produce a clean, absolute base URL (scheme + host[:port], no trailing slash)
 * from a possibly messy env value.
 *
 * Hardened against protocol corruption: a value whose scheme is missing or
 * mangled (e.g. `ttps://monivo.lt`, `//monivo.lt`, `monivo.lt`) is repaired to
 * `https://` on the same host rather than emitted verbatim — which is what
 * produced `ttps://monivo.lt` in the sitemap/robots output. A valid http(s)
 * value (including dev `http://localhost`/LAN origins) is preserved as-is.
 * Anything unparseable falls back to `fallback`.
 */
export function normalizeBaseUrl(
  raw: string | undefined,
  fallback: string,
): string {
  const trimmed = (raw ?? "").trim().replace(/\/+$/, "");
  if (!trimmed) return fallback;

  // Already a well-formed http(s) URL — keep the original scheme (preserves
  // http:// for dev/LAN) and just normalize origin + path.
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const u = new URL(trimmed);
      return `${u.origin}${u.pathname.replace(/\/+$/, "")}`;
    } catch {
      return fallback;
    }
  }

  // Missing or corrupted scheme: strip any scheme-ish prefix + leading slashes,
  // then re-apply a guaranteed-correct https:// scheme.
  const host = trimmed.replace(/^[^/]*\/\/+/, "").replace(/^\/+/, "");
  try {
    const u = new URL(`https://${host}`);
    return `${u.origin}${u.pathname.replace(/\/+$/, "")}`;
  } catch {
    return fallback;
  }
}

/**
 * Canonical, always-absolute marketing base (e.g. `https://monivo.lt`) for SEO
 * surfaces — sitemap, robots, canonical tags, metadataBase, structured data.
 * Unlike `MARKETING_URL`, this never returns an empty string and never a
 * corrupted protocol.
 */
export const MARKETING_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_MARKETING_URL,
  DEFAULT_MARKETING_BASE,
);

/** Canonical, always-absolute app base (e.g. `https://app.monivo.lt`). */
export const APP_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_SITE_URL,
  DEFAULT_APP_BASE,
);

/** Hostname of the app surface, used to make robots/sitemap host-aware. */
export const APP_HOST = (() => {
  try {
    return new URL(APP_BASE_URL).hostname;
  } catch {
    return "";
  }
})();

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
