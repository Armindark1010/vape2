<script setup lang="ts">
import { computed, watch, ref } from "vue";
import type { OrderView } from "~/types";
import { SITE, money } from "~/utils/vape";
import { formatDateFa } from "~/utils/vapeAcct";
import { useAuth } from "~/composables/useAuth";
import { UserIcon, CheckIcon, ChevronLeftIcon } from "~/components/vapor/VIcons";

useSeoMeta({
  title: "حساب کاربری",
  robots: "noindex, follow",
});

const { user, isLoggedIn, openAuth, logout } = useAuth();
const orders = ref<OrderView[]>([]);
const loadingOrders = ref(false);

const fetchOrders = async () => {
  if (!user.value?.email) {
    orders.value = [];
    return;
  }
  loadingOrders.value = true;
  try {
    const data = await $fetch<OrderView[]>("/api/orders", {
      query: { email: user.value.email },
    });
    orders.value = Array.isArray(data) ? data : [];
  } catch {
    orders.value = [];
  } finally {
    loadingOrders.value = false;
  }
};

watch(
  () => user.value?.email,
  () => {
    fetchOrders();
  },
  { immediate: true }
);

const shipped = computed(() =>
  orders.value.filter((o) => ["shipped", "delivered", "processing"].includes(o.status))
);

const totalSpent = computed(() =>
  orders.value.reduce((s, o) => s + o.total, 0)
);

const labelFa: Record<string, string> = {
  pending: "در انتظار پرداخت",
  processing: "در حال آماده‌سازی",
  shipped: "ارسال شده",
  delivered: "تحویل شده",
  refunded: "عودت داده شده",
};
</script>

<template>
  <div class="wrap pt-8 pb-4">
    <!-- وضعیت عدم ورود -->
    <div v-if="!isLoggedIn" class="card-g relative overflow-hidden rounded-[24px] p-8 text-center">
      <div class="pointer-events-none absolute -top-16 left-1/3 h-40 w-72 rounded-full bg-vio/15 blur-3xl" />
      <div class="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-surface border border-white/10 text-vio shadow-xl">
        <UserIcon :size="36" />
      </div>
      <h1 class="mt-5 text-[20px] font-extrabold text-snow">وارد حساب کاربری خود شوید</h1>
      <p class="mt-2 text-[13px] text-dim max-w-md mx-auto">
        برای مشاهده تاریخچه سفارش‌ها، وضعیت ارسال و مدیریت اطلاعات شخصی، لطفاً با نام کاربری و رمز عبور وارد شوید.
      </p>
      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <button
          class="pressable flex h-13 items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-vio to-ice px-8 text-[14.5px] font-extrabold text-ink glow-v cursor-pointer"
          @click="openAuth('login')"
        >
          ورود با نام کاربری و رمز
        </button>
        <button
          class="pressable flex h-13 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 text-[13.5px] font-bold text-snow hover:bg-white/10 cursor-pointer"
          @click="openAuth('register')"
        >
          ثبت‌نام جدید (بدون OTP)
        </button>
      </div>
    </div>

    <!-- وضعیت ورود کاربر واقعی -->
    <template v-else>
      <!-- پروفایل -->
      <div class="card-g relative overflow-hidden rounded-[24px] p-6">
        <div class="pointer-events-none absolute -top-16 left-1/3 h-40 w-72 rounded-full bg-vio/15 blur-3xl" />
        <div class="relative flex flex-wrap items-center justify-between gap-5">
          <div class="flex items-center gap-4 min-w-0">
            <span class="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-vio to-ice text-[22px] font-extrabold text-ink">
              {{ (user?.name || user?.username || 'ک')[0] }}
            </span>
            <div class="min-w-0 flex-1">
              <h1 class="text-[19px] font-extrabold text-snow truncate">{{ user?.name || user?.username }}</h1>
              <p class="mt-1 flex items-center gap-2 text-[12px] text-dim" dir="ltr">
                <UserIcon :size="13" /> @{{ user?.username }} · {{ user?.email }}
              </p>
              <p v-if="user?.phone" class="mt-0.5 text-[11px] text-mist" dir="ltr">
                {{ user.phone }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span class="rounded-xl border border-neon/25 bg-neon/10 px-3 py-1.5 text-[11px] font-extrabold text-neon">تأیید سن ✓</span>
            <button
              class="pressable rounded-xl border border-blush/30 bg-blush/10 px-3.5 py-1.5 text-[11.5px] font-bold text-blush hover:bg-blush/20 cursor-pointer"
              @click="logout"
            >
              خروج از حساب
            </button>
          </div>
        </div>
      </div>

      <!-- آمار -->
      <div class="mt-4 grid grid-cols-3 gap-3">
        <div class="card-g rounded-[20px] p-4 text-center">
          <p class="truncate text-[16px] font-extrabold text-snow tnum">{{ orders.length }}</p>
          <p class="mt-1 text-[10.5px] text-dim">سفارش‌ها</p>
        </div>
        <div class="card-g rounded-[20px] p-4 text-center">
          <p class="truncate text-[16px] font-extrabold text-snow tnum">{{ shipped.length }}</p>
          <p class="mt-1 text-[10.5px] text-dim">در جریان</p>
        </div>
        <div class="card-g rounded-[20px] p-4 text-center">
          <p class="truncate text-[16px] font-extrabold text-snow tnum">{{ money(totalSpent) }}</p>
          <p class="mt-1 text-[10.5px] text-dim">مجموع خرید</p>
        </div>
      </div>

      <!-- سفارش‌ها -->
      <h2 class="mt-8 mb-4 text-[16px] font-extrabold text-snow">سفارش‌های اخیر</h2>
      <div v-if="loadingOrders" class="card-g rounded-[20px] p-8 text-center text-dim">
        در حال دریافت سفارش‌ها...
      </div>
      <div v-else-if="orders.length === 0" class="card-g rounded-[20px] p-10 text-center">
        <p class="text-5xl">📦</p>
        <p class="mt-4 text-[14px] font-extrabold text-snow">هنوز سفارشی ثبت نکردی</p>
        <NuxtLink
          to="/shop"
          class="pressable mt-5 inline-flex h-12 items-center rounded-2xl bg-gradient-to-l from-vio to-ice px-6 text-[13px] font-extrabold text-ink"
        >
          اولین خریدت رو شروع کن
        </NuxtLink>
      </div>
      <ul v-else class="space-y-3">
        <li v-for="o in orders.slice(0, 6)" :key="o.id">
          <details class="card-g group overflow-hidden rounded-[20px] p-0 transition-colors open:border-vio/25">
            <summary class="flex cursor-pointer list-none items-center gap-3.5 p-3.5 sm:p-4 [&::-webkit-details-marker]:hidden">
              <div class="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/8 bg-white/5 flex items-center justify-center">
                <img
                  v-if="o.items[0]?.image"
                  :src="o.items[0].image"
                  alt=""
                  class="h-full w-full object-cover"
                  loading="lazy"
                />
                <UserIcon v-else :size="18" class="text-dim" />
              </div>
              <div class="min-w-0 flex-1">
                <span dir="ltr" class="block truncate text-right text-[13.5px] font-extrabold text-snow">{{ o.number }}</span>
                <span class="text-[11px] text-dim">{{ formatDateFa(o.createdAt) }} · {{ o.items.reduce((s, it) => s + it.qty, 0) }} کالا</span>
              </div>
              <span
                class="shrink-0 rounded-xl border px-3 py-1.5 text-[10.5px] font-extrabold"
                :class="[
                  o.status === 'delivered'
                    ? 'border-neon/30 bg-neon/10 text-neon'
                    : o.status === 'refunded'
                      ? 'border-blush/30 bg-blush/10 text-blush'
                      : 'border-vio/30 bg-vio/10 text-vio',
                ]"
              >
                {{ labelFa[o.status] ?? o.status }}
              </span>
              <ChevronLeftIcon :size="15" class="shrink-0 text-dim transition-transform duration-300 group-open:-rotate-90" />
            </summary>
            <div class="border-t border-white/8 bg-white/2 p-4">
              <ul class="space-y-2.5">
                <li v-for="(it, j) in o.items" :key="j" class="flex items-center justify-between text-[12.5px]">
                  <span class="text-mist">
                    {{ it.qty }} × <span dir="ltr">{{ it.name }}</span>
                  </span>
                  <span class="font-extrabold text-snow tnum">{{ money(it.price * it.qty) }}</span>
                </li>
              </ul>
              <div class="mt-3 flex items-center justify-between border-t border-white/8 pt-3">
                <span class="text-[11px] text-dim">
                  {{ o.status === 'delivered' ? 'تحویل موفق — ممنون که با ویپورا بودی 💜' : 'در حال پیگیری توسط تیم ارسال' }}
                </span>
                <span class="text-[14px] font-extrabold text-neon tnum">{{ money(o.total) }}</span>
              </div>
            </div>
          </details>
        </li>
      </ul>
    </template>

    <!-- راهنما -->
    <div class="card-g mt-8 rounded-[22px] p-6">
      <h2 class="flex items-center gap-2 text-[15px] font-extrabold text-snow">
        <CheckIcon :size="18" class="text-neon" /> چرا ویپورا؟
      </h2>
      <p class="mt-3 text-[12.5px] leading-7 text-dim">
        {{ SITE.name }} فقط کالای اورجینال با هولوگرام اصالت می‌فروشد؛ اگر بعد از اسکن هولوگرام مطمئن نشدی، تا ۷ روز می‌تونی
        کالا رو برگردونی و کل مبلغ رو پس بگیری.
      </p>
    </div>
  </div>
</template>
