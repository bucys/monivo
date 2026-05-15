import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type PhoneFrameProps = {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
};

export function PhoneFrame({
  children,
  className,
  ariaLabel = "App preview",
}: PhoneFrameProps) {
  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn(
        "mx-auto w-full max-w-xs rounded-xl bg-ink-900 p-2 shadow-hero",
        className,
      )}
    >
      <div className="overflow-hidden rounded-lg bg-cream">
        <div className="aspect-[9/19] w-full">{children}</div>
      </div>
    </div>
  );
}
