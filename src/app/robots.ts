import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_MARKETING_URL?.replace(/\/$/, "") ??
  "https://monivo.lt";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Authenticated product routes — they redirect crawlers to /login and
        // hold only private data. Auth routes (/login, /register) are
        // deliberately NOT disallowed: they carry a `noindex` meta tag, and a
        // disallow would stop crawlers from fetching the page to see it.
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
