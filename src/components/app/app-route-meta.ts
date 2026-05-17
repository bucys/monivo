export type AppRouteMeta = {
  title: string;
  sub: string;
};

const meta: Record<string, AppRouteMeta> = {
  "/dashboard": { title: "Apžvalga", sub: "Šis mėnuo" },
  "/activity": { title: "Veikla", sub: "Šis mėnuo" },
  "/insights": { title: "Įžvalgos", sub: "Šis mėnuo" },
  "/services": { title: "Paslaugos", sub: "Tavo" },
  "/settings": { title: "Nustatymai", sub: "Paskyra" },
};

const fallback: AppRouteMeta = { title: "Monivo", sub: "" };

export function getAppRouteMeta(pathname: string | null): AppRouteMeta {
  if (!pathname) return fallback;
  for (const key of Object.keys(meta)) {
    if (pathname === key || pathname.startsWith(`${key}/`)) {
      return meta[key]!;
    }
  }
  return fallback;
}
