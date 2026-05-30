import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_MARKETING_URL?.replace(/\/$/, "") ??
  "https://monivo.lt";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    // Public marketing pages only. Auth/app routes are excluded — they are
    // noindex and live on the app subdomain.
    {
      url: `${siteUrl}/kontaktai`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/privatumas`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/salygos`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
