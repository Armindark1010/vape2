<script setup lang="ts">
import BottomNav from "~/components/vapor/BottomNav.vue";
import FooterV from "~/components/vapor/FooterV.vue";
import CartSheet from "~/components/vapor/CartSheet.vue";
import AgeGate from "~/components/vapor/AgeGate.vue";
import Toasts from "~/components/vapor/Toasts.vue";
import AIAssistant from "~/components/vapor/AIAssistant.vue";
import AuthModal from "~/components/vapor/AuthModal.vue";
</script>

<template>
  <div class="font-sans antialiased min-h-screen flex flex-col justify-between">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[130] focus:rounded-xl focus:bg-vio focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-ink"
    >
      پرش به محتوا
    </a>

    <BottomNav />

    <main id="main" class="pb-[92px] lg:pb-0 flex-1">
      <slot />
    </main>

    <FooterV />
    <CartSheet />
    <AgeGate />
    <Toasts />
    <AIAssistant />
    <AuthModal />
  </div>
</template>
