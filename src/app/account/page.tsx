import type { Metadata } from "next";
import Link from "next/link";
import { getOrdersByEmail } from "@/db/queries";
import { DEMO_USER, SITE } from "@/lib/vape";
import { money, formatDateFa } from "@/lib/vapeAcct";
import { UserIcon, CheckIcon, ChevronLeftIcon } from "@/components/vapor/VIconsAcct";
import type { OrderView } from "@/lib/types";

export const metadata: Metadata = {
  title: "حساب کاربری",
  robots: { index: false, follow: true },
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  let orders: OrderView[] = [];
  try {
    orders = await getOrdersByEmail(DEMO_USER.email);
  } catch (e) {
    console.error("Account orders fetch error:", e);
    orders = [];
  }
  const shipped = orders.filter((o) => ["shipped", "delivered", "processing"].includes(o.status));

  return (
    <div className="wrap pt-8 pb-4">
      {/* پروفایل */}
      <div className="card-g relative overflow-hidden rounded-[24px] p-6">
        <div className="pointer-events-none absolute -top-16 left-1/3 h-40 w-72 rounded-full bg-vio/15 blur-3xl" />
        <div className="relative flex flex-wrap items-center gap-5">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-vio to-ice text-[22px] font-extrabold text-ink">
            آ
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-[19px] font-extrabold text-snow">{DEMO_USER.name}</h1>
            <p className="mt-1 flex items-center gap-2 text-[12px] text-dim" dir="ltr">
              <UserIcon size={13} /> {DEMO_USER.email} · {DEMO_USER.phone}
            </p>
            <p className="mt-1 text-[11px] text-vio">عضو از {DEMO_USER.joined} · حساب دمو</p>
          </div>
          <span className="rounded-xl border border-neon/25 bg-neon/10 px-3 py-1.5 text-[11px] font-extrabold text-neon">تأیید سن ✓</span>
        </div>
      </div>

      {/* آمار */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { n: String(orders.length), l: "سفارش‌ها" },
          { n: String(shipped.length), l: "در جریان" },
          { n: money(orders.reduce((s, o) => s + o.total, 0)), l: "مجموع خرید" },
        ].map((s) => (
          <div key={s.l} className="card-g rounded-[20px] p-4 text-center">
            <p className="truncate text-[16px] font-extrabold text-snow tnum">{s.n}</p>
            <p className="mt-1 text-[10.5px] text-dim">{s.l}</p>
          </div>
        ))}
      </div>

      {/* سفارش‌ها */}
      <h2 className="mt-8 mb-4 text-[16px] font-extrabold text-snow">سفارش‌های اخیر</h2>
      {orders.length === 0 ? (
        <div className="card-g rounded-[20px] p-10 text-center">
          <p className="text-5xl">📦</p>
          <p className="mt-4 text-[14px] font-extrabold text-snow">هنوز سفارشی ثبت نکردی</p>
          <Link href="/shop" className="pressable mt-5 inline-flex h-12 items-center rounded-2xl bg-gradient-to-l from-vio to-ice px-6 text-[13px] font-extrabold text-ink">
            اولین خریدت رو شروع کن
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.slice(0, 6).map((o) => {
            const tone =
              o.status === "delivered"
                ? "border-neon/30 bg-neon/10 text-neon"
                : o.status === "refunded"
                  ? "border-blush/30 bg-blush/10 text-blush"
                  : "border-vio/30 bg-vio/10 text-vio";
            const labelFa: Record<string, string> = {
              pending: "در انتظار پرداخت",
              processing: "در حال آماده‌سازی",
              shipped: "ارسال شده",
              delivered: "تحویل شده",
              refunded: "عودت داده شده",
            };
            return (
              <li key={o.id}>
                <details className="card-g group overflow-hidden rounded-[20px] p-0 transition-colors open:border-vio/25">
                  <summary className="flex cursor-pointer list-none items-center gap-3.5 p-3.5 sm:p-4 [&::-webkit-details-marker]:hidden">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/8 bg-white/5 flex items-center justify-center">
                      {o.items[0]?.image ? (
                        <img src={o.items[0].image} alt="" className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <UserIcon size={18} className="text-dim" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span dir="ltr" className="block truncate text-right text-[13.5px] font-extrabold text-snow">{o.number}</span>
                      <span className="text-[11px] text-dim">{formatDateFa(o.createdAt)} · {o.items.reduce((s, it) => s + it.qty, 0)} کالا</span>
                    </div>
                    <span className={`shrink-0 rounded-xl border px-3 py-1.5 text-[10.5px] font-extrabold ${tone}`}>{labelFa[o.status] ?? o.status}</span>
                    <ChevronLeftIcon size={15} className="shrink-0 text-dim transition-transform duration-300 group-open:-rotate-90" />
                  </summary>
                  <div className="border-t border-white/8 bg-white/2 p-4">
                    <ul className="space-y-2.5">
                      {o.items.map((it, j) => (
                        <li key={j} className="flex items-center justify-between text-[12.5px]">
                          <span className="text-mist">
                            {it.qty} × <span dir="ltr">{it.name}</span>
                          </span>
                          <span className="font-extrabold text-snow tnum">{money(it.price * it.qty)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex items-center justify-between border-t border-white/8 pt-3">
                      <span className="text-[11px] text-dim">{o.status === "delivered" ? "تحویل موفق — ممنون که با ویپورا بودی 💜" : "در حال پیگیری توسط تیم ارسال"}</span>
                      <span className="text-[14px] font-extrabold text-neon tnum">{money(o.total)}</span>
                    </div>
                  </div>
                </details>
              </li>
            );
          })}
        </ul>
      )}

      {/* راهنما */}
      <div className="card-g mt-8 rounded-[22px] p-6">
        <h2 className="flex items-center gap-2 text-[15px] font-extrabold text-snow">
          <CheckIcon size={18} className="text-neon" /> چرا ویپورا؟
        </h2>
        <p className="mt-3 text-[12.5px] leading-7 text-dim">
          {SITE.name} فقط کالای اورجینال با هولوگرام اصالت می‌فروشد؛ اگر بعد از اسکن هولوگرام مطمئن نشدی، تا ۷ روز می‌تونی
          کالا رو برگردونی و کل مبلغ رو پس بگیری.
        </p>
      </div>
    </div>
  );
}
