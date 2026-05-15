# Monivo — Project Rules

> Operational rules for every Claude Code task in this repository.
> Detailed standards live in `/docs`. When this file and a doc disagree, the doc wins for its topic (see ownership map in `docs/final-decisions.md` §18). When two docs disagree, `docs/final-decisions.md` is the tiebreaker.
> Inherits from `~/.claude/CLAUDE.md`.

---

## 1. Project Identity

**Monivo** is a mobile-first PWA for Lithuanian self-employed beauty professionals — nail artists, lash artists, cosmetologists, hairdressers, and freelancers.

It helps them:
- track income in seconds
- track expenses without friction
- automatically reserve money for taxes
- see how much money is actually spendable

**Core emotional promise:** *"Pagaliau aišku kiek lieka."*

**Two surfaces:**
- `monivo.lt` — marketing landing page
- `app.monivo.lt` — the actual product

---

## 2. Core Product Philosophy

- Monivo is a **clarity tool**, not an accounting tool.
- One number matters more than any chart: **how much can I spend today?**
- The product must be usable in **under 10 seconds** during a workday.
- Emotional reassurance > feature completeness.
- If a feature creates anxiety, it does not belong in Monivo.

**Monivo is NOT:**
- accounting software
- ERP
- bookkeeping system
- banking app
- booking platform
- a CRM

Do not import patterns or vocabulary from those categories.

---

## 3. UX Philosophy

- **One-handed mobile usage** is the default constraint.
- Minimize typing. Prefer taps, presets, and big numeric keypads.
- Quick-add must be reachable in **1 tap** from anywhere in the app.
- Never block a flow with a modal that the user did not initiate.
- Empty states should feel calm, not promotional.
- Errors are quiet, kind, and recoverable.
- Lithuanian first; English copy must read as a translation, not the source.

---

## 4. Design Philosophy

Tone: premium beauty-studio × calm fintech. References: Apple Wallet, iOS Health, Things 3.
**Full design language lives in `docs/design-system.md`. Do not restate it here or improvise outside it.**

---

## 5. Development Rules (operational)

- **Mobile-first always.** Build at 375px, then scale up.
- **Default stack:** Next.js (App Router), TypeScript, Tailwind, Supabase. Anything else requires approval.
- **Never install a package without explicit permission.**
- **Never change the DB schema without explicit permission.**
- **Never rewrite working logic** to "improve" it unless asked.
- Prefer editing over rebuilding.
- Server components by default; client components only where interaction requires it.

Coding standards (naming, types, exports, styling) are defined in `docs/code-style.md`. Resolved ambiguities are in `docs/final-decisions.md`.

---

## 6. Code Editing Rules

Before any edit:
1. List the files that will change.
2. State the reason in one line.
3. If the change touches more than ~3 files or any schema, **stop and confirm first.**

While editing:
- Keep diffs minimal and reviewable.
- Do not reformat unrelated code.
- Do not rename symbols opportunistically.
- Do not "tidy up" adjacent files.

---

## 7. Scope Control (operational summary)

- UI tasks must not modify backend logic, DB, or auth.
- Backend tasks must not redesign UI.
- Landing page tasks (`monivo.lt`) must not touch the app (`app.monivo.lt`) and vice versa.
- One concern per commit. One concern per PR.

Full scope-boundary matrix and required/forbidden behaviors live in `docs/implementation-rules.md`. If a task seems to require crossing a boundary, **stop and ask.**

---

## 8. Prompt Workflow Recommendations

Good prompts in this repo look like:

- "Edit `src/app/(app)/dashboard/page.tsx` to change the spendable card layout. Do not touch data fetching."
- "Add a new component `IncomeQuickAdd` in `src/components/quick-add/`. Mobile-first. No new packages."
- "Adjust the Tailwind color tokens in `tailwind.config.ts`. Do not touch components."

Avoid open-ended prompts like "make the app better" or "redesign the dashboard" — they violate the scope rules above.

When in doubt, the workflow is:
1. Read the relevant doc in `/docs`.
2. Confirm the scope.
3. Make the smallest possible change.
4. Stop.

---

## 9. Git Workflow Rules

Before starting any **major new phase** or architectural change, create a git commit of the current stable state.

Examples of major phases:
- project setup complete
- design system complete
- landing page complete
- auth implementation complete
- dashboard implementation complete
- database schema stable
- onboarding flow complete

**Commit rules:**
- One logical feature per commit.
- Do not combine unrelated changes.
- Write clear, lower-case, imperative commit messages.
- Avoid massive "update everything" commits.

**Commit message format examples:**
- `setup project documentation foundation`
- `initialize Next.js app foundation`
- `create reusable UI primitives`
- `build landing hero section`
- `implement mobile bottom navigation`
- `create dashboard income summary cards`

**Before risky refactors:** recommend creating a safety commit first.

**After finishing a scoped task**, always summarize:
- what changed
- files touched
- what was intentionally not changed

---

## 10. Phase Discipline

Do not start the next phase until the current phase is **reviewed, stable, and committed**.

**Current development order** (full detail in `docs/phase-roadmap.md`):

1. Documentation foundation
2. Project scaffold
3. Design tokens & UI primitives
4. Landing page
5. Database schema
6. Auth
7. App shell
8. Onboarding
9. Quick-add flow
10. Dashboard
11. Activity flow
12. Insights
13. Polish & optimization

Billing and all other items in `docs/product.md` §9 are **post-MVP** and not part of this sequence.

Do not jump ahead unless explicitly requested.

---

## 11. Definition of Stable

A phase is considered **stable** only if:

- no TypeScript errors
- no console errors
- responsive on mobile
- visually consistent
- no duplicated UI
- no broken imports
- lint passes (if configured)
- no placeholder TODO implementations
- no unfinished partial refactors

**Do not recommend commits for unstable states.**
