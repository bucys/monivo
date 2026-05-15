import { Button } from "@/components/ui/button";
import { AppPreviewCard } from "@/components/landing/app-preview-card";
import { LandingContainer } from "@/components/landing/landing-container";
import { LandingCtaGroup } from "@/components/landing/landing-cta-group";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingSection } from "@/components/landing/landing-section";
import { PhoneFrame } from "@/components/landing/phone-frame";

export default function LandingPage() {
  return (
    <>
      <LandingHeader wordmark="Monivo" />
      <main>
        <LandingSection>
          <LandingContainer>
            <div className="flex flex-col items-start gap-10">
              <h1 className="text-display text-ink-900">
                Pagaliau aišku kiek lieka.
              </h1>
              <LandingCtaGroup>
                <Button variant="primary">Pradėti nemokamai</Button>
                <Button variant="ghost">Kaip tai veikia →</Button>
              </LandingCtaGroup>
              <PhoneFrame ariaLabel="Monivo aplikacijos peržiūra">
                <div className="flex h-full flex-col gap-3 p-4">
                  <AppPreviewCard label="Gali išleisti" value="€1 247" />
                </div>
              </PhoneFrame>
            </div>
          </LandingContainer>
        </LandingSection>
      </main>
      <LandingFooter brand="© Monivo" />
    </>
  );
}
