<script setup lang="ts">
import { ref, computed } from "vue";
import { useVape } from "~/composables/useVape";
import { money, FREE_SHIPPING, haptic } from "~/utils/vape";
import {
  PlusIcon,
  MinusIcon,
  TrashIcon,
  ArrowLeftIcon,
  TagIcon,
  CheckIcon,
} from "~/components/vapor/VIcons";

useSeoMeta({
  title: "سبد خرید",
});

const { cart, cartTotal, setQty, remove, hydrated } = useVape();
const code = ref("");
const msg = ref<{ ok: boolean; t: string } | null>(null);
const coupon = ref<{ code: string; percent: number } | null>(null);
const busy = ref(false);

const discount = computed(() =>
  coupon.value ? Math.round((cartTotal.value * coupon.value.percent) / 100) : 0
);
const shipping = computed(() =>
  cartTotal.value - discount.value >= FREE_SHIPPING || cart.value.length === 0 ? 0 : 65000
);
const total = computed(() => cartTotal.value - discount.value + shipping.value);

const applyCoupon = async () => {
  if (!code.value.trim() || busy.value) return;
  busy.value = true;
  msg.value = null;
  try {
    const d = await $fetch<{ coupon?: { code: string; percent?: number; description: string }; error?: string }>(
      `/api/coupon?code=${encodeURIComponent(code.value.trim())}`
    );
    if (!d.coupon) {
      msg.value = { ok: false, t: d.error ?? "کد نامعتبر است" };
      return;
    }
    coupon.value = { code: d.coupon.code, percent: d.coupon.percent ?? 0 };
    msg.value = { ok: true, t: `${d.coupon.description} — اعمال شد 🎉` };
    code.value = "";
  } catch (err: any) {
    msg.value = { ok: false, t: err?.data?.message || err?.message || "خطا در بررسی کد" };
  } finally {
    busy.value = false;
  }
};

const increment = (k: string, currentQty: number) => {
  haptic(6);
  setQty(k, currentQty + 1);
};

const decrement = (k: string, currentQty: number) => {
  haptic(6);
  setQty(k, currentQty - 1);
};
</script>

<template>
  <div class="wrap pt-8 pb-4">
    <div class="flex items-center gap-3">
      <h1 class="font-display text-[26px] font-extrabold text-snow">سبد خرید</h1>
      <span class="text-[12.5px] text-dim tnum">({{ cart.length }}) کالا</span>
    </div>

    <!-- Skeleton when not hydrated -->
    <div v-if="!hydrated" class="mt-8 space-y-4" aria-busy="true">
      <div v-for="i in 2" :key="i" class="skeleton h-32 w-full" />
    </div>

    <!-- Empty state -->
    <div v-else-if="cart.length === 0" class="card-g mt-8 rounded-[24px] p-14 text-center">
      <p class="text-6xl">🛒</p>
      <h2 class="mt-5 text-[18px] font-extrabold text-snow">سبد خریدت خالیه</h2>
      <p class="mt-2 text-[13px] leading-7 text-dim">
        یه پاد خوش‌طعم، یه سالت اصل یا یه مود حرفه‌ای — انتخاب با توئه.
      </p>
      <NuxtLink
        to="/shop"
        class="pressable mt-7 inline-flex h-13 items-center gap-2 rounded-2xl bg-gradient-to-l from-vio to-ice px-8 py-4 text-[14px] font-extrabold text-ink glow-v"
      >
        رفتن به فروشگاه <ArrowLeftIcon :size="17" :sw="2.4" />
      </NuxtLink>
    </div>

    <!-- Cart items & summary -->
    <div v-else class="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_380px]">
      <!-- اقلام -->
      <ul class="space-y-3">
        <li
          v-for="c in cart"
          :key="c.k"
          class="card-g flex gap-4 rounded-[20px] p-4"
        >
          <NuxtLink :to="`/product/${c.slug}`" class="shrink-0 overflow-hidden rounded-2xl">
            <img :src="c.img" :alt="c.name" class="h-28 w-24 object-cover" loading="lazy" />
          </NuxtLink>
          <div class="flex min-w-0 flex-1 flex-col">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <NuxtLink :to="`/product/${c.slug}`" dir="ltr" class="block truncate text-right text-[14px] font-extrabold text-snow">
                  {{ c.name }}
                </NuxtLink>
                <p class="mt-1 text-[11.5px] text-mist">
                  <span v-if="c.flavor">طعم: {{ c.flavor }}</span>
                  <span v-if="c.nicotine" dir="ltr"> · نیکوتین {{ c.nicotine }}mg</span>
                </p>
                <p class="mt-2 text-[13px] font-extrabold text-neon tnum">{{ money(c.price * c.qty) }}</p>
              </div>
              <button
                class="pressable grid h-10 w-10 place-items-center rounded-xl text-dim hover:bg-white/6 hover:text-blush cursor-pointer"
                aria-label="حذف"
                @click="remove(c.k)"
              >
                <TrashIcon :size="17" />
              </button>
            </div>
            <div class="mt-auto flex h-11 w-fit items-center overflow-hidden rounded-2xl border border-white/12 pt-0" dir="ltr">
              <button
                class="grid h-full w-11 place-items-center text-snow active:bg-white/8 cursor-pointer"
                aria-label="افزایش"
                @click="increment(c.k, c.qty)"
              >
                <PlusIcon :size="15" />
              </button>
              <span class="grid h-full w-10 place-items-center text-[14px] font-extrabold text-snow tnum">{{ c.qty }}</span>
              <button
                class="grid h-full w-11 place-items-center text-snow active:bg-white/8 cursor-pointer"
                aria-label="کاهش"
                @click="decrement(c.k, c.qty)"
              >
                <MinusIcon :size="15" />
              </button>
            </div>
          </div>
        </li>
      </ul>

      <!-- خلاصه -->
      <aside class="card-g sticky top-20 rounded-[22px] p-5">
        <h2 class="text-[15px] font-extrabold text-snow">خلاصه سفارش</h2>

        <form class="mt-4 flex gap-2" @submit.prevent="applyCoupon">
          <label class="sr-only" for="cp">کد تخفیف</label>
          <input
            id="cp"
            v-model="code"
            placeholder="کد تخفیف (VAPORA15)"
            dir="ltr"
            class="input h-12 flex-1 text-center text-[13px] font-bold"
          />
          <button
            :disabled="busy || !code.trim()"
            class="pressable grid h-12 w-14 place-items-center rounded-2xl border border-white/12 text-vio disabled:opacity-40 cursor-pointer"
            aria-label="اعمال کد تخفیف"
          >
            <TagIcon :size="18" />
          </button>
        </form>
        <p
          v-if="msg"
          :class="[
            'mt-2 flex items-center gap-1.5 text-[11.5px] font-bold',
            msg.ok ? 'text-neon' : 'text-blush',
          ]"
        >
          <CheckIcon :size="12" /> {{ msg.t }}
        </p>

        <dl class="mt-5 space-y-3 border-t border-white/8 pt-4 text-[13px]">
          <div class="flex justify-between">
            <dt class="text-dim">جمع کالاها</dt>
            <dd class="font-extrabold text-snow tnum">{{ money(cartTotal) }}</dd>
          </div>
          <div v-if="discount > 0" class="flex justify-between text-neon">
            <dt>تخفیف ({{ coupon?.code }})</dt>
            <dd class="font-extrabold tnum">−{{ money(discount) }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-dim">ارسال</dt>
            <dd :class="['font-extrabold tnum', shipping === 0 ? 'text-neon' : 'text-snow']">
              {{ shipping === 0 ? 'رایگان 🎉' : money(shipping) }}
            </dd>
          </div>
          <div class="flex items-center justify-between border-t border-white/8 pt-3">
            <dt class="text-[15px] font-extrabold text-snow">مبلغ قابل پرداخت</dt>
            <dd class="text-[18px] font-extrabold text-grad tnum">{{ money(total) }}</dd>
          </div>
        </dl>

        <NuxtLink
          to="/checkout"
          class="pressable mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-vio to-ice text-[15px] font-extrabold text-ink glow-v"
        >
          ادامه و پرداخت <ArrowLeftIcon :size="18" :sw="2.4" />
        </NuxtLink>
        <p class="mt-3 text-center text-[10.5px] text-dim">پرداخت در محل (تهران) · ضمانت اصالت کالا</p>
      </aside>
    </div>
  </div>
</template>
