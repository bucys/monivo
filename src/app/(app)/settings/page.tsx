import { redirect } from "next/navigation";
import { AppScreen } from "@/components/app/app-screen";
import { LogoutRow } from "@/components/settings/logout-row";
import {
  ProfileCard,
  type ProfileSubscriptionStatus,
} from "@/components/settings/profile-card";
import {
  SettingsRow,
  SettingsSection,
} from "@/components/settings/settings-card";
import {
  IconGlobe,
  IconList,
  IconSparkle,
} from "@/components/settings/settings-icons";
import { ExportRow } from "@/components/settings/export-row";
import { LanguageToggle } from "@/components/settings/language-toggle";
import { TaxFormSheet } from "@/components/settings/tax-form-sheet";
import { ThemeToggle } from "@/components/settings/theme-toggle";
import { getDictionary } from "@/i18n";
import { getServerLocale } from "@/i18n/server";
import {
  canWriteProfile,
  TAX_PROFILE_COLUMNS,
  toTaxProfile,
  type ProfileTaxFields,
  type ProfileWriteFields,
} from "@/lib/profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Always hit the database fresh. Without this, manual edits in Supabase
// (or webhook-driven updates) can read through a cached server render.
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const locale = await getServerLocale();
  const t = getDictionary(locale);

  // Split the profile read: core columns must succeed; Stripe-era columns
  // are optional. If the Stripe migration hasn't landed in this environment,
  // the second query can fail and we fall back to nulls without breaking
  // display_name / tax_mode / trial / subscription_status rendering.
  const [coreResult, stripeResult, servicesCount] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        `display_name, profession, tax_rate, subscription_status, trial_ends_at, past_due_since, ${TAX_PROFILE_COLUMNS}`,
      )
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("profiles")
      .select("stripe_customer_id, current_period_ends_at")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("services")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  const profile = coreResult.data;
  if (coreResult.error) {
    console.warn(
      "[settings] core profile read failed:",
      coreResult.error.message,
    );
  }

  const stripeExtras = stripeResult.data as
    | { stripe_customer_id: string | null; current_period_ends_at: string | null }
    | null;
  if (stripeResult.error) {
    console.warn(
      "[settings] stripe extras read failed:",
      stripeResult.error.message,
    );
  }

  const serviceCount = servicesCount.count ?? 0;

  const displayName = profile?.display_name ?? "";
  const taxProfile = toTaxProfile(profile as ProfileTaxFields | null);
  const canWrite = canWriteProfile(profile as ProfileWriteFields | null);
  const rawStatus = profile?.subscription_status ?? "trialing";
  const status: ProfileSubscriptionStatus = (
    ["active", "trialing", "expired", "past_due", "canceled"] as const
  ).includes(rawStatus as ProfileSubscriptionStatus)
    ? (rawStatus as ProfileSubscriptionStatus)
    : "trialing";
  return (
    <AppScreen>
      <div className="flex flex-col gap-[18px] lg:gap-[22px]">
        <div className="lg:hidden">
          <p className="text-[13px] font-medium tracking-[0.01em] text-ink-500">
            {t.settings.subtitle}
          </p>
          <h1 className="mt-0.5 text-[28px] font-semibold leading-tight tracking-[-0.028em] text-ink-900/95">
            {t.settings.title}
          </h1>
        </div>

        <ProfileCard
          displayName={displayName}
          email={user.email ?? ""}
          status={status}
          trialEndsAt={profile?.trial_ends_at ?? null}
          currentPeriodEndsAt={stripeExtras?.current_period_ends_at ?? null}
          hasStripeCustomer={Boolean(stripeExtras?.stripe_customer_id)}
        />

        <SettingsSection label={t.settings.sections.business}>
          <SettingsRow
            icon={<IconList />}
            label={t.settings.business.services}
            detail={String(serviceCount)}
            href="/services"
          />
          <TaxFormSheet initial={taxProfile} canWrite={canWrite} last />
        </SettingsSection>

        <SettingsSection label={t.settings.sections.app}>
          <ThemeToggle icon={<IconSparkle />} />
          <SettingsRow
            icon={<IconGlobe />}
            label={t.settings.app.language}
            right={<LanguageToggle />}
            chevron={false}
          />
          <ExportRow last />
        </SettingsSection>

        <div className="overflow-hidden rounded-[22px] bg-surface shadow-[0_1px_2px_rgba(23,33,29,0.04),_0_8px_24px_rgba(23,33,29,0.05)]">
          <LogoutRow label={t.settings.account.logout} />
        </div>
      </div>
    </AppScreen>
  );
}
