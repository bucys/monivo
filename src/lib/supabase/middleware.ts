import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { safeOrigin } from "@/lib/origin";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/activity",
  "/insights",
  "/services",
  "/settings",
  "/onboarding",
];

const AUTH_ROUTES = new Set(["/login", "/register"]);

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: refresh the session before reading user — supabase docs.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  // Build redirects against a sanitized origin so requests that arrived via
  // the bind address 0.0.0.0 don't get bounced to an unroutable host.
  const origin = safeOrigin(request.nextUrl);

  if (!user && isProtected) {
    const url = new URL("/login", origin);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (user && AUTH_ROUTES.has(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", origin));
  }

  return supabaseResponse;
}
