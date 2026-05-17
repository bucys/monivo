"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const PAYMENT_METHODS = new Set(["cash", "card", "transfer"]);
const EXPENSE_CATEGORIES = new Set([
  "supplies",
  "rent",
  "marketing",
  "education",
  "equipment",
  "other",
]);
const MAX_AMOUNT_CENTS = 1_000_000_00;
const MAX_NOTE = 200;

function parseAmountCents(raw: unknown) {
  const trimmed = String(raw ?? "").trim().replace(",", ".");
  if (trimmed === "") throw new Error("Įvesk sumą.");
  const value = Number(trimmed);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error("Suma turi būti teigiamas skaičius.");
  }
  const cents = Math.round(value * 100);
  if (cents > MAX_AMOUNT_CENTS) throw new Error("Suma per didelė.");
  return cents;
}

function todayDateString() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function createIncomeEntry(formData: FormData) {
  const amountCents = parseAmountCents(formData.get("amount"));
  const paymentMethodRaw = String(formData.get("payment_method") ?? "cash");
  const paymentMethod = PAYMENT_METHODS.has(paymentMethodRaw)
    ? paymentMethodRaw
    : "cash";

  const serviceIdRaw = String(formData.get("service_id") ?? "").trim();
  const serviceId = serviceIdRaw.length > 0 ? serviceIdRaw : null;
  const noteRaw = String(formData.get("note") ?? "").trim();
  const note = noteRaw.length > 0 ? noteRaw.slice(0, MAX_NOTE) : null;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr) throw new Error("Nepavyko nustatyti vartotojo.");
  if (!user) redirect("/login");

  let serviceName = "Pajamos";
  if (serviceId) {
    const { data: svc } = await supabase
      .from("services")
      .select("name")
      .eq("id", serviceId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (svc?.name) serviceName = svc.name;
  }

  const { error } = await supabase
    .from("income_entries")
    .insert({
      user_id: user.id,
      amount_cents: amountCents,
      service_id: serviceId,
      service_name: serviceName,
      payment_method: paymentMethod,
      occurred_at: todayDateString(),
      note,
    })
    .select("id")
    .single();

  if (error) throw new Error(`Nepavyko išsaugoti: ${error.message}`);

  revalidatePath("/dashboard");
  revalidatePath("/activity");
  revalidatePath("/insights");
}

export async function createExpenseEntry(formData: FormData) {
  const amountCents = parseAmountCents(formData.get("amount"));
  const categoryRaw = String(formData.get("category") ?? "").trim();
  if (!EXPENSE_CATEGORIES.has(categoryRaw)) {
    throw new Error("Pasirink kategoriją.");
  }
  const noteRaw = String(formData.get("note") ?? "").trim();
  const note = noteRaw.length > 0 ? noteRaw.slice(0, MAX_NOTE) : null;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr) throw new Error("Nepavyko nustatyti vartotojo.");
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("expense_entries")
    .insert({
      user_id: user.id,
      amount_cents: amountCents,
      category: categoryRaw,
      occurred_at: todayDateString(),
      note,
    })
    .select("id")
    .single();

  if (error) throw new Error(`Nepavyko išsaugoti: ${error.message}`);

  revalidatePath("/dashboard");
  revalidatePath("/activity");
  revalidatePath("/insights");
}
