import { redirect } from "next/navigation";
import { AppScreen } from "@/components/app/app-screen";
import { TodayEmpty } from "@/components/dashboard/empty-prompt";
import { MobileQuickActions } from "@/components/dashboard/mobile-quick-actions";
import { MonthlyStats } from "@/components/dashboard/monthly-stats";
import { NotificationBell } from "@/components/notifications/notification-bell";
import {
  QuickActions,
  type QuickService,
} from "@/components/dashboard/quick-actions";
import {
  TodayCard,
  expenseLabel,
  type PaymentMethod,
  type RecentEntry,
} from "@/components/dashboard/recent-activity";
import { SpendableHero } from "@/components/dashboard/spendable-card";
import { MobileTodayList } from "@/components/dashboard/today-list";
import { WeeklyEarnings } from "@/components/dashboard/weekly-earnings";
import { monthRange } from "@/lib/format";
import { canWriteProfile } from "@/lib/profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function todayIso() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function weekBucket(isoDate: string) {
  const dayOfMonth = Number(isoDate.slice(8, 10));
  return Math.min(3, Math.floor((dayOfMonth - 1) / 7));
}

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { monthStart, nextMonthStart, label } = monthRange();
  const today = todayIso();

  const [
    { data: profile },
    { data: services },
    { data: incomeRows },
    { data: expenseRows },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "display_name, tax_rate, subscription_status, trial_ends_at, past_due_since",
      )
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
        "id, amount_cents, service_name, payment_method, note, occurred_at, created_at",
      )
      .eq("user_id", user.id)
      .gte("occurred_at", monthStart)
      .lt("occurred_at", nextMonthStart),
    supabase
      .from("expense_entries")
      .select("id, amount_cents, category, note, occurred_at, created_at")
      .eq("user_id", user.id)
      .gte("occurred_at", monthStart)
      .lt("occurred_at", nextMonthStart),
  ]);

  const incomes = incomeRows ?? [];
  const expenses = expenseRows ?? [];
  const serviceList: ReadonlyArray<QuickService> = services ?? [];
  const taxRate = Number(profile?.tax_rate ?? 0);
  const canWrite = canWriteProfile(profile);
  const displayName = profile?.display_name?.trim() ?? "";
  const greeting = displayName ? `Labas, ${displayName}` : "Labas";

  const incomeCents = incomes.reduce((acc, r) => acc + (r.amount_cents ?? 0), 0);
  const expenseCents = expenses.reduce(
    (acc, r) => acc + (r.amount_cents ?? 0),
    0,
  );
  const taxReserveCents = Math.round(incomeCents * taxRate);
  const spendableCents = incomeCents - expenseCents - taxReserveCents;
  const wentNegative = spendableCents < 0;

  const heroSub = wentNegative
    ? "Šį mėnesį išlaidos viršija pajamas."
    : "Lieka po mokesčių rezervo ir išlaidų.";

  const weeks: [number, number, number, number] = [0, 0, 0, 0];
  for (const r of incomes) {
    const b = weekBucket(r.occurred_at);
    weeks[b as 0 | 1 | 2 | 3] += r.amount_cents ?? 0;
  }
  const currentWeekIndex = weekBucket(today);

  const todayEntries: ReadonlyArray<RecentEntry> = [
    ...incomes.map<RecentEntry>((r) => ({
      id: `i_${r.id}`,
      rawId: String(r.id),
      kind: "income",
      label: r.service_name ?? "Pajamos",
      amountCents: r.amount_cents,
      occurredAt: r.occurred_at,
      createdAt: r.created_at,
      sortKey: r.created_at,
      paymentMethod: (r.payment_method ?? null) as PaymentMethod | null,
      note: r.note,
    })),
    ...expenses.map<RecentEntry>((r) => ({
      id: `e_${r.id}`,
      rawId: String(r.id),
      kind: "expense",
      label: expenseLabel(r.category),
      amountCents: r.amount_cents,
      occurredAt: r.occurred_at,
      createdAt: r.created_at,
      sortKey: r.created_at,
      note: r.note,
      categorySlug: r.category,
    })),
  ]
    .filter((e) => e.occurredAt === today)
    .sort((a, b) => (a.sortKey < b.sortKey ? 1 : -1));

  const todayIncomeCents = todayEntries
    .filter((e) => e.kind === "income")
    .reduce((acc, e) => acc + e.amountCents, 0);
  const todayExpenseCents = todayEntries
    .filter((e) => e.kind === "expense")
    .reduce((acc, e) => acc + e.amountCents, 0);

  return (
    <AppScreen>
      <header className="mb-5 flex items-start justify-between gap-4 lg:mb-9">
        <div>
          <p className="text-[13px] font-medium tracking-[0.01em] text-ink-500 lg:text-[11px] lg:font-semibold lg:uppercase lg:tracking-[0.1em]">
            {label}
          </p>
          <h1 className="mt-0.5 text-[28px] font-semibold leading-tight tracking-[-0.028em] text-ink-900/95 lg:mt-1.5 lg:text-[30px] lg:tracking-[-0.025em] lg:text-ink-900/90">
            {greeting}
          </h1>
        </div>
        <div className="hidden lg:block">
          <NotificationBell />
        </div>
      </header>

      <div className="flex flex-col gap-[18px] lg:gap-[22px]">
        <SpendableHero
          spendableCents={spendableCents}
          incomeCents={incomeCents}
          expenseCents={expenseCents}
          taxReserveCents={taxReserveCents}
          heroSub={heroSub}
        />

        <MonthlyStats
          incomeCents={incomeCents}
          expenseCents={expenseCents}
          taxReserveCents={taxReserveCents}
        />

        <MobileQuickActions services={serviceList} canWrite={canWrite} />

        <div className="hidden grid-cols-[1.5fr_1fr] items-stretch gap-[22px] lg:grid">
          <WeeklyEarnings
            weeks={weeks}
            totalCents={incomeCents}
            currentWeekIndex={currentWeekIndex}
          />
          <QuickActions services={serviceList} canWrite={canWrite} />
        </div>

        <div className="hidden lg:block">
          {todayEntries.length > 0 ? (
            <TodayCard
              entries={todayEntries}
              incomeCents={todayIncomeCents}
              expenseCents={todayExpenseCents}
            />
          ) : (
            <TodayEmpty
              incomeCents={todayIncomeCents}
              expenseCents={todayExpenseCents}
            />
          )}
        </div>

        <MobileTodayList entries={todayEntries} />
      </div>
    </AppScreen>
  );
}
