import { NextResponse } from "next/server";
import { safeOrigin } from "@/lib/origin";
import { createBillingPortalSession } from "@/lib/stripe/sessions";
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
  if (!user) {
    console.warn("[stripe-portal] no authenticated user");
    return NextResponse.redirect(`${origin}/login`, 303);
  }

  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();
  if (profileErr) {
    console.warn("[stripe-portal] profile lookup failed:", profileErr.message);
  }

  const customerId = (profile as { stripe_customer_id?: string | null } | null)
    ?.stripe_customer_id;
  if (!customerId) {
    // No Stripe customer yet → bounce back to /settings cleanly. The UI shows
    // Subscribe in this state, not Manage, so this should be rare.
    return NextResponse.redirect(`${origin}/settings`, 303);
  }

  try {
    const session = await createBillingPortalSession({
      customerId,
      returnUrl: `${origin}/settings`,
    });
    return NextResponse.redirect(session.url, 303);
  } catch (e) {
    const message = e instanceof Error ? e.message : "portal failed";
    console.error("[stripe-portal]", message);
    return errorRedirect();
  }
}
