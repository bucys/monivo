type IconProps = { className?: string };

const base = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function IconList(p: IconProps) {
  return (
    <svg {...base} className={p.className}>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h10" />
    </svg>
  );
}
export function IconReceipt(p: IconProps) {
  return (
    <svg {...base} className={p.className}>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </svg>
  );
}
export function IconNote(p: IconProps) {
  return (
    <svg {...base} className={p.className}>
      <rect x="5" y="3" width="14" height="18" rx="2.5" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </svg>
  );
}
export function IconSparkle(p: IconProps) {
  return (
    <svg {...base} className={p.className} fill="currentColor" stroke="none">
      <path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6L12 2z" />
    </svg>
  );
}
export function IconGlobe(p: IconProps) {
  return (
    <svg {...base} className={p.className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.8 3.4 2.8 14.6 0 18M12 3c-2.8 3.4-2.8 14.6 0 18" />
    </svg>
  );
}
export function IconExport(p: IconProps) {
  return (
    <svg {...base} className={p.className}>
      <path d="M12 16V4" />
      <path d="M7 9l5-5 5 5" />
      <path d="M5 20h14" />
    </svg>
  );
}
export function IconPerson(p: IconProps) {
  return (
    <svg {...base} className={p.className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
    </svg>
  );
}
export function IconSignOut(p: IconProps) {
  return (
    <svg {...base} className={p.className}>
      <path d="M15 5h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3" />
      <path d="M10 8l-4 4 4 4" />
      <path d="M6 12h12" />
    </svg>
  );
}
export function IconChevron(p: IconProps) {
  return (
    <svg {...base} width="12" height="12" className={p.className}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
export function IconCrown(p: IconProps) {
  return (
    <svg {...base} className={p.className}>
      <path d="M3 8l4 4 5-7 5 7 4-4-2 11H5L3 8z" />
    </svg>
  );
}
