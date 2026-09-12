<script setup lang="ts">
import { useVape } from "~/composables/useVape";
import { CheckIcon, CloseIcon } from "~/components/vapor/VIcons";

const { toasts, dismiss } = useVape();
</script>

<template>
  <div class="pointer-events-none fixed inset-x-0 bottom-24 z-[100] flex flex-col items-center gap-2 px-4 lg:bottom-8">
    <TransitionGroup
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-6 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-95"
    >
      <div
        v-for="t in toasts"
        :key="t.id"
        class="pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-xl"
        :class="[
          t.kind === 'ok'
            ? 'border-neon/25 bg-[#0c120e]/92 text-neon'
            : 'border-blush/25 bg-[#160c14]/92 text-blush',
        ]"
      >
        <span class="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/8">
          <CheckIcon v-if="t.kind === 'ok'" :size="13" :sw="2.6" />
          <CloseIcon v-else :size="13" :sw="2.6" />
        </span>
        <p class="text-[13px] font-bold text-snow">{{ t.msg }}</p>
        <button
          class="mr-1 text-dim cursor-pointer"
          aria-label="بستن پیام"
          @click="dismiss(t.id)"
        >
          <CloseIcon :size="14" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
