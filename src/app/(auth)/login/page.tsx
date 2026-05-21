"use client";

import { type FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/auth/auth-card";
import { useT } from "@/i18n/locale-provider";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

function LoginForm() {
  const t = useT();
  const tl = t.auth.login;
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notRegistered, setNotRegistered] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setNotRegistered(false);
    setRateLimited(false);
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
        : undefined;

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: false,
      },
    });

    setLoading(false);

    if (signInError) {
      const msg = signInError.message.toLowerCase();
      if (msg.includes("rate limit")) {
        setRateLimited(true);
      } else if (
        msg.includes("signups not allowed") ||
        msg.includes("user not found") ||
        msg.includes("otp_disabled")
      ) {
        setNotRegistered(true);
      } else {
        setError(signInError.message);
      }
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    const [before, after = ""] = tl.successBody.split("{email}");
    return (
      <div className="rounded-[14px] bg-accent-soft px-4 py-4 text-[13px] text-accent-deep">
        {before}
        <strong>{email}</strong>
        {after}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-[12px] font-medium text-ink-500">
        {tl.emailLabel}
        <input
          type="email"
          required
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-[12px] border border-hair bg-cream px-3.5 py-2.5 text-[14px] text-ink-900 placeholder:text-ink-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          placeholder={tl.emailPlaceholder}
        />
      </label>

      {rateLimited ? (
        <div className="rounded-[12px] border border-hair bg-cream px-3.5 py-3 text-[13px] text-ink-900/90">
          {tl.rateLimited}
        </div>
      ) : notRegistered ? (
        <div className="rounded-[12px] border border-hair bg-cream px-3.5 py-3 text-[13px] text-ink-900/90">
          {tl.notRegistered}{" "}
          <Link
            href={`/register?email=${encodeURIComponent(email)}`}
            className="text-accent-deep hover:underline"
          >
            {tl.notRegisteredCta}
          </Link>
        </div>
      ) : error ? (
        <p className="rounded-[12px] bg-expense-bg px-3.5 py-2.5 text-[13px] text-expense">
          {error}
        </p>
      ) : null}

      <Button
        variant="primary"
        type="submit"
        isLoading={loading}
        className="!mt-1 !h-auto !rounded-[14px] !px-5 !py-3 !text-[14px]"
      >
        {tl.submit}
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-[420px]">
          <div className="h-[420px] animate-pulse rounded-[24px] bg-ink-100" />
        </div>
      }
    >
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const t = useT();
  const tl = t.auth.login;
  return (
    <AuthCard
      eyebrow={tl.eyebrow}
      title={tl.title}
      subtitle={tl.subtitle}
      footer={
        <>
          {tl.footerLead}{" "}
          <Link href="/register" className="text-accent-deep hover:underline">
            {tl.footerCta}
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}
