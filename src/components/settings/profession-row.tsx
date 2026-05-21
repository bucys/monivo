"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateProfession } from "@/app/(app)/settings/actions";
import { SettingsRow } from "@/components/settings/settings-card";
import { IconNote } from "@/components/settings/settings-icons";
import { ModalSheet } from "@/components/ui/modal-sheet";
import { useT } from "@/i18n/locale-provider";
import type { Dictionary } from "@/i18n";

type Profession = keyof Dictionary["nav"]["professions"];

const OPTIONS: ReadonlyArray<Profession> = [
  "hair",
  "nails",
  "cosmetology",
  "lashes",
  "other",
];

export function ProfessionRow({
  initial,
  last,
}: {
  initial: Profession | null;
  last?: boolean;
}) {
  const router = useRouter();
  const t = useT();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const detail = initial ? t.nav.professions[initial] : t.nav.individualActivity;

  const pick = (value: Profession) => {
    setError(null);
    const fd = new FormData();
    fd.set("profession", value);
    startTransition(async () => {
      try {
        await updateProfession(fd);
        setOpen(false);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : t.common.genericError);
      }
    });
  };

  return (
    <>
      <SettingsRow
        icon={<IconNote />}
        label={t.settings.business.activityType}
        detail={detail}
        onClick={() => setOpen(true)}
        last={last}
      />
      <ModalSheet
        open={open}
        onClose={() => (pending ? null : setOpen(false))}
        ariaLabel={t.settings.profession.ariaLabel}
        closeLabel={t.common.close}
      >
        <div className="flex flex-col gap-1 pb-1">
          <h2 className="px-1 pb-2 text-[15px] font-semibold tracking-[-0.012em] text-ink-900/90">
            {t.settings.profession.sheetTitle}
          </h2>
          <ul className="flex flex-col">
            {OPTIONS.map((opt) => {
              const active = initial === opt;
              return (
                <li key={opt}>
                  <button
                    type="button"
                    onClick={() => pick(opt)}
                    disabled={pending}
                    aria-pressed={active}
                    className={`flex w-full items-center justify-between rounded-[12px] px-3 py-3 text-left text-[15px] font-medium tracking-[-0.012em] transition-colors hover:bg-cream/60 disabled:opacity-60 ${
                      active ? "text-accent-deep" : "text-ink-900/90"
                    }`}
                  >
                    <span>{t.nav.professions[opt]}</span>
                    {active ? <CheckIcon /> : null}
                  </button>
                </li>
              );
            })}
          </ul>
          {error ? (
            <p className="mt-2 rounded-[12px] bg-expense-bg px-3.5 py-2.5 text-[13px] text-expense">
              {error}
            </p>
          ) : null}
        </div>
      </ModalSheet>
    </>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="text-accent-deep"
    >
      <path d="M5 12l5 5 9-11" />
    </svg>
  );
}
