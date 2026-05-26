"use client";

import { useState } from "react";
import { SettingsRow } from "@/components/settings/settings-card";
import { IconReceipt } from "@/components/settings/settings-icons";
import { TaxProfileCard } from "@/components/settings/tax-profile-card";
import { ModalSheet } from "@/components/ui/modal-sheet";
import { useT } from "@/i18n/locale-provider";
import type { TaxProfile } from "@/lib/tax";

export function TaxFormSheet({
  initial,
  last,
  canWrite = true,
}: {
  initial: TaxProfile;
  last?: boolean;
  canWrite?: boolean;
}) {
  const t = useT();
  const tx = t.settings.tax;
  const [open, setOpen] = useState(false);

  const detail = tx.modes[initial.taxMode];

  return (
    <>
      <SettingsRow
        icon={<IconReceipt />}
        label={t.settings.business.activityForm}
        detail={detail}
        onClick={() => setOpen(true)}
        last={last}
      />
      <ModalSheet
        open={open}
        onClose={() => setOpen(false)}
        ariaLabel={t.settings.business.activityForm}
        closeLabel={t.common.close}
      >
        <header className="flex flex-col gap-1 px-1 pb-3">
          <h2 className="text-[18px] font-semibold tracking-[-0.018em] text-ink-900/90">
            {t.settings.business.activityForm}
          </h2>
          <p className="text-[12px] leading-[1.5] text-ink-500">
            {tx.modalSubtitle}
          </p>
        </header>
        <TaxProfileCard
          initial={initial}
          canWrite={canWrite}
          onSaved={() => setOpen(false)}
        />
      </ModalSheet>
    </>
  );
}
