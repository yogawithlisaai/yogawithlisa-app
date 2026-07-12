-- Yoga with Lisa — initial schema
-- Run via `supabase db push` or paste into the Supabase SQL editor.
-- Auth users live in Supabase's built-in auth.users table (replaces Better Auth's user table).

-- --- MindShift practice logs ---
create table public.practice_logs (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  class_title text,
  style text,
  duration_minutes integer,
  mood text, -- e.g. calm, energized, stressed, tired, anxious, joyful
  notes text,
  source text not null default 'manual', -- manual | ai
  created_at timestamptz not null default now()
);

create index practice_logs_user_date_idx on public.practice_logs (user_id, date desc);

-- --- Wellness daily check-ins (one per user per day, upserted) ---
create table public.checkins (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  mood text,
  energy integer, -- 1-5
  sleep_rating integer, -- 1-5
  cycle_phase text, -- menstrual, follicular, ovulation, luteal, perimenopause, menopause, not_tracking
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, date)
);

-- --- SMS reminder opt-in (one row per user) ---
create table public.reminder_optins (
  id bigint generated always as identity primary key,
  user_id uuid not null unique references auth.users (id) on delete cascade,
  phone text,
  opted_in boolean not null default false,
  preferred_time text not null default '18:00', -- HH:mm
  timezone text default 'America/New_York',
  last_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- --- Row Level Security: every table is per-user; the reminder cron uses the service role key (bypasses RLS) ---
alter table public.practice_logs enable row level security;
alter table public.checkins enable row level security;
alter table public.reminder_optins enable row level security;

create policy "own practice_logs" on public.practice_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own checkins" on public.checkins
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own reminder_optins" on public.reminder_optins
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
