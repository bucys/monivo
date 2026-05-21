import { Resend } from "resend";

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  locale: string;
};

const MAX = { name: 80, email: 120, subject: 140, message: 4000 } as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let cached: Resend | null = null;
function resend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not configured.");
  if (!cached) cached = new Resend(key);
  return cached;
}

function clean(raw: unknown, max: number) {
  return String(raw ?? "")
    .replace(/[\r\n]+/g, "\n")
    .trim()
    .slice(0, max);
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

export function validateContact(raw: Partial<ContactPayload>): ContactPayload {
  const name = clean(raw.name, MAX.name);
  const email = clean(raw.email, MAX.email);
  const subject = clean(raw.subject, MAX.subject);
  const message = clean(raw.message, MAX.message);
  const locale = clean(raw.locale, 5) || "lt";
  if (name.length < 1) throw new Error("INVALID_NAME");
  if (!EMAIL_RE.test(email)) throw new Error("INVALID_EMAIL");
  if (message.length < 1) throw new Error("INVALID_MESSAGE");
  return { name, email, subject, message, locale };
}

export async function sendContactEmail(input: ContactPayload): Promise<void> {
  const to = process.env.CONTACT_EMAIL;
  const from = process.env.CONTACT_FROM ?? "Monivo <onboarding@resend.dev>";
  if (!to) throw new Error("CONTACT_EMAIL is not configured.");

  const safe = {
    name: escapeHtml(input.name),
    email: escapeHtml(input.email),
    subject: escapeHtml(input.subject || "(no subject)"),
    message: escapeHtml(input.message),
    locale: escapeHtml(input.locale),
    ts: new Date().toISOString(),
  };

  const text = [
    `From: ${input.name} <${input.email}>`,
    `Locale: ${input.locale}`,
    `Time: ${safe.ts}`,
    `Subject: ${input.subject || "(no subject)"}`,
    "",
    input.message,
  ].join("\n");

  const html = `<!doctype html><html><body style="font-family:system-ui,-apple-system,sans-serif;line-height:1.5;color:#17211D">
<p><strong>From:</strong> ${safe.name} &lt;${safe.email}&gt;</p>
<p><strong>Locale:</strong> ${safe.locale}<br/><strong>Time:</strong> ${safe.ts}</p>
<p><strong>Subject:</strong> ${safe.subject}</p>
<hr style="border:none;border-top:1px solid #E5E1D8"/>
<pre style="white-space:pre-wrap;font:inherit;margin:0">${safe.message}</pre>
</body></html>`;

  const { error } = await resend().emails.send({
    from,
    to,
    replyTo: input.email,
    subject: `[Monivo contact] ${input.subject || input.name}`,
    text,
    html,
  });
  if (error) throw new Error(error.message ?? "Resend send failed");
}
