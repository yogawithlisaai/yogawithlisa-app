/**
 * Minimal Resend email sender using the REST API directly (no SDK dependency needed).
 * Guarded: if RESEND_API_KEY is not set, it logs instead of sending so the app
 * works end-to-end before real credentials are added.
 */

const FROM = "Lisa from Yoga with Lisa Rose <lisa@yogawithlisarose.com>";

export function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  if (!isResendConfigured()) {
    console.log(`[resend:stub] Would send "${subject}" to ${to}`);
    return { sent: false, simulated: true };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [to],
      subject,
      html,
      reply_to: replyTo,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("[resend] send failed", res.status, errText);
    return { sent: false, simulated: false, error: errText };
  }

  const data = await res.json();
  return { sent: true, simulated: false, id: data.id };
}
