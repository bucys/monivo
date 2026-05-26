import type { SupabaseClient } from "@supabase/supabase-js";
import { format, type Dictionary, type Locale } from "@/i18n";
import {
  bestWeekday,
  rankServices,
  WEEKDAY_LONG_EN,
  WEEKDAY_LONG_LT,
  type IncomeRow,
} from "@/lib/insights";
import { monthRange } from "@/lib/format";

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
  locale: Locale = "lt",
): Promise<AppNotification[]> {
  const now = new Date();
  const { monthStart, nextMonthStart } = monthRange();
  const fourDaysAgo = isoNDaysAgo(4);
  const week = isoWeekRange(now);
  const prevMonth = previousMonthRange(now);

  const isSunday = now.getDay() === 0;
  const isEarlyMonth = now.getDate() <= 3;

  const [
    { data: profile },
    { data: serviceRows },
    { data: monthIncomeRows },
    recentCountResult,
    lifetimeCountResult,
    weekIncomeResult,
    prevMonthIncomeResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("subscription_status, trial_ends_at")
      .eq("id", userId)
      .maybeSingle(),
    supabase.from("services").select("id, name").eq("user_id", userId),
    supabase
      .from("income_entries")
      .select(
        "amount_cents, service_id, service_name, payment_method, occurred_at",
      )
      .eq("user_id", userId)
      .gte("occurred_at", monthStart)
      .lt("occurred_at", nextMonthStart),
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
  ]);

  const monthKey = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}`;
  const incomes: IncomeRow[] = monthIncomeRows ?? [];
  const services = serviceRows ?? [];
  const recentEntries = recentCountResult.count ?? 0;
  const lifetimeEntries = lifetimeCountResult.count ?? 0;
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

  // --- best day (current month, only when there's enough data + a clear leader) ---
  if (lifetimeEntries >= 10 && incomes.length >= 5) {
    const best = bestWeekday(incomes);
    if (best && best.totalCents > 0) {
      const dayNames = locale === "en" ? WEEKDAY_LONG_EN : WEEKDAY_LONG_LT;
      const dayLabel = dayNames[best.index];
      out.push({
        id: `best_day:${monthKey}:${best.index}`,
        kind: "best_day",
        tone: "accent",
        title: labels.bestDay.title,
        body: format(labels.bestDay.body, {
          day: dayLabel ?? "",
          amount: EUR(best.totalCents),
        }),
        occurredAt: now.toISOString(),
        href: "/insights",
      });
    }
  }

  // --- top service this month ---
  const ranked = rankServices(incomes, services);
  const top = ranked[0];
  if (top && top.totalCents > 0 && incomes.length >= 3) {
    out.push({
      id: `top_service:${monthKey}:${top.key}`,
      kind: "top_service",
      tone: "success",
      title: labels.topService.title,
      body: format(labels.topService.body, {
        name: top.name,
        amount: EUR(top.totalCents),
      }),
      occurredAt: now.toISOString(),
      href: "/insights",
    });
  }

  // --- milestones ---
  if (lifetimeEntries === 1) {
    out.push({
      id: `milestone_first:${monthKey}`,
      kind: "milestone_first",
      tone: "success",
      title: labels.milestoneFirst.title,
      body: labels.milestoneFirst.body,
      occurredAt: now.toISOString(),
      href: "/activity",
    });
  }
  if (incomes.length >= 10) {
    out.push({
      id: `milestone_ten:${monthKey}`,
      kind: "milestone_ten",
      tone: "success",
      title: labels.milestoneTen.title,
      body: labels.milestoneTen.body,
      occurredAt: now.toISOString(),
      href: "/insights",
    });
  }

  return out;
}
