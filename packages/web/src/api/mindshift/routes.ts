import { Hono } from "hono";
import type { MiddlewareHandler } from "hono";
import { and, eq, desc } from "drizzle-orm";
import { createAgentUIStreamResponse } from "ai";
import { db } from "../database";
import { practiceLogs } from "./schema";
import { computeStreaks } from "./streaks";
import { buildMindShiftAgent } from "./agent";
import type { MindShiftDeps } from "./types";

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export type MindShiftRouteOptions = {
  /** Populates `c.get("user")` from the request — required so routes know who's calling. */
  authMiddleware: MiddlewareHandler;
  /** Rejects unauthenticated requests with 401. */
  requireAuth: MiddlewareHandler;
  /** Optional cross-feature context (class catalog, wellness signals) — see ./types.ts. */
  deps?: MindShiftDeps;
};

/**
 * Self-contained MindShift API: practice log CRUD + streaks, and the AI chat endpoint.
 * Mount anywhere, e.g. `.route("/mindshift", createMindShiftRoutes({ authMiddleware, requireAuth }))`.
 *
 * The only things this needs from the host app are the two auth middlewares (any Better Auth /
 * session-based setup works) and a Drizzle `db` + `practiceLogs` table (both owned by this module).
 */
export function createMindShiftRoutes({ authMiddleware, requireAuth, deps = {} }: MindShiftRouteOptions) {
  return new Hono()
    .use("*", authMiddleware, requireAuth)
    .get("/logs", async (c) => {
      const user = c.get("user")!;
      const logs = await db
        .select()
        .from(practiceLogs)
        .where(eq(practiceLogs.userId, user.id))
        .orderBy(desc(practiceLogs.date), desc(practiceLogs.createdAt));
      const streaks = computeStreaks(logs.map((l) => l.date));
      return c.json({ logs, streaks }, 200);
    })
    .post("/logs", async (c) => {
      const user = c.get("user")!;
      const body = await c.req.json();
      const [log] = await db
        .insert(practiceLogs)
        .values({
          userId: user.id,
          date: body.date ?? isoDate(new Date()),
          classTitle: body.classTitle ?? null,
          style: body.style ?? null,
          durationMinutes: body.durationMinutes ?? null,
          mood: body.mood ?? null,
          notes: body.notes ?? null,
          source: body.source ?? "manual",
        })
        .returning();
      return c.json({ log }, 201);
    })
    .delete("/logs/:id", async (c) => {
      const user = c.get("user")!;
      const id = Number(c.req.param("id"));
      await db.delete(practiceLogs).where(and(eq(practiceLogs.id, id), eq(practiceLogs.userId, user.id)));
      return c.json({ ok: true }, 200);
    })
    .post("/chat", async (c) => {
      const user = c.get("user")!;
      const { messages } = await c.req.json();
      const agent = buildMindShiftAgent(user.id, deps);
      return createAgentUIStreamResponse({ agent, uiMessages: messages });
    });
}
