import Link from "next/link";
import { formatEur } from "@/lib/format";
import type { ServiceBucket } from "@/lib/insights";

type Tone = {
  square: string;
  badge: string;
  badgeText: string;
  bar: string;
};

const TONES: ReadonlyArray<Tone> = [
  { square: "#E5E0F4", badge: "#E5E0F4", badgeText: "#5A4A8E", bar: "#BFB1E8" },
  { square: "#FFE0E0", badge: "#FFE0E0", badgeText: "#A03A3A", bar: "#F4A8A8" },
  { square: "#DDE9F4", badge: "#DDE9F4", badgeText: "#3A5E8E", bar: "#A8C5E8" },
  { square: "#FFEDCB", badge: "#FFEDCB", badgeText: "#8A6418", bar: "#F4C97A" },
  { square: "#DDF4EC", badge: "#DDF4EC", badgeText: "#1F7A4B", bar: "#A8DCC4" },
];

function toneFor(key: string, fallbackIndex: number): Tone {
  let hash = 0;
  for (let i = 0; i < key.length; i++)
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  return (
    TONES[Math.abs(hash) % TONES.length] ?? TONES[fallbackIndex % TONES.length]!
  );
}

export function TopServicesCard({
  services,
  totalCents,
}: {
  services: ReadonlyArray<ServiceBucket>;
  totalCents: number;
}) {
  if (services.length === 0) {
    return (
      <section
        aria-label="Populiariausios paslaugos"
        className="rounded-[22px] bg-white p-6 shadow-[0_1px_2px_rgba(23,33,29,0.04),_0_8px_24px_rgba(23,33,29,0.05)] lg:p-[30px]"
      >
        <Header />
        <p className="mt-3 text-[13px] leading-[1.55] text-ink-500">
          Kai pridėsi įrašų prie paslaugų, čia matysi populiariausias.
        </p>
        <FooterLink />
      </section>
    );
  }
  const top = services.slice(0, 5);
  const max = Math.max(...top.map((s) => s.totalCents), 1);
  const safeTotal = totalCents > 0 ? totalCents : max;

  return (
    <section
      aria-label="Populiariausios paslaugos"
      className="rounded-[22px] bg-white p-6 shadow-[0_1px_2px_rgba(23,33,29,0.04),_0_8px_24px_rgba(23,33,29,0.05)] lg:p-[30px]"
    >
      <Header />

      {/* Mobile: horizontal snap scroll. Desktop: equal 5-col grid. */}
      <div className="-mx-6 mt-5 overflow-x-auto px-6 pb-2 [scrollbar-width:none] lg:mx-0 lg:mt-7 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-3 lg:grid lg:w-auto lg:grid-cols-5 lg:gap-4">
          {top.map((s, i) => (
            <ServiceTile
              key={s.key}
              service={s}
              tone={toneFor(s.key, i)}
              rank={i}
              barRatio={s.totalCents / max}
              sharePct={Math.round((s.totalCents / safeTotal) * 100)}
            />
          ))}
        </div>
      </div>

      <FooterLink />
    </section>
  );
}

function Header() {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-500">
        Populiariausios paslaugos
      </div>
      <div className="mt-1 text-[16px] font-semibold tracking-[-0.018em] text-ink-900/90 lg:text-[18px]">
        Pagal pajamas
      </div>
    </div>
  );
}

function FooterLink() {
  return (
    <div className="mt-6 flex justify-center border-t border-hair pt-4 lg:justify-start">
      <Link
        href="/services"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent transition-colors hover:text-accent-deep"
      >
        Žiūrėti visas paslaugas
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </Link>
    </div>
  );
}

const BAR_OPACITY_BY_RANK = [1, 0.88, 0.74, 0.6, 0.48];

function ServiceTile({
  service,
  tone,
  rank,
  barRatio,
  sharePct,
}: {
  service: ServiceBucket;
  tone: Tone;
  rank: number;
  barRatio: number;
  sharePct: number;
}) {
  const initial = service.name.trim().slice(0, 1).toUpperCase() || "·";
  const isZero = service.totalCents === 0;
  const isTop = rank === 0;
  const barWidthPct = isZero ? 100 : Math.max(barRatio * 100, 8);
  const barFill = isZero
    ? "#E8E4DA"
    : isTop
      ? "linear-gradient(90deg, #1F7A6B, #185E53)"
      : tone.bar;
  const barOpacity = isZero || isTop ? 1 : (BAR_OPACITY_BY_RANK[rank] ?? 0.4);

  const surfaceClass = isTop
    ? "border-[rgba(23,33,29,0.1)] bg-[#FBFAF6] shadow-[0_1px_2px_rgba(23,33,29,0.05),_0_12px_28px_-12px_rgba(31,122,107,0.25)]"
    : "border-hair bg-white shadow-[0_1px_2px_rgba(23,33,29,0.04),_0_6px_18px_-10px_rgba(23,33,29,0.08)]";

  return (
    <div
      className={`group flex w-[210px] shrink-0 flex-col rounded-[18px] border p-5 transition-[transform,box-shadow] duration-200 ease-out lg:w-auto lg:hover:-translate-y-[1px] lg:hover:shadow-[0_2px_4px_rgba(23,33,29,0.05),_0_16px_36px_-14px_rgba(23,33,29,0.18)] ${surfaceClass}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          aria-hidden
          className="flex h-11 w-11 items-center justify-center rounded-[14px] text-[16px] font-semibold tracking-[-0.012em] text-ink-900/90"
          style={{ background: tone.square }}
        >
          {initial}
        </span>
        <span
          aria-hidden
          className="inline-flex items-center rounded-full px-2.5 py-[3px] text-[11px] font-bold tabular-nums"
          style={{ background: tone.badge, color: tone.badgeText }}
        >
          ×{service.count}
        </span>
      </div>

      <div className="mt-4 truncate text-[14px] font-medium tracking-[-0.012em] text-ink-700">
        {service.name}
      </div>

      <div className="mt-0.5 flex items-baseline gap-0.5 tabular-nums">
        <span className="text-[24px] font-semibold leading-[1.1] tracking-[-0.024em] text-ink-900">
          {formatEur(service.totalCents).replace(/\s?€/, "")}
        </span>
        <span className="ml-0.5 text-[14px] font-medium text-ink-500">€</span>
      </div>

      <div className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-ink-500 tabular-nums">
        {sharePct}% pajamų
      </div>

      <div className="mt-4 h-[6px] overflow-hidden rounded-full bg-[#EEEAE0]">
        <div
          className="h-full rounded-full"
          style={{
            width: `${barWidthPct}%`,
            background: barFill,
            opacity: barOpacity,
          }}
        />
      </div>
    </div>
  );
}
