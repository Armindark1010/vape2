<script setup lang="ts">
import { computed, watch, ref, onMounted } from "vue";
import type { OrderView } from "~/types";
import { SITE, money, haptic } from "~/utils/vape";
import { formatDateFa } from "~/utils/vapeAcct";
import { useAuth } from "~/composables/useAuth";
import {
  UserIcon,
  CheckIcon,
  ChevronLeftIcon,
  TruckIcon,
  SearchIcon,
  ShieldIcon,
  ZapIcon,
} from "~/components/vapor/VIcons";

import { useAddresses } from "~/composables/useAddresses";

useSeoMeta({
  title: "حساب کاربری و تاریخچه سفارش‌ها",
  robots: "noindex, follow",
});

const route = useRoute();
const { user, isLoggedIn, openAuth, logout } = useAuth();
const { addresses, loading: loadingAddresses, fetchAddresses, addAddress, deleteAddress, setDefault } = useAddresses();

const activeSection = ref<"orders" | "addresses">("orders");
const orders = ref<OrderView[]>([]);
const loadingOrders = ref(false);
const activeTab = ref<"all" | "active" | "delivered" | "unpaid">("all");
const quickTrackQuery = ref("");
const copiedNumber = ref<string | null>(null);

// مدیریت فرم افزودن نشانی
const showNewAddressForm = ref(false);
const newAddr = ref({
  title: "منزل",
  recipientName: user.value?.name || "",
  recipientPhone: user.value?.phone || "",
  city: "تهران",
  line1: "",
  line2: "",
  zip: "",
  isDefault: false,
});
const savingAddress = ref(false);
const addressMsg = ref("");

const handleSaveAddress = async () => {
  if (!newAddr.value.recipientName || !newAddr.value.recipientPhone || !newAddr.value.city || !newAddr.value.line1) {
    addressMsg.value = "نام گیرنده، شماره تماس، شهر و نشانی کامل الزامی است.";
    return;
  }
  savingAddress.value = true;
  addressMsg.value = "";
  try {
    await addAddress({
      title: newAddr.value.title.trim() || "منزل",
      recipientName: newAddr.value.recipientName.trim(),
      recipientPhone: newAddr.value.recipientPhone.trim(),
      city: newAddr.value.city,
      line1: newAddr.value.line1.trim(),
      line2: newAddr.value.line2.trim() || undefined,
      zip: newAddr.value.zip.trim() || undefined,
      isDefault: newAddr.value.isDefault || addresses.value.length === 0,
    });
    showNewAddressForm.value = false;
    newAddr.value.line1 = "";
    newAddr.value.line2 = "";
    newAddr.value.zip = "";
    addressMsg.value = "نشانی جدید با موفقیت ثبت شد.";
    haptic(15);
  } catch (err: any) {
    addressMsg.value = err?.message || "خطا در ذخیره نشانی";
  } finally {
    savingAddress.value = false;
  }
};

const handleSetDefault = async (id: number) => {
  await setDefault(id);
  haptic(15);
};

const handleDeleteAddress = async (id: number) => {
  if (confirm("آیا از حذف این نشانی مطمئن هستید؟")) {
    await deleteAddress(id);
    haptic(15);
  }
};

const fetchOrders = async () => {
  loadingOrders.value = true;
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
    loadingOrders.value = false;
  }
};

onMounted(() => {
  if (route.query.tab === "addresses") {
    activeSection.value = "addresses";
  }
  fetchOrders();
  fetchAddresses();
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
  if (activeTab.value === "active") return activeOrders.value;
  if (activeTab.value === "delivered") return deliveredOrders.value;
  if (activeTab.value === "unpaid") return unpaidOrders.value;
  return orders.value;
});

const totalSpent = computed(() =>
  orders.value
    .filter((o) => o.paymentStatus === "paid" || o.paymentGateway === "cod")
    .reduce((s, o) => s + o.total, 0)
);

const labelFa: Record<string, { label: string; bg: string; text: string; border: string }> = {
  pending: { label: "در انتظار پرداخت", bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30" },
  processing: { label: "در حال آماده‌سازی در انبار", bg: "bg-vio/15", text: "text-vio", border: "border-vio/30" },
  shipped: { label: "تحویل به ناوگان ارسال", bg: "bg-ice/15", text: "text-ice", border: "border-ice/30" },
  delivered: { label: "تحویل داده شده ✓", bg: "bg-neon/15", text: "text-neon", border: "border-neon/30" },
  refunded: { label: "عودت داده شده", bg: "bg-blush/15", text: "text-blush", border: "border-blush/30" },
};

const copyText = (text: string) => {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    navigator.clipboard.writeText(text);
    copiedNumber.value = text;
    haptic(10);
    setTimeout(() => {
      copiedNumber.value = null;
    }, 2000);
  }
};
</script>

<template>
  <div class="wrap pt-6 pb-12 max-w-4xl mx-auto" dir="rtl">
    <!-- وضعیت عدم ورود و سفارش‌های مهمان -->
    <div v-if="!isLoggedIn" class="space-y-6">
      <div class="card-g relative overflow-hidden rounded-[26px] p-7 sm:p-9 text-center">
        <div class="pointer-events-none absolute -top-16 left-1/3 h-48 w-80 rounded-full bg-vio/15 blur-3xl" />
        <div class="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-surface border border-white/10 text-vio shadow-xl">
          <UserIcon :size="38" />
        </div>
        <h1 class="mt-5 text-[22px] font-extrabold text-snow">حساب کاربری و پیگیری سفارشات</h1>
        <p class="mt-2.5 text-[13px] leading-6 text-mist max-w-lg mx-auto">
          برای دسترسی به سوابق خرید، چاپ فاکتورهای رسمی و دریافت وضعیت پستی هر سفارش، با نام کاربری و رمز خود وارد شوید.
        </p>
        <div class="mt-6 flex flex-wrap justify-center gap-3">
          <button
            class="pressable flex h-13 items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-vio to-ice px-8 text-[14px] font-extrabold text-ink glow-v cursor-pointer"
            @click="openAuth('login')"
          >
            ورود به حساب
          </button>
          <button
            class="pressable flex h-13 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 text-[13.5px] font-bold text-snow hover:bg-white/10 cursor-pointer"
            @click="openAuth('register')"
          >
            ثبت‌نام جدید (بدون پیامک OTP)
          </button>
        </div>
      </div>

      <!-- جستجوی فوری سفارش برای مهمانان -->
      <div class="card-g rounded-[22px] p-5 sm:p-6 border border-white/10">
        <h3 class="text-[14px] font-extrabold text-snow flex items-center gap-2 mb-3">
          <SearchIcon :size="17" class="text-ice" />
          استعلام مستقیم سفارش (مخصوص خریداران مهمان)
        </h3>
        <p class="text-[12px] text-mist mb-3.5">
          اگر بدون ورود خرید کرده‌اید، شماره سفارش (مانند VPR-706636) یا شماره موبایل خود را وارد کنید:
        </p>
        <div class="flex gap-2">
          <input
            v-model="quickTrackQuery"
            type="text"
            dir="ltr"
            placeholder="VPR-XXXXXX یا 0912..."
            class="input flex-1 h-12 text-[13px] font-mono"
            @keyup.enter="quickTrackQuery ? navigateTo(`/track?order=${quickTrackQuery.trim()}`) : null"
          />
          <button
            :disabled="!quickTrackQuery.trim()"
            class="pressable h-12 px-5 rounded-xl bg-gradient-to-l from-vio to-ice text-ink font-bold text-[13px] disabled:opacity-40 cursor-pointer"
            @click="navigateTo(`/track?order=${quickTrackQuery.trim()}`)"
          >
            پیگیری
          </button>
        </div>
      </div>
    </div>

    <!-- اطلاعات کاربر لاگین شده -->
    <template v-else>
      <!-- کارت مشخصات پروفایل -->
      <div class="card-g relative overflow-hidden rounded-[26px] p-6 sm:p-7 border border-white/12 shadow-2xl">
        <div class="pointer-events-none absolute -top-16 left-1/3 h-44 w-80 rounded-full bg-vio/15 blur-3xl" />
        <div class="relative flex flex-wrap items-center justify-between gap-5">
          <div class="flex items-center gap-4 min-w-0">
            <span class="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-vio to-ice text-[24px] font-black text-ink shadow-lg">
              {{ (user?.name || user?.username || 'ک')[0] }}
            </span>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <h1 class="text-[20px] font-extrabold text-snow truncate">{{ user?.name || user?.username }}</h1>
                <span class="rounded-lg bg-emerald-500/15 border border-emerald-500/25 px-2 py-0.5 text-[10.5px] font-bold text-emerald-400">
                  عضو فعال
                </span>
              </div>
              <p class="mt-1 flex items-center gap-2 text-[12px] text-dim" dir="ltr">
                <UserIcon :size="13" /> @{{ user?.username }} · {{ user?.email }}
              </p>
              <p v-if="user?.phone" class="mt-0.5 text-[11px] font-mono text-mist" dir="ltr">
                📱 {{ user.phone }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2.5">
            <span class="rounded-xl border border-neon/25 bg-neon/10 px-3 py-1.5 text-[11px] font-extrabold text-neon">
              تأیید سن بالای ۱۸ سال ✓
            </span>
            <button
              class="pressable rounded-xl border border-blush/30 bg-blush/10 px-3.5 py-1.5 text-[11.5px] font-bold text-blush hover:bg-blush/20 cursor-pointer"
              @click="logout"
            >
              خروج از حساب
            </button>
          </div>
        </div>
      </div>

      <!-- ۳ شاخص آماری کلیدی -->
      <div class="mt-4 grid grid-cols-3 gap-3">
        <div class="card-g rounded-[20px] p-4 text-center border border-white/8">
          <p class="text-[20px] font-black text-snow tnum">{{ orders.length }}</p>
          <p class="mt-1 text-[11px] font-bold text-dim">کل سفارش‌ها</p>
        </div>
        <div class="card-g rounded-[20px] p-4 text-center border border-white/8">
          <p class="text-[20px] font-black text-ice tnum">{{ activeOrders.length }}</p>
          <p class="mt-1 text-[11px] font-bold text-dim">در جریان ارسال</p>
        </div>
        <div class="card-g rounded-[20px] p-4 text-center border border-white/8">
          <p class="text-[17px] font-black text-neon tnum">{{ money(totalSpent) }}</p>
          <p class="mt-1 text-[11px] font-bold text-dim">مجموع خرید</p>
        </div>
      </div>
    </template>

    <!-- ناوبری اصلی پروفایل: سفارش‌ها یا دفترچه نشانی‌ها -->
    <div class="mt-8 flex items-center gap-3 border-b border-white/10 pb-4">
      <button
        type="button"
        class="pressable flex items-center gap-2 rounded-2xl px-5 py-3 text-[13.5px] font-extrabold transition-all cursor-pointer"
        :class="[
          activeSection === 'orders'
            ? 'bg-gradient-to-l from-vio to-ice text-ink shadow-[0_0_20px_rgba(167,139,250,0.25)] font-black'
            : 'border border-white/10 bg-white/4 text-mist hover:text-snow',
        ]"
        @click="activeSection = 'orders'"
      >
        <span>📦 تاریخچه سفارش‌ها</span>
        <span
          class="rounded-full px-2 py-0.5 text-[11px] font-black tnum"
          :class="activeSection === 'orders' ? 'bg-ink/20 text-ink' : 'bg-white/10 text-ice'"
        >
          {{ orders.length }}
        </span>
      </button>

      <button
        type="button"
        class="pressable flex items-center gap-2 rounded-2xl px-5 py-3 text-[13.5px] font-extrabold transition-all cursor-pointer"
        :class="[
          activeSection === 'addresses'
            ? 'bg-gradient-to-l from-vio to-ice text-ink shadow-[0_0_20px_rgba(167,139,250,0.25)] font-black'
            : 'border border-white/10 bg-white/4 text-mist hover:text-snow',
        ]"
        @click="activeSection = 'addresses'"
      >
        <span>📍 دفترچه نشانی‌ها</span>
        <span
          class="rounded-full px-2 py-0.5 text-[11px] font-black tnum"
          :class="activeSection === 'addresses' ? 'bg-ink/20 text-ink' : 'bg-white/10 text-ice'"
        >
          {{ addresses.length }}
        </span>
      </button>
    </div>

    <!-- بخش مدیریت سفارش‌ها (برای همه یا مهمان دارای سابقه) -->
    <section v-if="activeSection === 'orders'" class="mt-6 space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-[17px] font-extrabold text-snow flex items-center gap-2">
            <span>📦 تاریخچه و وضعیت سفارش‌های شما</span>
            <span v-if="orders.length > 0" class="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold text-ice tnum">
              {{ orders.length }}
            </span>
          </h2>
          <p class="text-[11.5px] text-mist mt-0.5">مشاهده جزییات، وضعیت مرسوله پستی و دریافت فاکتور رسمی</p>
        </div>

        <div class="flex items-center gap-3">
          <NuxtLink
            to="/orders"
            class="pressable rounded-xl border border-vio/40 bg-vio/10 px-3 py-1.5 text-[11.5px] font-bold text-vio hover:bg-vio/20 flex items-center gap-1"
          >
            صفحه اختصاصی سفارش‌ها ↗
          </NuxtLink>
          <button
            v-if="orders.length > 0"
            type="button"
            class="text-[11.5px] font-bold text-mist hover:text-snow flex items-center gap-1 cursor-pointer"
            @click="fetchOrders"
          >
            🔄 بروزرسانی
          </button>
        </div>
      </div>

      <!-- تب‌های فیلتر وضعیت -->
      <div v-if="orders.length > 0" class="flex items-center gap-2 overflow-x-auto pb-1" role="tablist">
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
          همه سفارش‌ها ({{ orders.length }})
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

      <!-- وضعیت لودینگ -->
      <div v-if="loadingOrders" class="card-g rounded-[22px] p-10 text-center text-mist border border-white/10">
        <div class="mx-auto h-9 w-9 rounded-full border-2 border-vio border-t-transparent animate-spin mb-3" />
        در حال بارگذاری اطلاعات سفارش‌ها...
      </div>

      <!-- وضعیت عدم وجود سفارش -->
      <div v-else-if="filteredOrders.length === 0" class="card-g rounded-[24px] p-10 text-center border border-white/10">
        <p class="text-5xl">📦</p>
        <p class="mt-4 text-[15px] font-extrabold text-snow">هیچ سفارشی در این بخش یافت نشد</p>
        <p class="mt-1.5 text-[12px] text-dim">می‌توانید از بخش فروشگاه محصولات مورد علاقه خود را انتخاب کنید.</p>
        <NuxtLink
          to="/shop"
          class="pressable mt-5 inline-flex h-12 items-center rounded-2xl bg-gradient-to-l from-vio to-ice px-7 text-[13px] font-extrabold text-ink glow-v"
        >
          مشاهده فروشگاه ویپ‌لب
        </NuxtLink>
      </div>

      <!-- لیست سفارش‌ها -->
      <ul v-else class="space-y-4">
        <li
          v-for="o in filteredOrders"
          :key="o.id"
          class="card-g rounded-[24px] border border-white/10 overflow-hidden transition-all hover:border-white/20 p-5 space-y-4"
        >
          <!-- هدر سفارش -->
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 pb-4">
            <div class="flex items-center gap-3">
              <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5 border border-white/10 text-vio font-mono font-bold text-[13px]">
                #
              </span>
              <div>
                <div class="flex items-center gap-2">
                  <span dir="ltr" class="font-mono font-extrabold text-[14.5px] text-snow">{{ o.number }}</span>
                  <button
                    type="button"
                    class="text-[11px] font-medium text-dim hover:text-ice transition cursor-pointer"
                    @click="copyText(o.number)"
                  >
                    {{ copiedNumber === o.number ? 'کپی شد ✓' : 'کپی' }}
                  </button>
                </div>
                <p class="text-[11.5px] text-dim mt-0.5">
                  ثبت شده در {{ formatDateFa(o.createdAt) }} · {{ o.items.length }} قلم کالا
                </p>
              </div>
            </div>

            <!-- بج وضعیت سفارش -->
            <div class="flex items-center gap-2">
              <span
                class="rounded-xl border px-3 py-1.5 text-[11px] font-extrabold flex items-center gap-1.5"
                :class="[
                  labelFa[o.status]?.bg || 'bg-white/5',
                  labelFa[o.status]?.text || 'text-snow',
                  labelFa[o.status]?.border || 'border-white/15',
                ]"
              >
                <span class="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                {{ labelFa[o.status]?.label || o.status }}
              </span>
            </div>
          </div>

          <!-- لیست محصولات در این سفارش -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div
              v-for="(it, j) in o.items"
              :key="j"
              class="flex items-center gap-3 rounded-2xl bg-white/3 border border-white/5 p-2.5"
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

          <!-- نوار اطلاعات پستی و ارسال -->
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
    </section>

    <!-- بخش دفترچه نشانی‌ها -->
    <section v-else-if="activeSection === 'addresses'" class="mt-6 space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-[17px] font-extrabold text-snow flex items-center gap-2">
            <span>📍 دفترچه نشانی‌های منتخب</span>
            <span v-if="addresses.length > 0" class="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold text-ice tnum">
              {{ addresses.length }}
            </span>
          </h2>
          <p class="text-[11.5px] text-mist mt-0.5">
            آدرس‌های ثبت‌شده برای تحویل فوری سفارش‌ها در مرحله تسویه‌حساب (بدون نیاز به تایپ مجدد)
          </p>
        </div>

        <button
          type="button"
          class="pressable flex items-center gap-1.5 rounded-xl bg-gradient-to-l from-vio to-ice px-4 py-2 text-[12px] font-extrabold text-ink glow-v cursor-pointer"
          @click="showNewAddressForm = !showNewAddressForm"
        >
          <span>{{ showNewAddressForm ? '✕ بستن فرم' : '➕ افزودن نشانی جدید' }}</span>
        </button>
      </div>

      <!-- فرم ثبت نشانی جدید -->
      <div
        v-if="showNewAddressForm"
        class="card-g rounded-[22px] p-5 sm:p-6 border border-vio/40 shadow-xl space-y-4"
      >
        <div class="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 class="text-[14px] font-extrabold text-snow flex items-center gap-2">
            <span>🏠 ثبت مشخصات نشانی جدید</span>
          </h3>
          <span class="text-[11px] text-mist">کلیه فیلدهای ستاره‌دار (*) الزامی هستند</span>
        </div>

        <div v-if="addressMsg" class="rounded-xl border border-blush/30 bg-blush/10 p-3 text-[12px] text-blush">
          {{ addressMsg }}
        </div>

        <form @submit.prevent="handleSaveAddress" class="space-y-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <label class="block">
              <span class="mb-1 block text-[11.5px] font-bold text-dim">عنوان نشانی (مثلاً منزل، محل کار...)</span>
              <input v-model="newAddr.title" class="input" placeholder="مثلاً: منزل، محل کار، ویلا" />
            </label>
            <label class="block">
              <span class="mb-1 block text-[11.5px] font-bold text-dim">نام و نام خانوادگی تحویل‌گیرنده *</span>
              <input v-model="newAddr.recipientName" class="input" placeholder="مثلاً آرمان رضایی" required />
            </label>
            <label class="block">
              <span class="mb-1 block text-[11.5px] font-bold text-dim">شماره موبایل گیرنده *</span>
              <input v-model="newAddr.recipientPhone" class="input" dir="ltr" inputmode="tel" placeholder="0912 345 6789" required />
            </label>
            <label class="block">
              <span class="mb-1 block text-[11.5px] font-bold text-dim">شهر مقصد *</span>
              <select v-model="newAddr.city" class="input">
                <option v-for="c in ['تهران', 'کرج', 'شیراز', 'اصفهان', 'مشهد', 'تبریز', 'رشت', 'اهواز', 'یزد', 'کرمان', 'قم', 'ساری']" :key="c">{{ c }}</option>
              </select>
            </label>
            <label class="block sm:col-span-2">
              <span class="mb-1 block text-[11.5px] font-bold text-dim">نشانی کامل پستی (خیابان، کوچه، پلاک، واحد) *</span>
              <input v-model="newAddr.line1" class="input" placeholder="خیابان اصلی، کوچه فرعی، پلاک، شماره واحد" required />
            </label>
            <label class="block">
              <span class="mb-1 block text-[11.5px] font-bold text-dim">توضیحات تکمیلی (اختیاری)</span>
              <input v-model="newAddr.line2" class="input" placeholder="مثلاً: زنگ سوم سمت چپ" />
            </label>
            <label class="block">
              <span class="mb-1 block text-[11.5px] font-bold text-dim">کد پستی ۱۰ رقمی</span>
              <input v-model="newAddr.zip" class="input" dir="ltr" placeholder="مثلاً 1458963251" />
            </label>
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-white/10">
            <label class="flex items-center gap-2 text-[12px] text-snow cursor-pointer">
              <input type="checkbox" v-model="newAddr.isDefault" class="accent-vio h-4 w-4 rounded" />
              <span>تنظیم به عنوان نشانی پیش‌فرض تحویل</span>
            </label>

            <div class="flex items-center gap-2">
              <button
                type="button"
                class="pressable rounded-xl border border-white/10 bg-white/4 px-4 py-2 text-[12px] font-bold text-mist hover:text-snow cursor-pointer"
                @click="showNewAddressForm = false"
              >
                انصراف
              </button>
              <button
                type="submit"
                :disabled="savingAddress"
                class="pressable flex items-center gap-2 rounded-xl bg-gradient-to-l from-vio to-ice px-6 py-2 text-[12.5px] font-black text-ink glow-v disabled:opacity-40 cursor-pointer"
              >
                <span v-if="savingAddress" class="h-4 w-4 rounded-full border-2 border-ink border-t-transparent animate-spin" />
                <span>{{ savingAddress ? 'در حال ثبت...' : 'ذخیره نشانی' }}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- وضعیت بارگذاری نشانی‌ها -->
      <div v-if="loadingAddresses" class="card-g rounded-[22px] p-10 text-center text-mist border border-white/10">
        <div class="mx-auto h-8 w-8 rounded-full border-2 border-vio border-t-transparent animate-spin mb-3" />
        در حال بارگذاری نشانی‌های ذخیره‌شده...
      </div>

      <!-- وضعیت خالی -->
      <div v-else-if="addresses.length === 0" class="card-g rounded-[24px] p-10 text-center border border-white/10">
        <p class="text-5xl">📍</p>
        <p class="mt-4 text-[15px] font-extrabold text-snow">هنوز هیچ نشانی ذخیره‌ای ندارید</p>
        <p class="mt-1.5 text-[12px] text-dim">
          نشانی محل سکونت یا کار خود را اضافه کنید تا در هنگام سفارش بدون معطلی خرید کنید.
        </p>
        <button
          type="button"
          class="pressable mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-l from-vio to-ice px-6 py-3 text-[13px] font-extrabold text-ink glow-v cursor-pointer"
          @click="showNewAddressForm = true"
        >
          ➕ افزودن اولین نشانی
        </button>
      </div>

      <!-- فهرست کارت‌های نشانی -->
      <div v-else class="grid gap-3.5 sm:grid-cols-2">
        <div
          v-for="a in addresses"
          :key="a.id"
          class="card-g relative flex flex-col justify-between rounded-[22px] p-5 border transition-all duration-300"
          :class="[
            a.isDefault
              ? 'border-vio/60 bg-vio/6 shadow-[0_0_25px_rgba(167,139,250,0.12)]'
              : 'border-white/10 bg-white/3 hover:border-white/20',
          ]"
        >
          <div>
            <div class="flex items-center justify-between gap-2 border-b border-white/8 pb-3 mb-3">
              <div class="flex items-center gap-2">
                <span class="text-[16px]">
                  {{ a.title?.includes('کار') || a.title?.includes('شرکت') ? '🏢' : '🏠' }}
                </span>
                <span class="text-[14px] font-black text-snow">{{ a.title || 'نشانی من' }}</span>
              </div>
              <span
                v-if="a.isDefault"
                class="rounded-lg bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-black text-amber-300 flex items-center gap-1"
              >
                ⭐ نشانی پیش‌فرض
              </span>
            </div>

            <div class="space-y-1.5 text-[12.5px]">
              <p class="font-bold text-snow">
                تحویل‌گیرنده: {{ a.recipientName }}
              </p>
              <p class="text-mist flex items-center gap-1.5 font-mono" dir="ltr">
                <span class="text-dim">تلفن:</span> {{ a.recipientPhone }}
              </p>
              <p class="text-mist leading-6 pt-1">
                <span class="text-dim">آدرس:</span> {{ a.city }}، {{ a.line1 }}
                <span v-if="a.line2" class="text-dim">({{ a.line2 }})</span>
              </p>
              <p v-if="a.zip" class="text-[11.5px] text-dim font-mono" dir="ltr">
                کد پستی: {{ a.zip }}
              </p>
            </div>
          </div>

          <!-- دکمه‌های عملیات نشانی -->
          <div class="mt-5 flex items-center justify-between border-t border-white/8 pt-3">
            <div>
              <button
                v-if="!a.isDefault"
                type="button"
                class="pressable text-[11.5px] font-bold text-vio hover:text-ice flex items-center gap-1 cursor-pointer"
                @click="handleSetDefault(a.id)"
              >
                ⭐ تنظیم به عنوان پیش‌فرض
              </button>
            </div>

            <button
              type="button"
              class="pressable text-[11px] font-bold text-blush/80 hover:text-blush flex items-center gap-1 cursor-pointer"
              @click="handleDeleteAddress(a.id)"
            >
              🗑️ حذف نشانی
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ضمانت و راهنما -->
    <div class="card-g mt-8 rounded-[24px] p-6 border border-white/10">
      <h3 class="flex items-center gap-2 text-[15px] font-extrabold text-snow">
        <ShieldIcon :size="19" class="text-neon" /> ضمانت ۱۰۰٪ اصالت و بازگشت وجه ویپ‌لب
      </h3>
      <p class="mt-2.5 text-[12.5px] leading-7 text-dim">
        تمامی سفارش‌های ثبت‌شده دارای بارکد اصالت سنجی و هولوگرام رسمی هستند. چنانچه نیاز به ویرایش آدرس یا تغییر زمان ارسال دارید، می‌توانید با پشتیبانی تلگرام ویپ‌لب (@Vapelab_Support) در تماس باشید.
      </p>
    </div>
  </div>
</template>
