# MindShift (frontend feature)

Everything needed to render the MindShift chat + streak dashboard, isolated from this app's page
chrome (nav/footer/auth-guard).

## What's in here
- `mindshift-dashboard.tsx` — `<MindShiftDashboard />`, the whole feature UI (stat cards, practice
  history, chat). This is the one component to drop into a host app.
- `components/` — `StatCard`, `PracticeHistory`, `ChatPanel` (each usable standalone too).
- `hooks/use-practice-logs.ts` — React Query hook for `GET /api/mindshift/logs`.
- `api.ts` — the only file that talks to the network; wraps the typed Hono client scoped to
  `/api/mindshift/*`.

## Dependencies
- `@tanstack/react-query` (a `QueryClientProvider` ancestor — already set up in `main.tsx`).
- `@ai-sdk/react` + `ai` for the chat UI.
- The app's `lib/auth.ts` (`getToken`) and `lib/api.ts` (typed Hono client) — for a bearer token
  and a typed fetch client respectively. If extracting to a host app without these, replace
  `api.ts` with plain `fetch` calls against wherever you mounted `createMindShiftRoutes`.
- Tailwind classes reference this app's brand CSS variables (`--color-dark`, `--color-ink`, etc.)
  — swap those for your own tokens, or the components will just fall back to unstyled defaults.

## Usage

```tsx
import { MindShiftDashboard } from "../features/mindshift";

function MyPage() {
  return (
    <div>
      <h1>MindShift</h1>
      <MindShiftDashboard />
    </div>
  );
}
```

`pages/mindshift.tsx` in this app is a ~20-line wrapper that adds the page header copy, this app's
`PageShell` (nav/footer), and `ProtectedRoute` (redirect-to-sign-in guard) around
`<MindShiftDashboard />` — none of that lives inside the feature folder itself.

## Extracting to a standalone app
1. Copy `packages/web/src/web/features/mindshift/` into the new project.
2. Copy the backend module too — see `packages/web/src/api/mindshift/README.md`.
3. Replace `api.ts`'s Hono client import with your own typed client (or plain `fetch`).
4. Replace the `--color-*` CSS variables referenced in the components with your own theme, or
   restyle them — they're plain Tailwind arbitrary-value classes, not a design system dependency.
