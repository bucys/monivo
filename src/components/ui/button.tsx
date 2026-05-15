import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  isLoading?: boolean;
  children: ReactNode;
};

const base =
  "inline-flex h-13 w-full items-center justify-center rounded-md px-5 text-body-strong transition duration-200 ease-out active:opacity-90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cream";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white",
  secondary: "border border-ink-300 bg-white text-ink-900",
  ghost: "bg-transparent text-accent",
  destructive: "bg-danger text-white",
};

export function Button({
  className,
  variant = "primary",
  isLoading,
  disabled,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(base, variants[variant], className)}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...rest}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden
      className="block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
    />
  );
}
