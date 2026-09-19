<script setup lang="ts">
import { useVape } from "~/composables/useVape";
import { useRestockAlerts } from "~/composables/useRestockAlerts";
import { onMounted, onUnmounted } from "vue";

const { init } = useVape();
const { init: initRestock, checkRestocked, subscribedAlerts } = useRestockAlerts();

const runRestockCheck = async () => {
  initRestock();
  if (subscribedAlerts.value.length === 0) return;
  try {
    const res = await $fetch<any>("/api/products");
    const list = Array.isArray(res) ? res : (res?.products || res?.items || []);
    if (list.length > 0) {
      checkRestocked(list);
    }
  } catch (err) {
    console.warn("[Restock Focus Check Error]:", err);
  }
};

onMounted(() => {
  init();
  initRestock();
  runRestockCheck();

  // بررسی وضعیت فقط هنگام بازگشت کاربر به تب سایت (Event-driven)
  window.addEventListener("focus", runRestockCheck);
});

onUnmounted(() => {
  window.removeEventListener("focus", runRestockCheck);
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
