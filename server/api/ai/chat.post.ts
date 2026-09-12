import { getProducts, getCategories, getBrands } from "../../db/queries";
import type { Product } from "~/types";

type UserAnswer = {
  goal?: "smoke" | "hookah" | "newbie" | "pro";
  category?: string;
  taste?: "fruity" | "ice" | "dessert" | "tobacco";
  cooling?: number;
  nicotine?: number;
};

type AIRequest = {
  message?: string;
  wizard?: UserAnswer;
  history?: { role: "user" | "assistant"; text: string }[];
};

export type ProductRecommendation = {
  product: Product;
  matchScore: number;
  reason: string;
  suggestedFlavor?: string;
  suggestedNicotine?: string;
  coolingLevel?: number; // 0 to 5
};

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as AIRequest;
  const allProducts = await getProducts({}, 100);
  const categories = await getCategories();
  const brands = await getBrands();

  // 1. اگر کوییز ارسال شده باشد
  if (body.wizard) {
    const w = body.wizard;
    const recommendations = matchProductsByWizard(w, allProducts);
    const nicText =
      w.goal === "smoke"
        ? "سالت نیکوتین ۳۵ تا ۵۰ میلی‌گرم (بیشترین شباهت به گیرایی سیگار)"
        : w.goal === "hookah"
          ? "جویس ۶-۳ میلی‌گرم یا پاد میوه‌ای با کام‌دهی روان"
          : "نیکوتین ۲۰ میلی‌گرم یا پادهای یک‌بارمصرف سبک";

    return {
      type: "wizard_result",
      reply: `بر اساس سلیقه و هدف انتخابی شما، میزان نیکوتین پیشنهادی **${nicText}** است. بهترین گزینه‌های همخوان با ذائقه شما آماده شدند:`,
      products: recommendations,
      suggestedNicotine: nicText,
    };
  }

  // 2. اگر پیام چت آزاد باشد
  const rawQuery = (body.message || "").trim();
  if (!rawQuery) {
    return {
      type: "chat_reply",
      reply: "سلام! من دستیار تخصصی ویپورا هستم. چه طعم، دستگاه یا سوالی دارید تا دقیقاً راهنماییتون کنم؟ ☁️",
      products: [],
    };
  }

  const result = await handleFreeFormQuery(rawQuery, allProducts, categories, brands);
  return result;
});

/* =========================================================================
   PERSIAN TEXT NORMALIZER & NLP
========================================================================= */

function normalizePersian(text: string): string {
  return (text || "")
    .replace(/[\u200B-\u200D\uFEFF]/g, " ")
    .replace(/\u200C/g, " ") // ZWNJ to space
    .replace(/[ي]/g, "ی")
    .replace(/[ك]/g, "ک")
    .replace(/[ۀة]/g, "ه")
    .replace(/[إأآ]/g, "ا")
    .replace(/[ؤ]/g, "و")
    .replace(/[ئ]/g, "ی")
    .replace(/[\u064B-\u065F]/g, "") // Diacritics
    .toLowerCase()
    .trim();
}

type ParsedIntent = {
  categorySlug?: "salts" | "pods" | "mods" | "gear";
  isFruity: boolean;
  isTobacco: boolean;
  isDessert: boolean;
  isIce: boolean;
  iceIntensity: number; // 0 (none) to 5 (extreme)
  specificFlavors: string[];
  isQuitSmoking: boolean;
  isHighPuff: boolean;
  isCheap: boolean;
  isBestSeller: boolean;
  isBrand?: string;
  isInfoQuery: boolean;
  infoTopic?: "difference" | "shipping" | "authenticity" | "how_to_use" | "coil";
};

function parseUserIntent(raw: string): ParsedIntent {
  const q = normalizePersian(raw);

  const has = (...words: string[]) => words.some((w) => q.includes(normalizePersian(w)));

  // Information & Support Queries
  let isInfoQuery = false;
  let infoTopic: ParsedIntent["infoTopic"] = undefined;

  if (has("تفاوت سالت و جویس", "فرق سالت", "جویس چیه", "سالت چیه", "سالت یا جویس")) {
    isInfoQuery = true;
    infoTopic = "difference";
  } else if (has("ارسال", "پیک", "چقدر طول میکشه", "تحویل", "تهران", "شهرستان", "پست", "تیپاکس")) {
    isInfoQuery = true;
    infoTopic = "shipping";
  } else if (has("اصالت", "اصل", "فیک", "گارانتی", "ضمانت", "هولوگرام", "کد استعلام")) {
    isInfoQuery = true;
    infoTopic = "authenticity";
  } else if (has("تعویض کویل", "کویل سوخته", "کارتریج چقدر کار میده", "سوختن کویل")) {
    isInfoQuery = true;
    infoTopic = "coil";
  }

  // Category Extraction
  let categorySlug: ParsedIntent["categorySlug"] = undefined;
  if (has("سالت", "سالت نیکوتین", "نمک نیکوتین", "سالتها", "salt", "salts")) {
    categorySlug = "salts";
  } else if (has("یکبار مصرف", "یکبارمصرف", "یک بار مصرف", "پاد یکبار", "disposable")) {
    categorySlug = "pods";
  } else if (has("پاد", "پادسیستم", "پاد سیستم", "دستگاه پاد", "پاد قلمی")) {
    // Note: If user said "سالت", categorySlug is salts; if only "پاد", pods
    if (!categorySlug) categorySlug = "pods";
  } else if (has("مود", "ویپ", "وات بالا", "قلیانی", "قلیان", "تانک", "دستگاه ویپ", "mod", "mods")) {
    categorySlug = "mods";
  } else if (has("کویل", "کارتریج", "لوازم جانبی", "شارژر", "پنبه")) {
    categorySlug = "gear";
  }

  // Flavor Profiles
  const fruityKeywords = [
    "میوه", "میوه‌ای", "میوهای", "میوه ای", "میوه جات", "فروتی",
    "انگور", "بلوبری", "هندوانه", "هندونه", "توت فرنگی", "توتفرنگی", "سیب",
    "هلو", "انبه", "لیچی", "لیمو", "پرتقال", "پشن فروت", "طالبی", "موز",
    "کیوی", "گریپ فروت", "تمشک", "شاتوت", "ردبول", "آلبالو", "انار"
  ];
  const isFruity = has(...fruityKeywords);

  const tobaccoKeywords = [
    "تنباکو", "تنباکویی", "تنباکوی", "سیگار", "کوبانو", "دوسیب", "سیگار برگ",
    "توتون", "پیپ", "قهوه", "سگار", "tobacco", "cigar", "cubano"
  ];
  const isTobacco = has(...tobaccoKeywords);

  const dessertKeywords = [
    "دسر", "دسری", "خامه", "خامه‌ای", "کرم", "کاستارد", "وانیل", "کیک",
    "بیسکویت", "کارامل", "شکلات", "شیرین", "شیر", "custard", "cream", "vanilla"
  ];
  const isDessert = has(...dessertKeywords);

  // Ice / Cooling extraction
  const isExtremeIce = has("فوق خنک", "فوق العاده خنک", "خیلی خنک", "شدیدا خنک", "یخ زیاد", "آیس بالا", "ماکسیمم آیس", "سرد سرد", "کولینگ بالا", "یخ فراوان");
  const isRegularIce = has("خنک", "خنکی", "آیس", "ایس", "یخ", "یخی", "نعناع", "نعنا", "سرد", "کولینگ", "منتول", "ice", "cool", "cold", "frost", "menthol");
  const isNoIce = has("بدون یخ", "بدون آیس", "گرم", "بدون نعناع", "کم یخ");

  let iceIntensity = 0;
  let isIce = false;
  if (isExtremeIce) {
    iceIntensity = 5;
    isIce = true;
  } else if (isRegularIce && !isNoIce) {
    iceIntensity = 4;
    isIce = true;
  } else if (isNoIce) {
    iceIntensity = 0;
    isIce = false;
  }

  // Specific Fruit Flavors
  const specificFlavors: string[] = [];
  if (has("انگور", "grape")) specificFlavors.push("انگور");
  if (has("بلوبری", "blueberry")) specificFlavors.push("بلوبری");
  if (has("هندوانه", "هندونه", "watermelon")) specificFlavors.push("هندوانه");
  if (has("انبه", "mango")) specificFlavors.push("انبه");
  if (has("توت فرنگی", "توتفرنگی", "strawberry")) specificFlavors.push("توت فرنگی");
  if (has("سیب", "apple")) specificFlavors.push("سیب");
  if (has("هلو", "peach")) specificFlavors.push("هلو");
  if (has("لیمو", "lemon", "lime")) specificFlavors.push("لیمو");
  if (has("نعناع", "نعنا", "mint")) specificFlavors.push("نعناع");
  if (has("کولا", "cola")) specificFlavors.push("کولا");

  // Quit smoking & Nicotine
  const isQuitSmoking = has("ترک سیگار", "جایگزین سیگار", "نیکوتین بالا", "سنگین", "گیرایی بالا", "۵۰", "50", "۳۵", "35");

  // Puffs
  const isHighPuff = has("پاف بالا", "ماندگاری بالا", "طولانی", "۱۰۰۰۰", "10000", "۸۰۰۰", "8000", "۶۰۰۰", "6000");

  // Commercial / Price intent
  const isCheap = has("ارزان", "ارزون", "قیمت مناسب", "ارزونترین", "ارزان‌ترین", "ارزانترین", "اقتصادی", "تخفیف", "حراج", "ارزان قیمت");
  const isBestSeller = has("پرفروش", "محبوب", "بهترین", "پیشنهاد", "پرطرفدار", "تاپ", "معروف", "تضمینی");

  // Brands
  let isBrand: string | undefined = undefined;
  if (has("الف بار", "الفبار", "ال اف بار", "elfbar")) isBrand = "elfbar";
  if (has("ووزول", "وزول", "vozol")) isBrand = "vozol";
  if (has("لاست ماری", "لاست‌ماری", "lostmary", "lost mary")) isBrand = "lostmary";
  if (has("ایگت", "آیگت", "iget")) isBrand = "iget";
  if (has("ویپرسو", "vaporesso")) isBrand = "vaporesso";
  if (has("ناستی", "نستی", "nasty")) isBrand = "nasty";
  if (has("ویپورا", "vapora")) isBrand = "vapora";

  return {
    categorySlug,
    isFruity,
    isTobacco,
    isDessert,
    isIce,
    iceIntensity,
    specificFlavors,
    isQuitSmoking,
    isHighPuff,
    isCheap,
    isBestSeller,
    isBrand,
    isInfoQuery,
    infoTopic,
  };
}

/* =========================================================================
   SCORING & RECOMMENDATION ENGINE
========================================================================= */

function scoreProduct(p: Product, intent: ParsedIntent, userQuery: string): { score: number; reason: string; suggestedFlavor?: string; coolingLevel: number } {
  let score = 40;
  const reasons: string[] = [];
  let suggestedFlavor: string | undefined = undefined;

  const allText = normalizePersian(
    `${p.name} ${p.tagline || ""} ${p.description} ${p.category} ${p.brand} ${JSON.stringify(p.specs || {})}`
  );

  // Extract parsed options
  let flavorOptions: string[] = [];
  try {
    if (p.specs && p.specs.options) {
      const parsed = typeof p.specs.options === "string" ? JSON.parse(p.specs.options) : p.specs.options;
      if (parsed.flavors && Array.isArray(parsed.flavors)) {
        flavorOptions = parsed.flavors;
      }
    }
  } catch {}

  // Determine Product Cooling Level (0 to 5)
  let coolingLevel = 0;
  if (allText.includes("یخ") || allText.includes("ice") || allText.includes("سرد") || allText.includes("خنک") || allText.includes("نعناع")) {
    coolingLevel = 4;
    if (allText.includes("فوق") || allText.includes("کولا یخی") || allText.includes("یخی") || p.categorySlug === "salts") {
      coolingLevel = 5;
    }
  }

  // 1. Category Matching
  if (intent.categorySlug) {
    if (p.categorySlug === intent.categorySlug) {
      score += 55;
      if (intent.categorySlug === "salts") reasons.push("سالت نیکوتین اورجینال");
      else if (intent.categorySlug === "pods") reasons.push("پاد باکیفیت و آماده مصرف");
      else if (intent.categorySlug === "mods") reasons.push("دستگاه حرفه‌ای با طعم‌دهی عالی");
    } else {
      score -= 75; // Strong penalty for wrong category
    }
  }

  // 2. Flavor & Taste Matching
  let matchedFlavorInOptions = "";
  if (intent.specificFlavors.length > 0) {
    for (const specFlav of intent.specificFlavors) {
      const normSpec = normalizePersian(specFlav);
      const foundInOptions = flavorOptions.find((f) => normalizePersian(f).includes(normSpec));
      if (foundInOptions) {
        score += 45;
        matchedFlavorInOptions = foundInOptions;
        suggestedFlavor = foundInOptions;
        reasons.push(`دارای طعم محبوب ${specFlav}`);
        break;
      } else if (allText.includes(normSpec)) {
        score += 35;
        reasons.push(`همخوان با طعم ${specFlav}`);
        break;
      }
    }
  }

  // Fruity General
  if (intent.isFruity) {
    const fruitMatches = flavorOptions.filter((f) => {
      const norm = normalizePersian(f);
      return ["انگور", "بلوبری", "هندوانه", "توت", "انبه", "سیب", "هلو", "لیمو", "لیچی", "کیوی"].some((k) => norm.includes(k));
    });
    if (fruitMatches.length > 0 || allText.includes("میوه") || allText.includes("fruit") || allText.includes("انگور") || allText.includes("بلوبری") || allText.includes("هندوانه")) {
      score += 35;
      if (!suggestedFlavor && fruitMatches.length > 0) {
        suggestedFlavor = fruitMatches[0];
      }
      if (!reasons.some((r) => r.includes("طعم"))) {
        reasons.push("پروفایل طعم میوه‌ای و خوش‌عطر");
      }
    }
  }

  // Tobacco
  if (intent.isTobacco) {
    if (allText.includes("تنباکو") || allText.includes("tobacco") || allText.includes("سیگار") || allText.includes("cubano") || allText.includes("کارامل")) {
      score += 45;
      reasons.push("طعم اصیل تنباکویی و گیرایی عالی");
    }
  }

  // Dessert
  if (intent.isDessert) {
    if (allText.includes("دسر") || allText.includes("خامه") || allText.includes("وانیل") || allText.includes("کیک") || allText.includes("کاستارد") || allText.includes("cream")) {
      score += 40;
      reasons.push("طعم نرم دسری و خامه‌ای");
    }
  }

  // 3. Ice / Cooling Matching
  if (intent.isIce) {
    if (coolingLevel >= 4) {
      score += intent.iceIntensity === 5 ? 40 : 28;
      // Prefer flavor options that explicitly have ice/یخ
      const iceFlav = flavorOptions.find((f) => normalizePersian(f).includes("یخ") || normalizePersian(f).includes("آیس") || normalizePersian(f).includes("سرد") || normalizePersian(f).includes("نعناع"));
      if (iceFlav) {
        suggestedFlavor = iceFlav;
      }
      reasons.push(intent.iceIntensity === 5 ? "کولینگ و خنکی فوق‌العاده بالا ❄️" : "سردی متعادل و باطراوت 🧊");
    } else {
      score -= 30;
    }
  }

  // 4. Quit Smoking / Nicotine
  if (intent.isQuitSmoking) {
    if (p.categorySlug === "salts") {
      score += 35;
      reasons.push("نیکوتین استاندارد ۳۵ تا ۵۰ با گلو‌زدگی دقیقاً مثل سیگار");
    } else if (p.categorySlug === "pods") {
      score += 20;
      reasons.push("پاد سبک و ایده‌آل برای کنار گذاشتن سیگار");
    }
  }

  // 5. Brand Match
  if (intent.isBrand) {
    if (p.brandSlug === intent.isBrand || normalizePersian(p.brand).includes(intent.isBrand)) {
      score += 60;
      reasons.push(`برند اصیل و معتبر ${p.brand}`);
    } else {
      score -= 30;
    }
  }

  // 6. High Puff Intent
  if (intent.isHighPuff) {
    if (allText.includes("10000") || allText.includes("۱۰۰۰۰") || allText.includes("8000") || allText.includes("۸۰۰۰")) {
      score += 45;
      reasons.push("تعداد پاف بالا و ماندگاری طولانی");
    }
  }

  // 6. Price Intent
  if (intent.isCheap) {
    const effectivePrice = p.discountPrice ?? p.price;
    if (effectivePrice <= 500000) score += 30;
    else if (effectivePrice <= 1000000) score += 20;
    reasons.push("قیمت اقتصادی و ارزش خرید بسیار بالا");
  }

  // 7. General boosts
  if (p.bestSeller) score += 6;
  if (p.discountPrice) score += 5;
  score += Math.round(p.rating * 2);

  // Fallback reason if none
  if (reasons.length === 0) {
    reasons.push("محصول منتخب و پرفروش ویپورا با ضمانت اصالت");
  }

  return {
    score: Math.min(99, Math.max(65, score)),
    reason: reasons.slice(0, 2).join(" • "),
    suggestedFlavor,
    coolingLevel,
  };
}

/* =========================================================================
   FREE FORM QUERY HANDLER
========================================================================= */

async function handleFreeFormQuery(
  rawQuery: string,
  products: Product[],
  categories: { slug: string; name: string }[],
  brands: { slug: string; name: string }[]
) {
  const intent = parseUserIntent(rawQuery);

  // 1. Informational Responses
  if (intent.isInfoQuery && intent.infoTopic) {
    if (intent.infoTopic === "difference") {
      return {
        type: "chat_reply",
        reply: `💡 **راهنمای جامع تفاوت سالت نیکوتین و جویس (E-Liquid):**

1. **سالت نیکوتین (Salt Nicotine):**
   - **میزان نیکوتین:** ۲۰ تا ۵۰ میلی‌گرم (بالا).
   - **دستگاه سازگار:** فقط **پادسیستم‌ها** و پادهای یک‌بارمصرف (وات پایین).
   - **هدف:** بیشترین شباهت به سیگار، جذب نیکوتین فوری و ضربه به گلو (Throat Hit) بدون سوزش.

2. **جویس معمولی (Freebase / E-Juice):**
   - **میزان نیکوتین:** ۰، ۳، ۶ تا حداکثر ۱۲ میلی‌گرم (پایین).
   - **دستگاه سازگار:** **ویپ و مادهای وات بالا** (Sub-Ohm).
   - **هدف:** تولید ابر بخار حجیم، طعم‌دهی غلیظ و تجربه‌ای شبیه به قلیان.`,
        products: [],
      };
    }

    if (intent.infoTopic === "shipping") {
      return {
        type: "chat_reply",
        reply: `🚚 **شرایط و زمان‌بندی ارسال سفارشات ویپورا:**
- ⚡ **ارسال فوری تهران:** تحویل کمتر از ۲ تا ۳ ساعت با پیک موتوری اختصاصی (امکان پرداخت در محل).
- 📦 **ارسال سراسر کشور:** با تیپاکس / پست پیشتاز طی ۲۴ تا حداکثر ۴۸ ساعت کاری با بسته‌بندی ایمن و کد رهگیری پیامکی.
- 🎉 **ارسال رایگان:** برای تمامی خریدهای بالای ۶۰۰ هزار تومان ارسال کاملاً رایگان است!`,
        products: [],
      };
    }

    if (intent.infoTopic === "authenticity") {
      return {
        type: "chat_reply",
        reply: `🛡️ **تضمین ۱۰۰٪ اصالت فیزیکی و آزمایشگاهی ویپورا:**
- تمامی محصولات دارای **هولوگرام اورجینال کارخانه و لایه اسکرچ (Scratch Code)** جهت استعلام مستقیم در وب‌سایت رسمی برندها (Elfbar, Nasty, Vaporesso, Lost Mary) هستند.
- در صورت هرگونه عدم تطابق یا نارضایتی، **۷ روز ضمانت بازگشت بی‌قیدوشرط وجه** برای شما فعال است.`,
        products: [],
      };
    }

    if (intent.infoTopic === "coil") {
      return {
        type: "chat_reply",
        reply: `🔧 **راهنمای طول عمر و نگهداری کویل و کارتریج:**
- طول عمر متوسط یک کویل اورجینال معمولاً بین **۲ تا ۳ هفته** (معادل مصرف ۳۰ تا ۵۰ میل سالت/جویس) است.
- **نکته طلایی:** پس از پر کردن کارتریج نو، حتماً **۱۰ الی ۱۵ دقیقه** صبر کنید تا پنبه کاملاً آغشته شود (Dry Hit نخورد).
- سالت‌های خیلی شیرین یا استفاده مداوم با کام‌های طولانی طول عمر کویل را کاهش می‌دهد.`,
        products: [],
      };
    }
  }

  // 2. Score and Rank Available Products
  const scoredProducts = products
    .filter((p) => p.stock > 0)
    .map((p) => {
      const evaluation = scoreProduct(p, intent, rawQuery);
      return {
        product: p,
        matchScore: evaluation.score,
        reason: evaluation.reason,
        suggestedFlavor: evaluation.suggestedFlavor,
        coolingLevel: evaluation.coolingLevel,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  // Pick top 3 recommendations
  const topRecs = scoredProducts.slice(0, 3);

  // 3. Compose Dynamic Conversational AI Reply
  let aiReplyText = "";

  if (intent.categorySlug === "salts" && intent.isIce) {
    aiReplyText = `برای یک تجربه فوق‌العاده خنک و میوه‌ای با **سالت نیکوتین اورجینال** (مخصوص پادسیستم)، این محصولات با بالاترین درصد رضایت و سطح خنکی (Ice) بالا پیشنهاد می‌شوند ❄️🍇🍉:`;
  } else if (intent.categorySlug === "salts") {
    aiReplyText = `بهترین گزینه‌های **سالت نیکوتین** با گیرایی عالی، جذب سریع و کیفیت طعم فوق‌العاده برای دستگاه پاد شما آماده شدند:`;
  } else if (intent.isIce && intent.isFruity) {
    aiReplyText = `اگر به دنبال طعم‌های **میوه‌ای خنک و یخی (Ice)** با حس تازگی بی‌نظیر در گلو هستید، این گزینه‌ها دقیقاً با سلیقه شما همخوانی دارند ❄️🍓🥭:`;
  } else if (intent.isTobacco || intent.isQuitSmoking) {
    aiReplyText = `برای رفع کامل هوس سیگار و دریافت نیکوتین استاندارد، این طعم‌های **تنباکویی اصیل و سالت‌های کلاسیک** بیشترین رضایت را در میان خریداران داشته‌اند 🚬✨:`;
  } else if (intent.isCheap) {
    aiReplyText = `اقتصادی‌ترین و باارزش‌ترین محصولات موجود در انبار ویپورا با **ضمانت کامل اصالت و قیمت رقابتی**:`;
  } else if (intent.isBestSeller) {
    aiReplyText = `پرفروش‌ترین و محبوب‌ترین انتخاب‌های کاربران ویپورا بر اساس بالاترین امتیاز رضایت خریداران ⭐:`;
  } else if (intent.isBrand) {
    aiReplyText = `محصولات اورجینال و پرطرفدار برند معتبر **${topRecs[0]?.product.brand || "ویپورا"}** با هولوگرام اصالت:`;
  } else {
    aiReplyText = `بر اساس تحلیل درخواست شما، این محصولات بیشترین تطابق را با ذائقه و نیازتان دارند. می‌توانید جزئیات و طعم‌های هر کدام را بررسی کنید:`;
  }

  return {
    type: "chat_reply",
    reply: aiReplyText,
    products: topRecs,
  };
}

/* =========================================================================
   WIZARD QUESTIONNAIRE MATCHER
========================================================================= */

function matchProductsByWizard(w: UserAnswer, products: Product[]): ProductRecommendation[] {
  const scored = products
    .filter((p) => p.stock > 0)
    .map((p) => {
      let score = 50;
      const reasons: string[] = [];
      let suggestedFlavor: string | undefined = undefined;

      const allText = normalizePersian(
        `${p.name} ${p.tagline || ""} ${p.description} ${p.category} ${p.brand} ${JSON.stringify(p.specs || {})}`
      );

      let flavorOptions: string[] = [];
      try {
        if (p.specs && p.specs.options) {
          const parsed = typeof p.specs.options === "string" ? JSON.parse(p.specs.options) : p.specs.options;
          if (parsed.flavors && Array.isArray(parsed.flavors)) {
            flavorOptions = parsed.flavors;
          }
        }
      } catch {}

      // Category match
      if (w.category && p.categorySlug === w.category) {
        score += 30;
      }

      // Goal match
      if (w.goal === "smoke") {
        if (p.categorySlug === "salts") {
          score += 30;
          reasons.push("گیرایی عالی مشابه سیگار");
        } else if (p.categorySlug === "pods") {
          score += 20;
          reasons.push("استفاده بسیار راحت و سبک");
        }
      } else if (w.goal === "hookah" || w.goal === "pro") {
        if (p.categorySlug === "mods" || p.categorySlug === "devices") {
          score += 25;
          reasons.push("حجم بخار غلیظ و طعم‌دهی بالا");
        }
      } else if (w.goal === "newbie") {
        if (p.categorySlug === "pods") {
          score += 30;
          reasons.push("بدون نیاز به تنظیمات و دکمه");
        }
      }

      // Taste match
      if (w.taste === "ice" || (w.cooling && w.cooling >= 4)) {
        if (allText.includes("ice") || allText.includes("یخ") || allText.includes("خنک") || allText.includes("نعناع")) {
          score += 25;
          const iceFlav = flavorOptions.find((f) => normalizePersian(f).includes("یخ") || normalizePersian(f).includes("آیس"));
          if (iceFlav) suggestedFlavor = iceFlav;
          reasons.push("خنکی فوق‌العاده و تازه");
        }
      } else if (w.taste === "tobacco") {
        if (allText.includes("tobacco") || allText.includes("تنباکو") || allText.includes("سیگار") || allText.includes("cubano")) {
          score += 25;
          reasons.push("طعم اصیل تنباکویی");
        }
      } else if (w.taste === "dessert") {
        if (allText.includes("cream") || allText.includes("کیک") || allText.includes("وانیل") || allText.includes("custard")) {
          score += 25;
          reasons.push("طعم خامه‌ای و شیرین دلپذیر");
        }
      } else if (w.taste === "fruity") {
        if (allText.includes("berry") || allText.includes("mango") || allText.includes("انبه") || allText.includes("توت") || allText.includes("هلو") || allText.includes("انگور") || allText.includes("هندوانه")) {
          score += 25;
          reasons.push("ترکیب میوه‌ای و باطراوت");
        }
      }

      // Extra boosts
      if (p.bestSeller) score += 6;
      if (p.discountPrice) score += 5;
      score += Math.round(p.rating * 2);

      let coolingLevel = 0;
      if (allText.includes("یخ") || allText.includes("ice") || allText.includes("خنک")) coolingLevel = 4;

      return {
        product: p,
        matchScore: Math.min(99, Math.max(75, score)),
        reason: reasons.length ? reasons.join(" • ") : "محصول پرفروش و منتخب",
        suggestedFlavor,
        coolingLevel,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);

  return scored;
}
