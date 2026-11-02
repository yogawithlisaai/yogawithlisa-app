import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/resend";
import { buildWelcomeEmail } from "@/lib/email-templates/welcome";

export const dynamic = "force-dynamic";

/**
 * Target for a Supabase Database Webhook on auth.users (UPDATE). Sends the
 * one-time welcome email the moment a user's email transitions from
 * unconfirmed to confirmed. Configured in the Supabase dashboard, not via
 * migration, since the webhook needs a shared secret header.
 */

type AuthUserRow = {
  id: string;
  email: string | null;
  email_confirmed_at: string | null;
  raw_user_meta_data: Record<string, unknown> | null;
};

type WebhookPayload = {
  type: string;
  table: string;
  schema: string;
  record: AuthUserRow;
  old_record: AuthUserRow | null;
};

function isAuthorized(req: Request) {
  const secret = process.env.AUTH_WEBHOOK_SECRET;
  if (!secret) return false;
  return req.headers.get("x-webhook-secret") === secret;
}

function firstNameFrom(record: AuthUserRow) {
  const meta = record.raw_user_meta_data ?? {};
  const name = (meta.name as string | undefined) ?? (meta.full_name as string | undefined) ?? "";
  const first = name.trim().split(/\s+/)[0];
  return first || "friend";
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const payload = (await req.json()) as WebhookPayload;
  const { record, old_record } = payload;

  if (payload.schema !== "auth" || payload.table !== "users" || payload.type !== "UPDATE") {
    return Response.json({ skipped: "not a users update" });
  }

  const justConfirmed = !old_record?.email_confirmed_at && !!record.email_confirmed_at;
  if (!justConfirmed || !record.email) {
    return Response.json({ skipped: "not a confirmation transition" });
  }

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("preferences")
    .select("welcome_email_sent_at")
    .eq("user_id", record.id)
    .maybeSingle();

  if (existing?.welcome_email_sent_at) {
    return Response.json({ skipped: "already sent" });
  }

  const { subject, html } = buildWelcomeEmail(firstNameFrom(record));
  const result = await sendEmail({ to: record.email, subject, html, replyTo: "lisa@yogawithlisarose.com" });

  await supabase
    .from("preferences")
    .upsert({ user_id: record.id, welcome_email_sent_at: new Date().toISOString() }, { onConflict: "user_id" });

  return Response.json({ sent: result.sent, simulated: result.simulated });
}
