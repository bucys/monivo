import { Card } from "@/components/ui/card";
import { LandingContainer } from "./landing-container";
import { LandingSection } from "./landing-section";

export function LandingPromise() {
  return (
    <LandingSection tone="soft">
      <LandingContainer>
        <div className="flex flex-col items-center gap-12 text-center">
          <div className="flex max-w-xl flex-col gap-4">
            <span className="text-caption uppercase tracking-[0.18em] text-accent">
              Pažadas
            </span>
            <h2 className="text-h1 text-ink-900">
              Vienas skaičius. Visas aiškumas.
            </h2>
            <p className="text-body text-ink-700">
              Tiek tikrai gali išleisti šį mėnesį. Be galvosūkių, be mokesčių
              baimės.
            </p>
          </div>
          <Card variant="hero" className="w-full max-w-md">
            <div className="flex flex-col items-center gap-4 py-2">
              <span className="text-caption uppercase tracking-[0.16em] text-ink-500">
                Galiu išleisti
              </span>
              <span className="text-display tabular-nums text-ink-900">
                €1 350
              </span>
              <span className="text-caption text-ink-500">
                Pajamos €1 695 · Išlaidos €200 · Atidėta €145
              </span>
            </div>
          </Card>
        </div>
      </LandingContainer>
    </LandingSection>
  );
}
