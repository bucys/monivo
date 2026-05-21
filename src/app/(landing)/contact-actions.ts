"use server";

import { sendContactEmail, validateContact } from "@/lib/email";

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

export async function sendContactMessage(input: ContactInput): Promise<void> {
  const payload = validateContact({
    name: input.name,
    email: input.email,
    subject: input.subject ?? "",
    message: input.message,
    locale: input.locale ?? "lt",
  });
  if (!rateLimit(payload.email)) {
    throw new Error("RATE_LIMITED");
  }
  await sendContactEmail(payload);
}
