-- Tax profile foundation: IV / VL / Custom modes.
-- Keeps the legacy tax_rate column intact for backward compatibility — the new
-- calculator reads tax_mode + custom_tax_percent / iv_expense_mode / etc.
-- All existing users are mapped into "custom" mode preserving their old %.

alter table public.profiles
  add column if not exists tax_mode text not null default 'custom'
    check (tax_mode in ('iv','vl','custom')),
  add column if not exists iv_expense_mode text not null default 'fixed_30'
    check (iv_expense_mode in ('fixed_30','actual')),
  add column if not exists include_psd boolean not null default true,
  add column if not exists custom_tax_percent numeric(5,2)
    check (custom_tax_percent is null
           or (custom_tax_percent >= 0 and custom_tax_percent <= 60)),
  add column if not exists vl_yearly_cost_cents integer
    check (vl_yearly_cost_cents is null or vl_yearly_cost_cents >= 0),
  add column if not exists vl_valid_until date;

-- Backfill: every existing user keeps their previous behavior.
-- tax_rate is stored as a decimal (e.g. 0.25 = 25%). Convert to percent for
-- the new custom_tax_percent column.
update public.profiles
   set custom_tax_percent = round(coalesce(tax_rate, 0) * 100)::numeric
 where custom_tax_percent is null;
