import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_MARKETING_URL?.replace(/\/$/, "") ??
  "https://monivo.lt";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
