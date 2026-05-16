"use client";

export function AppFab() {
  return (
    <button
      type="button"
      onClick={() => {
        // Phase 9 will wire the add sheet here.
        if (typeof window !== "undefined") {
          // eslint-disable-next-line no-console
          console.log("[fab] add-entry tap (Phase 9 wires the sheet)");
        }
      }}
      aria-label="Pridėti įrašą"
      className="fixed bottom-[40px] left-1/2 z-40 -translate-x-1/2 lg:hidden"
    >
      <span className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-gradient-to-br from-[#2E8E7D] via-accent to-accent-deep text-white shadow-fab transition-transform active:scale-95">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </span>
    </button>
  );
}
