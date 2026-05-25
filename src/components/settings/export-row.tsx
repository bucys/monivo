"use client";

import { useState, useTransition } from "react";
import { exportEntriesCsv, type ExportKind } from "@/app/(app)/settings/actions";
import { SettingsRow } from "@/components/settings/settings-card";
import { IconExport } from "@/components/settings/settings-icons";
import { Button } from "@/components/ui/button";
import { ModalSheet } from "@/components/ui/modal-sheet";
import { useT } from "@/i18n/locale-provider";

const KINDS: ReadonlyArray<ExportKind> = ["all", "income", "expenses"];

function emptyMessageFor(
  kind: ExportKind,
  t: ReturnType<typeof useT>,
): string {
  if (kind === "income") return t.settings.app.exportEmptyIncome;
  if (kind === "expenses") return t.settings.app.exportEmptyExpenses;
  return t.settings.app.exportEmpty;
}

export function ExportRow({ last }: { last?: boolean }) {
  const t = useT();
  const sheet = t.settings.app.exportSheet;

  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<ExportKind>("all");
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const onOpen = () => {
    setMessage(null);
    setOpen(true);
  };

  const onClose = () => {
    if (pending) return;
    setOpen(false);
  };

  const onDownload = () => {
    if (pending) return;
    setMessage(null);
    startTransition(async () => {
      try {
        const { csv, filename, rowCount } = await exportEntriesCsv(kind);
        if (rowCount === 0) {
          setMessage(emptyMessageFor(kind, t));
          return;
        }
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        setOpen(false);
      } catch {
        setMessage(t.settings.app.exportError);
      }
    });
  };

  return (
    <>
      <SettingsRow
        icon={<IconExport />}
        label={t.settings.app.export}
        detail={t.settings.app.exportValue}
        onClick={onOpen}
        last={last}
      />
      <ModalSheet
        open={open}
        onClose={onClose}
        ariaLabel={sheet.title}
        closeLabel={t.common.close}
      >
        <header className="flex flex-col gap-1 px-1 pb-3">
          <h2 className="text-[18px] font-semibold tracking-[-0.018em] text-ink-900/90">
            {sheet.title}
          </h2>
          <p className="text-[12px] leading-[1.5] text-ink-500">
            {sheet.subtitle}
          </p>
        </header>

        <ul className="flex flex-col gap-2 pb-1">
          {KINDS.map((k) => {
            const active = kind === k;
            const opt = sheet.options[k];
            return (
              <li key={k}>
                <button
                  type="button"
                  onClick={() => setKind(k)}
                  aria-pressed={active}
                  className={`flex w-full flex-col gap-1 rounded-[14px] border px-4 py-3 text-left transition-colors ${
                    active
                      ? "border-accent bg-accent-soft"
                      : "border-hair bg-white hover:border-accent/40"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                        active ? "border-accent" : "border-hair"
                      }`}
                    >
                      {active ? (
                        <span className="block h-2 w-2 rounded-full bg-accent" />
                      ) : null}
                    </span>
                    <span
                      className={`text-[14px] font-medium tracking-[-0.008em] ${
                        active ? "text-accent-deep" : "text-ink-900/90"
                      }`}
                    >
                      {opt.label}
                    </span>
                  </span>
                  <span className="pl-6 text-[12px] leading-[1.45] text-ink-500">
                    {opt.helper}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {message ? (
          <p className="mt-3 rounded-[12px] bg-cream px-3.5 py-2.5 text-[13px] text-ink-700">
            {message}
          </p>
        ) : null}

        <div className="mt-4">
          <Button
            variant="primary"
            type="button"
            onClick={onDownload}
            isLoading={pending}
            className="!h-auto !w-full !rounded-[14px] !px-5 !py-3 !text-[14px]"
          >
            {pending ? t.settings.app.exportPending : sheet.download}
          </Button>
        </div>
      </ModalSheet>
    </>
  );
}
