/** Client-side theme constants. The actual class-toggling for "device" mode
 *  reads `prefers-color-scheme`. The same logic is duplicated inside the
 *  pre-hydration bootstrap script in app/layout.tsx — keep them in sync. */

export type ThemeMode = "light" | "dark" | "device";

export const THEME_STORAGE_KEY = "monivo_theme";
export const THEMES: ReadonlyArray<ThemeMode> = ["light", "dark", "device"];

export function isThemeMode(v: unknown): v is ThemeMode {
  return v === "light" || v === "dark" || v === "device";
}

export function resolvePreferred(mode: ThemeMode): "light" | "dark" {
  if (mode !== "device") return mode;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const resolved = resolvePreferred(mode);
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.dataset.theme = resolved;
  root.style.colorScheme = resolved;
}
