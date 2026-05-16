import type { Metadata } from "next";
import { LandingContactForm } from "@/components/landing/landing-contact-form";
import { LandingLegalPage } from "@/components/landing/landing-legal-page";

export const metadata: Metadata = {
  title: "Kontaktai",
  description: "Kaip susisiekti su Monivo komanda.",
};

export default function ContactPage() {
  return (
    <LandingLegalPage eyebrow="Kontaktai" title="Parašykite mums." updatedAt="2026-05-17">
      <p>
        Sukūrėme Monivo individualiai dirbantiems grožio specialistams. Jei
        turite klausimų, pastabų ar pasiūlymų — laukiame žinutės.
      </p>

      <LandingContactForm />

      <p>
        Jei norite pasidalinti, ko trūksta kasdienybėje, rašykite paprastai —
        be formalumų ir ilgų paaiškinimų.
      </p>
    </LandingLegalPage>
  );
}
