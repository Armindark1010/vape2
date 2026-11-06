<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  name: string;
  size?: number | string;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 18,
  class: '',
});

const dimension = computed(() => {
  return typeof props.size === 'number' ? `${props.size}px` : props.size;
});
</script>

<template>
  <svg
    :width="dimension"
    :height="dimension"
    viewBox="0 0 24 24"
    fill="currentColor"
    :class="['shrink-0 inline-block', props.class]"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- 1. Overview / Dashboard -->
    <path
      v-if="name === 'overview' || name === 'dashboard' || name === 'home'"
      d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
    />

    <!-- 2. Products / Box -->
    <path
      v-else-if="name === 'products' || name === 'package' || name === 'box'"
      d="M12 1.5 2 6.5v11L12 22.5l10-5v-11L12 1.5zm0 2.2 7.7 3.8-3.7 1.8-7.7-3.8 3.7-1.8zm-8 4.6 7 3.5v8.5l-7-3.5V8.3zm16 8.5-7 3.5v-8.5l7-3.5v8.5z"
    />

    <!-- 3. Categories / Grid -->
    <path
      v-else-if="name === 'categories' || name === 'grid'"
      d="M4 4h7v7H4V4zm0 9h7v7H4v-7zm9-9h7v7h-7V4zm0 9h7v7h-7v-7z"
    />

    <!-- 4. Brands / Tag -->
    <path
      v-else-if="name === 'brands' || name === 'tag'"
      d="M21.41 11.58l-9-9A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .59 1.42l9 9A2 2 0 0 0 13 22a2 2 0 0 0 1.41-.59l7-7a2 2 0 0 0 0-2.83zM6.5 8A1.5 1.5 0 1 1 8 6.5 1.5 1.5 0 0 1 6.5 8z"
    />

    <!-- 5. Orders / Shopping Bag -->
    <path
      v-else-if="name === 'orders' || name === 'bag' || name === 'cart'"
      d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h6v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z"
    />

    <!-- 6. Customers / Users -->
    <path
      v-else-if="name === 'customers' || name === 'users'"
      d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
    />

    <!-- 7. Suppliers / Handshake / Building -->
    <path
      v-else-if="name === 'suppliers' || name === 'building'"
      d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2V11zm0 4h-2v2h2v-2z"
    />

    <!-- 8. Finance / Credit Card -->
    <path
      v-else-if="name === 'finance' || name === 'card' || name === 'credit-card'"
      d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"
    />

    <!-- 9. Commission / Dollar / Coins -->
    <path
      v-else-if="name === 'commission' || name === 'dollar' || name === 'coins' || name === 'revenue'"
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5v1.5h-2v-1.5c-2.05-.38-3.5-1.95-3.5-3.5h2c0 1.1 1.12 2 2.5 2s2.5-.9 2.5-2c0-1.18-.89-1.74-2.82-2.31C9.17 10.09 8 9.08 8 7.5 8 5.95 9.45 4.38 11.5 4V2.5h2V4c2.05.38 3.5 1.95 3.5 3.5h-2c0-1.1-1.12-2-2.5-2s-2.5.9-2.5 2c0 1.18.89 1.74 2.82 2.31 2.51.74 3.68 1.75 3.68 3.19 0 1.55-1.45 3.12-3.5 3.5z"
    />

    <!-- 10. Settlement / Invoice -->
    <path
      v-else-if="name === 'settlements' || name === 'receipt' || name === 'invoice'"
      d="M18 17H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V7h12v2zM3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20z"
    />

    <!-- 11. Balance / Scale -->
    <path
      v-else-if="name === 'balance' || name === 'scale'"
      d="M12 2a1 1 0 0 1 1 1v1.07A7.002 7.002 0 0 1 19 11v1a1 1 0 0 1-1 1h-1v5a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-5H6a1 1 0 0 1-1-1v-1a7.002 7.002 0 0 1 6-6.93V3a1 1 0 0 1 1-1zm-3 15v-4H7v4h2zm8-4h-2v4h2v-4z"
    />

    <!-- 12. Journal / Book -->
    <path
      v-else-if="name === 'journal' || name === 'book'"
      d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"
    />

    <!-- 13. Banners / Image -->
    <path
      v-else-if="name === 'banners' || name === 'image'"
      d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
    />

    <!-- 14. Coupons / Ticket -->
    <path
      v-else-if="name === 'coupons' || name === 'ticket'"
      d="M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-1.99.89-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-9 7.5h-2v-2h2v2zm0-4.5h-2v-2h2v2zm0-4.5h-2v-2h2v2z"
    />

    <!-- 15. Campaigns / Target -->
    <path
      v-else-if="name === 'campaigns' || name === 'target'"
      d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
    />

    <!-- 16. Settings / Gear -->
    <path
      v-else-if="name === 'settings' || name === 'gear'"
      d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54A.484.484 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.63 8.87a.49.49 0 0 0 .12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h4c.25 0 .46-.18.49-.42l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
    />

    <!-- 17. Zap / Lightning -->
    <path
      v-else-if="name === 'zap' || name === 'flash'"
      d="M7 2v11h3v9l7-12h-4l4-8z"
    />

    <!-- 18. Shipping / Truck -->
    <path
      v-else-if="name === 'shipping' || name === 'truck'"
      d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9 1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
    />

    <!-- 19. Notifications / Bell -->
    <path
      v-else-if="name === 'notifications' || name === 'bell'"
      d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
    />

    <!-- 20. Security / Shield -->
    <path
      v-else-if="name === 'security' || name === 'shield' || name === 'admin'"
      d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"
    />

    <!-- 21. Roles / Key -->
    <path
      v-else-if="name === 'roles' || name === 'key'"
      d="M12.65 10A5.99 5.99 0 0 0 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 0 0 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
    />

    <!-- 22. Audit / Logs / Scroll -->
    <path
      v-else-if="name === 'audit' || name === 'logs' || name === 'scroll'"
      d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
    />

    <!-- 23. Plus / Add -->
    <path
      v-else-if="name === 'plus' || name === 'add'"
      d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
    />

    <!-- 24. Search -->
    <path
      v-else-if="name === 'search'"
      d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
    />

    <!-- 25. Refresh -->
    <path
      v-else-if="name === 'refresh'"
      d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
    />

    <!-- 26. Check / Completed -->
    <path
      v-else-if="name === 'check' || name === 'completed' || name === 'success'"
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
    />

    <!-- 27. Clock / Pending -->
    <path
      v-else-if="name === 'clock' || name === 'pending'"
      d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"
    />

    <!-- 28. Edit / Pencil -->
    <path
      v-else-if="name === 'edit' || name === 'pencil'"
      d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
    />

    <!-- 29. Trash / Delete -->
    <path
      v-else-if="name === 'trash' || name === 'delete'"
      d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
    />

    <!-- 30. Nuxt Brand Icon -->
    <path
      v-else-if="name === 'nuxt'"
      d="M18.8 19.5h4.4L15.9 7.1c-.4-.7-1.4-.7-1.8 0l-4.4 7.6 2.3 3.9 3.9-6.7 2.9 7.6zM.8 19.5h10.9L6.3 9.8c-.4-.7-1.4-.7-1.8 0L.8 19.5z"
    />

    <!-- Fallback Circle -->
    <circle v-else cx="12" cy="12" r="8" />
  </svg>
</template>

