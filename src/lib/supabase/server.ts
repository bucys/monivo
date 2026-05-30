import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";

// `cache` memoizes per server-render pass: the layout, AppShell, and the page
// segment all share one client instance instead of constructing three. Route
// handlers and server actions each run in their own request, so they get a
// fresh instance as before.
export const createSupabaseServerClient = cache(async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component — middleware refresh handles it.
          }
        },
      },
    },
  );
});

// Cached per render pass so the layout + page + AppShell collapse to a single
// network validation of the session, instead of one `getUser()` round-trip
// each. Returns null when unauthenticated; callers handle the redirect.
export const getAuthUser = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
