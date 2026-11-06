<script setup lang="ts">
import { ref, computed } from 'vue';

interface TimelinePoint {
  date: string;
  revenue: number;
  orders: number;
  commission: number;
}

interface Props {
  timeline: TimelinePoint[];
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'تحلیل درآمد و سفارشات',
});

const activeMetric = ref<'revenue' | 'orders' | 'commission'>('revenue');
const activePeriod = ref<'7d' | '30d'>('30d');
const hoveredIndex = ref<number | null>(null);
const hoveredPoint = computed(() => (hoveredIndex.value !== null && points.value[hoveredIndex.value]) ? points.value[hoveredIndex.value] : null);

const filteredData = computed(() => {
  if (!props.timeline || props.timeline.length === 0) return [];
  const count = activePeriod.value === '7d' ? 7 : 30;
  return props.timeline.slice(-count);
});

const values = computed(() => {
  return filteredData.value.map(item => item[activeMetric.value] || 0);
});

const maxValue = computed(() => {
  const max = Math.max(...values.value, 1);
  return max;
});

// Format points for SVG Path
const chartWidth = 700;
const chartHeight = 220;
const paddingX = 20;
const paddingY = 25;

const points = computed(() => {
  const data = values.value;
  if (data.length <= 1) return [];

  const stepX = (chartWidth - paddingX * 2) / (data.length - 1);
  const usableHeight = chartHeight - paddingY * 2;

  return data.map((val, idx) => {
    const x = paddingX + idx * stepX;
    const y = chartHeight - paddingY - (val / maxValue.value) * usableHeight;
    return { x, y, val, original: filteredData.value[idx] };
  });
});

const linePath = computed(() => {
  const pts = points.value;
  if (pts.length === 0) return '';
  return pts.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');
});

const areaPath = computed(() => {
  const pts = points.value;
  if (pts.length === 0 || !pts[0] || !pts[pts.length - 1]) return '';
  const first = pts[0]!;
  const last = pts[pts.length - 1]!;
  const baseline = chartHeight - paddingY;
  return linePath.value + ' L ' + last.x + ' ' + baseline + ' L ' + first.x + ' ' + baseline + ' Z';
});

const totalMetricValue = computed(() => {
  const sum = values.value.reduce((a, b) => a + b, 0);
  if (activeMetric.value === 'orders') {
    return sum.toLocaleString('fa-IR') + ' سفارش';
  }
  return sum.toLocaleString('fa-IR') + ' تومان';
});

const formatVal = (v: number) => {
  if (activeMetric.value === 'orders') return v.toLocaleString('fa-IR') + ' عدد';
  return v.toLocaleString('fa-IR') + ' تومان';
};
</script>

<template>
  <div class="rounded-xl bg-zinc-900/60 border border-zinc-800 p-5 md:p-6">
    <!-- Header with Metric switcher & Period tabs -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="w-2.5 h-2.5 rounded-full bg-[#00DC82]"></span>
          <h2 class="text-sm md:text-base font-bold text-white">{{ title }}</h2>
        </div>
        <div class="text-xl md:text-2xl font-black text-white font-mono">
          {{ totalMetricValue }}
        </div>
      </div>

      <!-- Controls -->
      <div class="flex items-center gap-3 self-start sm:self-auto">
        <!-- Metric buttons -->
        <div class="flex items-center p-1 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
          <button
            type="button"
            @click="activeMetric = 'revenue'"
            class="px-2.5 py-1.5 rounded-lg transition-colors font-medium cursor-pointer"
            :class="activeMetric === 'revenue' ? 'bg-[#00DC82] text-zinc-950 font-bold shadow-sm' : 'text-zinc-400 hover:text-white'"
          >
            درآمد فروش
          </button>
          <button
            type="button"
            @click="activeMetric = 'orders'"
            class="px-2.5 py-1.5 rounded-lg transition-colors font-medium cursor-pointer"
            :class="activeMetric === 'orders' ? 'bg-[#00DC82] text-zinc-950 font-bold shadow-sm' : 'text-zinc-400 hover:text-white'"
          >
            سفارشات
          </button>
          <button
            type="button"
            @click="activeMetric = 'commission'"
            class="px-2.5 py-1.5 rounded-lg transition-colors font-medium cursor-pointer"
            :class="activeMetric === 'commission' ? 'bg-[#00DC82] text-zinc-950 font-bold shadow-sm' : 'text-zinc-400 hover:text-white'"
          >
            کارمزد پلتفرم
          </button>
        </div>

        <!-- Period selector -->
        <div class="flex items-center p-1 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
          <button
            type="button"
            @click="activePeriod = '7d'"
            class="px-2.5 py-1.5 rounded-lg transition-colors font-medium font-mono cursor-pointer"
            :class="activePeriod === '7d' ? 'bg-zinc-800 text-white font-bold border border-zinc-700' : 'text-zinc-400 hover:text-white'"
          >
            7D
          </button>
          <button
            type="button"
            @click="activePeriod = '30d'"
            class="px-2.5 py-1.5 rounded-lg transition-colors font-medium font-mono cursor-pointer"
            :class="activePeriod === '30d' ? 'bg-zinc-800 text-white font-bold border border-zinc-700' : 'text-zinc-400 hover:text-white'"
          >
            30D
          </button>
        </div>
      </div>
    </div>

    <!-- Chart Visualization -->
    <div class="pt-6 relative">
      <div v-if="points.length === 0" class="h-56 flex items-center justify-center text-xs text-zinc-500">
        داده‌ای برای بازه زمانی انتخابی یافت نشد.
      </div>

      <div v-else class="w-full overflow-hidden">
        <svg
          :viewBox="`0 0 ${chartWidth} ${chartHeight}`"
          class="w-full h-48 md:h-64 overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chartGradientNuxt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#00DC82" stop-opacity="0.3" />
              <stop offset="70%" stop-color="#00DC82" stop-opacity="0.05" />
              <stop offset="100%" stop-color="#00DC82" stop-opacity="0" />
            </linearGradient>
          </defs>

          <!-- Horizontal Grid lines -->
          <line
            v-for="i in 3"
            :key="i"
            :x1="paddingX"
            :y1="paddingY + (i - 1) * ((chartHeight - paddingY * 2) / 2)"
            :x2="chartWidth - paddingX"
            :y2="paddingY + (i - 1) * ((chartHeight - paddingY * 2) / 2)"
            stroke="#27272a"
            stroke-dasharray="3 3"
            stroke-width="1"
          />

          <!-- Gradient Area -->
          <path :d="areaPath" fill="url(#chartGradientNuxt)" />

          <!-- Main Smooth Line (Nuxt green) -->
          <path
            :d="linePath"
            fill="none"
            stroke="#00DC82"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

          <!-- Data Points with hover triggers -->
          <g
            v-for="(pt, idx) in points"
            :key="idx"
            @mouseenter="hoveredIndex = idx"
            @mouseleave="hoveredIndex = null"
            class="cursor-pointer"
          >
            <circle
              :cx="pt.x"
              :cy="pt.y"
              r="4"
              class="transition-all duration-150"
              :class="hoveredIndex === idx ? 'fill-[#00DC82] stroke-white stroke-[3px] scale-125' : 'fill-zinc-950 stroke-[#00DC82] stroke-2'"
            />
          </g>
        </svg>

        <!-- Dynamic Tooltip -->
        <div
          v-if="hoveredPoint"
          class="absolute top-2 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-xl shadow-xl pointer-events-none text-xs flex items-center gap-2 text-white animate-in fade-in zoom-in-95"
        >
          <span class="font-mono text-zinc-400">{{ hoveredPoint?.original?.date || '' }}:</span>
          <span class="font-bold text-[#00DC82]">{{ formatVal(hoveredPoint?.val ?? 0) }}</span>
        </div>

        <!-- X-axis date labels -->
        <div class="flex items-center justify-between text-[10px] text-zinc-500 pt-3 px-2 font-mono">
          <span>{{ filteredData[0]?.date }}</span>
          <span class="hidden sm:inline">{{ filteredData[Math.floor(filteredData.length / 2)]?.date }}</span>
          <span>{{ filteredData[filteredData.length - 1]?.date }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
