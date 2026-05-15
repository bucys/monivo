# Monivo — Architecture

Keep this intentionally simple. Complexity is the enemy of clarity, both in the product and in the codebase.

---

## 1. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js (App Router) | SSR/CSR flexibility, fits Vercel, supports both surfaces |
| Language | TypeScript | Safety, readability |
| Styling | Tailwind CSS | Speed, design-system enforcement via tokens |
| Backend / DB / Auth | Supabase | Auth, Postgres, RLS, storage — one provider, low ops |
| Hosting | Vercel | Zero-config for Next.js, edge-friendly |
| PWA | Native Next.js + manifest + service worker | No heavy PWA framework |
| Motion | Framer Motion | Only where needed; not the default |
| Icons | lucide-react | Consistent, minimal |

**No other dependencies without explicit approval.**

---

## 2. Two Surfaces, One Repo

```
monivo.lt        → marketing landing page
app.monivo.lt    → the product
```

Both live in the same Next.js project, separated by route groups:

```
src/app/
  (landing)/            → monivo.lt
    page.tsx
    ...
  (app)/                → app.monivo.lt
    page.tsx            → dashboard
    activity/
    insights/
    settings/
    login/
    ...
```

Domain routing is handled at the Vercel/Next middleware level: the host header determines which route group is served. Within the codebase, the two surfaces share design tokens but **share no UI components** by default. They are different products in tone and density.

---

## 3. Folder Structure

```
src/
  app/
    (landing)/          # landing page
    (app)/              # PWA
    api/                # route handlers — created lazily; empty in MVP
    layout.tsx
    globals.css
  components/
    ui/                 # primitives: Button, Card, Input, Sheet
    app/                # app-only composed components
    landing/            # landing-only composed components
  lib/
    supabase/           # client + server helpers
    money/              # currency formatting, math
    tax/                # tax reserve calculations
    utils/
  data/
    queries/            # server-side data access
    mutations/          # server actions
  hooks/
  types/
public/
  icons/                # PWA icons
  manifest.webmanifest
docs/
```

**Rules:**
- A component lives in **exactly one** folder. No re-exports across surfaces.
- `lib/` is pure functions, no React.
- `data/` is the only place that talks to Supabase from the server.
- Components never import `@supabase/*` directly.

---

## 4. Component Philosophy

- **Server components by default.** Add `"use client"` only when the component needs interaction, state, or browser APIs.
- **Small and composable.** A component that renders more than ~120 lines is probably two components.
- **Named exports only.**
- **No barrel `index.ts` files** beyond `components/ui`.
- **Primitives in `components/ui`** are the only shared layer between marketing and app.
- Props are explicit; avoid `...rest` spreading unless wrapping a native element.

---

## 5. State Management Philosophy

- **No global state library** in MVP. No Redux, Zustand, Jotai.
- Server state lives on the server: data is fetched in server components or server actions, mutations revalidate.
- Local UI state uses `useState` / `useReducer`.
- URL is the source of truth for filters (e.g., `?month=2026-05`).
- Form state: native `<form>` + server actions. No form library in MVP.

If a feature seems to need global state, the feature is probably too complex.

---

## 6. Data Model (high-level, not final)

Three tables are enough for MVP:

```
users          (managed by Supabase Auth)
profiles       (user_id, tax_rate, locale, profession?, created_at)
entries        (id, user_id, kind: 'income'|'expense', amount_cents,
                category?, note?, occurred_at, created_at)
```

MVP is EUR-only — no `currency` column. Tax math is a single percentage applied to gross income (see `docs/final-decisions.md` §8).

Derived values (monthly totals, tax reserved, spendable) are computed on read, not stored. Premature aggregation is forbidden.

**Row-Level Security** is mandatory on every table. No service-role calls from the client.

---

## 7. Auth Direction (future)

- MVP: Supabase email + magic link. No passwords.
- Phase 2: Apple sign-in (iOS PWA users), Google sign-in.
- No social-first onboarding. Email captures intent and reduces churn.
- Sessions are HTTP-only cookies via Supabase SSR helpers.

Auth UI lives at `app.monivo.lt/login`. The marketing site never handles credentials.

---

## 8. Billing Direction (future)

- MVP is free.
- Phase 2: a single paid tier (~€4–6/month) via **Stripe** or **Paddle** (TBD — Paddle for EU VAT handling is likely).
- Billing logic will live in `src/lib/billing/` and `src/app/api/billing/`.
- No billing code, types, or UI in MVP. Do not pre-scaffold.

---

## 9. PWA

- `public/manifest.webmanifest` defines name, icons, theme color (`cream`), display `standalone`.
- A minimal service worker may cache the app **shell** (HTML/CSS/JS) so the installed app opens instantly. **No offline writes, no queueing, no background sync.** See `docs/final-decisions.md` §7.
- iOS install prompts are handled by a one-time, dismissible in-app hint (not a popup).

---

## 10. Performance Budget

- Largest Contentful Paint (mobile, 4G): **< 1.8s** on landing, **< 2.0s** on app shell.
- JS shipped to client per route: **< 100KB gzipped** for app routes, **< 70KB** for marketing.
- No client component above the fold on marketing.
- Images: `next/image`, AVIF/WebP, lazy below the fold.

---

## 11. Environments

| Env | Domain | Purpose |
|---|---|---|
| Local | `localhost:3000` | Dev |
| Preview | Vercel preview URLs | PR review |
| Production | `monivo.lt`, `app.monivo.lt` | Live |

Secrets only via Vercel env vars. Never commit `.env*`. Never hardcode URLs.

---

## 12. Non-Goals

- No monorepo, no Turborepo, no Nx.
- No GraphQL.
- No microservices.
- No custom backend server.
- No state machines.
- No CSS-in-JS.
- No design-system package — tokens live in `tailwind.config.ts` and that is enough.

When in doubt: **fewer moving parts.**
