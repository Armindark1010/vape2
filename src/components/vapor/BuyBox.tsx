"use client";

/* BuyBox — انتخابگر تعاملی طعم و نیکوتین + سبد (لمس‌محور)
 * دکمه‌های بزرگ با انیمیشن انتخاب فوری (layoutId)
 */
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useVape } from "@/store/vapeStore";
import { money, haptic } from "@/lib/vape";
import { PlusIcon, MinusIcon, HeartIcon, StarIcon, ZapIcon, BagIcon, ShieldIcon, TruckIcon } from "@/components/vapor/VIcons";

type Opts = { flavors: string[]; nicotine: string[]; puffs?: string; salt?: boolean };

export function BuyBox({
  product,
}: {
  product: {
    id: number;
    slug: string;
    name: string;
    tagline: string | null;
    description: string | null;
    specs: Record<string, string>;
    price: number;
    discountPrice: number | null;
    rating: number;
    reviewCount: number;
    stock: number;
    brand: string;
    images: string[];
  };
}) {
  const { add, inWish, toggleWish } = useVape();
  const router = useRouter();
  const [qty, setQty] = useState(1);

  const opts = useMemo<Opts | null>(() => {
    try {
      return product.specs?.options ? (JSON.parse(product.specs.options) as Opts) : null;
    } catch {
      return null;
    }
  }, [product.specs]);

  const [flavor, setFlavor] = useState<string | null>(opts?.flavors?.[0] ?? null);
  const [nic, setNic] = useState<string | null>(opts?.nicotine?.[0] ?? null);

  const price = product.discountPrice ?? product.price;
  const pct = product.discountPrice ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
  const out = product.stock <= 0;
  const saved = inWish(product.id);

  const base = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    img: product.images[0],
    price,
    oldPrice: product.discountPrice != null ? product.price : null,
    stock: product.stock,
  };

  const addToCart = (buyNow = false) => {
    if (out) return;
    haptic(12);
    add({ ...base, flavor, nicotine: nic }, qty, buyNow);
    if (buyNow) router.push("/checkout");
  };

  const nics = opts?.nicotine ?? [];
  const flavors = opts?.flavors ?? [];

  return (
    <div className="space-y-5">
      {/* قیمت و عنوان */}
      <div>
        <p dir="ltr" className="text-[11px] font-extrabold tracking-[0.18em] text-vio">{product.brand}</p>
        <h1 dir="ltr" className="mt-1.5 text-right text-[22px] font-extrabold leading-8 text-snow">
          {product.name}
        </h1>
        {product.tagline && <p className="mt-2 text-[13px] leading-6 text-mist">{product.tagline}</p>}
      </div>

      <div className="flex items-center gap-3">
        <p className="text-[22px] font-extrabold text-snow tnum">{money(price)}</p>
        {product.discountPrice != null && <p className="text-[13px] text-dim line-through tnum">{money(product.price)}</p>}
        {pct > 0 && (
          <span className="rounded-lg bg-neon/15 px-2 py-1 text-[11px] font-extrabold text-neon" dir="ltr">
            ٪{pct} تخفیف
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 text-[12px]">
        <span className="flex items-center gap-1 font-bold text-snow" dir="ltr">
          <StarIcon size={15} filled className="text-gold" />
          {product.rating.toFixed(1)}
        </span>
        <span className="text-dim tnum">({product.reviewCount} نظر)</span>
        <span className="mx-1 text-dim">·</span>
        {out ? (
          <span className="font-extrabold text-blush">ناموجود — به‌زودی</span>
        ) : product.stock < 8 ? (
          <span className="font-extrabold text-gold">فقط {product.stock} عدد مونده 🔥</span>
        ) : (
          <span className="flex items-center gap-1.5 font-extrabold text-neon">
            <span className="pulse-ring h-2 w-2 rounded-full bg-neon" /> موجود در انبار
          </span>
        )}
      </div>

      {/* انتخاب طعم */}
      {flavors.length > 0 && (
        <div>
          <p className="mb-2.5 text-[12px] font-extrabold text-mist">انتخاب طعم</p>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="طعم">
            {flavors.map((f) => {
              const on = flavor === f;
              return (
                <button
                  key={f}
                  role="radio"
                  aria-checked={on}
                  onClick={() => {
                    haptic(6);
                    setFlavor(f);
                  }}
                  className={`pressable relative h-12 min-w-[92px] rounded-2xl px-4 text-[13px] font-bold transition-colors duration-300 ${
                    on ? "border border-vio/60 bg-vio/15 text-snow glow-v" : "border border-white/10 bg-white/4 text-mist"
                  }`}
                >
                  {on && (
                    <motion.span
                      layoutId="flavorRing"
                      className="absolute inset-0 rounded-2xl border-2 border-vio"
                      transition={{ type: "spring", stiffness: 500, damping: 34 }}
                    />
                  )}
                  {f}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* انتخاب نیکوتین */}
      {nics.length > 0 && (
        <div>
          <p className="mb-2.5 text-[12px] font-extrabold text-mist">میزان نیکوتین</p>
          <div className="flex gap-2" role="radiogroup" aria-label="نیکوتین">
            {nics.map((n) => {
              const on = nic === n;
              return (
                <button
                  key={n}
                  role="radio"
                  aria-checked={on}
                  onClick={() => {
                    haptic(6);
                    setNic(n);
                  }}
                  className={`pressable h-14 flex-1 rounded-2xl transition-all duration-300 ${
                    on
                      ? "bg-gradient-to-l from-neon/90 to-ice/90 text-ink glow-g"
                      : "border border-white/10 bg-white/4 text-mist"
                  }`}
                >
                  <span dir="ltr" className="block text-[15px] font-extrabold tnum">{n}mg</span>
                  <span className="block text-[9.5px] font-bold opacity-70">{Number(n) >= 35 ? "قوی · سالت" : "ملایم"}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {opts?.puffs && (
        <p className="rounded-xl border border-ice/20 bg-ice/8 px-4 py-2.5 text-[12px] text-ice">
          💨 تعداد پاف تقریبی: <strong dir="ltr">{opts.puffs}</strong>
        </p>
      )}

      {/* تعداد */}
      <div className="flex items-center gap-3">
        <span className="text-[12px] font-extrabold text-mist">تعداد</span>
        <div className="flex h-12 items-center overflow-hidden rounded-2xl border border-white/12" dir="ltr">
          <button
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            className="grid h-full w-12 place-items-center text-snow active:bg-white/8"
            aria-label="افزایش"
          >
            <PlusIcon size={16} />
          </button>
          <AnimatePresence mode="popLayout">
            <motion.span
              key={qty}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              className="grid h-full w-10 place-items-center text-[15px] font-extrabold text-snow tnum"
            >
              {qty}
            </motion.span>
          </AnimatePresence>
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid h-full w-12 place-items-center text-snow active:bg-white/8"
            aria-label="کاهش"
          >
            <MinusIcon size={16} />
          </button>
        </div>
        <button
          onClick={() => toggleWish(product.id, product.name)}
          aria-pressed={saved}
          aria-label="علاقه‌مندی"
          className={`pressable grid h-12 w-12 place-items-center rounded-2xl border ${saved ? "border-blush/50 bg-blush/15 text-blush" : "border-white/12 text-mist"}`}
        >
          <HeartIcon size={20} filled={saved} />
        </button>
      </div>

      {/* دکمه‌ها */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileTap={{ scale: 0.96 }}
          disabled={out}
          onClick={() => addToCart(false)}
          className="pressable flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-vio to-ice text-[14.5px] font-extrabold text-ink glow-v disabled:opacity-50"
        >
          <BagIcon size={18} sw={2.2} /> افزودن به سبد
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          disabled={out}
          onClick={() => addToCart(true)}
          className="pressable flex h-14 items-center justify-center gap-2 rounded-2xl border border-neon/40 bg-neon/10 text-[14.5px] font-extrabold text-neon disabled:opacity-50"
        >
          <ZapIcon size={18} sw={2.2} /> خرید فوری
        </motion.button>
      </div>

      {/* اعتماد */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { I: ShieldIcon, t: "ضمانت اصالت" },
          { I: TruckIcon, t: "ارسال امروز" },
          { I: StarIcon, t: "بازگشت ۷ روزه" },
        ].map(({ I, t }) => (
          <div key={t} className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/8 bg-white/3 px-2 py-3 text-center">
            <I size={17} className="text-vio" />
            <span className="text-[10px] font-bold text-mist">{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
