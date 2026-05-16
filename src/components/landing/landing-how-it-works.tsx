import { LandingContainer } from "./landing-container";
import { LandingSection } from "./landing-section";

type Step = {
  number: string;
  title: string;
  body: string;
};

const steps: ReadonlyArray<Step> = [
  {
    number: "01",
    title: "Įvedi pajamas vienu paspaudimu.",
    body: "Be lentelių, be kategorijų jūros. Tiek, kiek reikia šiandien.",
  },
  {
    number: "02",
    title: "Monivo automatiškai atideda mokesčius.",
    body: "Procentą nustatai vieną kartą. Toliau viskas dirba pati.",
  },
  {
    number: "03",
    title: "Matai tik tai, ką tikrai gali išleisti.",
    body: "Vienas skaičius pagrindiniame ekrane. Daugiau nieko nereikia.",
  },
];

export function LandingHowItWorks() {
  return (
    <LandingSection>
      <LandingContainer>
        <div className="flex flex-col gap-12">
          <div className="flex max-w-xl flex-col gap-3">
            <h2 className="text-h1 text-ink-900">Kaip tai veikia.</h2>
            <p className="text-body text-ink-700">
              Trys žingsniai, kuriuos atliksi greičiau, nei išgersi kavą.
            </p>
          </div>
          <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((step) => (
              <li key={step.number} className="flex flex-col gap-3">
                <span className="text-caption tabular-nums text-accent">
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
