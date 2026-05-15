# Monivo — Code Style

These are the coding standards for the Monivo codebase. They exist to keep the project **readable, reviewable, and maintainable by a single developer or a small team** — not to satisfy abstract purity goals.

When in doubt: **readable beats clever. Explicit beats abstract.**

---

## 1. Component Design

### Reuse, don't duplicate
- If the same JSX appears in **two** places, leave it. If it appears in **three**, extract a component.
- Before writing a new component, check `components/ui/` and `components/app/` (or `components/landing/`) for an existing primitive.
- Never copy-paste a card, button, input, or layout block between pages.

### Keep components small and focused
- A component does **one thing**.
- Target: **under 120 lines** per component file.
- If a component renders more than ~3 logical sections, it is probably 2+ components in disguise.

### Composition over monoliths
- Build screens by composing small components — never with one giant `Page` that owns everything.
- Pass children, not options, when a component needs flexibility:
  ```tsx
  // good
  <Card><CardHeader>…</CardHeader><CardBody>…</CardBody></Card>

  // bad
  <Card header="…" body="…" footerType="primary" showDivider />
  ```

### Separate UI from logic
- Presentational components receive data via props and render. They do not fetch, mutate, or know about Supabase.
- Business logic lives in `lib/`, `data/`, hooks, or server actions.
- A component file should rarely import `@/lib/supabase/*`.

### No god components
- A `Dashboard` component that owns data fetching, layout, formatting, and 5 modals is a god component. Split it.
- Symptoms: more than ~6 `useState` calls, more than ~3 `useEffect` calls, or more than ~10 props.

### Avoid large files
- If a file passes ~250 lines, split it — by component, by concern, or by extracting helpers to `lib/`.
- A long file is not "more efficient." It is harder to review.

### No premature abstraction
- Two similar things are not a pattern. Three similar things might be.
- Do not build `<GenericListRenderer />` because you "might need it later."
- Abstractions are extracted **after** the duplication is visible, not before.

---

## 2. React & TypeScript Conventions

### Functional components only
- No class components.
- No `React.Component`, no lifecycle methods.

### Hooks, used sparingly
- Use `useState`, `useEffect`, `useMemo`, `useCallback` only when they earn their place.
- `useMemo`/`useCallback` are not performance pixie dust. Add them only when there is a measurable reason.
- Custom hooks live in `hooks/` and start with `use*`.

### No unnecessary OOP
- No classes for "services," "managers," or "controllers."
- No singletons.
- No inheritance hierarchies. Compose functions and components instead.

### Plain TypeScript types
- Prefer `type` aliases over `interface` unless extending is genuinely needed.
- Co-locate types with the code that uses them; promote to `types/` only when shared across modules.
- Never use `any` unless there is a written one-line reason next to it.
- Avoid `as` casts; prefer narrowing.
- Function signatures are explicit about return types for exported functions.

---

## 3. Naming

- **Components (identifiers)**: `PascalCase`, descriptive, no abbreviations. `SpendableHeroCard`, not `SHC`.
- **Files**: `kebab-case` for **all** files including component files (`spendable-hero-card.tsx`, `tax-reserve.ts`). See `docs/final-decisions.md` §2.
- **Props**: clear, full words. `isOpen`, not `o`. `onSubmit`, not `cb`.
- **Booleans**: prefix with `is`, `has`, `should`, `can`.
- **Event handlers**: prefix with `handle` inside a component, `on` in props.
- **Hooks**: `useTaxReserve`, `useMonthlyTotals`.
- **Helpers**: verbs. `formatCurrency`, `calculateSpendable`.

If a name needs a comment to explain it, rename it.

---

## 4. Styling Rules

### Tailwind is the primary styling method
- All styling goes through Tailwind utility classes.
- No CSS Modules. No styled-components. No Emotion. No inline `style` props except for genuinely dynamic values (e.g., a calculated transform).

### Tokens, not raw values
- All colors, spacings, radii, and shadows come from the design tokens defined in:
  - `tailwind.config.ts` — the source of truth for tokens
  - `app/globals.css` — minimal global resets and CSS variables only
- A runtime token module (e.g. `lib/theme.ts`) is **not** introduced in MVP; tokens live in Tailwind config only.
- **Never** write raw hex values in components: `bg-[#2E5D4A]` ❌ → `bg-accent` ✅
- **Never** write arbitrary one-offs without a comment justifying it: `p-[13px]` ❌

### Reuse the documented design
- All visual decisions follow [`docs/design-system.md`](./design-system.md).
- Use the existing primitives in `components/ui/`: `Button`, `Card`, `Input`, `Sheet`, `Chip`, etc.
- Do **not** restyle these primitives per page. If a variant is needed, add a variant to the primitive.

### Global styles stay minimal
- `app/globals.css` contains: Tailwind directives, font face declarations, CSS variable definitions, and resets. **Nothing else.**
- No utility classes defined in CSS. Use Tailwind's `@layer` only when truly necessary.

### No duplicated component styling
- The same set of Tailwind classes appearing in three places is a missing component.
- Page-level layout (max-widths, paddings) belongs in a shared layout component, not repeated per page.

---

## 5. Folder Structure

```
src/
  app/                      # Next.js routes only — pages, layouts, route handlers
    (landing)/
    (app)/
    api/
  components/
    ui/                     # generic reusable primitives (Button, Card, Input, Sheet)
    landing/                # landing-page-only composed sections
    app/                    # logged-in app composed components
  lib/                      # pure helpers, formatting, math, integrations
    supabase/
    money/
    tax/
    utils/
  hooks/                    # reusable React hooks
  types/                    # shared TypeScript types
  data/                     # server-side queries & mutations (Supabase access)
public/
docs/
```

**Rules:**
- `app/` contains routes, layouts, and `page.tsx` files. Nothing else.
- A component belongs in **exactly one** of `ui/`, `landing/`, or `app/`.
- Marketing components and app components do **not** import each other. Only `ui/` is shared.
- Helpers go in `lib/` even if used once — they are easier to test there.

---

## 6. Data & Logic Rules

### Keep data access out of presentational components
- Components in `components/ui/`, `components/landing/`, `components/app/` should not call Supabase.
- Server components in `app/` fetch via `data/queries/*`.
- Mutations go through server actions in `data/mutations/*`.

### Separate API/server logic from UI
- A `<SpendableCard />` receives a number as a prop. It does not know where the number came from.
- A `<QuickAddSheet />` receives an `onSubmit` callback. It does not know the entry will be written to Supabase.

### Validate at the boundary
- Validate user input where it enters the system — at the server action or route handler, not deep inside a helper.
- Validation can be plain TypeScript guards in MVP. (Zod or similar requires explicit approval.)
- Trust internal code: once data has passed the boundary, do not re-validate at every layer.

### Type all important data
- Domain types (`Entry`, `Profile`, `MonthlyTotals`) live in `types/` or co-located in `data/`.
- Server action inputs and outputs are typed.
- Public component prop types are explicit.

### No `any`
- `any` is forbidden by default.
- If unavoidable (e.g., a third-party type gap), add a one-line comment explaining why and link to the issue or library quirk.
- Prefer `unknown` + narrowing over `any`.

---

## 7. Code Quality

### Readable over clever
- A junior developer should be able to read any file and understand it in one pass.
- No nested ternaries beyond one level.
- No "look how compact" one-liners that hide a branch or a side effect.
- Early returns over deep `if/else` nesting.

### Explicit over magic
- No metaprogramming. No proxies. No dynamic imports unless required.
- No "smart" abstractions where a `switch` statement would do.
- A pattern that needs a paragraph of explanation usually shouldn't exist.

### Comments
- Default: no comments.
- Write a comment only when the **why** is non-obvious — a constraint, a workaround, a non-trivial invariant.
- Never write comments that restate the code.
- Never leave commented-out code. Delete it; Git remembers.

### Files easy to review
- Diffs should be small and focused.
- Don't reformat code you didn't change.
- Don't rename symbols unless that *is* the change.
- One concern per commit. One concern per PR.

---

## 8. After-Change Summary

After making changes, **always summarize**:

1. **What was changed** — one or two sentences in plain language.
2. **Files touched** — list every file modified, created, or deleted.
3. **What was deliberately not changed** — when relevant, to make scope explicit.

Example:

> Added the `SpendableHeroCard` component and used it on the dashboard.
>
> Files:
> - `src/components/app/spendable-hero-card.tsx` (new)
> - `src/app/(app)/dashboard/page.tsx` (edited)
>
> Did not touch: data fetching, tax calculation, design tokens.

This is non-negotiable. It is how every change in the Monivo codebase ends.
