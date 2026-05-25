import { getT } from "@/i18n/server";
import { LandingContainer } from "./landing-container";
import { LandingSection } from "./landing-section";

const TONES: ReadonlyArray<{ bg: string; text: string }> = [
  { bg: "bg-income-bg", text: "text-income" },
  { bg: "bg-tax-bg", text: "text-tax" },
  { bg: "bg-[#EDE6FF]", text: "text-[#5B3FAA]" },
];

export async function LandingProblem() {
  const { t } = await getT();
  const p = t.landing.problem;
  return (
    <LandingSection className="!pb-20 !pt-10 sm:!pb-24 sm:!pt-14">
      <LandingContainer>
        <div className="mx-auto max-w-[1040px]">
          <div className="mb-14 flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-accent/[0.08] px-3 py-1.5 text-eyebrow text-accent">
              <span aria-hidden className="block h-1.5 w-1.5 rounded-full bg-accent" />
              {p.eyebrow}
            </span>
            <h2 className="mt-5 text-[32px] font-semibold leading-[1.05] tracking-[-0.033em] text-ink-900/90 text-balance sm:text-[44px]">
              {p.title}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {p.pains.map((pain, i) => {
              const tone = TONES[i] ?? TONES[0]!;
              return (
                <article
                  key={pain.q}
                  className="flex flex-col gap-4 rounded-[24px] border border-hair bg-surface p-7 shadow-card"
                >
                  <p className="rounded-[14px] bg-cream px-4 py-3.5 text-[16px] italic leading-[1.4] tracking-tight text-ink-500">
                    {pain.q}
                  </p>
                  <div className="flex items-center gap-2.5">
                    <span
                      aria-hidden
                      className={`flex h-7 w-7 items-center justify-center rounded-[9px] text-[14px] font-bold ${tone.bg} ${tone.text}`}
                    >
                      →
                    </span>
                    <p className="text-[16px] font-medium leading-[1.4] tracking-tight text-ink-900/90">
                      {pain.a}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </LandingContainer>
    </LandingSection>
  );
}
