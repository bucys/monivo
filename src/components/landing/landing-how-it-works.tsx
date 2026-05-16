import { LandingContainer } from "./landing-container";
import { LandingSection } from "./landing-section";

type Step = {
  number: string;
  title: string;
  body: string;
};

const steps: ReadonlyArray<Step> = [
  {
    number: "1",
    title: "Įvedi pajamas vienu paspaudimu.",
    body: "Be lentelių, be kategorijų jūros. Tiek, kiek reikia šiandien.",
  },
  {
    number: "2",
    title: "Monivo automatiškai atideda mokesčius.",
    body: "Procentą nustatai vieną kartą. Toliau viskas dirba pati.",
  },
  {
    number: "3",
    title: "Matai tik tai, ką tikrai gali išleisti.",
    body: "Vienas skaičius pagrindiniame ekrane. Daugiau nieko nereikia.",
  },
];

export function LandingHowItWorks() {
  return (
    <LandingSection>
      <LandingContainer>
        <div className="flex flex-col gap-14">
          <div className="flex max-w-xl flex-col gap-4">
            <span className="text-caption uppercase tracking-[0.18em] text-accent">
              Kaip tai veikia
            </span>
            <h2 className="text-h1 text-ink-900">Trys žingsniai.</h2>
            <p className="text-body text-ink-700">
              Atliksi juos greičiau, nei išgersi kavą.
            </p>
          </div>
          <ol className="grid gap-12 md:grid-cols-3 md:gap-10">
            {steps.map((step) => (
              <li key={step.number} className="flex flex-col gap-4">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-body-strong tabular-nums text-accent">
                  {step.number}
                </span>
                <h3 className="text-h2 text-ink-900">{step.title}</h3>
                <p className="text-body text-ink-700">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </LandingContainer>
    </LandingSection>
  );
}
