<script setup lang="ts">
import { useReservation } from "~/composables/useReservation";
import { useVape } from "~/composables/useVape";
import { ClockIcon, SparklesIcon } from "~/components/vapor/VIcons";

const emit = defineEmits<{
  (e: "renewed"): void;
}>();

const { cart, revalidateCart } = useVape();
const {
  isReserved,
  isExpired,
  loading,
  error,
  formattedTime,
  progressPercent,
  reserve,
} = useReservation();

const handleRenew = async () => {
  await revalidateCart();
  const ok = await reserve(cart.value);
  if (ok) {
    emit("renewed");
  }
};
</script>

<template>
  <!-- Loading state -->
  <div
    v-if="loading && !isReserved"
    class="relative overflow-hidden rounded-2xl border border-vio/30 bg-vio/10 p-3.5 text-snow backdrop-blur-md transition-all"
  >
    <div class="flex items-center gap-3">
      <span class="h-4 w-4 animate-spin rounded-full border-2 border-vio border-t-transparent" />
      <span class="text-[12.5px] font-bold text-mist">در حال رزرو اقلام در انبار...</span>
    </div>
  </div>

  <!-- Active Reservation State -->
  <div
    v-else-if="isReserved && !isExpired"
    class="relative overflow-hidden rounded-2xl border border-neon/30 bg-gradient-to-r from-neon/10 via-neon/5 to-transparent p-3.5 text-snow backdrop-blur-md shadow-lg shadow-neon/5 transition-all"
  >
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2.5 min-w-0">
        <span class="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-neon/15 text-neon ring-1 ring-neon/30 animate-pulse">
          <ClockIcon :size="16" :sw="2.4" />
        </span>
        <div class="min-w-0">
          <div class="flex items-center gap-1.5">
            <span class="text-[13px] font-extrabold text-snow">رزرو اختصاصی انبار فعال است</span>
            <span class="inline-flex items-center rounded-full bg-neon/20 px-2 py-0.5 text-[10px] font-black text-neon">
              HOLD
            </span>
          </div>
          <p class="mt-0.5 truncate text-[11px] text-dim">
            اقلام تا پایان تایمر برای شما قفل شدند و به دیگران فروخته نمی‌شوند.
          </p>
        </div>
      </div>

      <!-- Countdown Display -->
      <div class="flex flex-col items-end shrink-0">
        <span class="font-mono text-[16px] font-black tracking-wider text-neon glow-g tnum">
          {{ formattedTime }}
        </span>
        <span class="text-[9.5px] text-dim font-bold">زمان باقی‌مانده</span>
      </div>
    </div>

    <!-- Smooth Progress bar -->
    <div class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <div
        class="h-full rounded-full bg-gradient-to-l from-neon to-ice transition-all duration-1000 ease-linear"
        :style="{ width: `${progressPercent}%` }"
      />
    </div>
  </div>

  <!-- Expired State -->
  <div
    v-else-if="isExpired"
    class="relative overflow-hidden rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3.5 text-snow backdrop-blur-md transition-all"
  >
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div class="flex items-start gap-2.5">
        <span class="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-amber-500/20 text-amber-400">
          ⚠️
        </span>
        <div>
          <p class="text-[12.5px] font-extrabold text-amber-300">
            مهلت ۱۵ دقیقه‌ای رزرو انبار به پایان رسید
          </p>
          <p class="mt-0.5 text-[11px] text-mist">
            برای جلوگیری از ناموجود شدن اقلام سبد توسط سایر خریداران، رزرو را تمدید کنید.
          </p>
        </div>
      </div>

      <button
        type="button"
        :disabled="loading"
        class="pressable inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-amber-500/20 px-3.5 text-[11.5px] font-extrabold text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 cursor-pointer disabled:opacity-50"
        @click="handleRenew"
      >
        <span v-if="loading" class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-amber-300 border-t-transparent" />
        <span v-else>🔄 تمدید رزرو (۱۵ دقیقه)</span>
      </button>
    </div>
  </div>

  <!-- Error / Conflict State -->
  <div
    v-else-if="error"
    class="relative overflow-hidden rounded-2xl border border-blush/30 bg-blush/10 p-3 text-[12px] text-blush backdrop-blur-md"
  >
    <p class="font-bold flex items-center gap-1.5">
      <span>⚠️</span> {{ error }}
    </p>
  </div>
</template>
