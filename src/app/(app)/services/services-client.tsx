"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { ModalSheet } from "@/components/ui/modal-sheet";
import { createService, deleteService, updateService } from "./actions";

export type ServiceRow = {
  id: string;
  name: string;
  price_cents: number;
};

const OPEN_ADD_EVENT = "monivo:open-add-service";

export function dispatchOpenAddService() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_ADD_EVENT));
}

function formatEur(cents: number) {
  return new Intl.NumberFormat("lt-LT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

function centsToInput(cents: number) {
  return (cents / 100).toFixed(2).replace(".", ",");
}

type SheetMode =
  | { kind: "closed" }
  | { kind: "add" }
  | { kind: "edit"; service: ServiceRow };

export function ServicesClient({
  services,
  canWrite,
}: {
  services: ReadonlyArray<ServiceRow>;
  canWrite: boolean;
}) {
  const [mode, setMode] = useState<SheetMode>({ kind: "closed" });

  useEffect(() => {
    if (!canWrite) return;
    const handler = () => setMode({ kind: "add" });
    window.addEventListener(OPEN_ADD_EVENT, handler);
    return () => window.removeEventListener(OPEN_ADD_EVENT, handler);
  }, [canWrite]);

  const avg = useMemo(() => {
    if (services.length === 0) return 0;
    const sum = services.reduce((acc, s) => acc + s.price_cents, 0);
    return Math.round(sum / services.length);
  }, [services]);

  const close = () => setMode({ kind: "closed" });

  if (services.length === 0) {
    return (
      <>
        <EmptyState
          canWrite={canWrite}
          onAdd={() => setMode({ kind: "add" })}
        />
        {!canWrite ? <ReadOnlyNotice /> : null}
        <ServiceSheet mode={mode} onClose={close} />
      </>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between rounded-[16px] border border-hair bg-white px-4 py-3">
        <span className="text-[13px] text-ink-500">
          {services.length}{" "}
          {services.length === 1
            ? "paslauga"
            : services.length < 10
              ? "paslaugos"
              : "paslaugų"}
          {" · vid. "}
          <span className="font-medium tabular-nums text-ink-900/90">
            {formatEur(avg)}
          </span>
        </span>
        {canWrite ? (
          <button
            type="button"
            onClick={() => setMode({ kind: "add" })}
            className="hidden rounded-[10px] bg-accent px-3 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-accent-deep lg:inline-flex"
          >
            + Pridėti
          </button>
        ) : null}
      </div>

      {!canWrite ? <ReadOnlyNotice /> : null}

      <ul className="flex flex-col gap-2">
        {services.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() =>
                canWrite ? setMode({ kind: "edit", service: s }) : undefined
              }
              disabled={!canWrite}
              className="flex w-full items-center justify-between rounded-[18px] border border-hair bg-white px-5 py-4 text-left transition-colors hover:border-accent/40 disabled:cursor-default disabled:hover:border-hair"
            >
              <span className="flex flex-col">
                <span className="text-[16px] font-semibold tracking-[-0.018em] text-ink-900/90">
                  {s.name}
                </span>
              </span>
              <span className="text-[18px] font-semibold tabular-nums text-ink-900/90">
                {formatEur(s.price_cents)}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <ServiceSheet mode={mode} onClose={close} />
    </div>
  );
}

function EmptyState({
  canWrite,
  onAdd,
}: {
  canWrite: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="flex flex-col items-center rounded-[24px] border border-hair bg-white px-6 py-12 text-center">
      <h2 className="text-[20px] font-semibold tracking-[-0.022em] text-ink-900/90">
        Dar nepridėjai paslaugų.
      </h2>
      <p className="mt-2 max-w-[320px] text-[14px] leading-[1.55] text-ink-500">
        Pridėk dažniausiai teikiamas paslaugas — jas vienu paliestimu pridėsi
        prie pajamų.
      </p>
      {canWrite ? (
        <Button
          variant="primary"
          type="button"
          onClick={onAdd}
          className="mt-6 !h-auto !w-auto !rounded-[14px] !px-5 !py-3 !text-[14px]"
        >
          Pridėti pirmą paslaugą
        </Button>
      ) : null}
    </div>
  );
}

function ReadOnlyNotice() {
  return (
    <p className="rounded-[12px] bg-accent-soft/60 px-3.5 py-2.5 text-[13px] text-accent-deep">
      Tvarkyti paslaugas galėsi, kai prenumerata bus aktyvi.
    </p>
  );
}

function ServiceSheet({
  mode,
  onClose,
}: {
  mode: SheetMode;
  onClose: () => void;
}) {
  const open = mode.kind !== "closed";

  return (
    <ModalSheet
      open={open}
      onClose={onClose}
      ariaLabel={mode.kind === "edit" ? "Redaguoti paslaugą" : "Pridėti paslaugą"}
    >
      {mode.kind === "add" ? (
        <ServiceForm key="add" mode={mode} onDone={onClose} />
      ) : mode.kind === "edit" ? (
        <ServiceForm key={mode.service.id} mode={mode} onDone={onClose} />
      ) : null}
    </ModalSheet>
  );
}

function ServiceForm({
  mode,
  onDone,
}: {
  mode: Exclude<SheetMode, { kind: "closed" }>;
  onDone: () => void;
}) {
  const initial =
    mode.kind === "edit"
      ? { name: mode.service.name, price: centsToInput(mode.service.price_cents) }
      : { name: "", price: "" };

  const [name, setName] = useState(initial.name);
  const [price, setPrice] = useState(initial.price);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pending, startTransition] = useTransition();
  const [deletePending, startDeleteTransition] = useTransition();

  const title = mode.kind === "edit" ? "Redaguoti paslaugą" : "Pridėti paslaugą";
  const cta = mode.kind === "edit" ? "Išsaugoti pakeitimus" : "Išsaugoti";

  const submit = () => {
    setError(null);
    const fd = new FormData();
    fd.set("name", name);
    fd.set("price", price);
    startTransition(async () => {
      try {
        if (mode.kind === "edit") {
          await updateService(mode.service.id, fd);
        } else {
          await createService(fd);
        }
        onDone();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Įvyko klaida");
      }
    });
  };

  const doDelete = () => {
    if (mode.kind !== "edit") return;
    setError(null);
    startDeleteTransition(async () => {
      try {
        await deleteService(mode.service.id);
        onDone();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Įvyko klaida");
      }
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex flex-col gap-5"
    >
      <h2 className="text-[20px] font-semibold tracking-[-0.022em] text-ink-900/90">
        {title}
      </h2>

      <label className="flex flex-col gap-1.5 text-[12px] font-medium text-ink-500">
        Pavadinimas
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
          placeholder="Pvz. Manikiūras"
          autoFocus={mode.kind === "add"}
          className="rounded-[14px] border border-hair bg-white px-3.5 py-2.5 text-[16px] font-medium text-ink-900/90 placeholder:text-ink-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-[12px] font-medium text-ink-500">
        Kaina
        <div className="flex items-center rounded-[14px] border border-hair bg-white px-3.5 py-2.5 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30">
          <input
            type="text"
            inputMode="decimal"
            value={price}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^\d.,]/g, "").replace(/\./g, ",");
              const firstComma = raw.indexOf(",");
              const cleaned =
                firstComma === -1
                  ? raw
                  : raw.slice(0, firstComma + 1) +
                    raw.slice(firstComma + 1).replace(/,/g, "").slice(0, 2);
              setPrice(cleaned);
            }}
            placeholder="Pvz. 25,00"
            className="w-full bg-transparent text-[16px] font-medium tabular-nums text-ink-900/90 placeholder:text-ink-500 focus:outline-none"
          />
          <span aria-hidden className="ml-2 text-[14px] font-medium text-ink-500">
            €
          </span>
        </div>
      </label>

      {error ? (
        <p className="rounded-[12px] bg-expense-bg px-3.5 py-2.5 text-[13px] text-expense">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-2">
        <Button
          variant="primary"
          type="submit"
          isLoading={pending}
          disabled={pending || deletePending}
          className="!h-auto !rounded-[14px] !px-5 !py-3 !text-[14px]"
        >
          {cta}
        </Button>
        <button
          type="button"
          onClick={onDone}
          disabled={pending || deletePending}
          className="self-center px-2 py-1 text-[13px] text-ink-500 hover:text-ink-900/90 disabled:opacity-50"
        >
          Atšaukti
        </button>
      </div>

      {mode.kind === "edit" ? (
        <div className="mt-2 border-t border-hair pt-4">
          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              disabled={pending || deletePending}
              className="w-full rounded-[12px] px-3 py-2 text-[13px] font-medium text-expense hover:bg-expense-bg disabled:opacity-50"
            >
              Ištrinti paslaugą
            </button>
          ) : (
            <div className="flex flex-col gap-2 rounded-[14px] border border-expense/30 bg-expense-bg/60 p-3">
              <p className="text-[13px] text-ink-900/90">Tikrai ištrinti?</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={doDelete}
                  disabled={deletePending}
                  className="flex-1 rounded-[12px] bg-expense px-3 py-2 text-[13px] font-medium text-white disabled:opacity-50"
                >
                  {deletePending ? "Trinama…" : "Trinti"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  disabled={deletePending}
                  className="flex-1 rounded-[12px] border border-hair bg-white px-3 py-2 text-[13px] font-medium text-ink-700 disabled:opacity-50"
                >
                  Atšaukti
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </form>
  );
}
