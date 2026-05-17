import { formatEur } from "@/lib/format";

export function SpendableHero({
  spendableCents,
  incomeCents,
  expenseCents,
  taxReserveCents,
  heroSub,
}: {
  spendableCents: number;
  incomeCents: number;
  expenseCents: number;
  taxReserveCents: number;
  heroSub: string;
}) {
  const display = Math.max(0, spendableCents);
  const free = Math.max(0, spendableCents);
  const expSeg = Math.max(0, expenseCents);
  const taxSeg = Math.max(0, taxReserveCents);
  const total = free + expSeg + taxSeg;
  const pct = (n: number) => (total > 0 ? `${(n / total) * 100}%` : "0%");
  const incomeText = formatEur(incomeCents).replace(/\s?€/, "");

  return (
    <section
      aria-label="Mėnesio apžvalga"
      className="relative overflow-hidden rounded-[28px] px-[22px] pb-[22px] pt-6 text-white shadow-[0_1px_2px_rgba(23,33,29,0.04),_0_20px_50px_-10px_rgba(31,122,107,0.18)] sm:p-7 lg:p-[30px]"
      style={{
        background:
          "linear-gradient(155deg, #2E8E7D 0%, #1F7A6B 55%, #185E53 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-[60px] h-[220px] w-[220px] rounded-full lg:-right-10 lg:-top-20 lg:h-[320px] lg:w-[320px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.18), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-10 h-[180px] w-[180px] rounded-full lg:-bottom-[120px] lg:left-[40%] lg:h-[280px] lg:w-[280px]"
        style={{
          background:
            "radial-gradient(circle, rgba(221,244,236,0.20), transparent 60%)",
        }}
      />

      <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-[30px]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[13px] font-medium tracking-tight opacity-85">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />
            </svg>
            Kiek galiu išleisti
          </div>
          <div className="mt-3 flex items-baseline gap-1 whitespace-nowrap text-[56px] font-semibold leading-none tracking-[-0.027em] tabular-nums sm:mt-4 sm:gap-1.5 sm:text-[64px] lg:text-[84px] lg:tracking-[-0.03em]">
            <span>{formatEur(display).replace(/\s?€/, "")}</span>
            <span className="text-[28px] font-normal opacity-70 lg:text-[36px]">
              €
            </span>
          </div>
          <p className="mt-2.5 max-w-[320px] text-[13px] leading-[1.45] opacity-75 lg:mt-3.5 lg:text-[14px] lg:opacity-80">
            {heroSub}
          </p>

          {/* mobile-only stacked bar + caption */}
          <div className="mt-[18px] lg:hidden">
            <div
              className="flex h-1.5 overflow-hidden rounded-full"
              style={{ background: "rgba(255,255,255,0.18)" }}
            >
              <div style={{ width: pct(free), background: "#DDF4EC" }} />
              <div
                style={{
                  width: pct(expSeg),
                  background: "rgba(255,231,231,0.85)",
                }}
              />
              <div
                style={{
                  width: pct(taxSeg),
                  background: "rgba(255,242,217,0.9)",
                }}
              />
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px] opacity-75 tabular-nums">
              <span>Šio mėnesio pajamos</span>
              <span>{incomeText} € </span>
            </div>
          </div>
        </div>

        {/* desktop-only breakdown panel */}
        <div className="hidden lg:block">
          <div className="mb-3.5 text-[11px] font-semibold uppercase tracking-[0.08em] opacity-70">
            Mėnesio sudėtis
          </div>
          <div
            className="flex h-2.5 overflow-hidden rounded-full"
            style={{ background: "rgba(255,255,255,0.18)" }}
          >
            <div style={{ width: pct(free), background: "#DDF4EC" }} />
            <div
              style={{
                width: pct(expSeg),
                background: "rgba(255,231,231,0.95)",
              }}
            />
            <div
              style={{
                width: pct(taxSeg),
                background: "rgba(255,242,217,0.95)",
              }}
            />
          </div>
          <div className="mt-[18px] grid grid-cols-3 gap-3">
            <BreakdownItem
              label="Pajamos"
              cents={incomeCents}
              dot="#DDF4EC"
            />
            <BreakdownItem
              label="Išlaidos"
              cents={expenseCents}
              dot="#FFE7E7"
            />
            <BreakdownItem
              label="Atidėta"
              cents={taxReserveCents}
              dot="#FFF2D9"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function BreakdownItem({
  label,
  cents,
  dot,
}: {
  label: string;
  cents: number;
  dot: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[12px] font-medium opacity-85">
        <span
          aria-hidden
          className="block h-[7px] w-[7px] rounded-[2px]"
          style={{ background: dot }}
        />
        {label}
      </div>
      <div className="mt-1.5 flex items-baseline gap-1 whitespace-nowrap text-[22px] font-semibold tracking-[-0.018em] tabular-nums">
        <span>{formatEur(cents).replace(/\s?€/, "")}</span>
        <span className="text-[14px] opacity-60">€</span>
      </div>
    </div>
  );
}
