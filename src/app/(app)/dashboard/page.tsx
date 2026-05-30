import { redirect } from "next/navigation";
import { AppScreen } from "@/components/app/app-screen";
import { TodayEmpty } from "@/components/dashboard/empty-prompt";
import { MobileQuickActions } from "@/components/dashboard/mobile-quick-actions";
import { MonthlyStats } from "@/components/dashboard/monthly-stats";
import { ReserveBreakdownCard } from "@/components/dashboard/reserve-breakdown-card";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { Disclosure } from "@/components/ui/disclosure";
import {
  QuickActions,
  type QuickService,
} from "@/components/dashboard/quick-actions";
import {
  TodayCard,
  type PaymentMethod,
  type RecentEntry,
} from "@/components/dashboard/recent-activity";
import { SpendableHero } from "@/components/dashboard/spendable-card";
import { MobileTodayList } from "@/components/dashboard/today-list";
import { WeeklyEarnings } from "@/components/dashboard/weekly-earnings";
import { format } from "@/i18n";
import { getT } from "@/i18n/server";
import { monthRange, yearRange } from "@/lib/format";
import {
  TAX_PROFILE_COLUMNS,
  canWriteProfile,
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

function weekBucket(isoDate: string) {
  const dayOfMonth = Number(isoDate.slice(8, 10));
  return Math.min(3, Math.floor((dayOfMonth - 1) / 7));
}

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const { t, locale } = await getT();
  const { monthStart, nextMonthStart, label } = monthRange(new Date(), locale);
  const { yearStart, nextYearStart } = yearRange();
  const today = todayIso();

  const [
    { data: profile },
    { data: services },
    { data: incomeRows },
    { data: expenseRows },
    { data: yearIncomeRows },
    { data: yearExpenseRows },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        `display_name, tax_rate, subscription_status, trial_ends_at, past_due_since, ${TAX_PROFILE_COLUMNS}`,
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
    // Year-to-date totals — only for the reserve card's "accumulated this year"
    // line. Same range/calc the sidebar uses.
    supabase
      .from("income_entries")
      .select("amount_cents")
      .eq("user_id", user.id)
      .gte("occurred_at", yearStart)
      .lt("occurred_at", nextYearStart),
    supabase
      .from("expense_entries")
      .select("amount_cents")
      .eq("user_id", user.id)
      .gte("occurred_at", yearStart)
      .lt("occurred_at", nextYearStart),
  ]);

  const incomes = incomeRows ?? [];
  const expenses = expenseRows ?? [];
  const serviceList: ReadonlyArray<QuickService> = services ?? [];
  const taxProfile = toTaxProfile(profile as ProfileTaxFields | null);
  const canWrite = canWriteProfile(profile);
  const displayName = profile?.display_name?.trim() ?? "";
  const greeting = displayName
    ? format(t.dashboard.greetingNamed, { name: displayName })
    : t.dashboard.greeting;

  const incomeCents = incomes.reduce((acc, r) => acc + (r.amount_cents ?? 0), 0);
  const expenseCents = expenses.reduce(
    (acc, r) => acc + (r.amount_cents ?? 0),
    0,
  );
  const reserve = calculateTaxReserve(taxProfile, {
    incomeCents,
    expenseCents,
  });
  const taxReserveCents = reserve.totalCents;
  // Cumulative recommended reserve for the year so far — same calc as sidebar.
  const yearlyReserveCents = calculateTaxReserve(taxProfile, {
    incomeCents: (yearIncomeRows ?? []).reduce(
      (a, r) => a + (r.amount_cents ?? 0),
      0,
    ),
    expenseCents: (yearExpenseRows ?? []).reduce(
      (a, r) => a + (r.amount_cents ?? 0),
      0,
    ),
  }).totalCents;
  const spendableCents = incomeCents - expenseCents - taxReserveCents;
  const wentNegative = spendableCents < 0;

  const heroSub = wentNegative
    ? t.dashboard.spendableSubNegative
    : t.dashboard.spendableSubPositive;

  const heroLabels = {
    aria: t.dashboard.spendableAria,
    title: t.dashboard.spendableTitle,
    monthlyComposition: t.dashboard.monthlyComposition,
    incomeRemainder: t.dashboard.incomeRemainderLabel,
    incomeCaption: t.dashboard.incomeCaption,
    income: t.dashboard.statsIncome,
    expense: t.dashboard.statsExpense,
    taxReserve: t.dashboard.statsTaxReserve,
  };
  const statLabels = {
    income: t.dashboard.statsIncome,
    expense: t.dashboard.statsExpense,
    taxReserve: t.dashboard.statsTaxReserve,
  };
  const todayLabels = {
    aria: t.dashboard.todayAria,
    title: t.dashboard.todayTitle,
    countSingle: t.dashboard.todayCountSingle,
    countFew: t.dashboard.todayCountFew,
    countMany: t.dashboard.todayCountMany,
    payCash: t.dashboard.todayPaymentCash,
    payCard: t.dashboard.todayPaymentCard,
    payTransfer: t.dashboard.todayPaymentTransfer,
    payExpense: t.dashboard.todayPaymentExpense,
  };
  const emptyLabels = {
    aria: t.dashboard.todayAria,
    title: t.dashboard.todayTitle,
    countZero: `0 ${t.dashboard.todayCountMany}`,
    emptyTitle: t.dashboard.todayEmptyTitle,
    emptyBody: t.dashboard.todayEmptyBody,
  };
  const mobileTodayLabels = {
    aria: t.dashboard.todayAria,
    title: t.dashboard.todayTitle,
    seeAll: t.common.seeAll,
    emptyTitle: t.dashboard.todayEmptyTitle,
    emptyBody: t.dashboard.todayEmptyBody,
    payCash: t.dashboard.todayPaymentCash,
    payCard: t.dashboard.todayPaymentCard,
    payTransfer: t.dashboard.todayPaymentTransfer,
  };

  const weeks: [number, number, number, number] = [0, 0, 0, 0];
  for (const r of incomes) {
    const b = weekBucket(r.occurred_at);
    weeks[b as 0 | 1 | 2 | 3] += r.amount_cents ?? 0;
  }
  const currentWeekIndex = weekBucket(today);

  const categoryLabels = t.addEntry.expense.categories;
  const expenseFallback = t.common.expense;
  const expenseLabelFor = (slug: string): string => {
    if (slug && slug in categoryLabels) {
      return categoryLabels[slug as keyof typeof categoryLabels];
    }
    return expenseFallback;
  };

  const todayEntries: ReadonlyArray<RecentEntry> = [
    ...incomes.map<RecentEntry>((r) => ({
      id: `i_${r.id}`,
      rawId: String(r.id),
      kind: "income",
      label: r.service_name ?? t.common.income,
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
      label: expenseLabelFor(r.category),
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
          labels={heroLabels}
        />

        <MonthlyStats
          incomeCents={incomeCents}
          expenseCents={expenseCents}
          taxReserveCents={taxReserveCents}
          labels={statLabels}
        />

        {taxReserveCents > 0 ? (
          <ReserveBreakdownCard
            reserve={reserve}
            yearlyReserveCents={yearlyReserveCents}
          />
        ) : null}

        <MobileQuickActions services={serviceList} canWrite={canWrite} />

        <div className="hidden lg:block">
          <QuickActions services={serviceList} canWrite={canWrite} />
        </div>

        <div className="hidden lg:block">
          {todayEntries.length > 0 ? (
            <TodayCard
              entries={todayEntries}
              incomeCents={todayIncomeCents}
              expenseCents={todayExpenseCents}
              labels={todayLabels}
            />
          ) : (
            <TodayEmpty
              incomeCents={todayIncomeCents}
              expenseCents={todayExpenseCents}
              labels={emptyLabels}
            />
          )}
        </div>

        <MobileTodayList entries={todayEntries} labels={mobileTodayLabels} />

        <div className="hidden lg:block">
          <Disclosure
            label={t.common.showMore}
            labelOpen={t.common.showLess}
          >
            <WeeklyEarnings
              weeks={weeks}
              totalCents={incomeCents}
              currentWeekIndex={currentWeekIndex}
              title={t.dashboard.weeklyTitle}
              weekLabel={t.dashboard.weeklyWeekShort}
            />
          </Disclosure>
        </div>
      </div>
    </AppScreen>
  );
}

