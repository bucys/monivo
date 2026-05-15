import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type LandingSectionTone = "default" | "soft";

export type LandingSectionProps = HTMLAttributes<HTMLElement> & {
  tone?: LandingSectionTone;
  children: ReactNode;
};

const tones: Record<LandingSectionTone, string> = {
  default: "",
  soft: "bg-ink-100",
};

export function LandingSection({
  className,
  tone = "default",
  children,
  ...rest
}: LandingSectionProps) {
  return (
    <section className={cn("py-20 sm:py-32", tones[tone], className)} {...rest}>
      {children}
    </section>
  );
}
