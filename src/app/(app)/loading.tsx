import { AppScreen } from "@/components/app/app-screen";

/**
 * Default loading state for any (app) route. Next.js shows this while the
 * page segment's server data is being fetched, keeping the persistent
 * sidebar/top-bar mounted so navigation feels instant. Intentionally
 * minimal — a few neutral placeholder cards rather than a route-specific
 * skeleton — so it works as a calm fallback for every tab.
 */
export default function AppLoading() {
  return (
    <AppScreen>
      <div className="flex flex-col gap-[18px] lg:gap-[22px]">
        <Placeholder className="h-[88px] lg:h-[108px]" />
        <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2 lg:gap-[18px]">
          <Placeholder className="h-[96px]" />
          <Placeholder className="h-[96px]" />
        </div>
        <Placeholder className="h-[200px] lg:h-[240px]" />
      </div>
    </AppScreen>
  );
}

function Placeholder({ className }: { className: string }) {
  return (
    <div
      aria-hidden
      className={`animate-pulse rounded-[18px] border border-hair bg-surface/70 ${className}`}
    />
  );
}
