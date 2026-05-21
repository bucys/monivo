grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on table public.profiles to authenticated;
grant select on table public.profiles to anon;