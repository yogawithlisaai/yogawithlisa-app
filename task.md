# Yoga with Lisa — Build Plan

## Stack decisions
- Managed template (Bun/Vite/React/Hono/Drizzle), web only.
- Auth: Better Auth email/password (no social).
- DB: SQLite via Drizzle (Turso local).
- AI: AI SDK gateway, claude-sonnet-4.6, tool-calling for logging practice.
- Booking: Calendly embed (react-calendly inline widget) — same link https://calendly.com/contact-yogawithlisa/30min for all 4 categories + discovery call (documented as placeholder to swap event types later).
- Reminders: Twilio SMS — opt-in stored in DB, send endpoint implemented with twilio SDK guarded by env var presence (logs instead of sending if not configured). Document cron setup in README (no real scheduler available in sandbox).
- Recipes: JSON file `packages/web/src/web/data/recipes.json`, user-editable, images in `public/recipes/`.
- Classes: JSON file `packages/web/src/web/data/classes.json`, YouTube placeholder IDs.

## DB Schema (Drizzle)
- auth tables (generated)
- practice_logs: id, userId, date, classId?, poseNotes, mood, energy, duration, createdAt
- checkins: id, userId, date, mood, energy, sleep, cyclePhase, notes, createdAt
- reminder_optins: id, userId, phone, optedIn, preferredTime, createdAt, updatedAt
- chat_messages persisted via agent optional (skip, keep client-side history + log tool writes to practice_logs)

## Pages (web)
- / Home
- /classes
- /recipes
- /mindshift (chat + dashboard)
- /dashboard (wellness check-in) — could merge into mindshift page as tab, but spec treats separately -> make /wellness
- /book
- /reminders (opt-in settings) — also account/settings
- /sign-in /sign-up

## Build order
1. Schema + auth wiring
2. API routes: checkins, practice-logs (+streak calc), reminder-optins, agent w/ tools
3. Layout/nav/footer + design tokens (tailwind theme, fonts)
4. Home page
5. Classes page + data
6. Recipes page + data
7. Wellness dashboard page
8. MindShift page (chat + history dashboard)
9. Book with Lisa page
10. Reminders opt-in page
11. Auth pages
12. README + .env.example
13. bun run build verification
14. deliver

## Status (updated)
- [x] app_init done, design.md written, recipe photos copied to public/recipes/
- [x] auth wired (Better Auth email/password + bearer), auth-schema generated, db:push done
- [x] schema.ts: practiceLogs, checkins, reminderOptins
- [x] api routes: practice-logs.ts, checkins.ts, reminders.ts, cron.ts, lib/twilio.ts
- [x] agent/gateway.ts, agent/tools.ts (logPractice, getRecentActivity, suggestClasses)
- [x] classes.json data (placeholder videoId aqz-KE-bpKQ everywhere, CC-safe)
- [ ] recipes.json (photos: avocado-mousse, dragonfruit-pancakes, turmeric-tofu-scramble, golden-tofu-scramble, cinnamon-spice-loaf, lemon-olive-oil-cake, vanilla-sesame-loaf, chai-spice-bread, turmeric-carrot-elixir, baked-lentil-bites)
- [ ] agent/index.ts (ToolLoopAgent) + mount all routes in api/index.ts
- [ ] web: lib/auth.ts, lib/api.ts client
- [ ] tailwind theme tokens + fonts
- [ ] nav/footer layout
- [ ] pages: home, classes, recipes, wellness, mindshift, book, reminders, sign-in/up
- [ ] wire routes in app.tsx
- [x] README + .env.example
- [x] bun run build check (clean) + verified live: auth signup/signin, checkins, reminders (simulated twilio), practice-logs, MindShift agent tool-calling (fixed Date serialization bug), Calendly embed live, all pages render per design
- [x] delivered
- [x] Brand v2 applied (superseded by v3 below)
- [x] Brand v3: rebuilt to match live yogawithlisa.ai exactly (fetched real site computed styles) —
      Playfair Display + Inter, white/cream-first layout with dark #1a1a1a bands (not all-dark),
      black pill buttons, warm greige #e3ddd6 nav-on-scroll, dark testimonial-style card pattern.
      Replaced generated placeholders with user's real photos (hero.jpg, founder.jpg). Saved
      durable memory: future AI placeholder people = deep brown skin, black hair up, lean athletic
      build, dark/candlelit/terracotta grading. Verified live via screenshots against reference site.
- [x] Brand v2 applied: Cormorant Garamond + DM Sans, dark #1f1915/taupe #c8bdb1/terracotta #654b36/forest #2e312e/cream #f5f0e8/blush #f2e4e1 palette, pill buttons, no shadows/borders/gradients, generated 3 warm moody portrait placeholder photos (hero/about/section) in public/brand/, nav matches yogawithlisa.ai (transparent-over-hero -> cream on scroll, lowercase serif wordmark, hamburger sheet), all pages + auth + dark cards rebuilt and verified live via screenshots

## Notes
- Calendly (all 4 categories + discovery call): https://calendly.com/contact-yogawithlisa/30min
- Twilio stub until real creds; cron endpoint POST /api/reminders/send-daily guarded by CRON_SECRET
- GitHub Pages can't host backend — README clarifies deploy via Node host, GitHub for source only
