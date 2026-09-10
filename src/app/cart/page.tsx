"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useVape } from "@/store/vapeStore";
import { money, FREE_SHIPPING, haptic } from "@/lib/vape";
import { PlusIcon, MinusIcon, TrashIcon, ArrowLeftIcon, TagIcon, CheckIcon } from "@/components/vapor/VIconsCart";

export default function CartPage() {
  const { cart, cartTotal, setQty, remove, hydrated } = useVape();
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const [coupon, setCoupon] = useState<{ code: string; percent: number } | null>(null);
  const [busy, setBusy] = useState(false);

  const discount = coupon ? Math.round((cartTotal * coupon.percent) / 100) : 0;
  const shipping = cartTotal - discount >= FREE_SHIPPING || cart.length === 0 ? 0 : 65_000;
  const total = cartTotal - discount + shipping;

  async function applyCoupon(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim() || busy) return;
    setBusy(true);
    setMsg(null);
    try {
      const r = await fetch(`/api/coupon?code=${encodeURIComponent(code.trim())}`);
      const d = await r.json();
      if (!r.ok || !d.coupon) {
        setMsg({ ok: false, t: d.error ?? "کد نامعتبر است" });
        return;
      }
      setCoupon({ code: d.coupon.code, percent: d.coupon.percent ?? 0 });
      setMsg({ ok: true, t: `${d.coupon.description} — اعمال شد 🎉` });
      setCode("");
    } catch {
      setMsg({ ok: false, t: "خطا در بررسی کد" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="wrap pt-8 pb-4">
      <div className="flex items-center gap-3">
        <h1 className="font-display text-[26px] font-extrabold text-snow">سبد خرید</h1>
        <span className="text-[12.5px] text-dim tnum">({cart.length} کالا)</span>
      </div>

      {!hydrated ? (
        <div className="mt-8 space-y-4" aria-busy="true">
          {[0, 1].map((i) => (
            <div key={i} className="skeleton h-32 w-full" />
          ))}
        </div>
      ) : cart.length === 0 ? (
        <div className="card-g mt-8 rounded-[24px] p-14 text-center">
          <p className="text-6xl">🛒</p>
          <h2 className="mt-5 text-[18px] font-extrabold text-snow">سبد خریدت خالیه</h2>
          <p className="mt-2 text-[13px] leading-7 text-dim">
            یه پاد خوش‌طعم، یه سالت اصل یا یه مود حرفه‌ای — انتخاب با توئه.
          </p>
          <Link href="/shop" className="pressable mt-7 inline-flex h-13 items-center gap-2 rounded-2xl bg-gradient-to-l from-vio to-ice px-8 py-4 text-[14px] font-extrabold text-ink glow-v">
            رفتن به فروشگاه <ArrowLeftIcon size={17} sw={2.4} />
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_380px]">
          {/* اقلام */}
          <ul className="space-y-3">
            <AnimatePresence initial={false}>
              {cart.map((c) => (
                <motion.li
                  key={c.k}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="card-g flex gap-4 rounded-[20px] p-4"
                >
                  <Link href={`/product/${c.slug}`} className="shrink-0 overflow-hidden rounded-2xl">
                    <img src={c.img} alt={c.name} className="h-28 w-24 object-cover" loading="lazy" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link href={`/product/${c.slug}`} dir="ltr" className="block truncate text-right text-[14px] font-extrabold text-snow">
                          {c.name}
                        </Link>
                        <p className="mt-1 text-[11.5px] text-mist">
                          {c.flavor && `طعم: ${c.flavor}`}
                          {c.nicotine && <span dir="ltr"> · نیکوتین {c.nicotine}mg</span>}
                        </p>
                        <p className="mt-2 text-[13px] font-extrabold text-neon tnum">{money(c.price * c.qty)}</p>
                      </div>
                      <button
                        onClick={() => remove(c.k)}
                        className="pressable grid h-10 w-10 place-items-center rounded-xl text-dim hover:bg-white/6 hover:text-blush"
                        aria-label="حذف"
                      >
                        <TrashIcon size={17} />
                      </button>
                    </div>
                    <div className="mt-auto flex h-11 w-fit items-center overflow-hidden rounded-2xl border border-white/12 pt-0" dir="ltr">
                      <button onClick={() => { haptic(6); setQty(c.k, c.qty + 1); }} className="grid h-full w-11 place-items-center text-snow active:bg-white/8" aria-label="افزایش">
                        <PlusIcon size={15} />
                      </button>
                      <span className="grid h-full w-10 place-items-center text-[14px] font-extrabold text-snow tnum">{c.qty}</span>
                      <button onClick={() => { haptic(6); setQty(c.k, c.qty - 1); }} className="grid h-full w-11 place-items-center text-snow active:bg-white/8" aria-label="کاهش">
                        <MinusIcon size={15} />
                      </button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {/* خلاصه */}
          <aside className="card-g sticky top-20 rounded-[22px] p-5">
            <h2 className="text-[15px] font-extrabold text-snow">خلاصه سفارش</h2>

            <form onSubmit={applyCoupon} className="mt-4 flex gap-2">
              <label className="sr-only" htmlFor="cp">کد تخفیف</label>
              <input
                id="cp"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="کد تخفیف (VAPORA15)"
                dir="ltr"
                className="input h-12 flex-1 text-center text-[13px] font-bold"
              />
              <button
                disabled={busy || !code.trim()}
                className="pressable grid h-12 w-14 place-items-center rounded-2xl border border-white/12 text-vio disabled:opacity-40"
                aria-label="اعمال کد تخفیف"
              >
                <TagIcon size={18} />
              </button>
            </form>
            {msg && (
              <p className={`mt-2 flex items-center gap-1.5 text-[11.5px] font-bold ${msg.ok ? "text-neon" : "text-blush"}`}>
                <CheckIcon size={12} /> {msg.t}
              </p>
            )}

            <dl className="mt-5 space-y-3 border-t border-white/8 pt-4 text-[13px]">
              <div className="flex justify-between">
                <dt className="text-dim">جمع کالاها</dt>
                <dd className="font-extrabold text-snow tnum">{money(cartTotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-neon">
                  <dt>تخفیف ({coupon?.code})</dt>
                  <dd className="font-extrabold tnum">−{money(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-dim">ارسال</dt>
                <dd className={`font-extrabold tnum ${shipping === 0 ? "text-neon" : "text-snow"}`}>
                  {shipping === 0 ? "رایگان 🎉" : money(shipping)}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-white/8 pt-3">
                <dt className="text-[15px] font-extrabold text-snow">مبلغ قابل پرداخت</dt>
                <dd className="text-[18px] font-extrabold text-grad tnum">{money(total)}</dd>
              </div>
            </dl>

            <Link
              href="/checkout"
              className="pressable mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-vio to-ice text-[15px] font-extrabold text-ink glow-v"
            >
              ادامه و پرداخت <ArrowLeftIcon size={18} sw={2.4} />
            </Link>
            <p className="mt-3 text-center text-[10.5px] text-dim">پرداخت در محل (تهران) · ضمانت اصالت کالا</p>
          </aside>
        </div>
      )}
    </div>
  );
}
