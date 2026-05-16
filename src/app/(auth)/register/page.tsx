"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/auth/auth-card";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
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

  return (
    <AuthCard
      eyebrow="Registracija"
      title="Pradėk 30 dienų nemokamai."
      subtitle="Be kortelės. Atsiųsime nuorodą — paspaudus ja iškart pateksi į Monivo."
      footer={
        <>
          Jau turi paskyrą?{" "}
          <Link href="/login" className="text-accent-deep hover:underline">
            Prisijunk →
          </Link>
        </>
      }
    >
      {submitted ? (
        <div className="rounded-[14px] bg-accent-soft px-4 py-4 text-[13px] text-accent-deep">
          Patikrink savo el. paštą — nuoroda išsiųsta į <strong>{email}</strong>.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-[12px] font-medium text-ink-500">
            Vardas
            <input
              type="text"
              autoComplete="given-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="rounded-[12px] border border-hair bg-cream px-3.5 py-2.5 text-[14px] text-ink-900 placeholder:text-ink-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              placeholder="Vardas (nebūtina)"
            />
          </label>

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

          {rateLimited ? (
            <div className="rounded-[12px] border border-hair bg-cream px-3.5 py-3 text-[13px] text-ink-900/90">
              Per trumpą laiką išsiųsta per daug prisijungimo nuorodų.
              Palaukite kelias minutes ir bandykite dar kartą.
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
            Registruotis →
          </Button>

          <p className="text-[12px] text-ink-500">
            Registruodamasis sutinki su{" "}
            <Link href="/salygos" className="text-accent-deep hover:underline">
              naudojimo sąlygomis
            </Link>{" "}
            ir{" "}
            <Link href="/privatumas" className="text-accent-deep hover:underline">
              privatumo nuostatomis
            </Link>
            .
          </p>
        </form>
      )}
    </AuthCard>
  );
}
