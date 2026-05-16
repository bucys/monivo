import Link from "next/link";
import { LandingAudience } from "@/components/landing/landing-audience";
import { LandingClosing } from "@/components/landing/landing-closing";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingHowItWorks } from "@/components/landing/landing-how-it-works";
import { LandingNotMonivo } from "@/components/landing/landing-not-monivo";
import { LandingProblem } from "@/components/landing/landing-problem";
import { LandingPromise } from "@/components/landing/landing-promise";

export default function LandingPage() {
  return (
    <>
      <LandingHeader
        wordmark="Monivo"
        action={
          <Link
            href="/login"
            className="text-body-strong text-ink-900 hover:text-accent"
          >
            Prisijungti
          </Link>
        }
      />
      <main>
        <LandingHero />
        <LandingProblem />
        <LandingPromise />
        <LandingHowItWorks />
        <LandingAudience />
        <LandingNotMonivo />
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
