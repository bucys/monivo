import type { ReactNode } from "react";
import Link from "next/link";
import { LandingContainer } from "./landing-container";
import { LandingFooter } from "./landing-footer";
import { LandingHeader } from "./landing-header";

export type LandingLegalPageProps = {
  eyebrow: string;
  title: string;
  updatedAt: string;
  children: ReactNode;
};

export function LandingLegalPage({
  eyebrow,
  title,
  updatedAt,
  children,
}: LandingLegalPageProps) {
  return (
    <>
      <LandingHeader />
      <main>
        <section className="reveal-on-scroll px-5 pb-20 pt-24 sm:px-8 sm:pb-24 sm:pt-28">
          <LandingContainer>
            <article className="mx-auto max-w-[720px]">
              <div className="flex flex-col items-start gap-3">
                <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-accent/[0.08] px-3 py-1.5 text-eyebrow text-accent">
                  <span aria-hidden className="block h-1.5 w-1.5 rounded-full bg-accent" />
                  {eyebrow}
                </span>
                <h1 className="text-[34px] font-semibold leading-[1.05] tracking-[-0.033em] text-ink-900/90 text-balance sm:text-[44px]">
                  {title}
                </h1>
                <p className="text-[13px] text-ink-500">
                  Atnaujinta {updatedAt}
                </p>
              </div>

              <div className="legal-prose mt-10 flex flex-col gap-6 text-[15px] leading-[1.65] text-ink-500">
                {children}
              </div>

              <p className="mt-12 border-t border-hair pt-6 text-[13px] text-ink-500">
                Grįžti į{" "}
                <Link href="/" className="text-accent-deep hover:underline">
                  pagrindinį puslapį
                </Link>
                .
              </p>
            </article>
          </LandingContainer>
        </section>
      </main>
      <LandingFooter
        brand="© Monivo"
        links={
          <>
            <Link href="/privatumas" className="hover:text-ink-700">
              Privatumas
            </Link>
            <Link href="/salygos" className="hover:text-ink-700">
              Sąlygos
            </Link>
            <Link href="/kontaktai" className="hover:text-ink-700">
              Kontaktai
            </Link>
          </>
        }
      />
    </>
  );
}
