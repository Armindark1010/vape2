<script setup lang="ts">
import { ref, computed, useId } from "vue";
import { useRouter } from "vue-router";
import type { Product } from "~/types";
import { useVape } from "~/composables/useVape";
import { money, haptic } from "~/utils/vape";
import {
  PlusIcon,
  MinusIcon,
  HeartIcon,
  StarIcon,
  ZapIcon,
  BagIcon,
  ShieldIcon,
  TruckIcon,
} from "~/components/vapor/VIcons";

type Opts = { flavors: string[]; nicotine: string[]; puffs?: string; salt?: boolean };

const props = defineProps<{
  product: Product;
}>();

const router = useRouter();
const { add, inWish, toggleWish } = useVape();
const { requireAuth } = useAuth();
const qty = ref(1);

const opts = computed<Opts | null>(() => {
  try {
    return props.product.specs?.options ? (JSON.parse(props.product.specs.options) as Opts) : null;
  } catch {
    return null;
  }
});

const flavor = ref<string | null>(opts.value?.flavors?.[0] ?? null);
const nic = ref<string | null>(opts.value?.nicotine?.[0] ?? null);

const price = computed(() => props.product.discountPrice ?? props.product.price);
const pct = computed(() =>
  props.product.discountPrice
    ? Math.round(((props.product.price - props.product.discountPrice) / props.product.price) * 100)
    : 0
);
const out = computed(() => props.product.stock <= 0);
const saved = computed(() => inWish(props.product.id));

const nics = computed(() => opts.value?.nicotine ?? []);
const flavors = computed(() => opts.value?.flavors ?? []);

const addToCart = (buyNow = false) => {
  if (out.value) return;
  requireAuth(() => {
    haptic(12);
    add(
      {
        id: props.product.id,
        slug: props.product.slug,
        name: props.product.name,
        img: props.product.images[0] ?? "",
        price: price.value,
        oldPrice: props.product.discountPrice != null ? props.product.price : null,
        stock: props.product.stock,
        flavor: flavor.value,
        nicotine: nic.value,
      },
      qty.value,
      buyNow
    );
    if (buyNow) {
      router.push("/checkout");
    }
  }, buyNow ? "برای خرید فوری لطفاً ابتدا وارد حساب خود شوید" : "برای افزودن به سبد خرید لطفاً وارد حساب شوید");
};


const selectFlavor = (f: string) => {
  haptic(6);
  flavor.value = f;
};

const selectNic = (n: string) => {
  haptic(6);
  nic.value = n;
};
</script>

<template>
  <div class="space-y-5">
    <!-- قیمت و عنوان -->
    <div>
      <p dir="ltr" class="text-[11px] font-extrabold tracking-[0.18em] text-vio">{{ product.brand }}</p>
      <h1 dir="ltr" class="mt-1.5 text-right text-[22px] font-extrabold leading-8 text-snow">
        {{ product.name }}
      </h1>
      <p v-if="product.tagline" class="mt-2 text-[13px] leading-6 text-mist">{{ product.tagline }}</p>
    </div>

    <div class="flex items-center gap-3">
      <p class="text-[22px] font-extrabold text-snow tnum">{{ money(price) }}</p>
      <p v-if="product.discountPrice != null" class="text-[13px] text-dim line-through tnum">{{ money(product.price) }}</p>
      <span v-if="pct > 0" class="rounded-lg bg-neon/15 px-2 py-1 text-[11px] font-extrabold text-neon" dir="ltr">
        ٪{{ pct }} تخفیف
      </span>
    </div>

    <div class="flex items-center gap-2 text-[12px]">
      <span class="flex items-center gap-1 font-bold text-snow" dir="ltr">
        <StarIcon :size="15" :filled="true" class="text-gold" />
        {{ product.rating.toFixed(1) }}
      </span>
      <span class="text-dim tnum">({{ product.reviewCount }} نظر)</span>
      <span class="mx-1 text-dim">·</span>
      <span v-if="out" class="font-extrabold text-blush">ناموجود — به‌زودی</span>
      <span v-else-if="product.stock < 8" class="font-extrabold text-gold">فقط {{ product.stock }} عدد مونده 🔥</span>
      <span v-else class="flex items-center gap-1.5 font-extrabold text-neon">
        <span class="pulse-ring h-2 w-2 rounded-full bg-neon" /> موجود در انبار
      </span>
    </div>

    <!-- انتخاب طعم -->
    <div v-if="flavors.length > 0">
      <p class="mb-2.5 text-[12px] font-extrabold text-mist">انتخاب طعم</p>
      <div class="flex flex-wrap gap-2" role="radiogroup" aria-label="طعم">
        <button
          v-for="f in flavors"
          :key="f"
          role="radio"
          :aria-checked="flavor === f"
          class="pressable relative h-12 min-w-[92px] rounded-2xl px-4 text-[13px] font-bold transition-colors duration-300 cursor-pointer"
          :class="[
            flavor === f
              ? 'border border-vio/60 bg-vio/15 text-snow glow-v'
              : 'border border-white/10 bg-white/4 text-mist',
          ]"
          @click="selectFlavor(f)"
        >
          <span
            v-if="flavor === f"
            class="absolute inset-0 rounded-2xl border-2 border-vio pointer-events-none"
          />
          {{ f }}
        </button>
      </div>
    </div>

    <!-- انتخاب نیکوتین -->
    <div v-if="nics.length > 0">
      <p class="mb-2.5 text-[12px] font-extrabold text-mist">میزان نیکوتین</p>
      <div class="flex gap-2" role="radiogroup" aria-label="نیکوتین">
        <button
          v-for="n in nics"
          :key="n"
          role="radio"
          :aria-checked="nic === n"
          class="pressable h-14 flex-1 rounded-2xl transition-all duration-300 cursor-pointer"
          :class="[
            nic === n
              ? 'bg-gradient-to-l from-neon/90 to-ice/90 text-ink glow-g'
              : 'border border-white/10 bg-white/4 text-mist',
          ]"
          @click="selectNic(n)"
        >
          <span dir="ltr" class="block text-[15px] font-extrabold tnum">{{ n }}mg</span>
          <span class="block text-[9.5px] font-bold opacity-70">{{ Number(n) >= 35 ? "قوی · سالت" : "ملایم" }}</span>
        </button>
      </div>
    </div>

    <p v-if="opts?.puffs" class="rounded-xl border border-ice/20 bg-ice/8 px-4 py-2.5 text-[12px] text-ice">
      💨 تعداد پاف تقریبی: <strong dir="ltr">{{ opts.puffs }}</strong>
    </p>

    <!-- تعداد -->
    <div class="flex items-center gap-3">
      <span class="text-[12px] font-extrabold text-mist">تعداد</span>
      <div class="flex h-12 items-center overflow-hidden rounded-2xl border border-white/12" dir="ltr">
        <button
          class="grid h-full w-12 place-items-center text-snow active:bg-white/8 cursor-pointer"
          aria-label="افزایش"
          @click="qty = Math.min(product.stock, qty + 1)"
        >
          <PlusIcon :size="16" />
        </button>
        <span class="grid h-full w-10 place-items-center text-[15px] font-extrabold text-snow tnum">
          {{ qty }}
        </span>
        <button
          class="grid h-full w-12 place-items-center text-snow active:bg-white/8 cursor-pointer"
          aria-label="کاهش"
          @click="qty = Math.max(1, qty - 1)"
        >
          <MinusIcon :size="16" />
        </button>
      </div>
      <button
        class="pressable grid h-12 w-12 place-items-center rounded-2xl border cursor-pointer"
        :class="[
          saved ? 'border-blush/50 bg-blush/15 text-blush' : 'border-white/12 text-mist',
        ]"
        :aria-pressed="saved"
        aria-label="علاقه‌مندی"
        @click="requireAuth(() => toggleWish(product.id, product.name), 'برای لایک کردن این محصول لطفاً وارد حساب شوید')"
      >
        <HeartIcon :size="20" :filled="saved" />
      </button>
    </div>

    <!-- دکمه‌ها -->
    <div class="grid grid-cols-2 gap-3">
      <button
        :disabled="out"
        class="pressable flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-vio to-ice text-[14.5px] font-extrabold text-ink glow-v disabled:opacity-50 cursor-pointer"
        @click="addToCart(false)"
      >
        <BagIcon :size="18" :sw="2.2" /> افزودن به سبد
      </button>
      <button
        :disabled="out"
        class="pressable flex h-14 items-center justify-center gap-2 rounded-2xl border border-neon/40 bg-neon/10 text-[14.5px] font-extrabold text-neon disabled:opacity-50 cursor-pointer"
        @click="addToCart(true)"
      >
        <ZapIcon :size="18" :sw="2.2" /> خرید فوری
      </button>
    </div>

    <!-- اعتماد -->
    <div class="grid grid-cols-3 gap-2">
      <div
        v-for="item in [
          { I: ShieldIcon, t: 'ضمانت اصالت' },
          { I: TruckIcon, t: 'ارسال امروز' },
          { I: StarIcon, t: 'بازگشت ۷ روزه' },
        ]"
        :key="item.t"
        class="flex flex-col items-center gap-1.5 rounded-2xl border border-white/8 bg-white/3 px-2 py-3 text-center"
      >
        <component :is="item.I" :size="17" class="text-vio" />
        <span class="text-[10px] font-bold text-mist">{{ item.t }}</span>
      </div>
    </div>
  </div>
</template>
