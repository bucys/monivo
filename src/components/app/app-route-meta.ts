import type { Dictionary } from "@/i18n";

export type AppRouteMeta = {
  title: string;
  sub: string;
};

export function getAppRouteMeta(
  t: Dictionary,
  pathname: string | null,
): AppRouteMeta {
  const map: Record<string, AppRouteMeta> = {
    "/dashboard": { title: t.nav.dashboard, sub: t.nav.dashboardSub },
    "/activity": { title: t.nav.activity, sub: t.nav.activitySub },
    "/insights": { title: t.nav.insights, sub: t.nav.insightsSub },
    "/services": { title: t.nav.services, sub: t.nav.servicesSub },
    "/settings": { title: t.nav.settings, sub: t.nav.settingsSub },
  };
  const fallback: AppRouteMeta = { title: "Monivo", sub: "" };
  if (!pathname) return fallback;
  for (const key of Object.keys(map)) {
    if (pathname === key || pathname.startsWith(`${key}/`)) {
      return map[key]!;
    }
  }
  return fallback;
}
