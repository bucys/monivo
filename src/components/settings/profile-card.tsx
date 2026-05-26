"use client";

import { useState } from "react";
import { ModalSheet } from "@/components/ui/modal-sheet";
import { useT } from "@/i18n/locale-provider";
import { cn } from "@/lib/cn";
import { DisplayNameField, EmailField } from "./profile-form";
import { IconChevron } from "./settings-icons";

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
  trialNote,
  statusLabel,
}: {
  displayName: string;
  email: string;
  /** Reserved for future billing/cancel UI — keep typed at the boundary so
   *  callers don't have to refactor when we wire up Stripe. */
  status?: ProfileSubscriptionStatus;
  trialNote?: string;
  statusLabel: string;
}) {
  const t = useT();
  const labels = t.settings.profile;
  const [expanded, setExpanded] = useState(false);
  const [nameOpen, setNameOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);

  const visibleName = displayName.trim() || "—";
  const planDetail = trialNote ?? statusLabel;

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
            {initials(displayName)}
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
              <ProfileDetailRow
                label={labels.planRow}
                value={planDetail}
                badge={
                  <span className="inline-flex items-center rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-semibold text-accent-deep">
                    {statusLabel}
                  </span>
                }
                last
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
  last,
}: {
  label: string;
  value: string;
  actionLabel?: string;
  onAction?: () => void;
  actionTabIndex?: number;
  badge?: React.ReactNode;
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
    </div>
  );
}
