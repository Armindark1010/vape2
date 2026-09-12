<script setup lang="ts">
withDefaults(
  defineProps<{
    width?: string;
  }>(),
  {
    width: "w-[46vw] max-w-[240px] min-w-[200px]",
  }
);
</script>

<template>
  <div :class="[width, 'shrink-0 snap-start']">
    <slot />
  </div>
</template>
