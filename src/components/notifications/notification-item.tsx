"use client";

import Link from "next/link";
import type { AppNotification, NotificationTone } from "@/lib/notifications";

const TONE_BG: Record<NotificationTone, string> = {
  accent: "bg-accent-soft text-accent-deep",
  info: "bg-[#DDE9F4] text-[#3A5E8E]",
  warn: "bg-tax-bg text-tax",
  success: "bg-income-bg text-income",
  danger: "bg-expense-bg text-expense",
};

function ToneIcon({ tone }: { tone: NotificationTone }) {
  // Use small glyph differentiated by tone but keep the icon language simple.
  if (tone === "danger" || tone === "warn") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
        <path d="M10.3 3.7l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.3l-8-14a2 2 0 0 0-3.4 0z" />
      </svg>
    );
  }
  if (tone === "success") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M5 12l5 5 9-11" />
      </svg>
    );
  }
  if (tone === "info") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8h.01" />
        <path d="M11 12h1v4h1" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6L12 2z" />
    </svg>
  );
}

function relativeTime(iso: string) {
  const ms = Date.now() - Date.parse(iso);
  if (Number.isNaN(ms)) return "";
  const mins = Math.round(ms / 60_000);
  if (mins < 1) return "ką tik";
  if (mins < 60) return `prieš ${mins} min.`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `prieš ${hours} val.`;
  const days = Math.round(hours / 24);
  if (days === 1) return "vakar";
  if (days < 7) return `prieš ${days} d.`;
  return new Date(iso).toLocaleDateString("lt-LT", {
    day: "numeric",
    month: "short",
  });
}

export function NotificationItem({
  notification,
  unread,
  onActivate,
}: {
  notification: AppNotification;
  unread: boolean;
  onActivate: () => void;
}) {
  const inner = (
    <div className="flex items-start gap-3">
      <span
        aria-hidden
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] ${TONE_BG[notification.tone]}`}
      >
        <ToneIcon tone={notification.tone} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-[14px] font-semibold tracking-[-0.012em] text-ink-900/90">
            {notification.title}
          </span>
          {unread ? (
            <span
              aria-label="Neperskaityta"
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
            />
          ) : null}
        </div>
        <p className="mt-0.5 text-[13px] leading-[1.45] text-ink-500">
          {notification.body}
        </p>
        <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.04em] text-ink-500">
          {relativeTime(notification.occurredAt)}
        </div>
      </div>
    </div>
  );

  const cls =
    "block w-full rounded-[14px] px-3.5 py-3 text-left transition-colors hover:bg-cream/60";
  if (notification.href) {
    return (
      <Link href={notification.href} className={cls} onClick={onActivate}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} onClick={onActivate}>
      {inner}
    </button>
  );
}
