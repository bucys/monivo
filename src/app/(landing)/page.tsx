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

export default async function LandingPage() {
  const { t } = await getT();
  const fo = t.landing.footer;
  return (
    <>
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
