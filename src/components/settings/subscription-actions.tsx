"use client";

import { useFormStatus } from "react-dom";
import { useT } from "@/i18n/locale-provider";

/**
 * The Subscribe / Manage CTAs are plain <form action="..."> posts — Next
 * follows the 303 redirect from the API route into Stripe's hosted page,
 * with no client-side Stripe.js needed.
 *
 * `useFormStatus` lets the submit button enter a pending state as soon as
 * the form is submitted, so spam-clicks can't fire multiple Checkout
 * sessions. The button is re-enabled automatically if navigation fails.
 */

function SubmitButton({
  className,
  children,
  pendingLabel,
}: {
  className: string;
  children: React.ReactNode;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className={`${className} disabled:cursor-progress disabled:opacity-70`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

export function SubscribeButton({ compact = false }: { compact?: boolean }) {
  const t = useT();
  const cls = compact
    ? "rounded-[10px] bg-accent px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-accent-deep"
    : "rounded-[12px] bg-accent px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-accent-deep";
  return (
    <form action="/api/stripe/checkout" method="post" className="contents">
      <SubmitButton className={cls} pendingLabel={t.common.loading}>
        {t.settings.subscription.subscribeCta}
      </SubmitButton>
    </form>
  );
}

export function ManageSubscriptionButton() {
  const t = useT();
  return (
    <form action="/api/stripe/portal" method="post" className="contents">
      <SubmitButton
        className="rounded-[10px] px-2.5 py-1 text-[13px] font-medium text-accent-deep transition-colors hover:bg-accent-soft/60"
        pendingLabel={t.common.loading}
      >
        {t.settings.subscription.manageCta}
      </SubmitButton>
    </form>
  );
}
