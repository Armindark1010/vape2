"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Product } from "@/lib/types";

export type Toast = { id: number; title: string; body?: string; kind: "success" | "error" | "info" };

type StoreValue = {
  hydrated: boolean;
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (item: Omit<CartItem, "qty">, qty?: number, opts?: { silent?: boolean }) => void;
  removeFromCart: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  wishlist: number[];
  inWishlist: (id: number) => boolean;
  toggleWishlist: (p: { id: number; name: string }) => void;
  recent: number[];
  pushRecent: (id: number) => void;
  toasts: Toast[];
  toast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: number) => void;
  quickView: Product | null;
  setQuickView: (p: Product | null) => void;
};

const Ctx = createContext<StoreValue | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [recent, setRecent] = useState<number[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const toastId = useRef(0);

  useEffect(() => {
    setCart(load<CartItem[]>("noc_cart", []));
    setWishlist(load<number[]>("noc_wishlist", []));
    setRecent(load<number[]>("noc_recent", []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("noc_cart", JSON.stringify(cart));
  }, [cart, hydrated]);
  useEffect(() => {
    if (hydrated) localStorage.setItem("noc_wishlist", JSON.stringify(wishlist));
  }, [wishlist, hydrated]);
  useEffect(() => {
    if (hydrated) localStorage.setItem("noc_recent", JSON.stringify(recent));
  }, [recent, hydrated]);

  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = ++toastId.current;
      setToasts((prev) => [...prev.slice(-2), { ...t, id }]);
      setTimeout(() => dismissToast(id), 3400);
    },
    [dismissToast]
  );

  const addToCart = useCallback(
    (item: Omit<CartItem, "qty">, qty = 1, opts?: { silent?: boolean }) => {
      let blocked = false;
      setCart((prev) => {
        const ex = prev.find((c) => c.id === item.id);
        const nextQty = (ex?.qty ?? 0) + qty;
        if (nextQty > item.stock) {
          blocked = true;
          return prev;
        }
        if (ex) return prev.map((c) => (c.id === item.id ? { ...c, qty: nextQty } : c));
        return [...prev, { ...item, qty }];
      });
      if (blocked) {
        toast({ title: "Limit reached", body: "Only a few of these are left in stock.", kind: "error" });
        return;
      }
      if (!opts?.silent) toast({ title: "Added to cart", body: item.name, kind: "success" });
      setCartOpen(true);
    },
    [toast]
  );

  const removeFromCart = useCallback((id: number) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const setQty = useCallback((id: number, qty: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, qty: Math.max(0, Math.min(c.stock, qty)) } : c))
        .filter((c) => c.qty > 0)
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback(
    (p: { id: number; name: string }) => {
      setWishlist((prev) => {
        const has = prev.includes(p.id);
        toast(
          has
            ? { title: "Removed from wishlist", body: p.name, kind: "info" }
            : { title: "Saved to wishlist", body: p.name, kind: "success" }
        );
        return has ? prev.filter((x) => x !== p.id) : [...prev, p.id];
      });
    },
    [toast]
  );

  const pushRecent = useCallback((id: number) => {
    setRecent((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 8));
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      hydrated,
      cart,
      cartCount: cart.reduce((s, c) => s + c.qty, 0),
      cartSubtotal: cart.reduce((s, c) => s + c.price * c.qty, 0),
      addToCart,
      removeFromCart,
      setQty,
      clearCart,
      cartOpen,
      setCartOpen,
      wishlist,
      inWishlist: (id: number) => wishlist.includes(id),
      toggleWishlist,
      recent,
      pushRecent,
      toasts,
      toast,
      dismissToast,
      quickView,
      setQuickView,
    }),
    [hydrated, cart, addToCart, removeFromCart, setQty, clearCart, cartOpen, wishlist, toggleWishlist, recent, pushRecent, toasts, toast, dismissToast, quickView]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used inside StoreProvider");
  return v;
}
