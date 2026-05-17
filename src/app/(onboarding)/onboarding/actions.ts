"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const ALLOWED_PROFESSIONS = new Set([
  "nails",
  "lashes",
  "cosmetology",
  "hair",
  "other",
]);
export async function completeOnboarding(formData: FormData) {
  const profession = String(formData.get("profession") ?? "other");
  const taxPercentRaw = Number(formData.get("taxPercent") ?? 25);

  const safeProfession = ALLOWED_PROFESSIONS.has(profession)
    ? profession
    : "other";

  if (!Number.isFinite(taxPercentRaw)) {
    throw new Error("Neteisingas mokesčių procentas.");
  }
  const safeTaxPercent = Math.trunc(taxPercentRaw);
  if (safeTaxPercent < 0 || safeTaxPercent > 35) {
    throw new Error("Mokesčių procentas turi būti tarp 0 ir 35.");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      profession: safeProfession,
      tax_rate: safeTaxPercent / 100,
      onboarding_completed_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/dashboard");
}
