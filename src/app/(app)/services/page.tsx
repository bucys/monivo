import { redirect } from "next/navigation";
import { AppPageHeader } from "@/components/app/app-page-header";
import { AppScreen } from "@/components/app/app-screen";
import { canWriteProfile } from "@/lib/profile";
import { createSupabaseServerClient, getAuthUser } from "@/lib/supabase/server";
import { ServicesClient, type ServiceRow } from "./services-client";

export default async function ServicesPage() {
  const supabase = await createSupabaseServerClient();
  const user = await getAuthUser();
  if (!user) redirect("/login");

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
  const rows: ReadonlyArray<ServiceRow> = services ?? [];

  return (
    <AppScreen>
      <AppPageHeader />
      <ServicesClient services={rows} canWrite={canWrite} />
    </AppScreen>
  );
}
