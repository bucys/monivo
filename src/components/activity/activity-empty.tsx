export function ActivityEmpty({
  onReset,
  filtered,
}: {
  onReset?: () => void;
  filtered: boolean;
}) {
  return (
    <div className="flex flex-col items-center rounded-[22px] bg-white px-6 py-12 text-center shadow-[0_1px_2px_rgba(23,33,29,0.04),_0_8px_24px_rgba(23,33,29,0.05)]">
      <span
        aria-hidden
        className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-accent-soft text-accent-deep"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4" y="5" width="16" height="15" rx="3" />
          <path d="M8 3v4M16 3v4M4 10h16" />
        </svg>
      </span>
      <h3 className="mt-4 text-[15px] font-semibold tracking-[-0.012em] text-ink-900/90">
        {filtered ? "Pagal šį filtrą įrašų nėra." : "Šį mėnesį dar nieko nėra."}
      </h3>
      <p className="mt-1.5 max-w-[300px] text-[13px] leading-[1.5] text-ink-500">
        {filtered
          ? "Pakeisk filtrą arba pridėk naują įrašą."
          : "Pridėk pirmą įrašą — pamatysi jį čia."}
      </p>
      {filtered && onReset ? (
        <button
          type="button"
          onClick={onReset}
          className="mt-4 text-[13px] font-medium text-accent transition-colors hover:text-accent-deep"
        >
          Rodyti visus
        </button>
      ) : null}
    </div>
  );
}
