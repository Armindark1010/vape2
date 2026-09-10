"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { cn, discountPct, fmt } from "@/lib/utils";
import { useStore } from "@/store/store";
import { Stars, Price, Badge } from "@/components/ui";
import { IcHeart, IcEye, IcCart } from "@/components/icons";

export function ProductCard({ product: p, index = 0 }: { product: Product; index?: number }) {
  const { addToCart, inWishlist, toggleWishlist, setQuickView, hydrated } = useStore();
  const out = p.stock <= 0;
  const saved = inWishlist(p.id);
  const pct = discountPct(p.price, p.discountPrice);

  return (
    <div className="group relative" style={{ animationDelay: `${index * 40}ms` }}>
      <div className="card-surface relative overflow-hidden rounded-xl transition-all duration-500 group-hover:-translate-y-1 group-hover:border-line2 group-hover:shadow-[0_24px_48px_-20px_rgba(0,0,0,0.7)]">
        {/* images */}
        <div className="relative aspect-[4/5] overflow-hidden bg-card">
          {p.images.slice(0, 2).map((img, i) => (
            <Link href={`/product/${p.slug}`} key={i} aria-label={i === 0 ? p.name : undefined} className="absolute inset-0">
              <img
                src={img}
                alt={i === 0 ? p.name : ""}
                loading={index < 4 ? "eager" : "lazy"}
                decoding="async"
                className={cn(
                  "h-full w-full object-cover transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]",
                  i === 1 ? "opacity-0 group-hover:opacity-100" : "opacity-100"
                )}
              />
            </Link>
          ))}
          {/* soft light sweep on hover */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

          {/* badges */}
          <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
            {p.newArrival && <Badge tone="gold">New</Badge>}
            {pct > 0 && <Badge tone="neutral" className="bg-black/50 backdrop-blur">-{pct}%</Badge>}
            {p.bestSeller && !p.newArrival && <Badge tone="neutral" className="bg-black/50 backdrop-blur">Best seller</Badge>}
          </div>

          {/* wishlist */}
          <button
            onClick={() => toggleWishlist({ id: p.id, name: p.name })}
            aria-label={saved ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`}
            aria-pressed={saved}
            className={cn(
              "absolute top-3 right-3 grid h-10 w-10 place-items-center rounded-full backdrop-blur-md transition-all duration-300 md:translate-x-2 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100",
              saved ? "bg-gold text-[#0c0c0e]" : "bg-black/45 text-cream hover:bg-black/70"
            )}
          >
            <IcHeart size={17} filled={saved} />
          </button>

          {/* hover actions */}
          <div className="absolute inset-x-3 bottom-3 flex translate-y-14 gap-2 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
            <button
              onClick={() => addToCart({ id: p.id, slug: p.slug, name: p.name, price: p.discountPrice ?? p.price, compareAt: p.discountPrice ?? null, image: p.images[0] ?? "", stock: p.stock })}
              disabled={out}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-[10px] bg-cream text-[12px] font-semibold tracking-wide text-[#0c0c0e] transition-all duration-300 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <IcCart size={15} /> {out ? "Out of stock" : "Add to cart"}
            </button>
            <button
              onClick={() => setQuickView(p)}
              aria-label={`Quick view ${p.name}`}
              className="grid h-11 w-11 place-items-center rounded-[10px] bg-black/55 text-cream backdrop-blur-md transition-colors duration-300 hover:bg-black/80"
            >
              <IcEye size={17} />
            </button>
          </div>

          {out && (
            <div className="absolute inset-0 grid place-items-center bg-black/45 backdrop-blur-[2px]">
              <span className="rounded-full border border-line2 bg-black/60 px-4 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-cream/90 uppercase">
                Out of stock
              </span>
            </div>
          )}
        </div>

        {/* info */}
        <div className="p-4 md:p-5">
          <p className="mb-1.5 text-[10.5px] font-semibold tracking-[0.18em] text-faint uppercase">
            {p.brand} · {p.category}
          </p>
          <Link href={`/product/${p.slug}`} className="block">
            <h3 className="truncate text-[15px] font-medium text-cream transition-colors duration-300 group-hover:text-goldsoft">
              {p.name}
            </h3>
          </Link>
          <div className="mt-2 flex items-center gap-2">
            <Stars value={p.rating} size={12} />
            <span className="text-[11px] text-faint tnum">({p.reviewCount})</span>
          </div>
          <div className="mt-2.5">
            <Price price={p.discountPrice ?? p.price} compareAt={p.discountPrice ? p.price : null} size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
