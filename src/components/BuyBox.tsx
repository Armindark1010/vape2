"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { useStore } from "@/store/store";
import { Price, Stars, Qty, Button } from "@/components/ui";
import { IcCart, IcHeart, IcCheck, IcZap, IcTruck } from "@/components/icons";

export function BuyBox({ product: p }: { product: Product }) {
  const [qty, setQtyVal] = useState(1);
  const { addToCart, inWishlist, toggleWishlist, pushRecent } = useStore();
  const router = useRouter();
  const out = p.stock <= 0;
  const saved = inWishlist(p.id);

  const delivery = (() => {
    if (out) return null;
    const d1 = new Date(Date.now() + 2 * 86_400_000).toLocaleDateString("en-US", { weekday: "long" });
    const d2 = new Date(Date.now() + 4 * 86_400_000).toLocaleDateString("en-US", { weekday: "long" });
    return `${d1} – ${d2}`;
  })();

  return (
    <div>
      <p className="text-[10.5px] font-semibold tracking-[0.2em] text-faint uppercase">
        <span className="text-gold">{p.brand}</span> · {p.category}
      </p>
      <h1 className="mt-2.5 font-display text-3xl leading-tight text-cream md:text-4xl">{p.name}</h1>

      <a href="#reviews" className="mt-3 flex w-fit items-center gap-2 group">
        <Stars value={p.rating} size={14} />
        <span className="text-xs text-muted underline-offset-4 transition-colors group-hover:text-cream group-hover:underline tnum">
          {p.rating.toFixed(1)} · {p.reviewCount} reviews
        </span>
      </a>

      <div className="mt-5 flex items-baseline gap-3">
        <Price price={p.discountPrice ?? p.price} compareAt={p.discountPrice ? p.price : null} size="lg" />
        {p.discountPrice != null && (
          <span className="rounded-md bg-gold/15 px-2 py-1 text-[11px] font-semibold text-goldsoft tnum">
            Save {Math.round(((p.price - p.discountPrice) / p.price) * 100)}%
          </span>
        )}
      </div>

      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">{p.tagline}</p>

      <div className="mt-7 flex items-center gap-4">
        <Qty value={qty} max={Math.max(1, p.stock)} onChange={(v) => setQtyVal(Math.max(1, v))} />
        <div className="text-[13px] font-medium" aria-live="polite">
          {out ? (
            <span className="text-danger">Out of stock — restock expected soon</span>
          ) : p.stock < 6 ? (
            <span className="text-warn">Only {p.stock} left in stock</span>
          ) : (
            <span className="flex items-center gap-1.5 text-success">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-success" /> In stock
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button
          size="lg"
          disabled={out}
          onClick={() =>
            addToCart(
              {
                id: p.id,
                slug: p.slug,
                name: p.name,
                price: p.discountPrice ?? p.price,
                compareAt: p.discountPrice ?? null,
                image: p.images[0] ?? "",
                stock: p.stock,
              },
              qty
            )
          }
        >
          <IcCart size={16} /> Add to cart
        </Button>
        <Button
          size="lg"
          variant="outline"
          disabled={out}
          onClick={() => {
            pushRecent(p.id);
            addToCart(
              {
                id: p.id,
                slug: p.slug,
                name: p.name,
                price: p.discountPrice ?? p.price,
                compareAt: p.discountPrice ?? null,
                image: p.images[0] ?? "",
                stock: p.stock,
              },
              qty,
              { silent: true }
            );
            router.push("/checkout");
          }}
        >
          <IcZap size={16} /> Buy now
        </Button>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleWishlist({ id: p.id, name: p.name })}
          aria-pressed={saved}
          className={saved ? "text-goldsoft" : ""}
        >
          {saved ? <IcCheck size={14} /> : <IcHeart size={14} />}
          {saved ? "Saved to wishlist" : "Add to wishlist"}
        </Button>
        {delivery && (
          <span className="flex items-center gap-2 text-xs text-muted">
            <IcTruck size={14} className="text-gold" /> Arrives {delivery}
          </span>
        )}
      </div>

      {/* track recently viewed */}
      <RecentTracker id={p.id} />
    </div>
  );
}

function RecentTracker({ id }: { id: number }) {
  const { pushRecent } = useStore();
  useEffect(() => {
    pushRecent(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return null;
}
