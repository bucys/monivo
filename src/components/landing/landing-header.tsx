import type { ReactNode } from "react";
import { LandingContainer } from "./landing-container";

export type LandingHeaderProps = {
  wordmark: ReactNode;
  nav?: ReactNode;
  action?: ReactNode;
};

export function LandingHeader({ wordmark, nav, action }: LandingHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-cream/85 backdrop-blur supports-[backdrop-filter]:bg-cream/70">
      <LandingContainer>
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="text-h2 text-ink-900">{wordmark}</div>
          {nav ? <nav aria-label="Primary">{nav}</nav> : null}
          {action ? <div>{action}</div> : null}
        </div>
      </LandingContainer>
    </header>
  );
}
