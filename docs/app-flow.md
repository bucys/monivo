# Monivo — App Flow (`app.monivo.lt`)

Every flow is designed for **one hand, 10 seconds, minimum typing**.

If a flow takes more than three taps to complete a core action, the flow is wrong.

---

## 1. Global Principles

- **Thumb-zone first.** Primary actions live in the lower half of the screen.
- **One screen, one job.** Never split a single decision across two screens.
- **Numeric keypads** for any money input — never the alphanumeric keyboard.
- **Presets over typing.** Common amounts and categories appear as taps.
- **Optimistic UI.** Entries appear instantly; sync happens in the background.
- **No confirmation dialogs** for reversible actions. Use a 5-second undo toast instead.
- **Lithuanian copy** throughout. Date/number formatting per `lt-LT`.

---

## 2. Onboarding Flow

Goal: get the user from sign-up to seeing their first spendable number in **under 60 seconds**.

```
1. Welcome screen
   - One line: "Pagaliau aišku kiek lieka."
   - CTA: Pradėti

2. Email (magic link)
   - Single input, large numeric-ready button
   - Sends magic link, opens app on click

3. Profession (optional, one tap)
   - 5 chips: Nagai · Blakstienos · Kosmetologija · Plaukai · Kita
   - Used only for soft personalization; skippable

4. Tax reserve setup
   - Headline: "Kiek atidėti mokesčiams?"
   - Single percentage input (0–30%, default 15%) — control style (slider vs. preset chips) is an open question in `docs/final-decisions.md` §19.
   - One-line explanation in plain Lithuanian: this is a single reserve %, not a tax calculation.
   - CTA: Tęsti

   Tax math (MVP): one user-defined percentage applied to gross income. No split between VMI / Sodra / VSD / PSD. See `docs/final-decisions.md` §8.

5. Optional first entry
   - "Ar turi šios dienos pajamų?"
   - Opens quick-add sheet, or Skip → dashboard

6. Dashboard
```

Rules:
- No passwords. No social logins in MVP.
- No tutorial overlays. No coach marks. The product should be self-evident.
- Profession and tax rate can both be changed later in Settings — never block onboarding to be precise.

---

## 3. Dashboard Flow (Home)

The single most important screen in the product.

Layout (top to bottom on mobile):
1. Small header: greeting + month switcher (e.g., *Gegužė*).
2. **Spendable hero card** — the biggest element on screen.
   - Label: *Gali išleisti*
   - Value: large `display` number in EUR, tabular nums.
   - Subline: tiny breakdown — *Pajamos €X · Išlaidos €Y · Atidėta €Z*.
3. Three compact stat tiles in one row: Pajamos / Išlaidos / Atidėta mokesčiams.
4. Recent activity preview (3 latest entries, tap → full activity).
5. Bottom nav: Home · Activity · Insights.
6. **FAB** (center-bottom): plus icon → opens quick-add sheet.

Rules:
- The hero card never shows a negative number in red. If spendable is negative, it shows in `ink-900` with a small, calm caption ("Šį mėnesį viršyta").
- The month switcher uses a sheet picker, not a dropdown.
- Pull-to-refresh is supported but optional — data is already live.

---

## 4. Quick-Add Flow (The Core Loop)

This is the flow that must take **under 10 seconds**.

Trigger: tap the FAB from anywhere.

```
1. Bottom sheet appears
   - Two large segmented tabs at the top: Pajamos | Išlaidos
   - Default tab: Pajamos
   - Below: large numeric keypad-style input, pre-focused
   - Below: row of preset amount chips (€20, €30, €50, €80, €120 — adjustable later)
   - Below: optional category chips (4–6 max, profession-aware)
   - Below: optional note field (collapsed by default, tap to expand)
   - Primary CTA full-width: "Pridėti"

2. On submit
   - Sheet dismisses with a soft slide-down
   - Spendable number animates to its new value (≤ 400ms count-up)
   - A subtle toast appears: "Pridėta · Atšaukti" (5s)
```

Rules:
- Amount input is the only required field.
- Tab switching does **not** clear the amount — let the user fix a tab mistake instantly.
- No date picker by default — entry is dated *today*. Long-press the date label to change.
- Category is optional and never required.
- Payment method (`Grynais · Kortele · Pavedimu`) **is** tracked in MVP, defaulting to `Grynais`. Stored on `income_entries.payment_method`.

---

## 5. Activity Flow

Goal: scan, search, and edit past entries without friction.

Layout:
1. Header: month switcher (same control as dashboard).
2. Summary strip: Pajamos · Išlaidos · Atidėta · Liko.
3. Chronological list, grouped by day:
   - Day header (e.g., *Pirmadienis · 12 geg.*).
   - Entries: amount (income green / expense terracotta), category, optional note, time.
4. Tap an entry → detail sheet with Edit / Delete.
5. Bottom nav remains visible; FAB remains accessible.

Rules:
- No charts here. Insights live on their own tab.
- Infinite scroll within a month; switching months replaces the list.
- Search is **not** in MVP. Filtering by month is enough.
- Deleting an entry shows the same 5-second undo toast.

---

## 6. Insights Flow

The calmest screen in the app. One scrollable column.

Sections (top to bottom):
1. **Month headline** — *Gegužė 2026*.
2. **Spendable for the month** — large number, same treatment as dashboard hero but contextual to the selected month.
3. **Breakdown card** — three rows: Pajamos, Išlaidos, Atidėta mokesčiams. Plain numbers, no pie chart.
4. **A single trend line** — last 6 months of spendable, drawn as a soft inline-SVG sparkline. No axes, no tooltips. No chart library — see `docs/final-decisions.md` §5.
5. **One sentence of plain-language insight** — e.g., *"Šį mėnesį uždirbai daugiau nei balandį."* (Generated server-side from simple comparisons, not ML.)
6. Month switcher at the bottom to navigate.

Rules:
- **No more than one chart** ever.
- No category pie. No bar racing. No "income vs. expense" stacked area.
- If a metric cannot be explained in one Lithuanian sentence, it does not belong here.

---

## 7. Settings Flow

Accessed via the **Nustatymai** tab in the bottom navigation (4-tab layout).

Sections:
1. **Profilis** — name (optional), profession chip, email.
2. **Mokesčiai** — tax reserve %, with the same slider used in onboarding.
3. **Kategorijos** — view default categories; reorder; rename. No deletion in MVP.
4. **Aplikacija** — language (LT default), about, version.
5. **Paskyra** — log out, delete account.

Rules:
- Every setting saves on change. No "Save" button.
- Destructive actions (delete account) are the only place a confirmation dialog appears.
- No theme switcher in MVP. Light mode only.

---

## 8. Edge Cases & Error States

- **Offline:** the installed PWA shell still opens (cached HTML/CSS/JS), but MVP is online-first: quick-add submission is **disabled** while offline and shows a calm inline message *Reikalingas internetas pridėti įrašui.* No queueing, no background sync — these are post-MVP. See `docs/final-decisions.md` §7.
- **Empty state (first session):** dashboard shows a calm illustration and the line *"Pridėk pirmas pajamas, kad pamatytum, kiek lieka."* The FAB pulses once.
- **Negative spendable:** shown calmly, not in red. Caption explains.
- **Network errors on submit:** entry stays optimistic, retries silently, surfaces a quiet inline toast only after repeated failure.

---

## 9. Mobile-First Interaction Rules

- All primary actions are reachable with the right thumb on a 6.1" device.
- Sheets, not modals. Sheets slide from the bottom and dismiss with a swipe-down.
- Tap targets ≥ 48 × 48px.
- Safe-area insets respected on iOS (notch and home indicator).
- No hover states required for functionality.
- Long-press is **never** required for primary actions — only for power-user shortcuts (e.g., change entry date).
- Keyboard appearance: numeric for amounts, default for notes only.

---

## 10. The 10-Second Test

Any time a flow is changed, run this test mentally:

> *Can a tired nail artist, holding her phone in one hand at 8pm, add an income entry and see her updated spendable number in under 10 seconds?*

If the answer is no, the flow regresses and the change is rejected.
