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
    <div className="flex flex-col gap-1.5 rounded-[18px] border border-hair bg-white p-4 lg:p-5">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.07em] text-ink-500">
        <span aria-hidden className={`block h-1.5 w-1.5 rounded-full ${dotClass[tone]}`} />
        {label}
      </div>
      <div className="text-[20px] font-semibold tracking-[-0.018em] tabular-nums text-ink-900/90 lg:text-[22px]">
        {cents === null ? "—" : formatEur(cents)}
      </div>
      {caption ? (
        <div className="text-[11px] text-ink-500">{caption}</div>
      ) : null}
    </div>
  );
}
