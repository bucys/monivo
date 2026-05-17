import { redirect } from "next/navigation";
import { AppScreen } from "@/components/app/app-screen";
import { BestDayCard } from "@/components/insights/best-day-card";
import { ServicesPerformedCard } from "@/components/insights/clients-week-card";
import { TopServicesCard } from "@/components/insights/top-services";
import { WeeklyEarningsCard } from "@/components/insights/weekly-earnings-card";
import { monthRange } from "@/lib/format";
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

  const { monthStart, nextMonthStart, label } = monthRange();

  const [{ data: serviceRows }, { data: incomeRows }] = await Promise.all([
    supabase.from("services").select("id, name").eq("user_id", user.id),
    supabase
      .from("income_entries")
      .select(
        "amount_cents, service_id, service_name, payment_method, occurred_at",
      )
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
      <div className="flex flex-col gap-[18px] lg:gap-[22px]">
        <div className="lg:hidden">
          <p className="text-[13px] font-medium tracking-[0.01em] text-ink-500">
            {label}
          </p>
          <h1 className="mt-0.5 text-[28px] font-semibold leading-tight tracking-[-0.028em] text-ink-900/95">
            Įžvalgos
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-[18px] lg:grid-cols-[2fr_1fr] lg:grid-rows-[auto_auto] lg:gap-[22px]">
          <div className="lg:col-start-1 lg:row-span-2">
            <WeeklyEarningsCard
              weeks={weeks}
              totalCents={incomeCents}
              currentWeekIndex={currentWeekIndex}
            />
          </div>
          <div className="lg:col-start-2 lg:row-start-1">
            <BestDayCard tallies={weekdayTallies} best={best} />
          </div>
          <div className="lg:col-start-2 lg:row-start-2">
            <ServicesPerformedCard count={servicesPerformed} />
          </div>
        </div>

        <TopServicesCard services={rankedServices} totalCents={incomeCents} />
      </div>
    </AppScreen>
  );
}
