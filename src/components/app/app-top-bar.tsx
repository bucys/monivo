import type { ReactNode } from "react";

export type AppTopBarProps = {
  title: ReactNode;
  action?: ReactNode;
};

export function AppTopBar({ title, action }: AppTopBarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-100 bg-cream/85 pt-[env(safe-area-inset-top)] backdrop-blur supports-[backdrop-filter]:bg-cream/70">
      <div className="mx-auto flex h-14 max-w-screen-sm items-center justify-between gap-3 px-5">
        <h1 className="text-h2 text-ink-900">{title}</h1>
        {action ? <div>{action}</div> : null}
      </div>
    </header>
  );
}
