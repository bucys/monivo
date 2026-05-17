import { formatEur } from "@/lib/format";

type Tone = "income" | "expense" | "tax";

const dotClass: Record<Tone, string> = {
  income: "bg-accent",
  expense: "bg-expense",
  tax: "bg-[#E2B673]",
};

export function StatTile({
  label,
  cents,
  tone,
  caption,
}: {
  label: string;
  cents: number | null;
  tone: Tone;
  caption?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 py-1">
      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.07em] text-ink-500">
        <span aria-hidden className={`block h-1.5 w-1.5 rounded-full ${dotClass[tone]}`} />
        {label}
      </div>
      <div className="text-[18px] font-semibold tracking-[-0.018em] tabular-nums text-ink-900/90 lg:text-[20px]">
        {cents === null ? "—" : formatEur(cents)}
      </div>
      {caption ? (
        <div className="text-[11px] text-ink-500">{caption}</div>
      ) : null}
    </div>
  );
}

export function StatRow({
  label,
  cents,
  tone,
  caption,
}: {
  label: string;
  cents: number | null;
  tone: Tone;
  caption?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-hair py-4 first:border-t-0 first:pt-1">
      <div className="flex flex-col">
        <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.07em] text-ink-500">
          <span aria-hidden className={`block h-1.5 w-1.5 rounded-full ${dotClass[tone]}`} />
          {label}
        </span>
        {caption ? (
          <span className="mt-0.5 text-[11px] text-ink-500">{caption}</span>
        ) : null}
      </div>
      <span className="text-[18px] font-semibold tabular-nums text-ink-900/90">
        {cents === null ? "—" : formatEur(cents)}
      </span>
    </div>
  );
}
