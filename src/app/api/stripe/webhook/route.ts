import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, getStripeWebhookSecret } from "@/lib/stripe/client";
import { handleStripeEvent } from "@/lib/stripe/webhook-handlers";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
// We need the raw body for Stripe signature verification — disable any
// implicit body parsing.
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    console.warn("[stripe-webhook] missing signature header");
    return NextResponse.json({ error: "missing signature" }, { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      payload,
      signature,
      getStripeWebhookSecret(),
    );
  } catch (e) {
    // Bad signature is the most common operator misconfiguration — log only
    // the message, never the raw payload (signed bytes may include PII).
    const message = e instanceof Error ? e.message : "invalid signature";
    console.warn("[stripe-webhook] signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const result = await handleStripeEvent(supabase, event);
    if (!result.handled) {
      console.warn(
        `[stripe-webhook] ignored event ${event.id} (${event.type})`,
      );
    }
    return NextResponse.json({ received: true, eventId: event.id, ...result });
  } catch (e) {
    // Stripe retries non-2xx — we return 500 so failed updates aren't silently
    // dropped. Log the event id alongside the type so we can correlate with
    // Stripe's dashboard retries.
    const message = e instanceof Error ? e.message : "handler failed";
    console.error(
      `[stripe-webhook] handler failed for ${event.id} (${event.type}):`,
      message,
    );
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
