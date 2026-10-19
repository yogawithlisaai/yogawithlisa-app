-- MindShift Phase 2 — consent, preferences, and an allowlisted practice schema.
--
-- Additive and non-destructive: `practice_logs.style` and `.mood` are left exactly as they
-- are. New `style_v2` / `moods` columns are added alongside them and backfilled with a
-- one-time, exact (case-insensitive) match against the allowlists below — nothing is
-- reinterpreted or guessed. Any row that doesn't match stays NULL / '{}' in the new
-- columns, with the original free-text value still readable in the untouched old column.
-- Dropping the old columns is a separate, later decision — not part of this migration.

-- --- Consent acceptance (one row per user) ---
create table public.consents (
  id bigint generated always as identity primary key,
  user_id uuid not null unique references auth.users (id) on delete cascade,
  version text not null,
  accepted_at timestamptz not null default now()
);

alter table public.consents enable row level security;

create policy "own consents" on public.consents
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- --- Account preferences (one row per user) ---
-- Reminder scheduling (time/timezone/phone) already lives in reminder_optins — not duplicated here.
create table public.preferences (
  id bigint generated always as identity primary key,
  user_id uuid not null unique references auth.users (id) on delete cascade,
  display_name text,
  pronouns text,
  focus text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.preferences enable row level security;

create policy "own preferences" on public.preferences
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- --- practice_logs: allowlisted style + moods, additive ---

alter table public.practice_logs add column style_v2 text
  check (style_v2 is null or style_v2 in (
    'Vinyasa', 'Hatha', 'Yin', 'Restorative', 'Gentle Flow', 'Power',
    'Chair Yoga', 'Prenatal', 'Ashtanga', 'Breathwork', 'Meditation'
  ));

alter table public.practice_logs add column moods text[] not null default '{}'
  check (moods <@ array[
    'Grounded', 'Calm', 'Joyful', 'Confident', 'Focused', 'Energized',
    'Tired', 'Stressed', 'Anxious', 'Stuck', 'Overwhelmed'
  ]::text[])
  check (array_length(moods, 1) is null or array_length(moods, 1) <= 8);

-- One-time backfill: exact, case-insensitive match only. Anything that doesn't match the
-- allowlist is left out — the original `style` / `mood` value is still sitting right there,
-- untouched, for manual review.

update public.practice_logs set style_v2 = case lower(trim(style))
  when 'vinyasa' then 'Vinyasa'
  when 'hatha' then 'Hatha'
  when 'yin' then 'Yin'
  when 'restorative' then 'Restorative'
  when 'gentle flow' then 'Gentle Flow'
  when 'power' then 'Power'
  when 'chair yoga' then 'Chair Yoga'
  when 'prenatal' then 'Prenatal'
  when 'ashtanga' then 'Ashtanga'
  when 'breathwork' then 'Breathwork'
  when 'meditation' then 'Meditation'
  else null
end
where style is not null;

-- `mood` has been used as a single free-text field, including comma-joined multi-word
-- entries (e.g. "grounded, focused, confident"). Split on commas and map each word
-- independently; unmatched words are simply omitted from the array, not guessed at.
update public.practice_logs set moods = coalesce((
  select array_agg(canon order by ord)
  from (
    select ord, case trim(word)
      when 'grounded' then 'Grounded'
      when 'calm' then 'Calm'
      when 'joyful' then 'Joyful'
      when 'confident' then 'Confident'
      when 'focused' then 'Focused'
      when 'energized' then 'Energized'
      when 'tired' then 'Tired'
      when 'stressed' then 'Stressed'
      when 'anxious' then 'Anxious'
      when 'stuck' then 'Stuck'
      when 'overwhelmed' then 'Overwhelmed'
      else null
    end as canon
    from unnest(string_to_array(lower(mood), ',')) with ordinal as t(word, ord)
  ) mapped
  where canon is not null
), '{}'::text[])
where mood is not null;
