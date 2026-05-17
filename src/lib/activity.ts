import type { RecentEntry } from "@/components/dashboard/recent-activity";

export type ActivityKind = "all" | "income" | "expense";

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

export function dayLabel(isoDate: string, now: Date = new Date()): string {
  const today = toIsoDate(now);
  const yest = new Date(now);
  yest.setDate(yest.getDate() - 1);
  const yesterday = toIsoDate(yest);
  if (isoDate === today) return "Šiandien";
  if (isoDate === yesterday) return "Vakar";
  const d = parseIsoDate(isoDate);
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

export function filterEntries(
  entries: ReadonlyArray<RecentEntry>,
  kind: ActivityKind,
): RecentEntry[] {
  if (kind === "all") return [...entries];
  const want = kind === "income" ? "income" : "expense";
  return entries.filter((e) => e.kind === want);
}
