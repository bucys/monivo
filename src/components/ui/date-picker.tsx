"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ModalSheet } from "@/components/ui/modal-sheet";
import { useT, useLocale } from "@/i18n/locale-provider";
import { cn } from "@/lib/cn";

export type DatePickerProps = {
  /** ISO yyyy-mm-dd string, or "" when empty. */
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  /** ISO yyyy-mm-dd inclusive lower bound. */
  minDate?: string;
  /** ISO yyyy-mm-dd inclusive upper bound. */
  maxDate?: string;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
};

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function isValidDate(d: unknown): d is Date {
  return d instanceof Date && !Number.isNaN(d.getTime());
}

function toIso(d: Date): string {
  if (!isValidDate(d)) return "";
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function fromIso(s: string | null | undefined): Date | null {
  if (typeof s !== "string" || !ISO_DATE_RE.test(s)) return null;
  const parts = s.split("-").map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return null;
  const [y, m, d] = parts as [number, number, number];
  const dt = new Date(y, m - 1, d);
  return isValidDate(dt) ? dt : null;
}

/** Wrap an `Intl.DateTimeFormat(...).format(d)` call. Returns `fallback` when
 *  the date is invalid or the underlying formatter throws (e.g. RangeError on
 *  an Invalid Date — which surfaces as a "Server Components render" error in
 *  production when it happens during a "use client" SSR pass). */
function safeFormatDate(
  locale: string,
  options: Intl.DateTimeFormatOptions,
  d: Date | null | undefined,
  fallback = "",
): string {
  if (!isValidDate(d)) return fallback;
  try {
    return new Intl.DateTimeFormat(locale, options).format(d);
  } catch {
    return fallback;
  }
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

/** Builds the visible 6-row × 7-col calendar grid for the given month.
 *  Weeks start Monday — matching LT/ISO convention; weekday labels follow
 *  the same order. */
function buildMonthGrid(viewMonth: Date): Date[] {
  const first = startOfMonth(viewMonth);
  // 0 = Mon … 6 = Sun
  const lead = (first.getDay() + 6) % 7;
  const start = new Date(first.getFullYear(), first.getMonth(), 1 - lead);
  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) {
    cells.push(
      new Date(start.getFullYear(), start.getMonth(), start.getDate() + i),
    );
  }
  return cells;
}

function weekdayShortNames(intlLocale: string): string[] {
  // Pick any known Monday (2024-01-01) and walk 7 days.
  const monday = new Date(2024, 0, 1);
  let fmt: Intl.DateTimeFormat | null = null;
  try {
    fmt = new Intl.DateTimeFormat(intlLocale, { weekday: "short" });
  } catch {
    fmt = null;
  }
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
    if (!fmt) return "";
    try {
      // Strip trailing period some locales add (e.g. LT "pir.")
      return fmt.format(d).replace(/\.$/, "");
    } catch {
      return "";
    }
  });
}

export function DatePicker({
  value,
  onChange,
  placeholder,
  minDate,
  maxDate,
  disabled,
  className,
  ariaLabel,
}: DatePickerProps) {
  const t = useT();
  const { locale } = useLocale();
  const intlLocale = locale === "en" ? "en-US" : "lt-LT";

  const min = useMemo(() => (minDate ? fromIso(minDate) : null), [minDate]);
  const max = useMemo(() => (maxDate ? fromIso(maxDate) : null), [maxDate]);
  const selected = useMemo(() => fromIso(value), [value]);

  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState<Date>(() =>
    startOfMonth(isValidDate(selected) ? selected : new Date()),
  );

  // Re-anchor the calendar to the selected date each time the popup opens.
  useEffect(() => {
    if (open) {
      setViewMonth(
        startOfMonth(isValidDate(selected) ? selected : new Date()),
      );
    }
  }, [open, selected]);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Desktop popover uses `position: fixed` (not absolute) so it escapes any
  // ancestor with `overflow: hidden` (e.g. the onboarding VL card, which uses
  // a CSS-grid expansion animation that requires clipping). Track the
  // trigger's viewport rect to anchor the popover under it.
  const [triggerRect, setTriggerRect] = useState<{
    left: number;
    top: number;
    width: number;
  } | null>(null);

  useLayoutEffect(() => {
    if (!open) {
      setTriggerRect(null);
      return;
    }
    const update = () => {
      const el = triggerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setTriggerRect({ left: r.left, top: r.bottom + 6, width: r.width });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  // Desktop: close on outside click + Escape. Mobile path uses ModalSheet.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const triggerLabel = safeFormatDate(
    intlLocale,
    { day: "numeric", month: "long", year: "numeric" },
    selected,
    placeholder ?? "",
  );

  const monthHeader = safeFormatDate(
    intlLocale,
    { month: "long", year: "numeric" },
    isValidDate(viewMonth) ? viewMonth : null,
  );
  // Capitalize first character (some locales — e.g. LT — return lowercase).
  const monthHeaderTitle = monthHeader.charAt(0).toUpperCase() + monthHeader.slice(1);

  const canStepPrev = !min || addMonths(viewMonth, -1).getTime() >= startOfMonth(min).getTime();
  const canStepNext = !max || addMonths(viewMonth, 1).getTime() <= startOfMonth(max).getTime();

  const handlePick = (d: Date) => {
    if (!isValidDate(d)) return;
    const iso = toIso(d);
    if (iso) onChange(iso);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={ariaLabel}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-[14px] border border-hair bg-surface px-3.5 py-2.5 text-left transition-colors",
          "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30",
          disabled ? "cursor-not-allowed opacity-60" : "hover:border-accent/40",
        )}
      >
        <CalendarIcon />
        <span
          className={cn(
            "flex-1 text-[15px] font-medium",
            selected ? "text-ink-900/90" : "text-ink-500",
          )}
        >
          {triggerLabel || (placeholder ?? "")}
        </span>
      </button>

      {/* Desktop popover — fixed-positioned so it escapes ancestors with
          `overflow: hidden` (e.g. the onboarding VL expansion card). */}
      {open && triggerRect ? (
        <div
          className="fixed z-50 hidden lg:block"
          style={{
            left: triggerRect.left,
            top: triggerRect.top,
            width: triggerRect.width,
          }}
        >
          <CalendarPanel
            viewMonth={viewMonth}
            setViewMonth={setViewMonth}
            selected={selected}
            min={min}
            max={max}
            canStepPrev={canStepPrev}
            canStepNext={canStepNext}
            onPick={handlePick}
            intlLocale={intlLocale}
            monthHeaderTitle={monthHeaderTitle}
            prevAria={t.common.previousMonth}
            nextAria={t.common.nextMonth}
          />
        </div>
      ) : null}

      {/* Mobile bottom sheet — only mount when open so the calendar isn't kept
          in the DOM/tab order while the picker is closed. */}
      {open ? (
        <div className="lg:hidden">
          <ModalSheet
            open
            onClose={() => setOpen(false)}
            ariaLabel={ariaLabel ?? triggerLabel ?? "calendar"}
            closeLabel={t.common.close}
          >
            <CalendarPanel
              viewMonth={viewMonth}
              setViewMonth={setViewMonth}
              selected={selected}
              min={min}
              max={max}
              canStepPrev={canStepPrev}
              canStepNext={canStepNext}
              onPick={handlePick}
              intlLocale={intlLocale}
              monthHeaderTitle={monthHeaderTitle}
              prevAria={t.common.previousMonth}
              nextAria={t.common.nextMonth}
              compact={false}
            />
          </ModalSheet>
        </div>
      ) : null}
    </div>
  );
}

function CalendarPanel({
  viewMonth,
  setViewMonth,
  selected,
  min,
  max,
  canStepPrev,
  canStepNext,
  onPick,
  intlLocale,
  monthHeaderTitle,
  prevAria,
  nextAria,
  compact = true,
}: {
  viewMonth: Date;
  setViewMonth: (d: Date) => void;
  selected: Date | null;
  min: Date | null;
  max: Date | null;
  canStepPrev: boolean;
  canStepNext: boolean;
  onPick: (d: Date) => void;
  intlLocale: string;
  monthHeaderTitle: string;
  prevAria: string;
  nextAria: string;
  compact?: boolean;
}) {
  const weekdays = useMemo(() => weekdayShortNames(intlLocale), [intlLocale]);
  const cells = useMemo(() => buildMonthGrid(viewMonth), [viewMonth]);
  const today = useMemo(() => new Date(), []);

  const isDisabled = (d: Date): boolean => {
    if (min && d < new Date(min.getFullYear(), min.getMonth(), min.getDate())) {
      return true;
    }
    if (max && d > new Date(max.getFullYear(), max.getMonth(), max.getDate())) {
      return true;
    }
    return false;
  };

  return (
    <div
      role="dialog"
      aria-label={monthHeaderTitle}
      className={cn(
        "rounded-[18px] border border-hair bg-surface shadow-[0_12px_40px_-12px_rgba(23,33,29,0.2),_0_2px_6px_rgba(23,33,29,0.06)]",
        compact ? "p-3" : "p-2",
      )}
    >
      <div className="flex items-center justify-between px-1 pb-2">
        <button
          type="button"
          onClick={() => canStepPrev && setViewMonth(addMonths(viewMonth, -1))}
          disabled={!canStepPrev}
          aria-label={prevAria}
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-cream/60 hover:text-ink-900/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft />
        </button>
        <span className="text-[14px] font-semibold tracking-[-0.012em] text-ink-900/90">
          {monthHeaderTitle}
        </span>
        <button
          type="button"
          onClick={() => canStepNext && setViewMonth(addMonths(viewMonth, 1))}
          disabled={!canStepNext}
          aria-label={nextAria}
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-cream/60 hover:text-ink-900/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowRight />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 px-1 pb-1">
        {weekdays.map((w, i) => (
          <div
            key={i}
            className="flex h-7 items-center justify-center text-[11px] font-semibold uppercase tracking-[0.04em] text-ink-500"
          >
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 px-1 pb-1">
        {cells.map((d) => {
          const inMonth = isSameMonth(d, viewMonth);
          const isToday = isSameDay(d, today);
          const isSelected = selected ? isSameDay(d, selected) : false;
          const disabled = isDisabled(d);
          return (
            <button
              key={toIso(d)}
              type="button"
              onClick={(e) => {
                if (disabled) return;
                // Stop the click from bubbling past the calendar — if the
                // picker is rendered inside a <label>, the label's activation
                // behavior can otherwise dispatch a synthetic click back to
                // the trigger button and re-open the picker.
                e.stopPropagation();
                onPick(d);
              }}
              disabled={disabled}
              aria-pressed={isSelected}
              aria-label={d.toDateString()}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full text-[13px] tabular-nums transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
                disabled && "cursor-not-allowed opacity-30",
                isSelected
                  ? "bg-accent text-white shadow-[0_1px_2px_rgba(23,33,29,0.2)]"
                  : isToday
                    ? "ring-1 ring-accent/40 text-accent-deep"
                    : inMonth
                      ? "text-ink-900/90 hover:bg-cream/70"
                      : "text-ink-300 hover:bg-cream/40",
              )}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="text-ink-500"
    >
      <rect x="3.5" y="5" width="17" height="15" rx="3" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
