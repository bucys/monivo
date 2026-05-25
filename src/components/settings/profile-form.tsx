"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateProfile } from "@/app/(app)/settings/actions";
import { useLocale } from "@/i18n/locale-provider";

export function DisplayNameField({
  initial,
  onDone,
}: {
  initial: string;
  onDone?: () => void;
}) {
  const router = useRouter();
  const { t } = useLocale();
  const [value, setValue] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const save = () => {
    setError(null);
    const fd = new FormData();
    fd.set("display_name", value);
    startTransition(async () => {
      try {
        await updateProfile(fd);
        router.refresh();
        onDone?.();
      } catch (e) {
        setError(e instanceof Error ? e.message : t.common.genericError);
      }
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="flex flex-col gap-3"
    >
      <input
        type="text"
        value={value}
        autoFocus
        maxLength={80}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t.settings.profile.displayNamePlaceholder}
        className="rounded-[14px] border border-hair bg-surface px-4 py-3 text-[15px] text-ink-900/90 placeholder:text-ink-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
      {error ? (
        <p className="text-[12px] text-expense">{error}</p>
      ) : null}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onDone}
          disabled={pending}
          className="flex-1 rounded-[14px] bg-cream px-4 py-3 text-[14px] font-medium text-ink-700 transition-colors hover:bg-cream/80"
        >
          {t.common.cancel}
        </button>
        <button
          type="submit"
          disabled={pending}
          className="flex-1 rounded-[14px] bg-ink-900 px-4 py-3 text-[14px] font-medium text-white transition-colors hover:bg-ink-900/90 disabled:opacity-60"
        >
          {pending ? t.common.loading : t.common.save}
        </button>
      </div>
    </form>
  );
}

export function TaxRatePill({ initialPercent }: { initialPercent: number }) {
  const router = useRouter();
  const { t } = useLocale();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(initialPercent));
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const save = () => {
    setError(null);
    const fd = new FormData();
    fd.set("tax_rate_percent", value);
    startTransition(async () => {
      try {
        await updateProfile(fd);
        setEditing(false);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : t.common.genericError);
      }
    });
  };

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="inline-flex items-center rounded-full bg-tax-bg px-3 py-1 text-[13px] font-semibold text-tax tabular-nums transition-opacity hover:opacity-90"
      >
        {initialPercent}%
      </button>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="flex items-center gap-2"
    >
      <div className="flex items-center rounded-[12px] border border-hair bg-surface px-2.5 py-1 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          autoFocus
          onChange={(e) =>
            setValue(e.target.value.replace(/[^\d.,]/g, "").slice(0, 5))
          }
          className="w-10 bg-transparent text-[13px] tabular-nums text-ink-900/90 focus:outline-none"
        />
        <span className="text-[12px] text-ink-500">%</span>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-[10px] bg-ink-900 px-2.5 py-1.5 text-[12px] font-medium text-white disabled:opacity-60"
      >
        {pending ? "…" : t.common.save}
      </button>
      <button
        type="button"
        onClick={() => {
          setEditing(false);
          setValue(String(initialPercent));
        }}
        disabled={pending}
        className="text-[12px] font-medium text-ink-500"
      >
        ✕
      </button>
      {error ? (
        <span className="text-[11px] text-expense">{error}</span>
      ) : null}
    </form>
  );
}
