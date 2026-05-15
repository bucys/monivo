import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: ReactNode;
  hint?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { id, label, hint, className, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = hint ? `${inputId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <label htmlFor={inputId} className="text-caption text-ink-700">
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
        id={inputId}
        aria-describedby={hintId}
        className={cn(
          "h-13 w-full rounded-md bg-ink-100 px-4 text-body text-ink-900 placeholder:text-ink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          className,
        )}
        {...rest}
      />
      {hint ? (
        <span id={hintId} className="text-caption text-ink-500">
          {hint}
        </span>
      ) : null}
    </div>
  );
});
