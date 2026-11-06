<script setup lang="ts">
interface Props {
  title: string;
  value: string | number;
  icon?: string;
  growth?: number | string | null;
  growthLabel?: string;
  subtitle?: string;
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  icon: 'overview',
  growth: null,
  growthLabel: 'نسبت به ماه گذشته',
  subtitle: '',
  loading: false,
});
</script>

<template>
  <div class="relative overflow-hidden rounded-xl bg-zinc-900/60 border border-zinc-800 p-5 hover:border-zinc-700 transition-all duration-200 group">
    <!-- Top Row: Icon & Title (Nuxt UI Pro style) -->
    <div class="flex items-center justify-between gap-3 mb-3">
      <span class="text-xs font-medium text-zinc-400 tracking-wider">
        {{ title }}
      </span>
      <div class="w-9 h-9 rounded-full bg-[#00DC82]/10 border border-[#00DC82]/20 flex items-center justify-center text-[#00DC82] shrink-0 transition-transform group-hover:scale-105">
        <DashboardIcon :name="icon" :size="18" />
      </div>
    </div>

    <!-- Middle Row: Value & Growth in one row or stacked -->
    <div class="flex items-baseline justify-between gap-2 mb-1">
      <div v-if="loading" class="h-8 w-28 bg-zinc-800/60 animate-pulse rounded-lg"></div>
      <div v-else class="text-2xl font-black text-white tracking-tight">
        {{ value }}
      </div>

      <!-- Growth badge -->
      <span
        v-if="growth !== null && growth !== undefined"
        class="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-mono font-bold shrink-0"
        :class="Number(growth) >= 0 ? 'bg-[#00DC82]/10 text-[#00DC82] border border-[#00DC82]/25' : 'bg-rose-500/10 text-rose-400 border border-rose-500/25'"
      >
        <span>{{ Number(growth) >= 0 ? '+' : '' }}</span>
        <span>{{ growth }}%</span>
      </span>
    </div>

    <!-- Subtitle if present -->
    <div v-if="subtitle" class="text-[11px] text-zinc-500 truncate mt-1">
      {{ subtitle }}
    </div>
  </div>
</template>

