import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LandingContainer } from "./landing-container";
import { LandingCtaGroup } from "./landing-cta-group";
import { LandingSection } from "./landing-section";

export function LandingHero() {
  return (
    <LandingSection className="!pb-4 !pt-32 sm:!pb-8 sm:!pt-44">
      <LandingContainer>
        <div className="grid items-start gap-14 sm:grid-cols-[1.05fr_1fr] sm:gap-20">
          <div className="flex flex-col items-start gap-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-caption text-accent">
              <span aria-hidden className="block h-1.5 w-1.5 rounded-full bg-accent" />
              Grožio specialistams Lietuvoje
            </span>
            <h1 className="text-display text-ink-900">
              Pagaliau aišku kiek lieka.
            </h1>
            <p className="max-w-md text-body text-ink-700">
              Monivo padeda grožio specialistams kasdien matyti, kiek pinigų
              iš tiesų jų — be apskaitos, be streso.
            </p>
            <LandingCtaGroup>
              <Button variant="primary">Pradėti nemokamai</Button>
              <Button variant="ghost">Kaip tai veikia →</Button>
            </LandingCtaGroup>
            <p className="text-caption text-ink-500">
              Be Excel. Be buhalterinės kalbos. Be streso.
            </p>
          </div>

          <div className="mx-auto w-full max-w-xs">
            <Image
              src="/landing/hero-phone.png"
              alt="Monivo aplikacijos peržiūra: galiu išleisti €1 350, mokesčiams atidėta €145, šios dienos pajamų ir išlaidų sąrašas."
              width={464}
              height={538}
              priority
              sizes="(min-width: 640px) 320px, 100vw"
              className="h-auto w-full"
            />
          </div>
        </div>
      </LandingContainer>
    </LandingSection>
  );
}
