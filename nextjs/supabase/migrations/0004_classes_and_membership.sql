-- Class library + paid membership — additive only, no changes to existing tables.

-- --- Class library (replaces src/data/classes.json as the source of truth) ---
create table public.classes (
  id text primary key,              -- keeps existing slugs like "free-1", "vin-1"
  slug text unique not null,
  title text not null,
  description text,
  length_minutes integer,
  style text,
  level text,
  intensity text,
  body_focus text,
  thumbnail_key text,               -- R2 public bucket key (poster image)
  tags text[] not null default '{}', -- mood/context keywords; used by MindShift's suggestClasses tool
  video_source text not null default 'pending', -- 'pending' | 'r2' | 'youtube' | 'mux'
  video_ref text not null default '', -- r2 object key, YouTube video ID, or Mux playback ID; '' until a real file is uploaded
  is_free boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.classes enable row level security;

-- Metadata only (title/description/thumbnail/etc.) — safe to read for everyone, signed in or not.
-- The video_ref for non-free Mux classes is a playback ID, which is useless without a signed
-- token minted server-side after a membership check (see src/lib/membership.ts) — gating happens
-- in the API route, not in RLS here.
create policy "classes are readable by everyone" on public.classes
  for select using (true);

-- No insert/update/delete policy for anon/authenticated roles: writes only via the service-role
-- client (createAdminClient()), used by scripts/seed-classes.mjs and scripts/add-class.mjs.

-- --- Membership status, synced from Stripe webhooks ---
create table public.subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  stripe_customer_id text not null,
  stripe_subscription_id text,
  status text not null,             -- trialing | active | past_due | canceled | incomplete
  price_id text,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "own subscription" on public.subscriptions
  for select using (auth.uid() = user_id);

-- No insert/update/delete policy for anon/authenticated roles: all writes come from the Stripe
-- webhook (src/app/api/webhooks/stripe/route.ts) via createAdminClient(), same pattern already
-- used by src/app/api/webhooks/auth-confirmed/route.ts.
