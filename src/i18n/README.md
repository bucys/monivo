# i18n

Lightweight LT/EN dictionaries. No external i18n library.

## Files

- `lt.ts` — `Dictionary` type + Lithuanian strings (source of truth for keys)
- `en.ts` — English strings, typed against `Dictionary` (must stay in shape parity with LT)
- `index.ts` — `Locale`, `DEFAULT_LOCALE`, `LOCALE_COOKIE`, `getDictionary`, `isLocale`, `format`
- `server.ts` — `getServerLocale()` and `getT()` for server components
- `locale-provider.tsx` — `LocaleProvider`, `useLocale()`, `useT()` for client components

## Usage

Server component:

```ts
import { getT } from "@/i18n/server";

export default async function Page() {
  const { t } = await getT();
  return <h1>{t.nav.settings}</h1>;
}
```

Client component:

```ts
"use client";
import { useT } from "@/i18n/locale-provider";

export function Pill() {
  const t = useT();
  return <span>{t.common.save}</span>;
}
```

Interpolation:

```ts
import { format } from "@/i18n";
format(t.settings.subscription.trialDaysLeft, { n: 5 });
```

## Persistence

1. `monivo_locale` cookie (1 year, SameSite=Lax) — authoritative; read by `getServerLocale()`.
2. `localStorage` mirror — fallback only.
3. `<html lang>` is set from the cookie in the root layout to keep SSR + CSR in sync.

There is **no** `profiles.locale` column yet. Add one only when the user has explicitly granted that schema change.

## Adding a new string

1. Add the key + type in `lt.ts` (under `Dictionary`).
2. Add the LT value in the `lt` export.
3. Add the EN value in `en.ts` (TypeScript will fail the build if shape drifts).

## Translation rollout TODO

Don't translate screens in a random order — mixed LT/EN UI looks broken. Roll out one surface at a time:

- [x] Settings / Daugiau
- [ ] Onboarding + auth (`/login`, `/register`, `/onboarding`)
- [ ] Dashboard hero + cards
- [ ] Activity (period pills, kind filters, day labels, row meta)
- [ ] Insights (card titles + empty copy)
- [ ] Services (list + edit forms)
- [ ] Add-entry flow (income/expense forms, sheets)
- [ ] Landing page (`monivo.lt`) — last; copy is marketing-grade and needs review
