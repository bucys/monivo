"use server";

import {
  sendContactEmail,
  validateContact,
  type ContactFailReason,
} from "@/lib/email";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 3;

type Bucket = { count: number; windowStart: number };
const buckets = new Map<string, Bucket>();

function rateLimitKey(email: string) {
  return email.toLowerCase();
}

function rateLimit(email: string): boolean {
  const now = Date.now();
  const key = rateLimitKey(email);
  const existing = buckets.get(key);
  if (!existing || now - existing.windowStart > RATE_LIMIT_WINDOW_MS) {
    buckets.set(key, { count: 1, windowStart: now });
    return true;
  }
  if (existing.count >= RATE_LIMIT_MAX) return false;
  existing.count += 1;
  return true;
}

export type ContactInput = {
  name: string;
  email: string;
  subject?: string;
  message: string;
  locale?: string;
};

export type ContactActionResult =
  | { ok: true }
  | {
      ok: false;
      reason:
        | "INVALID_NAME"
        | "INVALID_EMAIL"
        | "INVALID_MESSAGE"
        | "RATE_LIMITED"
        | ContactFailReason;
    };

/**
 * Contact form server action. Never throws — returns a typed result so the
 * client surfaces a calm error UI rather than a 500. All internal failure
 * details are logged on the server only.
 */
export async function sendContactMessage(
  input: ContactInput,
): Promise<ContactActionResult> {
  let payload;
  try {
    payload = validateContact({
      name: input.name,
      email: input.email,
      subject: input.subject ?? "",
      message: input.message,
      locale: input.locale ?? "lt",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "";
    if (
      message === "INVALID_NAME" ||
      message === "INVALID_EMAIL" ||
      message === "INVALID_MESSAGE"
    ) {
      return { ok: false, reason: message };
    }
    console.error("[contact] validation threw:", message);
    return { ok: false, reason: "SEND_FAILED" };
  }
  if (!rateLimit(payload.email)) {
    return { ok: false, reason: "RATE_LIMITED" };
  }
  return await sendContactEmail(payload);
}
