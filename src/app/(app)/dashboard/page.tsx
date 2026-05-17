import { redirect } from "next/navigation";
import { AppScreen } from "@/components/app/app-screen";
import { EmptyPrompt } from "@/components/dashboard/empty-prompt";
import {
  RecentActivity,
  expenseLabel,
  type RecentEntry,
} from "@/components/dashboard/recent-activity";
import { SpendableCard } from "@/components/dashboard/spendable-card";
import { StatTile } from "@/components/dashboard/stat-tile";
import { monthRange } from "@/lib/format";
import { canWriteProfile } from "@/lib/profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { monthStart, nextMonthStart, label } = monthRange();

  const [{ data: profile }, { data: incomeRows }, { data: expenseRows }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("tax_rate, subscription_status, trial_ends_at, past_due_since")
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

  const incomeCents = incomes.reduce((acc, r) => acc + (r.amount_cents ?? 0), 0);
  const expenseCents = expenses.reduce(
    (acc, r) => acc + (r.amount_cents ?? 0),
    0,
  );
  const taxReserveCents = Math.round(incomeCents * taxRate);
  const spendableCents = incomeCents - expenseCents - taxReserveCents;

  const hasAnyEntries = incomes.length + expenses.length > 0;

  const recent: ReadonlyArray<RecentEntry> = [
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
  ]
    .sort((a, b) => (a.sortKey < b.sortKey ? 1 : -1))
    .slice(0, 5);

  const taxPercentLabel = `${Math.round(taxRate * 100)}% mokesčių`;

  return (
    <AppScreen>
      <div className="mb-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-500">
        {label}
      </div>

      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:gap-6">
        <div className="flex flex-col gap-4 lg:col-span-2 lg:gap-6">
          <SpendableCard
            spendableCents={spendableCents}
            incomeCents={incomeCents}
            expenseCents={expenseCents}
            taxReserveCents={taxReserveCents}
          />

          <div className="grid grid-cols-3 gap-2 lg:hidden">
            <StatTile
              label="Pajamos"
              cents={hasAnyEntries ? incomeCents : null}
              tone="income"
            />
            <StatTile
              label="Išlaidos"
              cents={hasAnyEntries ? expenseCents : null}
              tone="expense"
            />
            <StatTile
              label="Atidėta"
              cents={hasAnyEntries ? taxReserveCents : null}
              tone="tax"
            />
          </div>

          {hasAnyEntries ? (
            <RecentActivity entries={recent} />
          ) : (
            <EmptyPrompt canWrite={canWrite} />
          )}
        </div>

        <aside className="hidden flex-col gap-4 lg:flex">
          <StatTile
            label="Pajamos"
            cents={hasAnyEntries ? incomeCents : null}
            tone="income"
          />
          <StatTile
            label="Išlaidos"
            cents={hasAnyEntries ? expenseCents : null}
            tone="expense"
          />
          <StatTile
            label="Atidėta"
            cents={hasAnyEntries ? taxReserveCents : null}
            tone="tax"
            caption={taxPercentLabel}
          />
        </aside>
      </div>
    </AppScreen>
  );
}
