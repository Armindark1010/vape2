<script setup lang="ts">
interface Props {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'purple' | 'blue';
  dot?: boolean;
  size?: 'xs' | 'sm' | 'md';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'neutral',
  dot: false,
  size: 'sm',
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'bg-[#00DC82]/10 text-[#00DC82] border-[#00DC82]/25';
    case 'warning':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/25';
    case 'danger':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/25';
    case 'info':
    case 'blue':
      return 'bg-sky-500/10 text-sky-400 border-sky-500/25';
    case 'purple':
      return 'bg-[#00DC82]/15 text-[#00DC82] border-[#00DC82]/30';
    case 'neutral':
    default:
      return 'bg-zinc-800 text-zinc-400 border-zinc-700/60';
  }
});

const dotClasses = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'bg-[#00DC82]';
    case 'warning':
      return 'bg-amber-400';
    case 'danger':
      return 'bg-rose-400';
    case 'info':
    case 'blue':
      return 'bg-sky-400';
    case 'purple':
      return 'bg-[#00DC82]';
    case 'neutral':
    default:
      return 'bg-zinc-400';
  }
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'text-[10px] px-1.5 py-0.5 gap-1';
    case 'md':
      return 'text-[12.5px] px-3 py-1 gap-1.5';
    case 'sm':
    default:
      return 'text-[11px] px-2 py-0.5 gap-1.5';
  }
});
</script>

<template>
  <span
    class="inline-flex items-center font-medium border rounded-full transition-colors whitespace-nowrap"
    :class="[variantClasses, sizeClasses]"
  >
    <span
      v-if="dot"
      class="w-1.5 h-1.5 rounded-full shrink-0"
      :class="dotClasses"
    />
    <slot />
  </span>
</template>

