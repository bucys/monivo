# Monivo — Database Schema (MVP plan)

> Planning doc for Phase 5. No migrations, no client code, no UI.
> When this doc and `docs/architecture.md` §6 disagree, this doc wins
> for schema specifics (architecture §6 is explicitly marked "not
> final"). When this doc and `docs/auth-billing.md` disagree on
> subscription fields, `docs/auth-billing.md` wins.

Status: confirmed · Owner: product
Last updated: 2026-05-17

---

## 1. Goals

1. Support the dashboard calculation: **spendable = income − expenses − (income × tax_rate)** scoped to a month (`docs/final-decisions.md` §8).
2. Support quick income entry from a user's own saved services list (`docs/app-flow.md`).
3. Support manual expense entry against a static category map (`docs/final-decisions.md` §10).
4. Carry the 30-day trial + Stripe billing fields from `docs/auth-billing.md`.
5. Enforce read-only after trial / grace expiry **at the database**, not just the UI.
6. Allow CSV export of own data, always, even in read-only.

Anything outside these goals is deferred.

---

## 2. Tables (5)

### 2.1 `profiles`

One row per `auth.users`. Holds product-side identity + trial/billing state.

| column | type | notes |
|---|---|---|
| `id` | `uuid` PK, FK → `auth.users(id)` on delete cascade | same id as Supabase Auth user |
| `display_name` | `text` not null | from onboarding |
| `profession` | `text` not null check in `('nails','lashes','cosmetology','hair','other')` | drives the static category map |
| `tax_rate` | `numeric(5,4)` not null default `0.15` check `(tax_rate >= 0 and tax_rate <= 0.30)` | stored as decimal (`0.1500`), not integer percent |
| `locale` | `text` not null default `'lt'` | only `'lt'` at MVP |
| `subscription_status` | `text` not null default `'trialing'` check in `('trialing','active','expired','past_due','canceled')` | see `docs/auth-billing.md` §4 |
| `trial_started_at` | `timestamptz` not null default `now()` | |
| `trial_ends_at` | `timestamptz` not null default `now() + interval '30 days'` | |
| `stripe_customer_id` | `text` nullable | |
| `stripe_subscription_id` | `text` nullable | |
| `current_period_end` | `timestamptz` nullable | from Stripe webhook |
| `past_due_since` | `timestamptz` nullable | set on `past_due`, cleared on `active` |
| `created_at` | `timestamptz` not null default `now()` | |
| `updated_at` | `timestamptz` not null default `now()` | trigger-maintained |

Email lives in `auth.users.email`; we **don't denormalize** to avoid drift.

### 2.2 `email_trial_log`

Tiny table that survives profile deletion so a re-registration from the
same address does not get a fresh trial (`docs/auth-billing.md` §9.4).

| column | type | notes |
|---|---|---|
| `email` | `citext` PK | case-insensitive; matches Supabase Auth |
| `trial_started_at` | `timestamptz` not null default `now()` | |
| `trial_ends_at` | `timestamptz` not null | snapshot at first registration |

No FK to `auth.users` — the whole point is that this row outlives the
user. A second registration with the same email sets the new
`profiles.trial_started_at` / `trial_ends_at` to the values from this
log, then immediately evaluates as `expired` if the original window is
past.

### 2.3 `services`

User's saved service shortcuts that drive quick-add chips.

| column | type | notes |
|---|---|---|
| `id` | `uuid` PK default `gen_random_uuid()` | |
| `user_id` | `uuid` not null FK → `profiles(id)` on delete cascade | |
| `name` | `text` not null | e.g., "Manikiūras" |
| `price_cents` | `integer` not null check `(price_cents >= 0)` | EUR cents |
| `tone` | `text` nullable | optional UI color slug (`'income'`, `'tax'`, `'violet'`, etc.) |
| `sort_order` | `integer` not null default `0` | |
| `created_at` | `timestamptz` not null default `now()` | |

Hard-delete only — see snapshot pattern in §2.4. No `archived_at`.

### 2.4 `income_entries`

One row per income event. **Service is snapshotted by value** at the
moment of entry so deleting a service later doesn't rewrite history.

| column | type | notes |
|---|---|---|
| `id` | `uuid` PK default `gen_random_uuid()` | |
| `user_id` | `uuid` not null FK → `profiles(id)` on delete cascade | |
| `amount_cents` | `integer` not null check `(amount_cents >= 0)` | EUR cents |
| `service_id` | `uuid` nullable FK → `services(id)` on delete set null | optional link for "edit again" |
| `service_name` | `text` not null | snapshot |
| `payment_method` | `text` not null check in `('cash','card','transfer')` | |
| `occurred_at` | `date` not null | day of the income; not a timestamp — time-of-day is irrelevant |
| `note` | `text` nullable | |
| `created_at` | `timestamptz` not null default `now()` | |

### 2.5 `expense_entries`

| column | type | notes |
|---|---|---|
| `id` | `uuid` PK default `gen_random_uuid()` | |
| `user_id` | `uuid` not null FK → `profiles(id)` on delete cascade | |
| `amount_cents` | `integer` not null check `(amount_cents >= 0)` | EUR cents |
| `category` | `text` not null | slug from the static client-side map (`'rent'`, `'materials'`, `'transport'`, ...) |
| `occurred_at` | `date` not null | |
| `note` | `text` nullable | |
| `created_at` | `timestamptz` not null default `now()` | |

**Split from income** rather than a single `entries(kind)` table because
the columns diverge: income has `service_*` + `payment_method`,
expense has `category`. Splitting enforces invariants at the column
level and keeps month-aggregation queries simple. This departs from
`docs/architecture.md` §6 which is explicitly marked "not final."

---

## 3. Relationships

```
auth.users 1───1 profiles 1───* services
                  │ 1
                  │
                  ├───* income_entries  (optional service_id → services)
                  └───* expense_entries

email_trial_log  (no FK — outlives auth.users on purpose)
```

All FKs cascade from `auth.users` → `profiles` → owned rows on user
deletion. `email_trial_log` is intentionally orphaned by design.

---

## 4. RLS strategy

**All five tables have RLS enabled.** Service-role calls are forbidden
from the client (`docs/architecture.md` §6).

### `profiles`
- `select`: `id = auth.uid()`
- `update`: `id = auth.uid()` with column-level guard preventing direct
  writes to subscription fields from the client (those fields are only
  writable by the service role from `/api/billing/webhook`)
- `insert`/`delete`: blocked from client (trigger / admin)

### `services`
- `select`: `user_id = auth.uid()`
- `insert`/`update`/`delete`: `user_id = auth.uid()` **and** `can_write(profile)`

### `income_entries`, `expense_entries`
- `select`: `user_id = auth.uid()` (always — supports view + CSV export
  in read-only states)
- `insert`/`update`/`delete`: `user_id = auth.uid()` **and** `can_write(profile)`

### `email_trial_log`
- No client policies. Touched only by the registration trigger and the
  service role.

---

## 5. Helper functions

### 5.1 `can_write(p profiles) returns boolean`

Single source of truth for "is this user allowed to mutate."

```sql
create or replace function public.can_write(p public.profiles)
returns boolean
language sql
stable
security invoker
as $$
  select
    (p.subscription_status = 'trialing'
       and now() < p.trial_ends_at)
    or p.subscription_status = 'active'
    or (p.subscription_status = 'past_due'
       and p.past_due_since is not null
       and now() < p.past_due_since + interval '7 days');
$$;
```

RLS policies that need to call it inline against `auth.uid()`:

```sql
create or replace function public.current_user_can_write()
returns boolean
language sql
stable
security invoker
as $$
  select coalesce(
    (select public.can_write(p) from public.profiles p where p.id = auth.uid()),
    false
  );
$$;
```

Mutating policies then read `current_user_can_write()` to avoid a
`profiles` self-join in every policy expression.

### 5.2 `handle_new_user()` trigger

`after insert on auth.users` → inserts `profiles` row + reads-or-writes
`email_trial_log`. If the email is already in the log, the new
profile's `trial_started_at` / `trial_ends_at` copy from the log
(typically already past → user lands in `expired` immediately).

### 5.3 `bump_updated_at()` trigger

Generic `before update on profiles` → `new.updated_at = now()`.

No other tables track `updated_at` at MVP — entries are typically not
edited; `created_at` is the audit signal.

---

## 6. Indexes

- `profiles(stripe_customer_id)` — webhook lookups
- `services(user_id, sort_order)` — chip ordering in quick-add
- `income_entries(user_id, occurred_at desc)` — activity feed + monthly aggregates
- `expense_entries(user_id, occurred_at desc)` — same
- Primary keys already cover the rest

Revisit after Insights phase if month aggregation becomes slow.

---

## 7. Derived values (computed on read, not stored)

Per `docs/architecture.md` §6: no aggregation tables, no
materialized views in MVP. Spendable / monthly totals / tax reserve
are SQL `sum()` expressions in the dashboard query, scoped by
`occurred_at` to the selected month.

---

## 8. Intentionally not included

- **categories table** — static client map per `docs/final-decisions.md` §10
- **tax_payments / tax_reserve_settings** — single `tax_rate` column is enough; "paid taxes" is post-MVP
- **invoices, bookings, clients, inventory, attachments/receipts** — out of MVP scope
- **recurring entries** — post-MVP per phase-roadmap
- **multi-currency** — EUR only per `docs/final-decisions.md` §9
- **teams / seats / shared accounts**
- **audit log table** — Postgres logical decoding / Supabase logs cover us at this stage
- **notifications table** — banner dismissal is client-side per-session
- **soft delete on entries** — hard delete; CSV export handles "I want my old data back"
- **vendor / merchant column on expenses** — `note` covers it
- **tags** — defer
- **attachments / receipt photos** — defer

---

## 9. Decisions log

Resolved 2026-05-17 (blockers cleared, ready for implementation):

1. **CSV export scope.** ✔ Two separate files — `income.csv` and
   `expenses.csv`. Single-zip export is deferred. UTF-8, header row,
   one row per entry, no derived columns. Scope is per-user, all-time.
2. **Account deletion / re-registration.** ✔ Same email must **not**
   reset the trial. `email_trial_log` is preserved across profile
   deletion exactly as planned in §2.2. A second `auth.users` insert
   with the same email reuses the original `trial_started_at` /
   `trial_ends_at` from the log; the new account lands in `expired`
   immediately if the original window has passed.
3. **`past_due_since` on flap.** ✔ Reset to the **latest** Stripe
   `past_due` transition time on every transition into `past_due`. A
   user who recovers via `active` and then fails again gets a fresh
   7-day grace from the new failure. Cleared (`null`) on transition
   to `active`.
4. **Editing income `service_id`.** ✔ When `service_id` changes on
   update, re-snapshot `service_name` from the newly selected service.
   Treat every edit as a re-snapshot — never let `service_name` drift
   from the linked service at edit time. This is a server-action
   responsibility in Phase 6.5+, not enforced by a DB trigger.
5. **`payment_method` default.** ✔ `'cash'` is the UI default for new
   income entries. `'card'` and `'transfer'` remain valid and selectable.

Still open (non-blocking — implementation can proceed):

- **Profession enum extensibility.** Keeping the 5-value check at MVP
  per recommendation; revisit if onboarding research surfaces a clear
  6th profession before Phase 8 lands.
- **`tone` field on services.** Storing explicitly per this plan;
  revisit only if onboarding decides to auto-assign tones.
- **Time zone for `occurred_at`.** Treat "today" as
  `current_date at time zone 'Europe/Vilnius'` at the data-layer
  boundary. Will be documented in `src/data/` when Phase 9 lands.

---

## 10. Recommended next steps

1. ✔ §9 blockers resolved (2026-05-17).
2. Update `docs/architecture.md` §6 with a one-line cross-reference to
   this doc (not a rewrite).
3. Begin Phase 5 implementation: SQL migration in
   `supabase/migrations/0001_initial_schema.sql` covering everything in
   §2 + §5 + §6, RLS policies in §4. No application code in the same
   PR — keep the schema migration isolated.
