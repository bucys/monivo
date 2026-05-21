import type { SupabaseClient } from "@supabase/supabase-js";

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
