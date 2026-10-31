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

const { cart, cartTotal, clear, ageOk, hydrated, hasOutOfStockItems, outOfStockItems, revalidateCart, remove } = useVape();
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

const f = ref({
  name: user.value?.name || "",
  phone: user.value?.phone || "",
  city: "تهران",
  addr: "",
  zip: "",
  note: "",
});

const selectAddress = (addr: Address) => {
  selectedAddressId.value = addr.id;
  f.value.name = addr.recipientName;
  f.value.phone = addr.recipientPhone;
  f.value.city = addr.city;
  f.value.addr = addr.line1 + (addr.line2 ? ` - ${addr.line2}` : "");
  f.value.zip = addr.zip || "";
  showAddressEdit.value = false;
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
    if (!f.value.name && user.value.name) f.value.name = user.value.name;
    if (!f.value.phone && user.value.phone) f.value.phone = user.value.phone;
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
  if (!ageOk.value) {
    err.value = "برای خرید ابتدا باید سن بالای ۱۸ سال خود را تأیید کنید (گیت سن ابتدای سایت).";
    return;
  }
  if (f.value.name.trim().length < 3 || f.value.addr.trim().length < 6 || f.value.phone.trim().length < 10) {
    err.value = "نام، شماره موبایل و آدرس را کامل وارد کنید.";
    return;
  }
  busy.value = true;
  err.value = "";
  try {
    const customerEmail = user.value?.email || `${f.value.phone.trim()}@vapelab.local`;
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
          name: f.value.name.trim(),
          email: customerEmail,
          phone: f.value.phone.trim(),
          line1: f.value.addr.trim(),
          line2: f.value.note.trim() || undefined,
          city: f.value.city,
          zip: f.value.zip.trim() || "00000",
          country: "Iran",
        },
      },
    });
    haptic(20);
    if (selectedAddressId.value === "new" && saveAddressForLater.value) {
      try {
        await saveNewAddress({
          title: newAddressTitle.value || "منزل",
          recipientName: f.value.name.trim(),
          recipientPhone: f.value.phone.trim(),
          city: f.value.city,
          line1: f.value.addr.trim(),
          zip: f.value.zip.trim(),
          isDefault: addresses.value.length === 0,
        });
      } catch {}
    }
    if (d?.number && typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("vapora.my_orders");
        const list: string[] = raw ? JSON.parse(raw) : [];
        if (!list.includes(d.number)) {
          list.unshift(d.number);
          localStorage.setItem("vapora.my_orders", JSON.stringify(list.slice(0, 30)));
        }
      } catch {}
    }
    clear();
    await release();
    if (d.paymentUrl) {
      await navigateTo(d.paymentUrl);
      return;
    }
    done.value = d.number;
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0 });
    }
  } catch (e2: any) {
    err.value = e2?.data?.message || e2?.message || "خطا در ثبت سفارش";
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
                  تحویل‌گیرنده: <strong class="text-snow">{{ f.name }}</strong> ({{ f.phone }})
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
                  <span class="mb-1 block text-[11.5px] font-bold text-dim">نام و نام خانوادگی گیرنده *</span>
                  <input v-model="f.name" class="input" placeholder="مثلاً آرمان رضایی" required />
                </label>
                <label class="block">
                  <span class="mb-1 block text-[11.5px] font-bold text-dim">شماره موبایل گیرنده *</span>
                  <input v-model="f.phone" class="input" dir="ltr" inputmode="tel" placeholder="0912 345 6789" required />
                </label>
                <label class="block">
                  <span class="mb-1 block text-[11.5px] font-bold text-dim">شهر مقصد *</span>
                  <select v-model="f.city" class="input">
                    <option v-for="c in ['تهران', 'کرج', 'شیراز', 'اصفهان', 'مشهد', 'تبریز', 'رشت', 'اهواز', 'یزد', 'کرمان', 'قم', 'ساری']" :key="c">{{ c }}</option>
                  </select>
                </label>
                <label class="block">
                  <span class="mb-1 block text-[11.5px] font-bold text-dim">کد پستی ۱۰ رقمی</span>
                  <input v-model="f.zip" class="input" dir="ltr" placeholder="مثلاً 1458963251" />
                </label>
                <label class="block sm:col-span-2">
                  <span class="mb-1 block text-[11.5px] font-bold text-dim">نشانی کامل پستی (خیابان، پلاک، واحد) *</span>
                  <input v-model="f.addr" class="input" placeholder="خیابان اصلی، کوچه، پلاک، زنگ یا واحد" required />
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
            :disabled="busy || hasOutOfStockItems"
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
