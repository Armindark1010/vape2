/* آیکون‌های باریک و سبک برای رابط لمسی */
type P = { size?: number; className?: string; sw?: number };

const b = (p: P) => ({
  width: p.size ?? 22,
  height: p.size ?? 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: p.sw ?? 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: p.className,
  "aria-hidden": true,
});

export const HomeIcon = (p: P) => (
  <svg {...b(p)}><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z" /></svg>
);
export const GridIcon = (p: P) => (
  <svg {...b(p)}><rect x="3.5" y="3.5" width="7" height="7" rx="1.6" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.6" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.6" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.6" /></svg>
);
export const SearchIcon = (p: P) => (
  <svg {...b(p)}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
);
export const BagIcon = (p: P) => (
  <svg {...b(p)}><path d="M6.5 8h11l.9 12.2a1 1 0 0 1-1 1.1H6.6a1 1 0 0 1-1-1.1Z" /><path d="M9 10.5V6a3 3 0 0 1 6 0v4.5" /></svg>
);
export const UserIcon = (p: P) => (
  <svg {...b(p)}><circle cx="12" cy="8" r="4" /><path d="M4.5 20.5c1.4-3.6 4.2-5.4 7.5-5.4s6.1 1.8 7.5 5.4" /></svg>
);
export const PlusIcon = (p: P) => (
  <svg {...b(p)}><path d="M12 5v14M5 12h14" /></svg>
);
export const MinusIcon = (p: P) => (
  <svg {...b(p)}><path d="M5 12h14" /></svg>
);
export const TrashIcon = (p: P) => (
  <svg {...b(p)}><path d="M4 7h16M9.5 7V5h5v2m-8 0 1 12.5h9L17.5 7" /></svg>
);
export const CheckIcon = (p: P) => (
  <svg {...b(p)}><path d="m4.5 12.5 5 5L19.5 7" /></svg>
);
export const CloseIcon = (p: P) => (
  <svg {...b(p)}><path d="m6 6 12 12M18 6 6 18" /></svg>
);
export const ChevronLeftIcon = (p: P) => (
  <svg {...b(p)}><path d="m14 6-6 6 6 6" /></svg>
);
export const ChevronDownIcon = (p: P) => (
  <svg {...b(p)}><path d="m6 9 6 6 6-6" /></svg>
);
export const FlameIcon = (p: P) => (
  <svg {...b(p)}><path d="M12 3s5.5 4.6 5.5 9.6a5.5 5.5 0 0 1-11 0C6.5 9.2 9 7 10.4 5.2c.4-.5.9-1 1.6-2.2Z" /></svg>
);
export const ZapIcon = (p: P) => (
  <svg {...b(p)}><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" /></svg>
);
export const ShieldIcon = (p: P) => (
  <svg {...b(p)}><path d="M12 3 5 6v5c0 4.6 2.8 8 7 10 4.2-2 7-5.4 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4.5" /></svg>
);
export const TruckIcon = (p: P) => (
  <svg {...b(p)}><path d="M2.5 6h11v11h-11zM13.5 10h3.6l2.9 3.3V17h-6.5" /><circle cx="6.5" cy="17.5" r="1.9" /><circle cx="17" cy="17.5" r="1.9" /></svg>
);
export const DropletIcon = (p: P) => (
  <svg {...b(p)}><path d="M12 3s6 6.2 6 10.6a6 6 0 0 1-12 0C6 9.2 12 3 12 3Z" /></svg>
);
export const HeartIcon = (p: P & { filled?: boolean }) => (
  <svg {...b(p)} fill={p.filled ? "currentColor" : "none"}>
    <path d="M12 20.3 4.8 13a4.6 4.6 0 0 1 6.5-6.5l.7.7.7-.7A4.6 4.6 0 0 1 19.2 13L12 20.3Z" />
  </svg>
);
export const StarIcon = (p: P & { filled?: boolean }) => (
  <svg {...b(p)} fill={p.filled ? "currentColor" : "none"}>
    <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5Z" />
  </svg>
);
export const ArrowLeftIcon = (p: P) => (
  <svg {...b(p)}><path d="M19 12H5m6-7-7 7 7 7" /></svg>
);
export const RefreshIcon = (p: P) => (
  <svg {...b(p)}><path d="M20 11a8 8 0 0 0-14.9-3M4 13a8 8 0 0 0 14.9 3" /><path d="M20 4v4h-4M4 20v-4h4" /></svg>
);
