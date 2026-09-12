<script setup lang="ts">
defineProps<{
  title: string;
  sub?: string;
  href?: string;
}>();
</script>

<template>
  <section class="mt-10">
    <div class="wrap mb-4 flex items-end justify-between">
      <div>
        <h2 class="text-[19px] font-extrabold text-snow">{{ title }}</h2>
        <p v-if="sub" class="mt-1 text-[11.5px] text-dim">{{ sub }}</p>
      </div>
      <NuxtLink
        v-if="href"
        :to="href"
        class="pressable rounded-xl px-2 py-2 text-[12px] font-extrabold text-vio"
      >
        مشاهده همه ←
      </NuxtLink>
    </div>
    <slot />
  </section>
</template>
