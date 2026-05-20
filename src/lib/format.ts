type SupportedLocale = "lt" | "en";

const INTL_LOCALE: Record<SupportedLocale, string> = {
  lt: "lt-LT",
  en: "en-US",
};

const eurFormatter = new Intl.NumberFormat("lt-LT", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});

const monthFormatters: Record<SupportedLocale, Intl.DateTimeFormat> = {
  lt: new Intl.DateTimeFormat("lt-LT", { month: "long", year: "numeric" }),
  en: new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }),
};

const dayShortFormatters: Record<SupportedLocale, Intl.DateTimeFormat> = {
  lt: new Intl.DateTimeFormat("lt-LT", { day: "numeric", month: "short" }),
  en: new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short" }),
};

export function formatEur(cents: number) {
  return eurFormatter.format(cents / 100);
}

export function formatMonth(d: Date, locale: SupportedLocale = "lt") {
  const text = monthFormatters[locale].format(d);
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatDayShort(d: Date, locale: SupportedLocale = "lt") {
  return dayShortFormatters[locale].format(d);
}

export function intlLocale(locale: SupportedLocale = "lt") {
  return INTL_LOCALE[locale];
}

export function monthRange(now: Date = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const toIsoDate = (x: Date) => {
    const y = x.getFullYear();
    const m = String(x.getMonth() + 1).padStart(2, "0");
    const day = String(x.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };
  return {
    monthStart: toIsoDate(start),
    nextMonthStart: toIsoDate(next),
    label: formatMonth(start),
  };
}
