"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useVape } from "@/store/vapeStore";
import { money, FREE_SHIPPING, haptic, DEMO_USER } from "@/lib/vape";
import { ArrowLeftIcon, CheckIcon, ShieldIcon, DropletIcon } from "@/components/vapor/VIconsCheckout";

export default function CheckoutPage() {
  const { cart, cartTotal, clear, ageOk, hydrated } = useVape();
  const [done, setDone] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [f, setF] = useState({ name: "", phone: "", city: "تهران", addr: "", zip: "", note: "" });

  const shipping = cartTotal >= FREE_SHIPPING || cart.length === 0 ? 0 : 65_000;
  const total = cartTotal + shipping;

  async function place(e: React.FormEvent) {
    e.preventDefault();
    if (!ageOk) {
      setErr("برای خرید ابتدا باید سن بالای ۱۸ سال خود را تأیید کنید (گیت سن ابتدای سایت).");
      return;
    }
    if (f.name.trim().length < 3 || f.addr.trim().length < 6 || f.phone.trim().length < 10) {
      setErr("نام، شماره موبایل و آدرس را کامل وارد کنید.");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((c) => ({ id: c.id, qty: c.qty })),
          couponCode: null,
          customer: {
            name: f.name.trim(),
            email: DEMO_USER.email,
            phone: f.phone.trim(),
            line1: f.addr.trim(),
            line2: f.note.trim() || undefined,
            city: f.city,
            zip: f.zip.trim() || "00000",
            country: "Iran",
          },
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? "خطا در ثبت سفارش");
      haptic(20);
      clear();
      setDone(d.number);
      window.scrollTo({ top: 0 });
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "خطا در ثبت سفارش");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="wrap flex min-h-[75svh] flex-col items-center justify-center py-10 text-center">
        <motion.span
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 240, damping: 16 }}
          className="grid h-24 w-24 place-items-center rounded-full border border-neon/40 bg-neon/12 text-neon glow-g"
        >
          <CheckIcon size={40} sw={2.6} />
        </motion.span>
        <h1 className="mt-8 font-display text-[26px] font-extrabold text-snow">سفارشت ثبت شد! 🎉</h1>
        <p className="mt-3 text-[13.5px] leading-7 text-mist">
          شماره پیگیری: <strong dir="ltr" className="text-vio">{done}</strong>
          <br />
          تیم ویپورا به‌زودی برای هماهنگی ارسال باهات تماس می‌گیره.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="pressable inline-flex h-13 items-center rounded-2xl bg-gradient-to-l from-vio to-ice px-7 py-4 text-[13.5px] font-extrabold text-ink glow-v">
            ادامه خرید
          </Link>
          <Link href="/account" className="pressable inline-flex h-13 items-center rounded-2xl border border-white/14 px-7 py-4 text-[13.5px] font-extrabold text-snow">
            پیگیری سفارش
          </Link>
        </div>
      </div>
    );
  }

  if (!hydrated) {
    return (
      <div className="wrap pt-8" aria-busy="true">
        <div className="skeleton h-10 w-64" />
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="skeleton h-96 w-full" />
          <div className="skeleton h-96 w-full" />
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="wrap flex min-h-[70svh] flex-col items-center justify-center text-center">
        <p className="text-6xl">🧾</p>
        <h1 className="mt-5 text-[20px] font-extrabold text-snow">چیزی برای پرداخت نیست</h1>
        <p className="mt-2 text-[13px] text-dim">اول چند محصول خوش‌طعم به سبدت اضافه کن.</p>
        <Link href="/shop" className="pressable mt-7 inline-flex h-13 items-center rounded-2xl bg-gradient-to-l from-vio to-ice px-8 py-4 text-[14px] font-extrabold text-ink glow-v">
          رفتن به فروشگاه
        </Link>
      </div>
    );
  }

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="wrap pt-8 pb-4">
      <Link href="/cart" className="mb-4 inline-flex items-center gap-2 text-[13px] font-bold text-vio">
        <ArrowLeftIcon size={16} /> بازگشت به سبد
      </Link>
      <h1 className="font-display text-[26px] font-extrabold text-snow">تکمیل سفارش</h1>
      {!ageOk && (
        <p className="mt-4 rounded-2xl border border-blush/25 bg-blush/8 px-4 py-3 text-[12.5px] text-blush">
          ⚠️ گیت تأیید سن را کامل نکرده‌اید — برای خرید، ورود شما باید بالای ۱۸ سال باشد.
        </p>
      )}

      <form onSubmit={place} className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <div className="card-g rounded-[22px] p-5">
            <h2 className="mb-4 flex items-center gap-2 text-[15px] font-extrabold text-snow">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-vio/15 text-[12px] text-vio">۱</span>
              اطلاعات گیرنده
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-[11.5px] font-bold text-dim">نام و نام خانوادگی</span>
                <input className="input" value={f.name} onChange={set("name")} placeholder="مثلاً آرمان رضایی" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[11.5px] font-bold text-dim">شماره موبایل</span>
                <input className="input" dir="ltr" inputMode="tel" value={f.phone} onChange={set("phone")} placeholder="0912 345 6789" />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-[11.5px] font-bold text-dim">آدرس کامل</span>
                <input className="input" value={f.addr} onChange={set("addr")} placeholder="خیابان، کوچه، پلاک، واحد" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[11.5px] font-bold text-dim">شهر</span>
                <select className="input" value={f.city} onChange={set("city")}>
                  {["تهران", "کرج", "شیراز", "اصفهان", "مشهد", "تبریز", "رشت"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[11.5px] font-bold text-dim">کد پستی</span>
                <input className="input" dir="ltr" value={f.zip} onChange={set("zip")} placeholder="—" />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-[11.5px] font-bold text-dim">توضیحات (اختیاری)</span>
                <input className="input" value={f.note} onChange={set("note")} placeholder="مثلاً: بعد از ۶ عصر تماس بگیرید" />
              </label>
            </div>
          </div>

          <div className="card-g rounded-[22px] p-5">
            <h2 className="mb-3 flex items-center gap-2 text-[15px] font-extrabold text-snow">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-vio/15 text-[12px] text-vio">۲</span>
              روش پرداخت
            </h2>
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-neon/40 bg-neon/8 px-4 py-4">
              <input type="radio" checked readOnly className="accent-[#4ade80]" />
              <span className="flex-1 text-[13.5px] font-extrabold text-snow">پرداخت در محل (فقط تهران)</span>
              <span className="text-[11px] text-dim">تحویل بگیر، بعد پرداخت کن</span>
            </label>
            <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/3 px-4 py-4 opacity-60">
              <input type="radio" disabled />
              <span className="flex-1 text-[13.5px] font-extrabold text-snow">پرداخت آنلاین (به‌زودی)</span>
            </label>
          </div>
        </div>

        {/* خلاصه */}
        <aside className="card-g sticky top-20 rounded-[22px] p-5">
          <h2 className="text-[15px] font-extrabold text-snow">سفارش شما</h2>
          <ul className="mt-4 max-h-60 space-y-3 overflow-y-auto">
            {cart.map((c) => (
              <li key={c.k} className="flex items-center gap-3">
                <img src={c.img} alt="" className="h-14 w-12 rounded-xl object-cover" loading="lazy" />
                <div className="min-w-0 flex-1">
                  <p dir="ltr" className="truncate text-right text-[12.5px] font-extrabold text-snow">{c.name}</p>
                  <p className="text-[10.5px] text-dim tnum">
                    {c.qty} × {money(c.price)}
                    {c.flavor && ` · ${c.flavor}`}
                  </p>
                </div>
                <span className="text-[12.5px] font-extrabold text-snow tnum">{money(c.price * c.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-3 border-t border-white/8 pt-4 text-[13px]">
            <div className="flex justify-between">
              <dt className="text-dim">جمع کالاها</dt>
              <dd className="font-extrabold text-snow tnum">{money(cartTotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-dim">ارسال</dt>
              <dd className={`font-extrabold tnum ${shipping === 0 ? "text-neon" : "text-snow"}`}>{shipping === 0 ? "رایگان" : money(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-white/8 pt-3">
              <dt className="text-[15px] font-extrabold text-snow">قابل پرداخت</dt>
              <dd className="text-[18px] font-extrabold text-grad tnum">{money(total)}</dd>
            </div>
          </dl>

          {err && <p className="mt-4 rounded-xl border border-blush/30 bg-blush/8 px-3 py-2.5 text-[12px] text-blush">{err}</p>}

          <button
            disabled={busy}
            className="pressable mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-vio to-ice text-[15px] font-extrabold text-ink glow-v disabled:opacity-60"
          >
            {busy ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-ink border-t-transparent" />
            ) : (
              <>
                <ShieldIcon size={18} sw={2.2} /> ثبت سفارش — {money(total)}
              </>
            )}
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-[10.5px] text-dim">
            <DropletIcon size={12} className="text-vio" />
            فروش فقط به افراد بالای ۱۸ سال — {money(0)} اضافه‌هزینه‌ای در کار نیست
          </p>
        </aside>
      </form>
    </div>
  );
}
