# MindShift (backend module)

Self-contained AI practice-tracker feature: a Claude-powered chat agent that logs yoga practice,
computes streaks, and recommends classes — plus the plain CRUD/streaks API it's built on.

## What's in here
- `schema.ts` — the single `practice_logs` table this feature owns.
- `streaks.ts` — `computeStreaks(dates)`, a pure function with zero dependencies.
- `gateway.ts` — AI SDK gateway client (reads `AI_GATEWAY_BASE_URL` / `AI_GATEWAY_API_KEY`).
- `tools.ts` — the 3 agent tools: `logPractice`, `getRecentActivity`, `suggestClasses`.
- `agent.ts` — `buildMindShiftAgent(userId, deps?)`, the Claude tool-loop agent.
- `routes.ts` — `createMindShiftRoutes({ authMiddleware, requireAuth, deps? })`, a Hono sub-app
  exposing `GET/POST /logs`, `DELETE /logs/:id`, `POST /chat`.
- `types.ts` — the `MindShiftDeps` injection interface described below.

## Dependencies

**Hard requirements** (this module owns/needs these directly):
- A Drizzle `db` instance + the `practiceLogs` table (`schema.ts`) pushed to your database.
- `AI_GATEWAY_BASE_URL` / `AI_GATEWAY_API_KEY` env vars (or swap `gateway.ts` for a direct
  Anthropic/OpenAI provider — one file to change).
- Two Hono middlewares passed in at mount time: `authMiddleware` (populates `c.get("user")`) and
  `requireAuth` (401s unauthenticated requests). Any session-based auth works — MindShift doesn't
  care how you authenticate, only that `c.get("user").id` exists.

**Optional, injected via `MindShiftDeps`** (in `types.ts`) — the *only* things coupling MindShift
to the rest of this particular app:
- `classCatalog: ClassCatalogItem[]` — powers the `suggestClasses` tool. Omit it and the tool just
  returns no matches; the chat still works for logging practice and reading streaks.
- `getRecentWellnessSignals(userId)` — an optional hook to pull mood/energy/sleep context from a
  host app's own check-in feature, for richer recommendations. Purely additive.

## Mounting it (as done in this app)

```ts
// packages/web/src/api/index.ts
import { createMindShiftRoutes } from "./mindshift";
import { authMiddleware, requireAuth } from "./middleware/auth";
import classesData from "../web/data/classes.json";

const classCatalog = (classesData as any[]).flatMap((cat) => cat.videos);

const app = new Hono()
  .basePath("api")
  .route(
    "/mindshift",
    createMindShiftRoutes({ authMiddleware, requireAuth, deps: { classCatalog } }),
  );
```

This exposes `POST /api/mindshift/chat`, `GET/POST /api/mindshift/logs`, `DELETE /api/mindshift/logs/:id`.

## Extracting MindShift into its own app/repo

1. Copy this whole `mindshift/` folder into the new project's API package.
2. Make sure the target has: Drizzle + a SQL database, Better Auth (or any auth exposing
   `c.get("user").id`), and `ai` / `@ai-sdk/react` installed.
3. Run `schema.ts`'s table through your migration tool (`drizzle-kit push`/`generate`).
4. Mount `createMindShiftRoutes(...)` as shown above — pass your own `classCatalog` or omit it.
5. On the frontend, copy `packages/web/src/web/features/mindshift/` (see its own README) and point
   its API calls at wherever you mounted the routes.

No other file in this app imports from inside `mindshift/` except the top-level `api/index.ts` —
so removing the folder + that one `.route(...)` line fully removes the feature.
