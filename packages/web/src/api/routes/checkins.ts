import { Hono } from "hono";
import { and, eq, desc } from "drizzle-orm";
import { db } from "../database";
import { checkins } from "../database/schema";
import { authMiddleware, requireAuth } from "../middleware/auth";

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export const checkinsRoutes = new Hono()
  .use("*", authMiddleware, requireAuth)
  .get("/", async (c) => {
    const user = c.get("user")!;
    const rows = await db
      .select()
      .from(checkins)
      .where(eq(checkins.userId, user.id))
      .orderBy(desc(checkins.date));
    return c.json({ checkins: rows }, 200);
  })
  .get("/today", async (c) => {
    const user = c.get("user")!;
    const today = isoDate(new Date());
    const [row] = await db
      .select()
      .from(checkins)
      .where(and(eq(checkins.userId, user.id), eq(checkins.date, today)));
    return c.json({ checkin: row ?? null }, 200);
  })
  .post("/", async (c) => {
    const user = c.get("user")!;
    const body = await c.req.json();
    const date = body.date ?? isoDate(new Date());

    const [existing] = await db
      .select()
      .from(checkins)
      .where(and(eq(checkins.userId, user.id), eq(checkins.date, date)));

    if (existing) {
      const [updated] = await db
        .update(checkins)
        .set({
          mood: body.mood ?? existing.mood,
          energy: body.energy ?? existing.energy,
          sleepRating: body.sleepRating ?? existing.sleepRating,
          cyclePhase: body.cyclePhase ?? existing.cyclePhase,
          notes: body.notes ?? existing.notes,
          updatedAt: new Date(),
        })
        .where(eq(checkins.id, existing.id))
        .returning();
      return c.json({ checkin: updated }, 200);
    }

    const [created] = await db
      .insert(checkins)
      .values({
        userId: user.id,
        date,
        mood: body.mood ?? null,
        energy: body.energy ?? null,
        sleepRating: body.sleepRating ?? null,
        cyclePhase: body.cyclePhase ?? null,
        notes: body.notes ?? null,
      })
      .returning();
    return c.json({ checkin: created }, 201);
  });
