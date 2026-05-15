# Monivo — Phase Roadmap

Implementation is broken into **small, sequential, independently shippable phases**. Do not start a phase until the previous one is **stable** (see `CLAUDE.md` §11) and **committed**.

Each phase below lists:

- **Goal** — what "done" means.
- **In scope** — what to build.
- **Out of scope** — what must NOT happen in this phase.
- **Output** — concrete deliverables.
- **Commit point** — the message to use when the phase is stable.

This roadmap supersedes the simpler list in earlier drafts of `CLAUDE.md`.

---

## Phase 1 — Documentation Foundation ✅

**Goal:** establish project rules, product vision, and design language before any code is written.

**In scope:**
- `CLAUDE.md` and all files under `/docs`.

**Out of scope:**
- Anything that runs.

**Output:** the current set of docs.

**Commit:** `setup project documentation foundation`

---

## Phase 2 — Project Scaffold

**Goal:** a runnable, empty Next.js app with the agreed folder layout, Tailwind configured, and Supabase env wiring (no DB yet).

**In scope:**
- `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `app/globals.css` (minimal).
- Folder structure exactly as in `docs/architecture.md` + `docs/final-decisions.md`.
- Empty route groups `(landing)` and `(app)` with placeholder layouts that render nothing meaningful.
- Domain routing via middleware (host → route group).
- `.env.example` with required Supabase keys (no real values).
- Vercel project configuration.

**Out of scope:**
- Any UI primitive.
- Any product page.
- Auth.
- Database schema.

**Output:** `pnpm dev` runs; `monivo.lt` host returns a blank landing layout; `app.monivo.lt` host returns a blank app layout.

**Commit:** `initialize next.js app foundation`

---

## Phase 3 — Design Tokens & UI Primitives

**Goal:** the shared visual language exists as Tailwind tokens and a handful of reusable primitives.

**In scope:**
- All design tokens from `docs/design-system.md` declared in `tailwind.config.ts`.
- `app/globals.css`: Tailwind directives, Inter font face, CSS variable definitions, base resets. Nothing else.
- `components/ui/`: `button`, `card`, `input`, `sheet`, `chip`, `bottom-nav`, `fab`.
- A single internal `/dev/primitives` route (under `(app)`) to visually verify each primitive. **This route is removed before launch.**

**Out of scope:**
- Any product screen.
- Marketing components.
- Animation libraries (CSS only — Framer Motion arrives in the first phase that genuinely needs it).

**Output:** every primitive in `docs/design-system.md` exists, mobile-first, accessible, and uses tokens only.

**Commit:** `create reusable ui primitives`

---

## Phase 4 — Landing Page (`monivo.lt`)

**Goal:** ship the marketing page exactly as specified in `docs/landing-page.md`.

**In scope:**
- `src/app/(landing)/page.tsx`.
- `src/components/landing/*` for the 8 sections.
- Static hero mockup asset(s) under `/public`.
- SEO basics: `<h1>`, meta tags, OG image, `lang="lt"`.
- One primary CTA wired to `https://app.monivo.lt` (or local equivalent).

**Out of scope:**
- Anything under `(app)`.
- Any form, signup, or interactive component beyond the CTA.
- A blog, pricing page, or comparison table.

**Output:** Lighthouse mobile ≥ 95 in Performance, Accessibility, Best Practices, SEO.

**Commit:** `build landing page`

---

## Phase 5 — Database Schema

**Goal:** the minimal schema from `docs/architecture.md` lives in Supabase with RLS.

**In scope:**
- `profiles` table (`user_id`, `tax_rate`, `locale`, `profession?`, `created_at`).
- `entries` table (`id`, `user_id`, `kind`, `amount_cents`, `category?`, `note?`, `occurred_at`, `created_at`).
- Row-Level Security policies: a user reads/writes only their own rows.
- A SQL migration file checked into the repo.

**Out of scope:**
- Any UI.
- Server actions (next phase).
- Aggregation tables or views.

**Output:** schema applied on a dev Supabase project, RLS verified by a manual check.

**Commit:** `add initial database schema`

---

## Phase 6 — Auth

**Goal:** Supabase magic-link auth, session middleware, and a calm login screen.

**In scope:**
- `src/app/(app)/login/page.tsx` — single-input magic-link form.
- `src/app/api/auth/callback/route.ts` — handle the Supabase code exchange.
- `src/lib/supabase/{client,server,middleware}.ts` — minimal SSR helpers.
- Middleware enforcing auth for everything under `(app)` except `/login`.
- Branded magic-link email template (copy resolved in `final-decisions.md` open question).

**Out of scope:**
- App shell beyond the login screen.
- Onboarding (next phase).
- Social logins.

**Output:** a new user can request a magic link, click it, and land on an empty authenticated route.

**Commit:** `add magic-link auth`

---

## Phase 7 — App Shell

**Goal:** the authenticated container — bottom nav, FAB, header, safe-area handling — exists and renders empty pages for `/`, `/activity`, `/insights`.

**In scope:**
- `src/app/(app)/layout.tsx` — header, bottom nav, FAB, safe-area insets.
- Route stubs: `/`, `/activity`, `/insights`, `/settings` (settings accessed via header avatar, not nav).
- The FAB does not yet open a sheet; it logs to console.

**Out of scope:**
- Onboarding logic.
- Any data fetching.
- Quick-add behavior.

**Output:** authenticated user can navigate between the four screens; all chrome respects design tokens.

**Commit:** `build authenticated app shell`

---

## Phase 8 — Onboarding

**Goal:** the 6-step onboarding from `docs/app-flow.md` exists and persists the user's profile.

**In scope:**
- Welcome → profession (optional) → tax reserve (slider/preset, decision pending) → optional first entry → dashboard.
- A server action that writes/updates the user's `profile`.
- Logic that routes new users into onboarding and existing users straight to the dashboard.

**Out of scope:**
- Real quick-add submission (the optional first entry uses a temporary path or is skipped in this phase — TBD when this phase begins).
- Dashboard data fetching.

**Output:** a brand-new user lands on the dashboard with a saved profile within 60 seconds.

**Commit:** `add onboarding flow`

---

## Phase 9 — Quick-Add Flow

**Goal:** the FAB opens a bottom sheet that creates real `entries` rows.

**In scope:**
- `src/components/app/quick-add-sheet.tsx`.
- Income / Expense segmented tabs, numeric keypad-style input, preset amount chips, category chips (fixed map), optional note.
- Server action that inserts an entry and revalidates the dashboard.
- 5-second undo toast that calls a delete server action.
- Optimistic UI for the spendable number.

**Out of scope:**
- Recurring entries.
- Date picker (default = today; long-press is a stretch).
- Receipt scanning.

**Output:** an entry created via the FAB shows up instantly on the dashboard and persists in Supabase.

**Commit:** `build quick-add flow`

---

## Phase 10 — Dashboard

**Goal:** the home screen renders the real spendable number, stat tiles, and recent activity.

**In scope:**
- `src/app/(app)/page.tsx` as a server component.
- Server-side query for the current month's totals.
- `spendable-hero-card`, `stat-tiles`, `recent-activity` components.
- Month switcher (sheet picker).
- Count-up animation on the spendable number (Framer Motion enters the project here).

**Out of scope:**
- Charts.
- Full activity list (next phase).
- Insights.

**Output:** dashboard reflects entries created via quick-add, scoped to the selected month.

**Commit:** `build dashboard`

---

## Phase 11 — Activity Flow

**Goal:** the activity screen lists all entries for a month, grouped by day, with edit/delete.

**In scope:**
- `src/app/(app)/activity/page.tsx`.
- Day-grouped list with optimistic delete + undo.
- Entry detail sheet with edit form (reuses the quick-add sheet UI).
- Month switcher shared with the dashboard.

**Out of scope:**
- Search.
- Filters beyond month.
- Export.

**Commit:** `build activity flow`

---

## Phase 12 — Insights

**Goal:** the calmest screen in the app — one number, one breakdown card, one sparkline, one sentence.

**In scope:**
- `src/app/(app)/insights/page.tsx`.
- Monthly summary cards.
- Inline-SVG sparkline of the last 6 months of spendable (no chart library).
- A single generated insight sentence based on month-over-month comparison.

**Out of scope:**
- Multiple charts.
- Category breakdowns.
- AI-generated copy.

**Commit:** `build insights screen`

---

## Phase 13 — Polish & Optimization

**Goal:** the product is ready for the first real users.

**In scope:**
- Performance pass against the budgets in `final-decisions.md` §17.
- Accessibility pass (contrast, keyboard nav, screen-reader labels for icons).
- iOS install prompt hint (one-time, dismissible).
- Empty states, error states, and offline state copy.
- Settings screen completion (tax rate, profession, language, logout, delete account).
- Final copy review (Lithuanian).
- Production env wiring, OG image, favicon set, manifest.

**Out of scope:**
- New features.
- Billing.
- Analytics (decision still open).

**Commit:** `polish and prepare for launch`

---

## Post-MVP (not committed)

The phases below are explicitly **not part of MVP** and have no scheduled start. Do not pre-scaffold for them.

- **Billing** — Stripe or Paddle, single paid tier.
- **Recurring entries.**
- **Accountant export (CSV/PDF).**
- **Apple / Google sign-in.**
- **Offline writes & background sync.**
- **Dark mode.**
- **Apple Wallet–style widget.**
- **Yearly tax reserve view.**
- **English UI.**

---

## How to use this roadmap

- Each phase corresponds to **one PR** unless splitting clearly reduces review burden.
- Each phase ends with a **stable commit**. No commits during a phase that contain placeholder TODOs.
- If a phase grows beyond ~3 days of work, that is a signal it is too large and should be split — surface this before starting, not midway.
- Phase numbers are sequential. Do not skip ahead unless explicitly requested.
