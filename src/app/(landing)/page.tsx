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

export default function LandingPage() {
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
        brand="© Monivo"
        links={
          <>
            <Link href="/privatumas" className="hover:text-ink-700">
              Privatumas
            </Link>
            <Link href="/salygos" className="hover:text-ink-700">
              Sąlygos
            </Link>
            <Link href="/kontaktai" className="hover:text-ink-700">
              Kontaktai
            </Link>
          </>
        }
      />
    </>
  );
}
