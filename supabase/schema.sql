-- Run once in the Supabase SQL editor. The browser must use a publishable
-- (or legacy anon) key, NEVER a secret or service_role key.
create table if not exists public.gift_studio_planners (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  revision bigint not null default 1 check (revision > 0),
  updated_at timestamptz not null default now()
);
alter table public.gift_studio_planners enable row level security;
revoke all on public.gift_studio_planners from anon;
grant select, insert, update, delete on public.gift_studio_planners to authenticated;
create policy "Read own planner" on public.gift_studio_planners
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Create own planner" on public.gift_studio_planners
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own planner" on public.gift_studio_planners
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Delete own planner" on public.gift_studio_planners
  for delete to authenticated using ((select auth.uid()) = user_id);
create or replace function public.gift_studio_touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger gift_studio_updated_at before update on public.gift_studio_planners
  for each row execute function public.gift_studio_touch_updated_at();
