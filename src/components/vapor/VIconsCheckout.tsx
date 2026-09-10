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

export const ArrowLeftIcon = (p: P) => <svg {...b(p)}><path d="M19 12H5m6-7-7 7 7 7" /></svg>;
export const CheckIcon = (p: P) => <svg {...b(p)}><path d="m4.5 12.5 5 5L19.5 7" /></svg>;
export const ShieldIcon = (p: P) => <svg {...b(p)}><path d="M12 3 5 6v5c0 4.6 2.8 8 7 10 4.2-2 7-5.4 7-10V6l-7-3Z" /></svg>;
export const DropletIcon = (p: P) => <svg {...b(p)}><path d="M12 3s6 6.2 6 10.6a6 6 0 0 1-12 0C6 9.2 12 3 12 3Z" /></svg>;
