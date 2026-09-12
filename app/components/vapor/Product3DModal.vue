<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import type { Product } from "~/types";
import Product3DViewer from "./Product3DViewer.vue";
import { CloseIcon, Cube3DIcon, CameraIcon } from "~/components/vapor/VIcons";

const props = defineProps<{
  show: boolean;
  product: Product;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && props.show) {
    emit("close");
  }
};

onMounted(() => {
  window.addEventListener("keydown", onKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeyDown);
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
        role="dialog"
        aria-modal="true"
        :aria-label="`مشاهده سه‌بعدی ${product.name}`"
      >
        <!-- Backdrop Blur -->
        <div
          class="absolute inset-0 bg-ink/80 backdrop-blur-xl"
          @click="emit('close')"
        />

        <!-- Modal Dialog Box -->
        <div class="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[28px] border border-white/15 bg-gradient-to-b from-[#131524] to-[#0d0e18] shadow-2xl shadow-purple-950/40">
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div class="flex items-center gap-2.5">
              <span class="grid h-9 w-9 place-items-center rounded-xl bg-vio/20 text-vio glow-v">
                <Cube3DIcon :size="20" />
              </span>
              <div>
                <h3 class="text-[15px] font-extrabold text-snow">{{ product.name }}</h3>
                <p class="text-[11px] font-bold text-mist">نمای ۳ بعدی تعاملی ۳۶۰ درجه</p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <NuxtLink
                :to="`/studio/scan?product=${product.slug}`"
                class="pressable flex h-9 items-center gap-1.5 rounded-xl border border-neon/40 bg-neon/10 px-3 text-[11px] font-extrabold text-neon transition-colors hover:bg-neon/20 cursor-pointer"
              >
                <CameraIcon :size="15" />
                <span>اسکن با دوربین گوشی</span>
              </NuxtLink>

              <button
                class="pressable grid h-9 w-9 place-items-center rounded-full bg-white/6 text-mist transition-colors hover:bg-white/12 hover:text-snow cursor-pointer"
                aria-label="بستن"
                @click="emit('close')"
              >
                <CloseIcon :size="18" />
              </button>
            </div>
          </div>

          <!-- Body with Three.js 3D Viewer -->
          <div class="flex-1 overflow-y-auto p-4 sm:p-5">
            <Product3DViewer
              :product-name="product.name"
              :images="product.images"
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
