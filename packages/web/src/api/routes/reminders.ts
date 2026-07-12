import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { db } from "../database";
import { reminderOptins } from "../database/schema";
import { authMiddleware, requireAuth } from "../middleware/auth";
import { sendReminderSms } from "../lib/twilio";

export const remindersRoutes = new Hono()
  .use("*", authMiddleware, requireAuth)
  .get("/", async (c) => {
    const user = c.get("user")!;
    const [row] = await db.select().from(reminderOptins).where(eq(reminderOptins.userId, user.id));
    return c.json({ optin: row ?? null }, 200);
  })
  .post("/", async (c) => {
    const user = c.get("user")!;
    const body = await c.req.json();
    const [existing] = await db.select().from(reminderOptins).where(eq(reminderOptins.userId, user.id));

    if (existing) {
      const [updated] = await db
        .update(reminderOptins)
        .set({
          phone: body.phone ?? existing.phone,
          optedIn: body.optedIn ?? existing.optedIn,
          preferredTime: body.preferredTime ?? existing.preferredTime,
          timezone: body.timezone ?? existing.timezone,
          updatedAt: new Date(),
        })
        .where(eq(reminderOptins.id, existing.id))
        .returning();
      return c.json({ optin: updated }, 200);
    }

    const [created] = await db
      .insert(reminderOptins)
      .values({
        userId: user.id,
        phone: body.phone ?? null,
        optedIn: body.optedIn ?? false,
        preferredTime: body.preferredTime ?? "18:00",
        timezone: body.timezone ?? "America/New_York",
      })
      .returning();
    return c.json({ optin: created }, 201);
  })
  .post("/test", async (c) => {
    const user = c.get("user")!;
    const [row] = await db.select().from(reminderOptins).where(eq(reminderOptins.userId, user.id));
    if (!row?.phone || !row.optedIn) {
      return c.json({ message: "No opted-in phone number on file" }, 400);
    }
    const result = await sendReminderSms(row.phone);
    return c.json(result, 200);
  });
