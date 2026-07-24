-- Notifications shown to the user (currently only "portfolio grew by $10+").
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now(),
  read boolean not null default false
);

alter table public.notifications enable row level security;

create policy "notifications_select_own" on public.notifications
  for select using (auth.uid() = user_id);

create policy "notifications_insert_own" on public.notifications
  for insert with check (auth.uid() = user_id);

create policy "notifications_update_own" on public.notifications
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- One row per user: the portfolio value we last notified them about, so we
-- only fire a new notification once the value climbs another $10 past it.
create table if not exists public.portfolio_baseline (
  user_id uuid primary key references auth.users(id) on delete cascade,
  last_value numeric not null,
  updated_at timestamptz not null default now()
);

alter table public.portfolio_baseline enable row level security;

create policy "baseline_select_own" on public.portfolio_baseline
  for select using (auth.uid() = user_id);

create policy "baseline_insert_own" on public.portfolio_baseline
  for insert with check (auth.uid() = user_id);

create policy "baseline_update_own" on public.portfolio_baseline
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
