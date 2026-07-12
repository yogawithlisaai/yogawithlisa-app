# Yoga with Lisa

A full-stack yoga wellness web app: on-demand classes, recipes, an AI practice tracker
("MindShift"), a daily wellness check-in dashboard, booking with Lisa, and SMS practice reminders.

> **⭐ Next.js + Supabase version (Vercel-ready):** the app has been rebuilt on
> **Next.js 14 + Supabase + Tailwind CSS** in [`nextjs/`](./nextjs/README.md) — a 1:1 functional
> port that deploys to Vercel (set the project's Root Directory to `nextjs`). The original
> Bun + Vite + Hono app below is kept intact for reference.

> **A note on the stack.** This project was requested as Next.js + Vercel + Supabase, but it's
> built on Runable's managed full-stack template instead: **Bun + Vite + React (frontend) + Hono
> (API) + Drizzle ORM + SQLite (via Turso/libSQL)**. Functionally it's a 1:1 match —
> Supabase Auth → **Better Auth** (email/password), Supabase Postgres → **Drizzle + SQLite**,
> and everything still deploys as a normal Node app and pushes to GitHub like any other project.
> The one real difference: **GitHub Pages can only host static files, not a backend/database/API**,
> so this app can't be deployed there as-is. Use Runable's built-in publish flow, or any Node
> host (Railway, Render, Fly.io, a VPS, etc.) — see "Deploying" below. GitHub is still perfectly
> fine as your source-control / version-history home.

## Stack

- **Frontend:** React 19 + Vite + Tailwind CSS 4 + Wouter (routing) + TanStack Query
- **Backend:** Hono (API routes under `/api/*`), served from the same Vite dev server / same Node
  process in production
- **Database:** SQLite via Drizzle ORM (hosted on Turso/libSQL)
- **Auth:** Better Auth, email/password
- **AI:** Vercel AI SDK against an Anthropic Claude model (`claude-sonnet-4.6`) via an AI gateway
- **SMS:** Twilio REST API (directly, no SDK dependency)
- **Booking:** Calendly embed (`react-calendly`)

**Repo:** https://github.com/yogawithlisaai/yogawithlisa-app

## Project layout

```
packages/web/
  src/api/                  Hono API
    auth.ts                 Better Auth config
    database/schema.ts      Drizzle schema — re-exports auth tables + MindShift's table, defines
                             check-ins & reminder opt-ins directly
    mindshift/              MindShift feature module — fully standalone, see its own README.md.
                             Nothing outside this folder imports from inside it except the one
                             `.route("/mindshift", ...)` line in api/index.ts.
    routes/                 checkins, reminders, cron (everything except MindShift)
    lib/twilio.ts            Twilio SMS sender (stubbed until credentials are set)
  src/web/                  React frontend
    features/mindshift/     MindShift feature module (frontend half) — see its own README.md.
                             `<MindShiftDashboard />` has no dependency on this app's page chrome.
    pages/                  home, classes, recipes, wellness, mindshift, book, reminders, sign-in/up
                             (pages/mindshift.tsx is a ~20-line wrapper around the feature module)
    data/classes.json        Class library content — edit this to add/change classes
    data/recipes.json        Recipe library content — edit this to add/change recipes
    public/recipes/*.png     Recipe photos (community-submitted placeholders)
```

## Content you can edit yourself

### Classes — `packages/web/src/web/data/classes.json`
Grouped into categories (e.g. "Featured Free Series", "Vinyasa Flow", "Yin & Restorative"). Each
video has `title`, `description`, `videoId`, `platform` (`youtube` or `vimeo`), `durationMinutes`,
`level`, `style`, `tags`, `format` (`vertical` or `horizontal`), `free`, and `featured`. All
`videoId`s currently point to a placeholder public-domain video (Big Buck Bunny) so the players
work out of the box — swap in your real YouTube/Vimeo IDs any time. The `featured: true` items in
the "Featured Free Series" category power the vertical 9:16 free series block on the Classes page.

### Recipes — `packages/web/src/web/data/recipes.json`
Each recipe has `title`, `photo` (path under `/public/recipes`), `tags` (used for filtering —
`vegan`, `gluten-free`, etc.), `description`, `ingredients`, and `steps`. Photos currently reuse
10 community-submitted photos from `public/recipes/` — add your own images to that folder and
point new recipes at them.

## Environment variables

Copy `.env.example` to `.env` and fill in the values (never commit `.env`).

| Variable | Purpose |
|---|---|
| `DATABASE_URL` / `DATABASE_AUTH_TOKEN` | Turso/libSQL database connection |
| `BETTER_AUTH_SECRET` | Auth signing secret |
| `WEBSITE_URL` | Public URL of the deployed app (used for auth callbacks) |
| `AI_GATEWAY_BASE_URL` / `AI_GATEWAY_API_KEY` | AI gateway for MindShift (Claude) |
| `S3_*` | S3-compatible storage (Tigris) — only needed if you add file uploads later |
| `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_FROM_NUMBER` | SMS reminders — see below |
| `CRON_SECRET` | Shared secret to protect the daily reminder cron endpoint |

## MindShift (AI practice tracker) — built as a standalone-ready module

MindShift is deliberately isolated from the rest of the app so it can be lifted into another
project on its own:

- **Backend:** `packages/web/src/api/mindshift/` — owns its one DB table (`practice_logs`), the
  streak calculation, the 3 agent tools (`logPractice`, `getRecentActivity`, `suggestClasses`), the
  Claude agent, and a Hono route factory `createMindShiftRoutes({ authMiddleware, requireAuth, deps })`.
  Mounted in `api/index.ts` via a single `.route("/mindshift", createMindShiftRoutes(...))` call.
  Exposes `GET/POST /api/mindshift/logs`, `DELETE /api/mindshift/logs/:id`, `POST /api/mindshift/chat`.
- **Frontend:** `packages/web/src/web/features/mindshift/` — `<MindShiftDashboard />` is the entire
  stat cards + practice history + chat UI, with zero dependency on this app's nav/footer/auth-guard.
  `pages/mindshift.tsx` is just a thin wrapper adding this app's page chrome around it.
- **The only coupling to the rest of the app:** a `classCatalog` array (for class recommendations)
  passed in at mount time, and an optional `getRecentWellnessSignals` hook for pulling in check-in
  data from the Wellness Dashboard feature. Both are injected via a `deps` object — omit either one
  and MindShift still works, just without that extra context.

**Full extraction instructions live in each module's own README**:
`packages/web/src/api/mindshift/README.md` and `packages/web/src/web/features/mindshift/README.md`.

Streaks (`currentStreak`, `longestStreak`, `totalDays`) are computed by the pure `computeStreaks()`
function in `mindshift/streaks.ts` from the set of distinct practice dates.

## Wellness Dashboard

`/wellness` is a daily check-in (mood, energy 1-5, sleep 1-5, cycle/menopause phase, notes),
upserted once per day per user (`checkins` table). A simple rule-based recommendation engine
(`recommendationFor` in `pages/wellness.tsx`) suggests a class style based on the check-in — you
can make this smarter later by routing it through MindShift instead. Strava / Apple Health / Oura
Ring are shown as "coming soon" placeholder cards, ready for real integrations later.

## Booking

`/book` shows the 4 requested categories (in-person group classes, private sessions, corporate
wellness, retreats) plus a discovery call, each currently pointing at the same Calendly link
(`https://calendly.com/contact-yogawithlisa/30min`) via an inline embed (`react-calendly`). To give
each category its own calendar, create separate Calendly event types and update the `categories`
array in `packages/web/src/web/pages/book.tsx`.

## SMS Reminders

Opt-in UI lives at `/reminders` (phone number, opt-in checkbox with consent language, preferred
time). Until `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_FROM_NUMBER` are set, sends are
**simulated** — they're logged to the server console instead of actually sent, so you can build and
test the full flow before connecting a real Twilio account.

**Setting up Twilio:**
1. Create a Twilio account and buy/verify a phone number capable of SMS.
2. Add `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` to `.env`.
3. Set a `CRON_SECRET` value.

**Scheduling the daily send:** there's no built-in cron in this sandbox/template, so wire up an
external scheduler to call the app once an hour (it only actually messages users whose preferred
hour matches):

```
POST https://<your-deployed-url>/api/cron/reminders/send-daily
Header: x-cron-secret: <your CRON_SECRET>
```

Any of these work well:
- **GitHub Actions** scheduled workflow (`on: schedule`) that does a `curl` to the endpoint hourly.
- **cron-job.org** or similar free hosted cron pointed at the endpoint.
- Your host's own cron/scheduled-jobs feature, if it has one.

## Auth

Email/password only, via Better Auth. Sessions are bearer-token based (stored in `localStorage`)
so the app works correctly even when embedded in an iframe/preview. Protected pages (`/mindshift`,
`/wellness`, `/reminders`) redirect to `/sign-in` if there's no session.

## Local development

```bash
bun install
cp .env.example .env   # fill in the values
cd packages/web && bun run db:push   # push the schema to your database
cd ../..
bun run dev             # starts the web app (Vite + Hono) on port 4200
```

Visit `http://localhost:4200`.

## Deploying

This is a standard Node-compatible app (Bun runtime) with a SQLite-compatible database (Turso) —
deploy it to any Node host:

- **Runable** — use the built-in publish flow from this workspace (recommended, zero extra config).
- **Railway / Render / Fly.io / a VPS** — set the environment variables above, run `bun install`,
  `bun run build`, then start the server (`bun run start` or your host's process manager).
- **Vercel** — possible, but Vercel is optimized for Next.js; you'd deploy this as a general
  Node/Bun app rather than using Next-specific features. Not the default recommendation here.
- **GitHub Pages** — not possible for the API/auth/database parts of this app. Use GitHub purely
  for source control (`git push` to a repo) and deploy the running app elsewhere.

## Database commands

```bash
cd packages/web
bun run db:push        # push schema changes to the database
bun run db:generate     # generate migration files
bun run db:studio       # open Drizzle Studio (visual DB browser)
```
