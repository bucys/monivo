import type Stripe from "stripe";
import { getStripe, getStripePriceId } from "./client";

/**
 * Create a Stripe Checkout session for the monthly subscription.
 *
 * Trial behavior: the 30-day free trial is managed by Monivo in `profiles.trial_ends_at`,
 * NOT via Stripe `trial_period_days`. Users only enter Stripe Checkout when they
 * choose to subscribe — that's why we never collect a card during the trial.
 *
 * Customer linking: when a `customerId` is provided we reuse it so Stripe doesn't
 * spin up a duplicate customer record. Otherwise we let Checkout create one and
 * persist the resulting ID via the webhook (`checkout.session.completed`).
 */
export async function createCheckoutSession(opts: {
  userId: string;
  email: string;
  customerId: string | null;
  successUrl: string;
  cancelUrl: string;
}): Promise<Stripe.Checkout.Session> {
  const stripe = getStripe();
  const priceId = getStripePriceId();

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: opts.successUrl,
    cancel_url: opts.cancelUrl,
    allow_promotion_codes: false,
    // We use this to link the eventual subscription back to our profiles row
    // when the webhook fires.
    client_reference_id: opts.userId,
    subscription_data: {
      metadata: { user_id: opts.userId },
    },
    metadata: { user_id: opts.userId },
  };

  if (opts.customerId) {
    sessionParams.customer = opts.customerId;
  } else {
    sessionParams.customer_email = opts.email;
    // Persist the email on the new customer so the billing portal shows it.
    sessionParams.customer_creation = "always";
  }

  return stripe.checkout.sessions.create(sessionParams);
}

/**
 * Create a Stripe Billing Portal session — the user manages their card,
 * invoices, and cancellation through Stripe's hosted UI.
 */
export async function createBillingPortalSession(opts: {
  customerId: string;
  returnUrl: string;
}): Promise<Stripe.BillingPortal.Session> {
  const stripe = getStripe();
  return stripe.billingPortal.sessions.create({
    customer: opts.customerId,
    return_url: opts.returnUrl,
  });
}
