"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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
  const displayName = parseDisplayName(formData.get("display_name"));

  // tax rate input is percent (e.g. "15" → 0.15). Skip if not present.
  const rawTax = formData.get("tax_rate_percent");
  const taxRate =
    rawTax !== null && String(rawTax).trim() !== ""
      ? parseTaxRate(Number(String(rawTax).replace(",", ".")) / 100)
      : null;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr) throw new Error("Nepavyko nustatyti vartotojo.");
  if (!user) redirect("/login");

  const patch: Record<string, unknown> = {};
  if (formData.has("display_name")) patch.display_name = displayName;
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

  const { error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", user.id);
  if (error) throw new Error(`Nepavyko išsaugoti: ${error.message}`);

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  revalidatePath("/insights");
}
