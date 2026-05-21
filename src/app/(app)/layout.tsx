import { redirect } from "next/navigation";
import { AppShell, type SidebarData } from "@/components/app/app-shell";
import { getT } from "@/i18n/server";
import { monthRange } from "@/lib/format";
import { loadNotifications } from "@/lib/notifications";
import {
  TAX_PROFILE_COLUMNS,
  canWriteProfile,
  toTaxProfile,
  type ProfileTaxFields,
  type ProfileWriteFields,
} from "@/lib/profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { calculateTaxReserve } from "@/lib/tax";

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

  // Routing gate first — keep this query narrow so missing optional columns
  // (e.g. a pending tax-profile migration) can never break the redirect logic
  // and bounce the user into an onboarding loop.
  const { data: gate } = await supabase
    .from("profiles")
    .select("onboarding_completed_at")
    .eq("id", user.id)
    .maybeSingle();

  if (!gate?.onboarding_completed_at) {
    redirect("/onboarding");
  }

  // Wider read for shell/tax/sidebar data. If it errors (e.g. a column doesn't
  // exist yet on this environment) we log and fall back to safe defaults
  // instead of redirecting.
  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select(
      `display_name, profession, tax_rate, subscription_status, trial_ends_at, past_due_since, ${TAX_PROFILE_COLUMNS}`,
    )
    .eq("id", user.id)
    .maybeSingle();
  if (profileErr) {
    console.warn("[app-layout] profile read failed:", profileErr.message);
  }

  const { t } = await getT();
  const canWrite = canWriteProfile(profile as ProfileWriteFields | null);

  const { monthStart, nextMonthStart } = monthRange();
  const [{ data: monthIncome }, { data: monthExpenses }, notifications] =
    await Promise.all([
      supabase
        .from("income_entries")
        .select("amount_cents")
        .eq("user_id", user.id)
        .gte("occurred_at", monthStart)
        .lt("occurred_at", nextMonthStart),
      supabase
        .from("expense_entries")
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
  const expenseCents = (monthExpenses ?? []).reduce(
    (a, r) => a + (r.amount_cents ?? 0),
    0,
  );
  const taxProfile = toTaxProfile(profile as ProfileTaxFields | null);
  const reserve = calculateTaxReserve(taxProfile, {
    incomeCents,
    expenseCents,
  });
  const reserveCents = reserve.totalCents;

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
