<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useVape } from "~/composables/useVape";
import { useAuth } from "~/composables/useAuth";
import { useReservation } from "~/composables/useReservation";
import { money, FREE_SHIPPING, haptic } from "~/utils/vape";
import {
  ArrowLeftIcon,
  CheckIcon,
  ShieldIcon,
  DropletIcon,
  ZapIcon,
  TruckIcon,
} from "~/components/vapor/VIcons";

import { useAddresses } from "~/composables/useAddresses";
import type { Address } from "~/types";

useSeoMeta({
  title: "تکمیل سفارش",
});

const { cart, cartTotal, clear, ageOk, hydrated, hasOutOfStockItems, outOfStockItems, revalidateCart, remove, toast } = useVape();
const { user, isLoggedIn, openAuth } = useAuth();
const { reservationId, isReserved, isExpired, reserve, release } = useReservation();
const { addresses, loading: loadingAddresses, fetchAddresses, addAddress: saveNewAddress } = useAddresses();

const done = ref<string | null>(null);
const busy = ref(false);
const err = ref("");
const paymentMethod = ref<"online" | "cod">("online");
const selectedAddressId = ref<number | "new">("new");
const saveAddressForLater = ref(true);
const newAddressTitle = ref("منزل");
const showAddressEdit = ref(false);


// Regex & Validation Helpers for Iranian Addresses and Identity
const isPhoneOrDigits = (val?: string | null): boolean => {
  if (!val) return false;
  const clean = val.replace(/[\s\-_+()]/g, '');
  return /^\d+$/.test(clean) || /^(\+?98|0)?9\d{9}$/.test(clean);
};

const toEnglishDigits = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));
};

const normalizePhone = (phone?: string | null): string => {
  if (!phone) return '';
  let p = toEnglishDigits(phone).replace(/[\s\-_()]/g, '');
  if (p.startsWith('+98')) p = '0' + p.slice(3);
  if (p.startsWith('0098')) p = '0' + p.slice(4);
  if (p.startsWith('98')) p = '0' + p.slice(2);
  if (p.startsWith('9') && p.length === 10) p = '0' + p;
  return p;
};

// Safe Name resolver: NEVER allow digits or phone numbers to populate as a person name!
const getValidPersonName = (candidate?: string | null): string => {
  if (!candidate) return '';
  const trimmed = candidate.trim();
  if (isPhoneOrDigits(trimmed)) return '';
  if (/\d|[0-9]|[۰-۹]/.test(trimmed)) return '';
  if (!/[\u0600-\u06FFa-zA-Z]/.test(trimmed)) return '';
  return trimmed;
};

// Strict Name Regex: Persian/English letters only, spaces, half-space, min 3 chars, max 40 chars
const NAME_REGEX = /^[\u0600-\u06FFa-zA-Z\s\u200C]{3,40}$/;

// Strict Iranian Mobile Regex: 11 digits starting with 09
const MOBILE_REGEX = /^09\d{9}$/;

// Strict Postal Code Regex: 10 numeric digits
const POSTAL_CODE_REGEX = /^\d{10}$/;

const f = ref({
  name: getValidPersonName(user.value?.name),
  phone: normalizePhone(user.value?.phone || user.value?.phoneNumber || ""),
  city: "تهران",
  addr: "",
  zip: "",
  note: "",
});

const selectAddress = (addr: Address) => {
  selectedAddressId.value = addr.id;
  const resolvedName = getValidPersonName(addr.recipientName) || getValidPersonName(user.value?.name) || getValidPersonName(f.value.name);
  const resolvedPhone = normalizePhone(addr.recipientPhone || user.value?.phone || f.value.phone || "");

  f.value.name = resolvedName;
  f.value.phone = resolvedPhone;
  f.value.city = addr.city || "تهران";
  f.value.addr = addr.line1 + (addr.line2 ? ' - ' + addr.line2 : '');
  f.value.zip = toEnglishDigits(addr.zip || "");

  // If name or phone is empty, open edit form automatically
  if (!f.value.name || !f.value.phone || !f.value.addr || f.value.addr.length < 8) {
    showAddressEdit.value = true;
  } else {
    showAddressEdit.value = false;
  }
  haptic(15);
};

const switchToNewAddress = () => {
  selectedAddressId.value = "new";
  f.value.addr = "";
  f.value.zip = "";
  showAddressEdit.value = true;
  haptic(15);
};

watch(
  () => f.value.city,
  (newCity) => {
    if (newCity !== "تهران" && paymentMethod.value === "cod") {
      paymentMethod.value = "online";
    }
  }
);

const initCheckout = async () => {
  await revalidateCart();
  if (user.value) {
    const validCandidateName = getValidPersonName(user.value.name);
    if (!f.value.name && validCandidateName) f.value.name = validCandidateName;
    if (!f.value.phone && user.value.phone) f.value.phone = normalizePhone(user.value.phone);
  }
  // Fetch saved addresses from server and local storage
  const loadedAddrs = await fetchAddresses();
  if (loadedAddrs && loadedAddrs.length > 0) {
    const def = loadedAddrs.find((a) => a.isDefault) || loadedAddrs[0];
    if (def) {
      selectAddress(def);
    }
  } else {
    selectedAddressId.value = "new";
    showAddressEdit.value = true;
  }

  // Auto-reserve inventory for 15 minutes if cart is non-empty
  if (cart.value.length > 0 && !hasOutOfStockItems.value) {
    await reserve(cart.value);
  }
};

onMounted(() => {
  initCheckout();
});

// Watch cart changes: if items are removed/updated, re-reserve
watch(
  () => cart.value.length,
  async (newLen) => {
    if (newLen > 0 && !hasOutOfStockItems.value) {
      await reserve(cart.value);
    }
  }
);

const shipping = computed(() =>
  cartTotal.value >= FREE_SHIPPING || cart.value.length === 0 ? 0 : 65000
);
const total = computed(() => cartTotal.value + shipping.value);

const place = async () => {
  // مرحله ۱: بررسی ورود به حساب کاربری
  if (!isLoggedIn.value) {
    const msg = "ثبت نهایی سفارش مستلزم ورود به حساب کاربری است. لطفاً ابتدا وارد حساب خود شوید.";
    err.value = msg;
    toast(msg, "err");
    openAuth("login");
    return;
  }

  // مرحله ۲: بررسی سن بالای ۱۸ سال
  if (!ageOk.value) {
    const msg = "برای خرید از ویپ‌لب، ابتدا باید سن بالای ۱۸ سال خود را تأیید کنید.";
    err.value = msg;
    toast(msg, "err");
    return;
  }

  // پاکسازی و استانداردسازی مقادیر ورودی
  const rawName = String(f.value.name || "").trim();
  const rawPhone = normalizePhone(f.value.phone);
  const rawAddr = String(f.value.addr || "").trim();
  const rawZip = toEnglishDigits(f.value.zip || "").replace(/\D/g, "");

  // بررسی ریجکس نام تحویل‌گیرنده (فقط حروف فارسی/انگلیسی - بدون عدد یا شماره موبایل)
  if (isPhoneOrDigits(rawName) || /\d|[0-9]|[۰-۹]/.test(rawName)) {
    showAddressEdit.value = true;
    const msg = "شماره موبایل یا عدد نباید در فیلد نام قرار گیرد! لطفاً نام و نام خانوادگی واقعی گیرنده را با حروف بنویسید.";
    err.value = msg;
    toast(msg, "err");
    haptic(30);
    if (typeof window !== "undefined") window.scrollTo({ top: 180, behavior: "smooth" });
    return;
  }

  if (!NAME_REGEX.test(rawName)) {
    showAddressEdit.value = true;
    const msg = "نام و نام خانوادگی نامعتبر است! لطفاً حداقل ۳ حرف (فقط حروف فارسی یا انگلیسی بدون عدد و نماد) وارد کنید.";
    err.value = msg;
    toast(msg, "err");
    haptic(30);
    if (typeof window !== "undefined") window.scrollTo({ top: 180, behavior: "smooth" });
    return;
  }

  // بررسی ریجکس شماره موبایل گیرنده (۱۱ رقم با 09)
  if (!MOBILE_REGEX.test(rawPhone)) {
    showAddressEdit.value = true;
    const msg = "شماره موبایل گیرنده نامعتبر است! شماره باید ۱۱ رقم با فرمت ۰۹۱۲۳۴۵۶۷۸۹ باشد.";
    err.value = msg;
    toast(msg, "err");
    haptic(30);
    if (typeof window !== "undefined") window.scrollTo({ top: 180, behavior: "smooth" });
    return;
  }

  // بررسی ریجکس نشانی پستی (حداقل ۸ کاراکتر و دارای نام خیابان/پلاک)
  if (rawAddr.length < 8 || !/[\u0600-\u06FFa-zA-Z]/.test(rawAddr) || /^(\W|\d)+$/.test(rawAddr)) {
    showAddressEdit.value = true;
    const msg = "نشانی تحویل ناقص است! لطفاً آدرس پستی دقیق شامل خیابان، کوچه و پلاک را بنویسید.";
    err.value = msg;
    toast(msg, "err");
    haptic(30);
    if (typeof window !== "undefined") window.scrollTo({ top: 180, behavior: "smooth" });
    return;
  }

  // بررسی ریجکس کد پستی (در صورت وارد شدن باید ۱۰ رقمی باشد)
  if (rawZip && !POSTAL_CODE_REGEX.test(rawZip)) {
    showAddressEdit.value = true;
    const msg = "کد پستی باید دقیقاً یک عدد ۱۰ رقمی معتبر باشد.";
    err.value = msg;
    toast(msg, "err");
    haptic(30);
    if (typeof window !== "undefined") window.scrollTo({ top: 180, behavior: "smooth" });
    return;
  }

  // به‌روزرسانی مقادیر تمیزشده در فرم
  f.value.name = rawName;
  f.value.phone = rawPhone;
  f.value.addr = rawAddr;
  f.value.zip = rawZip;

  // مرحله ۳: توست موفقیت اعتبارسنجی مشخصات
  toast("اطلاعات گیرنده و آدرس تحویل با موفقیت تأیید شد ✓", "ok");
  haptic(15);

  busy.value = true;
  err.value = "";

  // مرحله ۴: توست اطلاع‌رسانی آغاز ثبت سفارش و اتصال به درگاه
  if (paymentMethod.value === "online") {
    toast("در حال آماده‌سازی درگاه سندباکس زرین‌پال...", "ok");
  } else {
    toast("در حال ثبت سفارش پرداخت در محل...", "ok");
  }

  try {
    const customerEmail = user.value?.email || (rawPhone + "@vapelab.local");
    const d = await $fetch<{ ok: boolean; number: string; total?: number; paymentUrl?: string; error?: string }>("/api/checkout", {
      method: "POST",
      body: {
        items: cart.value.map((c) => ({
          id: c.id,
          qty: c.qty,
          variantId: c.variantId || undefined,
          color: c.color || undefined,
        })),
        reservationId: reservationId.value || undefined,
        paymentMethod: paymentMethod.value,
        couponCode: null,
        customer: {
          name: rawName,
          email: customerEmail,
          phone: rawPhone,
          line1: rawAddr,
          line2: f.value.note ? f.value.note.trim() : undefined,
          city: f.value.city || "تهران",
          zip: rawZip || "00000",
          country: "Iran",
        },
      },
    });

    haptic(20);

    // ذخیره نشانی جدید در دفترچه اگر انتخاب شده باشد
    if (selectedAddressId.value === "new" && saveAddressForLater.value) {
      try {
        await saveNewAddress({
          title: newAddressTitle.value || "منزل",
          recipientName: rawName,
          recipientPhone: rawPhone,
          city: f.value.city || "تهران",
          line1: rawAddr,
          zip: rawZip || "00000",
          isDefault: addresses.value.length === 0,
        });
      } catch {}
    }

    // ذخیره شماره سفارش در تاریخچه لوکال
    if (d && d.number && typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("vapora.my_orders");
        const list = raw ? JSON.parse(raw) : [];
        if (!list.includes(d.number)) {
          list.unshift(d.number);
          localStorage.setItem("vapora.my_orders", JSON.stringify(list.slice(0, 30)));
        }
      } catch {}
    }

    clear();
    await release();

    // مرحله ۵: توست هدایت به درگاه یا نمایش فاکتور
    if (d && d.paymentUrl) {
      toast("هدایت به درگاه پرداخت سندباکس زرین‌پال...", "ok");
      if (typeof window !== "undefined") {
        setTimeout(() => {
          window.location.href = (d.paymentUrl as string);
        }, 500);
      } else {
        await navigateTo(d.paymentUrl, { external: true });
      }
      return;
    }

    toast(`سفارش ${d.number} با موفقیت ثبت شد ✓`, "ok");
    done.value = d ? d.number : "";
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0 });
    }
  } catch (e2: any) {
    const errorMsg = e2?.data?.message || e2?.message || "خطا در برقراری ارتباط و ثبت سفارش";
    err.value = errorMsg;
    toast(errorMsg, "err");
    haptic(35);
  } finally {
    busy.value = false;
  }
};
</script>

<template>
  <div>
    <!-- صفحه موفقیت ثبت سفارش -->
    <div v-if="done" class="wrap flex min-h-[75svh] flex-col items-center justify-center py-10 text-center">
      <span class="grid h-24 w-24 place-items-center rounded-full border border-neon/40 bg-neon/12 text-neon glow-g">
        <CheckIcon :size="40" :sw="2.6" />
      </span>
      <h1 class="mt-8 font-display text-[26px] font-extrabold text-snow">سفارشت ثبت شد! 🎉</h1>
      <p class="mt-3 text-[13.5px] leading-7 text-mist">
        شماره فاکتور: <strong dir="ltr" class="text-vio">{{ done }}</strong>
        <br />
        سفارش شما در سامانه ثبت شده و آماده ورود به درگاه پرداخت یا هماهنگی ارسال است.
      </p>
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <NuxtLink
          :to="`/order/${done}`"
          class="pressable inline-flex h-13 items-center rounded-2xl bg-gradient-to-l from-vio to-ice px-7 py-4 text-[13.5px] font-extrabold text-ink glow-v"
        >
          🧾 مشاهده فاکتور رسمی
        </NuxtLink>
        <NuxtLink
          :to="`/track?order=${done}`"
          class="pressable inline-flex h-13 items-center rounded-2xl border border-white/14 px-7 py-4 text-[13.5px] font-extrabold text-snow hover:bg-white/10"
        >
          🚚 پیگیری زنده مرسوله
        </NuxtLink>
        <NuxtLink
          to="/shop"
          class="pressable inline-flex h-13 items-center rounded-2xl border border-white/10 px-6 py-4 text-[13px] font-bold text-mist hover:text-snow"
        >
          بازگشت به فروشگاه
        </NuxtLink>
      </div>
    </div>

    <!-- اسکلتون هنگام لودینگ -->
    <div v-else-if="!hydrated" class="wrap pt-8" aria-busy="true">
      <div class="skeleton h-10 w-64" />
      <div class="mt-8 grid gap-6 lg:grid-cols-2">
        <div class="skeleton h-96 w-full" />
        <div class="skeleton h-96 w-full" />
      </div>
    </div>

    <!-- سبد خالی -->
    <div v-else-if="cart.length === 0" class="wrap flex min-h-[70svh] flex-col items-center justify-center text-center">
      <p class="text-6xl">🧾</p>
      <h1 class="mt-5 text-[20px] font-extrabold text-snow">چیزی برای پرداخت نیست</h1>
      <p class="mt-2 text-[13px] text-dim">اول چند محصول خوش‌طعم به سبدت اضافه کن.</p>
      <NuxtLink
        to="/shop"
        class="pressable mt-7 inline-flex h-13 items-center rounded-2xl bg-gradient-to-l from-vio to-ice px-8 py-4 text-[14px] font-extrabold text-ink glow-v"
      >
        رفتن به فروشگاه
      </NuxtLink>
    </div>

    <!-- فرم تکمیل سفارش -->
    <div v-else class="wrap pt-8 pb-4">
      <NuxtLink to="/cart" class="mb-4 inline-flex items-center gap-2 text-[13px] font-bold text-vio">
        <ArrowLeftIcon :size="16" /> بازگشت به سبد
      </NuxtLink>
      <h1 class="font-display text-[26px] font-extrabold text-snow">تکمیل سفارش</h1>

      <!-- نشانگر تایمر و رزرو موجودی انبار -->
      <div class="mt-4">
        <ReservationBadge @renewed="revalidateCart" />
      </div>

      <p v-if="!ageOk" class="mt-4 rounded-2xl border border-blush/25 bg-blush/8 px-4 py-3 text-[12.5px] text-blush">
        ⚠️ گیت تأیید سن را کامل نکرده‌اید — برای خرید، ورود شما باید بالای ۱۸ سال باشد.
      </p>

      <form class="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_380px]" @submit.prevent="place">
        <div class="space-y-4">
          <!-- گام ۱: نشانی و گیرنده -->
          <div class="card-g rounded-[22px] p-5 sm:p-6">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="flex items-center gap-2 text-[15px] font-extrabold text-snow">
                <span class="grid h-7 w-7 place-items-center rounded-full bg-vio/15 text-[12px] text-vio">۱</span>
                اطلاعات گیرنده و نشانی تحویل
              </h2>
              <NuxtLink
                to="/account?tab=addresses"
                class="text-[11.5px] font-bold text-vio hover:underline flex items-center gap-1"
              >
                دفترچه نشانی‌ها ↗
              </NuxtLink>
            </div>

            <!-- کارت‌های نشانی‌های ذخیره‌شده -->
            <div v-if="addresses.length > 0" class="mb-5 space-y-2.5">
              <p class="text-[11.5px] font-bold text-dim mb-2">
                انتخاب سریع از نشانی‌های ذخیره‌شده:
              </p>
              <div class="grid gap-2.5 sm:grid-cols-2">
                <button
                  v-for="addr in addresses"
                  :key="addr.id"
                  type="button"
                  class="pressable relative flex flex-col text-right rounded-2xl border p-3.5 transition-all duration-300 cursor-pointer"
                  :class="[
                    selectedAddressId === addr.id
                      ? 'border-vio/80 bg-vio/12 shadow-[0_0_20px_rgba(167,139,250,0.18)]'
                      : 'border-white/10 bg-white/4 hover:border-white/20 hover:bg-white/6',
                  ]"
                  @click="selectAddress(addr)"
                >
                  <div class="flex items-center justify-between gap-2 mb-1.5">
                    <span class="flex items-center gap-1.5 text-[13px] font-black text-snow">
                      <span class="grid h-5 w-5 place-items-center rounded-full border text-[10px]"
                        :class="selectedAddressId === addr.id ? 'border-vio bg-vio text-ink font-extrabold' : 'border-white/20 text-transparent'">
                        ✓
                      </span>
                      {{ addr.title || 'نشانی من' }}
                    </span>
                    <span
                      v-if="addr.isDefault"
                      class="rounded-md bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 text-[9.5px] font-black text-amber-300"
                    >
                      پیش‌فرض
                    </span>
                  </div>
                  <div class="text-[11.5px] text-snow font-bold">
                    {{ addr.recipientName }} · <span dir="ltr" class="font-mono text-mist">{{ addr.recipientPhone }}</span>
                  </div>
                  <div class="mt-1 text-[11px] text-mist line-clamp-2 leading-5">
                    {{ addr.city }}، {{ addr.line1 }}
                  </div>
                </button>

                <!-- دکمه نشانی جدید -->
                <button
                  type="button"
                  class="pressable flex flex-col items-center justify-center rounded-2xl border border-dashed p-4 text-center transition-all cursor-pointer min-h-[96px]"
                  :class="[
                    selectedAddressId === 'new'
                      ? 'border-vio bg-vio/10 text-snow shadow-[0_0_20px_rgba(167,139,250,0.15)]'
                      : 'border-white/20 bg-white/2 text-mist hover:border-white/30 hover:bg-white/4',
                  ]"
                  @click="switchToNewAddress"
                >
                  <span class="text-[16px] mb-1">➕</span>
                  <span class="text-[12px] font-extrabold text-snow">ثبت نشانی جدید</span>
                  <span class="text-[10.5px] text-dim mt-0.5">تحویل به آدرس یا گیرنده دیگر</span>
                </button>
              </div>
            </div>

            <!-- خلاصه نشانی انتخاب‌شده (اگر یک نشانی موجود انتخاب شده و فرم بسته است) -->
            <div
              v-if="selectedAddressId !== 'new' && !showAddressEdit"
              class="rounded-2xl border border-vio/30 bg-vio/8 p-4 flex flex-wrap items-center justify-between gap-3"
            >
              <div class="min-w-0">
                <div class="flex items-center gap-2 text-[12.5px] font-extrabold text-snow">
                  <span>📍 ارسال به: {{ f.city }}، {{ f.addr }}</span>
                </div>
                <div class="text-[11px] text-mist mt-1">
                  تحویل‌گیرنده: <strong class="text-snow">{{ f.name || 'نامشخص' }}</strong> ({{ f.phone || 'تلفن ثبت نشده' }})
                  <div v-if="!f.name || !f.phone" class="mt-2 text-[11px] text-amber-400 font-bold">
                    ⚠️ نام یا شماره گیرنده ثبت نشده است — لطفاً روی ویرایش جزئیات کلیک کنید.
                  </div>
                  <span v-if="f.zip" class="mr-2">· کد پستی: {{ f.zip }}</span>
                </div>
              </div>
              <button
                type="button"
                class="pressable rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-bold text-snow hover:bg-white/10 cursor-pointer"
                @click="showAddressEdit = true"
              >
                ✏️ ویرایش جزئیات
              </button>
            </div>

            <!-- فرم ورود یا ویرایش نشانی -->
            <div v-if="selectedAddressId === 'new' || showAddressEdit" class="space-y-3 mt-4">
              <div v-if="selectedAddressId === 'new'" class="grid gap-3 sm:grid-cols-2">
                <label class="block">
                  <span class="mb-1 block text-[11.5px] font-bold text-dim">عنوان نشانی (اختیاری)</span>
                  <input v-model="newAddressTitle" class="input" placeholder="مثلاً منزل، محل کار، باغ..." />
                </label>
                <div class="flex items-end pb-2">
                  <label class="flex items-center gap-2 text-[11.5px] text-snow cursor-pointer">
                    <input type="checkbox" v-model="saveAddressForLater" class="accent-vio h-4 w-4 rounded" />
                    <span>ذخیره این نشانی در دفترچه برای خریدهای آینده</span>
                  </label>
                </div>
              </div>

              <div class="grid gap-3 sm:grid-cols-2">
                <label class="block">
                  <span class="mb-1 block text-[11.5px] font-bold text-dim flex items-center justify-between">
                    <span>نام و نام خانوادگی گیرنده *</span>
                    <span class="text-[10px] text-violet-300 font-normal">فقط حروف فارسی (بدون عدد)</span>
                  </span>
                  <input
                    v-model="f.name"
                    class="input"
                    placeholder="مثلاً آرمان رضایی"
                    @input="f.name = f.name.replace(/[\d0-9۰-۹]/g, '')"
                  />
                </label>
                <label class="block">
                  <span class="mb-1 block text-[11.5px] font-bold text-dim flex items-center justify-between">
                    <span>شماره موبایل گیرنده *</span>
                    <span class="text-[10px] text-violet-300 font-normal">۱۱ رقم با فرمت ۰۹</span>
                  </span>
                  <input
                    v-model="f.phone"
                    class="input"
                    dir="ltr"
                    inputmode="tel"
                    placeholder="0912 345 6789"
                    @input="f.phone = toEnglishDigits(f.phone).replace(/[^\d+]/g, '')"
                  />
                </label>
                <label class="block">
                  <span class="mb-1 block text-[11.5px] font-bold text-dim">شهر مقصد *</span>
                  <select v-model="f.city" class="input">
                    <option v-for="c in ['تهران', 'کرج', 'شیراز', 'اصفهان', 'مشهد', 'تبریز', 'رشت', 'اهواز', 'یزد', 'کرمان', 'قم', 'ساری']" :key="c">{{ c }}</option>
                  </select>
                </label>
                <label class="block">
                  <span class="mb-1 block text-[11.5px] font-bold text-dim flex items-center justify-between">
                    <span>کد پستی ۱۰ رقمی</span>
                    <span class="text-[10px] text-mist font-normal">۱۰ رقم بدون خط تیره</span>
                  </span>
                  <input
                    v-model="f.zip"
                    class="input"
                    dir="ltr"
                    inputmode="numeric"
                    placeholder="مثلاً 1458963251"
                    maxlength="10"
                    @input="f.zip = toEnglishDigits(f.zip).replace(/\D/g, '').slice(0, 10)"
                  />
                </label>
                <label class="block sm:col-span-2">
                  <span class="mb-1 block text-[11.5px] font-bold text-dim">نشانی کامل پستی (خیابان، پلاک، واحد) *</span>
                  <input v-model="f.addr" class="input" placeholder="خیابان اصلی، کوچه، پلاک، زنگ یا واحد" />
                </label>
                <label class="block sm:col-span-2">
                  <span class="mb-1 block text-[11.5px] font-bold text-dim">توضیحات تحویل یا یادداشت به پیک (اختیاری)</span>
                  <input v-model="f.note" class="input" placeholder="مثلاً: بعد از ۵ عصر تحویل شود یا زنگ واحد ۳" />
                </label>
              </div>

              <div v-if="selectedAddressId !== 'new' && showAddressEdit" class="text-left pt-1">
                <button
                  type="button"
                  class="text-[11px] font-bold text-dim hover:text-snow cursor-pointer"
                  @click="showAddressEdit = false"
                >
                  ✕ بستن فرم ویرایش
                </button>
              </div>
            </div>
          </div>

          <div class="card-g rounded-[22px] p-5">
            <h2 class="mb-3 flex items-center justify-between text-[15px] font-extrabold text-snow">
              <span class="flex items-center gap-2">
                <span class="grid h-7 w-7 place-items-center rounded-full bg-vio/15 text-[12px] text-vio">۲</span>
                روش پرداخت
              </span>
              <span class="text-[11px] font-bold text-emerald-400">🛡️ اتصال امن شاپرک</span>
            </h2>

            <div class="space-y-3">
              <!-- پرداخت آنلاین اینترنتی (پیش‌فرض و فعال) -->
              <label
                class="pressable group relative flex cursor-pointer items-center gap-3.5 rounded-2xl border p-4 transition-all duration-300"
                :class="[
                  paymentMethod === 'online'
                    ? 'border-vio/70 bg-gradient-to-l from-vio/15 via-ice/10 to-transparent shadow-[0_0_20px_rgba(167,139,250,0.18)]'
                    : 'border-white/10 bg-white/4 hover:border-white/20 hover:bg-white/6',
                ]"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  v-model="paymentMethod"
                  class="accent-vio h-4 w-4"
                />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="text-[13.5px] font-extrabold text-snow">پرداخت اینترنتی امن (شتاب / شاپرک)</span>
                    <span class="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10.5px] font-bold text-emerald-400">
                      ⚡ اتصال آنی
                    </span>
                  </div>
                  <p class="mt-1 text-[11px] text-mist">
                    پشتیبانی از کلیه کارت‌های بانکی عضو شتاب با رمز پویا · پردازش و تایید در لحظه
                  </p>
                </div>
                <div class="flex items-center gap-1.5 shrink-0">
                  <span class="rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 text-[11.5px] font-bold text-ice">
                    💳 شاپرک
                  </span>
                </div>
              </label>

              <!-- پرداخت در محل (تهران با کارتخوان) -->
              <label
                class="pressable group relative flex cursor-pointer items-center gap-3.5 rounded-2xl border p-4 transition-all duration-300"
                :class="[
                  f.city !== 'تهران' ? 'opacity-50 cursor-not-allowed' : '',
                  paymentMethod === 'cod'
                    ? 'border-neon/60 bg-gradient-to-l from-neon/12 via-ice/8 to-transparent shadow-[0_0_20px_rgba(74,222,128,0.15)]'
                    : 'border-white/10 bg-white/4 hover:border-white/20 hover:bg-white/6',
                ]"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  v-model="paymentMethod"
                  :disabled="f.city !== 'تهران'"
                  class="accent-emerald-400 h-4 w-4"
                />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="text-[13.5px] font-extrabold text-snow">پرداخت در محل (کارتخوان پیک)</span>
                    <span
                      class="rounded-md px-2 py-0.5 text-[10.5px] font-bold"
                      :class="f.city === 'تهران' ? 'bg-white/10 text-snow' : 'bg-blush/20 text-blush'"
                    >
                      {{ f.city === 'تهران' ? 'فقط شهر تهران' : 'غیرفعال برای شهرستان' }}
                    </span>
                  </div>
                  <p class="mt-1 text-[11px] text-mist">
                    {{ f.city === 'تهران' ? 'تسویه حضوری هنگام دریافت بسته توسط دستگاه کارتخوان سیار پیک' : 'امکان پرداخت در محل تنها برای آدرس‌های محدوده شهر تهران فعال است.' }}
                  </p>
                </div>
                <span class="text-2xl shrink-0">🛵</span>
              </label>
            </div>
          </div>
        </div>

        <!-- خلاصه -->
        <aside class="card-g sticky top-20 rounded-[22px] p-5">
          <h2 class="text-[15px] font-extrabold text-snow">سفارش شما</h2>

          <!-- هشدار کالای ناموجود در سبد -->
          <div
            v-if="hasOutOfStockItems"
            class="mt-3 rounded-2xl border border-blush/40 bg-blush/10 p-3.5 text-[12px] text-blush"
          >
            <p class="flex items-center gap-1.5 font-extrabold text-[12.5px]">
              <span>⚠️</span> کالای ناموجود در سبد خرید
            </p>
            <p class="mt-1 text-[11px] leading-5 text-blush/90">
              یک یا چند کالا در سبد شما ناموجود شده‌اند. لطفاً قبل از ثبت، آن‌ها را از سبد حذف کنید.
            </p>
          </div>

          <ul class="mt-4 max-h-60 space-y-3 overflow-y-auto">
            <li
              v-for="c in cart"
              :key="c.k"
              class="flex items-center gap-3 rounded-xl p-1.5 transition-colors"
              :class="c.stock <= 0 ? 'bg-blush/8 border border-blush/25' : ''"
            >
              <img :src="c.img" alt="" class="h-14 w-12 rounded-xl object-cover" loading="lazy" />
              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between gap-1">
                  <p dir="ltr" class="truncate text-right text-[12.5px] font-extrabold text-snow">{{ c.name }}</p>
                  <button
                    v-if="c.stock <= 0"
                    type="button"
                    class="shrink-0 text-[11px] font-bold text-blush underline hover:text-blush/80 cursor-pointer"
                    @click="remove(c.k)"
                  >
                    حذف
                  </button>
                </div>
                <div class="flex items-center gap-2 mt-0.5">
                  <span
                    v-if="c.stock <= 0"
                    class="rounded-md bg-blush/20 px-1.5 py-0.5 text-[10px] font-extrabold text-blush"
                  >
                    ناموجود
                  </span>
                  <p class="text-[10.5px] text-dim tnum">
                    {{ c.qty }} × {{ money(c.price) }}
                    <span v-if="c.flavor"> · {{ c.flavor }}</span>
                  </p>
                </div>
              </div>
              <span class="text-[12.5px] font-extrabold text-snow tnum">{{ money(c.price * c.qty) }}</span>
            </li>
          </ul>
          <dl class="mt-5 space-y-3 border-t border-white/8 pt-4 text-[13px]">
            <div class="flex justify-between">
              <dt class="text-dim">جمع کالاها</dt>
              <dd class="font-extrabold text-snow tnum">{{ money(cartTotal) }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-dim">ارسال</dt>
              <dd :class="['font-extrabold tnum', shipping === 0 ? 'text-neon' : 'text-snow']">
                {{ shipping === 0 ? 'رایگان' : money(shipping) }}
              </dd>
            </div>
            <div class="flex justify-between border-t border-white/8 pt-3">
              <dt class="text-[15px] font-extrabold text-snow">قابل پرداخت</dt>
              <dd class="text-[18px] font-extrabold text-grad tnum">{{ money(total) }}</dd>
            </div>
          </dl>

          <p v-if="err" class="mt-4 rounded-xl border border-blush/30 bg-blush/8 px-3 py-2.5 text-[12px] text-blush">
            {{ err }}
          </p>

          <button
            type="button" @click="place" :disabled="busy || hasOutOfStockItems"
            class="pressable mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-vio to-ice text-[15px] font-extrabold text-ink glow-v disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <span v-if="busy" class="h-5 w-5 animate-spin rounded-full border-2 border-ink border-t-transparent" />
            <template v-else-if="hasOutOfStockItems">
              ⚠️ سبد دارای کالای ناموجود است
            </template>
            <template v-else-if="paymentMethod === 'online'">
              <ZapIcon :size="18" :sw="2.2" /> پرداخت آنلاین و ثبت نهایی — {{ money(total) }}
            </template>
            <template v-else>
              <TruckIcon :size="18" :sw="2.2" /> ثبت نهایی (پرداخت در محل) — {{ money(total) }}
            </template>
          </button>
          <p class="mt-3 flex items-center justify-center gap-1.5 text-[10.5px] text-dim">
            <DropletIcon :size="12" class="text-vio" />
            فروش فقط به افراد بالای ۱۸ سال — {{ money(0) }} اضافه‌هزینه‌ای در کار نیست
          </p>
        </aside>
      </form>
    </div>
  </div>
</template>
