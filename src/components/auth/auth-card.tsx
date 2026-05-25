import type { ReactNode } from "react";
import Link from "next/link";

export type AuthCardProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthCard({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: AuthCardProps) {
  return (
    <div className="w-full max-w-[420px]">
      <Link
        href="/"
        className="mb-8 flex items-center justify-center gap-2.5"
        aria-label="Monivo"
      >
        <span
          aria-hidden
          className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-gradient-to-br from-accent to-accent-deep text-[18px] font-bold leading-none tracking-tight text-white"
        >
          M
        </span>
        <span className="text-[18px] font-semibold tracking-tight text-ink-900">
          Monivo
        </span>
      </Link>

      <article className="rounded-[24px] border border-hair bg-surface p-7 shadow-card sm:p-8">
        <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-accent/[0.08] px-3 py-1.5 text-eyebrow text-accent">
          <span aria-hidden className="block h-1.5 w-1.5 rounded-full bg-accent" />
          {eyebrow}
        </span>
        <h1 className="mt-5 text-[26px] font-semibold leading-[1.1] tracking-[-0.028em] text-ink-900/90 text-balance sm:text-[28px]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 text-[14px] leading-[1.55] text-ink-500">
            {subtitle}
          </p>
        ) : null}

        <div className="mt-6">{children}</div>
      </article>

      <div className="mt-6 text-center text-[13px] text-ink-500">{footer}</div>
    </div>
  );
}
