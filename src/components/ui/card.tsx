import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type CardVariant = "default" | "hero";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
  children: ReactNode;
};

const variants: Record<CardVariant, string> = {
  default: "rounded-lg shadow-card p-5",
  hero: "rounded-xl shadow-hero p-6",
};

export function Card({
  className,
  variant = "default",
  children,
  ...rest
}: CardProps) {
  return (
    <div className={cn("bg-white", variants[variant], className)} {...rest}>
      {children}
    </div>
  );
}
