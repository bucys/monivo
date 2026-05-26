-- Stripe subscription columns on profiles.
-- Idempotent: safe to re-run.

alter table public.profiles
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists current_period_ends_at timestamptz;

-- Index for webhook lookups by customer id (fired on invoice events without
-- our metadata).
create index if not exists profiles_stripe_customer_id_idx
  on public.profiles (stripe_customer_id);

-- subscription_status, trial_ends_at, past_due_since already exist from
-- earlier migrations. The application code treats subscription_status as
-- the canonical "may write" gate.
