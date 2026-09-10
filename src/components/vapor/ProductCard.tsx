"use client";

/* ProductCard — کارت محصول لمسی با گلو و انیمیشن انتخاب (معادل ProductCard.vue)
 * دکمه‌های ۴۸px+، هپتیک، حالت علاقه‌مندی و افزودن سریع
 */
import Link from "next/link";
import { motion } from "framer-motion";
import { useVape } from "@/store/vapeStore";
import { money, haptic, CATS_META } from "@/lib/vape";
import { HeartIcon, PlusIcon, StarIcon } from "@/components/vapor/VIcons";

type VProduct = {
  id: number;
  slug: string;
  name: string;
  tagline: string | null;
  price: number;
  discountPrice: number | null;
  rating: number;
  reviewCount: number;
  stock: number;
  brand: string;
  categorySlug: string;
  images: string[];
  newArrival?: boolean;
};

export function ProductCard({ p, index = 0 }: { p: VProduct; index?: number }) {
  const { add, inWish, toggleWish } = useVape();
  const out = p.stock <= 0;
  const price = p.discountPrice ?? p.price;
  const pct = p.discountPrice ? Math.round(((p.price - p.discountPrice) / p.price) * 100) : 0;
  const saved = inWish(p.id);
  const flavorHint = p.tagline;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.4), ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div className="card-g relative overflow-hidden rounded-[20px] transition-all duration-500 hover:border-vio/40 hover:glow-v active:scale-[0.985]">
        <Link href={`/product/${p.slug}`} className="relative block overflow-hidden">
          <div className="aspect-[4/5] overflow-hidden bg-panel">
            <img
              src={p.images[0]}
              alt={p.name}
              loading={index < 4 ? "eager" : "lazy"}
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
          </div>
          {/* نور نئونی روی لبه هنگام لمس/هاور */}
          <div className="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-80" />

          {pct > 0 && (
            <span className="absolute top-3 right-3 rounded-xl bg-gradient-to-l from-neon to-ice px-2.5 py-1 text-[11px] font-extrabold text-ink tnum" dir="ltr">
              ٪{pct}
            </span>
          )}
          {p.newArrival && (
            <span className="absolute top-3 left-3 rounded-xl bg-vio/85 px-2.5 py-1 text-[10.5px] font-extrabold text-white backdrop-blur">
              جدید
            </span>
          )}
          {out && (
            <span className="absolute inset-0 grid place-items-center bg-ink/60 backdrop-blur-[2px] text-[13px] font-extrabold text-blush">
              ناموجود
            </span>
          )}
        </Link>

        {/* دکمه علاقه‌مندی */}
        <button
          onClick={() => toggleWish(p.id, p.name)}
          aria-pressed={saved}
          aria-label={saved ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
          className={`pressable absolute top-3 left-12 grid h-11 w-11 place-items-center rounded-full backdrop-blur-md ${
            saved ? "bg-blush/90 text-ink" : "bg-ink/50 text-snow"
          }`}
        >
          <HeartIcon size={19} filled={saved} />
        </button>

        <div className="p-3.5">
          <div className="flex items-center justify-between gap-2">
            <p dir="ltr" className="truncate text-[12.5px] font-extrabold tracking-wide text-snow">{p.name}</p>
            <span className="flex shrink-0 items-center gap-1 text-[11px] font-bold text-gold tnum" dir="ltr">
              <StarIcon size={12} filled className="text-gold" />
              {p.rating.toFixed(1)}
            </span>
          </div>
          {flavorHint && <p className="mt-1 truncate text-[11px] text-mist">{flavorHint}</p>}
          <p className="mt-0.5 text-[10px] font-bold text-dim" dir="ltr">
            {p.brand} · {CATS_META[p.categorySlug]?.label ?? ""}
          </p>

          <div className="mt-3 flex items-center justify-between gap-2">
            <div>
              <p className="text-[13.5px] font-extrabold text-snow tnum">{money(price)}</p>
              {p.discountPrice != null && (
                <p className="text-[10.5px] text-dim line-through tnum">{money(p.price)}</p>
              )}
            </div>
            <motion.button
              whileTap={{ scale: 0.88 }}
              disabled={out}
              onClick={() => {
                if (out) return;
                haptic(10);
                add({
                  id: p.id,
                  slug: p.slug,
                  name: p.name,
                  img: p.images[0],
                  price,
                  oldPrice: p.discountPrice != null ? p.price : null,
                  stock: p.stock,
                });
              }}
              className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition-all duration-300 ${
                out
                  ? "bg-white/6 text-dim"
                  : "bg-gradient-to-br from-vio to-ice text-ink shadow-[0_6px_22px_-6px_rgba(167,139,250,0.65)]"
              }`}
              aria-label={`افزودن ${p.name} به سبد`}
            >
              <PlusIcon size={22} sw={2.4} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
