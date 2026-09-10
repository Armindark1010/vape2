"use client";

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn, fmt } from "@/lib/utils";
import { useStore } from "@/store/store";
import { IcStar, IcPlus, IcMinus, IcCheck, IcClose } from "@/components/icons";

/* ---------------- Button ---------------- */

const btnVariants = {
  primary: "bg-cream text-[#0c0c0e] hover:bg-white",
  gold: "bg-gold text-[#0c0c0e] hover:bg-goldsoft",
  outline: "border border-line2 text-cream hover:border-cream/50 hover:bg-white/[0.04]",
  ghost: "text-muted hover:text-cream",
  danger: "border border-danger/40 text-danger hover:bg-danger/10",
} as const;

const btnSizes = {
  sm: "h-9 px-4 text-[11px]",
  md: "h-11 px-6 text-[13px]",
  lg: "h-[52px] px-8 text-sm",
} as const;

export function Button({
  variant = "primary",
  size = "md",
  href,
  loading,
  className,
  children,
  ...rest
}: {
  variant?: keyof typeof btnVariants;
  size?: keyof typeof btnSizes;
  href?: string;
  loading?: boolean;
  className?: string;
  children: ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls = cn(
    "relative inline-flex items-center justify-center gap-2 rounded-[10px] font-medium tracking-wide transition-all duration-300 select-none disabled:opacity-40 disabled:pointer-events-none active:scale-[0.985]",
    btnVariants[variant],
    btnSizes[size],
    className
  );
  if (href && !loading) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} disabled={loading || rest.disabled} {...rest}>
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
      )}
      {children}
    </button>
  );
}

/* ---------------- Stars ---------------- */

function StarRow({ color, size }: { color: string; size: number }) {
  return (
    <span className="flex gap-[2px]" style={{ color }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <IcStar key={i} size={size} filled sw={1.2} />
      ))}
    </span>
  );
}

export function Stars({ value, size = 13, className }: { value: number; size?: number; className?: string }) {
  return (
    <span className={cn("relative inline-flex", className)} role="img" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
      <StarRow color="#3b3b44" size={size} />
      <span className="absolute inset-0 overflow-hidden" style={{ width: `${(value / 5) * 100}%` }}>
        <StarRow color="#c7a16a" size={size} />
      </span>
    </span>
  );
}

/* ---------------- Price ---------------- */

export function Price({
  price,
  compareAt,
  size = "md",
  className,
}: {
  price: number;
  compareAt?: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const cls = { sm: "text-sm", md: "text-[15px]", lg: "text-2xl" }[size];
  return (
    <span className={cn("tnum inline-flex items-baseline gap-2", className)}>
      <span className={cn(cls, "font-semibold text-cream")}>{fmt(price)}</span>
      {compareAt != null && compareAt > price && (
        <span className={cn(cls, "text-faint line-through decoration-1")}>{fmt(compareAt)}</span>
      )}
    </span>
  );
}

/* ---------------- Quantity ---------------- */

export function Qty({
  value,
  onChange,
  max = 99,
  size = "md",
}: {
  value: number;
  onChange: (v: number) => void;
  max?: number;
  size?: "sm" | "md";
}) {
  const h = size === "sm" ? "h-9" : "h-11";
  return (
    <div className={cn("inline-flex items-center rounded-[10px] border border-line2", h)}>
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(value - 1)}
        className="grid h-full w-10 place-items-center text-muted transition-colors hover:text-cream"
      >
        <IcMinus size={14} />
      </button>
      <span className="tnum w-8 text-center text-sm font-medium" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="grid h-full w-10 place-items-center text-muted transition-colors hover:text-cream disabled:opacity-30"
        disabled={value >= max}
      >
        <IcPlus size={14} />
      </button>
    </div>
  );
}

/* ---------------- Badge ---------------- */

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "gold" | "success" | "danger" | "warn";
  className?: string;
}) {
  const tones = {
    neutral: "bg-white/[0.06] text-muted border-line",
    gold: "bg-gold/10 text-goldsoft border-gold/25",
    success: "bg-success/10 text-success border-success/25",
    danger: "bg-danger/10 text-danger border-danger/25",
    warn: "bg-warn/10 text-warn border-warn/25",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] uppercase",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

/* ---------------- Section heading ---------------- */

export function SectionHead({
  eyebrow,
  title,
  action,
  actionHref,
  className,
}: {
  eyebrow?: string;
  title: string;
  action?: string;
  actionHref?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-10 flex items-end justify-between gap-6", className)}>
      <div>
        {eyebrow && <p className="mb-3 text-[11px] font-semibold tracking-[0.3em] text-gold uppercase">{eyebrow}</p>}
        <h2 className="font-display text-3xl leading-tight text-cream md:text-[2.6rem]">{title}</h2>
      </div>
      {action && actionHref && (
        <Link
          href={actionHref}
          className="link-under hidden shrink-0 text-[13px] font-medium text-muted hover:text-cream md:inline-block"
        >
          {action}
        </Link>
      )}
    </div>
  );
}

/* ---------------- Reveal (scroll) ---------------- */

export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- Magnetic ---------------- */

export function Magnetic({
  children,
  strength = 0.25,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ x: 0, y: 0 });
  const reduce = useReducedMotion();

  return (
    <div
      ref={ref}
      className={cn("inline-block", className)}
      style={{
        transform: `translate(${t.x}px, ${t.y}px)`,
        transition: t.x === 0 && t.y === 0 ? "transform 0.55s cubic-bezier(0.22,1,0.36,1)" : "transform 0.12s ease-out",
      }}
      onMouseMove={(e) => {
        if (reduce || !ref.current || window.innerWidth < 1024) return;
        const r = ref.current.getBoundingClientRect();
        setT({
          x: (e.clientX - r.left - r.width / 2) * strength,
          y: (e.clientY - r.top - r.height / 2) * strength,
        });
      }}
      onMouseLeave={() => setT({ x: 0, y: 0 })}
    >
      {children}
    </div>
  );
}

/* ---------------- Accordion ---------------- */

export function Accordion({ items, className }: { items: { q: string; a: string }[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-6 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className={cn("text-[15px] font-medium transition-colors", isOpen ? "text-cream" : "text-cream/80")}>
                {it.q}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.3 }}
                className="shrink-0 text-gold"
                aria-hidden
              >
                <IcPlus size={16} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-6 text-sm leading-relaxed text-muted">{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- Modal ---------------- */

export function Modal({
  open,
  onClose,
  children,
  maxWidth = "max-w-3xl",
  label,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
  label: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-[6px]"
            aria-hidden
          />
          <div className="pointer-events-none fixed inset-0 z-[71] flex items-center justify-center p-4 md:p-8">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={label}
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "card-surface pointer-events-auto max-h-[88vh] w-full overflow-y-auto rounded-xl bg-panel",
                maxWidth
              )}
            >
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ---------------- Toaster ---------------- */

export function Toaster() {
  const { toasts, dismissToast } = useStore();
  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[90] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 md:right-6 md:bottom-6">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="card-surface pointer-events-auto flex items-start gap-3 rounded-xl px-4 py-3.5 shadow-2xl shadow-black/50"
          >
            <span
              className={cn(
                "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full",
                t.kind === "success" && "bg-success/15 text-success",
                t.kind === "error" && "bg-danger/15 text-danger",
                t.kind === "info" && "bg-white/10 text-muted"
              )}
            >
              {t.kind === "error" ? <IcClose size={12} sw={2} /> : <IcCheck size={12} sw={2.2} />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-cream">{t.title}</p>
              {t.body && <p className="truncate text-xs text-muted">{t.body}</p>}
            </div>
            <button
              onClick={() => dismissToast(t.id)}
              className="text-faint transition-colors hover:text-cream"
              aria-label="Dismiss notification"
            >
              <IcClose size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Empty state ---------------- */

export function EmptyState({
  icon,
  title,
  body,
  action,
  actionHref,
  actionLabel,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="fade-in flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="mb-6 grid h-16 w-16 place-items-center rounded-full border border-line bg-white/[0.03] text-muted">
        {icon}
      </div>
      <h3 className="font-display text-2xl text-cream">{title}</h3>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{body}</p>
      {(action || (actionHref && actionLabel)) && (
        <div className="mt-8">
          {action ?? <Button href={actionHref}>{actionLabel}</Button>}
        </div>
      )}
    </div>
  );
}

/* ---------------- Skeletons ---------------- */

export function CardSkeleton() {
  return (
    <div className="card-surface overflow-hidden rounded-xl">
      <div className="skeleton aspect-[4/5] rounded-none" />
      <div className="space-y-2.5 p-4">
        <div className="skeleton h-3 w-1/3" />
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4" aria-busy="true" aria-label="Loading products">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

/* ---------------- Field ---------------- */

export function Field({
  label,
  error,
  children,
  className,
  hint,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 flex items-baseline justify-between text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
        {label}
        {hint && <span className="font-normal normal-case tracking-normal text-faint">{hint}</span>}
      </span>
      {children}
      {error && (
        <span role="alert" className="mt-1.5 block text-xs text-danger">
          {error}
        </span>
      )}
    </label>
  );
}
