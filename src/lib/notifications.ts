import type { SupabaseClient } from "@supabase/supabase-js";
import { format, type Dictionary } from "@/i18n";
import { monthRange } from "@/lib/format";
import { monthAccusativePhrase } from "@/lib/insights";
import { loadYearlyReserve } from "@/lib/reserve";
import { calculateTaxReserve, type TaxProfile } from "@/lib/tax";

export type NotificationLabels = Dictionary["notifications"]["generated"];

export type NotificationTone =
  | "accent"
  | "info"
  | "warn"
  | "success"
  | "danger";

export type NotificationKind =
  // active
  | "trial_ending"
  | "trial_ended"
  | "empty_activity"
  | "weekly_summary"
  | "monthly_review"
  | "best_day"
  | "top_service"
  | "milestone_first"
  | "milestone_ten"
  | "setup_services"
  // future — type literals reserved, generation intentionally not implemented
  // until the underlying features land:
  //   bank_income / bank_expense → require bank sync
  //   tax_warning                → requires tax-reserve thresholds + bank state
  | "tax_reminder" // legacy — no longer generated, kept for backward compat
  | "bank_income"
  | "bank_expense"
  | "tax_warning";

export type AppNotification = {
  /** Deterministic — must remain stable across renders so read-state survives */
  id: string;
  kind: NotificationKind;
  tone: NotificationTone;
  title: string;
  body: string;
  /** ISO datetime — used for relative time labels */
  occurredAt: string;
  href?: string;
};

type ProfileShape = {
  subscription_status: string | null;
  trial_ends_at: string | null;
} | null;

const EUR = (cents: number) => {
  const s = (Math.round(cents) / 100)
    .toFixed(2)
    .replace(/\.00$/, "")
    .replace(".", ",");
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toIsoDate(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function todayIso() {
  return toIsoDate(new Date());
}

function isoNDaysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return toIsoDate(d);
}

/** Monday-aligned ISO week: returns inclusive start (Mon) and exclusive end (next Mon). */
function isoWeekRange(now: Date = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  start.setHours(0, 0, 0, 0);
  const dayOfWeek = (start.getDay() + 6) % 7; // 0 = Mon, 6 = Sun
  start.setDate(start.getDate() - dayOfWeek);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return { startDate: toIsoDate(start), endDate: toIsoDate(end) };
}

/** Lightweight ISO-week stamp like 2026-W21 for stable per-week IDs. */
function isoWeekStamp(now: Date = new Date()) {
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const dayNum = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const diff = (d.getTime() - firstThursday.getTime()) / 86_400_000;
  const week = 1 + Math.floor(diff / 7);
  return `${d.getUTCFullYear()}-W${pad2(week)}`;
}

function previousMonthRange(now: Date = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 1);
  return {
    startDate: toIsoDate(start),
    endDate: toIsoDate(end),
    key: `${start.getFullYear()}-${pad2(start.getMonth() + 1)}`,
  };
}

/**
 * Fetches the small set of rows needed to generate in-app notifications and
 * returns the deterministic list. Server-only.
 *
 * No DB notifications table — every entry is derived from existing data and
 * gated by deterministic conditions so the same surface doesn't spam.
 */
export async function loadNotifications(
  supabase: SupabaseClient,
  userId: string,
  labels: NotificationLabels,
  /**
   * Optional pre-fetched profile (subscription_status + trial_ends_at). When
   * provided, this function skips its own `profiles` round-trip — callers
   * that already read these fields (e.g. the app layout) save a query per
   * navigation.
   */
  preFetchedProfile?: ProfileShape,
  /**
   * When provided (app layout passes it), enables the end-of-month tax-reserve
   * reminder. Omitted by callers that don't have the tax profile to hand.
   */
  reserveCtx?: { taxProfile: TaxProfile; locale: "lt" | "en" },
): Promise<AppNotification[]> {
  const now = new Date();
  const fourDaysAgo = isoNDaysAgo(4);
  const week = isoWeekRange(now);
  const prevMonth = previousMonthRange(now);
  const thisMonth = monthRange(now);

  const isSunday = now.getDay() === 0;
  const isEarlyMonth = now.getDate() <= 3;
  // Last day of the month: tomorrow rolls into a different month.
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isLastDayOfMonth = tomorrow.getMonth() !== now.getMonth();
  const wantReserveReminder = isLastDayOfMonth && reserveCtx !== undefined;

  const profilePromise = preFetchedProfile !== undefined
    ? Promise.resolve({ data: preFetchedProfile })
    : supabase
        .from("profiles")
        .select("subscription_status, trial_ends_at")
        .eq("id", userId)
        .maybeSingle();

  const emptyRows = Promise.resolve({
    data: [] as Array<{ amount_cents: number }>,
  });

  const [
    { data: profile },
    recentCountResult,
    lifetimeCountResult,
    weekIncomeResult,
    prevMonthIncomeResult,
    servicesCountResult,
    monthIncomeResult,
    monthExpenseResult,
    yearReserve,
  ] = await Promise.all([
    profilePromise,
    supabase
      .from("income_entries")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("occurred_at", fourDaysAgo),
    supabase
      .from("income_entries")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    // Weekly summary is only ever shown on Sundays; skip the round-trip the
    // rest of the week.
    isSunday
      ? supabase
          .from("income_entries")
          .select("amount_cents")
          .eq("user_id", userId)
          .gte("occurred_at", week.startDate)
          .lt("occurred_at", week.endDate)
      : Promise.resolve({ data: [] as Array<{ amount_cents: number }> }),
    // Monthly review is only ever shown in the first 3 days of a month.
    isEarlyMonth
      ? supabase
          .from("income_entries")
          .select("amount_cents")
          .eq("user_id", userId)
          .gte("occurred_at", prevMonth.startDate)
          .lt("occurred_at", prevMonth.endDate)
      : Promise.resolve({ data: [] as Array<{ amount_cents: number }> }),
    supabase
      .from("services")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    // Reserve reminder: only fetched on the last day of the month.
    wantReserveReminder
      ? supabase
          .from("income_entries")
          .select("amount_cents")
          .eq("user_id", userId)
          .gte("occurred_at", thisMonth.monthStart)
          .lt("occurred_at", thisMonth.nextMonthStart)
      : emptyRows,
    wantReserveReminder
      ? supabase
          .from("expense_entries")
          .select("amount_cents")
          .eq("user_id", userId)
          .gte("occurred_at", thisMonth.monthStart)
          .lt("occurred_at", thisMonth.nextMonthStart)
      : emptyRows,
    wantReserveReminder
      ? loadYearlyReserve(supabase, userId, reserveCtx.taxProfile, now)
      : Promise.resolve(null),
  ]);

  const recentEntries = recentCountResult.count ?? 0;
  const lifetimeEntries = lifetimeCountResult.count ?? 0;
  const servicesCount = servicesCountResult.count ?? 0;
  const weekIncomeRows = (weekIncomeResult.data ?? []) as Array<{
    amount_cents: number;
  }>;
  const prevMonthRows = (prevMonthIncomeResult.data ?? []) as Array<{
    amount_cents: number;
  }>;
  const out: AppNotification[] = [];

  // --- trial ---
  const status = (profile as ProfileShape)?.subscription_status;
  const trialEndsAt = (profile as ProfileShape)?.trial_ends_at ?? null;
  if (status === "trialing" && trialEndsAt) {
    const msLeft = Date.parse(trialEndsAt) - Date.now();
    const daysLeft = Math.ceil(msLeft / 86_400_000);
    if (msLeft <= 0) {
      out.push({
        id: `trial_ended:${trialEndsAt.slice(0, 10)}`,
        kind: "trial_ended",
        tone: "danger",
        title: labels.trialEnded.title,
        body: labels.trialEnded.body,
        occurredAt: trialEndsAt,
        href: "/settings",
      });
    } else if (daysLeft <= 3) {
      out.push({
        id: `trial_ending:${trialEndsAt.slice(0, 10)}`,
        kind: "trial_ending",
        tone: "warn",
        title: labels.trialEnding.title,
        body: format(labels.trialEnding.body, { days: daysLeft }),
        occurredAt: now.toISOString(),
        href: "/settings",
      });
    }
  }

  // --- monthly tax-reserve reminder (last day of month; needs activity) ---
  if (wantReserveReminder && reserveCtx && yearReserve) {
    const monthIncome = (monthIncomeResult.data ?? []) as Array<{
      amount_cents: number;
    }>;
    const monthExpense = (monthExpenseResult.data ?? []) as Array<{
      amount_cents: number;
    }>;
    // Only nudge users who actually recorded something this month.
    if (monthIncome.length + monthExpense.length > 0) {
      const monthIncomeCents = monthIncome.reduce(
        (a, r) => a + (r.amount_cents ?? 0),
        0,
      );
      const monthExpenseCents = monthExpense.reduce(
        (a, r) => a + (r.amount_cents ?? 0),
        0,
      );
      const monthReserve = calculateTaxReserve(reserveCtx.taxProfile, {
        incomeCents: monthIncomeCents,
        expenseCents: monthExpenseCents,
      });
      const monthCents = Math.round(monthReserve.totalCents / 100) * 100;
      const yearCents = Math.round(yearReserve.totalCents / 100) * 100;
      const phrase = monthAccusativePhrase(now, reserveCtx.locale);
      const monthName =
        reserveCtx.locale === "lt"
          ? phrase.charAt(0).toUpperCase() + phrase.slice(1)
          : phrase;
      out.push({
        id: `tax_reminder:${now.getFullYear()}-${pad2(now.getMonth() + 1)}`,
        kind: "tax_reminder",
        tone: "accent",
        title: labels.taxReminder.title,
        body: format(labels.taxReminder.body, {
          month: monthName,
          amount: EUR(monthCents),
          yearAmount: EUR(yearCents),
        }),
        occurredAt: now.toISOString(),
        href: "/dashboard",
      });
    }
  }

  // --- setup: no services yet (welcome / quick-record onboarding hint) ---
  // The notification self-clears as soon as the user adds a service — the
  // generator simply stops emitting it. Stable ID so the read state survives.
  if (servicesCount === 0) {
    out.push({
      id: "setup_services:welcome",
      kind: "setup_services",
      tone: "accent",
      title: labels.setupServices.title,
      body: labels.setupServices.body,
      occurredAt: now.toISOString(),
      href: "/services",
    });
  }

  // --- inactivity (gentle reminder; no entries in the last 4 days) ---
  if (recentEntries === 0 && lifetimeEntries > 0) {
    out.push({
      id: `empty_activity:${todayIso()}`,
      kind: "empty_activity",
      tone: "info",
      title: labels.emptyActivity.title,
      body: labels.emptyActivity.body,
      occurredAt: now.toISOString(),
      href: "/activity",
    });
  }

  // --- weekly summary (Sunday only) ---
  if (isSunday && weekIncomeRows.length > 0) {
    const weekCents = weekIncomeRows.reduce(
      (a, r) => a + (r.amount_cents ?? 0),
      0,
    );
    out.push({
      id: `weekly_summary:${isoWeekStamp(now)}`,
      kind: "weekly_summary",
      tone: "info",
      title: labels.weeklySummary.title,
      body: format(labels.weeklySummary.body, {
        amount: EUR(weekCents),
        count: weekIncomeRows.length,
      }),
      occurredAt: now.toISOString(),
      href: "/insights",
    });
  }

  // --- monthly review (first 3 days of a month, looks back at previous) ---
  if (isEarlyMonth && prevMonthRows.length > 0) {
    const prevCents = prevMonthRows.reduce(
      (a, r) => a + (r.amount_cents ?? 0),
      0,
    );
    out.push({
      id: `monthly_review:${prevMonth.key}`,
      kind: "monthly_review",
      tone: "info",
      title: labels.monthlyReview.title,
      body: format(labels.monthlyReview.body, {
        amount: EUR(prevCents),
        count: prevMonthRows.length,
      }),
      occurredAt: now.toISOString(),
      href: "/insights",
    });
  }

  return out;
}
