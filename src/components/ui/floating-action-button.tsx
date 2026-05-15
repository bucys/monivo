import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type FloatingActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  icon?: ReactNode;
};

export function FloatingActionButton({
  className,
  label,
  icon,
  type = "button",
  ...rest
}: FloatingActionButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        "fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] left-1/2 z-40 inline-flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-accent text-white shadow-fab transition-transform duration-200 ease-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
        className,
      )}
      {...rest}
    >
      {icon ?? <PlusIcon />}
    </button>
  );
}

function PlusIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
