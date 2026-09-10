type P = { size?: number; className?: string; sw?: number };

const b = (p: P) => ({
  width: p.size ?? 20,
  height: p.size ?? 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: p.sw ?? 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: p.className,
  "aria-hidden": true,
});

export const UserIcon = (p: P) => <svg {...b(p)}><circle cx="12" cy="8" r="4" /><path d="M4.5 20.5c1.4-3.6 4.2-5.4 7.5-5.4s6.1 1.8 7.5 5.4" /></svg>;
export const CheckIcon = (p: P) => <svg {...b(p)}><path d="m4.5 12.5 5 5L19.5 7" /></svg>;
export const ChevronLeftIcon = (p: P) => <svg {...b(p)}><path d="m14 6-6 6 6 6" /></svg>;
