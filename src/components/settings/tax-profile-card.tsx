"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateTaxProfile } from "@/app/(app)/settings/actions";
import { AccordionRow } from "@/components/ui/accordion-row";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { useT } from "@/i18n/locale-provider";
import type { TaxProfile } from "@/lib/tax";

type Mode = TaxProfile["taxMode"];
type IvExpense = TaxProfile["ivExpenseMode"];

export function TaxProfileCard({
  initial,
  canWrite = true,
  onSaved,
}: {
  initial: TaxProfile;
  canWrite?: boolean;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const t = useT();
  const tx = t.settings.tax;

  const [mode, setMode] = useState<Mode>(initial.taxMode);
  const [ivExpense, setIvExpense] = useState<IvExpense>(initial.ivExpenseMode);
  const [includePsd, setIncludePsd] = useState<boolean>(initial.includePsd);
  const [customPercent, setCustomPercent] = useState<string>(
    initial.customTaxPercent !== null
      ? String(initial.customTaxPercent).replace(".", ",")
      : "",
  );
  const [vlYearly, setVlYearly] = useState<string>(
    initial.vlYearlyCostCents !== null
      ? String(initial.vlYearlyCostCents / 100).replace(".", ",")
      : "",
  );
  const [vlValidUntil, setVlValidUntil] = useState<string>(
    initial.vlValidUntil ?? "",
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = () => {
    setError(null);
    const fd = new FormData();
    fd.set("tax_mode", mode);
    if (mode === "iv") {
      fd.set("iv_expense_mode", ivExpense);
      if (includePsd) fd.set("include_psd", "on");
    } else if (mode === "vl") {
      if (vlYearly.trim() !== "")
        fd.set("vl_yearly_cost", vlYearly.replace(",", "."));
      if (vlValidUntil) fd.set("vl_valid_until", vlValidUntil);
      if (includePsd) fd.set("include_psd", "on");
    } else {
      fd.set("custom_tax_percent", customPercent.replace(",", "."));
    }
    startTransition(async () => {
      try {
        await updateTaxProfile(fd);
        router.refresh();
        onSaved?.();
      } catch (e) {
        setError(e instanceof Error ? e.message : t.common.genericError);
      }
    });
  };

  return (
    <div className="flex flex-col">
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-ink-500">
          {tx.modeLabel}
        </span>
        <div
          role="tablist"
          aria-label={tx.modeLabel}
          className="mt-2 grid grid-cols-3 gap-1 rounded-[18px] bg-cream p-1 ring-1 ring-hair"
        >
          {(["iv", "vl", "custom"] as const).map((m) => {
            const active = mode === m;
            return (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setMode(m)}
                className={`rounded-[14px] px-2 py-2 text-center text-[12px] font-medium leading-tight tracking-[-0.008em] transition-colors ${
                  active
                    ? "bg-accent text-white shadow-[0_1px_3px_rgba(0,0,0,0.18)]"
                    : "text-ink-700 hover:text-ink-900/90"
                }`}
              >
                {tx.modes[m]}
              </button>
            );
          })}
        </div>
      </div>

      {mode === "iv" ? (
        <div className="mt-5 flex flex-col gap-4">
          <fieldset className="flex flex-col gap-2">
            <legend className="text-[11px] font-semibold uppercase tracking-[0.05em] text-ink-500">
              {tx.iv.expenseModeLabel}
            </legend>
            <ExpenseOption
              checked={ivExpense === "fixed_30"}
              onSelect={() => setIvExpense("fixed_30")}
              label={tx.iv.fixed30}
              helper={tx.iv.fixed30Helper}
            />
            <ExpenseOption
              checked={ivExpense === "actual"}
              onSelect={() => setIvExpense("actual")}
              label={tx.iv.actual}
              helper={tx.iv.actualHelper}
            />
          </fieldset>

          <PsdToggle
            checked={includePsd}
            onToggle={() => setIncludePsd((v) => !v)}
            label={tx.iv.psdToggle}
            helper={tx.iv.psdHelper}
          />
        </div>
      ) : mode === "vl" ? (
        <div className="mt-5 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-[12px] font-medium text-ink-500">
            {tx.vl.yearlyCostLabel}
            <div className="flex items-center rounded-[14px] border border-hair bg-surface px-3.5 py-2.5 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30">
              <input
                type="text"
                inputMode="decimal"
                value={vlYearly}
                onChange={(e) => setVlYearly(cleanAmount(e.target.value))}
                placeholder={tx.vl.yearlyCostPlaceholder}
                className="w-full bg-transparent text-[16px] font-medium tabular-nums text-ink-900/90 placeholder:text-ink-500 focus:outline-none"
              />
              <span aria-hidden className="ml-2 text-[14px] font-medium text-ink-500">
                €
              </span>
            </div>
          </label>
          <label className="flex flex-col gap-1.5 text-[12px] font-medium text-ink-500">
            {tx.vl.validUntilLabel}
            <DatePicker
              value={vlValidUntil}
              onChange={setVlValidUntil}
              placeholder={tx.vl.validUntilLabel}
              ariaLabel={tx.vl.validUntilLabel}
            />
          </label>
          <PsdToggle
            checked={includePsd}
            onToggle={() => setIncludePsd((v) => !v)}
            label={tx.vl.psdToggle}
            helper={tx.vl.psdHelper}
          />
          {vlYearly.trim() === "" ? (
            <p className="rounded-[12px] border border-dashed border-hair bg-cream px-3.5 py-2.5 text-[12px] text-ink-500">
              {tx.vl.emptyHint}
            </p>
          ) : (
            <p className="rounded-[12px] bg-cream px-3.5 py-2.5 text-[12px] leading-[1.5] text-ink-500">
              {tx.vl.reserveHelper}
            </p>
          )}
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-2">
          <label className="flex flex-col gap-1.5 text-[12px] font-medium text-ink-500">
            {tx.custom.percentLabel}
            <div className="flex items-center rounded-[14px] border border-hair bg-surface px-3.5 py-2.5 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30">
              <input
                type="text"
                inputMode="numeric"
                value={customPercent}
                onChange={(e) =>
                  setCustomPercent(
                    e.target.value.replace(/[^\d.,]/g, "").slice(0, 5),
                  )
                }
                placeholder={tx.custom.percentPlaceholder}
                className="w-full bg-transparent text-[16px] font-medium tabular-nums text-ink-900/90 placeholder:text-ink-500 focus:outline-none"
              />
              <span aria-hidden className="ml-2 text-[14px] font-medium text-ink-500">
                %
              </span>
            </div>
            <span className="text-[12px] font-normal text-ink-500">
              {tx.custom.helper}
            </span>
          </label>
        </div>
      )}

      {error ? (
        <p className="mt-4 rounded-[12px] bg-expense-bg px-3.5 py-2.5 text-[13px] text-expense">
          {error}
        </p>
      ) : null}

      <div className="mt-5 flex flex-col gap-1 border-t border-hair pt-3">
        {mode === "iv" ? (
          <>
            <AccordionRow header={<ExplainTitle>{t.dashboard.reserveBreakdownGpm}</ExplainTitle>}>
              {tx.explain.gpm}
            </AccordionRow>
            <AccordionRow header={<ExplainTitle>{t.dashboard.reserveBreakdownVsd}</ExplainTitle>}>
              {tx.explain.vsd}
            </AccordionRow>
            <AccordionRow header={<ExplainTitle>{t.dashboard.reserveBreakdownPsd}</ExplainTitle>}>
              {tx.explain.psd}
            </AccordionRow>
          </>
        ) : mode === "vl" ? (
          <>
            <AccordionRow header={<ExplainTitle>{t.dashboard.reserveBreakdownVl}</ExplainTitle>}>
              {tx.explain.vl}
            </AccordionRow>
            <AccordionRow header={<ExplainTitle>{t.dashboard.reserveBreakdownVsd}</ExplainTitle>}>
              {tx.explain.vlVsd}
            </AccordionRow>
            <AccordionRow header={<ExplainTitle>{t.dashboard.reserveBreakdownPsd}</ExplainTitle>}>
              {tx.explain.vlPsd}
            </AccordionRow>
          </>
        ) : null}
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {!canWrite ? (
          <p className="rounded-[12px] bg-accent-soft/60 px-3.5 py-2.5 text-[13px] text-accent-deep">
            {tx.readOnly}
          </p>
        ) : null}
        <Button
          variant="primary"
          type="button"
          onClick={submit}
          isLoading={pending}
          disabled={pending || !canWrite}
          className="!h-auto !rounded-[14px] !px-5 !py-3 !text-[14px]"
        >
          {tx.saveCta}
        </Button>
        <p className="text-[11px] leading-[1.5] text-ink-500">
          {tx.disclaimer}
        </p>
      </div>
    </div>
  );
}

function ExplainTitle({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[13px] font-medium text-ink-900/90">{children}</span>
  );
}

function ExpenseOption({
  checked,
  onSelect,
  label,
  helper,
}: {
  checked: boolean;
  onSelect: () => void;
  label: string;
  helper: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={checked}
      className={`flex flex-col gap-1 rounded-[14px] border px-4 py-3 text-left transition-colors ${
        checked
          ? "border-accent bg-accent-soft"
          : "border-hair bg-surface hover:border-accent/40"
      }`}
    >
      <span className="flex items-center gap-2">
        <span
          aria-hidden
          className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
            checked ? "border-accent" : "border-hair"
          }`}
        >
          {checked ? (
            <span className="block h-2 w-2 rounded-full bg-accent" />
          ) : null}
        </span>
        <span
          className={`text-[14px] font-medium tracking-[-0.008em] ${
            checked ? "text-accent-deep" : "text-ink-900/90"
          }`}
        >
          {label}
        </span>
      </span>
      <span className="pl-6 text-[12px] leading-[1.45] text-ink-500">
        {helper}
      </span>
    </button>
  );
}

function PsdToggle({
  checked,
  onToggle,
  label,
  helper,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  helper: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className="flex items-start gap-3 rounded-[14px] border border-hair bg-surface px-4 py-3 text-left transition-colors hover:border-accent/40"
    >
      <span
        aria-hidden
        className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-[6px] border-2 transition-colors ${
          checked ? "border-accent bg-accent text-white" : "border-hair bg-surface"
        }`}
      >
        {checked ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path
              d="M2.5 6.2L4.8 8.5L9.5 3.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </span>
      <span className="flex flex-col">
        <span className="text-[14px] font-medium tracking-[-0.008em] text-ink-900/90">
          {label}
        </span>
        <span className="mt-0.5 text-[12px] leading-[1.45] text-ink-500">
          {helper}
        </span>
      </span>
    </button>
  );
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
