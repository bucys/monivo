import { redirect } from "next/navigation";
import { AppScreen } from "@/components/app/app-screen";
import { EmptyPrompt } from "@/components/dashboard/empty-prompt";
import { QuickActions } from "@/components/dashboard/quick-actions";
import {
  RecentActivity,
  expenseLabel,
  type RecentEntry,
} from "@/components/dashboard/recent-activity";
import { SpendableHero } from "@/components/dashboard/spendable-card";
import { formatEur, monthRange } from "@/lib/format";
import { canWriteProfile } from "@/lib/profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function todayIso() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { monthStart, nextMonthStart, label } = monthRange();
  const today = todayIso();

  const [{ data: profile }, { data: incomeRows }, { data: expenseRows }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select(
          "display_name, tax_rate, subscription_status, trial_ends_at, past_due_since",
        )
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("income_entries")
        .select("id, amount_cents, service_name, occurred_at, created_at")
        .eq("user_id", user.id)
        .gte("occurred_at", monthStart)
        .lt("occurred_at", nextMonthStart),
      supabase
        .from("expense_entries")
        .select("id, amount_cents, category, occurred_at, created_at")
        .eq("user_id", user.id)
        .gte("occurred_at", monthStart)
        .lt("occurred_at", nextMonthStart),
    ]);

  const incomes = incomeRows ?? [];
  const expenses = expenseRows ?? [];
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

  const hasAnyEntries = incomes.length + expenses.length > 0;
  const taxPercent = Math.round(taxRate * 100);

  const allEntries: ReadonlyArray<RecentEntry> = [
    ...incomes.map<RecentEntry>((r) => ({
      id: `i_${r.id}`,
      kind: "income",
      label: r.service_name ?? "Pajamos",
      amountCents: r.amount_cents,
      occurredAt: r.occurred_at,
      sortKey: r.created_at,
    })),
    ...expenses.map<RecentEntry>((r) => ({
      id: `e_${r.id}`,
      kind: "expense",
      label: expenseLabel(r.category),
      amountCents: r.amount_cents,
      occurredAt: r.occurred_at,
      sortKey: r.created_at,
    })),
  ].sort((a, b) => (a.sortKey < b.sortKey ? 1 : -1));

  const todayEntries = allEntries.filter((e) => e.occurredAt === today);

  return (
    <AppScreen>
      <header className="mb-7 lg:mb-10">
        <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-ink-500">
          {label}
        </p>
        <h1 className="mt-2 text-[28px] font-semibold tracking-[-0.025em] text-ink-900/90 lg:text-[34px]">
          {greeting}
        </h1>
      </header>

      <div className="flex flex-col gap-7 lg:gap-9">
        <SpendableHero
          spendableCents={spendableCents}
          incomeCents={incomeCents}
          expenseCents={expenseCents}
          taxReserveCents={taxReserveCents}
        />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-7">
          <EarningsCard
            incomeCents={incomeCents}
            taxReserveCents={taxReserveCents}
            taxPercent={taxPercent}
            entryCount={incomes.length}
            empty={!hasAnyEntries}
          />
          <div className="hidden lg:block">
            <QuickActions canWrite={canWrite} />
          </div>
        </div>

        <section aria-label="Šios dienos įrašai" className="flex flex-col">
          <h2 className="px-1 pb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-500">
            Šios dienos įrašai
          </h2>
          {todayEntries.length > 0 ? (
            <RecentActivity entries={todayEntries} />
          ) : hasAnyEntries ? (
            <p className="rounded-[20px] border border-hair bg-white/70 px-5 py-7 text-center text-[13px] text-ink-500">
              Šiandien dar nieko.
            </p>
          ) : (
            <EmptyPrompt canWrite={canWrite} />
          )}
        </section>
      </div>
    </AppScreen>
  );
}

function EarningsCard({
  incomeCents,
  taxReserveCents,
  taxPercent,
  entryCount,
  empty,
}: {
  incomeCents: number;
  taxReserveCents: number;
  taxPercent: number;
  entryCount: number;
  empty: boolean;
}) {
  return (
    <section
      aria-label="Uždarbis šį mėnesį"
      className="flex h-full flex-col rounded-[24px] border border-hair bg-white p-6 lg:p-7"
    >
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-500">
        Uždarbis šį mėnesį
      </h2>
      <div className="mt-3 text-[36px] font-semibold leading-[1] tracking-[-0.028em] tabular-nums text-ink-900/90 lg:text-[40px]">
        {empty ? "—" : formatEur(incomeCents)}
      </div>
      <p className="mt-2 text-[12px] text-ink-500">
        {empty
          ? "Dar nepridėjai pajamų."
          : `${entryCount} ${entryCount === 1 ? "įrašas" : entryCount < 10 ? "įrašai" : "įrašų"}`}
      </p>
      {!empty ? (
        <div className="mt-auto border-t border-hair pt-4">
          <div className="flex items-baseline justify-between gap-3 text-[12px] text-ink-500">
            <span>Atidėta mokesčiams ({taxPercent}%)</span>
            <span className="text-[14px] font-semibold tabular-nums text-ink-900/90">
              {formatEur(taxReserveCents)}
            </span>
          </div>
        </div>
      ) : null}
    </section>
  );
}
