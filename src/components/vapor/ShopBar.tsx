"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FilterSheet, type FState } from "@/components/vapor/FilterSheet";
import { SlidersIcon } from "@/components/vapor/VIconsExtra";
import { haptic } from "@/lib/vape";
import { motion } from "framer-motion";

export function ShopBar({
  initial,
  cats,
  brands,
  priceCeil,
  sortOptions,
  count,
}: {
  initial: FState;
  cats: { slug: string; name: string }[];
  brands: { slug: string; name: string }[];
  priceCeil: number;
  sortOptions: { v: string; l: string }[];
  count: number;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const active =
    (initial.category ? 1 : 0) + (initial.brand ? 1 : 0) + (initial.inStock ? 1 : 0) + (initial.max ? 1 : 0) + (initial.sort && initial.sort !== "popular" ? 1 : 0);

  const chips: { label: string; href: string }[] = [];
  const cl = (o: Record<string, string | undefined>) => {
    const q = new URLSearchParams();
    const merged: Record<string, unknown> = { ...initial, ...o };
    (Object.entries(merged) as [string, unknown][]).forEach(([k, v]) => {
      if (v === undefined || v === false) return;
      if (v === true) q.set(k, "in");
      else q.set(k, String(v));
    });
    const str = q.toString();
    return str ? `/shop?${str}` : "/shop";
  };
  if (initial.category) {
    const n = cats.find((c) => c.slug === initial.category)?.name;
    chips.push({ label: n ?? initial.category, href: cl({ category: undefined }) });
  }
  if (initial.brand) chips.push({ label: initial.brand.toUpperCase(), href: cl({ brand: undefined }) });
  if (initial.max) chips.push({ label: `تا ${(initial.max / 1000).toLocaleString("en-US")} هزار`, href: cl({ max: undefined }) });

  return (
    <>
      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {chips.map((c) => (
            <button
              key={c.label}
              onClick={() => {
                haptic(6);
                router.replace(c.href);
              }}
              className="pressable flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-vio/30 bg-vio/10 px-3 text-[11.5px] font-bold text-vio"
            >
              {c.label} <span className="text-dim">✕</span>
            </button>
          ))}
          <motion.span key={count} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="shrink-0 text-[11.5px] text-dim tnum">
            {count} کالا
          </motion.span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="pressable relative flex h-12 shrink-0 items-center gap-2 rounded-2xl border border-white/12 bg-white/4 px-5 text-[13px] font-extrabold text-snow"
          aria-haspopup="dialog"
        >
          <SlidersIcon size={18} className="text-vio" />
          فیلتر
          {active > 0 && (
            <span className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-gradient-to-l from-neon to-ice px-1 text-[10px] font-extrabold text-ink tnum">
              {active}
            </span>
          )}
        </button>
      </div>

      <FilterSheet open={open} onClose={() => setOpen(false)} initial={initial} cats={cats} brands={brands} priceCeil={priceCeil} sortOptions={sortOptions} />
    </>
  );
}
