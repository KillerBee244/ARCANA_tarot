-- ============================================================
-- ARCANA CELESTIAL ARCHIVE — VISITOR LOGS TABLE
-- Run this script in the Supabase SQL Editor to set up tracking.
-- ============================================================

create table if not exists public.visitors (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  visitor_name text not null,
  entered_at timestamptz default now(),
  completed_at timestamptz,
  status text default 'entered',
  question text,
  category text,
  spread_type text,
  cards jsonb,
  ai_title text,
  ai_overview text,
  ip text,
  user_agent text
);

-- Index for speedy queries on session and entered date
create index if not exists idx_visitors_session_id on public.visitors(session_id);
create index if not exists idx_visitors_entered_at on public.visitors(entered_at desc);

-- Enable Row Level Security (RLS)
alter table public.visitors enable row level security;

-- Policy to allow anonymous insert and select with anon key
create policy "Allow anon insert to visitors"
  on public.visitors
  for insert
  with check (true);

create policy "Allow anon update to visitors"
  on public.visitors
  for update
  using (true);

create policy "Allow anon read to visitors"
  on public.visitors
  for select
  using (true);
