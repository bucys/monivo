const eurFormatter = new Intl.NumberFormat("lt-LT", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});

const monthFormatter = new Intl.DateTimeFormat("lt-LT", {
  month: "long",
  year: "numeric",
});

const dayShortFormatter = new Intl.DateTimeFormat("lt-LT", {
  day: "numeric",
  month: "short",
});

export function formatEur(cents: number) {
  return eurFormatter.format(cents / 100);
}

export function formatMonth(d: Date) {
  const text = monthFormatter.format(d);
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatDayShort(d: Date) {
  return dayShortFormatter.format(d);
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
    label: formatMonth(now),
  };
}
