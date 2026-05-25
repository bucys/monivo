import { redirect } from "next/navigation";
import { AppScreen } from "@/components/app/app-screen";
import { LogoutRow } from "@/components/settings/logout-row";
import { ProfileCard } from "@/components/settings/profile-card";
import {
  SettingsRow,
  SettingsSection,
} from "@/components/settings/settings-card";
import {
  IconCrown,
  IconGlobe,
  IconList,
  IconPerson,
  IconSparkle,
} from "@/components/settings/settings-icons";
import { ExportRow } from "@/components/settings/export-row";
import { LanguageToggle } from "@/components/settings/language-toggle";
import { TaxFormSheet } from "@/components/settings/tax-form-sheet";
import { ThemeToggle } from "@/components/settings/theme-toggle";
import { getDictionary } from "@/i18n";
import { getServerLocale } from "@/i18n/server";
import {
  TAX_PROFILE_COLUMNS,
  toTaxProfile,
  type ProfileTaxFields,
} from "@/lib/profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function trialDaysLeft(trialEndsAt: string | null): number | null {
  if (!trialEndsAt) return null;
  const ms = Date.parse(trialEndsAt) - Date.now();
  if (Number.isNaN(ms)) return null;
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const locale = await getServerLocale();
  const t = getDictionary(locale);

  const [{ data: profile }, servicesCount] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        `display_name, profession, tax_rate, subscription_status, trial_ends_at, past_due_since, ${TAX_PROFILE_COLUMNS}`,
      )
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("services")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);
  const serviceCount = servicesCount.count ?? 0;

  const displayName = profile?.display_name ?? "";
  const taxProfile = toTaxProfile(profile as ProfileTaxFields | null);
  const status = profile?.subscription_status ?? "trialing";
  const daysLeft = trialDaysLeft(profile?.trial_ends_at ?? null);

  const statusLabel = (() => {
    switch (status) {
      case "active":
        return t.settings.subscription.statusActive;
      case "trialing":
        return t.settings.subscription.statusTrialing;
      case "expired":
        return t.settings.subscription.statusExpired;
      case "past_due":
        return t.settings.subscription.statusPastDue;
      case "canceled":
        return t.settings.subscription.statusCanceled;
      default:
        return status;
    }
  })();

  const trialNote =
    status === "trialing"
      ? daysLeft !== null && daysLeft > 0
        ? t.settings.subscription.trialDaysLeft.replace("{n}", String(daysLeft))
        : t.settings.subscription.trialEnded
      : undefined;

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
          subline={t.settings.profile.individualActivity}
          editLabel={t.settings.profile.editTitle}
        />

        <SettingsSection label={t.settings.sections.business}>
          <SettingsRow
            icon={<IconList />}
            label={t.settings.business.services}
            detail={String(serviceCount)}
            href="/services"
          />
          <TaxFormSheet initial={taxProfile} last />
        </SettingsSection>

        <SettingsSection label={t.settings.sections.app}>
          <SettingsRow
            icon={<IconSparkle />}
            label={t.settings.app.appearance}
            right={<ThemeToggle />}
            chevron={false}
          />
          <SettingsRow
            icon={<IconGlobe />}
            label={t.settings.app.language}
            right={<LanguageToggle />}
            chevron={false}
          />
          <ExportRow last />
        </SettingsSection>

        <SettingsSection label={t.settings.sections.subscription}>
          <SettingsRow
            icon={<IconCrown />}
            label={t.settings.subscription.title}
            detail={trialNote ?? statusLabel}
            chevron={false}
            right={
              <span className="inline-flex items-center rounded-full bg-accent-soft px-3 py-1 text-[12px] font-semibold text-accent-deep">
                {statusLabel}
              </span>
            }
            last
          />
        </SettingsSection>

        <SettingsSection label={t.settings.sections.account}>
          <SettingsRow
            icon={<IconPerson />}
            label={t.settings.account.email}
            detail={user.email ?? ""}
            chevron={false}
          />
          <LogoutRow label={t.settings.account.logout} />
        </SettingsSection>
      </div>
    </AppScreen>
  );
}
