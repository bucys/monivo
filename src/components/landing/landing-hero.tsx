import { Button } from "@/components/ui/button";
import { AppPreviewCard } from "./app-preview-card";
import { LandingContainer } from "./landing-container";
import { LandingCtaGroup } from "./landing-cta-group";
import { LandingSection } from "./landing-section";
import { PhoneFrame } from "./phone-frame";

type PreviewEntry = {
  label: string;
  amount: string;
  tone: "income" | "expense";
};

const previewEntries: ReadonlyArray<PreviewEntry> = [
  { label: "Gelinis lakavimas", amount: "+45 €", tone: "income" },
  { label: "Blakstienų papildymas", amount: "+60 €", tone: "income" },
  { label: "Priemonės", amount: "-18 €", tone: "expense" },
];

export function LandingHero() {
  return (
    <LandingSection>
      <LandingContainer>
        <div className="grid items-center gap-12 sm:grid-cols-2 sm:gap-16">
          <div className="flex flex-col items-start gap-6">
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

          <PhoneFrame ariaLabel="Monivo aplikacijos peržiūra">
            <div className="flex h-full flex-col gap-3 p-4">
              <AppPreviewCard
                label="Galiu išleisti"
                value="€1 350"
                footer="Mokesčiams atidėta · €145"
              />
              <div className="flex flex-col gap-2">
                {previewEntries.map((entry) => (
                  <PreviewRow key={entry.label} entry={entry} />
                ))}
              </div>
            </div>
          </PhoneFrame>
        </div>
      </LandingContainer>
    </LandingSection>
  );
}

function PreviewRow({ entry }: { entry: PreviewEntry }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-white px-3 py-2 shadow-card">
      <span className="text-caption text-ink-700">{entry.label}</span>
      <span
        className={
          entry.tone === "income"
            ? "text-caption tabular-nums text-income"
            : "text-caption tabular-nums text-expense"
        }
      >
        {entry.amount}
      </span>
    </div>
  );
}
