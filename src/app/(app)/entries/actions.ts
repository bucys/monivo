"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireWritableProfile } from "@/lib/profile";
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

function parseNote(raw: unknown) {
  const noteRaw = String(raw ?? "").trim();
  return noteRaw.length > 0 ? noteRaw.slice(0, MAX_NOTE) : null;
}

function parsePaymentMethod(raw: unknown) {
  const v = String(raw ?? "cash");
  return PAYMENT_METHODS.has(v) ? v : "cash";
}

function todayDateString() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function revalidateEntries() {
  revalidatePath("/dashboard");
  revalidatePath("/activity");
  revalidatePath("/insights");
}

async function authedClient() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr) throw new Error("Nepavyko nustatyti vartotojo.");
  if (!user) redirect("/login");
  return { supabase, user };
}

async function resolveServiceName(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  userId: string,
  serviceId: string | null,
) {
  if (!serviceId) return "Pajamos";
  const { data: svc } = await supabase
    .from("services")
    .select("name")
    .eq("id", serviceId)
    .eq("user_id", userId)
    .maybeSingle();
  return svc?.name ?? "Pajamos";
}

export async function createIncomeEntry(formData: FormData) {
  const amountCents = parseAmountCents(formData.get("amount"));
  const paymentMethod = parsePaymentMethod(formData.get("payment_method"));
  const serviceIdRaw = String(formData.get("service_id") ?? "").trim();
  const serviceId = serviceIdRaw.length > 0 ? serviceIdRaw : null;
  const note = parseNote(formData.get("note"));

  const { supabase, user } = await authedClient();
  await requireWritableProfile(supabase, user.id);
  const serviceName = await resolveServiceName(supabase, user.id, serviceId);

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
  revalidateEntries();
}

export async function createExpenseEntry(formData: FormData) {
  const amountCents = parseAmountCents(formData.get("amount"));
  const categoryRaw = String(formData.get("category") ?? "").trim();
  if (!EXPENSE_CATEGORIES.has(categoryRaw)) {
    throw new Error("Pasirink kategoriją.");
  }
  const note = parseNote(formData.get("note"));

  const { supabase, user } = await authedClient();
  await requireWritableProfile(supabase, user.id);

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
  revalidateEntries();
}

export async function updateIncomeEntry(id: string, formData: FormData) {
  const amountCents = parseAmountCents(formData.get("amount"));
  const paymentMethod = parsePaymentMethod(formData.get("payment_method"));
  const serviceIdRaw = String(formData.get("service_id") ?? "").trim();
  const serviceId = serviceIdRaw.length > 0 ? serviceIdRaw : null;
  const note = parseNote(formData.get("note"));

  const { supabase, user } = await authedClient();
  await requireWritableProfile(supabase, user.id);
  const serviceName = await resolveServiceName(supabase, user.id, serviceId);

  const { error } = await supabase
    .from("income_entries")
    .update({
      amount_cents: amountCents,
      service_id: serviceId,
      service_name: serviceName,
      payment_method: paymentMethod,
      note,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(`Nepavyko išsaugoti: ${error.message}`);
  revalidateEntries();
}

export async function updateExpenseEntry(id: string, formData: FormData) {
  const amountCents = parseAmountCents(formData.get("amount"));
  const categoryRaw = String(formData.get("category") ?? "").trim();
  if (!EXPENSE_CATEGORIES.has(categoryRaw)) {
    throw new Error("Pasirink kategoriją.");
  }
  const note = parseNote(formData.get("note"));

  const { supabase, user } = await authedClient();
  await requireWritableProfile(supabase, user.id);

  const { error } = await supabase
    .from("expense_entries")
    .update({
      amount_cents: amountCents,
      category: categoryRaw,
      note,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(`Nepavyko išsaugoti: ${error.message}`);
  revalidateEntries();
}

export async function deleteIncomeEntry(id: string) {
  const { supabase, user } = await authedClient();
  await requireWritableProfile(supabase, user.id);
  const { error } = await supabase
    .from("income_entries")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw new Error(`Nepavyko ištrinti: ${error.message}`);
  revalidateEntries();
}

export async function deleteExpenseEntry(id: string) {
  const { supabase, user } = await authedClient();
  await requireWritableProfile(supabase, user.id);
  const { error } = await supabase
    .from("expense_entries")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw new Error(`Nepavyko ištrinti: ${error.message}`);
  revalidateEntries();
}
