import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  // Instantiate per request rather than at module scope. At module scope the
  // constructor throws when the key is missing, which crashed the whole route
  // with an empty 500 (and broke `next build`, since the module is evaluated
  // while collecting page data).
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set in this environment.');
    return NextResponse.json(
      { error: 'Email delivery is not configured. Please reach out via WhatsApp.' },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);

  try {
    const body = await request.json();
    const { name, email, whatsapp, projectType, message } = body;

    const trimmedEmail = (email || '').trim();
    const trimmedWhatsApp = (whatsapp || '').trim();

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
      subject: `🚀 New Project Inquiry from ${name} (${projectType})`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #020617; color: #f8fafc; padding: 32px; border-radius: 16px; max-width: 600px; margin: auto; border: 1px solid #1e293b;">
          
          <div style="border-bottom: 2px solid #10b981; padding-bottom: 16px; margin-bottom: 24px;">
            <h2 style="color: #10b981; margin: 0; font-size: 22px;">Dammie Optimus Solutions</h2>
            <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 13px;">Incoming Client Project Brief</p>
          </div>
          
          <div style="background-color: #0f172a; padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #1e293b;">
            <p style="margin: 0 0 10px 0; font-size: 14px;"><strong style="color: #34d399;">Client Name:</strong> ${name}</p>
            
            ${
              trimmedEmail
                ? `<p style="margin: 0 0 10px 0; font-size: 14px;"><strong style="color: #34d399;">Email Address:</strong> <a href="mailto:${trimmedEmail}" style="color: #06b6d4; text-decoration: underline;">${trimmedEmail}</a></p>`
                : `<p style="margin: 0 0 10px 0; font-size: 14px; color: #64748b;"><em>No email provided</em></p>`
            }

            ${
              trimmedWhatsApp
                ? `<p style="margin: 0 0 10px 0; font-size: 14px;"><strong style="color: #34d399;">WhatsApp Line:</strong> <span style="color: #ffffff; font-weight: bold;">${trimmedWhatsApp}</span></p>`
                : `<p style="margin: 0 0 10px 0; font-size: 14px; color: #64748b;"><em>No WhatsApp provided</em></p>`
            }

            <p style="margin: 0; font-size: 14px;"><strong style="color: #34d399;">Project Category:</strong> ${projectType}</p>

            <!-- Instant Action Buttons -->
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #1e293b;">
              ${
                formattedWhatsApp
                  ? `<a href="https://wa.me/${formattedWhatsApp}?text=Hello%20${encodeURIComponent(
                      name
                    )},%20I%20received%20your%20project%20inquiry%20via%20Dammie%20Optimus%20Solutions." 
                      style="display: inline-block; background-color: #10b981; color: #020617; padding: 10px 18px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 13px; margin-right: 8px; margin-bottom: 8px;">
                      💬 Open WhatsApp Chat (+${formattedWhatsApp})
                    </a>`
                  : ''
              }
              ${
                isEmailValid
                  ? `<a href="mailto:${trimmedEmail}" 
                      style="display: inline-block; background-color: #06b6d4; color: #020617; padding: 10px 18px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 13px; margin-bottom: 8px;">
                      ✉️ Reply via Email
                    </a>`
                  : ''
              }
            </div>
          </div>

          <div style="background-color: #0f172a; padding: 20px; border-radius: 12px; border: 1px solid #1e293b;">
            <h3 style="color: #34d399; margin: 0 0 10px 0; font-size: 15px;">Project Details / Scope:</h3>
            <p style="color: #cbd5e1; line-height: 1.6; margin: 0; font-size: 13px; white-space: pre-wrap;">${message}</p>
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
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Email dispatch error:', error);
    return NextResponse.json(
      { error: 'Failed to deliver message. Please reach out via WhatsApp.' },
      { status: 500 }
    );
  }
}