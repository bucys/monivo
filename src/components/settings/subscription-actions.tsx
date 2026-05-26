"use client";

import { useT } from "@/i18n/locale-provider";

/**
 * Simple <form action> CTAs that POST to our API routes — those routes do the
 * Stripe call server-side and respond with a 303 redirect to Stripe's hosted
 * Checkout or Billing Portal. Using a form keeps things accessible without
 * any client-side Stripe.js.
 */
export function SubscribeButton({ compact = false }: { compact?: boolean }) {
  const t = useT();
  return (
    <form action="/api/stripe/checkout" method="post" className="contents">
      <button
        type="submit"
        className={
          compact
            ? "rounded-[10px] bg-accent px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-accent-deep"
            : "rounded-[12px] bg-accent px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-accent-deep"
        }
      >
        {t.settings.subscription.subscribeCta}
      </button>
    </form>
  );
}

export function ManageSubscriptionButton() {
  const t = useT();
  return (
    <form action="/api/stripe/portal" method="post" className="contents">
      <button
        type="submit"
        className="rounded-[10px] px-2.5 py-1 text-[13px] font-medium text-accent-deep transition-colors hover:bg-accent-soft/60"
      >
        {t.settings.subscription.manageCta}
      </button>
    </form>
  );
}
