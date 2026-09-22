<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { money, haptic } from "~/utils/vape";
import type { OrderView } from "~/types";
import {
  ShieldIcon,
  CheckIcon,
  DropletIcon,
  ChevronLeftIcon,
} from "~/components/vapor/VIcons";

useSeoMeta({
  title: "درگاه امن پرداخت شاپرک · ویپ‌لب",
  robots: "noindex, nofollow",
});

const route = useRoute();
const router = useRouter();

const orderNumber = computed(() => String(route.query.order || ""));
const order = ref<OrderView | null>(null);
const loading = ref(true);
const processing = ref(false);
const errorMsg = ref("");

// Card form state
const cardNumber = ref("6037-9918-4521-8890");
const cvv2 = ref("742");
const expMonth = ref("08");
const expYear = ref("06");
const dynamicPin = ref("");
const pinRequested = ref(false);
const pinCountdown = ref(120);
let pinTimer: any = null;

// Shaparak 10-minute countdown
const timeLeft = ref(600); // 10 minutes
let sessionTimer: any = null;

const formatTime = (secs: number) => {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

// Preset test cards
const testCards = [
  { name: "بانک سامان", num: "6219-8610-3341-9012", cvv: "452", m: "11", y: "07", bank: "saman" },
  { name: "بانک ملت", num: "6104-3378-5520-1490", cvv: "891", m: "04", y: "06", bank: "mellat" },
  { name: "بانک ملی", num: "6037-9918-4521-8890", cvv: "742", m: "08", y: "06", bank: "melli" },
];

const selectCard = (c: typeof testCards[0]) => {
  haptic(10);
  cardNumber.value = c.num;
  cvv2.value = c.cvv;
  expMonth.value = c.m;
  expYear.value = c.y;
};

const requestDynamicPin = () => {
  haptic(15);
  pinRequested.value = true;
  pinCountdown.value = 120;
  // Generate random 6-digit pin automatically for user convenience
  dynamicPin.value = Math.floor(100000 + Math.random() * 900000).toString();

  if (pinTimer) clearInterval(pinTimer);
  pinTimer = setInterval(() => {
    if (pinCountdown.value > 0) {
      pinCountdown.value--;
    } else {
      clearInterval(pinTimer);
      pinRequested.value = false;
    }
  }, 1000);
};

const fetchOrder = async () => {
  if (!orderNumber.value) {
    errorMsg.value = "شماره سفارش مشخص نشده است.";
    loading.value = false;
    return;
  }
  try {
    const data = await $fetch<OrderView>(`/api/orders?number=${orderNumber.value}`);
    order.value = data;
  } catch {
    errorMsg.value = "اطلاعات سفارش در سیستم یافت نشد.";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchOrder();
  sessionTimer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(sessionTimer);
      handlePayment('failed');
    }
  }, 1000);
});

onUnmounted(() => {
  if (sessionTimer) clearInterval(sessionTimer);
  if (pinTimer) clearInterval(pinTimer);
});

const handlePayment = async (status: "success" | "failed") => {
  if (processing.value) return;
  haptic(25);
  processing.value = true;

  try {
    const res = await $fetch<{ ok: boolean; redirectUrl: string; message?: string }>("/api/payment/verify", {
      method: "POST",
      body: {
        orderNumber: orderNumber.value,
        status,
        gateway: "shaparak_sim",
      },
    });
    if (res?.redirectUrl) {
      router.push(res.redirectUrl);
    } else {
      router.push(`/order/${orderNumber.value}?status=${status}`);
    }
  } catch (err: any) {
    errorMsg.value = err?.data?.message || "خطا در برقراری ارتباط با درگاه پرداخت";
    processing.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#07090e] text-snow pb-12 selection:bg-vio selection:text-white" dir="rtl">
    <!-- هدر رسمی شاپرک و درگاه امن -->
    <header class="border-b border-white/10 bg-[#0d111a]/95 backdrop-blur-md sticky top-0 z-30">
      <div class="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-lg shadow-amber-500/20">
            <div class="w-full h-full bg-[#0d111a] rounded-[10px] grid place-items-center">
              <span class="font-black text-[13px] text-amber-400">شاپرک</span>
            </div>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-[14px] font-extrabold text-snow">درگاه پرداخت اینترنتی به‌پرداخت</h1>
              <span class="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10.5px] font-bold text-emerald-400 border border-emerald-500/20">
                <ShieldIcon :size="12" />
                اتصال امن SSL
              </span>
            </div>
            <p class="text-[11px] text-mist">شبکه الکترونیکی پرداخت کارت (شاپرک) · شبیه‌ساز رسمی ویپ‌لب</p>
          </div>
        </div>

        <!-- تایمر معکوس -->
        <div class="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-amber-300">
          <span class="text-[11px] font-bold">زمان باقی‌مانده:</span>
          <span class="font-mono text-[14px] font-black tnum" dir="ltr">{{ formatTime(timeLeft) }}</span>
        </div>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-4 pt-6">
      <!-- حالت در حال بارگذاری -->
      <div v-if="loading" class="py-20 text-center">
        <div class="mx-auto h-12 w-12 rounded-full border-2 border-vio border-t-transparent animate-spin" />
        <p class="mt-4 text-[13px] text-mist">در حال فراخوانی اطلاعات فاکتور...</p>
      </div>

      <!-- خطا -->
      <div v-else-if="errorMsg && !order" class="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center">
        <p class="text-[14px] font-bold text-rose-400">{{ errorMsg }}</p>
        <NuxtLink to="/shop" class="mt-4 inline-block rounded-xl bg-white/10 px-5 py-2 text-[12.5px] font-bold text-snow">
          بازگشت به فروشگاه
        </NuxtLink>
      </div>

      <!-- فرم پرداخت اصلی شاپرک -->
      <div v-else class="space-y-5">
        <!-- کارت خلاصه پذیرنده و مبلغ -->
        <div class="rounded-2xl border border-white/10 bg-gradient-to-b from-[#121724] to-[#0c0f17] p-5 shadow-2xl">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-[12.5px]">
            <div>
              <span class="text-mist block text-[11px] mb-0.5">پذیرنده اینترنتی</span>
              <strong class="text-snow font-extrabold text-[13.5px] flex items-center gap-1.5">
                <span class="h-2 w-2 rounded-full bg-neon animate-pulse" />
                فروشگاه تخصصی ویپ‌لب (VAPELAB)
              </strong>
            </div>
            <div>
              <span class="text-mist block text-[11px] mb-0.5">شماره سفارش</span>
              <strong class="font-mono text-vio font-bold text-[13px]" dir="ltr">{{ order?.number }}</strong>
            </div>
            <div class="md:text-left">
              <span class="text-mist block text-[11px] mb-0.5">مبلغ کل قابل پرداخت</span>
              <div class="text-[18px] font-black text-neon tnum">
                {{ money(order?.total || 0) }}
                <span class="text-[11px] font-normal text-mist mr-1">تومان</span>
              </div>
            </div>
          </div>
        </div>

        <!-- کارت‌های آزمایشی سریع -->
        <div class="rounded-2xl border border-white/10 bg-[#0e131d] p-4">
          <div class="flex items-center justify-between mb-2.5">
            <span class="text-[12px] font-bold text-amber-300 flex items-center gap-1.5">
              ⚡ کارت‌های شتاب تستی (جهت سهولت تست):
            </span>
            <span class="text-[10.5px] text-dim">روی هر کارت کلیک کنید تا خودکار فرم پر شود</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              v-for="c in testCards"
              :key="c.name"
              type="button"
              class="flex items-center justify-between p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-vio/40 text-right transition cursor-pointer"
              @click="selectCard(c)"
            >
              <div>
                <strong class="text-[12px] block text-snow">{{ c.name }}</strong>
                <span class="font-mono text-[10.5px] text-mist" dir="ltr">{{ c.num }}</span>
              </div>
              <span class="text-[10px] text-vio font-bold bg-vio/10 px-2 py-0.5 rounded-md">انتخاب</span>
            </button>
          </div>
        </div>

        <!-- فرم کارت بانکی -->
        <div class="rounded-2xl border border-white/10 bg-[#0e131d] p-6 shadow-xl space-y-4">
          <h2 class="text-[14px] font-black text-snow border-b border-white/10 pb-3 flex items-center gap-2">
            <span class="grid h-6 w-6 place-items-center rounded-lg bg-vio/20 text-vio text-[12px]">💳</span>
            اطلاعات کارت بانکی خریدار
          </h2>

          <!-- شماره کارت -->
          <div>
            <label class="block text-[12px] font-bold text-mist mb-1.5">شماره کارت ۱۶ رقمی</label>
            <div class="relative">
              <input
                v-model="cardNumber"
                type="text"
                dir="ltr"
                maxlength="19"
                placeholder="xxxx-xxxx-xxxx-xxxx"
                class="w-full h-12 rounded-xl border border-white/15 bg-black/40 px-4 font-mono text-[15px] font-bold tracking-widest text-snow focus:border-vio focus:outline-none"
              />
              <span class="absolute left-3 top-3 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                شتاب تایید شده
              </span>
            </div>
          </div>

          <!-- CVV2 و انقضا -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-[12px] font-bold text-mist mb-1.5">کد شناسایی دوم (CVV2)</label>
              <input
                v-model="cvv2"
                type="password"
                maxlength="4"
                dir="ltr"
                placeholder="•••"
                class="w-full h-12 rounded-xl border border-white/15 bg-black/40 px-4 font-mono text-[15px] font-bold text-snow focus:border-vio focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-[12px] font-bold text-mist mb-1.5">تاریخ انقضای کارت</label>
              <div class="flex items-center gap-2" dir="ltr">
                <input
                  v-model="expYear"
                  type="text"
                  maxlength="2"
                  placeholder="سال (06)"
                  class="w-1/2 h-12 text-center rounded-xl border border-white/15 bg-black/40 px-2 font-mono text-[14px] font-bold text-snow focus:border-vio focus:outline-none"
                />
                <span class="text-mist font-bold">/</span>
                <input
                  v-model="expMonth"
                  type="text"
                  maxlength="2"
                  placeholder="ماه (08)"
                  class="w-1/2 h-12 text-center rounded-xl border border-white/15 bg-black/40 px-2 font-mono text-[14px] font-bold text-snow focus:border-vio focus:outline-none"
                />
              </div>
            </div>
          </div>

          <!-- رمز دوم پویا -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="text-[12px] font-bold text-mist">رمز دوم اینترنتی (رمز پویا)</label>
              <button
                type="button"
                :disabled="pinRequested && pinCountdown > 0"
                class="text-[11px] font-bold text-vio hover:text-ice transition disabled:opacity-50 cursor-pointer"
                @click="requestDynamicPin"
              >
                {{ pinRequested && pinCountdown > 0 ? `ارسال مجدد تا (${pinCountdown} ثانیه)` : "دریافت خودکار رمز پویا ⚡" }}
              </button>
            </div>
            <div class="relative">
              <input
                v-model="dynamicPin"
                type="text"
                dir="ltr"
                placeholder="کد ۶ رقمی رمز پویا"
                class="w-full h-12 rounded-xl border border-white/15 bg-black/40 px-4 font-mono text-[15px] font-bold tracking-widest text-snow focus:border-vio focus:outline-none"
              />
              <button
                v-if="!dynamicPin"
                type="button"
                class="absolute left-2 top-2 h-8 px-3 rounded-lg bg-vio/20 text-vio text-[11px] font-bold hover:bg-vio/30 transition cursor-pointer"
                @click="requestDynamicPin"
              >
                دریافت رمز
              </button>
            </div>
          </div>

          <!-- دکمه‌های اقدام: پرداخت موفق و انصراف -->
          <div class="pt-4 border-t border-white/10 space-y-3">
            <button
              type="button"
              :disabled="processing"
              class="w-full h-13 rounded-2xl bg-gradient-to-l from-emerald-500 to-teal-400 font-extrabold text-[15px] text-ink shadow-lg shadow-emerald-500/20 hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              @click="handlePayment('success')"
            >
              <CheckIcon :size="20" :sw="2.6" />
              <span>{{ processing ? "در حال پردازش تراکنش..." : "تایید و پرداخت موفقیت‌آمیز (تست Success)" }}</span>
            </button>

            <button
              type="button"
              :disabled="processing"
              class="w-full h-12 rounded-2xl border border-rose-500/30 bg-rose-500/10 font-bold text-[13px] text-rose-400 hover:bg-rose-500/20 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              @click="handlePayment('failed')"
            >
              <span>انصراف از پرداخت / شبیه‌سازی خطای تراکنش بانکی (تست Fail)</span>
            </button>
          </div>
        </div>

        <!-- پیام راهنما -->
        <p class="text-center text-[11px] text-dim leading-5">
          🔒 تمامی فرآیند پرداخت در محیط شبیه‌ساز امن شاپرک اختصاصی ویپ‌لب انجام می‌شود و هیچ اطلاعات حساسی در سرور ذخیره نمی‌گردد.
        </p>
      </div>
    </main>
  </div>
</template>
