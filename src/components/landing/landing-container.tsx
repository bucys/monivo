import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type LandingContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function LandingContainer({
  className,
  children,
  ...rest
}: LandingContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full max-w-screen-md px-5 sm:px-8", className)}
      {...rest}
    >
      {children}
    </div>
  );
}
