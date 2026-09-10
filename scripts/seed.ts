/* Seed فروشگاه ویپورا — پاد، سالت و مود
   اجرا: npx tsx scripts/seed.ts */
import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "../src/db";
import {
  users,
  addresses,
  brands,
  categories,
  products,
  orders,
  orderItems,
  wishlist,
  coupons,
} from "../src/db/schema";

const px = (id: number, w = 640) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);

const IMG = {
  A: px(19344605, 800), // پاد با دود بنفش
  B: px(17962162, 800), // پاد سبز
  C: px(17962161, 800), // پاد سبز روی جعبه
  D: px(14472703, 800), // پاد قرمز شب
  E: px(11587603, 800), // پاد در دست
  F: px(12345382, 800), // بطری سالت
  G: px(13870347, 800), // سالت و جعبه
  H: px(39311714, 800), // بخار استودیویی
  I: px(17962164, 800), // جعبه پاد
  J: px(17962166, 800), // پاد فیروزه‌ای
};

const CATS = [
  { name: "پاد یک‌بارمصرف", slug: "pods", image: IMG.A, description: "پادهای آماده مصرف با طعم‌های متنوع — بدون نیاز به کویل و سالت جدا" },
  { name: "سالت نیکوتین", slug: "salts", image: IMG.F, description: "نمک نیکوتین اصل با نیکوتین ۲۰ تا ۵۰ — حس نرم و شبیه سیگار" },
  { name: "مود و پاد سیستم", slug: "mods", image: IMG.C, description: "دستگاه‌های قابل شارژ با کویل قابل تعویض برای مصرف روزانه و اقتصادی" },
  { name: "لوازم جانبی", slug: "gear", image: IMG.I, description: "کویل، چارجر، کیس و ابزار تمیزکاری برای نگهداری حرفه‌ای" },
];

const BRANDS = [
  { name: "ELFBAR", slug: "elfbar", description: "پرفروش‌ترین برند پاد یک‌بارمصرف جهان" },
  { name: "VOZOL", slug: "vozol", description: "پادهای قدرتمند با طعم‌های خاص" },
  { name: "LOST MARY", slug: "lostmary", description: "طراحی مدرن و طعم‌های میوه‌ای جذاب" },
  { name: "IGET", slug: "iget", description: "انتخاب کلاسیک واپرهای حرفه‌ای" },
  { name: "AIR BAR", slug: "airbar", description: "پادهای سبک و خوش‌دست" },
  { name: "VAPORESSO", slug: "vaporesso", description: "مود و پاد سیستم با تکنولوژی روز" },
  { name: "NASTY", slug: "nasty", description: "سالت‌های مطرح مالزیایی" },
  { name: "VAPORA", slug: "vapora", description: "برند اختصاصی فروشگاه ویپورا" },
];

type P = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  specs: Record<string, string>;
  price: number;
  discountPrice: number | null;
  rating: number;
  reviewCount: number;
  stock: number;
  brand: string;
  category: string;
  images: string[];
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  days: number;
};

const PRODS: P[] = [
  {
    slug: "elfbar-te6000",
    name: "ELFBAR TE6000",
    tagline: "۶۰۰۰ پاف · طعم انگور یخ 🍇",
    description:
      "ال اف بار TE6000 با ۶۰۰۰ پاف، ۱۵ میلی‌لیتر جوخ و باتری ۶۰۰ میلی‌آمپری، محبوب‌ترین انتخاب واپرهای ایرانی است. طعم انگور یخ با سردی متعادل، کشیدنش را به یک عادت خوش‌طعم تبدیل می‌کند. دارای هولوگرام اصالت و کد استعلام.",
    specs: {
      options: JSON.stringify({
        flavors: ["انگور یخ 🍇", "هندوانه یخی 🍉", "بلوبری رازبری", "توت‌فرنگی کیوی", "سیب سبز 🍏", "لیچی"],
        nicotine: ["20", "50"],
        puffs: "۶۰۰۰ پاف",
      }),
      "مقدار جوخ": "15 ml",
      باتری: "600 mAh",
      شارژ: "Type-C",
      "نوع طعم": "میوه‌ای یخی",
    },
    price: 1_150_000,
    discountPrice: 990_000,
    rating: 48,
    reviewCount: 214,
    stock: 46,
    brand: "elfbar",
    category: "pods",
    images: [IMG.A, IMG.B],
    featured: true,
    bestSeller: true,
    days: 120,
  },
  {
    slug: "vozol-gecko-10000",
    name: "VOZOL GECKO 10000",
    tagline: "۱۰۰۰۰ پاف · نمایشگر دیجیتال ⚡",
    description:
      "غول جدید ووزول با ۱۰۰۰۰ پاف و نمایشگر دیجیتال که میزان جوخ و باتری را نشان می‌دهد. جریان هوا قابل تنظیم است و طعم‌ها تا آخرین پاف یکدست می‌مانند. انتخاب اول کسانی که دنبال ماندگاری بالا هستند.",
    specs: {
      options: JSON.stringify({
        flavors: ["بلوبری آیس 🫐", "انبه 🥭", "هندوانه سرد", "گریپ‌فروت", "کولا یخی"],
        nicotine: ["20", "50"],
        puffs: "۱۰۰۰۰ پاف",
      }),
      "مقدار جوخ": "22 ml",
      باتری: "850 mAh",
      نمایشگر: "دیجیتال OLED",
    },
    price: 1_480_000,
    discountPrice: null,
    rating: 45,
    reviewCount: 87,
    stock: 30,
    brand: "vozol",
    category: "pods",
    images: [IMG.B, IMG.A],
    newArrival: true,
    days: 8,
  },
  {
    slug: "lostmary-os5000",
    name: "LOST MARY OS5000",
    tagline: "۵۰۰۰ پاف · طراحی مدرن ✨",
    description:
      "لاست ماری با بدنه‌ی مات و ارگونومیک، ۵۰۰۰ پاف ماندگاری دارد و طعم‌هایش بین‌المللی هستند. سایز کوچک و وزن سبکش برای همراه‌داشتن روزانه عالی است.",
    specs: {
      options: JSON.stringify({
        flavors: ["هلو 🍑", "توت‌فرنگی 🍓", "آب‌میوه قرمز", "انگور"],
        nicotine: ["20", "50"],
        puffs: "۵۰۰۰ پاف",
      }),
      "مقدار جوخ": "13 ml",
      باتری: "500 mAh",
    },
    price: 1_020_000,
    discountPrice: null,
    rating: 47,
    reviewCount: 142,
    stock: 55,
    brand: "lostmary",
    category: "pods",
    images: [IMG.C, IMG.A],
    bestSeller: true,
    days: 200,
  },
  {
    slug: "iget-xxl-5000",
    name: "IGET XXL 5000",
    tagline: "۵۰۰۰ پاف · طعم کلاسیک",
    description:
      "آی‌گت XXL با ۵۰۰۰ پاف و سایز بزرگ، انتخاب قدیمی‌های دنیای ویپ است. بخار حجیم و کشش باز، تجربه‌ای نزدیک به مودهای حرفه‌ای می‌دهد.",
    specs: {
      options: JSON.stringify({
        flavors: ["انگور", "بلوبری", "نعناع", "توت‌فرنگی"],
        nicotine: ["20", "50"],
        puffs: "۵۰۰۰ پاف",
      }),
      "مقدار جوخ": "12 ml",
      باتری: "550 mAh",
    },
    price: 890_000,
    discountPrice: null,
    rating: 44,
    reviewCount: 96,
    stock: 40,
    brand: "iget",
    category: "pods",
    images: [IMG.D, IMG.E],
    featured: true,
    days: 300,
  },
  {
    slug: "airbar-lux-4000",
    name: "AIR BAR LUX 4000",
    tagline: "۴۰۰۰ پاف · سبک و خوش‌دست",
    description: "ایربار سبک‌ترین انتخاب روزمره است؛ ۴۰۰۰ پاف در بدنه‌ای باریک که توی جیب گم می‌شود. طعم نعناع یخی‌اش معروف است.",
    specs: {
      options: JSON.stringify({
        flavors: ["نعناع یخی ❄️", "لیمو", "انگور", "هندوانه"],
        nicotine: ["20", "50"],
        puffs: "۴۰۰۰ پاف",
      }),
      "مقدار جوخ": "10 ml",
      باتری: "450 mAh",
    },
    price: 740_000,
    discountPrice: null,
    rating: 43,
    reviewCount: 61,
    stock: 64,
    brand: "airbar",
    category: "pods",
    images: [IMG.E, IMG.D],
    days: 90,
  },
  {
    slug: "vapora-puff-8000",
    name: "VAPORA PUFF 8000",
    tagline: "۸۰۰۰ پاف · برند اختصاصی ویپورا 🏷️",
    description: "پاد اختصاصی فروشگاه ویپورا با ۸۰۰۰ پاف و بهترین طعم‌های پرفروش بازار، با قیمتی منصفانه‌تر و همان کیفیت اورجینال.",
    specs: {
      options: JSON.stringify({
        flavors: ["انگور یخ", "بلوبری آیس", "هندوانه سرد", "انبه"],
        nicotine: ["20", "50"],
        puffs: "۸۰۰۰ پاف",
      }),
      "مقدار جوخ": "16 ml",
      باتری: "650 mAh",
    },
    price: 1_190_000,
    discountPrice: 1_050_000,
    rating: 46,
    reviewCount: 38,
    stock: 28,
    brand: "vapora",
    category: "pods",
    images: [IMG.B, IMG.D],
    newArrival: true,
    days: 4,
  },
  /* ---------------- سالت ---------------- */
  {
    slug: "vapora-salt-30",
    name: "VAPORA SALT 30ml",
    tagline: "سالت ۳۰ میل · طعم انگور یخ",
    description:
      "سالت اختصاصی ویپورا با ۳۰ میلی‌لیتر حجم و نیکوتین ۳۵/۵۰. ترکیب انگور و سردی نعناع، تجربه‌ای نرم و بی‌خشونت می‌سازد. مناسب دستگاه‌های پاد با کویل بالا.",
    specs: {
      options: JSON.stringify({
        flavors: ["انگور یخ 🍇", "بلوبری 🫐", "هندوانه", "تنباکو و کارامل", "نعناع"],
        nicotine: ["35", "50"],
        salt: "نمک نیکوتین",
      }),
      حجم: "30 ml",
      "نسبت VG/PG": "50/50",
      کشور: "مالزی",
    },
    price: 385_000,
    discountPrice: null,
    rating: 46,
    reviewCount: 173,
    stock: 80,
    brand: "vapora",
    category: "salts",
    images: [IMG.F, IMG.G],
    bestSeller: true,
    days: 150,
  },
  {
    slug: "elfbar-salt-30",
    name: "ELFBAR SALT 30ml",
    tagline: "سالت ۳۰ میل ال اف بار · بلوبری",
    description: "سالت اورجینال ال اف بار در بطری ۳۰ میل با طعم بلوبری شیرین و سردی ملایم. نیکوتین نرم و با کیفیت ثابت.",
    specs: {
      options: JSON.stringify({
        flavors: ["بلوبری", "انگور", "هندوانه", "توت‌فرنگی"],
        nicotine: ["35", "50"],
      }),
      حجم: "30 ml",
      کشور: "مالزی",
    },
    price: 420_000,
    discountPrice: null,
    rating: 45,
    reviewCount: 84,
    stock: 60,
    brand: "elfbar",
    category: "salts",
    images: [IMG.G, IMG.F],
    days: 150,
  },
  {
    slug: "nasty-salt-30",
    name: "NASTY SALT 30ml",
    tagline: "سالت نستی · طعم ترش و شیرین 🍬",
    description: "ناستی با طعم‌های جسورانه‌اش معروف است؛ ترکیب ترش و شیرین با سردی که طرفداران خاص خودش را دارد.",
    specs: {
      options: JSON.stringify({
        flavors: ["کشنده ترش 🍬", "انگور یخ", "بلوبری"],
        nicotine: ["35", "50"],
      }),
      حجم: "30 ml",
      کشور: "مالزی",
    },
    price: 465_000,
    discountPrice: null,
    rating: 44,
    reviewCount: 51,
    stock: 36,
    brand: "nasty",
    category: "salts",
    images: [IMG.F],
    newArrival: true,
    days: 6,
  },
  /* ---------------- مود ---------------- */
  {
    slug: "vaporesso-luxe-xr",
    name: "VAPORESSO LUXE XR",
    tagline: "مود ۴۰ وات · کویل GTX 🔥",
    description:
      "لوکس XR با تراشه AXON تا ۴۰ وات توان، باتری ۱۸۰۰ میلی‌آمپری داخلی و کویل‌های GTX، یکی از بهترین مودهای جمع‌وجور برای مصرف روزانه است. دکمه کشیدن خودکار هم دارد.",
    specs: {
      "توان خروجی": "5-40 W",
      باتری: "1800 mAh",
      "مقدار تانک": "4 ml",
      "کویل سازگار": "GTX 0.6/0.8 ohm",
      شارژ: "Type-C 2A",
    },
    price: 2_450_000,
    discountPrice: 2_150_000,
    rating: 48,
    reviewCount: 122,
    stock: 14,
    brand: "vaporesso",
    category: "mods",
    images: [IMG.A, IMG.D],
    featured: true,
    bestSeller: true,
    days: 260,
  },
  {
    slug: "vaporesso-xros3",
    name: "VAPORESSO XROS 3",
    tagline: "پاد سیستم XROS · ۱۰۰۰ میلی‌آمپر",
    description: "ایکس‌راس ۳ با طراحی باریک و باتری ۱۰۰۰ میلی‌آمپری، محبوب‌ترین پاد سیستم جهان است. کویل‌های ۰.۶ و ۰.۸ اهم با طعم عالی.",
    specs: {
      باتری: "1000 mAh",
      "مقدار تانک": "2 ml",
      "کویل سازگار": "XROS 0.6/0.8/1.0 ohm",
      شارژ: "Type-C",
    },
    price: 1_890_000,
    discountPrice: null,
    rating: 47,
    reviewCount: 98,
    stock: 22,
    brand: "vaporesso",
    category: "mods",
    images: [IMG.B, IMG.C],
    days: 180,
  },
  {
    slug: "vozol-pod-pro",
    name: "VOZOL POD PRO 30W",
    tagline: "پاد ۳۰ وات · کویل مشبک",
    description: "پاد پرو ووزول با توان ۳۰ وات و باتری ۱۵۰۰ میلی‌آمپری، بخار حجیم و طعم قوی می‌دهد. برای سالت‌های غلیظ عالی است.",
    specs: {
      "توان خروجی": "5-30 W",
      باتری: "1500 mAh",
      "مقدار تانک": "4.5 ml",
      شارژ: "Type-C 2A",
    },
    price: 1_620_000,
    discountPrice: null,
    rating: 45,
    reviewCount: 57,
    stock: 18,
    brand: "vozol",
    category: "mods",
    images: [IMG.C, IMG.B],
    days: 100,
  },
  /* ---------------- لوازم ---------------- */
  {
    slug: "xros-coil-pack",
    name: "XROS Coil Pack",
    tagline: "کویل اورجینال XROS — پک ۴ عددی",
    description: "کویل‌های اورجینال واپرسو برای دستگاه‌های XROS. پک ۴ عددی با مقاومت‌های ۰.۶، ۰.۸ و ۱.۰ اهم.",
    specs: {
      "مقاومت‌ها": "0.6 / 0.8 / 1.0 ohm",
      تعداد: "4 عدد",
      سازگاری: "XROS 1/2/3/4",
    },
    price: 320_000,
    discountPrice: null,
    rating: 45,
    reviewCount: 210,
    stock: 120,
    brand: "vaporesso",
    category: "gear",
    images: [IMG.I, IMG.G],
    bestSeller: true,
    days: 300,
  },
  {
    slug: "magnet-charger",
    name: "Magnetic Charger",
    tagline: "چارج‌ر مگنتی پاد — شارژ سریع",
    description: "چارج‌ر مگنتی با گیره‌ی قوی و شارژ سریع Type-C؛ مخصوص پادهای یک‌بارمصرف دارای درگاه مگنت.",
    specs: {
      خروجی: "5V/2A",
      اتصال: "Type-C + مگنت",
      "طول کابل": "30 cm",
    },
    price: 145_000,
    discountPrice: null,
    rating: 42,
    reviewCount: 33,
    stock: 90,
    brand: "vapora",
    category: "gear",
    images: [IMG.E],
    days: 60,
  },
  {
    slug: "cleaning-kit",
    name: "Vape Cleaning Kit",
    tagline: "کیت تمیزکاری حرفه‌ای",
    description: "برس‌ها، دستمال میکروفایبر و محلول تمیزکننده برای افزایش عمر کویل و تمیزی همیشگی دستگاه.",
    specs: {
      شامل: "3 برس + میکروفایبر + محلول 50ml",
      کاربرد: "مود، تانک و پاد",
    },
    price: 265_000,
    discountPrice: null,
    rating: 44,
    reviewCount: 27,
    stock: 24,
    brand: "vapora",
    category: "gear",
    images: [IMG.G, IMG.E],
    days: 40,
  },
  {
    slug: "pod-leather-case",
    name: "Pod Leather Case",
    tagline: "کیس چرمی پاد — ضدضربه",
    description: "کیس چرم طبیعی با لایه‌ی ضدضربه داخلی؛ مناسب پادهای باریک ۵۰۰۰ تا ۱۰۰۰۰ پافی.",
    specs: {
      جنس: "چرم طبیعی",
      ابعاد: "مناسب پادهای باریک",
      رنگ: "مشکی",
    },
    price: 190_000,
    discountPrice: null,
    rating: 43,
    reviewCount: 19,
    stock: 34,
    brand: "vapora",
    category: "gear",
    images: [IMG.C, IMG.I],
    newArrival: true,
    days: 10,
  },
];

async function main() {
  console.log("پاک‌سازی جداول…");
  await db.execute(
    sql`truncate table reviews, order_items, orders, wishlist, addresses, products, categories, brands, coupons, subscribers, contact_messages, users restart identity cascade`
  );

  const [demoUser] = await db
    .insert(users)
    .values([
      { name: "آرمان رضایی", email: "demo@vapora.ir", phone: "09123456789", isAdmin: true, createdAt: daysAgo(400) },
      { name: "Store Admin", email: "admin@vapora.ir", phone: "02191002233", isAdmin: true, createdAt: daysAgo(400) },
    ])
    .returning();
  const demoId = demoUser.id;

  await db.insert(addresses).values([
    { userId: demoId, label: "خانه", line1: "تهران، سعادت‌آباد، بلوار دریا، پلاک ۱۸", city: "تهران", zip: "1998765432", country: "Iran" },
  ]);

  const bid: Record<string, number> = {};
  for (const b of BRANDS) {
    const r = await db.insert(brands).values(b).returning();
    bid[b.slug] = r[0].id;
  }
  const cid: Record<string, number> = {};
  for (const c of CATS) {
    const r = await db.insert(categories).values(c).returning();
    cid[c.slug] = r[0].id;
  }

  const pid: Record<string, number> = {};
  const idBySlug: Record<string, number> = {};
  for (const p of PRODS) {
    const r = await db
      .insert(products)
      .values({
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        description: p.description,
        specs: p.specs,
        price: p.price,
        discountPrice: p.discountPrice,
        rating: p.rating,
        reviewCount: p.reviewCount,
        stock: p.stock,
        brandId: bid[p.brand],
        categoryId: cid[p.category],
        images: p.images,
        featured: !!p.featured,
        bestSeller: !!p.bestSeller,
        newArrival: !!p.newArrival,
        createdAt: daysAgo(p.days),
      })
      .returning();
    pid[p.slug] = r[0].id;
    idBySlug[r[0].id] = p.price;
  }

  await db.insert(wishlist).values([
    { userId: demoId, productId: pid["vozol-gecko-10000"] },
    { userId: demoId, productId: pid["vaporesso-luxe-xr"] },
  ]);

  await db.insert(coupons).values([
    { code: "VAPORA15", description: "۱۵٪ تخفیف اولین خرید", percent: 15, fixed: null, minSubtotal: 0, validUntil: "2027-12-31", active: true },
    { code: "NIC20", description: "۲۰٪ تخفیف خرید بالای ۱.۵ میلیون", percent: 20, fixed: null, minSubtotal: 1_500_000, validUntil: "2027-06-30", active: true },
  ]);

  /* سفارش‌های دمو */
  const eff = (p: P) => p.discountPrice ?? p.price;
  const demoOrders: { status: string; days: number; items: [string, number][] }[] = [
    { status: "delivered", days: 75, items: [["vozol-gecko-10000", 1], ["vapora-salt-30", 2]] },
    { status: "delivered", days: 40, items: [["elfbar-te6000", 2]] },
    { status: "delivered", days: 12, items: [["vaporesso-luxe-xr", 1], ["xros-coil-pack", 1]] },
    { status: "shipped", days: 5, items: [["lostmary-os5000", 1], ["nasty-salt-30", 1]] },
    { status: "processing", days: 2, items: [["vapora-puff-8000", 3]] },
    { status: "pending", days: 1, items: [["vaporesso-xros3", 1], ["pod-leather-case", 1]] },
  ];

  let n = 1001;
  const ords: {
    number: string;
    name: string;
    email: string;
    phone: string | null;
    userId: number;
    shipping: { line1: string; city: string; zip: string; country: string };
    subtotal: number;
    discount: number;
    shippingFee: number;
    total: number;
    status: string;
    createdAt: Date;
    items: { productId: number; name: string; image: string; price: number; qty: number }[];
  }[] = [];

  for (const o of demoOrders) {
    const items = o.items.map(([slug, qty]) => {
      const p = PRODS.find((x) => x.slug === slug)!;
      return { productId: pid[slug], name: p.name, image: p.images[0], price: eff(p), qty };
    });
    const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
    const discount = subtotal >= 1_500_000 ? Math.round(subtotal * 0.15) : 0;
    const shippingFee = subtotal - discount >= 2_000_000 ? 0 : 65_000;
    ords.push({
      number: `VPR-${n++}`,
      name: "آرمان رضایی",
      email: "demo@vapora.ir",
      phone: "09123456789",
      userId: demoId,
      shipping: { line1: "تهران، سعادت‌آباد، بلوار دریا، پلاک ۱۸", city: "تهران", zip: "1998765432", country: "Iran" },
      subtotal,
      discount,
      shippingFee,
      total: subtotal - discount + shippingFee,
      status: o.status,
      createdAt: daysAgo(o.days),
      items,
    });
  }

  ords.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  ords.forEach((o, i) => (o.number = `VPR-${1001 + i}`));

  for (const o of ords) {
    const [ins] = await db
      .insert(orders)
      .values({
        number: o.number,
        userId: o.userId,
        name: o.name,
        email: o.email,
        phone: o.phone,
        shipping: o.shipping,
        couponCode: null,
        subtotal: o.subtotal,
        discount: o.discount,
        shippingFee: o.shippingFee,
        total: o.total,
        status: o.status as "pending",
        createdAt: o.createdAt,
      })
      .returning();
    for (const it of o.items) {
      await db.insert(orderItems).values({ ...it, orderId: ins.id });
    }
  }

  console.log(`✅ Seed ویپورا: ${PRODS.length} محصول، ${CATS.length} دسته، ${BRANDS.length} برند، ${ords.length} سفارش دمو.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => process.exit(0));
