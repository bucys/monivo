import type { ReactNode } from "react";
import { getT } from "@/i18n/server";
import { LandingContainer } from "./landing-container";
import { LandingSection } from "./landing-section";

const PlusIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
    <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const ReceiptIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
    <path
      d="M4 2.5h10v13l-2-1.2-1.5 1.2-1.5-1.2-1.5 1.2-1.5-1.2-2 1.2v-13Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M6.5 6.5h5M6.5 9.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const SparkleIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
    <path d="M9 1.5l1.9 5.6L16.5 9l-5.6 1.9L9 16.5l-1.9-5.6L1.5 9l5.6-1.9L9 1.5Z" fill="currentColor" />
  </svg>
);

const InsightsIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
    <path
      d="M3 14.5V8M7.5 14.5V4M12 14.5v-4.5M16.5 14.5V6.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const HeartIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
    <path
      d="M9 15.5S2.5 11.5 2.5 6.8a3.5 3.5 0 0 1 6.5-1.8 3.5 3.5 0 0 1 6.5 1.8C15.5 11.5 9 15.5 9 15.5Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

const PhoneIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
    <rect x="5" y="1.5" width="8" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8 13.5h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const VISUALS: ReadonlyArray<{ iconBg: string; iconText: string; icon: ReactNode }> = [
  { iconBg: "bg-income-bg", iconText: "text-income", icon: PlusIcon },
  { iconBg: "bg-expense-bg", iconText: "text-expense", icon: ReceiptIcon },
  { iconBg: "bg-tax-bg", iconText: "text-tax", icon: SparkleIcon },
  { iconBg: "bg-accent-soft", iconText: "text-accent-deep", icon: InsightsIcon },
  { iconBg: "bg-[#EDE6FF]", iconText: "text-[#5B3FAA]", icon: HeartIcon },
  { iconBg: "bg-[#FFEEDC]", iconText: "text-[#8E5A1E]", icon: PhoneIcon },
];

export async function LandingFeatures() {
  const { t } = await getT();
  const f = t.landing.features;
  return (
    <LandingSection id="galimybes" className="!pb-20 !pt-10 sm:!pb-24 sm:!pt-14">
      <LandingContainer>
        <div className="mx-auto max-w-[1040px]">
          <div className="mb-14 flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-accent/[0.08] px-3 py-1.5 text-eyebrow text-accent">
              <span aria-hidden className="block h-1.5 w-1.5 rounded-full bg-accent" />
              {f.eyebrow}
            </span>
            <h2 className="mt-5 text-[32px] font-semibold leading-[1.05] tracking-[-0.033em] text-ink-900/90 text-balance sm:text-[44px]">
              {f.title}
            </h2>
            <p className="mt-4 max-w-[560px] text-[17px] leading-[1.55] text-ink-500">
              {f.subtitle}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {f.items.map((feature, i) => {
              const v = VISUALS[i] ?? VISUALS[0]!;
              return (
                <article
                  key={feature.title}
                  className="flex flex-col rounded-[22px] border border-hair bg-white p-7 shadow-card"
                >
                  <span
                    aria-hidden
                    className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-[13px] ${v.iconBg} ${v.iconText}`}
                  >
                    {v.icon}
                  </span>
                  <h3 className="text-[18px] font-semibold tracking-[-0.022em] text-ink-900/90">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[1.5] text-ink-500">
                    {feature.body}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </LandingContainer>
    </LandingSection>
  );
}
