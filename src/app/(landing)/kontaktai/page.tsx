import type { Metadata } from "next";
import { LandingContactForm } from "@/components/landing/landing-contact-form";
import { LandingLegalPage } from "@/components/landing/landing-legal-page";
import { getT } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Kontaktai",
  description: "Kaip susisiekti su Monivo komanda.",
  alternates: { canonical: "/kontaktai" },
};

export default async function ContactPage() {
  const { t } = await getT();
  const c = t.landing.contact;
  return (
    <LandingLegalPage eyebrow={c.eyebrow} title={c.title} updatedAt={c.updatedAt}>
      <p>{c.intro}</p>

      <LandingContactForm />

      <p>{c.outro}</p>
    </LandingLegalPage>
  );
}
