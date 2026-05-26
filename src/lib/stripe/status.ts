import type Stripe from "stripe";

/**
 * Centralized Stripe → Monivo subscription status mapping.
 *
 * The DB column stores any of these strings; downstream code (canWriteProfile,
 * SubscriptionBanner, PlanRow) branches on them. Keep the set small so the
 * presentation layer doesn't have to know about every Stripe enum.
 *
 * Mapping policy:
 *   trialing             → trialing       (Monivo manages trials, but Stripe
 *                                          may also report this during a
 *                                          Checkout grace period)
 *   active               → active
 *   past_due, incomplete → past_due       (still recoverable)
 *   unpaid, canceled,
 *   incomplete_expired,
 *   paused, unknown      → expired        (Stripe will not collect again
 *                                          without user action)
 */
export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "expired";

export function mapStripeStatus(
  stripeStatus: Stripe.Subscription.Status,
): SubscriptionStatus {
  switch (stripeStatus) {
    case "trialing":
      return "trialing";
    case "active":
      return "active";
    case "past_due":
    case "incomplete":
      return "past_due";
    case "unpaid":
    case "canceled":
    case "incomplete_expired":
    case "paused":
      return "expired";
    default:
      return "expired";
  }
}
