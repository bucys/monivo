# Monivo — Deploy Checklist

One Next.js app, two domains:

- `https://monivo.lt` — public landing + legal/contact pages
- `https://app.monivo.lt` — auth + authenticated product

Both domains point to the same Vercel project. Host-based routing in
`src/lib/supabase/middleware.ts` keeps each surface clean.

---

## 1. Vercel — project & domains

1. Create / select the Vercel project for this repo.
2. Add both production domains to the project:
   - `monivo.lt` (apex)
   - `www.monivo.lt` → redirect to `monivo.lt` (Vercel UI option)
   - `app.monivo.lt`
3. DNS at the registrar:
   - `monivo.lt` A record → `76.76.21.21` (Vercel) **or** Vercel-managed.
   - `www` CNAME → `cname.vercel-dns.com.`
   - `app` CNAME → `cname.vercel-dns.com.`
4. Wait for SSL certs to issue (Vercel handles this).
5. Confirm `https://app.monivo.lt` and `https://monivo.lt` both resolve to
   the same deployment.

> No `vercel.json` is required — middleware handles host routing.

## 2. Production environment variables (Vercel → Settings → Environment Variables)

Set for **Production** (and **Preview** with preview-safe values):

| Variable                              | Production value                         |
|---------------------------------------|------------------------------------------|
| `NEXT_PUBLIC_SITE_URL`                | `https://app.monivo.lt`                  |
| `NEXT_PUBLIC_MARKETING_URL`           | `https://monivo.lt`                      |
| `NEXT_PUBLIC_SUPABASE_URL`            | from Supabase project                    |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`| from Supabase project (anon/publishable) |
| `SUPABASE_SERVICE_ROLE_KEY`           | from Supabase project (server-only)      |
| `RESEND_API_KEY`                      | from Resend                              |
| `CONTACT_EMAIL`                       | `hello@monivo.lt` (or chosen inbox)      |
| `CONTACT_FROM` *(optional)*           | `Monivo <hello@monivo.lt>` once domain is verified in Resend |
| `STRIPE_SECRET_KEY` *(when launching)*| live key                                 |
| `STRIPE_WEBHOOK_SECRET` *(when launching)* | from Stripe webhook endpoint        |
| `STRIPE_PRICE_ID` *(when launching)*  | live recurring price id                  |

Notes:
- `NEXT_PUBLIC_*` values are inlined at build time. Changing one requires a
  **redeploy**, not just a server restart.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only. Never prefix it with
  `NEXT_PUBLIC_`.

## 3. Supabase dashboard settings

Authentication → URL Configuration:

- **Site URL:** `https://app.monivo.lt`
- **Redirect URLs (additional):**
  - `https://app.monivo.lt/auth/callback`
  - `http://localhost:3000/auth/callback` *(local dev)*
  - `http://192.168.68.118:3000/auth/callback` *(only if LAN device testing is still in use; otherwise remove)*

Auth → Email templates:
- Confirm signup / magic link templates should send users to
  `{{ .SiteURL }}/auth/callback?...`. The default templates already do this
  once **Site URL** is set correctly.

## 4. Stripe settings (set when un-pausing billing)

- **Checkout success URL:** `https://app.monivo.lt/settings?billing=success`
- **Checkout cancel URL:**  `https://app.monivo.lt/settings?billing=canceled`
- **Billing Portal return URL:** `https://app.monivo.lt/settings`
- **Webhook endpoint:** `https://app.monivo.lt/api/stripe/webhook`
  - Events: `checkout.session.completed`,
    `customer.subscription.created`,
    `customer.subscription.updated`,
    `customer.subscription.deleted`,
    `invoice.payment_succeeded`,
    `invoice.payment_failed`
  - Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

All of these are constructed at runtime from `NEXT_PUBLIC_SITE_URL` (via
`safeOrigin()`), so once that env var is set correctly there are no
hardcoded URLs to change in code.

## 5. Pre-deploy validation

From repo root:

```bash
npm run lint
npm run build
```

Both must pass clean.

## 6. Post-deploy smoke test

On `https://monivo.lt`:
- [ ] Landing renders, language toggle works.
- [ ] CTAs (Register, Login, Pricing) go to `app.monivo.lt/register` and
      `app.monivo.lt/login`.
- [ ] `/privatumas`, `/salygos`, `/kontaktai` render.
- [ ] Contact form sends an email via Resend.
- [ ] Visiting `https://monivo.lt/dashboard` redirects to
      `https://app.monivo.lt/dashboard`.

On `https://app.monivo.lt`:
- [ ] Root `/` redirects: logged out → `/login`, logged in → `/dashboard`.
- [ ] Register flow works; confirmation email lands on
      `app.monivo.lt/auth/callback` and completes session.
- [ ] Login + protected route access works.
- [ ] Visiting `https://app.monivo.lt/privatumas` redirects to
      `https://monivo.lt/privatumas`.
- [ ] Read-only state (after trial / no active sub) gates writes but not
      reads — confirmed already in the Stripe audit.

## 7. Risks / left intentionally untouched

- **Stripe live mode is paused.** Routes, success/cancel/portal/webhook URLs
  and webhook handler are env-driven and ready. No code change needed when
  un-pausing — only env vars + Stripe dashboard settings (§4).
- **`allowedDevOrigins` in `next.config.ts`** keeps a hardcoded LAN IP
  (`192.168.68.118`) for on-device dev testing. It is dev-only (ignored in
  production builds) and intentionally left alone.
- **No `vercel.json` rewrites.** Host routing is done in middleware so dev
  on a single localhost origin keeps working.
- **DB schema unchanged.** Stripe profile columns added previously are
  still tolerated as optional reads.
- **`safeOrigin()` fallback.** Falls back to `NEXT_PUBLIC_SITE_URL` only
  when the inbound host is `0.0.0.0`. Kept as-is — useful for the bind-host
  edge case but otherwise inert in production.
