import { LandingContainer } from "./landing-container";
import { LandingSection } from "./landing-section";

const notList: ReadonlyArray<string> = [
  "Ne rezervacijų sistema",
  "Ne buhalterinė programa",
  "Ne banko aplikacija",
  "Ne sudėtingi raportai",
];

export function LandingNotMonivo() {
  return (
    <LandingSection tone="soft">
      <LandingContainer>
        <div className="grid gap-12 sm:grid-cols-2 sm:gap-16">
          <div className="flex flex-col gap-5">
            <h2 className="text-h1 text-ink-900">Monivo nėra</h2>
            <ul className="flex flex-col gap-2 text-body text-ink-700">
              {notList.map((item) => (
                <li key={item}>— {item}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-5">
            <h2 className="text-h1 text-ink-900">Monivo yra</h2>
            <p className="text-body text-ink-700">
              Vienas skaičius, kuriuo gali pasitikėti. Aiškumas, kurio ieškojai
              kiekvieną mėnesio pabaigą.
            </p>
          </div>
        </div>
      </LandingContainer>
    </LandingSection>
  );
}
