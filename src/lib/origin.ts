/**
 * Server-only helper for building redirect URLs back to the browser.
 *
 * `0.0.0.0` is a bind/listen address — never a routable host. When the dev
 * server runs with `-H 0.0.0.0`, an incoming request's URL also reports that
 * host, and naïvely re-using it for redirects sends users to a URL their
 * browser can't reach.
 *
 * Replacement preference:
 *   1. `NEXT_PUBLIC_SITE_URL` if set (e.g. "https://app.monivo.lt")
 *   2. `http://localhost:<port>` preserving the inbound port
 */
export function safeOrigin(rawUrl: string | URL): string {
  const url = typeof rawUrl === "string" ? new URL(rawUrl) : rawUrl;
  if (url.hostname === "0.0.0.0") {
    const envSite = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
    if (envSite) return envSite;
    const port = url.port ? `:${url.port}` : "";
    return `http://localhost${port}`;
  }
  return url.origin;
}
