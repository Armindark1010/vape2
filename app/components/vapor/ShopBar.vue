<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import FilterSheet, { type FState } from "~/components/vapor/FilterSheet.vue";
import { SlidersIcon } from "~/components/vapor/VIcons";
import { haptic } from "~/utils/vape";

const props = defineProps<{
  initial: FState;
  cats: { slug: string; name: string }[];
  brands: { slug: string; name: string }[];
  priceCeil: number;
  sortOptions: { v: string; l: string }[];
  count: number;
}>();

const open = ref(false);
const router = useRouter();

const active = computed(() => {
  return (
    (props.initial.category ? 1 : 0) +
    (props.initial.brand ? 1 : 0) +
    (props.initial.inStock ? 1 : 0) +
    (props.initial.max ? 1 : 0) +
    (props.initial.sort && props.initial.sort !== "popular" ? 1 : 0)
  );
});

const chips = computed(() => {
  const list: { label: string; href: string }[] = [];
  const cl = (o: Record<string, string | undefined>) => {
    const q = new URLSearchParams();
    const merged: Record<string, unknown> = { ...props.initial, ...o };
    (Object.entries(merged) as [string, unknown][]).forEach(([k, v]) => {
      if (v === undefined || v === false) return;
      if (v === true) q.set(k, "in");
      else q.set(k, String(v));
    });
    const str = q.toString();
    return str ? `/shop?${str}` : "/shop";
  };
  if (props.initial.category) {
    const n = props.cats.find((c) => c.slug === props.initial.category)?.name;
    list.push({ label: n ?? props.initial.category, href: cl({ category: undefined }) });
  }
  if (props.initial.brand) {
    list.push({ label: props.initial.brand.toUpperCase(), href: cl({ brand: undefined }) });
  }
  if (props.initial.max) {
    list.push({ label: `تا ${(props.initial.max / 1000).toLocaleString("en-US")} هزار`, href: cl({ max: undefined }) });
  }
  return list;
});

const onChipClick = (href: string) => {
  haptic(6);
  router.replace(href);
};
</script>

<template>
  <div>
    <div class="mt-5 flex items-center justify-between gap-3">
      <div class="flex min-w-0 items-center gap-2">
        <button
          v-for="c in chips"
          :key="c.label"
          class="pressable flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-vio/30 bg-vio/10 px-3 text-[11.5px] font-bold text-vio cursor-pointer"
          @click="onChipClick(c.href)"
        >
          {{ c.label }} <span class="text-dim">✕</span>
        </button>
        <span class="shrink-0 text-[11.5px] text-dim tnum">
          {{ count }} کالا
        </span>
      </div>
      <button
        class="pressable relative flex h-12 shrink-0 items-center gap-2 rounded-2xl border border-white/12 bg-white/4 px-5 text-[13px] font-extrabold text-snow cursor-pointer"
        aria-haspopup="dialog"
        @click="open = true"
      >
        <SlidersIcon :size="18" class="text-vio" />
        فیلتر
        <span
          v-if="active > 0"
          class="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-gradient-to-l from-neon to-ice px-1 text-[10px] font-extrabold text-ink tnum"
        >
          {{ active }}
        </span>
      </button>
    </div>

    <FilterSheet
      :open="open"
      :initial="initial"
      :cats="cats"
      :brands="brands"
      :price-ceil="priceCeil"
      :sort-options="sortOptions"
      @close="open = false"
    />
  </div>
</template>
