import Stripe from "stripe";

let cached: Stripe | null = null;

/**
 * Lazy Stripe client. Throws at call time if the secret key is missing so
 * dev environments without billing wired up can still build/run for free-tier
 * paths (everything that doesn't actually call into Stripe).
 */
export function getStripe(): Stripe {
  if (cached) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Configure Stripe to enable billing.",
    );
  }
  cached = new Stripe(key, {
    // Pin a known API version. Bump deliberately when the SDK is upgraded.
    apiVersion: "2025-01-27.acacia" as Stripe.LatestApiVersion,
    typescript: true,
  });
  return cached;
}

export function getStripePriceId(): string {
  const id = process.env.STRIPE_PRICE_ID;
  if (!id) {
    throw new Error("STRIPE_PRICE_ID is not set.");
  }
  return id;
}

export function getStripeWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not set.");
  }
  return secret;
}
