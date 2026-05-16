import { LandingContainer } from "./landing-container";
import { LandingSection } from "./landing-section";

const audiences: ReadonlyArray<string> = [
  "Nagų meistrai",
  "Blakstienų meistrai",
  "Kosmetologai",
  "Kirpėjai",
  "Solo grožio specialistai",
];

export function LandingAudience() {
  return (
    <LandingSection>
      <LandingContainer>
        <div className="flex flex-col items-start gap-10">
          <div className="flex max-w-xl flex-col gap-4">
            <span className="text-caption uppercase tracking-[0.18em] text-accent">
              Kam skirta
            </span>
            <h2 className="text-h1 text-ink-900">Sukurta tau.</h2>
            <p className="text-body text-ink-700">
              Monivo skirta tiems, kurie dirba sau ir nenori tapti buhalteriais.
            </p>
          </div>
          <ul className="flex flex-wrap gap-2.5">
            {audiences.map((label) => (
              <li
                key={label}
                className="rounded-full bg-white px-4 py-2 text-body text-ink-900 shadow-card"
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
      </LandingContainer>
    </LandingSection>
  );
}
