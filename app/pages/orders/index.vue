<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import type { OrderView } from "~/types";
import { money, haptic } from "~/utils/vape";
import { formatDateFa } from "~/utils/vapeAcct";
import { useAuth } from "~/composables/useAuth";
import {
  TruckIcon,
  SearchIcon,
  ShieldIcon,
  ZapIcon,
  ArrowLeftIcon,
  CheckIcon,
} from "~/components/vapor/VIcons";

useSeoMeta({
  title: "سفارش‌های من | پیگیری و فاکتورها",
  description: "مشاهده وضعیت، پیگیری زنده مرسوله و دریافت فاکتور رسمی سفارش‌های ثبت‌شده",
});

const { user, isLoggedIn, openAuth } = useAuth();
const orders = ref<OrderView[]>([]);
const loading = ref(false);
const activeTab = ref<"all" | "active" | "delivered" | "unpaid">("all");
const searchQuery = ref("");
const copiedNumber = ref<string | null>(null);

const fetchOrders = async () => {
  loading.value = true;
  try {
    let localNumbers: string[] = [];
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("vapora.my_orders");
        if (raw) localNumbers = JSON.parse(raw);
      } catch {}
    }

    const queryParams: Record<string, string> = {};
    if (user.value?.email) queryParams.email = user.value.email;
    if (user.value?.phone) queryParams.phone = user.value.phone;
    if (localNumbers.length > 0) queryParams.numbers = localNumbers.join(",");

    // If neither user nor local numbers, fetch empty
    if (!queryParams.email && !queryParams.phone && !queryParams.numbers) {
      orders.value = [];
      return;
    }

    const data = await $fetch<OrderView[]>("/api/orders", {
      query: queryParams,
    });
    orders.value = Array.isArray(data) ? data : [];
  } catch {
    orders.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchOrders();
});

watch(
  () => user.value?.email,
  () => {
    fetchOrders();
  }
);

const activeOrders = computed(() =>
  orders.value.filter((o) => ["processing", "shipped", "pending"].includes(o.status))
);

const deliveredOrders = computed(() =>
  orders.value.filter((o) => o.status === "delivered")
);

const unpaidOrders = computed(() =>
  orders.value.filter((o) => o.paymentStatus !== "paid")
);

const filteredOrders = computed(() => {
  let list = orders.value;
  if (activeTab.value === "active") list = activeOrders.value;
  else if (activeTab.value === "delivered") list = deliveredOrders.value;
  else if (activeTab.value === "unpaid") list = unpaidOrders.value;

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase();
    list = list.filter(
      (o) =>
        o.number.toLowerCase().includes(q) ||
        (o.trackingCode && o.trackingCode.toLowerCase().includes(q)) ||
        (o.phone && o.phone.includes(q)) ||
        o.items.some((it) => it.name.toLowerCase().includes(q))
    );
  }
  return list;
});

const labelFa: Record<string, { label: string; bg: string; text: string; border: string }> = {
  pending: { label: "در انتظار پرداخت", bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30" },
  processing: { label: "در حال آماده‌سازی در انبار", bg: "bg-vio/15", text: "text-vio", border: "border-vio/30" },
  shipped: { label: "تحویل به ناوگان ارسال", bg: "bg-cyan-500/15", text: "text-cyan-400", border: "border-cyan-500/30" },
  delivered: { label: "تحویل داده شد ✓", bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30" },
  refunded: { label: "مرجوع شده", bg: "bg-blush/15", text: "text-blush", border: "border-blush/30" },
};

const copyText = (val: string) => {
  if (!val || typeof navigator === "undefined") return;
  navigator.clipboard?.writeText(val);
  copiedNumber.value = val;
  haptic(10);
  setTimeout(() => {
    if (copiedNumber.value === val) copiedNumber.value = null;
  }, 2200);
};
</script>

<template>
  <div class="wrap py-8 sm:py-10">
    <!-- مسیر ناوبری بالا -->
    <div class="mb-5 flex items-center justify-between">
      <NuxtLink to="/account" class="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-dim hover:text-snow">
        <ArrowLeftIcon :size="15" /> بازگشت به حساب کاربری
      </NuxtLink>
      <NuxtLink to="/shop" class="text-[12px] font-bold text-vio hover:underline">
        رفتن به فروشگاه ↗
      </NuxtLink>
    </div>

    <!-- سربرگ اصلی صفحه سفارش‌ها -->
    <div class="card-g relative overflow-hidden rounded-[26px] p-6 sm:p-8 border border-white/12 shadow-2xl mb-8">
      <div class="pointer-events-none absolute -top-16 left-1/4 h-48 w-80 rounded-full bg-vio/15 blur-3xl" />
      <div class="relative flex flex-wrap items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-vio to-ice text-[22px] text-ink shadow-lg">
              📦
            </span>
            <div>
              <h1 class="text-[22px] font-black text-snow">سفارش‌های من</h1>
              <p class="text-[12px] text-mist mt-0.5">
                پیگیری زنده وضعیت ارسال مرسوله، صدور فاکتور رسمی و پرداخت فاکتورهای معوقه
              </p>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            type="button"
            class="pressable flex items-center gap-1.5 rounded-xl border border-white/12 bg-white/5 px-4 py-2.5 text-[12px] font-bold text-snow hover:bg-white/10 cursor-pointer"
            @click="fetchOrders"
          >
            <span>🔄 بروزرسانی</span>
          </button>
          <NuxtLink
            to="/account?tab=addresses"
            class="pressable flex items-center gap-1.5 rounded-xl border border-vio/40 bg-vio/10 px-4 py-2.5 text-[12px] font-bold text-vio hover:bg-vio/20"
          >
            <span>📍 دفترچه نشانی‌ها</span>
          </NuxtLink>
        </div>
      </div>

      <!-- ۳ کارت آمار سفارشات -->
      <div class="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5">
        <div class="rounded-xl bg-white/2 p-3 text-center border border-white/6">
          <p class="text-[18px] font-black text-snow tnum">{{ orders.length }}</p>
          <p class="text-[10.5px] font-bold text-dim mt-0.5">کل سفارش‌ها</p>
        </div>
        <div class="rounded-xl bg-white/2 p-3 text-center border border-white/6">
          <p class="text-[18px] font-black text-ice tnum">{{ activeOrders.length }}</p>
          <p class="text-[10.5px] font-bold text-dim mt-0.5">در جریان ارسال</p>
        </div>
        <div class="rounded-xl bg-white/2 p-3 text-center border border-white/6">
          <p class="text-[18px] font-black text-emerald-400 tnum">{{ deliveredOrders.length }}</p>
          <p class="text-[10.5px] font-bold text-dim mt-0.5">تحویل شده</p>
        </div>
      </div>
    </div>

    <!-- جعبه جستجوی سریع سفارش -->
    <div class="mb-6 flex flex-wrap items-center gap-3">
      <div class="relative flex-1 min-w-[260px]">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="جستجو با شماره سفارش (مثلاً VPR-1006)، کد رهگیری یا نام کالا..."
          class="input h-12 pr-11 text-[13px]"
        />
        <SearchIcon :size="17" class="absolute right-4 top-1/2 -translate-y-1/2 text-mist pointer-events-none" />
        <button
          v-if="searchQuery"
          type="button"
          class="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-dim hover:text-snow cursor-pointer"
          @click="searchQuery = ''"
        >
          ✕
        </button>
      </div>

      <!-- تب‌های وضعیت سفارش -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1" role="tablist">
        <button
          type="button"
          class="pressable whitespace-nowrap rounded-xl px-3.5 py-2 text-[12px] font-bold transition-all cursor-pointer"
          :class="[
            activeTab === 'all'
              ? 'bg-gradient-to-l from-vio to-ice text-ink font-black glow-v'
              : 'border border-white/10 bg-white/4 text-mist hover:text-snow',
          ]"
          @click="activeTab = 'all'"
        >
          همه ({{ orders.length }})
        </button>
        <button
          type="button"
          class="pressable whitespace-nowrap rounded-xl px-3.5 py-2 text-[12px] font-bold transition-all cursor-pointer"
          :class="[
            activeTab === 'active'
              ? 'bg-gradient-to-l from-vio to-ice text-ink font-black glow-v'
              : 'border border-white/10 bg-white/4 text-mist hover:text-snow',
          ]"
          @click="activeTab = 'active'"
        >
          در جریان ارسال ({{ activeOrders.length }})
        </button>
        <button
          type="button"
          class="pressable whitespace-nowrap rounded-xl px-3.5 py-2 text-[12px] font-bold transition-all cursor-pointer"
          :class="[
            activeTab === 'delivered'
              ? 'bg-gradient-to-l from-vio to-ice text-ink font-black glow-v'
              : 'border border-white/10 bg-white/4 text-mist hover:text-snow',
          ]"
          @click="activeTab = 'delivered'"
        >
          تحویل شده ({{ deliveredOrders.length }})
        </button>
        <button
          v-if="unpaidOrders.length > 0"
          type="button"
          class="pressable whitespace-nowrap rounded-xl px-3.5 py-2 text-[12px] font-bold transition-all cursor-pointer"
          :class="[
            activeTab === 'unpaid'
              ? 'bg-gradient-to-l from-amber-500 to-amber-300 text-ink font-black'
              : 'border border-amber-500/30 bg-amber-500/10 text-amber-400',
          ]"
          @click="activeTab = 'unpaid'"
        >
          در انتظار پرداخت ({{ unpaidOrders.length }})
        </button>
      </div>
    </div>

    <!-- حالت در حال بارگذاری -->
    <div v-if="loading" class="card-g rounded-[22px] p-12 text-center text-mist border border-white/10">
      <div class="mx-auto h-9 w-9 rounded-full border-2 border-vio border-t-transparent animate-spin mb-3" />
      در حال دریافت لیست سفارش‌ها از پایگاه داده...
    </div>

    <!-- حالت عدم وجود سفارش -->
    <div v-else-if="filteredOrders.length === 0" class="card-g rounded-[24px] p-12 text-center border border-white/10">
      <p class="text-6xl">📦</p>
      <p class="mt-4 text-[16px] font-extrabold text-snow">سفارشی در این بخش یافت نشد</p>
      <p class="mt-1.5 text-[12.5px] text-dim max-w-md mx-auto">
        {{ searchQuery ? 'نتیجه‌ای برای جستجوی شما پیدا نشد. لطفاً شماره سفارش یا کد رهگیری را بررسی کنید.' : 'هنوز سفارشی با این وضعیت ثبت نکرده‌اید. می‌توانید جدیدترین محصولات را در فروشگاه مشاهده کنید.' }}
      </p>
      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <NuxtLink
          to="/shop"
          class="pressable inline-flex items-center gap-2 rounded-2xl bg-gradient-to-l from-vio to-ice px-7 py-3 text-[13.5px] font-extrabold text-ink glow-v"
        >
          مشاهده محصولات فروشگاه
        </NuxtLink>
        <button
          v-if="!isLoggedIn"
          type="button"
          class="pressable inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-[13px] font-bold text-snow hover:bg-white/10 cursor-pointer"
          @click="openAuth('login')"
        >
          ورود به حساب کاربری
        </button>
      </div>
    </div>

    <!-- فهرست سفارش‌ها -->
    <ul v-else class="space-y-4" role="list">
      <li
        v-for="o in filteredOrders"
        :key="o.id || o.number"
        class="card-g rounded-[24px] p-5 sm:p-6 border border-white/10 hover:border-white/20 transition-all duration-300 space-y-4"
      >
        <!-- ردیف بالای هر سفارش -->
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 pb-4">
          <div class="flex flex-wrap items-center gap-3">
            <span class="font-mono text-[14px] font-black text-snow" dir="ltr">
              #{{ o.number }}
            </span>
            <span class="text-[11.5px] text-dim">
              {{ formatDateFa(o.createdAt) }}
            </span>
            <span
              class="rounded-xl border px-2.5 py-1 text-[11px] font-extrabold flex items-center gap-1.5"
              :class="[labelFa[o.status]?.bg || 'bg-white/10', labelFa[o.status]?.text || 'text-snow', labelFa[o.status]?.border || 'border-white/10']"
            >
              <span class="h-1.5 w-1.5 rounded-full bg-current" />
              {{ labelFa[o.status]?.label || o.status }}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <!-- وضعیت پرداخت -->
            <span
              v-if="o.paymentStatus === 'paid'"
              class="rounded-lg bg-emerald-500/12 border border-emerald-500/25 px-2.5 py-1 text-[11px] font-bold text-emerald-400 flex items-center gap-1"
            >
              <CheckIcon :size="12" /> پرداخت شده
            </span>
            <span
              v-else-if="o.paymentGateway === 'cod'"
              class="rounded-lg bg-ice/15 border border-ice/25 px-2.5 py-1 text-[11px] font-bold text-ice"
            >
              پرداخت در محل
            </span>
            <span
              v-else
              class="rounded-lg bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 text-[11px] font-bold text-amber-300"
            >
              در انتظار پرداخت آنلاین
            </span>
          </div>
        </div>

        <!-- اقلام سفارش -->
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="it in o.items"
            :key="it.name"
            class="flex items-center gap-3 rounded-2xl border border-white/6 bg-white/3 p-2.5"
          >
            <img
              v-if="it.image"
              :src="it.image"
              :alt="it.name"
              class="h-12 w-12 rounded-xl object-contain bg-white/5 p-1 border border-white/8 shrink-0"
            />
            <div class="min-w-0 flex-1">
              <p class="text-[12.5px] font-bold text-snow truncate" dir="ltr">{{ it.name }}</p>
              <div class="flex items-center gap-2 mt-0.5 text-[11px] text-mist">
                <span v-if="it.color" class="rounded-md bg-ice/15 px-1.5 py-0.2 text-[10px] font-bold text-ice">
                  رنگ: {{ it.color }}
                </span>
                <span class="tnum">{{ it.qty }} عدد</span>
                <span class="text-dim">·</span>
                <span class="font-bold text-snow tnum">{{ money(it.price * it.qty) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- نوار اطلاعات تحویل و رهگیری -->
        <div class="rounded-2xl border border-white/8 bg-white/2 p-3.5 flex flex-wrap items-center justify-between gap-3 text-[12px]">
          <div class="flex items-center gap-2 text-mist">
            <TruckIcon :size="16" class="text-emerald-400 shrink-0" />
            <span>ناوگان:</span>
            <strong class="text-snow font-bold">{{ o.courier || 'پیک اکسپرس تهران / پست پیشتاز' }}</strong>
          </div>

          <div v-if="o.trackingCode" class="flex items-center gap-2">
            <span class="text-dim">کد رهگیری پستی:</span>
            <span dir="ltr" class="font-mono font-bold text-ice bg-ice/10 px-2 py-0.5 rounded-lg border border-ice/20">
              {{ o.trackingCode }}
            </span>
            <button
              type="button"
              class="text-[11px] text-dim hover:text-ice cursor-pointer"
              @click="copyText(o.trackingCode || '')"
            >
              {{ copiedNumber === o.trackingCode ? 'کپی شد ✓' : 'کپی' }}
            </button>
          </div>

          <div class="flex items-center gap-1 mr-auto font-bold">
            <span class="text-dim">مبلغ کل فاکتور:</span>
            <span class="text-[14px] font-black text-grad tnum">{{ money(o.total) }}</span>
          </div>
        </div>

        <!-- دکمه‌های اقدام مستقیم سفارش -->
        <div class="flex flex-wrap items-center justify-end gap-2 pt-1">
          <NuxtLink
            v-if="o.paymentStatus !== 'paid' && o.paymentGateway !== 'cod'"
            :to="`/payment/gateway?order=${o.number}`"
            class="pressable h-10 px-4 rounded-xl bg-gradient-to-l from-emerald-500 to-teal-400 text-ink text-[12px] font-black flex items-center gap-1.5 glow-g"
          >
            <ZapIcon :size="15" :sw="2.4" /> پرداخت آنلاین
          </NuxtLink>
          <NuxtLink
            :to="`/track?order=${o.number}`"
            class="pressable h-10 px-4 rounded-xl border border-white/12 bg-white/6 hover:bg-white/12 text-snow text-[12px] font-bold flex items-center gap-1.5 transition"
          >
            <TruckIcon :size="15" /> رهگیری زنده مرسوله
          </NuxtLink>
          <NuxtLink
            :to="`/order/${o.number}`"
            class="pressable h-10 px-4 rounded-xl border border-vio/40 bg-vio/12 hover:bg-vio/20 text-vio text-[12px] font-bold flex items-center gap-1.5 transition"
          >
            🧾 فاکتور رسمی و چاپ
          </NuxtLink>
        </div>
      </li>
    </ul>

    <!-- ضمانت اصالت -->
    <div class="card-g mt-8 rounded-[24px] p-6 border border-white/10">
      <h3 class="flex items-center gap-2 text-[15px] font-extrabold text-snow">
        <ShieldIcon :size="19" class="text-neon" /> ضمانت ۱۰۰٪ اصالت و بازگشت وجه ویپ‌لب
      </h3>
      <p class="mt-2 text-[12px] leading-7 text-dim">
        تمامی سفارش‌های ثبت‌شده دارای بارکد اصالت‌سنجی رسمی هستند. در صورت نیاز به هماهنگی تغییر ساعت ارسال یا مشخصات آدرس می‌توانید با پشتیبانی تماس بگیرید.
      </p>
    </div>
  </div>
</template>
