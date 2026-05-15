import type { MouseEventHandler, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ListRowProps = {
  leading?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  trailing?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

export function ListRow({
  leading,
  title,
  subtitle,
  trailing,
  onClick,
  className,
}: ListRowProps) {
  const content = (
    <>
      {leading ? (
        <span className="flex h-10 w-10 items-center justify-center text-ink-500">
          {leading}
        </span>
      ) : null}
      <span className="flex flex-1 flex-col">
        <span className="text-body text-ink-900">{title}</span>
        {subtitle ? (
          <span className="text-caption text-ink-500">{subtitle}</span>
        ) : null}
      </span>
      {trailing ? <span className="text-body text-ink-700">{trailing}</span> : null}
    </>
  );

  const baseClass = cn(
    "flex min-h-12 w-full items-center gap-3 px-4 py-3 text-left",
    className,
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(baseClass, "transition-colors active:bg-ink-100")}
      >
        {content}
      </button>
    );
  }

  return <div className={baseClass}>{content}</div>;
}
