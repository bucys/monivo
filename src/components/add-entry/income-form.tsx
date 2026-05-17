"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createIncomeEntry } from "@/app/(app)/entries/actions";
import { Button } from "@/components/ui/button";

export type ServiceChip = {
  id: string;
  name: string;
  price_cents: number;
};

type PaymentMethod = "cash" | "card" | "transfer";

const PAYMENT_OPTIONS: ReadonlyArray<{
  id: PaymentMethod;
  label: string;
}> = [
  { id: "cash", label: "Grynais" },
  { id: "card", label: "Kortele" },
  { id: "transfer", label: "Pavedimu" },
];

function centsToInput(cents: number) {
  return (cents / 100).toFixed(2).replace(".", ",");
}

function cleanAmount(raw: string) {
  const normalized = raw.replace(/[^\d.,]/g, "").replace(/\./g, ",");
  const first = normalized.indexOf(",");
  if (first === -1) return normalized;
  return (
    normalized.slice(0, first + 1) +
    normalized.slice(first + 1).replace(/,/g, "").slice(0, 2)
  );
}

export function IncomeForm({
  services,
  onAdded,
  initialServiceId = null,
}: {
  services: ReadonlyArray<ServiceChip>;
  onAdded: () => void;
  initialServiceId?: string | null;
}) {
  const router = useRouter();
  const initialService = initialServiceId
    ? (services.find((s) => s.id === initialServiceId) ?? null)
    : null;
  const [amount, setAmount] = useState(
    initialService ? centsToInput(initialService.price_cents) : "",
  );
  const [serviceId, setServiceId] = useState<string | null>(
    initialService ? initialService.id : null,
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const parsedAmount = Number(amount.replace(",", "."));
  const submitDisabled =
    pending || amount === "" || !Number.isFinite(parsedAmount) || parsedAmount <= 0;

  const pickService = (svc: ServiceChip) => {
    if (serviceId === svc.id) {
      setServiceId(null);
      return;
    }
    setServiceId(svc.id);
    setAmount(centsToInput(svc.price_cents));
  };

  const submit = () => {
    if (submitDisabled) return;
    setError(null);
    const fd = new FormData();
    fd.set("amount", amount);
    fd.set("payment_method", paymentMethod);
    if (serviceId) fd.set("service_id", serviceId);
    if (noteOpen && note.trim() !== "") fd.set("note", note.trim());

    startTransition(async () => {
      try {
        await createIncomeEntry(fd);
        setAmount("");
        setServiceId(null);
        setPaymentMethod("cash");
        setNoteOpen(false);
        setNote("");
        router.refresh();
        onAdded();
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
      <label className="flex flex-col gap-2">
        <span className="text-[12px] font-medium text-ink-500">Suma</span>
        <div className="flex items-baseline rounded-[16px] border border-hair bg-white px-4 py-3 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30">
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(cleanAmount(e.target.value))}
            placeholder="0,00"
            autoFocus
            className="w-full bg-transparent text-[32px] font-semibold leading-none tracking-[-0.02em] tabular-nums text-ink-900/90 placeholder:text-ink-300 focus:outline-none"
          />
          <span className="ml-2 text-[18px] font-medium text-ink-500">€</span>
        </div>
      </label>

      {services.length > 0 ? (
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-medium text-ink-500">Paslauga</span>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {services.map((s) => {
              const active = serviceId === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => pickService(s)}
                  aria-pressed={active}
                  className={`flex shrink-0 flex-col items-start gap-0.5 rounded-[14px] border px-4 py-2.5 text-left transition-colors ${
                    active
                      ? "border-accent bg-accent-soft"
                      : "border-hair bg-white hover:border-accent/40"
                  }`}
                >
                  <span
                    className={`text-[13px] font-semibold ${
                      active ? "text-accent-deep" : "text-ink-900/90"
                    }`}
                  >
                    {s.name}
                  </span>
                  <span className="text-[11px] tabular-nums text-ink-500">
                    €{centsToInput(s.price_cents)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="rounded-[12px] border border-dashed border-hair bg-cream px-3.5 py-2.5 text-[12px] text-ink-500">
          Dar nepridėjai paslaugų.{" "}
          <Link
            href="/services"
            className="font-medium text-accent hover:text-accent-deep"
          >
            Tvarkyti paslaugas →
          </Link>
        </p>
      )}

      <div className="flex flex-col gap-2">
        <span className="text-[12px] font-medium text-ink-500">
          Apmokėjimo būdas
        </span>
        <div className="grid grid-cols-3 gap-2">
          {PAYMENT_OPTIONS.map((p) => {
            const active = paymentMethod === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPaymentMethod(p.id)}
                aria-pressed={active}
                className={`rounded-[14px] border px-3 py-3 text-[13px] font-medium transition-colors ${
                  active
                    ? "border-accent bg-accent-soft text-accent-deep"
                    : "border-hair bg-white text-ink-700 hover:border-accent/40"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {noteOpen ? (
        <label className="flex flex-col gap-1.5 text-[12px] font-medium text-ink-500">
          Pastaba
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={200}
            placeholder="Nebūtina"
            className="rounded-[14px] border border-hair bg-white px-3.5 py-2.5 text-[14px] text-ink-900/90 placeholder:text-ink-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </label>
      ) : (
        <button
          type="button"
          onClick={() => setNoteOpen(true)}
          className="self-start rounded-[10px] px-2 py-1 text-[13px] font-medium text-ink-500 hover:text-ink-900/90"
        >
          + Pridėti pastabą
        </button>
      )}

      {error ? (
        <p className="rounded-[12px] bg-expense-bg px-3.5 py-2.5 text-[13px] text-expense">
          {error}
        </p>
      ) : null}

      <Button
        variant="primary"
        type="submit"
        isLoading={pending}
        disabled={submitDisabled}
        className="!h-auto !rounded-[14px] !px-5 !py-3 !text-[14px]"
      >
        Pridėti
      </Button>
    </form>
  );
}
