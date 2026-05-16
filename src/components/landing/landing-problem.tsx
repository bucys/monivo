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
    <LandingSection>
      <LandingContainer>
        <div className="flex flex-col gap-10">
          <div className="flex max-w-xl flex-col gap-3">
            <h2 className="text-h1 text-ink-900">Tau jau pažįstama?</h2>
            <p className="text-body text-ink-700">
              Tris dalykus išgirsti beveik iš kiekvienos specialistės.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
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
