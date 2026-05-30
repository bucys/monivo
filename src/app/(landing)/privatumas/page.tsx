import type { Metadata } from "next";
import Link from "next/link";
import { LandingLegalPage } from "@/components/landing/landing-legal-page";
import { getT } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Privatumas",
  description:
    "Kaip Monivo tvarko ir saugo individualiai dirbančių grožio specialistų duomenis.",
  alternates: { canonical: "/privatumas" },
};

export default async function PrivacyPage() {
  const { t } = await getT();
  const p = t.landing.privacy;
  return (
    <LandingLegalPage eyebrow={p.eyebrow} title={p.title} updatedAt={p.updatedAt}>
      <p>{p.intro}</p>

      <h2 className="mt-4 text-[20px] font-semibold tracking-[-0.022em] text-ink-900/90">
        {p.h_what}
      </h2>
      <p>{p.p_what}</p>

      <h2 className="mt-4 text-[20px] font-semibold tracking-[-0.022em] text-ink-900/90">
        {p.h_why}
      </h2>
      <p>{p.p_why}</p>

      <h2 className="mt-4 text-[20px] font-semibold tracking-[-0.022em] text-ink-900/90">
        {p.h_storage}
      </h2>
      <p>{p.p_storage}</p>

      <h2 className="mt-4 text-[20px] font-semibold tracking-[-0.022em] text-ink-900/90">
        {p.h_contact}
      </h2>
      <p>
        {p.p_contactA}
        <Link href="/kontaktai" className="text-accent-deep hover:underline">
          {p.p_contactLink}
        </Link>
        {p.p_contactB}
      </p>
    </LandingLegalPage>
  );
}
