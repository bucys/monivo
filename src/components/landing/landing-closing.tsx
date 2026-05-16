import { Button } from "@/components/ui/button";
import { LandingContainer } from "./landing-container";
import { LandingSection } from "./landing-section";

export function LandingClosing() {
  return (
    <LandingSection>
      <LandingContainer>
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 rounded-xl bg-white p-10 text-center shadow-card sm:p-14">
          <h2 className="text-display text-ink-900/90">
            Pradėk matyti, kiek iš tiesų lieka.
          </h2>
          <p className="max-w-md text-body text-ink-700">
            Be Excel. Be buhalterinės kalbos. Be streso.
          </p>
          <div className="w-full max-w-xs">
            <Button variant="primary">Pradėti nemokamai</Button>
          </div>
        </div>
      </LandingContainer>
    </LandingSection>
  );
}
