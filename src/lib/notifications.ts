import type { SupabaseClient } from "@supabase/supabase-js";
import { format, type Dictionary } from "@/i18n";
import { rankServices, type IncomeRow } from "@/lib/insights";
import { monthRange } from "@/lib/format";

export type NotificationLabels = Dictionary["notifications"]["generated"];

export type NotificationTone =
  | "accent"
  | "info"
  | "warn"
  | "success"
  | "danger";

export type NotificationKind =
  | "trial_ending"
  | "trial_ended"
  | "empty_activity"
  | "tax_reminder"
  | "top_service"
  | "milestone_first"
  | "milestone_ten";

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
  tax_rate: number | string | null;
} | null;

const EUR = (cents: number) => {
  const s = (Math.round(cents) / 100)
    .toFixed(2)
    .replace(/\.00$/, "")
    .replace(".", ",");
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

function todayIso() {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

function isoNDaysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

/**
 * Fetches the small set of rows needed to generate in-app notifications and
 * returns the deterministic list. Server-only.
 *
 * No DB notifications table — every entry is derived from existing data.
 */
export async function loadNotifications(
  supabase: SupabaseClient,
  userId: string,
  labels: NotificationLabels,
): Promise<AppNotification[]> {
  const { monthStart, nextMonthStart } = monthRange();
  const sevenDaysAgo = isoNDaysAgo(7);

  const [
    { data: profile },
    { data: serviceRows },
    { data: incomeRows },
    recentCountResult,
    lifetimeCountResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("subscription_status, trial_ends_at, tax_rate")
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
      .gte("occurred_at", sevenDaysAgo),
    supabase
      .from("income_entries")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
  ]);

  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const incomes: IncomeRow[] = incomeRows ?? [];
  const services = serviceRows ?? [];
  const recentEntries = recentCountResult.count ?? 0;
  const lifetimeEntries = lifetimeCountResult.count ?? 0;
  const incomeCents = incomes.reduce((a, r) => a + (r.amount_cents ?? 0), 0);
  const monthCount = incomes.length;
  const taxRate = Number((profile as ProfileShape)?.tax_rate ?? 0);
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
        occurredAt: new Date().toISOString(),
        href: "/settings",
      });
    }
  }

  // --- empty activity (no entries last 7 days) ---
  if (recentEntries === 0 && lifetimeEntries > 0) {
    out.push({
      id: `empty_activity:${todayIso()}`,
      kind: "empty_activity",
      tone: "info",
      title: labels.emptyActivity.title,
      body: labels.emptyActivity.body,
      occurredAt: new Date().toISOString(),
      href: "/activity",
    });
  }

  // --- tax reminder (this month) ---
  if (taxRate > 0 && incomeCents > 0) {
    const reserveCents = Math.round(incomeCents * taxRate);
    out.push({
      id: `tax_reminder:${monthKey}`,
      kind: "tax_reminder",
      tone: "accent",
      title: labels.taxReminder.title,
      body: format(labels.taxReminder.body, { amount: EUR(reserveCents) }),
      occurredAt: new Date().toISOString(),
      href: "/insights",
    });
  }

  // --- top service this month ---
  const ranked = rankServices(incomes, services);
  const top = ranked[0];
  if (top && top.totalCents > 0) {
    out.push({
      id: `top_service:${monthKey}:${top.key}`,
      kind: "top_service",
      tone: "success",
      title: labels.topService.title,
      body: format(labels.topService.body, {
        name: top.name,
        amount: EUR(top.totalCents),
      }),
      occurredAt: new Date().toISOString(),
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
      occurredAt: new Date().toISOString(),
      href: "/activity",
    });
  }
  if (monthCount >= 10) {
    out.push({
      id: `milestone_ten:${monthKey}`,
      kind: "milestone_ten",
      tone: "success",
      title: labels.milestoneTen.title,
      body: labels.milestoneTen.body,
      occurredAt: new Date().toISOString(),
      href: "/insights",
    });
  }

  return out;
}
