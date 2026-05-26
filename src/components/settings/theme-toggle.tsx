"use client";

import { useEffect, useState, type ReactNode } from "react";
import { SettingsRow } from "@/components/settings/settings-card";
import { useT } from "@/i18n/locale-provider";
import {
  THEME_STORAGE_KEY,
  applyTheme,
  isThemeMode,
  resolvePreferred,
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

export function ThemeToggle({ icon }: { icon?: ReactNode }) {
  const t = useT();
  const labels = t.settings.app;
  // Start with the universal default ("device") so SSR + first client paint
  // agree. The real stored value loads in useEffect after mount.
  const [mode, setMode] = useState<ThemeMode>("device");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setMode(readStoredTheme());
    setHydrated(true);
  }, []);

  // Re-apply when the user toggles, and listen for system-preference changes
  // while in "device" mode (the silent default for users who haven't picked).
  useEffect(() => {
    if (!hydrated) return;
    applyTheme(mode);
    if (mode !== "device") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("device");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode, hydrated]);

  // "device" resolves to whatever the OS currently is — the tap then commits
  // the opposite of that effective state as an explicit choice.
  const isDark = hydrated ? resolvePreferred(mode) === "dark" : false;

  const toggle = () => {
    const next: ThemeMode = isDark ? "light" : "dark";
    setMode(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // ignore storage failures (private mode / disabled)
    }
  };

  return (
    <SettingsRow
      icon={icon}
      label={labels.appearance}
      chevron={false}
      right={
        <div className="inline-flex items-center gap-2.5">
          <span className="text-[13px] text-ink-500">
            {isDark ? labels.themeOptions.dark : labels.themeOptions.light}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={isDark}
            aria-label={labels.themeAria}
            onClick={toggle}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
              isDark ? "bg-accent" : "bg-ink-100"
            }`}
          >
            <span
              aria-hidden
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-surface shadow-[0_1px_2px_rgba(23,33,29,0.2)] transition-transform ${
                isDark ? "translate-x-[22px]" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      }
    />
  );
}
