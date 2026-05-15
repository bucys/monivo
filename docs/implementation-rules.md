# Monivo — Implementation Rules

The purpose of this document is to **prevent chaotic, over-eager, or scope-creeping changes** — especially from AI-assisted coding sessions.

These rules are strict. They override convenience.

---

## 1. The Golden Rules

1. **One concern per change.** UI, data, auth, styling, and infra are separate concerns.
2. **Edit, don't rebuild.** If a working file can be edited, do not replace it.
3. **Touch the minimum.** If a change can be made in 1 file, do not change 3.
4. **Ask before crossing boundaries.** When in doubt, stop and confirm.
5. **No silent assumptions.** Unknown requirements → ask. Never invent.

---

## 2. Scope Boundaries

| Task type | Allowed to modify | Forbidden to modify |
|---|---|---|
| **UI / styling** | Components, Tailwind classes, design tokens | Backend, schema, auth, data queries |
| **Landing page** | `src/app/(landing)/**`, `components/landing/**` | Anything under `(app)/`, schema, auth |
| **App UI** | `src/app/(app)/**`, `components/app/**` | Marketing, schema, auth |
| **Auth** | `lib/supabase/**`, auth routes | Visual design, unrelated UI |
| **Database / schema** | Migrations, `data/queries`, `data/mutations` | UI components, styling |
| **Copy / i18n** | Text strings only | Component structure, layout |
| **Infra / config** | `next.config`, `tailwind.config`, `package.json` (with approval) | Application code |

If a task seems to require modifying both columns, **split it into two tasks.**

---

## 3. Forbidden Behaviors

- ❌ Refactoring "while you're in the file."
- ❌ Renaming variables, files, or components without being asked.
- ❌ Reformatting unrelated code.
- ❌ Replacing one library with another.
- ❌ Adding dependencies without explicit approval.
- ❌ Generating placeholder content where real content is expected.
- ❌ Deleting code that "looks unused" without confirming.
- ❌ Restructuring folders.
- ❌ Pre-building future features ("you'll probably need this later").
- ❌ Adding feature flags, toggles, or A/B harnesses unless asked.

---

## 4. Required Behaviors

- ✅ Before editing, list the files that will change and the reason.
- ✅ Before any change that touches more than ~3 files, **stop and confirm.**
- ✅ Before any schema change, **stop and confirm.**
- ✅ Before installing a package, **stop and confirm.**
- ✅ When unsure about product behavior, re-read `docs/product.md`.
- ✅ When unsure about visual decisions, re-read `docs/design-system.md`.
- ✅ When unsure about flows, re-read `docs/app-flow.md`.

---

## 5. Commit & PR Hygiene

- Commits are **small and purposeful**.
- One concern per commit. One concern per PR.
- Commit messages: lower-case, imperative, no scope-creep.
  - ✅ `add spendable hero card`
  - ✅ `fix tax rate input on iOS keyboard`
  - ❌ `improvements`
  - ❌ `refactor and add features`
- PRs include: what changed, why, and what was deliberately *not* changed.

---

## 6. File Discipline

- A component file owns **one component** (plus its tightly-coupled subparts).
- A page file is a thin composition layer; logic lives in components or `lib/`.
- Server-only code never imports client-only code and vice versa.
- No dead code. If it is commented out, delete it.

---

## 7. Visual Discipline

- All color, spacing, radius, and shadow values come from `tailwind.config.ts` tokens.
- **No raw hex values** in components.
- **No arbitrary Tailwind values** (`text-[#123456]`, `p-[13px]`) without a justification comment.
- One accent per screen. One hero per screen.
- Mobile (375px) is the canonical viewport. Desktop is a stretch goal.

---

## 8. Performance Discipline

- Default to server components.
- A new client component requires a one-line justification ("needs `useState` for sheet open/close").
- No client-side data fetching when a server component can do it.
- No `useEffect` for data loading.
- Images go through `next/image`.

---

## 9. Preferred Claude Code Workflow Examples

### ✅ Good

> "Update the spendable hero card in `src/app/(app)/dashboard/page.tsx` so the number uses the `display` type token. Do not change data fetching or any other component."

> "Add a new `CategoryChip` primitive in `src/components/ui/category-chip.tsx`. Mobile-first, follows `docs/design-system.md`. No new dependencies."

> "In `src/lib/tax/reserve.ts`, change the default tax rate from 15% to a value passed in from the profile. Do not modify any UI."

### ❌ Bad

> "Make the dashboard look better." *(no scope)*

> "Redesign the app." *(violates scope, design direction, and approval rules)*

> "Refactor the components folder while you're at it." *(scope creep)*

> "Add charts to the insights page." *(out of MVP — see `docs/product.md`)*

---

## 10. When in Doubt

The default answer is **stop and ask.** Five seconds of clarification beats an hour of unwinding the wrong change.

A polite "should I also...?" is always welcome.
A surprise refactor is never welcome.
