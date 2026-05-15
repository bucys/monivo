# Monivo — Design System

This document defines the visual language. Anything not specified here defaults to Tailwind base values. Anything that contradicts this document is wrong.

---

## 1. Visual Direction

Monivo looks like the intersection of:

- **Apple Wallet** — single hero number, layered cards, restraint.
- **iOS Health** — soft color, calm motion, generous spacing.
- **A premium beauty studio** — warm neutrals, soft contrast, expensive whitespace.
- **Calm fintech** — Monzo's clarity, Revolut's confidence, none of their density.

It should feel like **soft luxury** — quiet, premium, considered.

---

## 2. Color Palette

### Neutrals (foundation)
| Token | Hex | Usage |
|---|---|---|
| `ink-900` | `#1A1A1A` | Primary text |
| `ink-700` | `#3D3D3D` | Secondary text |
| `ink-500` | `#7A7A7A` | Tertiary text, icons |
| `ink-300` | `#C9C9C9` | Borders, dividers |
| `ink-100` | `#EFEDE9` | Subtle backgrounds |
| `cream`   | `#F7F4EF` | App background |
| `white`   | `#FFFFFF` | Card surfaces |

### Accent (one, used sparingly)
| Token | Hex | Usage |
|---|---|---|
| `accent` | `#2E5D4A` | Primary action, spendable highlight |
| `accent-soft` | `#E6EFEA` | Accent backgrounds, chips |

### Semantic
| Token | Hex | Usage |
|---|---|---|
| `income` | `#2E5D4A` | Income amounts (matches accent) |
| `expense` | `#8A4A3B` | Expense amounts (muted terracotta) |
| `reserve` | `#9A8654` | Tax reserve (muted gold) |
| `danger` | `#A6463A` | Destructive confirmation only |

**Rules:**
- No more than **one accent** on screen at a time.
- Red is reserved for destructive actions, never for negative balances.
- Never use pure black (`#000`) or pure white grayscale gradients.

---

## 3. Typography

**Typeface:** Inter for everything (display, body, captions). System fallback `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`. One typeface only — see `docs/final-decisions.md` §6.

| Token | Size / Line / Weight | Usage |
|---|---|---|
| `display` | 56 / 60 / 600 | Spendable hero number |
| `h1` | 28 / 34 / 600 | Page titles |
| `h2` | 20 / 26 / 600 | Section titles |
| `body` | 16 / 24 / 400 | Default body |
| `body-strong` | 16 / 24 / 600 | Emphasis |
| `caption` | 13 / 18 / 500 | Labels, metadata |
| `mono-num` | tabular-nums | All currency values |

**Rules:**
- All monetary values use tabular numerals.
- No more than 2 type sizes per screen section.
- Never center long text. Center only single-line hero values.

---

## 4. Spacing System

Base unit: **4px**. Use only these steps:

`4, 8, 12, 16, 20, 24, 32, 40, 56, 80`

- Default screen padding: **20px** horizontal.
- Default card padding: **20px**.
- Vertical rhythm between sections: **32px**.
- Tap target minimum: **48 × 48px**.

---

## 5. Border Radius

| Token | Value | Usage |
|---|---|---|
| `r-sm` | 10px | Chips, small inputs |
| `r-md` | 16px | Buttons, inputs |
| `r-lg` | 24px | Cards |
| `r-xl` | 32px | Hero card, sheets |
| `r-full` | 9999px | FAB, avatars |

Soft, generous corners everywhere. Never sharp.

---

## 6. Shadows

Soft, low, never dark.

| Token | Value | Usage |
|---|---|---|
| `shadow-card` | `0 1px 2px rgba(26,26,26,0.04), 0 8px 24px rgba(26,26,26,0.04)` | Default card |
| `shadow-hero` | `0 2px 4px rgba(26,26,26,0.05), 0 16px 40px rgba(26,26,26,0.06)` | Spendable card |
| `shadow-fab` | `0 6px 20px rgba(46,93,74,0.25)` | Floating action button |

No inner shadows. No harsh drop shadows.

---

## 7. Buttons

### Primary
- Background: `accent`
- Text: `white`
- Radius: `r-md`
- Height: 52px
- Weight: 600

### Secondary
- Background: `white`
- Border: 1px `ink-300`
- Text: `ink-900`

### Tertiary / Text
- No background, no border.
- Text: `accent` or `ink-700`.

### Destructive
- Used **only** in confirmation dialogs.
- Background: `danger`.

**Rules:**
- One primary button per screen.
- Buttons always span the full width on mobile unless paired in a row.

---

## 8. Cards

- Background: `white`
- Radius: `r-lg`
- Padding: `20px`
- Shadow: `shadow-card`
- Border: none by default

The **spendable hero card** is the only card that uses `shadow-hero` and `r-xl`.

---

## 9. Inputs

- Height: 52px
- Background: `ink-100`
- Radius: `r-md`
- Text: `ink-900`, 18px
- Numeric keypad inputs use **display-scale text** (32–40px) — the user is entering money, the field should feel important.
- Labels float above; no placeholder-only inputs.
- Focus ring: 2px `accent`, 4px `accent-soft` outer.

---

## 10. Bottom Navigation

- Fixed, safe-area aware.
- Height: 64px + bottom safe area.
- Background: `white` with subtle top border `ink-100`.
- **3 items only:** Home, Activity, Insights.
- Settings live behind an avatar/icon in the header, not in the nav.
- Icons: outline by default, filled when active.
- Active state: icon `accent`, label `ink-900`.

---

## 11. Floating Action Button

- The single quick-add entry point.
- Size: 64px.
- Position: bottom-center, overlapping the bottom nav by ~24px.
- Background: `accent`, shadow: `shadow-fab`.
- Icon: a clean plus.
- Tap → opens the quick-add sheet (income / expense choice).

The FAB is the most important element on the home screen after the hero number.

---

## 12. Motion Principles

- **Purposeful, not decorative.** Motion confirms an action; it does not entertain.
- Default duration: **180–240ms**.
- Default easing: `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- Quick-add sheet slides up from bottom, with a subtle backdrop fade.
- Number changes use a gentle count-up (max 400ms).
- No parallax. No bouncy springs on UI chrome. No looping animations.
- Reduced-motion users get instant transitions.

**Implementation:** CSS transitions are the default. Framer Motion is reserved for the bottom-sheet slide and the count-up number (see `docs/final-decisions.md` §4). No other animation libraries.

---

## 13. UI Philosophy

### DO
- Lots of whitespace.
- Large touch targets.
- Soft premium visuals.
- One hero element per screen.
- Emotional clarity over information density.
- Lithuanian copy that sounds like a calm friend, not a bank.

### DO NOT
- Crypto aesthetics (no neon, no glowing gradients).
- Enterprise dashboards (no KPI walls).
- Dense analytics or multiple charts per screen.
- Tables. Anywhere. Use cards or lists.
- Multiple competing accent colors.
- Generic Material Design components.
- Accounting software vibes (no ledgers, no double-entry language).
- Gamification (no streaks, badges, or "great job!" messaging).
