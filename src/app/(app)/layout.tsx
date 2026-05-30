import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AppShell, type SidebarData } from "@/components/app/app-shell";
import { SubscriptionBanner } from "@/components/app/subscription-banner";
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
import { createSupabaseServerClient, getAuthUser } from "@/lib/supabase/server";
import { calculateTaxReserve } from "@/lib/tax";
import type { ServiceChip } from "@/components/add-entry/income-form";

// The authenticated app (app.monivo.lt) is private user data — never index any
// of its routes. Authoritative noindex signal alongside the robots.txt rules.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  // Single profile read — covers the onboarding gate, the canWrite check,
  // sidebar copy, and the tax-reserve sidebar number. Previously this was
  // split into a narrow "gate" query and a wider "core" query, which cost
  // an extra sequential round-trip on every navigation between app tabs.
  // Stripe-era columns (stripe_customer_id, current_period_ends_at) are
  // intentionally NOT selected here — Settings fetches them separately.
  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select(
      `onboarding_completed_at, display_name, profession, tax_rate, subscription_status, trial_ends_at, past_due_since, ${TAX_PROFILE_COLUMNS}`,
    )
    .eq("id", user.id)
    .maybeSingle();
  if (profileErr) {
    console.warn("[app-layout] core profile read failed:", profileErr.message);
  }

  if (
    !(profile as { onboarding_completed_at?: string | null } | null)
      ?.onboarding_completed_at
  ) {
    redirect("/onboarding");
  }

  const { t } = await getT();
  const canWrite = canWriteProfile(profile as ProfileWriteFields | null);

  const { monthStart, nextMonthStart } = monthRange();
  const [
    { data: monthIncome },
    { data: monthExpenses },
    { data: serviceRows },
    notifications,
  ] = await Promise.all([
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
      // Shared with the always-mounted quick-add sheet (AddEntryMount) so it no
      // longer needs its own getUser + profile + services round-trips.
      supabase
        .from("services")
        .select("id, name, price_cents")
        .eq("user_id", user.id)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      loadNotifications(supabase, user.id, t.notifications.generated, {
        subscription_status:
          (profile as { subscription_status?: string | null } | null)
            ?.subscription_status ?? null,
        trial_ends_at:
          (profile as { trial_ends_at?: string | null } | null)
            ?.trial_ends_at ?? null,
      }),
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
  // Sidebar subtitle shows the legal/tax activity form (IV / VL / Custom),
  // not the onboarding profession. Falls back to the IV label when no tax
  // profile data is available.
  const activityLabel = t.settings.tax.modes[taxProfile.taxMode];

  const sidebar: SidebarData = {
    displayName: displayName || t.nav.accountFallback,
    activityLabel,
    reserveCents: reserveCents > 0 ? reserveCents : null,
  };

  const quickAddServices: ReadonlyArray<ServiceChip> = serviceRows ?? [];

  return (
    <AppShell
      notifications={notifications}
      canWrite={canWrite}
      sidebar={sidebar}
      quickAddServices={quickAddServices}
    >
      <div className="mb-3 lg:mb-4">
        <SubscriptionBanner
          status={profile?.subscription_status ?? "trialing"}
          trialEndsAt={profile?.trial_ends_at ?? null}
          canWrite={canWrite}
          t={t}
        />
      </div>
      {children}
    </AppShell>
  );
}
