import { redirect } from "next/navigation";
import { AppScreen } from "@/components/app/app-screen";
import { ActivityFeed } from "@/components/activity/activity-feed";
import type { ServiceChip } from "@/components/add-entry/income-form";
import type {
  PaymentMethod,
  RecentEntry,
} from "@/components/dashboard/recent-activity";
import { getT } from "@/i18n/server";
import { resolvePeriod } from "@/lib/activity";
import { canWriteProfile } from "@/lib/profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ActivityPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { period: periodParam } = await searchParams;
  const { t, locale } = await getT();
  const period = resolvePeriod(
    periodParam,
    new Date(),
    { week: t.activity.period.week, month: t.activity.period.month },
    locale,
  );

  const [
    { data: profile },
    { data: serviceRows },
    { data: incomeRows },
    { data: expenseRows },
  ] = await Promise.all([
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
      .order("created_at", { ascending: true })
      .limit(8),
    supabase
      .from("income_entries")
      .select(
        "id, amount_cents, service_id, service_name, payment_method, note, occurred_at, created_at",
      )
      .eq("user_id", user.id)
      .gte("occurred_at", period.startDate)
      .lt("occurred_at", period.endDate)
      .order("occurred_at", { ascending: false })
      .order("created_at", { ascending: false })
      .order("id", { ascending: false }),
    supabase
      .from("expense_entries")
      .select("id, amount_cents, category, note, occurred_at, created_at")
      .eq("user_id", user.id)
      .gte("occurred_at", period.startDate)
      .lt("occurred_at", period.endDate)
      .order("occurred_at", { ascending: false })
      .order("created_at", { ascending: false })
      .order("id", { ascending: false }),
  ]);

  const incomes = incomeRows ?? [];
  const expenses = expenseRows ?? [];
  const services: ReadonlyArray<ServiceChip> = serviceRows ?? [];
  const canWrite = canWriteProfile(profile);

  const entries: RecentEntry[] = [
    ...incomes.map<RecentEntry>((r) => ({
      id: `i_${r.id}`,
      rawId: String(r.id),
      kind: "income",
      label: r.service_name ?? null,
      amountCents: r.amount_cents,
      occurredAt: r.occurred_at,
      createdAt: r.created_at,
      sortKey: `${r.occurred_at}|${r.created_at}|${r.id}`,
      paymentMethod: (r.payment_method ?? null) as PaymentMethod | null,
      note: r.note,
      serviceId: (r.service_id as string | null) ?? null,
    })),
    ...expenses.map<RecentEntry>((r) => ({
      id: `e_${r.id}`,
      rawId: String(r.id),
      kind: "expense",
      label: null,
      amountCents: r.amount_cents,
      occurredAt: r.occurred_at,
      createdAt: r.created_at,
      sortKey: `${r.occurred_at}|${r.created_at}|${r.id}`,
      note: r.note,
      categorySlug: r.category,
    })),
  ].sort((a, b) =>
    a.sortKey < b.sortKey ? 1 : a.sortKey > b.sortKey ? -1 : 0,
  );

  return (
    <AppScreen>
      <ActivityFeed
        entries={entries}
        periodMode={period.mode}
        periodLabel={period.label}
        monthValue={period.monthValue}
        services={services}
        canWrite={canWrite}
      />
    </AppScreen>
  );
}
