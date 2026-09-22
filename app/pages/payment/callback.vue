<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

useSeoMeta({
  title: "در حال پردازش بازگشت از پرداخت",
  robots: "noindex, nofollow",
});

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const statusText = ref("در حال استعلام و نهایی‌سازی پرداخت...");

onMounted(async () => {
  const orderNumber = String(route.query.order || "");
  const status = route.query.Status === "NOK" ? "failed" : "success";
  const authority = String(route.query.Authority || "");

  if (!orderNumber) {
    router.replace("/shop");
    return;
  }

  try {
    const res = await $fetch<{ ok: boolean; redirectUrl: string }>("/api/payment/verify", {
      method: "POST",
      body: {
        orderNumber,
        status,
        refId: authority || undefined,
        gateway: "zarinpal",
      },
    });
    if (res?.redirectUrl) {
      router.replace(res.redirectUrl);
    } else {
      router.replace(`/order/${orderNumber}?status=${status}`);
    }
  } catch {
    router.replace(`/order/${orderNumber}?status=failed`);
  }
});
</script>

<template>
  <div class="min-h-[70vh] flex flex-col items-center justify-center text-center p-6" dir="rtl">
    <div class="h-12 w-12 rounded-full border-2 border-vio border-t-transparent animate-spin mb-4" />
    <h1 class="text-[16px] font-extrabold text-snow">{{ statusText }}</h1>
    <p class="text-[12px] text-mist mt-2">لطفاً شکیبا باشید، در حال اتصال به سرور مرکزی ویپ‌لب هستیم...</p>
  </div>
</template>
