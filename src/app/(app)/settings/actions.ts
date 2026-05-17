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
