<script setup lang="ts">
import { ref, onMounted } from 'vue';

definePageMeta({
  layout: 'admin',
});

useSeoMeta({
  title: 'مدیریت مالی، کمیسیون و تسویه‌حساب‌ها — ویپ‌لب',
});

const settlements = ref<any[]>([]);
const suppliers = ref<any[]>([]);
const loading = ref(true);
const generating = ref(false);
const payModalOpen = ref(false);
const selectedSettlement = ref<any | null>(null);
const payoutRefInput = ref('');
const paying = ref(false);

const columns = [
  { key: 'batchNumber', label: 'شماره بچ تسویه', sortable: true },
  { key: 'supplier', label: 'تأمین‌کننده' },
  { key: 'period', label: 'بازه زمانی محاسباتی' },
  { key: 'totalSales', label: 'فروش ناخالص', sortable: true, align: 'left' as const },
  { key: 'commission', label: 'کمیسیون کسر شده', sortable: true, align: 'left' as const },
  { key: 'netPayable', label: 'خالص پرداختی', sortable: true, align: 'left' as const },
  { key: 'status', label: 'وضعیت تسویه', sortable: true, align: 'center' as const },
  { key: 'actions', label: 'اقدامات', align: 'center' as const },
];

const loadFinanceData = async () => {
  loading.value = true;
  try {
    const [settleRes, supRes] = await Promise.all([
      $fetch<any[]>('/api/v1/admin/settlements').catch(() => []),
      $fetch<any[]>('/api/v1/suppliers/admin/list').catch(() => []),
    ]);
    settlements.value = settleRes || [];
    suppliers.value = supRes || [];
  } catch (err) {
    console.warn('Error loading settlements:', err);
  } finally {
    loading.value = false;
  }
};

const generateBatch = async () => {
  if (suppliers.value.length === 0) {
    alert('تأمین‌کننده‌ای در سیستم یافت نشد.');
    return;
  }

  const primarySupplier = suppliers.value[0];
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  if (!confirm(`آیا مایلید بچ تسویه هفتگی برای "${primarySupplier.companyName}" محاسبه و صادر شود؟`)) return;

  generating.value = true;
  try {
    await $fetch('/api/v1/admin/settlements/generate-weekly', {
      method: 'POST',
      body: {
        supplierId: primarySupplier.id,
        periodStart: weekAgo.toISOString(),
        periodEnd: now.toISOString(),
      },
    });
    alert('بچ تسویه با موفقیت محاسبه و به صف تایید اضافه گردید.');
    await loadFinanceData();
  } catch (err: any) {
    alert('خطا در محاسبه تسویه: ' + (err?.data?.message || err.message));
  } finally {
    generating.value = false;
  }
};

const approveBatch = async (batch: any) => {
  if (!confirm(`آیا از تایید مالی بچ #${batch.batchNumber} اطمینان دارید؟`)) return;
  try {
    await $fetch(`/api/v1/admin/settlements/${batch.id}/approve`, {
      method: 'PATCH',
    });
    alert('بچ تسویه با موفقیت تایید شد و آماده واریز بانکی پایا/ساتنا است.');
    await loadFinanceData();
  } catch (err: any) {
    alert('خطا در تایید تسویه: ' + (err?.data?.message || err.message));
  }
};

const openPayModal = (batch: any) => {
  selectedSettlement.value = batch;
  payoutRefInput.value = 'PAYA-' + Math.floor(10000000 + Math.random() * 90000000);
  payModalOpen.value = true;
};

const confirmPay = async () => {
  if (!selectedSettlement.value || !payoutRefInput.value) return;
  paying.value = true;
  try {
    await $fetch(`/api/v1/admin/settlements/${selectedSettlement.value.id}/pay`, {
      method: 'PATCH',
      body: {
        payoutReference: payoutRefInput.value,
      },
    });
    payModalOpen.value = false;
    alert('تسویه به عنوان پرداخت‌شده در سیستم ثبت گردید.');
    await loadFinanceData();
  } catch (err: any) {
    alert('خطا در ثبت پرداخت: ' + (err?.data?.message || err.message));
  } finally {
    paying.value = false;
  }
};

const formatCurrency = (val: number) => {
  return (val || 0).toLocaleString('fa-IR') + ' تومان';
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '---';
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      month: 'numeric',
      day: 'numeric',
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
};

onMounted(() => {
  loadFinanceData();
});
</script>

<template>
  <DashboardUDashboardPanel>
    <template #header>
      <DashboardUDashboardNavbar title="مدیریت مالی و تسویه‌حساب تأمین‌کنندگان" badge="Finance">
        <template #right>
          <button
            type="button"
            :disabled="generating"
            @click="generateBatch"
            class="px-3.5 py-1.5 rounded-xl bg-[#00DC82] text-zinc-950 font-bold text-xs hover:bg-[#00c575] transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <DashboardIcon name="zap" :size="15" />
            <span>{{ generating ? 'در حال محاسبه...' : 'محاسبه بچ تسویه هفتگی' }}</span>
          </button>
        </template>
      </DashboardUDashboardNavbar>
    </template>

    <!-- KPI Summary -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <DashboardUDashboardKpiCard
        title="کل تسویه‌های ثبت‌شده"
        :value="settlements.length.toLocaleString('fa-IR') + ' صورت‌حساب'"
        icon="settlements"
        subtitle="مجموع دوره‌های مالی"
        :loading="loading"
      />

      <DashboardUDashboardKpiCard
        title="خالص پرداختی به تأمین‌کنندگان"
        :value="formatCurrency(settlements.filter(s => s.status === 'PAID').reduce((sum, s) => sum + s.netPayableAmount, 0))"
        icon="finance"
        subtitle="واریز موفق از طریق پایا/ساتنا"
        :loading="loading"
      />

      <DashboardUDashboardKpiCard
        title="در انتظار تایید مدیریت"
        :value="settlements.filter(s => s.status === 'PENDING_REVIEW').length.toLocaleString('fa-IR') + ' بچ'"
        icon="clock"
        subtitle="نیازمند بازبینی حسابداری"
        :loading="loading"
      />

      <DashboardUDashboardKpiCard
        title="آماده واریز بانکی"
        :value="settlements.filter(s => s.status === 'APPROVED').length.toLocaleString('fa-IR') + ' بچ'"
        icon="check"
        subtitle="تایید شده توسط مدیر مالی"
        :loading="loading"
      />
    </div>

    <!-- Settlements Table -->
    <DashboardUDashboardDataTable
      :columns="columns"
      :rows="settlements"
      search-placeholder="جستجوی شماره بچ تسویه، تأمین‌کننده یا شماره پیگیری..."
      :loading="loading"
    >
      <template #batchNumber="{ row }">
        <div class="font-mono font-bold text-[#00DC82]">
          {{ row.batchNumber }}
        </div>
      </template>

      <template #supplier="{ row }">
        <div>
          <div class="font-bold text-white">{{ row.supplier?.companyName || 'تأمین‌کننده' }}</div>
          <div class="text-[10px] text-zinc-500 font-mono">{{ row.supplier?.iban || 'بدون شبا' }}</div>
        </div>
      </template>

      <template #period="{ row }">
        <span class="font-mono text-xs text-zinc-400">
          {{ formatDate(row.periodStart) }} الی {{ formatDate(row.periodEnd) }}
        </span>
      </template>

      <template #totalSales="{ row }">
        <span class="font-bold font-mono text-white">
          {{ formatCurrency(row.totalSalesAmount) }}
        </span>
      </template>

      <template #commission="{ row }">
        <span class="font-bold font-mono text-[#00DC82]">
          {{ formatCurrency(row.totalCommissionDeducted) }}
        </span>
      </template>

      <template #netPayable="{ row }">
        <span class="font-bold font-mono text-[#00DC82]">
          {{ formatCurrency(row.netPayableAmount) }}
        </span>
      </template>

      <template #status="{ row }">
        <DashboardUDashboardBadge
          :variant="row.status === 'PAID' ? 'success' : (row.status === 'APPROVED' ? 'blue' : 'warning')"
          :dot="true"
        >
          {{ row.status === 'PAID' ? 'پرداخت شده' : (row.status === 'APPROVED' ? 'تایید شده (آماده پرداخت)' : 'در انتظار بررسی') }}
        </DashboardUDashboardBadge>
      </template>

      <template #actions="{ row }">
        <div class="flex items-center justify-center gap-1.5">
          <button
            v-if="row.status === 'PENDING_REVIEW'"
            type="button"
            @click="approveBatch(row)"
            class="px-2.5 py-1 rounded-lg bg-[#00DC82]/10 border border-[#00DC82]/30 text-[#00DC82] hover:bg-[#00DC82]/20 text-xs transition cursor-pointer"
          >
            تایید مالی
          </button>

          <button
            v-else-if="row.status === 'APPROVED'"
            type="button"
            @click="openPayModal(row)"
            class="px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 text-xs transition cursor-pointer"
          >
            ثبت واریز
          </button>

          <span v-else class="text-[10px] text-[#00DC82] font-mono px-2 py-0.5 bg-[#00DC82]/10 rounded">
            کد: {{ row.payoutReference || 'تکمیل' }}
          </span>
        </div>
      </template>
    </DashboardUDashboardDataTable>

    <!-- Pay Payout Reference Modal -->
    <DashboardUDashboardModal
      v-model="payModalOpen"
      title="ثبت شماره پیگیری واریز بانکی (پایا / ساتنا)"
      description="ثبت شماره پیگیری رسید انتقال وجه بین‌بانکی به حساب تأمین‌کننده"
      max-width="md"
    >
      <div v-if="selectedSettlement" class="space-y-4 text-right">
        <div class="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-zinc-500">شرکت مقصد:</span>
            <span class="font-bold text-white">{{ selectedSettlement.supplier?.companyName }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-zinc-500">شماره شبای مقصد:</span>
            <span class="font-mono text-white">{{ selectedSettlement.supplier?.iban }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-zinc-500">مبلغ خالص واریز:</span>
            <span class="font-bold font-mono text-[#00DC82]">{{ formatCurrency(selectedSettlement.netPayableAmount) }}</span>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-zinc-300 mb-1.5">
            شماره پیگیری تراکنش بانکی (Reference Code)
          </label>
          <input
            v-model="payoutRefInput"
            type="text"
            class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-[#00DC82]"
            required
          />
        </div>
      </div>

      <template #footer>
        <button
          type="button"
          @click="payModalOpen = false"
          class="px-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-zinc-400 hover:text-white transition cursor-pointer"
        >
          انصراف
        </button>
        <button
          type="button"
          :disabled="paying"
          @click="confirmPay"
          class="px-5 py-2 rounded-xl bg-[#00DC82] text-zinc-950 hover:bg-[#00c575] font-bold text-xs transition disabled:opacity-50 cursor-pointer"
        >
          {{ paying ? 'در حال ثبت...' : 'تایید نهایی واریز' }}
        </button>
      </template>
    </DashboardUDashboardModal>
  </DashboardUDashboardPanel>
</template>

