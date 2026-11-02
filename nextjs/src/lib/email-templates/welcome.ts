const SITE_URL = "https://app.yogawithlisa.ai";

/**
 * One-time welcome email, sent after a new user confirms their account.
 * Deliberately excludes any practice, mood, or health data — first name only.
 */
export function buildWelcomeEmail(firstName: string) {
  const subject = `Welcome to Yoga with Lisa Rose, ${firstName}`;

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${subject}</title>
  </head>
  <body style="margin:0; padding:0; background-color:#faf8f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf8f5; padding:48px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:520px;" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding-bottom:40px;">
                <span style="font-family:Georgia,'Times New Roman',serif; font-style:italic; font-size:22px; color:#111111; text-transform:lowercase; letter-spacing:0.02em;">yoga with lisa rose</span>
              </td>
            </tr>
            <tr>
              <td style="background-color:#ffffff; border-radius:20px; padding:48px 40px;">
                <h1 style="margin:0 0 24px; font-family:Georgia,'Times New Roman',serif; font-weight:500; font-size:28px; line-height:1.3; color:#111111;">
                  Welcome, <em style="font-style:italic;">${firstName}</em>
                </h1>

                <p style="margin:0 0 20px; font-size:15px; line-height:1.7; color:rgba(17,17,17,0.72);">
                  Welcome to Yoga with Lisa Rose. I'm so happy you're here.
                </p>

                <p style="margin:0 0 20px; font-size:15px; line-height:1.7; color:rgba(17,17,17,0.72);">
                  This community is built on one simple idea: yoga should fit into your life, not the other way around. You shouldn't have to rearrange your whole week to make time for your practice. Your practice should meet you where you are, whether that's ten minutes before work or a long, slow flow on a Sunday.
                </p>

                <p style="margin:0 0 12px; font-size:15px; line-height:1.7; color:rgba(17,17,17,0.72);">
                  Here's what's waiting for you, free:
                </p>
                <ul style="margin:0 0 24px; padding-left:20px; font-size:15px; line-height:1.9; color:rgba(17,17,17,0.72);">
                  <li>Classes you can do from anywhere, including the Grounded Mornings series</li>
                  <li>Recipes to nourish your practice</li>
                  <li>Blog posts on movement, breath, and the science of feeling good</li>
                </ul>

                <p style="margin:0 0 32px; font-size:15px; line-height:1.7; color:rgba(17,17,17,0.72);">
                  Thank you for testing MindShift. MindShift is your practice companion. Tell it how you're feeling or what you practiced, and it keeps track of your streaks and suggests classes that fit your day. Over time, we're working on connecting tools like Oura Ring and Apple Health, so MindShift can help you shape a yoga practice that complements your sleep, energy, and everything else you've got going on. Your feedback as an early tester shapes what we build next, so just hit reply anytime.
                </p>

                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border-radius:999px; background-color:#1a1a1a;">
                      <a href="${SITE_URL}/classes#free-1" style="display:inline-block; padding:14px 32px; font-size:13px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:#ffffff; text-decoration:none;">
                        Start your first class
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin:40px 0 0; font-size:15px; line-height:1.7; color:rgba(17,17,17,0.72);">
                  With so much gratitude,<br />
                  Lisa
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-top:32px;">
                <p style="margin:0 0 8px; font-size:12px; line-height:1.6; color:rgba(17,17,17,0.4);">
                  &copy; Yoga with Lisa. All rights reserved.
                </p>
                <p style="margin:0; font-size:12px; line-height:1.6; color:rgba(17,17,17,0.4);">
                  <a href="${SITE_URL}/privacy" style="color:rgba(17,17,17,0.4); text-decoration:underline;">Privacy Policy</a>
                  &nbsp;&middot;&nbsp;
                  <a href="${SITE_URL}/email-preferences" style="color:rgba(17,17,17,0.4); text-decoration:underline;">Email preferences</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, html };
}
