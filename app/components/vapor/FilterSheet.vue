<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import BottomSheet from "~/components/vapor/BottomSheet.vue";
import { haptic } from "~/utils/vape";
import { CheckIcon } from "~/components/vapor/VIcons";

export type FState = {
  category?: string;
  brand?: string;
  inStock?: boolean;
  max?: number;
  sort?: string;
};

const props = defineProps<{
  open: boolean;
  initial: FState;
  cats: { slug: string; name: string }[];
  brands: { slug: string; name: string }[];
  priceCeil: number;
  sortOptions: { v: string; l: string }[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const router = useRouter();
const d = ref<FState>({ ...props.initial });

watch(
  () => props.initial,
  (newVal) => {
    d.value = { ...newVal };
  },
  { deep: true }
);

const apply = () => {
  haptic(10);
  const query: Record<string, string> = {};
  if (d.value.category) query.category = d.value.category;
  if (d.value.brand) query.brand = d.value.brand;
  if (d.value.inStock) query.stock = "in";
  if (d.value.max != null && d.value.max < props.priceCeil) query.max = String(d.value.max);
  if (d.value.sort && d.value.sort !== "popular") query.sort = d.value.sort;

  router.replace({ path: "/shop", query });
  emit("close");
};

const reset = () => {
  d.value = { sort: "popular" };
  router.replace({ path: "/shop" });
  emit("close");
};
</script>

<template>
  <BottomSheet :open="open" label="فیلترها" snap="80svh" @close="emit('close')">
    <div class="flex items-center justify-between px-5 pb-1">
      <h2 class="text-[16px] font-extrabold text-snow">فیلتر محصولات</h2>
      <button
        class="pressable rounded-xl px-3 py-2 text-[12px] font-bold text-blush cursor-pointer"
        @click="reset"
      >
        حذف همه فیلترها
      </button>
    </div>

    <div class="flex-1 space-y-6 overflow-y-auto px-5 py-4">
      <!-- مرتب‌سازی -->
      <div>
        <p class="mb-3 text-[12px] font-extrabold text-mist">مرتب‌سازی بر اساس</p>
        <div class="no-scrollbar flex gap-2 overflow-x-auto">
          <button
            v-for="o in sortOptions"
            :key="o.v"
            class="pressable h-11 shrink-0 rounded-2xl px-4 text-[12.5px] font-bold transition-colors cursor-pointer"
            :class="[
              (d.sort ?? 'popular') === o.v
                ? 'border border-vio/50 bg-vio/15 text-snow glow-v'
                : 'border border-white/10 bg-white/4 text-mist',
            ]"
            @click="d.sort = o.v"
          >
            {{ o.l }}
          </button>
        </div>
      </div>

      <!-- دسته -->
      <div>
        <p class="mb-3 text-[12px] font-extrabold text-mist">دسته‌بندی</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="c in cats"
            :key="c.slug"
            class="pressable h-11 rounded-2xl px-4 text-[13px] font-bold cursor-pointer"
            :class="[
              d.category === c.slug
                ? 'border border-vio/50 bg-vio/15 text-snow glow-v'
                : 'border border-white/10 bg-white/4 text-mist',
            ]"
            @click="d.category = d.category === c.slug ? undefined : c.slug"
          >
            {{ c.name }}
          </button>
        </div>
      </div>

      <!-- برند -->
      <div>
        <p class="mb-3 text-[12px] font-extrabold text-mist">برند</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="b in brands"
            :key="b.slug"
            class="pressable h-11 rounded-2xl px-4 text-[13px] font-bold cursor-pointer"
            :class="[
              d.brand === b.slug
                ? 'border border-neon/50 bg-neon/12 text-neon'
                : 'border border-white/10 bg-white/4 text-mist',
            ]"
            @click="d.brand = d.brand === b.slug ? undefined : b.slug"
          >
            <span dir="ltr">{{ b.name }}</span>
          </button>
        </div>
      </div>

      <!-- قیمت -->
      <div>
        <p class="mb-3 text-[12px] font-extrabold text-mist">
          حداکثر قیمت: <span class="text-snow tnum">{{ (d.max ?? priceCeil).toLocaleString("en-US") }} تومان</span>
        </p>
        <input
          type="range"
          :min="100000"
          :max="priceCeil"
          :step="50000"
          :value="d.max ?? priceCeil"
          class="w-full accent-[#a78bfa] cursor-pointer"
          aria-label="حداکثر قیمت"
          @input="(e: any) => d.max = Number(e.target.value)"
        />
        <div class="mt-1 flex justify-between text-[10.5px] text-dim tnum">
          <span>۱۰۰ هزار</span>
          <span>{{ (priceCeil / 1000000).toLocaleString("en-US") }} میلیون</span>
        </div>
      </div>

      <!-- موجودی -->
      <button
        class="flex h-14 w-full items-center justify-between rounded-2xl border border-white/10 bg-white/4 px-4 cursor-pointer"
        role="checkbox"
        :aria-checked="!!d.inStock"
        @click="d.inStock = !d.inStock"
      >
        <span class="text-[13px] font-bold text-snow">فقط کالاهای موجود</span>
        <span
          class="grid h-6 w-6 place-items-center rounded-lg border transition-colors"
          :class="[
            d.inStock ? 'border-neon bg-neon text-ink' : 'border-white/20',
          ]"
        >
          <CheckIcon v-if="d.inStock" :size="14" :sw="3" />
        </span>
      </button>
    </div>

    <div class="border-t border-white/8 px-5 pt-3 pb-4">
      <button
        class="pressable h-14 w-full rounded-2xl bg-gradient-to-l from-vio to-ice text-[15px] font-extrabold text-ink glow-v cursor-pointer"
        @click="apply"
      >
        نمایش نتایج
      </button>
    </div>
  </BottomSheet>
</template>
