<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useRestockAlerts } from "~/composables/useRestockAlerts";
import { useAuth } from "~/composables/useAuth";
import BottomSheet from "~/components/vapor/BottomSheet.vue";
import { BellIcon, CheckIcon, ShieldIcon } from "~/components/vapor/VIcons";

const { isRestockModalOpen, activeRestockProduct, closeRestockModal, subscribe } = useRestockAlerts();
const { user, isLoggedIn } = useAuth();

const phone = ref("");
const loading = ref(false);
const errorMsg = ref<string | null>(null);

watch(
  () => isRestockModalOpen.value,
  (open) => {
    if (open) {
      phone.value = user.value?.phoneNumber || "";
      errorMsg.value = null;
      loading.value = false;
    }
  }
);

const isValidPhone = computed(() => {
  return /^09[0-9]{9}$/.test(phone.value.trim());
});

const onSubmit = async () => {
  if (!isLoggedIn.value && !isValidPhone.value) {
    errorMsg.value = "لطفاً شماره موبایل ۱۱ رقمی معتبر وارد کنید (مثال: 09123456789)";
    return;
  }

  loading.value = true;
  errorMsg.value = null;

  try {
    await subscribe(phone.value.trim());
  } catch (err: any) {
    errorMsg.value = err?.message || "خطا در ثبت درخواست";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <BottomSheet
    :open="isRestockModalOpen"
    label="اطلاع‌رسانی موجودی کالا"
    snap="auto"
    @close="closeRestockModal"
  >
    <div class="px-6 pt-2 pb-6 text-right">
      <!-- هدر مدال -->
      <div class="flex items-center gap-3">
        <div class="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-vio/25 to-ice/20 text-vio border border-vio/30 shadow-[0_0_20px_rgba(167,139,250,0.3)]">
          <BellIcon :size="24" :filled="true" />
        </div>
        <div>
          <h2 class="text-[17px] font-extrabold text-snow">موجود شد خبرم کن!</h2>
          <p class="text-[12px] text-dim">اطلاع‌رسانی سریع به محض شارژ مجدد در انبار</p>
        </div>
      </div>

      <!-- کادر محصول -->
      <div class="mt-4 rounded-2xl border border-white/10 bg-white/4 p-3.5">
        <span class="text-[11px] font-bold text-mist">محصول انتخابی شما:</span>
        <p class="mt-1 text-[14px] font-extrabold text-snow" dir="ltr">
          {{ activeRestockProduct?.name }}
        </p>
      </div>

      <form class="mt-5 space-y-4" @submit.prevent="onSubmit">
        <!-- ورودی شماره موبایل -->
        <div>
          <label for="restock-phone" class="mb-1.5 block text-[12px] font-bold text-mist">
            شماره موبایل جهت دریافت پیامک موجودی
          </label>
          <input
            id="restock-phone"
            v-model="phone"
            type="tel"
            inputmode="numeric"
            placeholder="09123456789"
            dir="ltr"
            maxlength="11"
            class="input h-13 text-center text-[15px] font-bold tracking-wider"
            :class="errorMsg ? 'border-blush' : ''"
          />
          <p v-if="errorMsg" class="mt-1.5 text-[11.5px] font-bold text-blush">
            {{ errorMsg }}
          </p>
        </div>

        <div class="flex items-center gap-2 text-[11px] text-dim">
          <ShieldIcon :size="15" class="text-neon shrink-0" />
          <span>شماره شما محفوظ است و تنها جهت ارسال پیامک موجودی این کالا استفاده می‌شود.</span>
        </div>

        <!-- دکمه ثبت -->
        <button
          type="submit"
          :disabled="loading || (!isLoggedIn && !isValidPhone)"
          class="pressable mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-vio to-ice text-[14.5px] font-extrabold text-ink glow-v disabled:opacity-40 cursor-pointer"
        >
          <span v-if="loading">در حال ثبت درخواست...</span>
          <span v-else class="flex items-center gap-2">
            <CheckIcon :size="18" :sw="2.4" />
            ثبت درخواست اطلاع‌رسانی
          </span>
        </button>
      </form>
    </div>
  </BottomSheet>
</template>
