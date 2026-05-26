import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { safeOrigin } from "@/lib/origin";
import { APP_URL, MARKETING_URL, isLanOrLocalHost } from "@/lib/urls";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/activity",
  "/insights",
  "/services",
  "/settings",
  "/onboarding",
];

const AUTH_ROUTES = new Set(["/login", "/register"]);

// Paths that belong on the authenticated app surface (app.monivo.lt).
const APP_PREFIXES = [
  ...PROTECTED_PREFIXES,
  "/login",
  "/register",
  "/auth",
];

// Paths that belong on the marketing surface (monivo.lt).
const MARKETING_PATHS = new Set<string>([
  "/",
  "/kontaktai",
  "/privatumas",
  "/salygos",
]);

function matchesPrefix(pathname: string, prefixes: string[]) {
  return prefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

function hostnameOf(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

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

  const { pathname, search } = request.nextUrl;
  const requestHostRaw = (request.headers.get("host") ?? "").toLowerCase();
  // Strip the port — the configured APP_URL / MARKETING_URL have no port at
  // their public surface, but the request's `Host` header carries it on dev
  // (`192.168.x.x:3000`). Without this, the equality check never matched on
  // LAN and dev hosts silently fell into the "neither surface" branch.
  const requestHostname = requestHostRaw.split(":")[0] ?? "";
  const appHost = hostnameOf(APP_URL);
  const marketingHost = hostnameOf(MARKETING_URL);

  // Treat localhost / 127.0.0.1 / private LAN IPs / *.local as the app
  // surface — never as marketing. This makes `/onboarding`, `/login`, and the
  // other app routes work for on-device dev testing without depending on the
  // exact value of NEXT_PUBLIC_SITE_URL.
  const isDevHost = isLanOrLocalHost(requestHostRaw);

  const isAppHost =
    isDevHost || (appHost !== "" && requestHostname === appHost);
  const isMarketingHost =
    !isDevHost &&
    marketingHost !== "" &&
    (requestHostname === marketingHost ||
      requestHostname === `www.${marketingHost}`);

  if (isMarketingHost && matchesPrefix(pathname, APP_PREFIXES)) {
    return NextResponse.redirect(`${APP_URL}${pathname}${search}`);
  }
  if (
    isAppHost &&
    pathname !== "/" &&
    MARKETING_PATHS.has(pathname) &&
    MARKETING_URL
  ) {
    return NextResponse.redirect(`${MARKETING_URL}${pathname}${search}`);
  }

  // On the app subdomain, root resolves based on auth state. On the marketing
  // surface root continues to render the landing page.
  if (isAppHost && pathname === "/") {
    const origin = safeOrigin(request.nextUrl);
    return NextResponse.redirect(
      new URL(user ? "/dashboard" : "/login", origin),
    );
  }

  const isProtected = matchesPrefix(pathname, PROTECTED_PREFIXES);

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
