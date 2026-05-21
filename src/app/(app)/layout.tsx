import { redirect } from "next/navigation";
import { AppShell, type SidebarData } from "@/components/app/app-shell";
import { getT } from "@/i18n/server";
import { monthRange } from "@/lib/format";
import { loadNotifications } from "@/lib/notifications";
import { canWriteProfile, type ProfileWriteFields } from "@/lib/profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ProfessionKey =
  | "hair"
  | "nails"
  | "cosmetology"
  | "lashes"
  | "other";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "onboarding_completed_at, display_name, profession, tax_rate, subscription_status, trial_ends_at, past_due_since",
    )
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.onboarding_completed_at) {
    redirect("/onboarding");
  }

  const { t } = await getT();
  const canWrite = canWriteProfile(profile as ProfileWriteFields | null);

  const { monthStart, nextMonthStart } = monthRange();
  const [{ data: monthIncome }, notifications] = await Promise.all([
    supabase
      .from("income_entries")
      .select("amount_cents")
      .eq("user_id", user.id)
      .gte("occurred_at", monthStart)
      .lt("occurred_at", nextMonthStart),
    loadNotifications(supabase, user.id, t.notifications.generated),
  ]);

  const incomeCents = (monthIncome ?? []).reduce(
    (a, r) => a + (r.amount_cents ?? 0),
    0,
  );
  const taxRate = Number(profile?.tax_rate ?? 0);
  const reserveCents =
    taxRate > 0 && incomeCents > 0 ? Math.round(incomeCents * taxRate) : 0;

  const displayName = profile?.display_name?.trim() ?? "";
  const professionRaw = (profile?.profession ?? "") as string;
  const professionLabels = t.nav.professions;
  const professionLabel =
    professionRaw && professionRaw in professionLabels
      ? professionLabels[professionRaw as ProfessionKey]
      : "";

  const sidebar: SidebarData = {
    displayName: displayName || t.nav.accountFallback,
    professionLabel: professionLabel || t.nav.individualActivity,
    reserveCents: reserveCents > 0 ? reserveCents : null,
  };

  return (
    <AppShell
      notifications={notifications}
      canWrite={canWrite}
      sidebar={sidebar}
    >
      {children}
    </AppShell>
  );
}
