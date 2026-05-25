import Link from "next/link";
import type { ReactNode } from "react";
import { IconChevron } from "./settings-icons";

export function SettingsSection({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="px-1.5 pb-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-500">
        {label}
      </h2>
      <div className="overflow-hidden rounded-[22px] bg-surface shadow-[0_1px_2px_rgba(23,33,29,0.04),_0_8px_24px_rgba(23,33,29,0.05)]">
        {children}
      </div>
    </section>
  );
}

type RowProps = {
  icon?: ReactNode;
  label: string;
  detail?: string;
  right?: ReactNode;
  chevron?: boolean;
  href?: string;
  onClick?: () => void;
  last?: boolean;
  destructive?: boolean;
};

export function SettingsRow(props: RowProps) {
  const inner = <RowInner {...props} />;
  const className = `flex items-center gap-3.5 px-5 py-3.5 transition-colors ${
    props.last ? "" : "border-b border-hair"
  } ${props.href || props.onClick ? "hover:bg-cream/50 active:bg-cream" : ""}`;

  if (props.href) {
    return (
      <Link href={props.href} className={className}>
        {inner}
      </Link>
    );
  }
  if (props.onClick) {
    return (
      <button type="button" onClick={props.onClick} className={`w-full text-left ${className}`}>
        {inner}
      </button>
    );
  }
  return <div className={className}>{inner}</div>;
}

function RowInner({ icon, label, detail, right, chevron, destructive }: RowProps) {
  const labelColor = destructive ? "text-expense" : "text-ink-900/90";
  const showChevron = chevron ?? Boolean(detail);
  return (
    <>
      {icon ? (
        <span
          aria-hidden
          className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[9px] ${
            destructive
              ? "bg-expense-bg text-expense"
              : "bg-accent-soft text-accent-deep"
          }`}
        >
          {icon}
        </span>
      ) : null}
      <span
        className={`flex-1 truncate text-[15px] font-medium tracking-[-0.012em] ${labelColor}`}
      >
        {label}
      </span>
      {right ? (
        right
      ) : (
        <>
          {detail ? (
            <span className="text-[13px] text-ink-500">{detail}</span>
          ) : null}
          {showChevron ? (
            <span className="text-ink-500">
              <IconChevron />
            </span>
          ) : null}
        </>
      )}
    </>
  );
}
