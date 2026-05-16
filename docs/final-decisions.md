# Monivo — Final Decisions

This document is the **single source of truth** when other docs disagree. It exists to resolve ambiguities found during the pre-scaffold documentation review.

If a contradiction is found between two docs in this repo, the decision recorded here wins, and the offending doc must be updated to match.

Last reviewed: 2026-05-15 (before scaffold).

---

## 1. Folder & Route Naming

| Concern | Decision |
|---|---|
| Marketing surface route group | `src/app/(landing)/` |
| App surface route group | `src/app/(app)/` |
| Marketing components folder | `src/components/landing/` |
| App components folder | `src/components/app/` |
| Shared primitives folder | `src/components/ui/` |
| API route handlers folder | `src/app/api/` — created lazily; **empty in MVP** |

Rationale: "landing" is consistent across routes and components and avoids the term "marketing" leaking into the codebase.

---

## 2. File Naming

**All filenames are `kebab-case`**, including component files.

- ✅ `spendable-hero-card.tsx`
- ✅ `tax-reserve.ts`
- ❌ `SpendableHeroCard.tsx`

Component **identifiers** inside the file remain `PascalCase` (`export function SpendableHeroCard()`).

Rationale: one rule, no case-sensitivity bugs across macOS/Linux, matches the Next.js community default.

---

## 3. Export Conventions

- **Named exports only**, except where Next.js requires a default export.
- The forced exceptions are: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `template.tsx`, `middleware.ts`, `route.ts` handlers.
- No barrel `index.ts` files except for `components/ui/` if it materially improves import ergonomics.

---

## 4. Motion & Animation

- **Framer Motion is approved but is not the default.**
- Default to CSS transitions for hover, focus, button presses, sheet slides, backdrop fades, and color changes.
- Use Framer Motion **only** for: the spendable number count-up on the dashboard hero card.
- No layout animations, no shared-element transitions, no scroll-linked effects in MVP.
- The bottom sheet (`ModalSheet`) uses CSS-only transitions; Framer Motion is not imported by primitives.

---

## 5. Charts

- The product has **exactly one chart**: a single sparkline on the Insights screen showing the last 6 months of spendable.
- The sparkline is rendered as **inline SVG**. No chart library (no Recharts, Chart.js, Visx, Nivo, etc.) is permitted in MVP.

---

## 6. Typography

- Use **Inter** for all weights and sizes, including the display hero number.
- The "Inter Tight" reference in earlier drafts is removed — one typeface only, to reduce font loading overhead and keep visual rhythm consistent.
- All monetary values use `tabular-nums`.

---

## 7. PWA & Offline Behavior (MVP)

- The app is **online-first**. It must be installable as a PWA.
- A minimal service worker may cache the **app shell** (HTML/CSS/JS) so the installed app opens without a network round-trip.
- **No offline writes.** Quick-add requires connectivity in MVP.
- **No background sync, no queueing, no conflict resolution.** These are explicitly post-MVP.
- If the user is offline at submission, the UI shows a calm inline state: *Reikalingas internetas pridėti įrašui.* Submission is disabled, not queued.

This overrides earlier wording in `docs/app-flow.md` and `docs/architecture.md`.

---

## 8. Tax Reserve Semantics

- The user sets **one percentage** during onboarding (0–30%, default 15%).
- This percentage is applied to **gross income** at the moment each income entry is created. The reserved amount is computed, not stored — derivable as `sum(income.amount) * tax_rate`.
- Monivo does **not** split this into VMI / Sodra / VSD / PSD. It is a single opaque "atidėta mokesčiams" line.
- Monivo does **not** track tax payments themselves. Marking taxes as "paid" is post-MVP.

Spendable formula (MVP):

```
spendable = sum(income.amount) - sum(expense.amount) - (sum(income.amount) * tax_rate)
```

Within a selected month, all sums are scoped to that month.

---

## 9. Currency

- MVP is **EUR only**.
- No `currency` column on the profile in MVP.
- All formatting uses `lt-LT` locale + EUR.

Multi-currency is post-MVP and not designed for.

---

## 10. Categories

- Categories are **a small fixed set**, defined in `lib/categories.ts` (or equivalent) once the scaffold lands.
- Categories may be **slightly profession-aware** (e.g., nail artists see "Medžiagos" prominently), but the variation is implemented as a static map keyed by profession — no dynamic category management UI in MVP.
- Settings allows view + reorder + rename. **No add / no delete in MVP.**

---

## 11. Auth in MVP

- Supabase **email + magic link**. No passwords, no social logins.
- Auth UI lives at `app.monivo.lt/login` and `/register`.
- Marketing (`monivo.lt`) never handles credentials.
- Apple / Google sign-in are post-MVP.

---

## 11a. Billing in MVP (resolved 2026-05-17)

- **Provider:** Stripe (Checkout + Customer Portal + webhooks). Paddle
  is no longer in scope.
- **Phase placement:** Phase 6.5, between Auth and App Shell.
- **Trial:** 30 days, no card required at registration (updated
  2026-05-17 from the original 7 days to match habit-based usage by
  beauty professionals). Trial does **not** reset on account delete +
  re-registration with the same email.
- **`past_due` grace:** 7 days from `past_due_since`. Writes allowed
  during grace; account flips to read-only after, independent of
  Stripe's own retry window.
- **Read-only states** (`expired`, `canceled`, post-grace `past_due`)
  retain full view access and CSV export. No data is ever held hostage.
- **One paid tier only at MVP launch.** Annual / promo codes / teams
  are post-MVP.
- Full operational model: `docs/auth-billing.md` (authoritative for
  this topic).

---

## 12. Server Actions vs. API Routes

- **Server actions are the default** for all mutations.
- **API route handlers** (`src/app/api/**`) are used only when a feature genuinely cannot be expressed as a server action (e.g., a Supabase webhook, a third-party callback). MVP has **none of these planned.**
- Client components never call Supabase directly. They invoke a server action or read data passed in by a server component parent.

---

## 13. State Management

- **No global state library** in MVP. No Redux, Zustand, Jotai, Recoil.
- Server state lives on the server.
- Local UI state uses `useState` / `useReducer`.
- The URL is the source of truth for filters (e.g., `?month=2026-05`).

---

## 14. Forms & Validation

- Native `<form>` + server actions. No `react-hook-form` in MVP.
- Validation is plain TypeScript guards at the server-action boundary.
- **Zod is not in MVP.** It can be re-evaluated when schemas grow.

---

## 15. Testing

- **No automated test suite in MVP.** Manual QA against the "Definition of Stable" checklist in `CLAUDE.md` is the bar.
- A testing strategy will be defined when (a) the product has paying users or (b) a regression has actually shipped.
- Type checking (`tsc --noEmit`) and linting (if configured) are the only automated gates.

---

## 16. Insights Computation

- Monthly totals and the plain-language insight are computed in **server components** at request time using simple SQL aggregates against Supabase.
- No background jobs, no materialized views, no caching layer in MVP beyond Next.js defaults.

---

## 17. Performance Budgets (restated, authoritative)

| Route | LCP (mobile, 4G) | Client JS (gzipped) |
|---|---|---|
| `monivo.lt` (landing) | < 1.8s | < 70 KB |
| `app.monivo.lt` (any route) | < 2.0s | < 100 KB |

Above-the-fold marketing content must be a server component.

---

## 18. Documentation Ownership

To eliminate rule duplication going forward:

| Topic | Source of truth |
|---|---|
| Operational rules (how to behave during a session) | `CLAUDE.md` |
| Product scope & non-goals | `docs/product.md` |
| Visual tokens, components, motion | `docs/design-system.md` |
| Tech stack, folders, data model | `docs/architecture.md` |
| Coding standards (naming, types, styling) | `docs/code-style.md` |
| Scope boundaries between concerns | `docs/implementation-rules.md` |
| Landing-page strategy | `docs/landing-page.md` |
| User flows | `docs/app-flow.md` |
| Cross-doc resolutions (this file) | `docs/final-decisions.md` |
| Phase-by-phase build plan | `docs/phase-roadmap.md` |
| Auth, trial & billing model | `docs/auth-billing.md` |

Rules should appear in **one** of these files. Cross-references are fine; restatements are not.

---

## 19. Open Questions (to resolve before relevant phases begin)

These are deliberately unresolved. They do not block scaffolding, but each must be answered before its dependent phase starts.

1. **Default tax rate value** — is 15% the right default for the most common LT self-employment profile, or should onboarding present 3 preset chips (e.g., 5% / 15% / 20%) instead of a slider? *(Resolve before Phase 8 — Onboarding.)*
2. **Profession-aware category map** — exact category list per profession is not yet defined. *(Resolve before Phase 9 — Quick-add.)*
3. **Magic-link branded email template** — copy and visual treatment. *(Resolve before Phase 6 — Auth.)*
4. **Domain & DNS setup** — `monivo.lt` and `app.monivo.lt` ownership and Vercel project layout. *(Resolve before Phase 2 — Scaffold.)*
5. **Analytics** — is any analytics collected in MVP? Default assumption: **no**. *(Confirm before Phase 4 — Landing.)*
6. **Privacy policy & terms** — required for production. *(Resolve before launch.)*
