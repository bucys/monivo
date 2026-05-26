import { NextResponse } from "next/server";
import { safeOrigin } from "@/lib/origin";
import { createCheckoutSession } from "@/lib/stripe/sessions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const origin = safeOrigin(request.url);
  const errorRedirect = () =>
    NextResponse.redirect(`${origin}/settings?billing=error`, 303);

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) {
    console.warn("[stripe-checkout] no authenticated user");
    return NextResponse.redirect(`${origin}/login`, 303);
  }

  // Optional column — may not exist if the Stripe migration hasn't been
  // applied. Tolerate the error; Stripe will create a fresh customer and
  // the webhook will reconcile.
  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();
  if (profileErr) {
    console.warn(
      "[stripe-checkout] profile lookup failed:",
      profileErr.message,
    );
  }

  try {
    const session = await createCheckoutSession({
      userId: user.id,
      email: user.email,
      customerId:
        (profile as { stripe_customer_id?: string | null } | null)
          ?.stripe_customer_id ?? null,
      successUrl: `${origin}/settings?billing=success`,
      cancelUrl: `${origin}/settings?billing=canceled`,
    });
    if (!session.url) {
      console.warn("[stripe-checkout] session missing url");
      return errorRedirect();
    }
    return NextResponse.redirect(session.url, 303);
  } catch (e) {
    const message = e instanceof Error ? e.message : "checkout failed";
    console.error("[stripe-checkout]", message);
    return errorRedirect();
  }
}
