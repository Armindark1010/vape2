<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { OrderView } from "~/types";
import { money, haptic } from "~/utils/vape";
import {
  CheckIcon,
  ShieldIcon,
  SearchIcon,
  DropletIcon,
  ChevronLeftIcon,
  ArrowLeftIcon,
} from "~/components/vapor/VIcons";

useSeoMeta({
  title: "رهگیری سفارشات · فروشگاه ویپ‌لب",
  description: "سامانه هوشمند استعلام وضعیت ارسال و پیگیری لحظه‌ای مرسوله‌های ویپ‌لب.",
});

const route = useRoute();
const router = useRouter();

const queryInput = ref(String(route.query.order || route.query.q || ""));
const searching = ref(false);
const searched = ref(false);
const order = ref<OrderView | null>(null);
const errorMsg = ref("");

const quickDemos = ["VPR-1006", "VPR-1005", "09121234567"];

// 4-Step Shipping Timeline Definition
const steps = [
  {
    id: 1,
    title: "تایید پرداخت و ثبت نهایی",
    desc: "تراکنش بانکی با موفقیت ثبت و سفارش تایید گردید.",
    icon: "💳",
  },
  {
    id: 2,
    title: "کنترل کیفیت و بسته‌بندی",
    desc: "بررسی هولوگرام اصالت کالا و بسته‌بندی ضدضربه در انبار ویپ‌لب.",
    icon: "📦",
  },
  {
    id: 3,
    title: "تحویل به ناوگان ارسال",
    desc: "مرسوله تحویل سفیر اختصاصی تهران یا شرکت پست گردید.",
    icon: "🚚",
  },
  {
    id: 4,
    title: "تحویل نهایی به خریدار",
    desc: "بسته با موفقیت به نشانی مقصد تحویل داده شد.",
    icon: "📍",
  },
];

// Determine active step (1..4) based on order status and payment status
const currentStep = computed(() => {
  if (!order.value) return 1;
  const s = order.value.status;
  if (s === "delivered") return 4;
  if (s === "shipped") return 3;
  if (s === "processing" || order.value.paymentStatus === "paid") return 2;
  return 1;
});

const doSearch = async (val?: string) => {
  const q = (val !== undefined ? val : queryInput.value).trim();
  if (!q) {
    errorMsg.value = "لطفاً شماره سفارش یا شماره تماس خود را وارد کنید.";
    return;
  }
  haptic(15);
  searching.value = true;
  searched.value = true;
  errorMsg.value = "";
  order.value = null;

  try {
    const res = await $fetch<{ ok: boolean; order: OrderView }>(`/api/orders/track?q=${encodeURIComponent(q)}`);
    if (res?.order) {
      order.value = res.order;
      queryInput.value = res.order.number;
    }
  } catch (err: any) {
    errorMsg.value = err?.data?.message || "سفارشی با این مشخصات یافت نشد.";
  } finally {
    searching.value = false;
  }
};

onMounted(() => {
  if (queryInput.value) {
    doSearch(queryInput.value);
  }
});

const formatDate = (isoStr?: string) => {
  if (!isoStr) return "در حال آماده‌سازی";
  try {
    const d = new Date(isoStr);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return isoStr;
  }
};
</script>

<template>
  <div class="wrap pt-8 pb-16 min-h-screen text-snow selection:bg-vio selection:text-white" dir="rtl">
    <!-- سربرگ سامانه رهگیری -->
    <header class="max-w-2xl mx-auto text-center">
      <span class="inline-flex items-center gap-1.5 rounded-full border border-vio/40 bg-vio/10 px-3.5 py-1 text-[12px] font-bold text-vio glow-v">
        <span>⚡ سامانه هوشمند رهگیری مرسولات</span>
      </span>
      <h1 class="mt-4 font-display text-[26px] font-black text-snow sm:text-3xl">
        پیگیری آنلاین سفارشات ویپ‌لب
      </h1>
      <p class="mt-2 text-[13px] text-mist">
        با وارد کردن شماره سفارش (مانند <span dir="ltr" class="font-mono text-vio">VPR-1006</span>) یا شماره تماس، وضعیت لحظه‌ای ارسال بسته خود را مشاهده کنید.
      </p>

      <!-- فرم جستجو -->
      <form class="mt-6 flex items-center gap-2" @submit.prevent="doSearch()">
        <div class="relative flex-1">
          <input
            v-model="queryInput"
            type="text"
            placeholder="شماره سفارش (مثلاً VPR-1006) یا شماره موبایل..."
            class="w-full h-13 rounded-2xl border border-white/15 bg-surface/80 px-4 pl-12 text-[14px] font-bold text-snow placeholder:text-dim focus:border-vio focus:outline-none shadow-xl transition"
          />
          <span class="absolute left-4 top-3.5 text-mist">
            <SearchIcon :size="20" />
          </span>
        </div>
        <button
          type="submit"
          :disabled="searching"
          class="pressable h-13 px-7 rounded-2xl bg-gradient-to-l from-vio to-ice text-ink font-black text-[14px] shadow-lg shadow-vio/25 hover:opacity-95 transition cursor-pointer disabled:opacity-50"
        >
          {{ searching ? "در حال استعلام..." : "پیگیری" }}
        </button>
      </form>

      <!-- برچسب‌های نمونه تستی -->
      <div class="mt-3 flex flex-wrap items-center justify-center gap-2 text-[11px] text-dim">
        <span>سفارشات نمونه تستی:</span>
        <button
          v-for="d in quickDemos"
          :key="d"
          type="button"
          class="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-mist hover:text-snow hover:border-vio/40 transition cursor-pointer font-mono"
          dir="ltr"
          @click="() => { queryInput = d; doSearch(d); }"
        >
          {{ d }}
        </button>
      </div>
    </header>

    <!-- نتیجه استعلام -->
    <main class="max-w-3xl mx-auto mt-10">
      <!-- حالت خطا یا پیدا نشدن -->
      <div v-if="errorMsg" class="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-6 text-center">
        <p class="text-[14px] font-bold text-rose-300">{{ errorMsg }}</p>
        <p class="mt-1 text-[12px] text-mist">لطفاً شماره سفارش را با فاکتور دریافتی مطابقت دهید یا با پشتیبانی در ارتباط باشید.</p>
      </div>

      <!-- کارت نتیجه سفارش پیدا شده -->
      <div v-else-if="order" class="space-y-6">
        <!-- کارت خلاصه وضعیت سفارش -->
        <div class="rounded-[28px] border border-white/10 bg-[#0e131d] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div class="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-vio/15 blur-3xl" />

          <!-- هدر کارت وضعیت -->
          <div class="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <span class="text-[11.5px] text-mist block">وضعیت فعلی سفارش</span>
              <div class="flex items-center gap-2 mt-1">
                <span class="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
                <h2 class="text-[18px] font-black text-snow">
                  {{ order.status === 'delivered' ? 'تحویل شده به مشتری 📍' : order.status === 'shipped' ? 'ارسال شده با ناوگان پستی 🚚' : 'در حال آماده‌سازی و بسته‌بندی 📦' }}
                </h2>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <NuxtLink
                :to="`/order/${order.number}`"
                class="h-10 px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-snow text-[12px] font-bold flex items-center gap-1.5 transition"
              >
                <span>🧾 مشاهده فاکتور رسمی</span>
              </NuxtLink>
            </div>
          </div>

          <!-- استپر / تایم‌لاین ۴ مرحله‌ای فرآیند ارسال -->
          <div class="mt-8">
            <h3 class="text-[13px] font-extrabold text-mist mb-6">روند پیشرفت پردازش و ارسال:</h3>
            <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
              <div
                v-for="(step, idx) in steps"
                :key="step.id"
                class="relative rounded-2xl border p-4 transition-all"
                :class="[
                  step.id <= currentStep
                    ? 'border-emerald-500/40 bg-emerald-950/20 text-snow'
                    : 'border-white/10 bg-white/2 text-dim'
                ]"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="text-[20px]">{{ step.icon }}</span>
                  <span
                    class="h-6 w-6 rounded-full grid place-items-center text-[11px] font-black font-mono"
                    :class="step.id <= currentStep ? 'bg-emerald-500 text-ink' : 'bg-white/10 text-dim'"
                  >
                    {{ step.id <= currentStep ? '✓' : step.id }}
                  </span>
                </div>
                <h4 class="text-[13px] font-bold mb-1" :class="step.id <= currentStep ? 'text-emerald-300' : 'text-mist'">
                  {{ step.title }}
                </h4>
                <p class="text-[11px] leading-4 text-mist opacity-90">{{ step.desc }}</p>
              </div>
            </div>
          </div>

          <!-- مشخصات ناوگان تحویل و کد رهگیری پستی -->
          <div class="mt-6 rounded-2xl border border-white/10 bg-white/4 p-5">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-[12.5px]">
              <div>
                <span class="text-dim text-[11px] block">ناوگان حمل و تحویل:</span>
                <strong class="text-snow font-bold block mt-0.5">{{ order.courier || 'پیک اکسپرس ۲ ساعته ویپ‌لب' }}</strong>
              </div>
              <div>
                <span class="text-dim text-[11px] block">کد رهگیری مرسوله:</span>
                <strong dir="ltr" class="font-mono text-vio text-[14px] font-bold block mt-0.5">
                  {{ order.trackingCode || 'در حال صدور توسط انبار' }}
                </strong>
              </div>
              <div>
                <span class="text-dim text-[11px] block">تاریخ ثبت سفارش:</span>
                <span class="text-snow font-bold block mt-0.5">{{ formatDate(order.createdAt) }}</span>
              </div>
            </div>
          </div>

          <!-- نشانی و اقلام بسته -->
          <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[12px]">
            <!-- آدرس گیرنده -->
            <div class="rounded-2xl border border-white/10 bg-white/2 p-4">
              <span class="text-mist block text-[11px] mb-1">📍 نشانی تحویل مرسوله</span>
              <p class="text-snow font-bold leading-5">
                {{ order.name }} · {{ order.shipping?.city }}، {{ order.shipping?.line1 }}
              </p>
              <span class="text-dim text-[11px] block mt-1">شماره تماس: <span dir="ltr" class="font-mono">{{ order.phone || order.email }}</span></span>
            </div>

            <!-- اقلام موجود در مرسوله -->
            <div class="rounded-2xl border border-white/10 bg-white/2 p-4">
              <span class="text-mist block text-[11px] mb-1">📦 اقلام داخل بسته ({{ order.items.length }} قلم)</span>
              <ul class="space-y-1 text-snow font-bold">
                <li v-for="(it, idx) in order.items" :key="idx" class="flex items-center justify-between">
                  <span class="truncate">{{ it.name }}</span>
                  <span class="text-dim font-mono text-[11px]">{{ it.qty }} عدد</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- باکس پشتیبانی و راهنمایی -->
        <div class="rounded-2xl border border-white/10 bg-surface/60 p-5 flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <span class="h-10 w-10 rounded-xl bg-vio/20 text-vio grid place-items-center text-[18px]">💬</span>
            <div>
              <h4 class="text-[13.5px] font-bold text-snow">نیاز به راهنمایی یا تغییر آدرس دارید؟</h4>
              <p class="text-[11.5px] text-mist">تیم پشتیبانی ویپ‌لب همه روزه آماده پاسخگویی و هماهنگی با سفیران ارسال است.</p>
            </div>
          </div>
          <a
            href="https://t.me/Vapelab_Support"
            target="_blank"
            rel="noopener"
            class="h-10 px-5 rounded-xl bg-white/10 hover:bg-white/15 text-snow text-[12.5px] font-bold flex items-center gap-1.5 transition"
          >
            <span>ارتباط در تلگرام</span>
            <ChevronLeftIcon :size="16" />
          </a>
        </div>
      </div>
    </main>
  </div>
</template>
