import type { Metadata } from "next";
import Link from "next/link";
import { LandingLegalPage } from "@/components/landing/landing-legal-page";

export const metadata: Metadata = {
  title: "Privatumas",
  description:
    "Kaip Monivo tvarko ir saugo individualiai dirbančių grožio specialistų duomenis.",
};

export default function PrivacyPage() {
  return (
    <LandingLegalPage eyebrow="Privatumas" title="Privatumo nuostatos." updatedAt="2026-05-17">
      <p>
        Monivo padeda individualiai dirbantiems grožio specialistams sekti
        pajamas, išlaidas ir mokesčių rezervą. Šis dokumentas paaiškina,
        kokius duomenis renkame, kodėl ir kaip juos saugome.
      </p>

      <h2 className="mt-4 text-[20px] font-semibold tracking-[-0.022em] text-ink-900/90">
        Kokius duomenis renkame
      </h2>
      <p>
        Renkame tik tuos duomenis, kuriuos įvedate Monivo aplikacijoje:
        paslaugas, pajamų ir išlaidų įrašus, pasirinktą mokesčių procentą bei
        registracijos duomenis (el. paštą ir vardą).
      </p>

      <h2 className="mt-4 text-[20px] font-semibold tracking-[-0.022em] text-ink-900/90">
        Kam naudojame duomenis
      </h2>
      <p>
        Duomenys naudojami tik tam, kad galėtumėte matyti savo finansinį
        vaizdą Monivo aplikacijoje. Mes nedaliname duomenų reklamos
        platformoms ir neparduodame jų tretiesiems asmenims.
      </p>

      <h2 className="mt-4 text-[20px] font-semibold tracking-[-0.022em] text-ink-900/90">
        Saugojimas
      </h2>
      <p>
        Duomenys saugomi šifruoti Europos Sąjungos serveriuose. Bet kuriuo
        metu galite juos atsisiųsti CSV formatu arba paprašyti, kad būtų
        ištrinti.
      </p>

      <h2 className="mt-4 text-[20px] font-semibold tracking-[-0.022em] text-ink-900/90">
        Susisiekimas
      </h2>
      <p>
        Klausimais dėl privatumo susisiekite per{" "}
        <Link href="/kontaktai" className="text-accent-deep hover:underline">
          kontaktų puslapį
        </Link>
        . Atsakome per kelias darbo dienas.
      </p>

    </LandingLegalPage>
  );
}
