"use client";

import { useState } from "react";
import { ModalSheet } from "@/components/ui/modal-sheet";
import { format } from "@/i18n";
import { useLocale, useT } from "@/i18n/locale-provider";
import { cn } from "@/lib/cn";
import { DisplayNameField, EmailField } from "./profile-form";
import { IconChevron } from "./settings-icons";
import {
  ManageSubscriptionButton,
  SubscribeButton,
} from "./subscription-actions";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "M";
  return parts
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

export type ProfileSubscriptionStatus =
  | "active"
  | "trialing"
  | "expired"
  | "past_due"
  | "canceled";

export function ProfileCard({
  displayName,
  email,
  status,
  trialEndsAt,
  currentPeriodEndsAt,
  hasStripeCustomer = false,
}: {
  displayName: string;
  email: string;
  status?: ProfileSubscriptionStatus;
  /** ISO date string from profiles.trial_ends_at, or null. */
  trialEndsAt?: string | null;
  /** ISO date string from profiles.current_period_ends_at, or null. */
  currentPeriodEndsAt?: string | null;
  /** True when a Stripe customer link exists — controls Manage vs Subscribe. */
  hasStripeCustomer?: boolean;
}) {
  const t = useT();
  const labels = t.settings.profile;
  const [expanded, setExpanded] = useState(false);
  const [nameOpen, setNameOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);

  // Resolution order for the user-visible name:
  //   1. Saved display_name if non-empty after trim.
  //   2. Email local-part (everything before the "@") if email is present.
  //   3. Em-dash placeholder.
  const trimmedName = displayName.trim();
  const emailLocal = email.includes("@") ? email.split("@")[0]!.trim() : "";
  const visibleName = trimmedName || emailLocal || "—";

  return (
    <>
      <section className="overflow-hidden rounded-[22px] bg-surface shadow-[0_1px_2px_rgba(23,33,29,0.04),_0_8px_24px_rgba(23,33,29,0.05)]">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="flex w-full items-center gap-3.5 p-[18px] text-left transition-colors hover:bg-cream/30 active:bg-cream/50"
        >
          <span
            aria-hidden
            className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-hair text-[18px] font-semibold text-accent-deep"
            style={{ background: "linear-gradient(135deg, #DDF4EC, #C9EBDF)" }}
          >
            {initials(visibleName)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[16px] font-semibold tracking-[-0.012em] text-ink-900/90">
              {visibleName}
            </span>
            <span className="mt-0.5 block truncate text-[12px] text-ink-500">
              {email}
            </span>
          </span>
          <span
            aria-hidden
            className={cn(
              "text-ink-500 transition-transform duration-200 ease-out",
              expanded ? "rotate-90" : "rotate-0",
            )}
          >
            <IconChevron />
          </span>
        </button>

        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-200 ease-out",
            expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
          aria-hidden={!expanded}
        >
          <div className="overflow-hidden">
            <div className="border-t border-hair">
              <ProfileDetailRow
                label={labels.nameRow}
                value={visibleName}
                actionLabel={labels.changeAction}
                onAction={() => setNameOpen(true)}
                actionTabIndex={expanded ? 0 : -1}
              />
              <ProfileDetailRow
                label={labels.emailRow}
                value={email}
                actionLabel={labels.changeAction}
                onAction={() => setEmailOpen(true)}
                actionTabIndex={expanded ? 0 : -1}
              />
              <PlanRow
                label={labels.planRow}
                status={status}
                trialEndsAt={trialEndsAt ?? null}
                currentPeriodEndsAt={currentPeriodEndsAt ?? null}
                hasStripeCustomer={hasStripeCustomer}
              />
            </div>
          </div>
        </div>
      </section>

      <ModalSheet
        open={nameOpen}
        onClose={() => setNameOpen(false)}
        ariaLabel={labels.editTitle}
        closeLabel={t.common.close}
      >
        <h2 className="px-1 pb-3 text-[15px] font-semibold tracking-[-0.012em] text-ink-900/90">
          {labels.editTitle}
        </h2>
        <div className="pb-2">
          <DisplayNameField
            initial={displayName}
            onDone={() => setNameOpen(false)}
          />
        </div>
      </ModalSheet>

      <ModalSheet
        open={emailOpen}
        onClose={() => setEmailOpen(false)}
        ariaLabel={labels.emailModalTitle}
        closeLabel={t.common.close}
      >
        <h2 className="px-1 pb-3 text-[15px] font-semibold tracking-[-0.012em] text-ink-900/90">
          {labels.emailModalTitle}
        </h2>
        <div className="pb-2">
          <EmailField initial={email} onDone={() => setEmailOpen(false)} />
        </div>
      </ModalSheet>
    </>
  );
}

function ProfileDetailRow({
  label,
  value,
  actionLabel,
  onAction,
  actionTabIndex,
  badge,
  rightAction,
  last,
}: {
  label: string;
  value: string;
  actionLabel?: string;
  onAction?: () => void;
  actionTabIndex?: number;
  badge?: React.ReactNode;
  rightAction?: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-5 py-3.5",
        last ? "" : "border-b border-hair",
      )}
    >
      <span className="w-[64px] shrink-0 text-[12px] font-medium uppercase tracking-[0.05em] text-ink-500 sm:w-[80px]">
        {label}
      </span>
      <span className="min-w-0 flex-1 truncate text-[14px] tracking-[-0.008em] text-ink-900/90">
        {value}
      </span>
      {badge ? badge : null}
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          tabIndex={actionTabIndex}
          className="rounded-[10px] px-2.5 py-1 text-[13px] font-medium text-accent-deep transition-colors hover:bg-accent-soft/60"
        >
          {actionLabel}
        </button>
      ) : null}
      {rightAction ?? null}
    </div>
  );
}

function PlanRow({
  label,
  status,
  trialEndsAt,
  currentPeriodEndsAt,
  hasStripeCustomer,
}: {
  label: string;
  status?: ProfileSubscriptionStatus;
  trialEndsAt: string | null;
  currentPeriodEndsAt: string | null;
  hasStripeCustomer: boolean;
}) {
  const t = useT();
  const { locale } = useLocale();
  const sub = t.settings.subscription;
  const [open, setOpen] = useState(false);

  // Resolve the *effective* state — a trialing user with a past trial date
  // should render as expired in the UI even if the server hasn't flipped
  // subscription_status yet.
  const effectiveStatus: ProfileSubscriptionStatus = (() => {
    if (status === "trialing" && trialEndsAt) {
      const ms = Date.parse(trialEndsAt) - Date.now();
      if (Number.isFinite(ms) && ms <= 0) return "expired";
    }
    return status ?? "trialing";
  })();

  const trialDays = (() => {
    if (effectiveStatus !== "trialing" || !trialEndsAt) return null;
    const ms = Date.parse(trialEndsAt) - Date.now();
    if (!Number.isFinite(ms) || ms <= 0) return 0;
    return Math.max(0, Math.ceil(ms / 86_400_000));
  })();

  const formattedPeriodEnd = (() => {
    if (!currentPeriodEndsAt) return null;
    const d = new Date(currentPeriodEndsAt);
    if (Number.isNaN(d.getTime())) return null;
    return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "lt-LT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  })();

  // Collapsed value text — just the status, no dates / no buttons.
  const collapsedValue = (() => {
    if (effectiveStatus === "trialing") return sub.statusTrialing;
    if (effectiveStatus === "active") return sub.statusActive;
    if (effectiveStatus === "past_due") return sub.statusPastDue;
    if (effectiveStatus === "canceled") return sub.statusCanceled;
    return sub.statusExpired;
  })();

  const showSubscribe =
    effectiveStatus !== "active" &&
    effectiveStatus !== "past_due" &&
    !hasStripeCustomer;
  const showManage =
    effectiveStatus === "active" ||
    effectiveStatus === "past_due" ||
    hasStripeCustomer;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-cream/30"
      >
        <span className="w-[64px] shrink-0 text-[12px] font-medium uppercase tracking-[0.05em] text-ink-500 sm:w-[80px]">
          {label}
        </span>
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-[14px] tracking-[-0.008em]",
            effectiveStatus === "expired" ||
              effectiveStatus === "canceled" ||
              effectiveStatus === "past_due"
              ? "font-medium text-expense"
              : "text-ink-900/90",
          )}
        >
          {collapsedValue}
        </span>
        <span
          aria-hidden
          className={cn(
            "shrink-0 text-ink-500 transition-transform duration-200 ease-out",
            open ? "rotate-90" : "rotate-0",
          )}
        >
          <IconChevron />
        </span>
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
        aria-hidden={!open}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-3 border-t border-hair px-5 py-4">
            {effectiveStatus === "trialing" && trialDays !== null ? (
              <p className="text-[13px] leading-[1.5] text-ink-500">
                {format(sub.trialDaysLeft, { n: trialDays })}
              </p>
            ) : null}
            {effectiveStatus === "active" && formattedPeriodEnd ? (
              <p className="text-[13px] leading-[1.5] text-ink-500">
                {format(sub.activeUntil, { date: formattedPeriodEnd })}
              </p>
            ) : null}
            {effectiveStatus === "past_due" ? (
              <p className="text-[13px] leading-[1.5] text-ink-500">
                {sub.pastDueDetail}
              </p>
            ) : null}
            {(effectiveStatus === "expired" ||
              effectiveStatus === "canceled") ? (
              <p className="text-[13px] leading-[1.5] text-ink-500">
                {sub.expiredDetail}
              </p>
            ) : null}

            <div className="flex justify-end">
              {showManage ? <ManageSubscriptionButton /> : null}
              {showSubscribe ? <SubscribeButton /> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
