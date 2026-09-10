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

export const PlusIcon = (p: P) => <svg {...b(p)}><path d="M12 5v14M5 12h14" /></svg>;
export const MinusIcon = (p: P) => <svg {...b(p)}><path d="M5 12h14" /></svg>;
export const TrashIcon = (p: P) => <svg {...b(p)}><path d="M4 7h16M9.5 7V5h5v2m-8 0 1 12.5h9L17.5 7" /></svg>;
export const ArrowLeftIcon = (p: P) => <svg {...b(p)}><path d="M19 12H5m6-7-7 7 7 7" /></svg>;
export const TagIcon = (p: P) => <svg {...b(p)}><path d="M3.5 3.5h8l9 9-8 8-9-9v-8Z" /><circle cx="8.5" cy="8.5" r="1.4" /></svg>;
export const CheckIcon = (p: P) => <svg {...b(p)}><path d="m4.5 12.5 5 5L19.5 7" /></svg>;
