import { ref, computed, watch, onMounted } from "vue";
import type { VItem, VToast } from "~/types";
import { AGE_KEY, haptic } from "~/utils/vape";

type AddArgs = {
  id: number;
  slug: string;
  name: string;
  img: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  variantId?: string | null;
  color?: string | null;
  flavor?: string | null;
  nicotine?: string | null;
};

// Global singleton reactive state
const hydrated = ref(false);
const ageOk = ref(false);
const cart = ref<VItem[]>([]);
const wish = ref<number[]>([]);
const toasts = ref<VToast[]>([]);
const cartOpen = ref(false);
let toastIdCounter = 0;

function loadStorage<T>(key: string, fallback: T): T {
  try {
    if (typeof window === "undefined") return fallback;
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useVape() {
  const init = () => {
    if (typeof window === "undefined" || hydrated.value) return;
    cart.value = loadStorage<VItem[]>("vapora.cart", []);
    wish.value = loadStorage<number[]>("vapora.wish", []);
    ageOk.value = loadStorage<boolean>(AGE_KEY, false);
    hydrated.value = true;
    revalidateCart();
  };

  const revalidateCart = async () => {
    if (cart.value.length === 0) return;
    try {
      const res = await $fetch<any>("/api/products");
      const list = Array.isArray(res) ? res : (res?.products || res?.items || []);
      if (list.length > 0) {
        const prodMap = new Map<number, any>(list.map((p: any) => [Number(p.id), p]));
        cart.value = cart.value.map((c) => {
          const prod = prodMap.get(Number(c.id));
          if (!prod) return c;
          let currentStock = prod.stock;
          if (c.variantId && prod.variants && Array.isArray(prod.variants)) {
            const v = prod.variants.find((x: any) => x.id === c.variantId || x.color === c.color);
            if (v) currentStock = v.stock;
          }
          return {
            ...c,
            stock: currentStock,
          };
        });
        if (typeof window !== "undefined") {
          localStorage.setItem("vapora.cart", JSON.stringify(cart.value));
        }
      }
    } catch {
      // Ignore
    }
  };

  if (typeof window !== "undefined") {
    init();
  }

  const dismiss = (id: number) => {
    toasts.value = toasts.value.filter((x) => x.id !== id);
  };

  const toast = (msg: string, kind: "ok" | "err" = "ok") => {
    const id = ++toastIdCounter;
    toasts.value = [...toasts.value.slice(-2), { id, msg, kind }];
    if (typeof window !== "undefined") {
      setTimeout(() => dismiss(id), 2800);
    }
  };

  const confirmAge = () => {
    ageOk.value = true;
    if (typeof window !== "undefined") {
      localStorage.setItem(AGE_KEY, "true");
    }
  };

  const add = (a: AddArgs, qty = 1, silent = false) => {
    const k = `${a.id}__${a.variantId ?? ""}__${a.color ?? ""}__${a.flavor ?? ""}__${a.nicotine ?? ""}`;
    const ex = cart.value.find((c) => c.k === k);
    const nq = (ex?.qty ?? 0) + qty;
    if (nq > Math.min(a.stock, 99)) {
      toast("حداکثر موجودی این مدل در انبار به سبد افزوده شده است.", "err");
      return;
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
      variantId: a.variantId ?? null,
      color: a.color ?? null,
      flavor: a.flavor ?? null,
      nicotine: a.nicotine ?? null,
    };
    if (ex) {
      cart.value = cart.value.map((c) => (c.k === k ? item : c));
    } else {
      cart.value = [...cart.value, item];
    }

    if (!silent) {
      haptic(12);
      toast("به سبد اضافه شد ✓");
    }
    cartOpen.value = true;

    if (hydrated.value && typeof window !== "undefined") {
      localStorage.setItem("vapora.cart", JSON.stringify(cart.value));
    }
  };

  const setQty = (k: string, qty: number) => {
    cart.value = cart.value
      .map((c) => (c.k === k ? { ...c, qty: Math.max(0, Math.min(c.stock, 99, qty)) } : c))
      .filter((c) => c.qty > 0);

    if (hydrated.value && typeof window !== "undefined") {
      localStorage.setItem("vapora.cart", JSON.stringify(cart.value));
    }
  };

  const remove = (k: string) => {
    cart.value = cart.value.filter((c) => c.k !== k);
    if (hydrated.value && typeof window !== "undefined") {
      localStorage.setItem("vapora.cart", JSON.stringify(cart.value));
    }
  };

  const clear = () => {
    cart.value = [];
    if (hydrated.value && typeof window !== "undefined") {
      localStorage.setItem("vapora.cart", JSON.stringify([]));
    }
  };

  const setCartOpen = (v: boolean) => {
    cartOpen.value = v;
  };

  const inWish = (id: number) => wish.value.includes(id);

  const toggleWish = (id: number, name: string) => {
    const has = wish.value.includes(id);
    haptic(8);
    toast(has ? `از علاقه‌مندی‌ها حذف شد: ${name}` : `${name} ❤️ به علاقه‌مندی‌ها اضافه شد`);
    wish.value = has ? wish.value.filter((x) => x !== id) : [...wish.value, id];
    if (hydrated.value && typeof window !== "undefined") {
      localStorage.setItem("vapora.wish", JSON.stringify(wish.value));
    }
  };

  const cartCount = computed(() => cart.value.reduce((s, c) => s + c.qty, 0));
  const cartTotal = computed(() => cart.value.reduce((s, c) => s + c.price * c.qty, 0));

  const hasOutOfStockItems = computed(() =>
    cart.value.some((c) => c.stock <= 0 || c.qty > c.stock)
  );

  const outOfStockItems = computed(() =>
    cart.value.filter((c) => c.stock <= 0 || c.qty > c.stock)
  );

  return {
    hydrated,
    ageOk,
    confirmAge,
    cart,
    cartCount,
    cartTotal,
    hasOutOfStockItems,
    outOfStockItems,
    revalidateCart,
    add,
    setQty,
    remove,
    clear,
    cartOpen,
    setCartOpen,
    wish,
    inWish,
    toggleWish,
    toasts,
    toast,
    dismiss,
    init,
  };
}
