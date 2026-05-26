import { format, type Dictionary } from "@/i18n";
import { SubscribeButton } from "@/components/settings/subscription-actions";

export type SubscriptionBannerInput = {
  status: "trialing" | "active" | "past_due" | "canceled" | "expired" | string;
  trialEndsAt: string | null;
  canWrite: boolean;
};

type Resolved =
  | { kind: "hidden" }
  | { kind: "trial_ending"; days: number; cta: boolean }
  | { kind: "trial_ended" }
  | { kind: "past_due" }
  | { kind: "expired" };

function resolveBanner(input: SubscriptionBannerInput): Resolved {
  if (input.status === "active") return { kind: "hidden" };
  if (input.status === "past_due") return { kind: "past_due" };

  if (input.status === "canceled" || input.status === "expired") {
    return { kind: "expired" };
  }

  if (input.status === "trialing" && input.trialEndsAt) {
    const ms = Date.parse(input.trialEndsAt) - Date.now();
    if (Number.isNaN(ms)) return { kind: "hidden" };
    if (ms <= 0) return { kind: "trial_ended" };
    const days = Math.ceil(ms / 86_400_000);
    if (days <= 7) return { kind: "trial_ending", days, cta: !input.canWrite };
    return { kind: "hidden" };
  }

  if (!input.canWrite) return { kind: "expired" };
  return { kind: "hidden" };
}

/**
 * Calm, single-line banner. Renders nothing for active subscribers or users
 * with plenty of trial time left — by design, this should be invisible 99% of
 * sessions. Server component so it's part of the SSR payload.
 */
export function SubscriptionBanner({
  status,
  trialEndsAt,
  canWrite,
  t,
}: SubscriptionBannerInput & { t: Dictionary }) {
  const resolved = resolveBanner({ status, trialEndsAt, canWrite });
  if (resolved.kind === "hidden") return null;

  const labels = t.settings.subscription;
  const banner = labels.banner;

  let message: string;
  let tone: "info" | "warn";
  let showCta: boolean;

  switch (resolved.kind) {
    case "trial_ending":
      message = format(banner.trialEnding, { days: resolved.days });
      tone = "info";
      showCta = resolved.cta;
      break;
    case "trial_ended":
      message = banner.trialEnded;
      tone = "warn";
      showCta = true;
      break;
    case "past_due":
      message = banner.pastDue;
      tone = "warn";
      showCta = true;
      break;
    case "expired":
      message = banner.expired;
      tone = "warn";
      showCta = true;
      break;
  }

  const toneClass =
    tone === "warn"
      ? "bg-tax-bg text-tax"
      : "bg-accent-soft text-accent-deep";

  return (
    <div
      role="status"
      className={`flex items-center justify-between gap-3 rounded-[14px] px-4 py-2.5 text-[13px] font-medium ${toneClass}`}
    >
      <span className="min-w-0 flex-1">{message}</span>
      {showCta ? <SubscribeButton compact /> : null}
    </div>
  );
}
