import { Card } from "@/components/ui/card";
import { LandingContainer } from "./landing-container";
import { LandingSection } from "./landing-section";

type Pain = {
  title: string;
  body: string;
};

const pains: ReadonlyArray<Pain> = [
  {
    title: "Nežinau, kiek šį mėnesį uždirbau.",
    body: "Pinigai ateina dalimis — grynais, pavedimu, Revolut. Galvoje suma neišlaiko.",
  },
  {
    title: "Mokesčių pinigai jau seniai išleisti.",
    body: "Atėjus laikui mokėti, sumos nelieka. Vėl spaudžia stresas.",
  },
  {
    title: "Excel — per daug. Banko app — per mažai.",
    body: "Tarp jų nėra nieko, kas tiesiog parodytų, kiek lieka tau.",
  },
];

export function LandingProblem() {
  return (
    <LandingSection className="!pt-4 sm:!pt-8">
      <LandingContainer>
        <div className="flex flex-col gap-12">
          <div className="flex max-w-xl flex-col gap-4">
            <span className="text-caption uppercase tracking-[0.18em] text-accent">
              Pažįstama?
            </span>
            <h2 className="text-h1 text-ink-900">
              Trys dalykai, kuriuos išgirsti beveik iš kiekvienos.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {pains.map((pain) => (
              <Card key={pain.title}>
                <h3 className="text-h2 text-ink-900">{pain.title}</h3>
                <p className="mt-3 text-body text-ink-700">{pain.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </LandingContainer>
    </LandingSection>
  );
}
