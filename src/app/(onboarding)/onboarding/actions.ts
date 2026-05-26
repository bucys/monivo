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

type ActivityType = "iv" | "vl" | "simple";

/**
 * Tax-profile defaults per onboarding activity choice. These map the simple
 * onboarding answer onto the same fields the Settings tax modal edits, so
 * users can refine later without seeing an empty form.
 *
 * `tax_rate` is a legacy column — kept in sync as a soft fallback for any
 * place that hasn't migrated to the full TAX_PROFILE_COLUMNS.
 */
/**
 * Tax-profile defaults per onboarding activity choice. These map the simple
 * onboarding answer onto the same fields the Settings tax modal edits, so
 * users can refine later without seeing an empty form.
 *
 * `iv_expense_mode` is NOT NULL in the schema — we always write the safe
 * default ("fixed_30") even for VL/Simple, since it only affects the IV
 * branch of the reserve engine and is ignored otherwise.
 *
 * `tax_rate` is a legacy column — kept in sync as a soft fallback for any
 * place that hasn't migrated to the full TAX_PROFILE_COLUMNS.
 */
const ACTIVITY_DEFAULTS: Record<
  ActivityType,
  {
    tax_mode: "iv" | "vl" | "custom";
    iv_expense_mode: "fixed_30" | "actual";
    include_psd: boolean;
    custom_tax_percent: number | null;
    tax_rate: number;
  }
> = {
  iv: {
    tax_mode: "iv",
    iv_expense_mode: "fixed_30",
    include_psd: true,
    custom_tax_percent: null,
    tax_rate: 0.22,
  },
  vl: {
    tax_mode: "vl",
    iv_expense_mode: "fixed_30",
    include_psd: true,
    custom_tax_percent: null,
    tax_rate: 0.1,
  },
  simple: {
    tax_mode: "custom",
    iv_expense_mode: "fixed_30",
    include_psd: true,
    custom_tax_percent: 20,
    tax_rate: 0.2,
  },
};

function parseActivity(raw: FormDataEntryValue | null): ActivityType {
  if (raw === "iv" || raw === "vl" || raw === "simple") return raw;
  return "simple";
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Parse a "420" / "420,50" / "420.50" euro string into integer cents. */
function parseEuroToCents(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  const normalized = trimmed.replace(/\s/g, "").replace(",", ".");
  const value = Number(normalized);
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(value * 100);
}

export async function completeOnboarding(formData: FormData) {
  const profession = String(formData.get("profession") ?? "other");
  const activity = parseActivity(formData.get("activity"));

  const safeProfession = ALLOWED_PROFESSIONS.has(profession)
    ? profession
    : "other";

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const defaults = ACTIVITY_DEFAULTS[activity];

  const vlYearlyCents =
    activity === "vl"
      ? parseEuroToCents(String(formData.get("vl_yearly_cost") ?? ""))
      : null;
  const vlValidUntilRaw =
    activity === "vl" ? String(formData.get("vl_valid_until") ?? "") : "";
  const vlValidUntil =
    activity === "vl" && ISO_DATE_RE.test(vlValidUntilRaw)
      ? vlValidUntilRaw
      : null;

  const { error } = await supabase
    .from("profiles")
    .update({
      profession: safeProfession,
      tax_mode: defaults.tax_mode,
      iv_expense_mode: defaults.iv_expense_mode,
      include_psd: defaults.include_psd,
      custom_tax_percent: defaults.custom_tax_percent,
      tax_rate: defaults.tax_rate,
      vl_yearly_cost_cents: vlYearlyCents,
      vl_valid_until: vlValidUntil,
      onboarding_completed_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/dashboard");
}
