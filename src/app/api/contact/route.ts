import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { BOOKING_URL, CONTACT_EMAIL } from '@/config/site';

/**
 * Escape a value for interpolation into the HTML email body.
 *
 * Every visitor-supplied string (name, email, WhatsApp number, project
 * type, message) is rendered into the notification email, so each one must
 * be encoded before it reaches the template. Without this, a visitor could
 * close a tag and inject arbitrary markup into an email that arrives
 * looking like it came from this business. The email address regex is not
 * a defence: it permits quotes and angle brackets, and the WhatsApp field
 * and the free-text message have no format restriction at all.
 */
function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Reduce a value to a single safe line for use in a mail header.
 *
 * The subject is plain text rather than HTML, so escaping does not apply.
 * Control characters are stripped instead, which prevents a newline in a
 * field from being read as an additional mail header.
 */
function singleLine(value: unknown): string {
  return String(value ?? '').replace(/[\r\n\t]+/g, ' ').trim();
}

/**
 * The acknowledgement email the visitor receives the moment they submit
 * the form. Kept separate from the notification template so the two can
 * be read independently — one is written for a customer, the other for
 * the business.
 *
 * Plain, short, and honest about when a reply is coming. It confirms
 * what they sent, points them at the booking link, and repeats the one
 * thing the privacy policy already promises: ask to be deleted and they
 * will be.
 */
function buildAcknowledgementEmail({
  name,
  projectType,
  bookingUrl,
}: {
  name: string;
  projectType: string;
  bookingUrl: string;
}) {
  const safeName = escapeHtml(name);
  const safeType = escapeHtml(projectType);
  const safeBooking = escapeHtml(bookingUrl);
  const bookingBlock = bookingUrl
    ? `<a href="${safeBooking}"
         style="display:inline-block;background:#10b981;color:#020617;padding:13px 26px;border-radius:10px;
                font-weight:bold;text-decoration:none;font-size:15px;margin:22px 0 6px;">
         Choose a time
       </a>
       <p style="color:#64748b;font-size:12.5px;margin:0;">
         Skipping that is fine &mdash; I will just reply to this email.
       </p>`
    : '';

  return `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#020617;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#020617;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
             style="max-width:600px;background:#0f172a;border:1px solid #1e293b;border-radius:16px;overflow:hidden;">

        <tr><td style="padding:28px 32px 22px;border-bottom:1px solid #1e293b;">
          <div style="font-size:18px;font-weight:800;color:#f8fafc;letter-spacing:-.01em;">
            Dammie Optimus Solutions
          </div>
          <div style="font-size:12px;color:#94a3b8;letter-spacing:.14em;text-transform:uppercase;margin-top:5px;">
            AI, Web &amp; Mobile Software Engineering
          </div>
        </td></tr>

        <tr><td style="padding:28px 32px 8px;">
          <p style="color:#f8fafc;font-size:19px;font-weight:700;margin:0 0 14px;">
            Thanks, ${safeName} &mdash; your brief is with me.
          </p>
          <p style="color:#cbd5e1;font-size:15px;line-height:1.7;margin:0 0 16px;">
            I read every enquiry myself, and I reply with a real answer rather than a brochure.
            You sent this just now, about:
          </p>
          <div style="background:#020617;border:1px solid #1e293b;border-left:3px solid #10b981;
                      border-radius:10px;padding:16px 18px;margin:0 0 20px;">
            <div style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#34d399;margin-bottom:6px;">
              Project category
            </div>
            <div style="color:#f8fafc;font-size:15px;font-weight:600;">${safeType}</div>
          </div>

          <p style="color:#cbd5e1;font-size:15px;line-height:1.7;margin:0 0 4px;">
            If it is easier, pick a slot on my calendar and we can talk directly:
          </p>
          ${bookingBlock}

          <p style="color:#cbd5e1;font-size:15px;line-height:1.7;margin:22px 0 0;">
            WhatsApp is usually fastest &mdash; it is the number on the site you just used.
          </p>
        </td></tr>

        <tr><td style="padding:24px 32px 30px;">
          <div style="border-top:1px solid #1e293b;padding-top:20px;">
            <p style="color:#94a3b8;font-size:13px;line-height:1.7;margin:0 0 8px;">
              <strong style="color:#cbd5e1;">What happens to this message:</strong> it goes to my
              inbox and nowhere else. No mailing list, no tracking, no database. I keep it for
              12 months so we can work together, and if you would like it deleted before then,
              just reply to this email and say so.
            </p>
            <p style="color:#64748b;font-size:12px;line-height:1.6;margin:14px 0 0;">
              You are receiving this because you used the contact form on
              get-tech-solutions.dammieoptimus.workers.dev. Full details in the
              <a href="https://get-tech-solutions.dammieoptimus.workers.dev/privacy" style="color:#22d3ee;">privacy policy</a>.
            </p>
          </div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`;
}

/**
 * Cloudflare Turnstile verification.
 *
 * Returns 'pass', 'fail', or 'unknown'. The distinction is the whole point.
 *
 * 'fail' means Cloudflare answered and said no: the submission is a bot. That
 * is refused.
 *
 * 'unknown' means we could not ask. The network failed, Turnstile is down, or
 * the secret is missing. In that case the message is allowed through.
 *
 * That asymmetry is deliberate and it is the only defensible choice here. A
 * lead is worth money; a spam message costs a minute of deleting. If the
 * third-party check is unavailable we would be discarding real enquiries over
 * spam we could have filtered anyway, and the failure mode is silent — you
 * would not find out until you noticed the enquiries were not arriving.
 *
 * The alternative, refusing on 'unknown', makes Cloudflare's availability a
 * hard dependency of your entire contact form. During an outage, nobody can
 * reach you at all and there is no error, just silence.
 */
async function verifyTurnstile(
  token: string,
  remoteIp: string,
): Promise<'pass' | 'fail' | 'unknown'> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) {
    console.error('TURNSTILE_SECRET_KEY is not set; cannot verify the spam check.');
    return 'unknown';
  }
  // No token at all means the widget never loaded — usually a blocked script
  // or an ad blocker, not a bot trying its hardest.
  if (!token) return 'unknown';

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, response: token, remoteip: remoteIp }),
      },
    );
    if (!response.ok) {
      console.error('Turnstile siteverify returned', response.status);
      return 'unknown';
    }
    const result = await response.json();
    return result.success === true ? 'pass' : 'fail';
  } catch (error) {
    console.error('Turnstile verification could not be completed:', error);
    return 'unknown';
  }
}

export async function POST(request: Request) {
  // Instantiate per request rather than at module scope. At module scope the
  // constructor throws when the key is missing, which crashed the whole route
  // with an empty 500 (and broke `next build`, since the module is evaluated
  // while collecting page data).
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set in this environment.');
    // The specific cause is logged above for the site owner. The visitor is
    // told something they can act on: telling a potential client that "email
    // delivery is not configured" is confusing and sounds like their fault.
    return NextResponse.json(
      {
        error:
          'Something went wrong on our side and your message did not send. Please WhatsApp me on +234 705 333 1253 and I will pick it up straight away.',
      },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);

  try {
    const body = await request.json();
    const { name, email, whatsapp, projectType, message, turnstileToken: turnstileTokenRaw } = body;

    const turnstileToken = singleLine(turnstileTokenRaw);

    // Refuse only what Cloudflare positively identifies as automated. Anything
    // unverifiable is let through, per the reasoning on verifyTurnstile.
    const verdict = await verifyTurnstile(
      turnstileToken,
      request.headers.get('cf-connecting-ip') || '',
    );
    if (verdict === 'fail') {
      // Answer with the same shape and tone as a success. Telling a bot it was
      // detected only teaches it what to change, and it costs nothing to lie
      // to software.
      console.warn('Contact submission rejected by Turnstile.');
      return NextResponse.json({ success: true, filtered: true });
    }
    if (verdict === 'unknown') {
      console.warn(
        'Contact submission could not be spam-checked; accepting it.',
      );
    }

    const trimmedEmail = (email || '').trim();
    const trimmedWhatsApp = (whatsapp || '').trim();

    // Escaped once here, then used everywhere in the HTML body below.
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(trimmedEmail);
    const safeWhatsApp = escapeHtml(trimmedWhatsApp);
    const safeProjectType = escapeHtml(projectType);
    // newlines preserved via white-space: pre-wrap in the template
    const safeMessage = escapeHtml(message);
    const safeNameForUrl = encodeURIComponent(singleLine(name));

    // 1. Validation: Name, message, and AT LEAST ONE contact method are required
    if (!name || (!trimmedEmail && !trimmedWhatsApp) || !message) {
      return NextResponse.json(
        { error: 'Please provide your name, message, and at least one contact method (Email or WhatsApp).' },
        { status: 400 }
      );
    }

    // 2. Validate email format if provided
    const isEmailValid = trimmedEmail
      ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)
      : false;

    // 3. Format WhatsApp number for one-click chat
    const digitsOnly = trimmedWhatsApp.replace(/\D/g, '');
    let formattedWhatsApp = '';

    if (digitsOnly.length >= 10) {
      // Local Nigerian format (080..., 070..., 090... with 11 digits) -> convert 0 to 234
      if (digitsOnly.startsWith('0') && digitsOnly.length === 11) {
        formattedWhatsApp = '234' + digitsOnly.slice(1);
      } else if (digitsOnly.startsWith('234')) {
        formattedWhatsApp = digitsOnly;
      } else {
        formattedWhatsApp = digitsOnly; // International numbers
      }
    }

    // 4. Construct Branded HTML Notification Email
    const emailPayload: any = {
      from: 'Dammie Optimus Solutions Portfolio Site <onboarding@resend.dev>',
      to: ['dammieoptimus@gmail.com'],
      subject: `🚀 New Project Inquiry from ${singleLine(name)} (${singleLine(projectType)})`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #020617; color: #f8fafc; padding: 32px; border-radius: 16px; max-width: 600px; margin: auto; border: 1px solid #1e293b;">
          
          <div style="border-bottom: 2px solid #10b981; padding-bottom: 16px; margin-bottom: 24px;">
            <h2 style="color: #10b981; margin: 0; font-size: 22px;">Dammie Optimus Solutions</h2>
            <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 13px;">Incoming Client Project Brief</p>
          </div>
          
          <div style="background-color: #0f172a; padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #1e293b;">
            <p style="margin: 0 0 10px 0; font-size: 14px;"><strong style="color: #34d399;">Client Name:</strong> ${safeName}</p>
            
            ${
              trimmedEmail
                ? `<p style="margin: 0 0 10px 0; font-size: 14px;"><strong style="color: #34d399;">Email Address:</strong> <a href="mailto:${safeEmail}" style="color: #06b6d4; text-decoration: underline;">${safeEmail}</a></p>`
                : `<p style="margin: 0 0 10px 0; font-size: 14px; color: #64748b;"><em>No email provided</em></p>`
            }

            ${
              trimmedWhatsApp
                ? `<p style="margin: 0 0 10px 0; font-size: 14px;"><strong style="color: #34d399;">WhatsApp Line:</strong> <span style="color: #ffffff; font-weight: bold;">${safeWhatsApp}</span></p>`
                : `<p style="margin: 0 0 10px 0; font-size: 14px; color: #64748b;"><em>No WhatsApp provided</em></p>`
            }

            <p style="margin: 0; font-size: 14px;"><strong style="color: #34d399;">Project Category:</strong> ${safeProjectType}</p>

            <!-- Instant Action Buttons -->
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #1e293b;">
              ${
                formattedWhatsApp
                  ? `<a href="https://wa.me/${formattedWhatsApp}?text=Hello%20${safeNameForUrl},%20I%20received%20your%20project%20inquiry%20via%20Dammie%20Optimus%20Solutions." 
                      style="display: inline-block; background-color: #10b981; color: #020617; padding: 10px 18px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 13px; margin-right: 8px; margin-bottom: 8px;">
                      💬 Open WhatsApp Chat (+${formattedWhatsApp})
                    </a>`
                  : ''
              }
              ${
                isEmailValid
                  ? `<a href="mailto:${safeEmail}" 
                      style="display: inline-block; background-color: #06b6d4; color: #020617; padding: 10px 18px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 13px; margin-bottom: 8px;">
                      ✉️ Reply via Email
                    </a>`
                  : ''
              }
            </div>
          </div>

          <div style="background-color: #0f172a; padding: 20px; border-radius: 12px; border: 1px solid #1e293b;">
            <h3 style="color: #34d399; margin: 0 0 10px 0; font-size: 15px;">Project Details / Scope:</h3>
            <p style="color: #cbd5e1; line-height: 1.6; margin: 0; font-size: 13px; white-space: pre-wrap;">${safeMessage}</p>
          </div>

          <p style="color: #64748b; font-size: 11px; margin-top: 24px; text-align: center;">
            Delivered securely via Dammie Optimus Solutions Platform.
          </p>
        </div>
      `,
    };

    // If an email was supplied, enable direct one-click Gmail reply
    if (isEmailValid) {
      emailPayload.replyTo = trimmedEmail;
    }

    const data = await resend.emails.send(emailPayload);

    // ---------------------------------------------------------------
    // Auto-reply to the sender.
    //
    // Without this, a visitor fills in the form and hears nothing at
    // all, which loses the enquiry. This is deliberately the LAST
    // thing that happens: if the confirmation fails, the enquiry has
    // already reached the inbox and the visitor still gets a success
    // response. A broken confirmation must never cost a lead.
    //
    // Only sent when a valid email address was given. A visitor who
    // left the email field blank gave a WhatsApp number instead, and
    // emailing an address they did not supply would be both useless
    // and wrong. They get the WhatsApp deep link in the notification
    // instead.
    // ---------------------------------------------------------------
    if (isEmailValid) {
      try {
        await resend.emails.send({
          from: 'Dammie Optimus Solutions Portfolio Site <onboarding@resend.dev>',
          to: [trimmedEmail],
          replyTo: CONTACT_EMAIL,
          subject: `Thanks ${singleLine(name)} — I have your brief for Dammie Optimus Solutions`,
          html: buildAcknowledgementEmail({
            name: singleLine(name),
            projectType: singleLine(projectType),
            bookingUrl: BOOKING_URL,
          }),
        });
      } catch (replyError) {
        // Recorded, never surfaced. The enquiry itself is already safe.
        console.error('Acknowledgement email failed to send:', replyError);
      }
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Email dispatch error:', error);
    return NextResponse.json(
      {
        error:
          'Something went wrong on our side and your message did not send. Please WhatsApp me on +234 705 333 1253 and I will pick it up straight away.',
      },
      { status: 500 }
    );
  }
}