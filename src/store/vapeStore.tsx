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
import { AGE_KEY, haptic } from "@/lib/vape";

export type VItem = {
  k: string; // unique key incl. flavor/nicotine
  id: number;
  slug: string;
  name: string;
  img: string;
  price: number;
  oldPrice: number | null;
  qty: number;
  stock: number;
  flavor: string | null;
  nicotine: string | null;
};

export type VToast = { id: number; msg: string; kind: "ok" | "err" };

type AddArgs = {
  id: number;
  slug: string;
  name: string;
  img: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  flavor?: string | null;
  nicotine?: string | null;
};

type Store = {
  hydrated: boolean;
  ageOk: boolean;
  confirmAge: () => void;
  cart: VItem[];
  cartCount: number;
  cartTotal: number;
  add: (a: AddArgs, qty?: number, silent?: boolean) => void;
  setQty: (k: string, qty: number) => void;
  remove: (k: string) => void;
  clear: () => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  wish: number[];
  inWish: (id: number) => boolean;
  toggleWish: (id: number, name: string) => void;
  toasts: VToast[];
  toast: (msg: string, kind?: "ok" | "err") => void;
  dismiss: (id: number) => void;
};

const Ctx = createContext<Store | null>(null);

function load<T>(k: string, fb: T): T {
  try {
    const r = localStorage.getItem(k);
    return r ? (JSON.parse(r) as T) : fb;
  } catch {
    return fb;
  }
}

export function VapeProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [ageOk, setAgeOk] = useState(false);
  const [cart, setCart] = useState<VItem[]>([]);
  const [wish, setWish] = useState<number[]>([]);
  const [toasts, setToasts] = useState<VToast[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const tid = useRef(0);

  useEffect(() => {
    setCart(load<VItem[]>("vapora.cart", []));
    setWish(load<number[]>("vapora.wish", []));
    setAgeOk(load<boolean>(AGE_KEY, false));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("vapora.cart", JSON.stringify(cart));
  }, [cart, hydrated]);
  useEffect(() => {
    if (hydrated) localStorage.setItem("vapora.wish", JSON.stringify(wish));
  }, [wish, hydrated]);

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const toast = useCallback(
    (msg: string, kind: "ok" | "err" = "ok") => {
      const id = ++tid.current;
      setToasts((p) => [...p.slice(-2), { id, msg, kind }]);
      window.setTimeout(() => dismiss(id), 2800);
    },
    [dismiss]
  );

  const confirmAge = useCallback(() => {
    setAgeOk(true);
    localStorage.setItem(AGE_KEY, "true");
  }, []);

  const add = useCallback(
    (a: AddArgs, qty = 1, silent = false) => {
      const k = `${a.id}__${a.flavor ?? ""}__${a.nicotine ?? ""}`;
      let blocked = false;
      setCart((prev) => {
        const ex = prev.find((c) => c.k === k);
        const nq = (ex?.qty ?? 0) + qty;
        if (nq > Math.min(a.stock, 99)) {
          blocked = true;
          return prev;
        }
        const item: VItem = {
          k,
          id: a.id,
          slug: a.slug,
          name: a.name,
          img: a.img,
          price: a.price,
          oldPrice: a.oldPrice,
          qty: nq,
          stock: a.stock,
          flavor: a.flavor ?? null,
          nicotine: a.nicotine ?? null,
        };
        return ex ? prev.map((c) => (c.k === k ? item : c)) : [...prev, item];
      });
      if (blocked) {
        toast("حداکثر موجودی این محصول در سبد است.", "err");
        return;
      }
      if (!silent) {
        haptic(12);
        toast("به سبد اضافه شد ✓");
      }
      setCartOpen(true);
    },
    [toast]
  );

  const setQty = useCallback((k: string, qty: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.k === k ? { ...c, qty: Math.max(0, Math.min(c.stock, 99, qty)) } : c))
        .filter((c) => c.qty > 0)
    );
  }, []);

  const remove = useCallback((k: string) => setCart((p) => p.filter((c) => c.k !== k)), []);
  const clear = useCallback(() => setCart([]), []);

  const toggleWish = useCallback(
    (id: number, name: string) => {
      setWish((prev) => {
        const has = prev.includes(id);
        haptic(8);
        toast(has ? `از علاقه‌مندی‌ها حذف شد: ${name}` : `${name} ❤️ به علاقه‌مندی‌ها اضافه شد`);
        return has ? prev.filter((x) => x !== id) : [...prev, id];
      });
    },
    [toast]
  );

  const value = useMemo<Store>(
    () => ({
      hydrated,
      ageOk,
      confirmAge,
      cart,
      cartCount: cart.reduce((s, c) => s + c.qty, 0),
      cartTotal: cart.reduce((s, c) => s + c.price * c.qty, 0),
      add,
      setQty,
      remove,
      clear,
      cartOpen,
      setCartOpen,
      wish,
      inWish: (id) => wish.includes(id),
      toggleWish,
      toasts,
      toast,
      dismiss,
    }),
    [hydrated, ageOk, confirmAge, cart, add, setQty, remove, clear, cartOpen, wish, toggleWish, toasts, toast, dismiss]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useVape() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useVape must be used within VapeProvider");
  return v;
}
