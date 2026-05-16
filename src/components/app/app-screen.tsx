import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type AppScreenProps = {
  children: ReactNode;
  className?: string;
};

export function AppScreen({ children, className }: AppScreenProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-screen-sm px-5 py-6 lg:max-w-[1100px] lg:px-8 lg:py-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
