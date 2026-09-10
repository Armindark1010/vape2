"use client";

/* Bottom Sheet فیلترهای فروشگاه — درگ/سوایپ برای بستن + فیلتر در URL */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BottomSheet } from "@/components/vapor/BottomSheet";
import { haptic } from "@/lib/vape";
import { CheckIcon } from "@/components/vapor/VIcons";

export type FState = {
  category?: string;
  brand?: string;
  inStock?: boolean;
  max?: number;
  sort?: string;
};

export function FilterSheet({
  open,
  onClose,
  initial,
  cats,
  brands,
  priceCeil,
  sortOptions,
}: {
  open: boolean;
  onClose: () => void;
  initial: FState;
  cats: { slug: string; name: string }[];
  brands: { slug: string; name: string }[];
  priceCeil: number;
  sortOptions: { v: string; l: string }[];
}) {
  const router = useRouter();
  const [d, setD] = useState<FState>(initial);
  const key = JSON.stringify(initial);
  useEffect(() => setD(initial), [key]); // eslint-disable-line react-hooks/exhaustive-deps

  function apply() {
    haptic(10);
    const q = new URLSearchParams();
    if (d.category) q.set("category", d.category);
    if (d.brand) q.set("brand", d.brand);
    if (d.inStock) q.set("stock", "in");
    if (d.max != null && d.max < priceCeil) q.set("max", String(d.max));
    if (d.sort && d.sort !== "popular") q.set("sort", d.sort);
    const s = q.toString();
    router.replace(s ? `/shop?${s}` : "/shop");
    onClose();
  }

  function reset() {
    setD({ sort: "popular" });
    router.replace("/shop");
    onClose();
  }

  return (
    <BottomSheet open={open} onClose={onClose} label="فیلترها" snap="80svh">
      <div className="flex items-center justify-between px-5 pb-1">
        <h2 className="text-[16px] font-extrabold text-snow">فیلتر محصولات</h2>
        <button onClick={reset} className="pressable rounded-xl px-3 py-2 text-[12px] font-bold text-blush">
          حذف همه فیلترها
        </button>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-4">
        {/* مرتب‌سازی */}
        <div>
          <p className="mb-3 text-[12px] font-extrabold text-mist">مرتب‌سازی بر اساس</p>
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {sortOptions.map((o) => (
              <button
                key={o.v}
                onClick={() => setD((p) => ({ ...p, sort: o.v }))}
                className={`pressable h-11 shrink-0 rounded-2xl px-4 text-[12.5px] font-bold transition-colors ${
                  (d.sort ?? "popular") === o.v ? "border border-vio/50 bg-vio/15 text-snow glow-v" : "border border-white/10 bg-white/4 text-mist"
                }`}
              >
                {o.l}
              </button>
            ))}
          </div>
        </div>

        {/* دسته */}
        <div>
          <p className="mb-3 text-[12px] font-extrabold text-mist">دسته‌بندی</p>
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <button
                key={c.slug}
                onClick={() => setD((p) => ({ ...p, category: p.category === c.slug ? undefined : c.slug }))}
                className={`pressable h-11 rounded-2xl px-4 text-[13px] font-bold ${
                  d.category === c.slug ? "border border-vio/50 bg-vio/15 text-snow glow-v" : "border border-white/10 bg-white/4 text-mist"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* برند */}
        <div>
          <p className="mb-3 text-[12px] font-extrabold text-mist">برند</p>
          <div className="flex flex-wrap gap-2">
            {brands.map((b) => (
              <button
                key={b.slug}
                onClick={() => setD((p) => ({ ...p, brand: p.brand === b.slug ? undefined : b.slug }))}
                className={`pressable h-11 rounded-2xl px-4 text-[13px] font-bold ${
                  d.brand === b.slug ? "border border-neon/50 bg-neon/12 text-neon" : "border border-white/10 bg-white/4 text-mist"
                }`}
              >
                <span dir="ltr">{b.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* قیمت */}
        <div>
          <p className="mb-3 text-[12px] font-extrabold text-mist">
            حداکثر قیمت: <span className="text-snow tnum">{(d.max ?? priceCeil).toLocaleString("en-US")} تومان</span>
          </p>
          <input
            type="range"
            min={100_000}
            max={priceCeil}
            step={50_000}
            value={d.max ?? priceCeil}
            onChange={(e) => setD((p) => ({ ...p, max: Number(e.target.value) }))}
            className="w-full accent-[#a78bfa]"
            aria-label="حداکثر قیمت"
          />
          <div className="mt-1 flex justify-between text-[10.5px] text-dim tnum">
            <span>۱۰۰ هزار</span>
            <span>{(priceCeil / 1_000_000).toLocaleString("en-US")} میلیون</span>
          </div>
        </div>

        {/* موجودی */}
        <button
          onClick={() => setD((p) => ({ ...p, inStock: !p.inStock }))}
          className="flex h-14 w-full items-center justify-between rounded-2xl border border-white/10 bg-white/4 px-4"
          role="checkbox"
          aria-checked={!!d.inStock}
        >
          <span className="text-[13px] font-bold text-snow">فقط کالاهای موجود</span>
          <span className={`grid h-6 w-6 place-items-center rounded-lg border transition-colors ${d.inStock ? "border-neon bg-neon text-ink" : "border-white/20"}`}>
            {d.inStock && <CheckIcon size={14} sw={3} />}
          </span>
        </button>
      </div>

      <div className="border-t border-white/8 px-5 pt-3 pb-4">
        <button
          onClick={apply}
          className="pressable h-14 w-full rounded-2xl bg-gradient-to-l from-vio to-ice text-[15px] font-extrabold text-ink glow-v"
        >
          نمایش نتایج
        </button>
      </div>
    </BottomSheet>
  );
}
