import type Stripe from "stripe";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Stripe → Monivo subscription_status mapping.
 *
 * Monivo's minimal status set is:
 *   trialing | active | past_due | canceled | expired
 *
 * Stripe statuses we don't map ("incomplete", "incomplete_expired", "unpaid",
 * "paused") all collapse to "past_due" or "canceled" depending on whether the
 * customer might still recover.
 */
function mapSubscriptionStatus(
  stripeStatus: Stripe.Subscription.Status,
): "trialing" | "active" | "past_due" | "canceled" | "expired" {
  switch (stripeStatus) {
    case "trialing":
      return "trialing";
    case "active":
      return "active";
    case "past_due":
    case "incomplete":
    case "unpaid":
      return "past_due";
    case "canceled":
    case "incomplete_expired":
      return "canceled";
    case "paused":
      return "expired";
    default:
      return "expired";
  }
}

function isoFromUnix(unix: number | null | undefined): string | null {
  if (!unix) return null;
  return new Date(unix * 1000).toISOString();
}

/**
 * Apply a subscription state change to the matching profile row.
 *
 * Lookup priority:
 *   1. metadata.user_id on the subscription (we set this on checkout)
 *   2. profiles.stripe_customer_id = subscription.customer
 *
 * Updates are idempotent — Stripe may re-deliver the same event; we always
 * write the derived state, never increment counters or branch on prior state.
 */
async function applySubscriptionState(
  supabase: SupabaseClient,
  subscription: Stripe.Subscription,
): Promise<void> {
  const status = mapSubscriptionStatus(subscription.status);
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;
  const userIdFromMeta = subscription.metadata?.user_id ?? null;

  const patch = {
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    subscription_status: status,
    current_period_ends_at: isoFromUnix(subscription.current_period_end),
    // Clear the past_due marker whenever the subscription is healthy.
    past_due_since: status === "past_due" ? new Date().toISOString() : null,
  } as const;

  if (userIdFromMeta) {
    const { error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", userIdFromMeta);
    if (error) throw new Error(`profile update by user_id failed: ${error.message}`);
    return;
  }

  const { error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("stripe_customer_id", customerId);
  if (error) {
    throw new Error(`profile update by customer_id failed: ${error.message}`);
  }
}

/**
 * Main webhook dispatcher. Caller is responsible for signature verification.
 * Returns the kind of update applied (for logging only).
 */
export async function handleStripeEvent(
  supabase: SupabaseClient,
  event: Stripe.Event,
): Promise<{ handled: boolean; kind: string }> {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id ?? session.metadata?.user_id;
      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id ?? null;
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id ?? null;

      if (userId && customerId) {
        // Persist the customer link immediately so the user can hit
        // "Manage subscription" even before the subscription event arrives.
        const { error } = await supabase
          .from("profiles")
          .update({
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            subscription_status: "active",
          })
          .eq("id", userId);
        if (error) {
          throw new Error(`checkout link failed: ${error.message}`);
        }
      }
      return { handled: true, kind: event.type };
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await applySubscriptionState(supabase, subscription);
      return { handled: true, kind: event.type };
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId =
        typeof invoice.customer === "string"
          ? invoice.customer
          : invoice.customer?.id ?? null;
      if (customerId) {
        const { error } = await supabase
          .from("profiles")
          .update({
            subscription_status: "past_due",
            past_due_since: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);
        if (error) {
          throw new Error(`payment_failed update failed: ${error.message}`);
        }
      }
      return { handled: true, kind: event.type };
    }
    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId =
        typeof invoice.customer === "string"
          ? invoice.customer
          : invoice.customer?.id ?? null;
      if (customerId) {
        const { error } = await supabase
          .from("profiles")
          .update({
            subscription_status: "active",
            past_due_since: null,
          })
          .eq("stripe_customer_id", customerId);
        if (error) {
          throw new Error(`payment_succeeded update failed: ${error.message}`);
        }
      }
      return { handled: true, kind: event.type };
    }
    default:
      return { handled: false, kind: event.type };
  }
}
