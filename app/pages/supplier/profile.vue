<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuth } from '~/composables/useAuth';

definePageMeta({
  layout: 'supplier',
});

useSeoMeta({
  title: 'پروفایل و مشخصات تجاری تأمین‌کننده — ویپ‌لب',
});

const { user, token } = useAuth();
const supplierData = ref<any>(null);
const loading = ref(true);

const loadProfile = async () => {
  loading.value = true;
  try {
    const headers: Record<string, string> = {};
    if (token.value) headers['Authorization'] = `Bearer ${token.value}`;
    const res = await $fetch<any>('/api/v1/suppliers/portal/dashboard', { headers });
    supplierData.value = res.supplier;
  } catch (err) {
    console.warn('Error loading supplier profile:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadProfile();
});
</script>

<template>
  <DashboardUDashboardPanel>
    <template #header>
      <DashboardUDashboardNavbar title="مشخصات و شناسنامه تجاری تأمین‌کننده" badge="Business Profile" />
    </template>

    <div class="max-w-4xl space-y-6">
      <div class="rounded-3xl bg-[#13131F] border border-[#29293B] p-6 md:p-8 shadow-xl">
        <div class="flex items-center gap-4 pb-6 border-b border-[#29293B]">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#3B82F6]/30 to-[#8B5CF6]/30 border border-[#3B82F6]/40 flex items-center justify-center text-3xl shrink-0">
            🏢
          </div>
          <div>
            <h2 class="text-lg font-black text-[#F4F4F8]">
              {{ supplierData?.companyName || user?.supplier?.companyName || 'تأمین‌کننده رسمی' }}
            </h2>
            <p class="text-xs text-[#9696AD] mt-1">عضو شبکه رسمی واردات و توزیع کالای اصل ویپ‌لب</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 text-right">
          <div>
            <span class="text-xs text-[#9696AD] block mb-1">نام شخص رابط و مسئول هماهنگی:</span>
            <span class="font-bold text-sm text-[#F4F4F8]">{{ supplierData?.contactName || user?.name || '---' }}</span>
          </div>

          <div>
            <span class="text-xs text-[#9696AD] block mb-1">شماره تلفن مستقیم:</span>
            <span class="font-mono font-bold text-sm text-[#F4F4F8]">{{ supplierData?.phone || user?.phone || '---' }}</span>
          </div>

          <div>
            <span class="text-xs text-[#9696AD] block mb-1">پست الکترونیکی سازمانی:</span>
            <span class="font-mono text-sm text-[#F4F4F8]">{{ supplierData?.email || user?.email || '---' }}</span>
          </div>

          <div>
            <span class="text-xs text-[#9696AD] block mb-1">نرخ کارمزد پلتفرم:</span>
            <span class="font-mono font-bold text-sm text-[#3B82F6] px-2.5 py-1 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20 inline-block">
              {{ supplierData?.commissionRate || 10 }} درصد
            </span>
          </div>

          <div class="md:col-span-2 p-4 rounded-2xl bg-[#09090F] border border-[#29293B]">
            <span class="text-xs text-[#9696AD] block mb-1">شماره شبای بانکی جهت واریز تسویه (پایا / ساتنا):</span>
            <span class="font-mono font-bold text-sm text-emerald-400 select-all">
              {{ supplierData?.iban || 'شماره شبا در سیستم ثبت نشده است' }}
            </span>
            <span class="text-[11px] text-[#9696AD] block mt-1.5">
              * جهت تغییر شماره شبا یا درصد کارمزد، هماهنگی با واحد مالی و مدیریت ارشد پلتفرم الزامی است.
            </span>
          </div>
        </div>
      </div>
    </div>
  </DashboardUDashboardPanel>
</template>

