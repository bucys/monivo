import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type LandingCtaGroupProps = {
  children: ReactNode;
  className?: string;
};

export function LandingCtaGroup({ children, className }: LandingCtaGroupProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:gap-4", className)}>
      {children}
    </div>
  );
}
