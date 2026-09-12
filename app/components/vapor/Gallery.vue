<script setup lang="ts">
import { ref, computed } from "vue";
import { ChevronLeftIcon, Cube3DIcon } from "~/components/vapor/VIcons";
import { haptic } from "~/utils/vape";

const props = defineProps<{
  images: string[];
  name: string;
}>();

const emit = defineEmits<{
  (e: "open-3d"): void;
}>();

const imgs = computed(() => (props.images && props.images.length ? props.images : [""]));
const i = ref(0);
const startX = ref<number | null>(null);

const go = (d: number) => {
  haptic(5);
  i.value = (i.value + d + imgs.value.length) % imgs.value.length;
};

const onTouchStart = (e: TouchEvent) => {
  const t = e.touches[0];
  if (t) {
    startX.value = t.clientX;
  }
};

const onTouchEnd = (e: TouchEvent) => {
  if (startX.value == null) return;
  const t = e.changedTouches[0];
  if (!t) return;
  const dx = t.clientX - startX.value;
  if (Math.abs(dx) > 45) {
    go(dx < 0 ? 1 : -1);
  }
  startX.value = null;
};

const onMouseDown = (e: MouseEvent) => {
  startX.value = e.clientX;
};

const onMouseUp = (e: MouseEvent) => {
  if (startX.value == null) return;
  const dx = e.clientX - startX.value;
  if (Math.abs(dx) > 45) {
    go(dx < 0 ? 1 : -1);
  }
  startX.value = null;
};
</script>

<template>
  <div>
    <div
      class="relative touch-pan-y overflow-hidden rounded-[24px] border border-white/10 bg-panel select-none"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
    >
      <div class="aspect-[4/5] overflow-hidden relative">
        <img
          :key="i"
          :src="imgs[i]"
          :alt="`${name} — عکس ${i + 1}`"
          class="h-full w-full object-cover transition-all duration-300"
          draggable="false"
        />

        <!-- دکمه مشاهده ۳ بعدی 3D Interactive -->
        <button
          type="button"
          class="pressable absolute bottom-4 right-4 z-20 flex items-center gap-2 rounded-2xl border border-vio/50 bg-ink/75 px-3.5 py-2 text-[12px] font-extrabold text-white backdrop-blur-md glow-v transition-all hover:scale-105 cursor-pointer"
          @click.stop="emit('open-3d')"
        >
          <Cube3DIcon :size="18" class="text-neon" />
          <span>مشاهده ۳D و ۳۶۰°</span>
        </button>
      </div>

      <template v-if="imgs.length > 1">
        <button
          class="pressable absolute top-1/2 right-3 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-ink/55 text-snow backdrop-blur cursor-pointer"
          aria-label="عکس قبلی"
          @click="go(-1)"
        >
          <ChevronLeftIcon :size="18" />
        </button>
        <button
          class="pressable absolute top-1/2 left-3 grid h-11 w-11 -translate-y-1/2 rotate-180 place-items-center rounded-full bg-ink/55 text-snow backdrop-blur cursor-pointer"
          aria-label="عکس بعدی"
          @click="go(1)"
        >
          <ChevronLeftIcon :size="18" />
        </button>
        <div class="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          <button
            v-for="(_, x) in imgs"
            :key="x"
            :aria-label="`عکس ${x + 1}`"
            class="h-1.5 rounded-full transition-all duration-300 cursor-pointer"
            :class="[x === i ? 'w-5 bg-vio' : 'w-1.5 bg-white/35']"
            @click="i = x"
          />
        </div>
      </template>
    </div>

    <!-- بندانگشتی -->
    <div v-if="imgs.length > 1" class="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
      <button
        v-for="(img, x) in imgs"
        :key="x"
        :aria-label="`مشاهده عکس ${x + 1}`"
        class="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition-colors cursor-pointer"
        :class="[x === i ? 'border-vio' : 'border-transparent opacity-55']"
        @click="i = x"
      >
        <img :src="img" alt="" loading="lazy" class="h-full w-full object-cover" />
      </button>
    </div>
  </div>
</template>
