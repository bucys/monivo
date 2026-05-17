import { formatEur } from "@/lib/format";

export function SpendableHero({
  spendableCents,
  incomeCents,
  expenseCents,
  taxReserveCents,
}: {
  spendableCents: number;
  incomeCents: number;
  expenseCents: number;
  taxReserveCents: number;
}) {
  const wentNegative = spendableCents < 0;
  const display = Math.max(0, spendableCents);

  return (
    <section
      aria-label="Mėnesio apžvalga"
      className="relative overflow-hidden rounded-[28px] border border-hair shadow-card"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="relative bg-gradient-to-br from-accent-soft via-[#E7F4ED] to-white p-8 sm:p-10 lg:p-12">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-accent-deep">
            <span aria-hidden className="block h-1.5 w-1.5 rounded-full bg-accent" />
            Kiek galiu išleisti
          </div>
          <div className="mt-5 text-[56px] font-semibold leading-[0.95] tracking-[-0.035em] tabular-nums text-ink-900/90 sm:text-[64px] lg:text-[80px]">
            {formatEur(display)}
          </div>
          {wentNegative ? (
            <p className="mt-3 text-[13px] leading-[1.5] text-ink-500">
              Šį mėnesį išlaidos viršija pajamas.
            </p>
          ) : (
            <p className="mt-3 text-[13px] leading-[1.5] text-ink-500">
              Po mokesčių rezervo ir išlaidų.
            </p>
          )}
        </div>

        <div className="border-t border-hair bg-white p-7 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-500">
            Mėnesio sudėtis
          </h2>
          <dl className="mt-5 flex flex-col">
            <BreakdownRow tone="income" label="Pajamos" cents={incomeCents} />
            <BreakdownRow tone="expense" label="Išlaidos" cents={expenseCents} />
            <BreakdownRow tone="tax" label="Atidėta mokesčiams" cents={taxReserveCents} />
          </dl>
        </div>
      </div>
    </section>
  );
}

const dotClass = {
  income: "bg-accent",
  expense: "bg-expense",
  tax: "bg-[#E2B673]",
} as const;

function BreakdownRow({
  tone,
  label,
  cents,
}: {
  tone: keyof typeof dotClass;
  label: string;
  cents: number;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-hair py-3.5 first:border-t-0 first:pt-0">
      <dt className="flex items-center gap-2 text-[13px] text-ink-700">
        <span aria-hidden className={`block h-1.5 w-1.5 rounded-full ${dotClass[tone]}`} />
        {label}
      </dt>
      <dd className="text-[15px] font-semibold tabular-nums text-ink-900/90">
        {formatEur(cents)}
      </dd>
    </div>
  );
}
