import { canWriteProfile } from "@/lib/profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AddEntrySheet } from "./add-entry-sheet";
import type { ServiceChip } from "./income-form";

export async function AddEntryMount() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [{ data: profile }, { data: services }] = await Promise.all([
    supabase
      .from("profiles")
      .select("subscription_status, trial_ends_at, past_due_since")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("services")
      .select("id, name, price_cents")
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);

  const canWrite = canWriteProfile(profile);
  const rows: ReadonlyArray<ServiceChip> = services ?? [];

  return <AddEntrySheet services={rows} canWrite={canWrite} />;
}
