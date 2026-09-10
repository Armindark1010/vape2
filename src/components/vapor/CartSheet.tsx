"use client";

/* سبد خرید به‌صورت Bottom Sheet با سوایپ برای بستن */
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useVape } from "@/store/vapeStore";
import { BottomSheet } from "@/components/vapor/BottomSheet";
import { money, FREE_SHIPPING, haptic } from "@/lib/vape";
import { PlusIcon, MinusIcon, TrashIcon, BagIcon, ArrowLeftIcon } from "@/components/vapor/VIcons";

export function CartSheet() {
  const { cartOpen, setCartOpen, cart, cartTotal, cartCount, setQty, remove, hydrated } = useVape();

  const remaining = FREE_SHIPPING - cartTotal;
  const progress = Math.min(100, (cartTotal / FREE_SHIPPING) * 100);

  return (
    <BottomSheet open={cartOpen} onClose={() => setCartOpen(false)} label="سبد خرید">
      <div className="flex items-center justify-between px-5 pb-2">
        <h2 className="flex items-center gap-2 text-[16px] font-extrabold text-snow">
          <BagIcon size={19} className="text-vio" />
          سبد خرید
          <span className="text-[12px] font-bold text-dim tnum">({cartCount})</span>
        </h2>
        <Link
          href="/cart"
          onClick={() => setCartOpen(false)}
          className="pressable flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-bold text-vio"
        >
          مشاهده کامل <ArrowLeftIcon size={14} />
        </Link>
      </div>

      {!hydrated || cart.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="text-5xl">🛒</span>
          <p className="text-[15px] font-extrabold text-snow">سبدت خالیه</p>
          <p className="max-w-[240px] text-[12px] leading-6 text-dim">
            چند تا پاد خوش‌طعم و سالت اصل می‌تونه امروز همدمت باشه.
          </p>
          <button
            onClick={() => setCartOpen(false)}
            className="pressable h-12 rounded-2xl bg-gradient-to-l from-vio to-ice px-8 text-[13px] font-extrabold text-ink"
          >
            برو به فروشگاه
          </button>
        </div>
      ) : (
        <>
          {/* نوار ارسال رایگان */}
          <div className="mx-5 mt-2 rounded-xl border border-white/8 bg-white/4 px-4 py-3">
            {remaining > 0 ? (
              <p className="text-[11.5px] text-mist">
                تا <strong className="text-ice">{money(remaining)}</strong> دیگه ارسال رایگانه 🚚
              </p>
            ) : (
              <p className="text-[11.5px] font-bold text-neon">ارسال سفارشت رایگان شد 🎉</p>
            )}
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-l from-vio via-ice to-neon"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* آیتم‌ها */}
          <ul className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
            <AnimatePresence initial={false}>
              {cart.map((c) => (
                <motion.li
                  key={c.k}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
                  className="card-g flex gap-3 rounded-2xl p-3"
                >
                  <Link href={`/product/${c.slug}`} onClick={() => setCartOpen(false)} className="shrink-0 overflow-hidden rounded-xl">
                    <img src={c.img} alt={c.name} className="h-24 w-20 object-cover" loading="lazy" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p dir="ltr" className="truncate text-right text-[13px] font-extrabold text-snow">{c.name}</p>
                        <p className="mt-0.5 text-[11px] text-mist">
                          {c.flavor && <span>طعم: {c.flavor}</span>}
                          {c.flavor && c.nicotine && <span> · </span>}
                          {c.nicotine && <span dir="ltr">نیکوتین {c.nicotine}mg</span>}
                        </p>
                      </div>
                      <button
                        onClick={() => remove(c.k)}
                        className="pressable grid h-9 w-9 shrink-0 place-items-center rounded-xl text-dim hover:bg-white/6 hover:text-blush"
                        aria-label="حذف از سبد"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex h-9 items-center overflow-hidden rounded-xl border border-white/12" dir="ltr">
                        <button
                          onClick={() => {
                            haptic(6);
                            setQty(c.k, c.qty + 1);
                          }}
                          className="grid h-full w-9 place-items-center text-snow active:bg-white/8"
                          aria-label="افزایش تعداد"
                        >
                          <PlusIcon size={14} />
                        </button>
                        <span className="grid h-full w-8 place-items-center text-[13px] font-extrabold text-snow tnum">{c.qty}</span>
                        <button
                          onClick={() => {
                            haptic(6);
                            setQty(c.k, c.qty - 1);
                          }}
                          className="grid h-full w-9 place-items-center text-snow active:bg-white/8"
                          aria-label="کاهش تعداد"
                        >
                          <MinusIcon size={14} />
                        </button>
                      </div>
                      <p className="text-[14px] font-extrabold text-neon tnum">{money(c.price * c.qty)}</p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {/* جمع و دکمه */}
          <div className="border-t border-white/8 px-5 pt-4 pb-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[13px] text-mist">جمع کل</span>
              <motion.span key={cartTotal} className="text-[17px] font-extrabold text-snow tnum">{money(cartTotal)}</motion.span>
            </div>
            <Link
              href="/checkout"
              onClick={() => {
                haptic(12);
                setCartOpen(false);
              }}
              className="pressable flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-vio to-ice text-[15px] font-extrabold text-ink glow-v"
            >
              ادامه خرید و پرداخت
              <ArrowLeftIcon size={17} sw={2.4} />
            </Link>
            <p className="mt-3 text-center text-[10.5px] text-dim">پرداخت در محل برای تهران فعال است · کالا ۱۰۰٪ اورجینال</p>
          </div>
        </>
      )}
    </BottomSheet>
  );
}
