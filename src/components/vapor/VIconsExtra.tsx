type P = { size?: number; className?: string; sw?: number };

export const SlidersIcon = ({ size = 20, className, sw = 1.7 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" className={className} aria-hidden>
    <path d="M4 8h10M18 8h2M4 16h2M10 16h10" />
    <circle cx="16" cy="8" r="2.4" />
    <circle cx="8" cy="16" r="2.4" />
  </svg>
);
