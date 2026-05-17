-- Phase 8 — onboarding completion flag on profiles
alter table public.profiles
  add column onboarding_completed_at timestamptz;

-- Extend authenticated UPDATE grant to include the new column.
grant update (onboarding_completed_at)
  on public.profiles to authenticated;

