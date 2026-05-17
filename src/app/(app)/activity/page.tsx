import { redirect } from "next/navigation";
import { AppScreen } from "@/components/app/app-screen";
import { ActivityFeed } from "@/components/activity/activity-feed";
import {
  expenseLabel,
  type PaymentMethod,
  type RecentEntry,
} from "@/components/dashboard/recent-activity";
import { monthRange } from "@/lib/format";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ActivityPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { monthStart, nextMonthStart } = monthRange();

  const [{ data: incomeRows }, { data: expenseRows }] = await Promise.all([
    supabase
      .from("income_entries")
      .select(
        "id, amount_cents, service_name, payment_method, note, occurred_at, created_at",
      )
      .eq("user_id", user.id)
      .gte("occurred_at", monthStart)
      .lt("occurred_at", nextMonthStart)
      .order("occurred_at", { ascending: false })
      .order("created_at", { ascending: false })
      .order("id", { ascending: false }),
    supabase
      .from("expense_entries")
      .select("id, amount_cents, category, note, occurred_at, created_at")
      .eq("user_id", user.id)
      .gte("occurred_at", monthStart)
      .lt("occurred_at", nextMonthStart)
      .order("occurred_at", { ascending: false })
      .order("created_at", { ascending: false })
      .order("id", { ascending: false }),
  ]);

  const incomes = incomeRows ?? [];
  const expenses = expenseRows ?? [];

  const entries: RecentEntry[] = [
    ...incomes.map<RecentEntry>((r) => ({
      id: `i_${r.id}`,
      kind: "income",
      label: r.service_name ?? "Pajamos",
      amountCents: r.amount_cents,
      occurredAt: r.occurred_at,
      createdAt: r.created_at,
      sortKey: `${r.occurred_at}|${r.created_at}|${r.id}`,
      paymentMethod: (r.payment_method ?? null) as PaymentMethod | null,
      note: r.note,
    })),
    ...expenses.map<RecentEntry>((r) => ({
      id: `e_${r.id}`,
      kind: "expense",
      label: expenseLabel(r.category),
      amountCents: r.amount_cents,
      occurredAt: r.occurred_at,
      createdAt: r.created_at,
      sortKey: `${r.occurred_at}|${r.created_at}|${r.id}`,
      note: r.note,
    })),
  ].sort((a, b) =>
    a.sortKey < b.sortKey ? 1 : a.sortKey > b.sortKey ? -1 : 0,
  );

  return (
    <AppScreen>
      <ActivityFeed entries={entries} />
    </AppScreen>
  );
}
