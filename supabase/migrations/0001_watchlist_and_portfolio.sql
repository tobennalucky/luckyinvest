-- Watchlist: one row per (user, ticker). RLS restricts every operation to
-- the owning user, so users can only ever see/add/remove their own stocks.
create table if not exists public.watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  ticker text not null,
  added_at timestamptz not null default now(),
  unique (user_id, ticker)
);

alter table public.watchlist enable row level security;

create policy "watchlist_select_own" on public.watchlist
  for select using (auth.uid() = user_id);

create policy "watchlist_insert_own" on public.watchlist
  for insert with check (auth.uid() = user_id);

create policy "watchlist_delete_own" on public.watchlist
  for delete using (auth.uid() = user_id);

-- Portfolio holdings: one row per (user, ticker) — re-adding the same
-- ticker updates units/cost basis rather than creating a second lot.
create table if not exists public.portfolio_holdings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  ticker text not null,
  units numeric not null check (units > 0),
  cost_basis numeric,
  purchase_date date,
  created_at timestamptz not null default now(),
  unique (user_id, ticker)
);

alter table public.portfolio_holdings enable row level security;

create policy "holdings_select_own" on public.portfolio_holdings
  for select using (auth.uid() = user_id);

create policy "holdings_insert_own" on public.portfolio_holdings
  for insert with check (auth.uid() = user_id);

create policy "holdings_update_own" on public.portfolio_holdings
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "holdings_delete_own" on public.portfolio_holdings
  for delete using (auth.uid() = user_id);
