<script setup lang="ts">
import { useVape } from "~/composables/useVape";
import { onMounted } from "vue";

const { init } = useVape();

onMounted(() => {
  init();
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
