# Monivo — Auth, Trial & Billing

> Operational plan for how authentication, the 30-day trial, billing,
> and read-only enforcement fit together. This is **planning only** — no
> implementation. When this document and `docs/architecture.md` overlap,
> architecture defines the stack; this doc defines the rules.

Status: confirmed · Owner: product
Last updated: 2026-05-17

---

## 1. Principles

1. **Auth lives on the app surface, not the marketing landing.**
   `monivo.lt` stays public, fully static. All login/register UI lives under
   `app.monivo.lt` (or `/` under the `(app)` route group for now).
2. **No payment details at registration.** Card collection only happens when
   a user chooses a paid plan. Trial length is intentionally generous
   (30 days) to match the habit-forming nature of weekly/monthly
   income tracking.
3. **A trial that ends does not lock people out of their own data.** Expired
   trial = read-only access + CSV export. We are a clarity tool, not a
   ransom note.
4. **In-app reminders are calm.** A banner, not a modal. No countdown
   theatre. No upsell pop-ups during core flows.
5. **One paid tier only at MVP launch.** Annual / promo plans are post-MVP.

---

## 2. User journey

```
landing CTA (Pradėti nemokamai →)
        │
        ▼
  app.monivo.lt/register
   ─ email + name
   ─ no password (magic link)
   ─ no card
        │
        ▼
  account created
   ─ subscription_status = "trialing"
   ─ trial_ends_at = now() + 30 days
        │
        ▼
  full app access for 30 days
   ─ banner appears at 7, 3, and 1 days remaining
     "Liko X dienos. Pasirinkite planą."
        │
        ▼
  trial ends, no plan chosen
   ─ subscription_status = "expired"
   ─ read-only mode: view + CSV export, no create/edit/delete
        │                                          │
        │ user clicks plan                         │ user does nothing
        ▼                                          ▼
  Stripe Checkout → webhook                  account stays read-only
   ─ subscription_status = "active"          indefinitely; data preserved
   ─ full access restored
```

Any state can return to `active` by completing checkout.

---

## 3. Auth model

**Stack:** Supabase Auth (magic-link email), already chosen in
`docs/architecture.md`.

**Routes** (under `(app)`):
- `/login` — single field, magic link
- `/register` — single field, magic link (same flow, different copy)
- `/api/auth/callback` — exchange code for session

**Landing CTAs** route to `/register` for new users. The header
"Prisijungti" link routes to `/login`.

**Session:** HTTP-only cookies via Supabase SSR helpers.

**Middleware:** `(app)/middleware.ts` enforces a valid session for every
path except `/login`, `/register`, `/api/auth/*`.

---

## 4. Trial & billing model

### Subscription states

| state | meaning | can create / edit / delete | can view + CSV export |
|---|---|---|---|
| `trialing` | inside the 30-day free window | ✔ | ✔ |
| `active` | paid subscription, current period valid | ✔ | ✔ |
| `expired` | trial ended, no plan was chosen | ✘ | ✔ |
| `past_due` (within 7-day grace) | renewal failed, grace running | ✔ | ✔ |
| `past_due` (grace exceeded) | grace exhausted, payment still failing | ✘ | ✔ |
| `canceled` | user cancelled, billing period ended | ✘ | ✔ |

Stripe webhooks drive every transition. `past_due` is the only state
that depends on **time since failure**, not just the flag itself: writes
are allowed for 7 days from `past_due_since`, then the account flips to
read-only until payment is fixed (which moves it back to `active`).
That 7-day window is independent of Stripe's own dunning retries.

### Database fields

A single `profiles` row per `auth.users.id`:

```
profiles
├─ id                    uuid (= auth.users.id, PK)
├─ email                 text
├─ display_name          text
├─ subscription_status   text  ('trialing' | 'active' | 'expired'
│                              | 'past_due' | 'canceled')
├─ trial_started_at      timestamptz
├─ trial_ends_at         timestamptz
├─ stripe_customer_id    text   nullable
├─ stripe_subscription_id text  nullable
├─ current_period_end    timestamptz nullable
├─ past_due_since        timestamptz nullable  (set on past_due, cleared on active)
├─ created_at            timestamptz default now()
└─ updated_at            timestamptz
```

Created by a Supabase trigger on `auth.users` insert. `trial_ends_at`
defaults to `now() + interval '30 days'`.

RLS: a user can only `select`/`update` their own profile row.

---

## 5. Read-only enforcement

Enforcement happens at **three layers** so it cannot be bypassed by a
client-side toggle:

1. **Database (authoritative).** RLS on every mutating table
   (`income_entries`, `expense_entries`, `services`, etc.) calls a
   `can_write(profile)` SQL helper. It returns true when:
   - `status = 'trialing'` and `now() < trial_ends_at`, or
   - `status = 'active'`, or
   - `status = 'past_due'` and `now() < past_due_since + interval '7 days'`.
   Otherwise false. Selects are always allowed for the owner.
2. **Server actions / route handlers.** Each mutating action calls a
   `requireWriteAccess()` helper that throws if status is `expired` or
   `canceled`. Read paths and `/api/export/csv` skip the check.
3. **UI.** Quick-add FAB, edit/delete buttons, and editable inputs read a
   `useSubscriptionStatus()` value and render disabled states with a
   calm "Atnaujinkite planą, kad galėtumėte tęsti" hint linking to the
   plan picker.

If layer 1 alone is correct, layers 2 and 3 are UX polish — layer 1 is
the truth.

---

## 6. Reminders & UI states

| Days remaining | Surface | Tone |
|---|---|---|
| 30–8 | none | calm, off — give people room to actually use the product |
| 7 | soft inline banner above main content: "Liko 7 dienos. Pasirinkite planą." | informative |
| 6–4 | banner persists with current day count | informative |
| 3 | banner slightly more present: "Liko 3 dienos." | gentle |
| 2 | banner persists | gentle |
| 1 (final day) | "Šiandien paskutinė nemokama diena · Pasirinkite planą →" | gentle, not urgent |
| 0 (expired) | banner turns amber: "Nemokamas laikotarpis baigėsi. Atnaujinkite planą, kad galėtumėte pridėti naujų įrašų." + read-only mode | non-blocking |
| `active` | no banner | invisible |

The banner is dismissible per-session but reappears next day. No modal,
no full-page interstitial. No countdown timers. The pricing/plan picker
lives at `/settings/billing` and on the landing pricing section.

---

## 7. Stripe integration

**Timing:** **Phase 6.5 — Billing**, slotted between Auth (Phase 6) and
App Shell (Phase 7). Confirmed 2026-05-17. Designing status-aware
mutating screens from the start is cheaper than retrofitting every form
after App Shell ships.

**Scope at MVP:**
- One product, one price: `Monivo` €X/mėn. (price from
  `landing-pricing.tsx`)
- Stripe Checkout (hosted) for purchase
- Stripe Customer Portal for cancel/update card
- Webhooks: `customer.subscription.created/updated/deleted`,
  `invoice.paid`, `invoice.payment_failed`
- Webhook updates `profiles.subscription_status` and
  `current_period_end`. The DB is the only source of truth in the app —
  we never call Stripe from the request path.

**Deferred:**
- Annual plan
- Promo codes
- Multiple tiers / team plans
- In-app proration UI
- Tax/VAT handling beyond Stripe defaults (revisit before broad EU
  launch — Stripe Tax + own invoicing if needed; Paddle no longer in
  scope per the 2026-05-17 decision)

---

## 8. What is intentionally deferred

- Password auth, social auth (Google/Apple) — magic link only at MVP
- Email/password recovery flows (no passwords to recover)
- Team accounts, seats, invites
- Per-feature paywalling (everything is gated by one boolean)
- Trial extensions, win-back coupons
- Email reminders ("Liko 1 diena" emails) — only in-app banners at MVP
- Analytics on conversion funnel — instrument after launch

---

## 9. Decisions log

Resolved 2026-05-17:

1. **Phase placement.** ✔ Phase 6.5 — Billing, between Auth and App
   Shell. Reflected in `docs/phase-roadmap.md`.
2. **Provider.** ✔ Stripe (Checkout + Customer Portal + webhooks).
   Paddle removed from scope.
3. **Trial.** ✔ 30 days, no card required at registration. Updated
   2026-05-17 from the original 7-day plan to better match the
   habit-based usage pattern of beauty professionals tracking
   weekly/monthly income.
4. **Trial reset on delete + re-register.** ✔ No. Track
   `trial_started_at` against the email even after profile delete so a
   second account from the same address starts as `expired`.
5. **`past_due` grace.** ✔ 7 days, tracked via
   `profiles.past_due_since`. Writes allowed during grace; read-only
   after. Independent of Stripe's own retry window.
6. **CSV export in read-only states.** ✔ Always available in `expired`,
   `canceled`, and post-grace `past_due`. Re-download of past invoices
   via Stripe Customer Portal link from `/settings/billing`.

Still open:

- **Banner copy authority.** Final Lithuanian strings will live in
  `src/data/copy.lt.ts` when that file is created.

---

## 10. Cross-references

- `docs/architecture.md` §10 — Stack choice, RLS posture
- `docs/architecture.md` §145–147 — Billing direction (Stripe vs Paddle)
- `docs/phase-roadmap.md` Phase 6 — Auth scope
- `docs/phase-roadmap.md` Post-MVP — current billing placement (to be
  promoted to a numbered phase per §9.1)
- `docs/product.md` — clarity-tool principles that justify the
  non-aggressive read-only stance
- `docs/final-decisions.md` — tiebreaker for any disagreement between
  this doc and architecture
