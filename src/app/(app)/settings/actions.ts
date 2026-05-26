"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireWritableProfile } from "@/lib/profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const EXPENSE_CATEGORY_LABEL: Record<string, string> = {
  supplies: "Priemonės",
  rent: "Nuoma",
  marketing: "Marketingas",
  education: "Mokymai",
  equipment: "Įranga",
  other: "Kita",
};

function csvEscape(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  // Wrap if it contains a comma, quote, CR or LF; double internal quotes.
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function todayIsoDate() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export type ExportKind = "all" | "income" | "expenses";
export type ExportRangeType = "this_month" | "this_year" | "custom" | "all";

export type ExportRange =
  | { type: "all" }
  | { type: "this_month" }
  | { type: "this_year" }
  | { type: "custom"; from: string; to: string };

const ALLOWED_KINDS: ReadonlySet<ExportKind> = new Set([
  "all",
  "income",
  "expenses",
]);

const ALLOWED_RANGE_TYPES: ReadonlySet<ExportRangeType> = new Set([
  "this_month",
  "this_year",
  "custom",
  "all",
]);

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function isoDate(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function addDaysIso(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y!, (m ?? 1) - 1, (d ?? 1) + days);
  return isoDate(dt);
}

type ResolvedBounds = {
  /** YYYY-MM-DD inclusive */
  startInclusive: string;
  /** YYYY-MM-DD exclusive */
  endExclusive: string;
  /** Filename slug for this range. */
  slug: string;
};

function resolveRange(range: ExportRange, now: Date = new Date()): ResolvedBounds | null {
  if (range.type === "all") return null;
  if (range.type === "this_month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return {
      startInclusive: isoDate(start),
      endExclusive: isoDate(end),
      slug: `this-month-${now.getFullYear()}-${pad2(now.getMonth() + 1)}`,
    };
  }
  if (range.type === "this_year") {
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear() + 1, 0, 1);
    return {
      startInclusive: isoDate(start),
      endExclusive: isoDate(end),
      slug: `this-year-${now.getFullYear()}`,
    };
  }
  // custom
  if (!ISO_DATE_RE.test(range.from) || !ISO_DATE_RE.test(range.to)) {
    throw new Error("Neteisinga data.");
  }
  if (range.from > range.to) {
    throw new Error("Pradžios data turi būti ankstesnė už pabaigos datą.");
  }
  return {
    startInclusive: range.from,
    endExclusive: addDaysIso(range.to, 1),
    slug: `${range.from}_to_${range.to}`,
  };
}

/** Serializes a 2D table into a CSV string with a UTF-8 BOM. */
function serializeCsv(header: ReadonlyArray<string>, rows: string[][]): string {
  const body = rows
    .map((r) => r.map(csvEscape).join(","))
    .join("\r\n");
  // BOM ensures Excel reads UTF-8 (Lithuanian chars).
  return body
    ? `﻿${header.join(",")}\r\n${body}\r\n`
    : `﻿${header.join(",")}\r\n`;
}

function centsToEur(cents: number | null | undefined): string {
  return (Number(cents ?? 0) / 100).toFixed(2);
}

export async function exportEntriesCsv(
  kind: ExportKind = "all",
  range: ExportRange = { type: "all" },
): Promise<{
  csv: string;
  filename: string;
  rowCount: number;
}> {
  if (!ALLOWED_KINDS.has(kind)) {
    throw new Error("Neteisingas eksporto tipas.");
  }
  if (!ALLOWED_RANGE_TYPES.has(range.type)) {
    throw new Error("Neteisingas periodas.");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const bounds = resolveRange(range);

  const wantIncome = kind === "all" || kind === "income";
  const wantExpenses = kind === "all" || kind === "expenses";

  const incomeQuery = wantIncome
    ? (() => {
        let q = supabase
          .from("income_entries")
          .select(
            "amount_cents, service_name, payment_method, note, occurred_at, created_at",
          )
          .eq("user_id", user.id);
        if (bounds) {
          q = q
            .gte("occurred_at", bounds.startInclusive)
            .lt("occurred_at", bounds.endExclusive);
        }
        return q
          .order("occurred_at", { ascending: false })
          .order("created_at", { ascending: false });
      })()
    : Promise.resolve({ data: [] as Array<Record<string, unknown>> });

  const expenseQuery = wantExpenses
    ? (() => {
        let q = supabase
          .from("expense_entries")
          .select("amount_cents, category, note, occurred_at, created_at")
          .eq("user_id", user.id);
        if (bounds) {
          q = q
            .gte("occurred_at", bounds.startInclusive)
            .lt("occurred_at", bounds.endExclusive);
        }
        return q
          .order("occurred_at", { ascending: false })
          .order("created_at", { ascending: false });
      })()
    : Promise.resolve({ data: [] as Array<Record<string, unknown>> });

  const [incomeRes, expenseRes] = await Promise.all([incomeQuery, expenseQuery]);

  const incomes = (incomeRes.data ?? []) as Array<{
    amount_cents: number;
    service_name: string | null;
    payment_method: string | null;
    note: string | null;
    occurred_at: string;
    created_at: string;
  }>;
  const expenses = (expenseRes.data ?? []) as Array<{
    amount_cents: number;
    category: string | null;
    note: string | null;
    occurred_at: string;
    created_at: string;
  }>;

  let header: ReadonlyArray<string>;
  let rows: string[][];

  if (kind === "income") {
    header = [
      "date",
      "service",
      "payment_method",
      "note",
      "amount_eur",
      "currency",
      "created_at",
    ];
    rows = incomes.map((r) => [
      String(r.occurred_at ?? ""),
      String(r.service_name ?? ""),
      String(r.payment_method ?? ""),
      String(r.note ?? ""),
      centsToEur(r.amount_cents),
      "EUR",
      String(r.created_at ?? ""),
    ]);
  } else if (kind === "expenses") {
    header = [
      "date",
      "category",
      "note",
      "amount_eur",
      "currency",
      "created_at",
    ];
    rows = expenses.map((r) => {
      const slug = String(r.category ?? "");
      return [
        String(r.occurred_at ?? ""),
        EXPENSE_CATEGORY_LABEL[slug] ?? slug,
        String(r.note ?? ""),
        centsToEur(r.amount_cents),
        "EUR",
        String(r.created_at ?? ""),
      ];
    });
  } else {
    // kind === "all" — merged with a type column, matches the original format.
    header = [
      "date",
      "type",
      "category",
      "payment_method",
      "note",
      "amount_eur",
      "currency",
      "created_at",
    ];
    const merged: Array<{ occurred_at: string; row: string[] }> = [];
    for (const r of incomes) {
      merged.push({
        occurred_at: String(r.occurred_at ?? ""),
        row: [
          String(r.occurred_at ?? ""),
          "income",
          String(r.service_name ?? ""),
          String(r.payment_method ?? ""),
          String(r.note ?? ""),
          centsToEur(r.amount_cents),
          "EUR",
          String(r.created_at ?? ""),
        ],
      });
    }
    for (const r of expenses) {
      const slug = String(r.category ?? "");
      merged.push({
        occurred_at: String(r.occurred_at ?? ""),
        row: [
          String(r.occurred_at ?? ""),
          "expense",
          EXPENSE_CATEGORY_LABEL[slug] ?? slug,
          "",
          String(r.note ?? ""),
          centsToEur(r.amount_cents),
          "EUR",
          String(r.created_at ?? ""),
        ],
      });
    }
    merged.sort((a, b) => (a.occurred_at < b.occurred_at ? 1 : -1));
    rows = merged.map((m) => m.row);
  }

  const filenameSlug = bounds ? bounds.slug : todayIsoDate();
  return {
    csv: serializeCsv(header, rows),
    filename: `monivo-${kind}-${filenameSlug}.csv`,
    rowCount: rows.length,
  };
}

const MAX_NAME = 80;

function parseDisplayName(raw: unknown): string | null {
  const v = String(raw ?? "").trim();
  if (v === "") return null;
  return v.slice(0, MAX_NAME);
}

function parseTaxRate(raw: unknown): number {
  const v = Number(String(raw ?? "").trim().replace(",", "."));
  if (!Number.isFinite(v) || v < 0 || v > 0.6) {
    throw new Error("Mokesčių procentas turi būti tarp 0 ir 60.");
  }
  return Math.round(v * 1000) / 1000;
}

export async function updateProfile(formData: FormData) {
  // Display-name + email are account-level edits — intentionally NOT gated by
  // requireWritableProfile so expired-trial users can still maintain their
  // own account. Business-affecting writes (tax profile, profession,
  // services, entries) ARE guarded; see updateTaxProfile / updateProfession
  // and the entries/services actions.

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr) throw new Error("Nepavyko nustatyti vartotojo.");
  if (!user) redirect("/login");

  const patch: Record<string, unknown> = {};

  // display_name is NOT NULL in the DB. If the form explicitly includes the
  // field but the trimmed value is empty, that's a validation error — we
  // reject rather than writing null and tripping the constraint.
  if (formData.has("display_name")) {
    const displayName = parseDisplayName(formData.get("display_name"));
    if (!displayName) {
      throw new Error("Įvesk vardą.");
    }
    patch.display_name = displayName;
  }

  // tax rate input is percent (e.g. "15" → 0.15). Skip if not present.
  const rawTax = formData.get("tax_rate_percent");
  const taxRate =
    rawTax !== null && String(rawTax).trim() !== ""
      ? parseTaxRate(Number(String(rawTax).replace(",", ".")) / 100)
      : null;
  if (taxRate !== null) patch.tax_rate = taxRate;

  if (Object.keys(patch).length === 0) return;

  const { error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", user.id);
  if (error) throw new Error(`Nepavyko išsaugoti: ${error.message}`);

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  revalidatePath("/insights");
}

type TaxProfilePatch = {
  tax_mode: "iv" | "vl" | "custom";
  iv_expense_mode: "fixed_30" | "actual";
  include_psd: boolean;
  custom_tax_percent: number | null;
  vl_yearly_cost_cents: number | null;
  vl_valid_until: string | null;
};

function parsePercent(raw: unknown): number {
  const v = Number(String(raw ?? "").trim().replace(",", "."));
  if (!Number.isFinite(v) || v < 0 || v > 60) {
    throw new Error("Procentas turi būti tarp 0 ir 60.");
  }
  return Math.round(v * 100) / 100;
}

function parseEurToCents(raw: unknown): number {
  const v = Number(String(raw ?? "").trim().replace(",", "."));
  if (!Number.isFinite(v) || v < 0 || v > 100_000) {
    throw new Error("Suma turi būti teigiamas skaičius.");
  }
  return Math.round(v * 100);
}

function parseIsoDate(raw: unknown): string | null {
  const s = String(raw ?? "").trim();
  if (s === "") return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    throw new Error("Neteisinga data.");
  }
  return s;
}

const ALLOWED_PROFESSIONS = new Set([
  "hair",
  "nails",
  "cosmetology",
  "lashes",
  "other",
] as const);

export async function updateProfession(formData: FormData) {
  const raw = String(formData.get("profession") ?? "");
  if (!(ALLOWED_PROFESSIONS as Set<string>).has(raw)) {
    throw new Error("Neteisinga veiklos sritis.");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  // Profession drives reserve calculations downstream — business mutation.
  await requireWritableProfile(supabase, user.id);

  const { error } = await supabase
    .from("profiles")
    .update({ profession: raw })
    .eq("id", user.id);
  if (error) throw new Error(`Nepavyko išsaugoti: ${error.message}`);

  revalidatePath("/settings");
  revalidatePath("/dashboard");
}

export async function updateTaxProfile(formData: FormData) {
  const mode = String(formData.get("tax_mode") ?? "");
  if (mode !== "iv" && mode !== "vl" && mode !== "custom") {
    throw new Error("Neteisingas mokesčių režimas.");
  }

  const patch: TaxProfilePatch = {
    tax_mode: mode,
    iv_expense_mode: "fixed_30",
    include_psd: true,
    custom_tax_percent: null,
    vl_yearly_cost_cents: null,
    vl_valid_until: null,
  };

  if (mode === "iv") {
    const expenseMode = String(formData.get("iv_expense_mode") ?? "fixed_30");
    patch.iv_expense_mode =
      expenseMode === "actual" ? "actual" : "fixed_30";
    patch.include_psd = formData.get("include_psd") === "on";
  } else if (mode === "vl") {
    const yearly = formData.get("vl_yearly_cost");
    patch.vl_yearly_cost_cents =
      yearly !== null && String(yearly).trim() !== ""
        ? parseEurToCents(yearly)
        : null;
    patch.vl_valid_until = parseIsoDate(formData.get("vl_valid_until"));
    patch.include_psd = formData.get("include_psd") === "on";
  } else {
    patch.custom_tax_percent = parsePercent(formData.get("custom_tax_percent"));
    patch.include_psd = true;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  // Tax profile drives reserve calculations — business mutation.
  await requireWritableProfile(supabase, user.id);

  const { error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", user.id);
  if (error) throw new Error(`Nepavyko išsaugoti: ${error.message}`);

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  revalidatePath("/insights");
}
