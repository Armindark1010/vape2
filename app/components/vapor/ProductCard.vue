<script setup lang="ts">
import { computed } from "vue";
import type { Product } from "~/types";
import { useVape } from "~/composables/useVape";
import { useAuth } from "~/composables/useAuth";
import { useRestockAlerts } from "~/composables/useRestockAlerts";
import { money, haptic, CATS_META } from "~/utils/vape";
import { HeartIcon, PlusIcon, StarIcon, BellIcon, CheckIcon } from "~/components/vapor/VIcons";

const props = withDefaults(
  defineProps<{
    p: Product;
    index?: number;
  }>(),
  {
    index: 0,
  }
);

const { add, inWish, toggleWish } = useVape();
const { requireAuth } = useAuth();
const { isSubscribed, toggleRestock } = useRestockAlerts();

const out = computed(() => props.p.stock <= 0);
const price = computed(() => props.p.discountPrice ?? props.p.price);
const pct = computed(() =>
  props.p.discountPrice ? Math.round(((props.p.price - props.p.discountPrice) / props.p.price) * 100) : 0
);
const saved = computed(() => inWish(props.p.id));
const flavorHint = computed(() => props.p.tagline);

const onAdd = () => {
  if (out.value) return;
  requireAuth(() => {
    haptic(10);
    add({
      id: props.p.id,
      slug: props.p.slug,
      name: props.p.name,
      img: props.p.images[0] ?? "",
      price: price.value,
      oldPrice: props.p.discountPrice != null ? props.p.price : null,
      stock: props.p.stock,
    });
  }, "برای افزودن به سبد خرید لطفاً وارد حساب خود شوید");
};

</script>

<template>
  <div class="group relative">
    <div class="card-g relative overflow-hidden rounded-[20px] transition-all duration-500 hover:border-vio/40 hover:glow-v active:scale-[0.985]">
      <NuxtLink :to="`/product/${p.slug}`" class="relative block overflow-hidden">
        <div class="aspect-[4/5] overflow-hidden bg-panel">
          <img
            :src="p.images[0]"
            :alt="p.name"
            :loading="index < 4 ? 'eager' : 'lazy'"
            decoding="async"
            class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        </div>
        <!-- نور نئونی روی لبه هنگام لمس/هاور -->
        <div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-80" />

        <!-- بج‌ها در بالا سمت راست -->
        <div class="absolute top-3 right-3 z-10 flex flex-wrap items-center gap-1.5 pointer-events-none">
          <span
            v-if="pct > 0"
            class="rounded-xl bg-gradient-to-l from-neon to-ice px-2.5 py-1 text-[11px] font-extrabold text-ink tnum shadow-sm"
            dir="ltr"
          >
            ٪{{ pct }}
          </span>
          <span
            v-if="p.newArrival"
            class="rounded-xl bg-vio/85 px-2.5 py-1 text-[10.5px] font-extrabold text-white backdrop-blur shadow-sm"
          >
            جدید
          </span>
        </div>
        <span
          v-if="out"
          class="absolute inset-0 grid place-items-center bg-ink/60 backdrop-blur-[2px] text-[13px] font-extrabold text-blush"
        >
          ناموجود
        </span>
      </NuxtLink>

      <!-- دکمه علاقه‌مندی - همیشه در گوشه بالا چپ -->
      <button
        class="pressable absolute top-3 left-3 z-10 grid h-10 w-10 place-items-center rounded-full backdrop-blur-md border border-white/10 transition-colors cursor-pointer"
        :class="[
          saved
            ? 'bg-blush text-ink shadow-[0_0_14px_rgba(240,171,252,0.5)]'
            : 'bg-ink/60 text-snow hover:bg-ink/80 hover:text-blush',
        ]"
        :aria-pressed="saved"
        :aria-label="saved ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'"
        @click="requireAuth(() => toggleWish(p.id, p.name), 'برای لایک کردن این محصول لطفاً وارد حساب خود شوید')"
      >
        <HeartIcon :size="18" :filled="saved" />
      </button>

      <div class="p-3.5">
        <div class="flex items-center justify-between gap-2">
          <p dir="ltr" class="truncate text-[12.5px] font-extrabold tracking-wide text-snow">{{ p.name }}</p>
          <span class="flex shrink-0 items-center gap-1 text-[11px] font-bold text-gold tnum" dir="ltr">
            <StarIcon :size="12" :filled="true" class="text-gold" />
            {{ p.rating.toFixed(1) }}
          </span>
        </div>
        <p v-if="flavorHint" class="mt-1 truncate text-[11px] text-mist">{{ flavorHint }}</p>
        <p class="mt-0.5 text-[10px] font-bold text-dim" dir="ltr">
          {{ p.brand }} · {{ CATS_META[p.categorySlug]?.label ?? "" }}
        </p>

        <div class="mt-3 flex items-center justify-between gap-2">
          <div>
            <p class="text-[13.5px] font-extrabold text-snow tnum">{{ money(price) }}</p>
            <p v-if="p.discountPrice != null" class="text-[10.5px] text-dim line-through tnum">{{ money(p.price) }}</p>
          </div>

          <!-- دکمه اطلاع‌رسانی موجودی در صورت ناموجود بودن -->
          <button
            v-if="out"
            class="pressable grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition-all duration-300 cursor-pointer border shadow-sm"
            :class="[
              isSubscribed(p.id)
                ? 'bg-neon/15 text-neon border-neon/40 shadow-[0_0_14px_rgba(74,222,128,0.3)]'
                : 'bg-vio/20 text-vio border-vio/40 hover:bg-vio/30 shadow-[0_0_14px_rgba(167,139,250,0.3)]',
            ]"
            :aria-label="isSubscribed(p.id) ? 'اطلاع‌رسانی موجودی فعال است' : `موجود شد خبرم کن: ${p.name}`"
            :title="isSubscribed(p.id) ? 'اطلاع‌رسانی موجودی فعال است' : 'موجود شد خبرم کن'"
            @click.stop.prevent="toggleRestock(p)"
          >
            <CheckIcon v-if="isSubscribed(p.id)" :size="20" :sw="2.4" />
            <BellIcon v-else :size="20" :filled="true" />
          </button>

          <!-- دکمه افزودن به سبد در صورت موجود بودن -->
          <button
            v-else
            class="pressable grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-vio to-ice text-ink shadow-[0_6px_22px_-6px_rgba(167,139,250,0.65)]"
            :aria-label="`افزودن ${p.name} به سبد`"
            @click="onAdd"
          >
            <PlusIcon :size="22" :sw="2.4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
