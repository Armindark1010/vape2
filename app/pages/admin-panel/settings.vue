<script setup lang="ts">
import { ref, onMounted } from 'vue';

definePageMeta({
  layout: 'admin',
});

useSeoMeta({
  title: 'تنظیمات سراسری و نرخ کمیسیون پلتفرم — ویپ‌لب',
});

const commissionRate = ref(10);
const shippingFee = ref(45000);
const freeShippingThreshold = ref(1500000);
const loading = ref(true);
const saving = ref(false);
const saveSuccess = ref(false);

const loadSettings = async () => {
  loading.value = true;
  try {
    const res = await $fetch<{ commissionRate: number }>('/api/v1/admin/settings/commission');
    commissionRate.value = res.commissionRate ?? 10;
  } catch (err) {
    console.warn('Error loading commission rate:', err);
  } finally {
    loading.value = false;
  }
};

const saveCommission = async () => {
  saving.value = true;
  saveSuccess.value = false;
  try {
    await $fetch('/api/v1/admin/settings/commission', {
      method: 'PUT',
      body: {
        commissionRate: Number(commissionRate.value),
      },
    });
    saveSuccess.value = true;
    setTimeout(() => {
      saveSuccess.value = false;
    }, 3000);
  } catch (err: any) {
    alert('خطا در ذخیره نرخ کمیسیون: ' + (err?.data?.message || err.message));
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  loadSettings();
});
</script>

<template>
  <DashboardUDashboardPanel>
    <template #header>
      <DashboardUDashboardNavbar title="تنظیمات پلتفرم و کارمزد مارکت‌پلیس" badge="Settings" />
    </template>

    <div class="max-w-4xl space-y-6">
      <!-- Success Toast Banner -->
      <div
        v-if="saveSuccess"
        class="p-4 rounded-xl bg-[#00DC82]/10 border border-[#00DC82]/25 text-[#00DC82] text-xs flex items-center gap-2"
      >
        <DashboardIcon name="check" :size="16" />
        <span>تنظیمات سراسری با موفقیت در پایگاه داده ذخیره گردید.</span>
      </div>

      <!-- Commission Settings Box -->
      <div class="rounded-xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-5">
        <div class="flex items-center gap-3 pb-3 border-b border-zinc-800">
          <div class="w-8 h-8 rounded-lg bg-[#00DC82]/10 border border-[#00DC82]/20 flex items-center justify-center text-[#00DC82]">
            <DashboardIcon name="zap" :size="18" />
          </div>
          <div>
            <h2 class="text-sm font-bold text-white">کارمزد پلتفرم مارکت‌پلیس (Platform Commission)</h2>
            <p class="text-xs text-zinc-400">درصد پیش‌فرض کسر شده از فروش ناخالص فاکتورهای تأمین‌کنندگان</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-zinc-300 mb-1.5">
              درصد کارمزد پلتفرم (%)
            </label>
            <input
              v-model="commissionRate"
              type="number"
              min="0"
              max="100"
              class="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-[#00DC82]"
            />
            <span class="text-[11px] text-zinc-500 mt-1 block">
              این درصد به هنگام نهایی شدن هر سفارش، به طور خودکار به حساب درآمد پلتفرم منظور می‌شود.
            </span>
          </div>

          <div class="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-2">
            <span class="font-bold text-[#00DC82] block">مثال محاسبه مالی:</span>
            <div class="flex justify-between text-zinc-400">
              <span>فروش ناخالص یک میلیون تومان:</span>
              <span class="font-mono text-white">۱٬۰۰۰٬۰۰۰ تومان</span>
            </div>
            <div class="flex justify-between text-zinc-400">
              <span>درآمد پلتفرم ({{ commissionRate }}%):</span>
              <span class="font-mono text-[#00DC82] font-bold">{{ ((1000000 * commissionRate) / 100).toLocaleString('fa-IR') }} تومان</span>
            </div>
            <div class="flex justify-between text-zinc-400 pt-1 border-t border-zinc-800">
              <span>سهم خالص تأمین‌کننده:</span>
              <span class="font-mono text-white font-bold">{{ ((1000000 * (100 - commissionRate)) / 100).toLocaleString('fa-IR') }} تومان</span>
            </div>
          </div>
        </div>

        <div class="pt-3 flex justify-end">
          <button
            type="button"
            :disabled="saving"
            @click="saveCommission"
            class="px-6 py-2 rounded-xl bg-[#00DC82] text-zinc-950 hover:bg-[#00c575] font-bold text-xs transition disabled:opacity-50 cursor-pointer"
          >
            {{ saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات کمیسیون' }}
          </button>
        </div>
      </div>

      <!-- Shipping & Delivery Settings Box -->
      <div class="rounded-xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-5">
        <div class="flex items-center gap-3 pb-3 border-b border-zinc-800">
          <div class="w-8 h-8 rounded-lg bg-[#00DC82]/10 border border-[#00DC82]/20 flex items-center justify-center text-[#00DC82]">
            <DashboardIcon name="shipping" :size="18" />
          </div>
          <div>
            <h2 class="text-sm font-bold text-white">حمل‌ونقل، پیک و ارسال</h2>
            <p class="text-xs text-zinc-400">هزینه پایه پست پیشتاز و سقف ارسال رایگان برای خریداران</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-zinc-300 mb-1.5">هزینه ثابت ارسال (تومان)</label>
            <input
              v-model="shippingFee"
              type="number"
              class="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-[#00DC82]"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-zinc-300 mb-1.5">حداقل خرید برای ارسال رایگان (تومان)</label>
            <input
              v-model="freeShippingThreshold"
              type="number"
              class="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-[#00DC82]"
            />
          </div>
        </div>
      </div>
    </div>
  </DashboardUDashboardPanel>
</template>
