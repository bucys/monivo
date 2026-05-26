import type { SupabaseClient } from "@supabase/supabase-js";
import type { TaxProfile } from "@/lib/tax";

export type ProfileWriteFields = {
  subscription_status:
    | "trialing"
    | "active"
    | "expired"
    | "past_due"
    | "canceled";
  trial_ends_at: string;
  past_due_since: string | null;
};

/** Columns selected from `profiles` to build a TaxProfile. */
export type ProfileTaxFields = {
  tax_mode: "iv" | "vl" | "custom" | null;
  iv_expense_mode: "fixed_30" | "actual" | null;
  include_psd: boolean | null;
  custom_tax_percent: number | string | null;
  vl_yearly_cost_cents: number | null;
  vl_valid_until: string | null;
};

export const TAX_PROFILE_COLUMNS =
  "tax_mode, iv_expense_mode, include_psd, custom_tax_percent, vl_yearly_cost_cents, vl_valid_until";

/**
 * Map a profiles row into a TaxProfile.
 *
 * Source-of-truth order:
 *   1. row.tax_mode if explicitly set ('iv' | 'vl' | 'custom').
 *   2. If tax_mode is null but VL columns are populated → infer 'vl'.
 *   3. If tax_mode is null but custom_tax_percent is populated → infer 'custom'.
 *   4. Otherwise default to 'custom' (the safe planning path).
 *
 * The inference matters for profiles that pre-date the activity-type
 * onboarding write: their tax_mode is null, but the VL fields they filled
 * in still exist. Without inference, the UI silently fell back to "Simple %"
 * even though the user is a Verslo liudijimas holder.
 */
export function toTaxProfile(row: ProfileTaxFields | null | undefined): TaxProfile {
  const customPct =
    row?.custom_tax_percent === null || row?.custom_tax_percent === undefined
      ? null
      : Number(row.custom_tax_percent);
  const hasVlData =
    (row?.vl_yearly_cost_cents ?? null) !== null ||
    (row?.vl_valid_until ?? null) !== null;

  let taxMode: TaxProfile["taxMode"];
  if (row?.tax_mode === "iv" || row?.tax_mode === "vl" || row?.tax_mode === "custom") {
    taxMode = row.tax_mode;
  } else if (hasVlData) {
    taxMode = "vl";
  } else if (customPct !== null) {
    taxMode = "custom";
  } else {
    taxMode = "custom";
  }

  return {
    taxMode,
    ivExpenseMode: row?.iv_expense_mode ?? "fixed_30",
    includePsd: row?.include_psd ?? true,
    customTaxPercent: customPct,
    vlYearlyCostCents: row?.vl_yearly_cost_cents ?? null,
    vlValidUntil: row?.vl_valid_until ?? null,
  };
}

const GRACE_DAYS = 7;

/** Single source of truth for "may this user perform write actions". */
export function canWriteProfile(p: ProfileWriteFields | null | undefined) {
  if (!p) return false;
  const now = Date.now();
  if (p.subscription_status === "active") return true;
  if (p.subscription_status === "trialing") {
    return now < Date.parse(p.trial_ends_at);
  }
  if (p.subscription_status === "past_due" && p.past_due_since) {
    return now < Date.parse(p.past_due_since) + GRACE_DAYS * 86_400_000;
  }
  return false;
}

/** Server-only. Fetches the subscription fields for the given user and returns
 *  the canWriteProfile verdict. Throws if the row can't be loaded. */
export async function loadCanWrite(
  supabase: SupabaseClient,
  userId: string,
): Promise<boolean> {
  const { data } = await supabase
    .from("profiles")
    .select("subscription_status, trial_ends_at, past_due_since")
    .eq("id", userId)
    .maybeSingle();
  return canWriteProfile(data as ProfileWriteFields | null);
}

export class SubscriptionInactiveError extends Error {
  constructor() {
    super("Prenumerata neaktyvi — atnaujink, kad galėtum tęsti.");
    this.name = "SubscriptionInactiveError";
  }
}

/** Server-only guard for write server actions. Throws when the active user is
 *  not allowed to write (expired trial, past-due grace exceeded, canceled). */
export async function requireWritableProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<void> {
  const ok = await loadCanWrite(supabase, userId);
  if (!ok) throw new SubscriptionInactiveError();
}
