import Link from "next/link";
import { ArrowLeftIcon } from "@/components/vapor/VIcons";

export default function NotFound() {
  return (
    <div className="wrap flex min-h-[70svh] flex-col items-center justify-center py-16 text-center">
      <p className="text-6xl">🌫️</p>
      <h1 className="mt-6 font-display text-[28px] font-extrabold text-snow">این صفحه در دود گم شد!</h1>
      <p className="mt-3 max-w-sm text-[13px] leading-7 text-dim">
        صفحه‌ای که دنبالش بودی وجود نداره یا جابه‌جا شده. بذار برگردونیمت به جای خوش‌بو. ☁️
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="pressable inline-flex h-13 items-center gap-2 rounded-2xl bg-gradient-to-l from-vio to-ice px-7 py-4 text-[14px] font-extrabold text-ink glow-v">
          <ArrowLeftIcon size={17} sw={2.4} /> صفحه اصلی
        </Link>
        <Link href="/shop" className="pressable inline-flex h-13 items-center rounded-2xl border border-white/14 px-7 py-4 text-[14px] font-extrabold text-snow">
          فروشگاه
        </Link>
      </div>
    </div>
  );
}
