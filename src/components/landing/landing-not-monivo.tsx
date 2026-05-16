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
        <div className="grid items-start gap-12 sm:grid-cols-[1fr_1.1fr] sm:gap-20">
          <div className="flex flex-col gap-5">
            <span className="text-caption uppercase tracking-[0.18em] text-ink-500">
              Monivo nėra
            </span>
            <ul className="flex flex-col gap-2 text-body text-ink-500">
              {notList.map((item) => (
                <li key={item}>— {item}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-5">
            <span className="text-caption uppercase tracking-[0.18em] text-accent">
              Monivo yra
            </span>
            <h2 className="text-h1 text-ink-900">
              Vienas skaičius, kuriuo gali pasitikėti.
            </h2>
            <p className="text-body text-ink-700">
              Aiškumas, kurio ieškojai kiekvieną mėnesio pabaigą — nesigilindama
              į apskaitą.
            </p>
          </div>
        </div>
      </LandingContainer>
    </LandingSection>
  );
}
