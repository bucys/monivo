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
        disallow: ["/dashboard", "/activity", "/insights", "/settings", "/login"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
