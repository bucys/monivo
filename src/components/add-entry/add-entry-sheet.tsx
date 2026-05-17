"use client";

import { useEffect, useState } from "react";
import { ModalSheet } from "@/components/ui/modal-sheet";
import { IncomeForm, type ServiceChip } from "./income-form";

const OPEN_EVENT = "monivo:open-add-entry";

export function dispatchOpenAddEntry() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

type Tab = "income" | "expense";

export function AddEntrySheet({
  services,
  canWrite,
}: {
  services: ReadonlyArray<ServiceChip>;
  canWrite: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("income");
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!canWrite) return;
    const handler = () => {
      setTab("income");
      setOpen(true);
    };
    window.addEventListener(OPEN_EVENT, handler);
    return () => window.removeEventListener(OPEN_EVENT, handler);
  }, [canWrite]);

  useEffect(() => {
    if (!justAdded) return;
    const t = window.setTimeout(() => setJustAdded(false), 1500);
    return () => window.clearTimeout(t);
  }, [justAdded]);

  const close = () => setOpen(false);
  const onAdded = () => {
    setOpen(false);
    setJustAdded(true);
  };

  return (
    <>
      <ModalSheet open={open} onClose={close} ariaLabel="Pridėti įrašą">
        <div className="flex flex-col gap-5">
          <div className="flex rounded-[14px] bg-ink-100 p-1">
            <TabButton
              active={tab === "income"}
              onClick={() => setTab("income")}
            >
              Pajamos
            </TabButton>
            <TabButton
              active={tab === "expense"}
              onClick={() => setTab("expense")}
            >
              Išlaidos
            </TabButton>
          </div>

          {tab === "income" ? (
            <IncomeForm services={services} onAdded={onAdded} />
          ) : (
            <ExpensePlaceholder />
          )}
        </div>
      </ModalSheet>

      {justAdded ? (
        <div
          role="status"
          className="pointer-events-none fixed bottom-[112px] left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink-900/90 px-4 py-2 text-[13px] font-medium text-white shadow-card lg:bottom-8"
        >
          Pridėta ✓
        </div>
      ) : null}
    </>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex-1 rounded-[10px] px-3 py-2 text-[14px] font-medium transition-colors ${
        active
          ? "bg-white text-ink-900/90 shadow-card"
          : "text-ink-500 hover:text-ink-900/90"
      }`}
    >
      {children}
    </button>
  );
}

function ExpensePlaceholder() {
  return (
    <div className="flex flex-col items-center rounded-[18px] border border-hair bg-cream px-6 py-10 text-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-accent/[0.08] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-accent">
        Greitai
      </span>
      <p className="mt-3 max-w-[280px] text-[14px] leading-[1.55] text-ink-500">
        Išlaidų pridėjimas bus paruoštas kitame žingsnyje.
      </p>
    </div>
  );
}
