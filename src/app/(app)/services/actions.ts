"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const MAX_NAME = 40;
const MAX_PRICE_CENTS = 10_000_00;

function parseName(raw: unknown) {
  const name = String(raw ?? "").trim();
  if (name.length < 1) throw new Error("Įvesk paslaugos pavadinimą.");
  if (name.length > MAX_NAME) {
    throw new Error(`Pavadinimas per ilgas (iki ${MAX_NAME} simbolių).`);
  }
  return name;
}

function parsePriceCents(raw: unknown) {
  const trimmed = String(raw ?? "").trim().replace(",", ".");
  if (trimmed === "") throw new Error("Įvesk kainą.");
  const value = Number(trimmed);
  if (!Number.isFinite(value) || value < 0) {
    throw new Error("Kaina turi būti teigiamas skaičius.");
  }
  const cents = Math.round(value * 100);
  if (cents > MAX_PRICE_CENTS) throw new Error("Kaina per didelė.");
  return cents;
}

async function getUserOrRedirect() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, userId: user.id };
}

export async function createService(formData: FormData) {
  const name = parseName(formData.get("name"));
  const priceCents = parsePriceCents(formData.get("price"));

  const { supabase, userId } = await getUserOrRedirect();

  const { data: maxRow } = await supabase
    .from("services")
    .select("sort_order")
    .eq("user_id", userId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextSortOrder = (maxRow?.sort_order ?? 0) + 1;

  const { error } = await supabase.from("services").insert({
    user_id: userId,
    name,
    price_cents: priceCents,
    sort_order: nextSortOrder,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/services");
}

export async function updateService(id: string, formData: FormData) {
  if (!id) throw new Error("Trūksta paslaugos ID.");
  const name = parseName(formData.get("name"));
  const priceCents = parsePriceCents(formData.get("price"));

  const { supabase, userId } = await getUserOrRedirect();

  const { error } = await supabase
    .from("services")
    .update({ name, price_cents: priceCents })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  revalidatePath("/services");
}

export async function deleteService(id: string) {
  if (!id) throw new Error("Trūksta paslaugos ID.");
  const { supabase, userId } = await getUserOrRedirect();

  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  revalidatePath("/services");
}
