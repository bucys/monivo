-- C-1: Lock down client-writable profile columns (billing bypass fix).
--
-- A prior migration (20260526180000_restore_public_schema_grants) added
-- `trial_ends_at` and `subscription_status` to the authenticated UPDATE
-- allowlist on public.profiles. Because the `profiles_update_own` RLS policy
-- only checks `id = auth.uid()` (and does NOT restrict column values), any
-- authenticated user could PATCH their own profile row directly via PostgREST
-- (DevTools) and set `subscription_status = 'active'` / a far-future
-- `trial_ends_at`, granting themselves a permanent paid subscription and
-- re-enabling write access while expired (`can_write()` reads these columns).
--
-- Fix: drop those two columns from the authenticated grant. They are not
-- needed by client code — `handle_new_user` already seeds both as NOT NULL
-- defaults (`subscription_status = 'trialing'`, `trial_ends_at = now() + 30d`),
-- so onboarding never legitimately writes them. All real status changes flow
-- through the Stripe webhook using the service role, which bypasses grants.
--
-- Idempotent: safe to re-run. RLS row-ownership policies are unchanged.

revoke update on public.profiles from authenticated;

grant update (
  -- Account-level fields the user can edit anytime.
  display_name,
  profession,
  locale,
  -- Legacy tax_rate plus the tax-profile fields (20260521184500).
  tax_rate,
  tax_mode,
  iv_expense_mode,
  include_psd,
  custom_tax_percent,
  vl_yearly_cost_cents,
  vl_valid_until,
  -- Onboarding completion flag (20260516235534).
  onboarding_completed_at
  -- NOTE: trial_ends_at and subscription_status are intentionally NOT granted.
  -- Only the Stripe webhook (service role) may change subscription state.
) on public.profiles to authenticated;
