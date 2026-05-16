-- Monivo MVP — initial schema (Phase 5)
-- Source of truth: docs/database-schema.md
-- Trial/billing rules: docs/auth-billing.md

-- ============================================================
-- 1. Extensions
-- ============================================================
create extension if not exists pgcrypto;   -- gen_random_uuid()
create extension if not exists citext;     -- case-insensitive email key

-- ============================================================
-- 2. Tables
-- ============================================================

-- 2.1 profiles ------------------------------------------------
create table public.profiles (
  id                     uuid primary key references auth.users(id) on delete cascade,
  display_name           text not null,
  profession             text not null
                         check (profession in ('nails','lashes','cosmetology','hair','other')),
  tax_rate               numeric(5,4) not null default 0.15
                         check (tax_rate >= 0 and tax_rate <= 0.30),
  locale                 text not null default 'lt',
  subscription_status    text not null default 'trialing'
                         check (subscription_status in ('trialing','active','expired','past_due','canceled')),
  trial_started_at       timestamptz not null default now(),
  trial_ends_at          timestamptz not null default (now() + interval '30 days'),
  stripe_customer_id     text,
  stripe_subscription_id text,
  current_period_end     timestamptz,
  past_due_since         timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index profiles_stripe_customer_id_idx
  on public.profiles (stripe_customer_id)
  where stripe_customer_id is not null;

-- 2.2 email_trial_log -----------------------------------------
-- Survives profile deletion: same-email re-registration must NOT
-- reset the trial. See docs/auth-billing.md §9.4.
create table public.email_trial_log (
  email            citext primary key,
  trial_started_at timestamptz not null default now(),
  trial_ends_at    timestamptz not null
);

-- 2.3 services ------------------------------------------------
create table public.services (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  name        text not null,
  price_cents integer not null check (price_cents >= 0),
  tone        text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create index services_user_sort_idx
  on public.services (user_id, sort_order);

-- 2.4 income_entries -----------------------------------------
-- service_name is a snapshot — server actions re-snapshot on
-- service_id change. See docs/database-schema.md §9.4.
create table public.income_entries (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  amount_cents   integer not null check (amount_cents >= 0),
  service_id     uuid references public.services(id) on delete set null,
  service_name   text not null,
  payment_method text not null default 'cash'
                 check (payment_method in ('cash','card','transfer')),
  occurred_at    date not null,
  note           text,
  created_at     timestamptz not null default now()
);

create index income_entries_user_occurred_idx
  on public.income_entries (user_id, occurred_at desc);

-- 2.5 expense_entries -----------------------------------------
create table public.expense_entries (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  amount_cents integer not null check (amount_cents >= 0),
  category     text not null,
  occurred_at  date not null,
  note         text,
  created_at   timestamptz not null default now()
);

create index expense_entries_user_occurred_idx
  on public.expense_entries (user_id, occurred_at desc);

-- ============================================================
-- 3. Helper functions
-- ============================================================

create or replace function public.can_write(p public.profiles)
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select
    (p.subscription_status = 'trialing' and now() < p.trial_ends_at)
    or p.subscription_status = 'active'
    or (p.subscription_status = 'past_due'
        and p.past_due_since is not null
        and now() < p.past_due_since + interval '7 days');
$$;

create or replace function public.current_user_can_write()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select coalesce(
    (select public.can_write(p) from public.profiles p where p.id = auth.uid()),
    false
  );
$$;

-- ============================================================
-- 4. Triggers
-- ============================================================

-- 4.1 bump_updated_at on profiles
create or replace function public.bump_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_bump_updated_at
  before update on public.profiles
  for each row execute function public.bump_updated_at();

-- 4.2 handle_new_user: on auth.users insert, create profile +
-- reuse email_trial_log if the email has trialed before.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_existing_start timestamptz;
  v_existing_end   timestamptz;
  v_trial_start    timestamptz;
  v_trial_end      timestamptz;
  v_display_name   text;
  v_profession     text;
begin
  select trial_started_at, trial_ends_at
    into v_existing_start, v_existing_end
    from public.email_trial_log
    where email = new.email;

  if v_existing_start is not null then
    v_trial_start := v_existing_start;
    v_trial_end   := v_existing_end;
  else
    v_trial_start := now();
    v_trial_end   := now() + interval '30 days';
    insert into public.email_trial_log (email, trial_started_at, trial_ends_at)
      values (new.email, v_trial_start, v_trial_end);
  end if;

  -- Onboarding (Phase 8) overwrites display_name + profession on first launch.
  v_display_name := coalesce(new.raw_user_meta_data ->> 'display_name', '');
  v_profession   := coalesce(new.raw_user_meta_data ->> 'profession', 'other');

  insert into public.profiles (
    id, display_name, profession, trial_started_at, trial_ends_at
  ) values (
    new.id, v_display_name, v_profession, v_trial_start, v_trial_end
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 5. Row-Level Security
-- ============================================================

alter table public.profiles        enable row level security;
alter table public.email_trial_log enable row level security;
alter table public.services        enable row level security;
alter table public.income_entries  enable row level security;
alter table public.expense_entries enable row level security;

-- 5.1 profiles ------------------------------------------------
-- Insert/delete are not exposed to clients (trigger / admin only).
create policy profiles_select_own on public.profiles
  for select to authenticated
  using (id = auth.uid());

create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- 5.2 email_trial_log -----------------------------------------
-- RLS enabled with no policies = deny-by-default for client roles.
-- Only the security-definer trigger / service role touches this.

-- 5.3 services ------------------------------------------------
create policy services_select_own on public.services
  for select to authenticated
  using (user_id = auth.uid());

create policy services_insert_own on public.services
  for insert to authenticated
  with check (user_id = auth.uid() and public.current_user_can_write());

create policy services_update_own on public.services
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid() and public.current_user_can_write());

create policy services_delete_own on public.services
  for delete to authenticated
  using (user_id = auth.uid() and public.current_user_can_write());

-- 5.4 income_entries -----------------------------------------
create policy income_select_own on public.income_entries
  for select to authenticated
  using (user_id = auth.uid());

create policy income_insert_own on public.income_entries
  for insert to authenticated
  with check (user_id = auth.uid() and public.current_user_can_write());

create policy income_update_own on public.income_entries
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid() and public.current_user_can_write());

create policy income_delete_own on public.income_entries
  for delete to authenticated
  using (user_id = auth.uid() and public.current_user_can_write());

-- 5.5 expense_entries ----------------------------------------
create policy expense_select_own on public.expense_entries
  for select to authenticated
  using (user_id = auth.uid());

create policy expense_insert_own on public.expense_entries
  for insert to authenticated
  with check (user_id = auth.uid() and public.current_user_can_write());

create policy expense_update_own on public.expense_entries
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid() and public.current_user_can_write());

create policy expense_delete_own on public.expense_entries
  for delete to authenticated
  using (user_id = auth.uid() and public.current_user_can_write());

-- ============================================================
-- 6. Column-level privileges
-- ============================================================
-- Protect billing-managed columns on profiles from client writes.
-- Webhook writes use the service role and bypass these grants.
revoke update on public.profiles from authenticated;
grant update (display_name, profession, tax_rate, locale)
  on public.profiles to authenticated;

-- email_trial_log: deny all client access (also enforced by RLS).
revoke all on public.email_trial_log from authenticated, anon;
