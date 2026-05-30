import type { Metadata } from "next";
import Link from "next/link";
import { LandingLegalPage } from "@/components/landing/landing-legal-page";
import { getT } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Naudojimo sąlygos",
  description:
    "Monivo naudojimo sąlygos individualiai dirbantiems grožio specialistams.",
  alternates: { canonical: "/salygos" },
};

export default async function TermsPage() {
  const { t } = await getT();
  const x = t.landing.terms;
  return (
    <LandingLegalPage eyebrow={x.eyebrow} title={x.title} updatedAt={x.updatedAt}>
      <p>{x.intro}</p>

      <h2 className="mt-4 text-[20px] font-semibold tracking-[-0.022em] text-ink-900/90">
        {x.h_what}
      </h2>
      <p>{x.p_what}</p>

      <h2 className="mt-4 text-[20px] font-semibold tracking-[-0.022em] text-ink-900/90">
        {x.h_notWhat}
      </h2>
      <p>{x.p_notWhat}</p>

      <h2 className="mt-4 text-[20px] font-semibold tracking-[-0.022em] text-ink-900/90">
        {x.h_liability}
      </h2>
      <p>{x.p_liability}</p>

      <h2 className="mt-4 text-[20px] font-semibold tracking-[-0.022em] text-ink-900/90">
        {x.h_changes}
      </h2>
      <p>
        {x.p_changesA}
        <Link href="/kontaktai" className="text-accent-deep hover:underline">
          {x.p_changesLink}
        </Link>
        {x.p_changesB}
      </p>
    </LandingLegalPage>
  );
}
