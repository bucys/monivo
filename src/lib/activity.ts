import type { RecentEntry } from "@/components/dashboard/recent-activity";
import { formatMonth } from "@/lib/format";

export type ActivityKind = "all" | "income" | "expense";

export type PeriodMode = "week" | "month" | "custom";

export type ResolvedPeriod = {
  mode: PeriodMode;
  /** YYYY-MM-DD, inclusive */
  startDate: string;
  /** YYYY-MM-DD, exclusive */
  endDate: string;
  /** UI label for the header, e.g. "Šis mėnuo" or "Gegužė 2026" */
  label: string;
  /** YYYY-MM string when mode === "custom" */
  monthValue?: string;
};

export type MonthOption = { value: string; label: string };

export type DayGroup = {
  date: string;
  entries: RecentEntry[];
  incomeCents: number;
  expenseCents: number;
};

const LT_MONTH_GENITIVE = [
  "sausio",
  "vasario",
  "kovo",
  "balandžio",
  "gegužės",
  "birželio",
  "liepos",
  "rugpjūčio",
  "rugsėjo",
  "spalio",
  "lapkričio",
  "gruodžio",
];

function parseIsoDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y!, (m ?? 1) - 1, d ?? 1);
}

function toIsoDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const EN_DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "long",
});

export function dayLabel(
  isoDate: string,
  locale: "lt" | "en" = "lt",
  labels: { today: string; yesterday: string } = {
    today: "Šiandien",
    yesterday: "Vakar",
  },
  now: Date = new Date(),
): string {
  const today = toIsoDate(now);
  const yest = new Date(now);
  yest.setDate(yest.getDate() - 1);
  const yesterday = toIsoDate(yest);
  if (isoDate === today) return labels.today;
  if (isoDate === yesterday) return labels.yesterday;
  const d = parseIsoDate(isoDate);
  if (locale === "en") return EN_DATE_FORMAT.format(d);
  return `${d.getDate()} ${LT_MONTH_GENITIVE[d.getMonth()]}`;
}

export function groupByDay(entries: ReadonlyArray<RecentEntry>): DayGroup[] {
  const map = new Map<string, DayGroup>();
  for (const e of entries) {
    let g = map.get(e.occurredAt);
    if (!g) {
      g = { date: e.occurredAt, entries: [], incomeCents: 0, expenseCents: 0 };
      map.set(e.occurredAt, g);
    }
    g.entries.push(e);
    if (e.kind === "income") g.incomeCents += e.amountCents;
    else g.expenseCents += e.amountCents;
  }
  return Array.from(map.values()).sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
  );
}

function isoDate(date: Date) {
  return toIsoDate(date);
}

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfIsoWeek(now: Date) {
  const d = startOfDay(now);
  // Mon = 0 ... Sun = 6
  const offset = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - offset);
  return d;
}

function startOfMonth(now: Date) {
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function formatMonthYear(d: Date) {
  return formatMonth(d);
}

export function resolvePeriod(
  raw: string | undefined,
  now: Date = new Date(),
): ResolvedPeriod {
  if (raw === "week") {
    const start = startOfIsoWeek(now);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    return {
      mode: "week",
      startDate: isoDate(start),
      endDate: isoDate(end),
      label: "Ši savaitė",
    };
  }
  const monthMatch = raw?.match(/^(\d{4})-(\d{2})$/);
  if (monthMatch) {
    const year = Number(monthMatch[1]);
    const month = Number(monthMatch[2]) - 1;
    if (month >= 0 && month <= 11) {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 1);
      const currentMonthStart = startOfMonth(now);
      const isCurrent = start.getTime() === currentMonthStart.getTime();
      return {
        mode: isCurrent ? "month" : "custom",
        startDate: isoDate(start),
        endDate: isoDate(end),
        label: isCurrent ? "Šis mėnuo" : formatMonthYear(start),
        monthValue: `${year}-${String(month + 1).padStart(2, "0")}`,
      };
    }
  }
  const start = startOfMonth(now);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return {
    mode: "month",
    startDate: isoDate(start),
    endDate: isoDate(end),
    label: "Šis mėnuo",
  };
}

export function lastTwelveMonths(now: Date = new Date()): MonthOption[] {
  const out: MonthOption[] = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    out.push({ value, label: formatMonthYear(d) });
  }
  return out;
}

export function filterEntries(
  entries: ReadonlyArray<RecentEntry>,
  kind: ActivityKind,
): RecentEntry[] {
  if (kind === "all") return [...entries];
  const want = kind === "income" ? "income" : "expense";
  return entries.filter((e) => e.kind === want);
}
