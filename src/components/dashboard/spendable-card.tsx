import { formatEur } from "@/lib/format";

export function SpendableCard({
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
  const isNegative = spendableCents < 0;

  return (
    <section
      aria-label="Gali išleisti"
      className="rounded-[24px] border border-hair bg-white p-6 shadow-card sm:p-7 lg:p-8"
    >
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-500">
        Gali išleisti
      </div>
      <div className="mt-2 text-[40px] font-semibold leading-[1.05] tracking-[-0.028em] tabular-nums text-ink-900/90 lg:text-[48px]">
        {formatEur(spendableCents)}
      </div>
      {isNegative ? (
        <div className="mt-1 text-[12px] text-ink-500">Šį mėnesį viršyta.</div>
      ) : null}
      <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[12px] text-ink-500">
        <span>
          Pajamos{" "}
          <span className="font-medium tabular-nums text-ink-900/90">
            {formatEur(incomeCents)}
          </span>
        </span>
        <span aria-hidden>·</span>
        <span>
          Išlaidos{" "}
          <span className="font-medium tabular-nums text-ink-900/90">
            {formatEur(expenseCents)}
          </span>
        </span>
        <span aria-hidden>·</span>
        <span>
          Atidėta{" "}
          <span className="font-medium tabular-nums text-ink-900/90">
            {formatEur(taxReserveCents)}
          </span>
        </span>
      </div>
    </section>
  );
}
