"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Stars, Price, EmptyState } from "@/components/ui";
import { IcSearch, IcClose, IcChevronRight, IcGrid } from "@/components/icons";
import { POPULAR_SEARCHES } from "@/lib/content";
import { fmt, cn } from "@/lib/utils";

type Mini = {
  id: number;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  brand: string;
  price: number;
  compareAt: number | null;
  rating: number;
  image: string;
  tagline: string;
};

const RECENT_KEY = "noc_recent_search";

export function SearchClient({ index, categories }: { index: Mini[]; categories: { slug: string; name: string }[] }) {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const [sel, setSel] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]"));
    } catch {
      setRecent([]);
    }
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "/" || (e.key === "k" && (e.metaKey || e.ctrlKey))) && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") inputRef.current?.blur();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const needle = q.trim().toLowerCase();
  const matches = useMemo(() => {
    if (needle.length < 2) return [];
    return index.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.tagline.toLowerCase().includes(needle) ||
        p.brand.toLowerCase().includes(needle) ||
        p.category.toLowerCase().includes(needle)
    );
  }, [index, needle]);

  const suggestions = useMemo(() => matches.slice(0, 6), [matches]);
  const catMatches = useMemo(
    () => (needle.length >= 2 ? categories.filter((c) => c.name.toLowerCase().includes(needle)) : []),
    [categories, needle]
  );

  const optionCount = suggestions.length + catMatches.length;

  function choose(idx: number) {
    if (idx < catMatches.length) {
      const c = catMatches[idx];
      router.push(`/shop?category=${c.slug}`);
      return;
    }
    const p = suggestions[idx - catMatches.length];
    if (p) router.push(`/product/${p.slug}`);
  }

  function onKey(e: React.KeyboardEvent) {
    if (!optionCount) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => (s + 1) % optionCount);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => (s - 1 + optionCount) % optionCount);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (sel < catMatches.length) choose(sel);
      else choose(sel);
    }
  }

  function recordRecent(term: string) {
    setRecent((prev) => {
      const next = [term, ...prev.filter((x) => x !== term)].slice(0, 5);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <div className="min-h-[85vh]">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-3xl px-5 pt-20 pb-10 text-center md:pt-28"
      >
        <p className="mb-5 text-[11px] font-semibold tracking-[0.3em] text-gold uppercase">Search the collection</p>
        <h1 className="sr-only">Search NOCTURNE</h1>

        <div className="relative">
          <IcSearch size={22} className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-faint" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setSel(0);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            onKeyDown={onKey}
            placeholder="Try “headphones”, “watch”, “leather”…"
            aria-label="Search products"
            role="combobox"
            aria-expanded={focused && optionCount > 0}
            aria-controls="search-suggestions"
            className="input h-[68px] rounded-2xl border-line2 bg-white/[0.04] pl-14 pr-14 text-lg"
            autoComplete="off"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-4 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-faint transition-colors hover:bg-white/5 hover:text-cream"
            >
              <IcClose size={18} />
            </button>
          )}
        </div>

        <p className="mt-4 hidden text-[11px] tracking-[0.14em] text-faint uppercase md:block">
          Tip: press <kbd className="rounded border border-line bg-white/5 px-1.5 py-0.5 font-mono text-[10px]">/</kbd> anywhere to search
        </p>
      </motion.div>

      {/* suggestions dropdown */}
      {focused && needle.length >= 2 && optionCount > 0 && (
        <div id="search-suggestions" role="listbox" aria-label="Search suggestions" className="wrap relative z-20">
          <motion.ul
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="card-surface overflow-hidden rounded-xl shadow-2xl shadow-black/60"
          >
            {catMatches.map((c, i) => (
              <li key={c.slug} role="option" aria-selected={sel === i}>
                <Link
                  href={`/shop?category=${c.slug}`}
                  onMouseEnter={() => setSel(i)}
                  className={cn("flex items-center justify-between px-5 py-3.5 text-sm transition-colors", sel === i ? "bg-white/[0.06] text-cream" : "text-muted")}
                >
                  <span className="flex items-center gap-3">
                    <IcGrid size={15} className="text-gold" />
                    Category · <strong className="font-medium text-cream">{c.name}</strong>
                  </span>
                  <IcChevronRight size={14} />
                </Link>
              </li>
            ))}
            {suggestions.map((p, i) => {
              const idx = catMatches.length + i;
              return (
                <li key={p.id} role="option" aria-selected={sel === idx}>
                  <Link
                    href={`/product/${p.slug}`}
                    onMouseEnter={() => setSel(idx)}
                    className={cn("flex items-center gap-4 px-5 py-3 transition-colors", sel === idx ? "bg-white/[0.06]" : "")}
                  >
                    <img src={p.image} alt="" className="h-12 w-10 rounded-md object-cover" loading="lazy" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-cream">{p.name}</span>
                      <span className="block text-[11px] text-faint">
                        {p.brand} · {p.category}
                      </span>
                    </span>
                    <Stars value={p.rating} size={11} />
                    <span className="text-sm font-semibold text-cream tnum">{fmt(p.price)}</span>
                  </Link>
                </li>
              );
            })}
          </motion.ul>
        </div>
      )}

      {/* results / empty area */}
      <div className="wrap pt-6 pb-24">
        {needle.length < 2 ? (
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="mb-4 text-[11px] font-semibold tracking-[0.24em] text-faint uppercase">
                {recent.length > 0 ? "Recent searches" : "Popular searches"}
              </p>
              <div className="flex flex-wrap gap-2">
                {(recent.length > 0 ? recent : POPULAR_SEARCHES).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setQ(s);
                      inputRef.current?.focus();
                    }}
                    className="rounded-full border border-line px-4 py-2 text-[13px] text-muted transition-all duration-300 hover:border-gold/40 hover:text-cream"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            {recent.length > 0 && (
              <div>
                <p className="mb-4 text-[11px] font-semibold tracking-[0.24em] text-faint uppercase">Browse instead</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/shop?category=${c.slug}`}
                      className="rounded-full border border-line px-4 py-2 text-[13px] text-muted transition-all duration-300 hover:border-gold/40 hover:text-cream"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : matches.length === 0 ? (
          <div className="card-surface rounded-xl">
            <EmptyState
              icon={<IcSearch size={22} />}
              title={`Nothing found for “${q.trim()}”`}
              body="Try a broader term — “speaker” instead of “bookshelf speaker” — or browse a category below."
              action={
                <div className="flex flex-wrap justify-center gap-2">
                  {categories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/shop?category=${c.slug}`}
                      className="rounded-full border border-line px-4 py-2 text-[13px] text-muted transition-colors hover:border-gold/40 hover:text-cream"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              }
            />
          </div>
        ) : (
          <>
            <p className="mb-6 text-[13px] text-muted tnum" aria-live="polite">
              {matches.length} result{matches.length === 1 ? "" : "s"} for <span className="text-cream">“{q.trim()}”</span>
              <button
                onClick={() => recordRecent(q.trim())}
                className="ml-3 text-[11px] text-faint underline-offset-4 hover:text-goldsoft hover:underline"
              >
                save search
              </button>
            </p>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
              {matches.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.4), duration: 0.4 }}
                >
                  <Link href={`/product/${p.slug}`} className="group block">
                    <div className="overflow-hidden rounded-xl border border-line bg-card transition-all duration-500 group-hover:-translate-y-1 group-hover:border-line2">
                      <img
                        src={p.image}
                        alt={p.name}
                        loading={i < 4 ? "eager" : "lazy"}
                        decoding="async"
                        className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      />
                    </div>
                    <div className="mt-3 flex items-start justify-between gap-3 px-1">
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-medium text-cream group-hover:text-goldsoft">{p.name}</p>
                        <p className="mt-0.5 text-[11px] text-faint">
                          {p.brand} · {p.category}
                        </p>
                      </div>
                      <Price price={p.price} compareAt={p.compareAt} size="sm" className="shrink-0" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
