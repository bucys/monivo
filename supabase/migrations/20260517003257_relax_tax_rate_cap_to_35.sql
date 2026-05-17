-- Relax tax_rate cap from 0.30 to 0.35 to align with onboarding UI.
alter table public.profiles
  drop constraint profiles_tax_rate_check;

alter table public.profiles
  add constraint profiles_tax_rate_check
  check (tax_rate >= 0 and tax_rate <= 0.35);

