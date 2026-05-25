"use client";

import { useEffect, useState } from "react";
import { useT } from "@/i18n/locale-provider";
import {
  THEMES,
  THEME_STORAGE_KEY,
  applyTheme,
  isThemeMode,
  type ThemeMode,
} from "@/lib/theme";

function readStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "device";
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeMode(raw) ? raw : "device";
  } catch {
    return "device";
  }
}

export function ThemeToggle() {
  const t = useT();
  const labels = t.settings.app.themeOptions;
  // Start with the universal default ("device") so SSR + first client paint
  // agree. The real stored value loads in useEffect after mount.
  const [mode, setMode] = useState<ThemeMode>("device");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setMode(readStoredTheme());
    setHydrated(true);
  }, []);

  // Re-apply when the user toggles, and listen for system-preference changes
  // while in "device" mode.
  useEffect(() => {
    if (!hydrated) return;
    applyTheme(mode);
    if (mode !== "device") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("device");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode, hydrated]);

  const pick = (next: ThemeMode) => {
    setMode(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // ignore storage failures (private mode / disabled)
    }
  };

  return (
    <div
      role="group"
      aria-label={t.settings.app.themeAria}
      className="inline-flex items-center gap-0.5 rounded-full bg-cream p-0.5 text-[12px] font-semibold tracking-tight ring-1 ring-hair"
    >
      {THEMES.map((opt) => {
        const active = mode === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => pick(opt)}
            aria-pressed={active}
            className={`rounded-full px-2.5 py-1 transition-colors ${
              active
                ? "bg-ink-900 text-white"
                : "text-ink-500 hover:text-ink-900"
            }`}
          >
            {labels[opt]}
          </button>
        );
      })}
    </div>
  );
}
