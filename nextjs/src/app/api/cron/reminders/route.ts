import { createAdminClient } from "@/lib/supabase/admin";
import { sendReminderSms } from "@/lib/twilio";

export const dynamic = "force-dynamic";

/**
 * Daily SMS reminder cron. Scheduled once daily by Vercel Cron (see vercel.json —
 * Hobby plan supports one run per day), so it messages every opted-in user
 * regardless of their preferred time.
 *
 * Vercel Cron calls GET with `Authorization: Bearer ${CRON_SECRET}`. The POST
 * variant with an `x-cron-secret` header is kept for external schedulers
 * (GitHub Actions, cron-job.org) for parity with the original app.
 */
async function runReminders() {
  const supabase = createAdminClient();
  const { data: optins, error } = await supabase
    .from("reminder_optins")
    .select()
    .eq("opted_in", true);
  if (error) return Response.json({ message: error.message }, { status: 500 });

  const results = [];
  for (const row of optins ?? []) {
    if (!row.phone) continue;
    const result = await sendReminderSms(row.phone);
    results.push({ userId: row.user_id, ...result });
    await supabase
      .from("reminder_optins")
      .update({ last_sent_at: new Date().toISOString() })
      .eq("id", row.id);
  }

  return Response.json({ sent: results.length, results });
}

function isAuthorized(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.get("authorization");
  const headerSecret = req.headers.get("x-cron-secret");
  return auth === `Bearer ${secret}` || headerSecret === secret;
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) return Response.json({ message: "Unauthorized" }, { status: 401 });
  return runReminders();
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) return Response.json({ message: "Unauthorized" }, { status: 401 });
  return runReminders();
}
