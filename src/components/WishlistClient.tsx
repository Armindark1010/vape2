"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/lib/types";
import { useStore } from "@/store/store";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState, Button } from "@/components/ui";
import { IcHeart, IcCart } from "@/components/icons";

export function WishlistClient({ products }: { products: Product[] }) {
  const { wishlist, hydrated, addToCart, toast } = useStore();
  const items = products.filter((p) => wishlist.includes(p.id));

  function moveAllToCart() {
    items.forEach((p) =>
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
        1,
        { silent: true }
      )
    );
    toast({ title: "Moved to cart", body: `${items.length} objects added.`, kind: "success" });
  }

  return (
    <div className="wrap pt-14 pb-20">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="mb-3 text-[11px] font-semibold tracking-[0.3em] text-gold uppercase">Saved for later</p>
          <h1 className="font-display text-4xl text-cream md:text-5xl">
            Your <em className="text-goldsoft">wishlist.</em>
          </h1>
          <p className="mt-3 text-sm text-muted tnum">
            {hydrated ? `${items.length} object${items.length === 1 ? "" : "s"} saved` : "…"}
          </p>
        </div>
        {items.length > 0 && (
          <Button variant="outline" onClick={moveAllToCart}>
            <IcCart size={15} /> Move all to cart
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {hydrated && items.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="card-surface rounded-xl">
            <EmptyState
              icon={<IcHeart size={22} />}
              title="Nothing saved yet"
              body="Tap the heart on any object to keep it here. We'll hold on to it while you decide."
              actionHref="/shop"
              actionLabel="Find something to save"
            />
          </motion.div>
        ) : (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-2 gap-4 md:gap-6 xl:grid-cols-4">
            {items.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
