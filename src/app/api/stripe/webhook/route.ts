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
    const message = e instanceof Error ? e.message : "invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const result = await handleStripeEvent(supabase, event);
    return NextResponse.json({ received: true, ...result });
  } catch (e) {
    // Stripe retries non-2xx — we return 500 so failed updates aren't silently
    // dropped. Logs surface the underlying error.
    const message = e instanceof Error ? e.message : "handler failed";
    console.error("[stripe-webhook]", event.type, message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
