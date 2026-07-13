/**
 * Minimal Twilio SMS sender using the REST API directly (no SDK dependency needed).
 * Guarded: if TWILIO_* env vars are not set, it logs instead of sending so the app
 * works end-to-end before real credentials are added.
 */

const REMINDER_MESSAGES = [
  "🌿 Time to check in with yourself. Log today's practice or how you're feeling in Yoga with Lisa.",
  "✨ A few mindful minutes await. Open MindShift to log your practice or do a quick check-in.",
  "🧘 Lisa here (well, her app). How did you move today? Log it and keep your streak alive.",
];

function pickMessage() {
  return REMINDER_MESSAGES[Math.floor(Math.random() * REMINDER_MESSAGES.length)];
}

export function isTwilioConfigured() {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_NUMBER,
  );
}

export async function sendReminderSms(toPhone: string, body?: string) {
  const message = body ?? pickMessage();

  if (!isTwilioConfigured()) {
    console.log(`[twilio:stub] Would send SMS to ${toPhone}: "${message}"`);
    return { sent: false, simulated: true, message };
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID!;
  const authToken = process.env.TWILIO_AUTH_TOKEN!;
  const from = process.env.TWILIO_FROM_NUMBER!;

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ To: toPhone, From: from, Body: message }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("[twilio] send failed", res.status, errText);
    return { sent: false, simulated: false, error: errText };
  }

  const data = await res.json();
  return { sent: true, simulated: false, sid: data.sid };
}
