<script setup lang="ts">
withDefaults(
  defineProps<{
    level: number;
    max?: number;
  }>(),
  {
    level: 0,
    max: 5,
  }
);
</script>

<template>
  <div class="flex items-center gap-1.5" :title="`میزان خنکی: ${level} از ${max}`">
    <div class="flex items-end gap-1">
      <span
        v-for="i in max"
        :key="i"
        class="w-1.5 rounded-full transition-all duration-300"
        :class="
          i <= level
            ? 'bg-ice shadow-[0_0_8px_rgba(125,211,252,0.9)]'
            : 'bg-white/15'
        "
        :style="{ height: `${8 + i * 2.5}px` }"
      />
    </div>
    <span class="ms-1 text-[11px] font-extrabold text-ice">
      ❄️ {{ level }}/{{ max }}
    </span>
  </div>
</template>
