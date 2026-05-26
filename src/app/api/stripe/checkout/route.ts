import { NextResponse } from "next/server";
import { safeOrigin } from "@/lib/origin";
import { createCheckoutSession } from "@/lib/stripe/sessions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();

  const origin = safeOrigin(request.url);

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
      return NextResponse.json({ error: "no session url" }, { status: 500 });
    }
    return NextResponse.redirect(session.url, 303);
  } catch (e) {
    const message = e instanceof Error ? e.message : "checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
