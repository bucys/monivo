"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useT } from "@/i18n/locale-provider";

/**
 * Reads `?billing=success|canceled|error` from the URL after the user returns
 * from Stripe Checkout or Billing Portal, shows one calm toast, and strips
 * the query param so a refresh doesn't re-show it.
 */
export function BillingReturnToast() {
  const router = useRouter();
  const params = useSearchParams();
  const t = useT();
  const billing = params.get("billing");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (billing !== "success" && billing !== "canceled" && billing !== "error") {
      return;
    }
    setVisible(true);
    // Strip the query param so navigation/refresh doesn't re-surface it.
    const next = new URLSearchParams(params.toString());
    next.delete("billing");
    const qs = next.toString();
    router.replace(qs ? `/settings?${qs}` : "/settings", { scroll: false });

    const id = window.setTimeout(() => setVisible(false), 4500);
    return () => window.clearTimeout(id);
    // We intentionally only react to the initial mount value of `billing`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible || !billing) return null;

  const labels = t.settings.subscription.returnToast;
  const message =
    billing === "success"
      ? labels.success
      : billing === "canceled"
        ? labels.canceled
        : labels.error;
  const tone =
    billing === "success"
      ? "bg-accent-soft text-accent-deep"
      : billing === "error"
        ? "bg-tax-bg text-tax"
        : "bg-cream text-ink-700";

  return (
    <div
      role="status"
      className={`rounded-[14px] px-4 py-2.5 text-[13px] font-medium ${tone}`}
    >
      {message}
    </div>
  );
}
