import type { SupabaseClient } from "@supabase/supabase-js";
import { yearRange } from "@/lib/format";
import {
  calculateTaxReserve,
  type ReserveBreakdown,
  type TaxProfile,
} from "@/lib/tax";

function sumAmountCents(rows: Array<{ amount_cents: number | null }> | null) {
  return (rows ?? []).reduce((acc, r) => acc + (r.amount_cents ?? 0), 0);
}

/**
 * Recommended tax reserve for the WHOLE current calendar year (Jan 1 → next
 * Jan 1). Uses the same `calculateTaxReserve` engine as the dashboard and
 * sidebar — single source of truth for reserve math. Shared by the sidebar,
 * the dashboard "accumulated reserve" line, and the monthly reminder.
 */
export async function loadYearlyReserve(
  supabase: SupabaseClient,
  userId: string,
  taxProfile: TaxProfile,
  now: Date = new Date(),
): Promise<ReserveBreakdown> {
  const { yearStart, nextYearStart } = yearRange(now);
  const [{ data: income }, { data: expenses }] = await Promise.all([
    supabase
      .from("income_entries")
      .select("amount_cents")
      .eq("user_id", userId)
      .gte("occurred_at", yearStart)
      .lt("occurred_at", nextYearStart),
    supabase
      .from("expense_entries")
      .select("amount_cents")
      .eq("user_id", userId)
      .gte("occurred_at", yearStart)
      .lt("occurred_at", nextYearStart),
  ]);
  return calculateTaxReserve(taxProfile, {
    incomeCents: sumAmountCents(income),
    expenseCents: sumAmountCents(expenses),
  });
}
