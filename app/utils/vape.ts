export const SITE = {
  name: "ویپ‌لب",
  latin: "VAPELAB",
  tagline: "دودِ نرم، طعمِ ناب",
  domain: "https://vapelab.ir",
  phone: "۰۲۱-۹۱۰۰۲۲۳۳",
};

export const AGE_KEY = "vapelab.age.ok";
export const FREE_SHIPPING = 2_000_000; // تومان
export const FLAT_SHIPPING = 65_000; // تومان

/** قیمت به تومان */
export const money = (n: number) => `${n.toLocaleString("en-US")} تومان`;
export const moneyShort = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toLocaleString("en-US", { maximumFractionDigits: 2 })} میلیون`;
  if (n >= 1000) return `${(n / 1000).toLocaleString("en-US")} هزار`;
  return String(n);
};

/** Haptic feedback — device vibration (موبایل) */
export function haptic(ms = 9) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(ms);
  } catch {
    /* noop */
  }
}

export const CATS_META: Record<
  string,
  { label: string; emoji: string; tint: string; sub: string }
> = {
  pods: { label: "پاد یک‌بارمصرف", emoji: "💨", tint: "vio", sub: "تا ۱۰۰۰۰ پاف" },
  salts: { label: "سالت نیکوتین", emoji: "🧊", tint: "ice", sub: "نمک نیکوتین اصل" },
  mods: { label: "مود و پاد سیستم", emoji: "⚡", tint: "neon", sub: "قابل شارژ و کویل" },
  gear: { label: "لوازم جانبی", emoji: "🧰", tint: "blush", sub: "کویل، چارجر و کیس" },
};

export const BRANDS_LINE = ["ELFBAR", "VOZOL", "LOST MARY", "IGET", "VAPORESSO", "AIR BAR", "NASTY", "VAPELAB"];

export const TRUST = [
  { t: "ضمانت اصالت", s: "اسکن هولوگرام برند" },
  { t: "ارسال فوری", s: "تهرانِ امروز، شهرستان ۲۴ ساعته" },
  { t: "پرداخت امن", s: "در محل یا آنلاین" },
  { t: "پشتیبانی واپر", s: "پاسخ واقعی، نه ربات" },
];

export const WHY = [
  { emoji: "🛡️", t: "کالای ۱۰۰٪ اورجینال", s: "همه محصولات دارای هولوگرام اصالت برند هستند؛ در صورت عدم تطابق، وجه کامل برمی‌گردد." },
  { emoji: "🚚", t: "ارسال سریع و ایمن", s: "سفارش‌های تهران همان‌روز ارسال می‌شوند. بسته‌بندی ضربه‌گیر و کاملاً محرمانه است." },
  { emoji: "🧑‍🔬", t: "مشاوره تخصصی", s: "از انتخاب نیکوتین تا سلیقه طعم — تیم ما همان چیزی را پیشنهاد می‌دهد که خودش مصرف می‌کند." },
  { emoji: "💳", t: "پرداخت در محل", s: "بدون کارت؟ سفارش بده، هزینه را موقع تحویل بپرداز. برای تهران فعال است." },
];

export const DISCLAIMER =
  "این فروشگاه فقط به افراد بالای ۱۸ سال خدمات ارائه می‌دهد. محصولات حاوی نیکوتین هستند و مصرف آن‌ها برای افراد زیر ۱۸ سال، زنان باردار و افراد مبتلا به بیماری قلبی ممنوع است.";

export const HERO_IMG =
  "https://images.pexels.com/photos/19344605/pexels-photo-19344605.jpeg?auto=compress&cs=tinysrgb&w=900";
export const PROMO_IMG =
  "https://images.pexels.com/photos/9996339/pexels-photo-9996339.jpeg?auto=compress&cs=tinysrgb&w=1600";

export const DEMO_USER = {
  name: "آرمان رضایی",
  email: "demo@vapelab.ir",
  phone: "۰۹۱۲ ۳۴۵ ۶۷۸۹",
  joined: "اردیبهشت ۱۴۰۳",
};
