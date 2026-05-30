import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { APP_HOST, MARKETING_BASE_URL } from "@/lib/urls";

const siteUrl = MARKETING_BASE_URL;
const appHost = APP_HOST;

// Host-aware so app.monivo.lt never serves a sitemap of marketing URLs (a
// cross-host sitemap Google would reject). Only the marketing surface lists
// the public pages.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const h = await headers();
  const host = (h.get("host") ?? "").toLowerCase().split(":")[0];
  if (appHost !== "" && host === appHost) {
    return [];
  }

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
