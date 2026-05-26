import { redirect } from "next/navigation";
import { AppPageHeader } from "@/components/app/app-page-header";
import { AppScreen } from "@/components/app/app-screen";
import { BestDayCard } from "@/components/insights/best-day-card";
import { ServicesPerformedCard } from "@/components/insights/clients-week-card";
import { TopServicesCard } from "@/components/insights/top-services";
import { WeeklyEarningsCard } from "@/components/insights/weekly-earnings-card";
import { Disclosure } from "@/components/ui/disclosure";
import { getT } from "@/i18n/server";
import { formatMonth, monthRange } from "@/lib/format";
import {
  bestWeekday,
  rankServices,
  tallyByWeekday,
  totalsByWeek,
  weekBucket,
  type IncomeRow,
} from "@/lib/insights";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function todayIso() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default async function InsightsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { t, locale } = await getT();
  const { monthStart, nextMonthStart } = monthRange();
  const monthLabel = formatMonth(new Date(), locale);

  const [{ data: serviceRows }, { data: incomeRows }] = await Promise.all([
    supabase.from("services").select("id, name").eq("user_id", user.id),
    supabase
      .from("income_entries")
      .select("amount_cents, service_id, service_name, occurred_at")
      .eq("user_id", user.id)
      .gte("occurred_at", monthStart)
      .lt("occurred_at", nextMonthStart),
  ]);

  const incomes: IncomeRow[] = incomeRows ?? [];
  const services = serviceRows ?? [];

  const incomeCents = incomes.reduce((a, r) => a + (r.amount_cents ?? 0), 0);
  const weeks = totalsByWeek(incomes);
  const currentWeekIndex = weekBucket(todayIso());
  const weekdayTallies = tallyByWeekday(incomes);
  const best = bestWeekday(incomes);
  const rankedServices = rankServices(incomes, services);
  const servicesPerformed = incomes.length;

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

        <ServicesPerformedCard
          count={servicesPerformed}
          labels={t.insights.clients}
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
              labels={t.insights.bestDay}
              locale={locale}
            />
          </div>
        </Disclosure>
      </div>
    </AppScreen>
  );
}
