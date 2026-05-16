import { Button } from "@/components/ui/button";
import { LandingContainer } from "./landing-container";
import { LandingSection } from "./landing-section";

export function LandingClosing() {
  return (
    <LandingSection>
      <LandingContainer>
        <div className="flex flex-col items-center gap-8 text-center">
          <h2 className="max-w-xl text-display text-ink-900">
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
