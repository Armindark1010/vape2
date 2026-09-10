"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/store/store";
import { Modal, Stars, Price, Qty, Button, Badge } from "@/components/ui";
import { IcClose, IcCart, IcHeart, IcCheck } from "@/components/icons";

export function QuickView() {
  const { quickView: p, setQuickView, addToCart, inWishlist, toggleWishlist } = useStore();
  const [qty, setQtyVal] = useState(1);

  if (!p) return null;
  const out = p.stock <= 0;
  const saved = inWishlist(p.id);

  return (
    <Modal open={!!p} onClose={() => setQuickView(null)} label={`Quick view: ${p.name}`} maxWidth="max-w-3xl">
      <div className="grid md:grid-cols-2">
        <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[460px]">
          <img src={p.images[0]} alt={p.name} className="absolute inset-0 h-full w-full object-cover" />
          {p.newArrival && <Badge tone="gold" className="absolute top-4 left-4">New</Badge>}
        </div>
        <div className="flex flex-col p-6 md:p-8">
          <button
            onClick={() => setQuickView(null)}
            className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-black/40 text-cream backdrop-blur transition-colors hover:bg-black/70"
            aria-label="Close quick view"
          >
            <IcClose size={18} />
          </button>
          <p className="text-[10.5px] font-semibold tracking-[0.2em] text-faint uppercase">
            {p.brand} · {p.category}
          </p>
          <h2 className="mt-2 font-display text-2xl text-cream">{p.name}</h2>
          <div className="mt-2 flex items-center gap-2">
            <Stars value={p.rating} size={13} />
            <span className="text-xs text-faint tnum">({p.reviewCount})</span>
          </div>
          <div className="mt-4">
            <Price price={p.discountPrice ?? p.price} compareAt={p.discountPrice ? p.price : null} size="lg" />
          </div>
          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted">{p.description}</p>

          <div className="mt-6 flex items-center gap-3">
            <Qty value={qty} max={Math.max(1, p.stock)} onChange={(v) => setQtyVal(Math.max(1, v))} />
            <span className={out ? "text-xs font-medium text-danger" : p.stock < 6 ? "text-xs font-medium text-warn" : "text-xs text-success"}>
              {out ? "Out of stock" : p.stock < 6 ? `Only ${p.stock} left` : "In stock"}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Button
              disabled={out}
              onClick={() => {
                addToCart(
                  { id: p.id, slug: p.slug, name: p.name, price: p.discountPrice ?? p.price, compareAt: p.discountPrice ?? null, image: p.images[0] ?? "", stock: p.stock },
                  qty
                );
                setQuickView(null);
              }}
            >
              <IcCart size={15} /> Add to cart
            </Button>
            <Button
              variant="outline"
              onClick={() => toggleWishlist({ id: p.id, name: p.name })}
              aria-pressed={saved}
            >
              {saved ? <IcCheck size={15} className="text-gold" /> : <IcHeart size={15} />}
              {saved ? "Saved" : "Wishlist"}
            </Button>
          </div>

          <Link
            href={`/product/${p.slug}`}
            onClick={() => setQuickView(null)}
            className="link-under mt-6 self-start text-[13px] font-medium text-muted hover:text-cream"
          >
            View full details
          </Link>
        </div>
      </div>
    </Modal>
  );
}
