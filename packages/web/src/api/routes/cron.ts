import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { db } from "../database";
import { reminderOptins } from "../database/schema";
import { sendReminderSms } from "../lib/twilio";

/**
 * Public cron endpoint for triggering daily SMS reminders. Protect with CRON_SECRET.
 * Wire this up to an external scheduler (Vercel Cron, GitHub Actions cron, cron-job.org, etc.)
 * — see README "Reminders / Scheduling" for setup. Sends to every opted-in user whose
 * preferredTime hour matches the current UTC hour (simple version; refine per-timezone as needed).
 */
export const cronRoutes = new Hono().post("/reminders/send-daily", async (c) => {
  const secret = c.req.header("x-cron-secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const optins = await db.select().from(reminderOptins).where(eq(reminderOptins.optedIn, true));
  const currentHour = new Date().getUTCHours();

  const results = [];
  for (const row of optins) {
    if (!row.phone) continue;
    const preferredHour = Number(row.preferredTime?.split(":")[0] ?? 18);
    if (preferredHour !== currentHour) continue;
    const result = await sendReminderSms(row.phone);
    results.push({ userId: row.userId, ...result });
  }

  return c.json({ sent: results.length, results }, 200);
});
