import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { APP_HOST, MARKETING_BASE_URL } from "@/lib/urls";

const siteUrl = MARKETING_BASE_URL;
const appHost = APP_HOST;

// The same Next app answers monivo.lt, www.monivo.lt and app.monivo.lt, so
// robots.txt must differ per host. Reading the Host header opts this route into
// dynamic rendering, which is what lets one deploy serve the right rules to
// each surface.
export default async function robots(): Promise<MetadataRoute.Robots> {
  const h = await headers();
  const host = (h.get("host") ?? "").toLowerCase().split(":")[0];
  const isAppHost = appHost !== "" && host === appHost;

  // app.monivo.lt is entirely private (every route is auth-gated or noindex).
  // Block the whole subdomain and don't advertise the marketing sitemap here.
  if (isAppHost) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  // Marketing surface (monivo.lt / www.monivo.lt): allow the public pages and
  // point crawlers at the sitemap. The app product routes are listed here too
  // as defence in depth, even though the marketing host redirects them away.
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/activity",
          "/insights",
          "/services",
          "/settings",
          "/onboarding",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
