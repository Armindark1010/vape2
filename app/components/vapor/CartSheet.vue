<script setup lang="ts">
import { computed } from "vue";
import { useVape } from "~/composables/useVape";
import BottomSheet from "~/components/vapor/BottomSheet.vue";
import { money, FREE_SHIPPING, haptic } from "~/utils/vape";
import {
  PlusIcon,
  MinusIcon,
  TrashIcon,
  BagIcon,
  ArrowLeftIcon,
} from "~/components/vapor/VIcons";

const { cartOpen, setCartOpen, cart, cartTotal, cartCount, setQty, remove, hydrated, hasOutOfStockItems } = useVape();

const remaining = computed(() => FREE_SHIPPING - cartTotal.value);
const progress = computed(() => Math.min(100, (cartTotal.value / FREE_SHIPPING) * 100));

const increment = (k: string, currentQty: number) => {
  haptic(6);
  setQty(k, currentQty + 1);
};

const decrement = (k: string, currentQty: number) => {
  haptic(6);
  setQty(k, currentQty - 1);
};

const goToCheckout = () => {
  haptic(12);
  setCartOpen(false);
};
</script>

<template>
  <BottomSheet :open="cartOpen" label="سبد خرید" @close="setCartOpen(false)">
    <div class="flex items-center justify-between px-5 pb-2">
      <h2 class="flex items-center gap-2 text-[16px] font-extrabold text-snow">
        <BagIcon :size="19" class="text-vio" />
        سبد خرید
        <span class="text-[12px] font-bold text-dim tnum">({{ cartCount }})</span>
      </h2>
      <NuxtLink
        to="/cart"
        class="pressable flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-bold text-vio"
        @click="setCartOpen(false)"
      >
        مشاهده کامل <ArrowLeftIcon :size="14" />
      </NuxtLink>
    </div>

    <!-- Empty state -->
    <div v-if="!hydrated || cart.length === 0" class="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <span class="text-5xl">🛒</span>
      <p class="text-[15px] font-extrabold text-snow">سبدت خالیه</p>
      <p class="max-w-[240px] text-[12px] leading-6 text-dim">
        چند تا پاد خوش‌طعم و سالت اصل می‌تونه امروز همدمت باشه.
      </p>
      <button
        class="pressable h-12 rounded-2xl bg-gradient-to-l from-vio to-ice px-8 text-[13px] font-extrabold text-ink cursor-pointer"
        @click="setCartOpen(false)"
      >
        برو به فروشگاه
      </button>
    </div>

    <!-- Filled cart -->
    <template v-else>
      <!-- نوار ارسال رایگان -->
      <div class="mx-5 mt-2 rounded-xl border border-white/8 bg-white/4 px-4 py-3">
        <p v-if="remaining > 0" class="text-[11.5px] text-mist">
          تا <strong class="text-ice">{{ money(remaining) }}</strong> دیگه ارسال رایگانه 🚚
        </p>
        <p v-else class="text-[11.5px] font-bold text-neon">
          ارسال سفارشت رایگان شد 🎉
        </p>
        <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            class="h-full rounded-full bg-gradient-to-l from-vio via-ice to-neon transition-all duration-500 ease-out"
            :style="{ width: `${progress}%` }"
          />
        </div>
      </div>

      <!-- آیتم‌ها -->
      <ul class="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        <li
          v-for="c in cart"
          :key="c.k"
          class="card-g flex gap-3 rounded-2xl p-3"
        >
          <NuxtLink
            :to="`/product/${c.slug}`"
            class="shrink-0 overflow-hidden rounded-xl"
            @click="setCartOpen(false)"
          >
            <img :src="c.img" :alt="c.name" class="h-24 w-20 object-cover" loading="lazy" />
          </NuxtLink>
          <div class="flex min-w-0 flex-1 flex-col">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <p dir="ltr" class="truncate text-right text-[13px] font-extrabold text-snow">{{ c.name }}</p>
                <p class="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-mist">
                  <span v-if="c.color" class="inline-flex items-center gap-1 rounded-md bg-ice/15 px-1.5 py-0.5 font-bold text-ice">
                    رنگ: {{ c.color }}
                  </span>
                  <span v-if="c.flavor">طعم: {{ c.flavor }}</span>
                  <span v-if="c.nicotine" dir="ltr">نیکوتین {{ c.nicotine }}mg</span>
                </p>
              </div>
              <button
                class="pressable grid h-9 w-9 shrink-0 place-items-center rounded-xl text-dim hover:bg-white/6 hover:text-blush cursor-pointer"
                aria-label="حذف از سبد"
                @click="remove(c.k)"
              >
                <TrashIcon :size="16" />
              </button>
            </div>
            <div class="mt-auto flex items-center justify-between pt-2">
              <div class="flex h-9 items-center overflow-hidden rounded-xl border border-white/12" dir="ltr">
                <button
                  :disabled="c.stock <= 0 || c.qty >= c.stock"
                  class="grid h-full w-9 place-items-center text-snow active:bg-white/8 cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="افزایش تعداد"
                  @click="increment(c.k, c.qty)"
                >
                  <PlusIcon :size="14" />
                </button>
                <span class="grid h-full w-8 place-items-center text-[13px] font-extrabold text-snow tnum">{{ c.qty }}</span>
                <button
                  class="grid h-full w-9 place-items-center text-snow active:bg-white/8 cursor-pointer"
                  aria-label="کاهش تعداد"
                  @click="decrement(c.k, c.qty)"
                >
                  <MinusIcon :size="14" />
                </button>
              </div>
              <p class="text-[14px] font-extrabold text-neon tnum">{{ money(c.price * c.qty) }}</p>
            </div>
          </div>
        </li>
      </ul>

      <!-- جمع و دکمه -->
      <div class="border-t border-white/8 px-5 pt-4 pb-4">
        <div
          v-if="hasOutOfStockItems"
          class="mb-3 rounded-xl border border-blush/30 bg-blush/10 p-2.5 text-[11.5px] text-blush"
        >
          ⚠️ کالای ناموجود در سبد شما وجود دارد.
        </div>

        <div class="mb-4 flex items-center justify-between">
          <span class="text-[13px] text-mist">جمع کل</span>
          <span class="text-[17px] font-extrabold text-snow tnum">{{ money(cartTotal) }}</span>
        </div>
        <NuxtLink
          v-if="!hasOutOfStockItems"
          to="/checkout"
          class="pressable flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-vio to-ice text-[15px] font-extrabold text-ink glow-v"
          @click="goToCheckout"
        >
          ادامه خرید و پرداخت
          <ArrowLeftIcon :size="17" :sw="2.4" />
        </NuxtLink>
        <div
          v-else
          class="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white/10 text-[14px] font-extrabold text-mist opacity-60 cursor-not-allowed"
        >
          کالای ناموجود در سبد
        </div>
        <p class="mt-3 text-center text-[10.5px] text-dim">
          پرداخت در محل برای تهران فعال است · کالا ۱۰۰٪ اورجینال
        </p>
      </div>
    </template>
  </BottomSheet>
</template>
