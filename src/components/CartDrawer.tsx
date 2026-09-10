"use client";

import Link from "next/link";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/store";
import { fmt, cn } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FLAT } from "@/lib/content";
import { Qty, Button, EmptyState } from "@/components/ui";
import { IcClose, IcCart, IcTrash, IcTruck, IcArrowRight } from "@/components/icons";

export function CartDrawer() {
  const { cartOpen, setCartOpen, cart, setQty, removeFromCart, cartSubtotal } = useStore();

  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen]);

  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [cartOpen, setCartOpen]);

  const remaining = FREE_SHIPPING_THRESHOLD - cartSubtotal;
  const progress = Math.min(100, (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-[75] bg-black/65 backdrop-blur-[5px]"
            aria-hidden
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[76] flex w-full max-w-[420px] flex-col bg-panel shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            <div className="hairline-b flex items-center justify-between px-6 py-5">
              <h2 className="font-display text-lg tracking-wide text-cream">
                Cart <span className="text-sm text-faint tnum">({cart.length})</span>
              </h2>
              <button onClick={() => setCartOpen(false)} className="grid h-10 w-10 place-items-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-cream" aria-label="Close cart">
                <IcClose />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <EmptyState
                  icon={<IcCart size={24} />}
                  title="Your cart is empty"
                  body="Quiet rooms need good objects. Start with the collection."
                  actionHref="/shop"
                  actionLabel="Browse the shop"
                />
              </div>
            ) : (
              <>
                {/* free shipping meter */}
                <div className="border-b border-line px-6 py-4">
                  <div className="mb-2 flex items-center gap-2 text-[12px]">
                    <IcTruck size={15} className="text-gold" />
                    {remaining > 0 ? (
                      <span className="text-muted">
                        You're <strong className="text-cream tnum">{fmt(remaining)}</strong> away from free shipping
                      </span>
                    ) : (
                      <span className="text-success">You've unlocked free shipping</span>
                    )}
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-gold to-goldsoft"
                      initial={false}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>

                <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
                  <AnimatePresence initial={false}>
                    {cart.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 30, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="flex gap-4 py-5"
                      >
                        <Link href={`/product/${item.slug}`} onClick={() => setCartOpen(false)} className="shrink-0">
                          <img src={item.image} alt={item.name} className="h-24 w-20 rounded-lg object-cover" loading="lazy" />
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <Link href={`/product/${item.slug}`} onClick={() => setCartOpen(false)} className="truncate text-[14px] font-medium text-cream hover:text-goldsoft">
                              {item.name}
                            </Link>
                            <button onClick={() => removeFromCart(item.id)} className="text-faint transition-colors hover:text-danger" aria-label={`Remove ${item.name}`}>
                              <IcTrash size={15} />
                            </button>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-3">
                            <Qty size="sm" value={item.qty} max={item.stock} onChange={(v) => setQty(item.id, v)} />
                            <div className="text-right">
                              {item.compareAt && <p className="text-[11px] text-faint line-through tnum">{fmt(item.compareAt * item.qty)}</p>}
                              <p className="text-[14px] font-semibold text-cream tnum">{fmt(item.price * item.qty)}</p>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="hairline-t space-y-4 px-6 py-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-muted">Subtotal</span>
                    <motion.span key={cartSubtotal} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="font-display text-xl text-cream tnum">
                      {fmt(cartSubtotal)}
                    </motion.span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-faint">
                    Discounts, tax and {fmt(SHIPPING_FLAT)} shipping (free over {fmt(FREE_SHIPPING_THRESHOLD)}) calculated at checkout.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" href="/cart" className="w-full">
                      View cart
                    </Button>
                    <Button href="/checkout" className="w-full">
                      Checkout <IcArrowRight size={15} />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
