"use client";

import { type FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/auth/auth-card";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
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
      setError(signInError.message);
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-[14px] bg-accent-soft px-4 py-4 text-[13px] text-accent-deep">
        Patikrink savo el. paštą — nuoroda išsiųsta į <strong>{email}</strong>.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-[12px] font-medium text-ink-500">
        El. paštas
        <input
          type="email"
          required
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-[12px] border border-hair bg-cream px-3.5 py-2.5 text-[14px] text-ink-900 placeholder:text-ink-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          placeholder="vardas@pastas.lt"
        />
      </label>

      {error ? (
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
        Siųsti nuorodą →
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <AuthCard
      eyebrow="Prisijungimas"
      title="Pradėk nuo el. pašto."
      subtitle="Atsiųsime nuorodą — paspaudus ja prisijungsi be slaptažodžio."
      footer={
        <>
          Neturi paskyros?{" "}
          <Link href="/register" className="text-accent-deep hover:underline">
            Registruokis →
          </Link>
        </>
      }
    >
      <Suspense
        fallback={
          <div className="h-[148px] animate-pulse rounded-[14px] bg-ink-100" />
        }
      >
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
