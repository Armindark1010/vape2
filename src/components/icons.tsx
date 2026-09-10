type P = { size?: number; className?: string; sw?: number };

const base = (p: P) => ({
  width: p.size ?? 20,
  height: p.size ?? 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: p.sw ?? 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: p.className,
  "aria-hidden": true,
});

export const IcSearch = (p: P) => (
  <svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
);
export const IcCart = (p: P) => (
  <svg {...base(p)}><path d="M6 7h12l1 13H5L6 7Z" /><path d="M9 10V6a3 3 0 0 1 6 0v4" /></svg>
);
export const IcHeart = (p: P & { filled?: boolean }) => (
  <svg {...base(p)} fill={p.filled ? "currentColor" : "none"}>
    <path d="M12 20.3 4.8 13a4.6 4.6 0 0 1 6.5-6.5l.7.7.7-.7A4.6 4.6 0 0 1 19.2 13L12 20.3Z" />
  </svg>
);
export const IcUser = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="8" r="4" /><path d="M4 20c1.6-3.4 4.6-5 8-5s6.4 1.6 8 5" /></svg>
);
export const IcMenu = (p: P) => (
  <svg {...base(p)}><path d="M4 7h16M4 12h16M4 17h10" /></svg>
);
export const IcClose = (p: P) => (
  <svg {...base(p)}><path d="m6 6 12 12M18 6 6 18" /></svg>
);
export const IcPlus = (p: P) => (
  <svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>
);
export const IcMinus = (p: P) => (
  <svg {...base(p)}><path d="M5 12h14" /></svg>
);
export const IcStar = (p: P & { filled?: boolean }) => (
  <svg {...base(p)} fill={p.filled ? "currentColor" : "none"}>
    <path d="m12 3 2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 16.9l-5.4 2.9 1.1-6.1L3.2 9.4l6.1-.8L12 3Z" />
  </svg>
);
export const IcChevronDown = (p: P) => (
  <svg {...base(p)}><path d="m6 9 6 6 6-6" /></svg>
);
export const IcChevronRight = (p: P) => (
  <svg {...base(p)}><path d="m9 6 6 6-6 6" /></svg>
);
export const IcArrowRight = (p: P) => (
  <svg {...base(p)}><path d="M4 12h16m-6-6 6 6-6 6" /></svg>
);
export const IcArrowLeft = (p: P) => (
  <svg {...base(p)}><path d="M20 12H4m6-6-6 6 6 6" /></svg>
);
export const IcTruck = (p: P) => (
  <svg {...base(p)}><path d="M2 6h12v10H2zM14 9h4l3 3v4h-7" /><circle cx="6.5" cy="17.5" r="1.8" /><circle cx="17.5" cy="17.5" r="1.8" /></svg>
);
export const IcShield = (p: P) => (
  <svg {...base(p)}><path d="M12 3 5 6v5c0 5 3 8.4 7 10 4-1.6 7-5 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></svg>
);
export const IcRefresh = (p: P) => (
  <svg {...base(p)}><path d="M20 11a8 8 0 0 0-14.9-3M4 13a8 8 0 0 0 14.9 3" /><path d="M20 4v4h-4M4 20v-4h4" /></svg>
);
export const IcCheck = (p: P) => (
  <svg {...base(p)}><path d="m4 12.5 5 5L20 6.5" /></svg>
);
export const IcTrash = (p: P) => (
  <svg {...base(p)}><path d="M4 7h16M9 7V5h6v2m-8 0 1 13h8l1-13" /></svg>
);
export const IcFilter = (p: P) => (
  <svg {...base(p)}><path d="M4 6h16M7 12h10m-7 6h4" /></svg>
);
export const IcPackage = (p: P) => (
  <svg {...base(p)}><path d="m12 3 8 4v10l-8 4-8-4V7l8-4Z" /><path d="m4.5 7.5 7.5 4 7.5-4M12 11.5V21" /></svg>
);
export const IcCard = (p: P) => (
  <svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h4" /></svg>
);
export const IcLock = (p: P) => (
  <svg {...base(p)}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
);
export const IcPin = (p: P) => (
  <svg {...base(p)}><path d="M12 21s-7-5.3-7-11a7 7 0 0 1 14 0c0 5.7-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>
);
export const IcMail = (p: P) => (
  <svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
);
export const IcPhone = (p: P) => (
  <svg {...base(p)}><path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>
);
export const IcChat = (p: P) => (
  <svg {...base(p)}><path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5Z" /></svg>
);
export const IcInstagram = (p: P) => (
  <svg {...base(p)}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" /></svg>
);
export const IcX = (p: P) => (
  <svg {...base(p)}><path d="m4 4 16 16M20 4 4 20" /></svg>
);
export const IcYoutube = (p: P) => (
  <svg {...base(p)}><rect x="3" y="6" width="18" height="12" rx="3" /><path d="m10 9.5 5 2.5-5 2.5v-5Z" /></svg>
);
export const IcGrid = (p: P) => (
  <svg {...base(p)}><rect x="4" y="4" width="7" height="7" /><rect x="13" y="4" width="7" height="7" /><rect x="4" y="13" width="7" height="7" /><rect x="13" y="13" width="7" height="7" /></svg>
);
export const IcBox = (p: P) => (
  <svg {...base(p)}><path d="m12 3 8 4v10l-8 4-8-4V7l8-4Z" /><path d="M12 12v9M4 7.5l8 4 8-4" /></svg>
);
export const IcTag = (p: P) => (
  <svg {...base(p)}><path d="M3 3h8l10 10-8 8L3 11V3Z" /><circle cx="8" cy="8" r="1.4" /></svg>
);
export const IcUsers = (p: P) => (
  <svg {...base(p)}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c1.3-3 3.8-4.5 6.5-4.5s5.2 1.5 6.5 4.5" /><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M17.5 15.7c2 .6 3.4 1.9 4 4.3" /></svg>
);
export const IcChart = (p: P) => (
  <svg {...base(p)}><path d="M4 20V10M10 20V4M16 20v-8M21 20H3" /></svg>
);
export const IcSliders = (p: P) => (
  <svg {...base(p)}><path d="M5 4v6m0 4v6m7-16v2m0 4v10m7-16v10m0 4v2" /><circle cx="5" cy="12" r="2" /><circle cx="12" cy="8" r="2" /><circle cx="19" cy="16" r="2" /></svg>
);
export const IcEye = (p: P) => (
  <svg {...base(p)}><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" /><circle cx="12" cy="12" r="3" /></svg>
);
export const IcZap = (p: P) => (
  <svg {...base(p)}><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" /></svg>
);
export const IcMoon = (p: P) => (
  <svg {...base(p)}><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" /></svg>
);
export const IcLogo = (p: P) => (
  <svg width={p.size ?? 22} height={p.size ?? 22} viewBox="0 0 24 24" fill="none" className={p.className} aria-hidden>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
    <path d="M8.5 16V8l7 8V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
