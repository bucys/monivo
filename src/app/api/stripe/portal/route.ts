import { NextResponse } from "next/server";
import { safeOrigin } from "@/lib/origin";
import { createBillingPortalSession } from "@/lib/stripe/sessions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();

  const customerId = (profile as { stripe_customer_id?: string | null } | null)
    ?.stripe_customer_id;
  if (!customerId) {
    // No Stripe customer yet → bounce to checkout instead so we don't 500.
    return NextResponse.redirect(`${safeOrigin(request.url)}/settings`, 303);
  }

  const origin = safeOrigin(request.url);

  try {
    const session = await createBillingPortalSession({
      customerId,
      returnUrl: `${origin}/settings`,
    });
    return NextResponse.redirect(session.url, 303);
  } catch (e) {
    const message = e instanceof Error ? e.message : "portal failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
