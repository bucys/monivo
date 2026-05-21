"use client";

import { type FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/auth/auth-card";
import { useT } from "@/i18n/locale-provider";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

function RegisterForm() {
  const t = useT();
  const tr = t.auth.register;
  const searchParams = useSearchParams();
  const prefillEmail = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(prefillEmail);
  const [displayName, setDisplayName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setRateLimited(false);
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback?next=/dashboard`
        : undefined;

    const { error: signUpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: true,
        data: {
          display_name: displayName.trim(),
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      if (signUpError.message.toLowerCase().includes("rate limit")) {
        setRateLimited(true);
      } else {
        setError(signUpError.message);
      }
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    const [before, after = ""] = tr.successBody.split("{email}");
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
        {tr.nameLabel}
        <input
          type="text"
          autoComplete="given-name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="rounded-[12px] border border-hair bg-cream px-3.5 py-2.5 text-[14px] text-ink-900 placeholder:text-ink-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          placeholder={tr.namePlaceholder}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-[12px] font-medium text-ink-500">
        {tr.emailLabel}
        <input
          type="email"
          required
          autoComplete="email"
          autoFocus={!prefillEmail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-[12px] border border-hair bg-cream px-3.5 py-2.5 text-[14px] text-ink-900 placeholder:text-ink-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          placeholder={tr.emailPlaceholder}
        />
      </label>

      {rateLimited ? (
        <div className="rounded-[12px] border border-hair bg-cream px-3.5 py-3 text-[13px] text-ink-900/90">
          {tr.rateLimited}
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
        {tr.submit}
      </Button>

      <p className="text-[12px] text-ink-500">
        {tr.termsLead}{" "}
        <Link href="/salygos" className="text-accent-deep hover:underline">
          {tr.termsLink}
        </Link>{" "}
        {tr.termsAnd}{" "}
        <Link href="/privatumas" className="text-accent-deep hover:underline">
          {tr.privacyLink}
        </Link>
        .
      </p>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-[420px]">
          <div className="h-[520px] animate-pulse rounded-[24px] bg-ink-100" />
        </div>
      }
    >
      <RegisterPageInner />
    </Suspense>
  );
}

function RegisterPageInner() {
  const t = useT();
  const tr = t.auth.register;
  return (
    <AuthCard
      eyebrow={tr.eyebrow}
      title={tr.title}
      subtitle={tr.subtitle}
      footer={
        <>
          {tr.footerLead}{" "}
          <Link href="/login" className="text-accent-deep hover:underline">
            {tr.footerCta}
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
}
