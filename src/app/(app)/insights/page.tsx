import { redirect } from "next/navigation";
import { AppPageHeader } from "@/components/app/app-page-header";
import { AppScreen } from "@/components/app/app-screen";
import { BestDayCard } from "@/components/insights/best-day-card";
import { ServicesPerformedCard } from "@/components/insights/clients-week-card";
import { InsightsMonth } from "@/components/insights/insights-month";
import { InsightsSummaryCard } from "@/components/insights/insights-summary-card";
import { TopServicesCard } from "@/components/insights/top-services";
import { WeeklyEarningsCard } from "@/components/insights/weekly-earnings-card";
import { Disclosure } from "@/components/ui/disclosure";
import { format } from "@/i18n";
import { getT } from "@/i18n/server";
import { monthsFromIsoDates, resolvePeriod } from "@/lib/activity";
import { formatMonth } from "@/lib/format";
import {
  bestWeekday,
  monthAccusativePhrase,
  rankServices,
  tallyByWeekday,
  totalsByWeek,
  weekBucket,
  type IncomeRow,
} from "@/lib/insights";
import {
  TAX_PROFILE_COLUMNS,
  toTaxProfile,
  type ProfileTaxFields,
} from "@/lib/profile";
import { createSupabaseServerClient, getAuthUser } from "@/lib/supabase/server";
import { calculateTaxReserve } from "@/lib/tax";

function todayIso() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const supabase = await createSupabaseServerClient();
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const { month: monthParam } = await searchParams;
  const { t, locale } = await getT();
  const now = new Date();

  // Only accept a clean YYYY-MM; anything else (empty, invalid, "week", …)
  // falls back to the current month via resolvePeriod's default branch.
  const rawMonth = /^\d{4}-\d{2}$/.test(monthParam ?? "")
    ? monthParam
    : undefined;
  const period = resolvePeriod(
    rawMonth,
    now,
    { week: t.activity.period.week, month: t.activity.period.month },
    locale,
  );
  // mode === "custom" means a specific, non-current month.
  const isCurrent = period.mode !== "custom";

  const [sy, sm] = period.startDate.split("-").map(Number);
  const selStart = new Date(sy!, (sm ?? 1) - 1, 1);

  const currentValue = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const selectedValue = period.monthValue ?? currentValue;
  const currentLabel = formatMonth(
    new Date(now.getFullYear(), now.getMonth(), 1),
    locale,
  );
  const monthLabel = formatMonth(selStart, locale);

  const [
    { data: profileRow },
    { data: serviceRows },
    { data: incomeRows },
    { data: monthExpenseRows },
    { data: incomeMonthRows },
    { data: expenseMonthRows },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select(TAX_PROFILE_COLUMNS)
      .eq("id", user.id)
      .maybeSingle(),
    supabase.from("services").select("id, name").eq("user_id", user.id),
    supabase
      .from("income_entries")
      .select("amount_cents, service_id, service_name, occurred_at")
      .eq("user_id", user.id)
      .gte("occurred_at", period.startDate)
      .lt("occurred_at", period.endDate),
    // Selected-month expenses — only for the summary card's totals.
    supabase
      .from("expense_entries")
      .select("amount_cents")
      .eq("user_id", user.id)
      .gte("occurred_at", period.startDate)
      .lt("occurred_at", period.endDate),
    // Same source as Activity so the month list is identical (income + expense).
    supabase.from("income_entries").select("occurred_at").eq("user_id", user.id),
    supabase
      .from("expense_entries")
      .select("occurred_at")
      .eq("user_id", user.id),
  ]);

  const availableMonths = monthsFromIsoDates(
    [
      ...(incomeMonthRows ?? []).map((r) => r.occurred_at as string),
      ...(expenseMonthRows ?? []).map((r) => r.occurred_at as string),
    ],
    locale,
  );

  // A specific month with no data (or a future / out-of-range month) → return
  // to the current month with a clean URL. Mirrors the Activity guard.
  if (
    period.mode === "custom" &&
    period.monthValue &&
    !availableMonths.some((m) => m.value === period.monthValue)
  ) {
    redirect("/insights");
  }

  const incomes: IncomeRow[] = incomeRows ?? [];
  const services = serviceRows ?? [];

  const incomeCents = incomes.reduce((a, r) => a + (r.amount_cents ?? 0), 0);

  // Monthly summary card — same selected-month window, shared tax-reserve calc.
  const expenseCents = (monthExpenseRows ?? []).reduce(
    (a, r) => a + (r.amount_cents ?? 0),
    0,
  );
  const taxProfile = toTaxProfile(profileRow as ProfileTaxFields | null);
  const reserve = calculateTaxReserve(taxProfile, { incomeCents, expenseCents });
  const taxReserveCents = reserve.totalCents;
  const remainingCents = incomeCents - expenseCents - taxReserveCents;

  const weeks = totalsByWeek(incomes);
  // Only highlight the live week when viewing the current month.
  const currentWeekIndex = isCurrent ? weekBucket(todayIso()) : -1;
  const weekdayTallies = tallyByWeekday(incomes);
  const best = bestWeekday(incomes);
  const rankedServices = rankServices(incomes, services);
  const servicesPerformed = incomes.length;

  // Month phrase substituted into the month-aware copy: "šį mėnesį" for the
  // current month, else the accusative form (e.g. "balandį" / "in April").
  const monthPhrase = isCurrent
    ? t.insights.thisMonth
    : monthAccusativePhrase(selStart, locale);

  // Summary card heading: sentence-cased month phrase ("Šį mėnesį" / "Balandį").
  const summaryTitle =
    monthPhrase.charAt(0).toUpperCase() + monthPhrase.slice(1);

  const clientsLabels = {
    ...t.insights.clients,
    eyebrow: format(t.insights.clients.eyebrow, { month: monthPhrase }),
    emptyBody: format(t.insights.clients.emptyBody, { month: monthPhrase }),
  };
  const bestDayLabels = {
    ...t.insights.bestDay,
    summary: format(t.insights.bestDay.summary, { month: monthPhrase }),
  };

  return (
    <AppScreen>
      <AppPageHeader />
      <div className="flex flex-col gap-[18px] lg:gap-[22px]">
        <div className="lg:hidden">
          <p className="text-[13px] font-medium tracking-[0.01em] text-ink-500">
            {monthLabel}
          </p>
          <h1 className="mt-0.5 text-[28px] font-semibold leading-tight tracking-[-0.028em] text-ink-900/95">
            {t.insights.title}
          </h1>
        </div>

        <InsightsMonth
          months={availableMonths}
          selectedValue={selectedValue}
          currentValue={currentValue}
          currentLabel={currentLabel}
        />

        <InsightsSummaryCard
          title={summaryTitle}
          incomeCents={incomeCents}
          expenseCents={expenseCents}
          taxReserveCents={taxReserveCents}
          remainingCents={remainingCents}
          labels={t.insights.summary}
        />

        <ServicesPerformedCard
          count={servicesPerformed}
          labels={clientsLabels}
        />

        <TopServicesCard
          services={rankedServices}
          totalCents={incomeCents}
          labels={t.insights.topServices}
        />

        <Disclosure
          label={t.insights.moreToggle}
          labelOpen={t.insights.lessToggle}
        >
          <div className="grid grid-cols-1 gap-[18px] lg:grid-cols-[2fr_1fr] lg:gap-[22px]">
            <WeeklyEarningsCard
              weeks={weeks}
              totalCents={incomeCents}
              currentWeekIndex={currentWeekIndex}
              labels={t.insights.earnings}
            />
            <BestDayCard
              tallies={weekdayTallies}
              best={best}
              labels={bestDayLabels}
              locale={locale}
            />
          </div>
        </Disclosure>
      </div>
    </AppScreen>
  );
}
