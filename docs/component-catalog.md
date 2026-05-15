# Monivo — Component Catalog

This document defines the **initial UI component system** for Monivo. It exists before any component is written so that the system stays small, consistent, and disciplined.

It complements:
- `docs/design-system.md` — visual tokens (color, type, spacing, motion).
- `docs/code-style.md` — coding standards.
- `docs/final-decisions.md` — resolved ambiguities (kebab-case filenames, named exports, etc.).

When this catalog and those docs disagree, `final-decisions.md` wins; otherwise this catalog is authoritative for component shape and responsibility.

---

## 1. Component Philosophy

Monivo's UI is not a showcase. It is a tool that a tired person uses in ten seconds. Every component decision is judged against that.

**Principles:**

1. **Small and focused.** A component does one thing. If a component's name needs an "and," it is two components.
2. **Composition over configuration.** Five small components composed together always beats one component with twenty props.
3. **Extract on the third occurrence.** Two similar pieces of JSX stay as-is. Three is when the pattern becomes real and an extraction is allowed.
4. **One obvious usage.** Reading a component's name and signature should leave no ambiguity about when to use it. If a developer needs to read source to know which variant to pick, the API is wrong.
5. **Readability over cleverness.** A junior developer must be able to scan a component in one pass.
6. **Consistency over flexibility.** Monivo's identity comes from sameness across screens. Components prefer rigid defaults to flexible options.
7. **No speculative abstractions.** Generic, "future-proof," or "you-might-need-this" components are forbidden. Build the concrete thing; abstract later if real duplication appears.

> Monivo should not become a component playground. The catalog below is intentionally short, and it should stay short.

---

## 2. Primitive Components (`src/components/ui/`)

Primitives are the **shared vocabulary** of the app. Both `(landing)` and `(app)` may use them. They contain no product knowledge — they do not know about income, expenses, taxes, or users.

Each primitive below is a single file under `src/components/ui/`, named in kebab-case (e.g. `button.tsx`).

---

### 2.1 Button

**Purpose.** The universal tappable action.

**Responsibilities.**
- Render a `<button>` (or, when given an `href`-like prop, an `<a>` — TBD when the component is built).
- Apply one of the documented size/intent combinations.
- Handle disabled, loading, and pressed visual states.

**Non-responsibilities.**
- Does **not** open sheets, navigate, or submit forms — its consumers do that.
- Does **not** own any icon-only style; icon-only actions use `FloatingActionButton` or a `ListRow` action.

**Allowed variants.** Exactly three intents and exactly two sizes:

| Intent | Use |
|---|---|
| `primary` | The single dominant action on a screen. |
| `secondary` | Alternative action paired with a primary. |
| `ghost` | Tertiary action; appears as text only. |

| Size | Use |
|---|---|
| `md` (default, 52px tall) | Standard touch-friendly button. |
| `sm` (40px tall) | Inside dense surfaces (settings rows, sheet headers). Used sparingly. |

No `destructive` variant on the primitive. Destructive confirmation buttons use `primary` styled within a confirmation dialog scoped to that flow.

**Interaction notes.**
- Full width on mobile by default; opt out with a layout wrapper, not a prop.
- Pressed state uses opacity + scale, no color shift.
- Loading state replaces the label with a small inline spinner; the button keeps its width to prevent layout jump.

**Visual rules.**
- Radii, colors, weights come from `tailwind.config.ts`. No inline colors.
- One primary button per screen. This is enforced by review, not code.

---

### 2.2 Card

**Purpose.** A surface that groups related content with breathing room.

**Responsibilities.**
- Provide consistent padding, radius, background, and shadow.
- Accept arbitrary children.

**Non-responsibilities.**
- Does **not** define internal layout, headers, footers, or dividers. Compose those with plain JSX or other primitives.
- Does **not** know whether it is the "hero" card.

**Allowed variants.**

| Variant | Use |
|---|---|
| `default` | Standard card with `shadow-card` and `rounded-lg`. |
| `hero` | Used **only** for the spendable hero on the dashboard. `shadow-hero`, `rounded-xl`. |

No `outline`, `flat`, `elevated`, `gradient`, etc.

**Visual rules.** Background is always `bg-white` on a `bg-cream` page. No inner cards inside cards.

---

### 2.3 Input

**Purpose.** A single-line text or numeric input.

**Responsibilities.**
- Render `<input>` with the documented sizing and focus styles.
- Pair with a floating label above the field. No placeholder-only labels.
- Forward refs and `aria-*` attributes.

**Non-responsibilities.**
- No internal validation logic.
- No formatting (currency formatting lives in `lib/money`, not in the input).
- No icon decoration. If a field needs an adornment, build a new composition; do not bloat `Input`.

**Allowed variants.**

| Variant | Use |
|---|---|
| `text` (default) | Standard text entry. |
| `numeric` | Triggers numeric keyboards on mobile, uses tabular numerals. Used in onboarding tax rate; **not** for the quick-add amount entry (which gets its own composed component — see §3). |

**Visual rules.** Height 52px, background `bg-ink-100`, radius `rounded-md`, focus ring `accent` per design system.

---

### 2.4 BottomNav

**Purpose.** Fixed mobile navigation bar.

**Responsibilities.**
- Render exactly three items: Home, Activity, Insights.
- Respect bottom safe-area inset.
- Highlight the active route.

**Non-responsibilities.**
- Does **not** host the FAB. The FAB is a sibling element positioned absolutely; the nav must not know it exists.
- Does **not** render Settings — Settings is reached from the header avatar.

**Allowed variants.** None. There is one bottom nav.

**Interaction notes.** Active item: filled icon + `ink-900` label. Inactive: outline icon + `ink-500` label. No animations beyond color/fill swap.

---

### 2.5 FloatingActionButton

**Purpose.** The single, persistent quick-add entry point.

**Responsibilities.**
- Render a 64px circular button that floats over the bottom nav.
- Position itself with bottom safe-area awareness.
- Emit a tap event.

**Non-responsibilities.**
- Does **not** open the quick-add sheet itself; its parent wires that.
- Does **not** support multiple instances. There is exactly one FAB in the entire app.

**Allowed variants.** None.

**Visual rules.** `bg-accent`, `shadow-fab`, plus icon centered. Pressed state uses gentle scale-down (`active:scale-95`).

---

### 2.6 ModalSheet

**Purpose.** Bottom-sheet container for any modal interaction.

**Responsibilities.**
- Slide up from the bottom of the screen.
- Provide a dimmed backdrop that dismisses on tap.
- Trap focus while open.
- Respect bottom safe-area.
- Be swipe-down dismissable on touch.

**Non-responsibilities.**
- Does **not** know its contents. Quick-add, entry detail, month picker — all are children.
- Does **not** stack. Only one sheet is open at a time. If a flow seems to require two, redesign the flow.

**Allowed variants.** None. Height is content-driven, capped at ~85% viewport height.

**Interaction notes.** Slide and backdrop fade implemented with Framer Motion (the only primitive that uses it — see `final-decisions.md` §4). Reduced-motion users get instant open/close.

---

### 2.7 ListRow

**Purpose.** A single row in a vertical list.

**Responsibilities.**
- Render leading slot, primary text, secondary text, trailing slot.
- Provide tap target ≥ 48px.
- Provide an optional pressed state when interactive.

**Non-responsibilities.**
- Does **not** know whether it represents an entry, a setting, or a category.
- Does **not** group itself; grouping (day headers, sectioning) is done by the parent.

**Allowed variants.**

| Variant | Use |
|---|---|
| `static` | Display-only row. |
| `interactive` | Tappable row, shows pressed state. |

No swipe-to-delete on the primitive. Swipe behavior, if ever introduced, is a composed component, not a variant.

---

### 2.8 StatCard

**Purpose.** A compact display of one label + one value, used in horizontal rows.

**Responsibilities.**
- Render a small label (caption) and a single numeric value.
- Use tabular numerals for the value.
- Sit comfortably three-across at mobile widths.

**Non-responsibilities.**
- Does **not** display trends, deltas, or icons in MVP.
- Does **not** become a chart container.

**Allowed variants.** None. If a value needs more treatment, it is a different component (e.g., `SpendableHeroCard`).

---

### 2.9 SectionHeader

**Purpose.** Consistent heading for a content section inside a screen.

**Responsibilities.**
- Render a title (`h2` token) and an optional trailing action slot.

**Non-responsibilities.**
- Does **not** render screen titles — those are part of the screen's own layout/header.
- Does **not** carry breadcrumbs, descriptions, or filters.

**Allowed variants.** None.

---

### 2.10 Chip

**Purpose.** A small, tappable pill used for presets and selections.

**Responsibilities.**
- Render label text inside a pill with the documented radius and padding.
- Support selected/unselected visual states.
- Be reachable as a tap target ≥ 40px effective area (padding around the pill).

**Non-responsibilities.**
- Does **not** know what it represents (amount preset, category, profession). The parent maps data to chips.
- Does **not** support icons in MVP.

**Allowed variants.**

| Variant | Use |
|---|---|
| `default` | Standard chip on `cream` or `white`. |
| `selected` | Filled with `accent-soft`, text in `accent`. |

---

### 2.11 SegmentedControl

**Purpose.** Two- or three-option mutually exclusive picker, iOS-style.

**Responsibilities.**
- Render a small horizontal track with equal-width options.
- Indicate the selected option with a sliding (or fading) indicator.
- Be keyboard accessible.

**Non-responsibilities.**
- Does **not** carry more than 3 options. Anything beyond 3 should be a `ModalSheet` picker.
- Does **not** disable individual options in MVP.

**Allowed variants.** None.

---

## 3. Composition Components (Product Layer)

Composition components live in `src/components/app/` or `src/components/landing/`. They **compose primitives** to express Monivo-specific UI. They are not reusable outside the surface they belong to.

These are not part of a design system in the abstract sense. They are part of *this product*.

---

### 3.1 SpendableHeroCard (`components/app/`)

The single hero element on the dashboard.

**Composes:** `Card` (variant `hero`).
**Renders:** label "Gali išleisti", a large display-scale number with tabular numerals, and a small breakdown subline.
**Behavior:** the number animates with a gentle count-up on change (Framer Motion).
**Owns:** formatting (via `lib/money`) and the count-up. Does **not** fetch data — the page passes the value in.

---

### 3.2 QuickAddSheet (`components/app/`)

The bottom-sheet flow for adding an income or expense.

**Composes:** `ModalSheet`, `SegmentedControl` (Income / Expense), numeric keypad input (specialized — see §3.3), `Chip` row (amount presets), `Chip` row (categories), `Button` (primary, full-width).
**Behavior:** controlled by its parent for open/close; emits a typed payload via `onSubmit`. Does **not** call Supabase directly — the page wires the server action.
**Out of scope:** date picker (default = today; long-press behavior is a stretch goal), recurring entries.

---

### 3.3 AmountKeypadInput (`components/app/`)

A specialized numeric input used inside `QuickAddSheet` only.

**Why a dedicated component:** the regular `Input` is wrong for this — the field is the visual centerpiece of the sheet, uses display-scale typography, and triggers the numeric keyboard. Bundling these concerns into the generic `Input` would explode its API. Treating it as a composed component keeps `Input` minimal.

**Composes:** raw `<input inputMode="decimal">` styled with display tokens.
**Owns:** display formatting only. No persistence, no validation beyond input mode.

---

### 3.4 IncomeQuickButton (`components/app/`)

Optional shortcut button used during onboarding to add the user's first entry. Wraps `Button` with a fixed label and an `onClick` that opens `QuickAddSheet` in income mode.

This is a thin wrapper and only exists because the onboarding flow calls for it. If it ever appears in only one place, inline it.

---

### 3.5 ActivityTimeline (`components/app/`)

The chronological list on the Activity screen.

**Composes:** day-grouped `SectionHeader` + `ListRow` (interactive).
**Owns:** grouping by day, rendering of date headers. Receives a flat list of entries from the page.
**Does not own:** the entry detail sheet (that is a separate composition).

---

### 3.6 MonthlyInsightCard (`components/app/`)

The Insights screen's primary unit.

**Composes:** `Card`, `StatCard` row, and an inline-SVG sparkline (the only chart in the product — see `final-decisions.md` §5).
**Owns:** rendering the breakdown numbers, the sparkline path computation, and the single plain-language insight sentence.
**Does not own:** data fetching.

---

### 3.7 Landing compositions (`components/landing/`)

The landing page has its own composition layer. These are not reusable in `(app)`:

- `LandingHero`
- `LandingProblem`
- `LandingPromise`
- `LandingHowItWorks`
- `LandingAudience`
- `LandingNotMonivo`
- `LandingClosing`
- `LandingFooter`

Each corresponds to a section in `docs/landing-page.md`. They compose primitives (`Button`, `Card`, type tokens) and are never imported by app routes.

---

## 4. Forbidden Patterns

The following will be rejected on review.

- **Mega-configurable components.** A `Button` with 10 props (`variant`, `tone`, `elevation`, `rounded`, `pulse`, `iconPosition`, etc.). Split or remove instead.
- **Variant explosions.** More than the documented intents/sizes per primitive. New variants require explicit approval and an entry in this catalog.
- **Deeply nested prop APIs.** Objects of objects passed as configuration (`<Card config={{ header: { layout: …, slots: … } }} />`). Use children and composition.
- **Inline styling.** No `style={{ color: '#...' }}`, no arbitrary Tailwind values like `text-[#2E5D4A]` or `p-[13px]`. All visual decisions come from tokens.
- **Duplicate components with different names.** `IconButton`, `CircleButton`, `RoundActionButton` for the same thing. Pick one or compose.
- **Component-per-animation.** No `FadeIn`, `SlideUp`, `Pulse` wrapper components. Apply motion at the call site or inside the one component that genuinely needs it.
- **Visual experimentation outside design tokens.** New colors, shadows, radii, or type sizes require a token addition in `tailwind.config.ts` and an update to `design-system.md`. No one-off values in components.
- **Speculative components.** "We might need a `<Modal>` later." Build it when the need is real.
- **Wrapper-of-wrapper-of-wrapper.** A primitive that wraps another primitive that wraps a native element with no new behavior. Inline it.
- **Business logic inside primitives.** A `Button` that knows about auth state. A `Card` that fetches. Move logic out.

---

## 5. Variant Rules

Variants are a controlled resource. They are added deliberately, not opportunistically.

**Add a variant when:**
- The new appearance reflects a **semantic** difference (e.g., `primary` vs. `secondary` represents action hierarchy).
- The same component will be reused in two or more places with that difference.
- The variant cannot be expressed as composition with another primitive.

**Do not add a variant when:**
- The need is one-off.
- The difference is purely cosmetic.
- The variant is named after its visuals (`large-green-floating`) rather than its purpose.

**Prefer composition.** A "hero button with an icon and a subtitle" is not a Button variant — it is a screen-specific composition that *uses* a Button.

**Avoid:**

```
<Button variant="hero-green-large-floating-soft" />
```

**Prefer:**

```
<Button intent="primary" size="md">Pridėti</Button>
```

If a designer asks for a new variant, the answer is "show me where it appears more than twice and what semantic role it plays." If that question is hard to answer, the variant is not ready.

---

## 6. Ownership Rules

| Layer | Folder | May import from | May not import from |
|---|---|---|---|
| Primitives | `components/ui/` | `lib/`, `types/` | Anything in `components/app/`, `components/landing/`, `data/`, `@supabase/*` |
| App compositions | `components/app/` | `components/ui/`, `lib/`, `hooks/`, `types/` | `components/landing/`, `data/`, `@supabase/*` |
| Landing compositions | `components/landing/` | `components/ui/`, `lib/`, `types/` | `components/app/`, `data/`, `@supabase/*` |
| Routes | `app/(landing)/**`, `app/(app)/**` | Everything appropriate to their surface, plus `data/` (server only) | — |

**Hard rules:**

- **No component imports Supabase.** Data flows in through props from a server component, or through `onSubmit`-style callbacks that wrap server actions.
- **No component owns business logic.** Tax math is in `lib/tax`. Currency formatting is in `lib/money`. Components render the result.
- **No component performs validation.** Validation lives at the server-action boundary (`final-decisions.md` §14).
- **Primitives never depend on app or landing code.** If they do, the dependency is wrong.

---

## 7. Mobile Rules

Monivo is built mobile-first. Every component must be designed for a 375px viewport in portrait, held in one hand.

- **Tap targets ≥ 48 × 48px.** Smaller hit areas are bugs.
- **Bottom safe-area aware.** Anything fixed to the bottom (BottomNav, FAB, ModalSheet, sticky CTAs) respects `env(safe-area-inset-bottom)`.
- **Top safe-area aware** for headers under the iOS notch.
- **Thumb-zone priority.** Primary actions live in the lower half of the screen. Destructive or rare actions can sit higher.
- **One-handed reachability.** Test by mocking a right-thumb arc on a 6.1" device. If the primary action requires reaching, redesign.
- **Minimal typing.** Prefer presets, chips, sliders, and numeric keypads. Text inputs are a last resort outside notes.
- **No hover-only affordances.** Anything that only reveals on hover is invisible on touch.
- **Long-press is never required for a primary action.** Long-press is a power-user shortcut at most.
- **Keyboard appearance.** Use `inputMode="decimal"` for money, default for notes, `email` for the magic-link field. Never the wrong keyboard.
- **No fixed widths.** Components must flex from 320px upward without horizontal scroll.

---

## 8. Naming Conventions

These supplement `docs/code-style.md`.

- **Filenames:** kebab-case for everything, including component files. `spendable-hero-card.tsx`, not `SpendableHeroCard.tsx`.
- **Identifiers:** PascalCase. `export function SpendableHeroCard()`.
- **Prop interfaces:** `SpendableHeroCardProps`. Not `IProps`, not `Props` alone.
- **Boolean props:** `is*`, `has*`, `should*`, `can*`. Never `flag`, `toggle`, `mode` for booleans.
- **Event props:** `on*` in props (`onSubmit`); `handle*` for internal handlers (`handleSubmit`).
- **Avoid vague names.** `Box`, `Wrapper`, `Container`, `Item`, `Element`, `Section1` — all forbidden. A component name describes what it represents, not where it sits.
- **Avoid visual-only names.** `GreenButton`, `LargeCard`, `SmallSheet` — forbidden. Name by purpose (`PrimaryButton` is fine; `GreenButton` is not).
- **Avoid duplicates with renames.** If you find yourself naming `Card2`, `CardV2`, `NewCard`, stop. Either evolve the original or compose.

---

## 9. Future Components (Post-MVP — Not to Be Built)

This section exists to **document what is intentionally absent** so it does not get built by accident.

The following are **not** part of MVP and must not be scaffolded:

- **Charts of any kind beyond the single Insights sparkline.** No pie, no bar, no area, no donut.
- **Recurring-entry builder.** Repeats, schedules, cron-like UI — all post-MVP.
- **Receipt scanner.** Camera capture and OCR.
- **Calendar heatmap.** Per-day income visualizations.
- **Onboarding coach marks / tutorial overlays.** The product is meant to be self-evident.
- **Advanced filters.** Multi-field, saved, or combinable filters on the activity screen.
- **Category management UI.** Add / delete categories.
- **Notification components.** Toast notifications beyond the simple undo toast already specified; in-app banners; push notification UI.
- **Empty-state library.** A single, intentional empty state is built per screen as needed. No reusable abstraction.
- **Data tables.** Sortable, paginated, virtualised tables.
- **Dark mode tokens or theme switcher.**

When any of the above is genuinely needed, it will be re-evaluated and added to a future revision of this catalog with its own specification — not scaffolded preemptively.

---

## 10. Catalog Maintenance

- This document is updated **whenever a new primitive or composition is approved**. The catalog is not a wishlist; entries appear here only after a decision has been made to build them.
- Removed components must be removed from this catalog in the same PR.
- If a primitive grows beyond its documented responsibilities, **the catalog is wrong, the component is wrong, or both**. Fix the misalignment before the next PR.

## Visual Weight Rules

- One primary visual focus per screen.
- Hero components should dominate visually.
- Secondary information must visually recede.
- Avoid multiple competing cards with equal emphasis.
- Typography hierarchy should carry most of the layout clarity.
- Decorative UI should never compete with financial information.

## Interaction Philosophy

Interactions should:
- confirm
- reassure
- reduce friction

Interactions should not:
- entertain
- surprise
- distract

Animations are functional feedback, not decoration.