-- Restore the explicit privilege baseline for the public schema.
--
-- Production was failing onboarding with `permission denied for schema public`
-- (Vercel digest 675070421). Root cause: the initial migration relied on
-- Supabase's legacy default of granting USAGE on schema public + table-level
-- SELECT/INSERT/UPDATE/DELETE to `anon` and `authenticated`. Newer Supabase
-- projects ship locked down, so the implicit default no longer applies and
-- every server-rendered query — starting with the auth gate's read of
-- `profiles.onboarding_completed_at` — returns 42501 from Postgres.
--
-- This migration is the authoritative grant baseline. It is idempotent:
-- safe to re-run on environments that already have some of these grants in
-- place (e.g. databases where the SQL-editor snippet was applied by hand).
--
-- Notes:
--   * RLS remains the row-scope boundary on every table. Grants here are
--     necessary-but-not-sufficient.
--   * `email_trial_log` stays locked — only the SECURITY DEFINER signup
--     trigger and the service role touch it.
--   * Column-level UPDATE on `profiles` is the security boundary that
--     prevents clients from extending their own trial / flipping their own
--     subscription status etc. We re-assert it explicitly because a prior
--     manual `grant update on public.profiles` would have overridden the
--     allowlist set by the initial migration.

-- ---------------------------------------------------------------
-- 1. Schema usage
-- ---------------------------------------------------------------
grant usage on schema public to anon, authenticated;

-- ---------------------------------------------------------------
-- 2. Table-level grants
-- ---------------------------------------------------------------
grant select on public.profiles                              to authenticated;
grant select, insert, update, delete on public.services        to authenticated;
grant select, insert, update, delete on public.income_entries  to authenticated;
grant select, insert, update, delete on public.expense_entries to authenticated;

-- email_trial_log: deny all client access (also enforced by RLS no-policy).
revoke all on public.email_trial_log from authenticated, anon;

-- ---------------------------------------------------------------
-- 3. Profiles column-level UPDATE allowlist
-- ---------------------------------------------------------------
-- Clear any prior coarse grant and re-apply the narrow column set.
revoke update on public.profiles from authenticated;

grant update (
  -- Account-level fields the user can edit anytime.
  display_name,
  profession,
  locale,
  -- Legacy tax_rate plus the tax-profile fields added in 20260521184500.
  tax_rate,
  tax_mode,
  iv_expense_mode,
  include_psd,
  custom_tax_percent,
  vl_yearly_cost_cents,
  vl_valid_until,
  -- Onboarding completion flag (added in 20260516235534).
  onboarding_completed_at,
  -- Trial/subscription seed columns. The onboarding server action only
  -- writes these when the row is missing them (defensive against a profile
  -- created outside `handle_new_user`). The values are NOT NULL with safe
  -- defaults in the schema, so in practice the action never writes them;
  -- the grant is here to prevent the action throwing on the edge case.
  -- All Stripe-driven status changes still go through the webhook + service
  -- role, bypassing this grant.
  trial_ends_at,
  subscription_status
) on public.profiles to authenticated;

-- ---------------------------------------------------------------
-- 4. Function execute grants
-- ---------------------------------------------------------------
-- The write-gate RLS policies on services / income_entries / expense_entries
-- call `public.current_user_can_write()`, which calls `public.can_write(...)`.
-- Both are SECURITY INVOKER, so the caller's role must have EXECUTE. Grant
-- explicitly rather than relying on the PUBLIC default (which newer Supabase
-- projects also lock down).
grant execute on function public.can_write(public.profiles) to authenticated;
grant execute on function public.current_user_can_write()    to authenticated;
