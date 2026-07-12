# Yoga with Lisa — Next.js + Supabase

The Yoga with Lisa wellness app rebuilt on **Next.js 14 (App Router) + Supabase + Tailwind CSS**,
deployable to **Vercel**. A 1:1 functional port of the original Bun + Vite + Hono + SQLite app
(which still lives in `../packages/web`):

- **Classes** — on-demand video library (`src/data/classes.json`), filterable by level/style/duration
- **Recipes** — filterable recipe cards with detail modal (`src/data/recipes.json`)
- **MindShift** — AI practice tracker: chat agent (Claude via the Vercel AI SDK) with three tools
  (`logPractice`, `getRecentActivity`, `suggestClasses`), streaks, practice history
- **Wellness Dashboard** — daily mood/energy/sleep/cycle check-in with a rule-based class recommendation
- **Booking** — Calendly inline embed, 5 session categories
- **SMS Reminders** — opt-in UI + Twilio sends, scheduled by Vercel Cron

## Stack mapping (old → new)

| Old | New |
|---|---|
| Bun + Vite + Wouter | Next.js 14 App Router |
| Hono API (`/api/*`) | Next.js Route Handlers (`src/app/api/*`) — same paths & JSON shapes |
| Better Auth (bearer tokens) | Supabase Auth (email/password, cookie sessions via `@supabase/ssr`) |
| Drizzle + SQLite (Turso) | Supabase Postgres + RLS (`supabase/migrations/0001_init.sql`) |
| AI gateway → Claude | `@ai-sdk/anthropic` direct (`ANTHROPIC_API_KEY`), model `claude-sonnet-4-6` |
| External cron scheduler | Vercel Cron (`vercel.json`, hourly) |
| Tailwind 4 CSS tokens | Tailwind 3 + same CSS-variable tokens (`globals.css`), fonts via `next/font` |

## Setup

### 1. Supabase

1. Create a project at [database.new](https://database.new).
2. Run the migration: paste `supabase/migrations/0001_init.sql` into the SQL editor
   (or `supabase link && supabase db push` with the CLI). It creates `practice_logs`,
   `checkins`, `reminder_optins`, all with per-user Row Level Security.
3. **Auth → Providers → Email**: for the same instant sign-in behavior as the old app,
   disable "Confirm email". If you leave it on, the sign-up page tells users to check
   their inbox first — both flows are handled.
4. Copy the Project URL, anon key, and service role key from **Settings → API**.

### 2. Environment

```bash
cp .env.example .env.local   # then fill in the values
```

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only; reminder cron reads all opt-ins (bypasses RLS) |
| `ANTHROPIC_API_KEY` | MindShift chat (Claude) |
| `MINDSHIFT_MODEL` | Optional; defaults to `claude-sonnet-4-6` |
| `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_FROM_NUMBER` | SMS — until set, sends are simulated (logged) |
| `CRON_SECRET` | Protects the cron endpoint; Vercel Cron sends it automatically |

### 3. Local development

```bash
npm install
npm run dev   # http://localhost:3000
```

### 4. Deploy to Vercel

1. Push this repo to GitHub and import it in Vercel.
2. Set **Root Directory** to `nextjs` (Settings → General).
3. Add the environment variables above (Production + Preview).
4. `vercel.json` registers the hourly reminder cron (`0 * * * *` → `/api/cron/reminders`);
   with `CRON_SECRET` set, Vercel calls it with `Authorization: Bearer <secret>`.
   It only actually texts users whose preferred hour matches the current UTC hour.
   (External schedulers can still `POST` with an `x-cron-secret` header instead.)

## Where things live

```
supabase/migrations/0001_init.sql   Schema + RLS (run once per Supabase project)
middleware.ts                       Session refresh + redirects /mindshift, /wellness,
                                    /reminders to /sign-in when signed out
src/app/api/                        Route handlers (same contract as the old Hono API)
src/lib/mindshift/                  Agent tools + streak math (pure computeStreaks())
src/features/mindshift/             MindShift UI module — <MindShiftDashboard /> has no
                                    dependency on this app's nav/footer; portable as before
src/data/classes.json               Edit to add/change classes (videoIds are placeholders)
src/data/recipes.json               Edit to add/change recipes (photos in public/recipes/)
src/app/globals.css                 Brand design tokens (see ../design.md)
```

## Notes on parity

- API responses keep the original camelCase field names (`sleepRating`, `optedIn`,
  `classTitle`, …) via mappers in `src/lib/rows.ts`, so the frontend logic is unchanged.
- The MindShift agent's system prompt, tool set, and 8-step tool loop are ported verbatim;
  the wellness-signals context the old app injected via a `deps` hook now reads the
  `checkins` table directly inside `getRecentActivity`.
- Streak math (`computeStreaks`) is byte-for-byte the original pure function.
