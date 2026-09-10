"use client";

/* TouchRows — اسلایدرهای لمسی با Snap Scroll (معادل CategorySlider.vue)
 *  - ریل افقی محصولات (touch-friendly)
 *  - چیپ‌های دسته‌بندی
 */
import Link from "next/link";
import type { ReactNode } from "react";
import { CATS_META } from "@/lib/vape";

export function SectionRow({
  title,
  sub,
  href,
  children,
}: {
  title: string;
  sub?: string;
  href?: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-10">
      <div className="wrap mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-[19px] font-extrabold text-snow">{title}</h2>
          {sub && <p className="mt-1 text-[11.5px] text-dim">{sub}</p>}
        </div>
        {href && (
          <Link href={href} className="pressable rounded-xl px-2 py-2 text-[12px] font-extrabold text-vio">
            مشاهده همه ←
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

/** ریل افقی محصولات با اسکرول اسنپ */
export function ProductRail({ children }: { children: ReactNode }) {
  return (
    <div className="no-scrollbar snap-x-mandatory flex gap-3 overflow-x-auto px-[max(1rem,calc((100vw-80rem)/2+1rem))] pb-1">
      {children}
    </div>
  );
}

export function RailItem({ children, width = "w-[46vw] max-w-[240px] min-w-[200px]" }: { children: ReactNode; width?: string }) {
  return <div className={`${width} shrink-0 snap-start`}>{children}</div>;
}

/** کارت‌های بزرگ دسته‌بندی (اسنپ افقی در موبایل، گرید در دسکتاپ) */
export function CategorySlider({
  cats,
}: {
  cats: { slug: string; name: string; count: number; image: string | null }[];
}) {
  return (
    <div className="wrap mt-10">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-[19px] font-extrabold text-snow">دسته‌بندی‌ها</h2>
          <p className="mt-1 text-[11.5px] text-dim">سریع‌ترین راه رسیدن به طعم دلخواهت</p>
        </div>
        <Link href="/categories" className="pressable rounded-xl px-2 py-2 text-[12px] font-extrabold text-vio">
          همه دسته‌ها ←
        </Link>
      </div>
      <div className="no-scrollbar snap-x-mandatory -mx-0 flex gap-3 overflow-x-auto pb-1 lg:grid lg:grid-cols-4">
        {cats.map((c, i) => {
          const meta = CATS_META[c.slug] ?? { label: c.name, emoji: "✨", tint: "vio" };
          const tintBg =
            meta.tint === "neon"
              ? "from-neon/25 to-ink"
              : meta.tint === "ice"
                ? "from-ice/25 to-ink"
                : meta.tint === "blush"
                  ? "from-blush/25 to-ink"
                  : "from-vio/30 to-ink";
          return (
            <Link
              key={c.slug}
              href={`/shop?category=${c.slug}`}
              className={`group relative block w-[72vw] max-w-[300px] shrink-0 snap-start overflow-hidden rounded-[22px] border border-white/10 lg:w-auto ${i === 0 ? "lg:col-span-1" : ""}`}
            >
              <div className="relative aspect-[16/11] w-full overflow-hidden sm:aspect-[16/10]">
                <img
                  src={c.image ?? ""}
                  alt={c.name}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${meta.tint === "neon" ? "from-ink via-neon/15" : meta.tint === "ice" ? "from-ink via-ice/15" : meta.tint === "blush" ? "from-ink via-blush/15" : "from-ink via-vio/20"} to-transparent`} />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                  <div>
                    <p className="text-[17px] font-extrabold text-snow drop-shadow-md">{c.name}</p>
                    <p className="mt-0.5 text-[11px] text-mist tnum">{c.count} محصول</p>
                  </div>
                  <span className="text-[24px] drop-shadow-[0_0_14px_rgba(167,139,250,0.8)]">{meta.emoji}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
