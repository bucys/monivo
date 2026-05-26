alter table profiles
add column if not exists stripe_customer_id text;

alter table profiles
add column if not exists stripe_subscription_id text;

alter table profiles
add column if not exists current_period_ends_at timestamptz;