import type { Metadata } from "next";
import Link from "next/link";
import { LandingClosing } from "@/components/landing/landing-closing";
import { LandingFaq } from "@/components/landing/landing-faq";
import { LandingFeatures } from "@/components/landing/landing-features";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingHowItWorks } from "@/components/landing/landing-how-it-works";
import { LandingPricing } from "@/components/landing/landing-pricing";
import { LandingProblem } from "@/components/landing/landing-problem";
import { getT } from "@/i18n/server";
import { MARKETING_BASE_URL } from "@/lib/urls";

const siteUrl = MARKETING_BASE_URL;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Organization + WebSite structured data. Helps Google build a Knowledge
// Panel / brand entity and understand the site name. Kept to stable, factual
// fields only — no marketing claims that could drift.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Monivo",
      url: siteUrl,
      logo: `${siteUrl}/icons/icon-512.png`,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Monivo",
      inLanguage: "lt-LT",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ],
};

export default async function LandingPage() {
  const { t } = await getT();
  const fo = t.landing.footer;

  // FAQPage structured data, built from the SAME dictionary array the
  // LandingFaq component renders (t.landing.faq.items) — no duplicated copy.
  // Locale is resolved by getT(), so the schema always matches the visible
  // language. Covers every question/answer shown on the page.
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.landing.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingProblem />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingPricing />
        <LandingFaq />
        <LandingClosing />
      </main>
      <LandingFooter
        brand={fo.brand}
        links={
          <>
            <Link href="/privatumas" className="hover:text-ink-700">
              {fo.privacy}
            </Link>
            <Link href="/salygos" className="hover:text-ink-700">
              {fo.terms}
            </Link>
            <Link href="/kontaktai" className="hover:text-ink-700">
              {fo.contact}
            </Link>
          </>
        }
      />
    </>
  );
}
