export type PaymentMethod = "cash" | "card" | "transfer";

export type IncomeRow = {
  amount_cents: number;
  service_id: string | null;
  service_name: string | null;
  payment_method: string | null;
  occurred_at: string;
};

export type ExpenseRow = {
  amount_cents: number;
  category: string;
  occurred_at: string;
};

export type ServiceRef = {
  id: string;
  name: string;
};

export type ServiceBucket = {
  /** stable key: service_id when present, else "name:<service_name>" */
  key: string;
  /** display name */
  name: string;
  totalCents: number;
  count: number;
};

export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  cash: "Grynais",
  card: "Kortele",
  transfer: "Pavedimu",
};

export const EXPENSE_CATEGORY_LABEL: Record<string, string> = {
  supplies: "Priemonės",
  rent: "Nuoma",
  marketing: "Marketingas",
  education: "Mokymai",
  equipment: "Įranga",
  other: "Kita",
};

export function weekBucket(isoDate: string) {
  const dayOfMonth = Number(isoDate.slice(8, 10));
  return Math.min(3, Math.floor((dayOfMonth - 1) / 7));
}

export const WEEKDAY_LONG_LT = [
  "Pirmadienis",
  "Antradienis",
  "Trečiadienis",
  "Ketvirtadienis",
  "Penktadienis",
  "Šeštadienis",
  "Sekmadienis",
];

export const WEEKDAY_SHORT_LT = ["P", "A", "T", "K", "Pn", "Š", "S"];

export const WEEKDAY_LONG_EN = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const WEEKDAY_SHORT_EN = ["M", "T", "W", "T", "F", "S", "S"];

function parseIsoDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y!, (m ?? 1) - 1, d ?? 1);
}

/** Mon=0..Sun=6 */
function mondayIndex(date: Date) {
  return (date.getDay() + 6) % 7;
}

export type WeekdayTally = {
  /** 0=Pirmadienis ... 6=Sekmadienis */
  index: number;
  totalCents: number;
  count: number;
};

export function tallyByWeekday(
  rows: ReadonlyArray<IncomeRow>,
): WeekdayTally[] {
  const tallies: WeekdayTally[] = Array.from({ length: 7 }, (_, i) => ({
    index: i,
    totalCents: 0,
    count: 0,
  }));
  for (const r of rows) {
    const i = mondayIndex(parseIsoDate(r.occurred_at));
    tallies[i]!.totalCents += r.amount_cents;
    tallies[i]!.count += 1;
  }
  return tallies;
}

export function bestWeekday(
  rows: ReadonlyArray<IncomeRow>,
): WeekdayTally | null {
  const tallies = tallyByWeekday(rows);
  let best: WeekdayTally | null = null;
  for (const t of tallies) {
    if (t.totalCents > 0 && (!best || t.totalCents > best.totalCents)) best = t;
  }
  return best;
}

export function totalsByWeek(rows: ReadonlyArray<IncomeRow>): [number, number, number, number] {
  const weeks: [number, number, number, number] = [0, 0, 0, 0];
  for (const r of rows) {
    const b = weekBucket(r.occurred_at) as 0 | 1 | 2 | 3;
    weeks[b] += r.amount_cents ?? 0;
  }
  return weeks;
}

export function averageDayIncomeCents(rows: ReadonlyArray<IncomeRow>): number {
  if (rows.length === 0) return 0;
  const byDay = new Map<string, number>();
  for (const r of rows) {
    byDay.set(r.occurred_at, (byDay.get(r.occurred_at) ?? 0) + r.amount_cents);
  }
  if (byDay.size === 0) return 0;
  let sum = 0;
  for (const v of byDay.values()) sum += v;
  return Math.round(sum / byDay.size);
}

export function rankServices(
  rows: ReadonlyArray<IncomeRow>,
  services: ReadonlyArray<ServiceRef>,
): ServiceBucket[] {
  const serviceById = new Map(services.map((s) => [s.id, s.name]));
  const map = new Map<string, ServiceBucket>();
  for (const r of rows) {
    const key = r.service_id ?? `name:${r.service_name ?? "Pajamos"}`;
    const name = r.service_id
      ? (serviceById.get(r.service_id) ?? r.service_name ?? "Paslauga")
      : (r.service_name ?? "Pajamos");
    const bucket = map.get(key) ?? { key, name, totalCents: 0, count: 0 };
    bucket.totalCents += r.amount_cents;
    bucket.count += 1;
    map.set(key, bucket);
  }
  return Array.from(map.values()).sort((a, b) => b.totalCents - a.totalCents);
}

export type PaymentTally = { method: PaymentMethod; count: number };

export function paymentMethodTally(rows: ReadonlyArray<IncomeRow>): {
  total: number;
  byMethod: Record<PaymentMethod, number>;
  top: PaymentTally | null;
} {
  const byMethod: Record<PaymentMethod, number> = { cash: 0, card: 0, transfer: 0 };
  let total = 0;
  for (const r of rows) {
    const m = r.payment_method as PaymentMethod | null;
    if (m && (m === "cash" || m === "card" || m === "transfer")) {
      byMethod[m] += 1;
      total += 1;
    }
  }
  let top: PaymentTally | null = null;
  for (const method of ["cash", "card", "transfer"] as const) {
    const count = byMethod[method];
    if (count > 0 && (!top || count > top.count)) top = { method, count };
  }
  return { total, byMethod, top };
}

export type ExpenseBucket = {
  slug: string;
  label: string;
  totalCents: number;
  count: number;
};

export function rankExpenseCategories(
  rows: ReadonlyArray<ExpenseRow>,
): ExpenseBucket[] {
  const map = new Map<string, ExpenseBucket>();
  for (const r of rows) {
    const slug = r.category;
    const bucket = map.get(slug) ?? {
      slug,
      label: EXPENSE_CATEGORY_LABEL[slug] ?? slug,
      totalCents: 0,
      count: 0,
    };
    bucket.totalCents += r.amount_cents;
    bucket.count += 1;
    map.set(slug, bucket);
  }
  return Array.from(map.values()).sort((a, b) => b.totalCents - a.totalCents);
}
