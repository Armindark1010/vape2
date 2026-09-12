<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";

const props = withDefaults(
  defineProps<{
    open: boolean;
    label: string;
    snap?: string;
  }>(),
  {
    snap: "88svh",
  }
);

const emit = defineEmits<{
  (e: "close"): void;
}>();

const startY = ref<number | null>(null);
const currentY = ref(0);
const dragging = ref(false);

const onTouchStart = (e: TouchEvent) => {
  const t = e.touches[0];
  if (t) {
    startY.value = t.clientY;
    dragging.value = true;
  }
};

const onTouchMove = (e: TouchEvent) => {
  const t = e.touches[0];
  if (!t || startY.value == null) return;
  const dy = t.clientY - startY.value;
  if (dy > 0) {
    currentY.value = dy;
  }
};

const onTouchEnd = () => {
  if (currentY.value > 100) {
    emit("close");
  }
  startY.value = null;
  currentY.value = 0;
  dragging.value = false;
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && props.open) {
    emit("close");
  }
};

watch(
  () => props.open,
  (isOpen) => {
    if (typeof document === "undefined") return;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      currentY.value = 0;
    }
  }
);

onMounted(() => {
  if (typeof document !== "undefined") {
    document.addEventListener("keydown", handleKeyDown);
    if (props.open) {
      document.body.style.overflow = "hidden";
    }
  }
});

onUnmounted(() => {
  if (typeof document !== "undefined") {
    document.removeEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "";
  }
});
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="relative z-[80]">
      <!-- Backdrop -->
      <Transition
        enter-active-class="transition-opacity duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
        appear
      >
        <button
          class="fixed inset-0 z-[80] w-full bg-black/65 backdrop-blur-[3px] cursor-pointer"
          :aria-label="`بستن ${label}`"
          @click="emit('close')"
        />
      </Transition>

      <!-- Sheet Container -->
      <Transition
        enter-active-class="transition-transform duration-300 cubic-bezier(0.22, 1, 0.36, 1)"
        enter-from-class="translate-y-full"
        enter-to-class="translate-y-0"
        leave-active-class="transition-transform duration-250 ease-in"
        leave-from-class="translate-y-0"
        leave-to-class="translate-y-full"
        appear
      >
        <div
          role="dialog"
          aria-modal="true"
          :aria-label="label"
          class="safe-bottom fixed inset-x-0 bottom-0 z-[81] flex flex-col rounded-t-[26px] border-t border-white/10 bg-[#0e0e13]/95 backdrop-blur-2xl sheet-shadow transition-transform duration-75"
          :style="{
            height: snap,
            maxHeight: '92svh',
            transform: currentY > 0 ? `translateY(${currentY}px)` : undefined,
          }"
        >
          <!-- Drag Handle -->
          <div
            class="flex shrink-0 cursor-grab touch-none items-center justify-center pt-3 pb-1 active:cursor-grabbing"
            aria-hidden="true"
            @touchstart="onTouchStart"
            @touchmove="onTouchMove"
            @touchend="onTouchEnd"
          >
            <span class="h-1.5 w-12 rounded-full bg-white/20" />
          </div>
          <slot />
        </div>
      </Transition>
    </div>
  </Teleport>
</template>
