"use client";

export function NotificationBell() {
  return (
    <button
      type="button"
      aria-label="Pranešimai"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/60 text-ink-700 ring-1 ring-hair/70 transition-colors hover:bg-white hover:text-ink-900/90"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M6 8a6 6 0 0 1 12 0c0 4.5 1.5 6 1.5 6h-15S6 12.5 6 8Z" />
        <path d="M10 19a2 2 0 0 0 4 0" />
      </svg>
    </button>
  );
}
