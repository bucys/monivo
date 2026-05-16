import type { Metadata } from "next";
import Link from "next/link";
import { LandingLegalPage } from "@/components/landing/landing-legal-page";

export const metadata: Metadata = {
  title: "Naudojimo sąlygos",
  description:
    "Monivo naudojimo sąlygos individualiai dirbantiems grožio specialistams.",
};

export default function TermsPage() {
  return (
    <LandingLegalPage eyebrow="Sąlygos" title="Naudojimo sąlygos." updatedAt="2026-05-17">
      <p>
        Naudodami Monivo sutinkate su žemiau išdėstytomis sąlygomis. Jos
        parašytos paprastai, be juridinės kalbos — kad būtų aišku, ko
        tikimės iš abiejų pusių.
      </p>

      <h2 className="mt-4 text-[20px] font-semibold tracking-[-0.022em] text-ink-900/90">
        Ką Monivo daro
      </h2>
      <p>
        Monivo yra įrankis pajamoms, išlaidoms ir mokesčių rezervui sekti.
        Tai nėra apskaitos programa ir neatlieka oficialios apskaitos
        funkcijų.
      </p>

      <h2 className="mt-4 text-[20px] font-semibold tracking-[-0.022em] text-ink-900/90">
        Ko Monivo nedaro
      </h2>
      <p>
        Monivo nepatvirtina ir nepateikia mokesčių institucijoms jokių
        deklaracijų. Mokesčius už savo veiklą tvarkote patys arba per savo
        buhalterį. Skaičiai Monivo aplikacijoje yra orientaciniai.
      </p>

      <h2 className="mt-4 text-[20px] font-semibold tracking-[-0.022em] text-ink-900/90">
        Atsakomybė
      </h2>
      <p>
        Stengiamės, kad Monivo veiktų stabiliai ir tiksliai, bet
        negarantuojame nepertraukiamo veikimo. Rekomenduojame periodiškai
        eksportuoti savo duomenis.
      </p>

      <h2 className="mt-4 text-[20px] font-semibold tracking-[-0.022em] text-ink-900/90">
        Pakeitimai
      </h2>
      <p>
        Jei sąlygos keisis reikšmingai, informuosime prieš įsigaliojant
        pakeitimams. Klausimais dėl sąlygų susisiekite per{" "}
        <Link href="/kontaktai" className="text-accent-deep hover:underline">
          kontaktų puslapį
        </Link>
        .
      </p>

    </LandingLegalPage>
  );
}
