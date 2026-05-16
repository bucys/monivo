import type { ReactNode } from "react";
import { LandingContainer } from "./landing-container";

export type LandingFooterProps = {
  brand: ReactNode;
  links?: ReactNode;
};

export function LandingFooter({ brand, links }: LandingFooterProps) {
  return (
    <footer className="border-t border-ink-100 py-10 text-caption text-ink-500">
      <LandingContainer>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>{brand}</div>
          {links ? <div className="flex flex-wrap gap-6">{links}</div> : null}
        </div>
      </LandingContainer>
    </footer>
  );
}
