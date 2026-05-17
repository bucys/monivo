export type ProfileWriteFields = {
  subscription_status:
    | "trialing"
    | "active"
    | "expired"
    | "past_due"
    | "canceled";
  trial_ends_at: string;
  past_due_since: string | null;
};

const GRACE_DAYS = 7;

export function canWriteProfile(p: ProfileWriteFields | null | undefined) {
  if (!p) return false;
  const now = Date.now();
  if (p.subscription_status === "active") return true;
  if (p.subscription_status === "trialing") {
    return now < Date.parse(p.trial_ends_at);
  }
  if (p.subscription_status === "past_due" && p.past_due_since) {
    return now < Date.parse(p.past_due_since) + GRACE_DAYS * 86_400_000;
  }
  return false;
}
