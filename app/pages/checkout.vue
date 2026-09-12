<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useVape } from "~/composables/useVape";
import { useAuth } from "~/composables/useAuth";
import { money, FREE_SHIPPING, haptic } from "~/utils/vape";
import {
  ArrowLeftIcon,
  CheckIcon,
  ShieldIcon,
  DropletIcon,
} from "~/components/vapor/VIcons";

useSeoMeta({
  title: "تکمیل سفارش",
});

const { cart, cartTotal, clear, ageOk, hydrated } = useVape();
const { user, isLoggedIn, openAuth } = useAuth();
const done = ref<string | null>(null);
const busy = ref(false);
const err = ref("");
const f = ref({
  name: user.value?.name || "",
  phone: user.value?.phone || "",
  city: "تهران",
  addr: "",
  zip: "",
  note: "",
});

onMounted(() => {
  if (user.value) {
    if (!f.value.name && user.value.name) f.value.name = user.value.name;
    if (!f.value.phone && user.value.phone) f.value.phone = user.value.phone;
  }
});

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
    const customerEmail = user.value?.email || `${f.value.phone.trim()}@vapora.local`;
    const d = await $fetch<{ ok: boolean; number: string; error?: string }>("/api/checkout", {
      method: "POST",
      body: {
        items: cart.value.map((c) => ({ id: c.id, qty: c.qty })),
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
    clear();
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
        شماره پیگیری: <strong dir="ltr" class="text-vio">{{ done }}</strong>
        <br />
        تیم ویپورا به‌زودی برای هماهنگی ارسال باهات تماس می‌گیره.
      </p>
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <NuxtLink
          to="/shop"
          class="pressable inline-flex h-13 items-center rounded-2xl bg-gradient-to-l from-vio to-ice px-7 py-4 text-[13.5px] font-extrabold text-ink glow-v"
        >
          ادامه خرید
        </NuxtLink>
        <NuxtLink
          to="/account"
          class="pressable inline-flex h-13 items-center rounded-2xl border border-white/14 px-7 py-4 text-[13.5px] font-extrabold text-snow"
        >
          پیگیری سفارش
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
      <p v-if="!ageOk" class="mt-4 rounded-2xl border border-blush/25 bg-blush/8 px-4 py-3 text-[12.5px] text-blush">
        ⚠️ گیت تأیید سن را کامل نکرده‌اید — برای خرید، ورود شما باید بالای ۱۸ سال باشد.
      </p>

      <form class="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_380px]" @submit.prevent="place">
        <div class="space-y-4">
          <div class="card-g rounded-[22px] p-5">
            <h2 class="mb-4 flex items-center gap-2 text-[15px] font-extrabold text-snow">
              <span class="grid h-7 w-7 place-items-center rounded-full bg-vio/15 text-[12px] text-vio">۱</span>
              اطلاعات گیرنده
            </h2>
            <div class="grid gap-4 sm:grid-cols-2">
              <label class="block">
                <span class="mb-1.5 block text-[11.5px] font-bold text-dim">نام و نام خانوادگی</span>
                <input v-model="f.name" class="input" placeholder="مثلاً آرمان رضایی" />
              </label>
              <label class="block">
                <span class="mb-1.5 block text-[11.5px] font-bold text-dim">شماره موبایل</span>
                <input v-model="f.phone" class="input" dir="ltr" inputmode="tel" placeholder="0912 345 6789" />
              </label>
              <label class="block sm:col-span-2">
                <span class="mb-1.5 block text-[11.5px] font-bold text-dim">آدرس کامل</span>
                <input v-model="f.addr" class="input" placeholder="خیابان، کوچه، پلاک، واحد" />
              </label>
              <label class="block">
                <span class="mb-1.5 block text-[11.5px] font-bold text-dim">شهر</span>
                <select v-model="f.city" class="input">
                  <option v-for="c in ['تهران', 'کرج', 'شیراز', 'اصفهان', 'مشهد', 'تبریز', 'رشت']" :key="c">{{ c }}</option>
                </select>
              </label>
              <label class="block">
                <span class="mb-1.5 block text-[11.5px] font-bold text-dim">کد پستی</span>
                <input v-model="f.zip" class="input" dir="ltr" placeholder="—" />
              </label>
              <label class="block sm:col-span-2">
                <span class="mb-1.5 block text-[11.5px] font-bold text-dim">توضیحات (اختیاری)</span>
                <input v-model="f.note" class="input" placeholder="مثلاً: بعد از ۶ عصر تماس بگیرید" />
              </label>
            </div>
          </div>

          <div class="card-g rounded-[22px] p-5">
            <h2 class="mb-3 flex items-center gap-2 text-[15px] font-extrabold text-snow">
              <span class="grid h-7 w-7 place-items-center rounded-full bg-vio/15 text-[12px] text-vio">۲</span>
              روش پرداخت
            </h2>
            <label class="flex cursor-pointer items-center gap-3 rounded-2xl border border-neon/40 bg-neon/8 px-4 py-4">
              <input type="radio" checked readonly class="accent-[#4ade80]" />
              <span class="flex-1 text-[13.5px] font-extrabold text-snow">پرداخت در محل (فقط تهران)</span>
              <span class="text-[11px] text-dim">تحویل بگیر، بعد پرداخت کن</span>
            </label>
            <label class="mt-2 flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/3 px-4 py-4 opacity-60">
              <input type="radio" disabled />
              <span class="flex-1 text-[13.5px] font-extrabold text-snow">پرداخت آنلاین (به‌زودی)</span>
            </label>
          </div>
        </div>

        <!-- خلاصه -->
        <aside class="card-g sticky top-20 rounded-[22px] p-5">
          <h2 class="text-[15px] font-extrabold text-snow">سفارش شما</h2>
          <ul class="mt-4 max-h-60 space-y-3 overflow-y-auto">
            <li v-for="c in cart" :key="c.k" class="flex items-center gap-3">
              <img :src="c.img" alt="" class="h-14 w-12 rounded-xl object-cover" loading="lazy" />
              <div class="min-w-0 flex-1">
                <p dir="ltr" class="truncate text-right text-[12.5px] font-extrabold text-snow">{{ c.name }}</p>
                <p class="text-[10.5px] text-dim tnum">
                  {{ c.qty }} × {{ money(c.price) }}
                  <span v-if="c.flavor"> · {{ c.flavor }}</span>
                </p>
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
            :disabled="busy"
            class="pressable mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-vio to-ice text-[15px] font-extrabold text-ink glow-v disabled:opacity-60 cursor-pointer"
          >
            <span v-if="busy" class="h-5 w-5 animate-spin rounded-full border-2 border-ink border-t-transparent" />
            <template v-else>
              <ShieldIcon :size="18" :sw="2.2" /> ثبت سفارش — {{ money(total) }}
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
