"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn, fmt } from "@/lib/utils";
import { IcClose, IcSliders, IcStar, IcChevronDown } from "@/components/icons";

export type CurrentFilters = {
  category?: string;
  brand?: string;
  min?: number;
  max?: number;
  rating?: number;
  stock?: "in";
  sort?: string;
  q?: string;
};

type Props = {
  current: CurrentFilters;
  categories: { slug: string; name: string }[];
  brands: { slug: string; name: string }[];
  bounds: [number, number];
  sortOptions: { v: string; l: string }[];
};

export function ShopTools({ current, categories, brands, bounds, sortOptions }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState(current.sort ?? "featured");

  const key = JSON.stringify({ ...current, sort });
  useEffect(() => {
    setSort(current.sort ?? "featured");
  }, [key, current.sort]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const activeCount =
    (current.category ? 1 : 0) +
    (current.brand ? 1 : 0) +
    (current.min != null || current.max != null ? 1 : 0) +
    (current.rating != null ? 1 : 0) +
    (current.stock ? 1 : 0) +
    (current.q ? 1 : 0);

  return (
    <div className="flex items-center gap-3">
      <label className="hidden md:block">
        <span className="sr-only">Sort products</span>
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => apply({ sort: e.target.value })}
            className="input h-11 w-52 cursor-pointer pr-9 text-[13px]"
          >
            {sortOptions.map((o) => (
              <option key={o.v} value={o.v} className="bg-panel">
                {o.l}
              </option>
            ))}
          </select>
          <IcChevronDown size={14} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted" />
        </div>
      </label>
      <button
        onClick={() => setOpen(true)}
        className="flex h-11 items-center gap-2 rounded-[10px] border border-line2 px-5 text-[13px] font-medium text-cream transition-colors hover:border-cream/40 md:hidden"
        aria-haspopup="dialog"
      >
        <IcSliders size={15} />
        Filters
        {activeCount > 0 && (
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-black tnum">{activeCount}</span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[75] bg-black/65 backdrop-blur-[4px] md:hidden"
              aria-hidden
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 right-0 z-[76] flex w-[88%] max-w-sm flex-col bg-panel md:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
            >
              <div className="hairline-b flex items-center justify-between px-6 py-5">
                <h2 className="font-display text-lg text-cream">Filters</h2>
                <button onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full text-muted hover:bg-white/5 hover:text-cream" aria-label="Close filters">
                  <IcClose />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <FilterForm current={current} categories={categories} brands={brands} bounds={bounds} onApply={() => setOpen(false)} />
              </div>
              <div className="hairline-t px-6 py-4">
                <button
                  onClick={() => setOpen(false)}
                  className="h-12 w-full rounded-[10px] bg-cream text-sm font-semibold text-black transition-colors hover:bg-white"
                >
                  Show {`results`}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );

  function apply(patch: Partial<CurrentFilters>) {
    const next = { ...current, ...patch };
    const qs = new URLSearchParams();
    if (next.category) qs.set("category", next.category);
    if (next.brand) qs.set("brand", next.brand);
    if (next.min != null) qs.set("min", String(next.min));
    if (next.max != null) qs.set("max", String(next.max));
    if (next.rating != null) qs.set("rating", String(next.rating));
    if (next.stock) qs.set("stock", next.stock);
    if (next.q) qs.set("q", next.q);
    if (next.sort && next.sort !== "featured") qs.set("sort", next.sort);
    const s = qs.toString();
    router.replace(s ? `/shop?${s}` : "/shop");
    setOpen(false);
  }
}

type FilterFormProps = {
  current: CurrentFilters;
  categories: { slug: string; name: string }[];
  brands: { slug: string; name: string }[];
  bounds: [number, number];
  onApply?: () => void;
};

function FilterForm({ current, categories, brands, bounds, onApply }: FilterFormProps) {
  const router = useRouter();
  const [cat, setCat] = useState(current.category ?? "");
  const [brand, setBrand] = useState(current.brand ?? "");
  const [min, setMin] = useState(current.min ?? bounds[0]);
  const [max, setMax] = useState(current.max ?? bounds[1]);
  const [rating, setRating] = useState(current.rating ?? 0);
  const [stock, setStock] = useState(current.stock === "in");

  const key = JSON.stringify(current);
  useEffect(() => {
    setCat(current.category ?? "");
    setBrand(current.brand ?? "");
    setMin(current.min ?? bounds[0]);
    setMax(current.max ?? bounds[1]);
    setRating(current.rating ?? 0);
    setStock(current.stock === "in");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  function apply() {
    const qs = new URLSearchParams();
    if (cat) qs.set("category", cat);
    if (brand) qs.set("brand", brand);
    if (min > bounds[0]) qs.set("min", String(min));
    if (max < bounds[1]) qs.set("max", String(max));
    if (rating) qs.set("rating", String(rating));
    if (stock) qs.set("stock", "in");
    const s = qs.toString();
    router.replace(s ? `/shop?${s}` : "/shop");
    onApply?.();
  }

  function clear() {
    setCat("");
    setBrand("");
    setMin(bounds[0]);
    setMax(bounds[1]);
    setRating(0);
    setStock(false);
    router.replace("/shop");
    onApply?.();
  }

  const fillMin = ((min - bounds[0]) / (bounds[1] - bounds[0])) * 100;
  const fillMax = ((max - bounds[0]) / (bounds[1] - bounds[0])) * 100;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-[0.22em] text-faint uppercase">Filters</span>
        <button onClick={clear} className="text-xs font-medium text-goldsoft hover:underline">
          Clear all
        </button>
      </div>

      <Section title="Category">
        <RadioGroup
          options={[{ v: "", l: "All categories" }, ...categories.map((c) => ({ v: c.slug, l: c.name }))]}
          value={cat}
          onChange={setCat}
          onApply={apply}
        />
      </Section>

      <Section title="Brand">
        <RadioGroup
          options={[{ v: "", l: "All brands" }, ...brands.map((b) => ({ v: b.slug, l: b.name }))]}
          value={brand}
          onChange={setBrand}
          onApply={apply}
        />
      </Section>

      <Section title="Price">
        <div className="flex items-center justify-between text-xs text-muted tnum">
          <span>{fmt(min * 100)}</span>
          <span>{fmt(max * 100)}</span>
        </div>
        <input
          type="range"
          className="range mt-3"
          min={bounds[0]}
          max={bounds[1]}
          step={5}
          value={min}
          aria-label="Minimum price"
          style={{ "--fill": `${fillMin}%` } as CSSProperties}
          onChange={(e) => setMin(Math.min(Number(e.target.value), max - 5))}
        />
        <input
          type="range"
          className="range mt-3"
          min={bounds[0]}
          max={bounds[1]}
          step={5}
          value={max}
          aria-label="Maximum price"
          style={{ "--fill": `${fillMax}%` } as CSSProperties}
          onChange={(e) => setMax(Math.max(Number(e.target.value), min + 5))}
        />
      </Section>

      <Section title="Rating">
        <div className="space-y-2.5">
          {[0, 3, 4, 4.5].map((r) => (
            <label key={r} className="flex cursor-pointer items-center gap-3 text-sm text-muted transition-colors hover:text-cream">
              <input
                type="radio"
                name="rating"
                className="h-4 w-4 accent-[#c7a16a]"
                checked={rating === r}
                onChange={() => {
                  setRating(r);
                }}
              />
              {r === 0 ? (
                "Any rating"
              ) : (
                <span className="flex items-center gap-1.5">
                  <IcStar size={13} filled className="text-gold" />
                  {r} & up
                </span>
              )}
            </label>
          ))}
        </div>
      </Section>

      <Section title="Availability">
        <label className="flex cursor-pointer items-center gap-3 text-sm text-muted transition-colors hover:text-cream">
          <input
            type="checkbox"
            className="h-4 w-4 rounded accent-[#c7a16a]"
            checked={stock}
            onChange={(e) => {
              setStock(e.target.checked);
              applyStock(e.target.checked);
            }}
          />
          In stock only
        </label>
      </Section>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <button onClick={clear} className="h-11 rounded-[10px] border border-line2 text-[13px] font-medium text-muted transition-colors hover:text-cream">
          Reset
        </button>
        <button onClick={apply} className="h-11 rounded-[10px] bg-cream text-[13px] font-semibold text-black transition-colors hover:bg-white">
          Apply filters
        </button>
      </div>
    </div>
  );

  function applyStock(v: boolean) {
    const qs = new URLSearchParams();
    if (cat) qs.set("category", cat);
    if (brand) qs.set("brand", brand);
    if (min > bounds[0]) qs.set("min", String(min));
    if (max < bounds[1]) qs.set("max", String(max));
    if (rating) qs.set("rating", String(rating));
    if (v) qs.set("stock", "in");
    const s = qs.toString();
    router.replace(s ? `/shop?${s}` : "/shop");
    onApply?.();
  }
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-4 text-[11px] font-semibold tracking-[0.22em] text-faint uppercase">{title}</p>
      {children}
    </div>
  );
}

function RadioGroup({
  options,
  value,
  onChange,
  onApply,
}: {
  options: { v: string; l: string }[];
  value: string;
  onChange: (v: string) => void;
  onApply: () => void;
}) {
  return (
    <div className="space-y-2.5">
      {options.map((o) => (
        <label
          key={o.v}
          className={cn(
            "flex cursor-pointer items-center gap-3 text-sm transition-colors",
            value === o.v ? "text-cream" : "text-muted hover:text-cream"
          )}
        >
          <input
            type="radio"
            name={`rg-${o.l}`}
            className="h-4 w-4 accent-[#c7a16a]"
            checked={value === o.v}
            onChange={() => {
              onChange(o.v);
              setTimeout(onApply, 0);
            }}
          />
          <span className="capitalize">{o.l}</span>
        </label>
      ))}
    </div>
  );
}
