<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuth } from '~/composables/useAuth';

definePageMeta({
  layout: 'supplier',
});

useSeoMeta({
  title: 'گزارش مالی و تاریخچه تسویه‌حساب‌ها — پرتال تأمین‌کنندگان',
});

const { token } = useAuth();
const settlements = ref<any[]>([]);
const dashboardStats = ref<any>(null);
const loading = ref(true);

const columns = [
  { key: 'batchNumber', label: 'شماره بچ تسویه', sortable: true },
  { key: 'period', label: 'بازه زمانی دوره مالی' },
  { key: 'totalSalesAmount', label: 'فروش ناخالص دوره', sortable: true, align: 'left' as const },
  { key: 'totalCommissionDeducted', label: 'کارمزد کسر شده', sortable: true, align: 'left' as const },
  { key: 'netPayableAmount', label: 'مبلغ واریزی خالص', sortable: true, align: 'left' as const },
  { key: 'status', label: 'وضعیت تسویه', sortable: true, align: 'center' as const },
  { key: 'payoutReference', label: 'شماره پیگیری واریز بانکی' },
];

const loadFinance = async () => {
  loading.value = true;
  try {
    const headers: Record<string, string> = {};
    if (token.value) headers['Authorization'] = `Bearer ${token.value}`;
    const [settleRes, dashRes] = await Promise.all([
      $fetch<any[]>('/api/v1/suppliers/portal/settlements', { headers }),
      $fetch<any>('/api/v1/suppliers/portal/dashboard', { headers }),
    ]);
    settlements.value = settleRes || [];
    dashboardStats.value = dashRes?.stats || null;
  } catch (err) {
    console.warn('Error loading settlements:', err);
  } finally {
    loading.value = false;
  }
};

const formatPrice = (v: number) => (v || 0).toLocaleString('fa-IR') + ' تومان';

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
  loadFinance();
});
</script>

<template>
  <DashboardUDashboardPanel>
    <template #header>
      <DashboardUDashboardNavbar title="گزارش مالی، کارمزد و تاریخچه تسویه‌حساب‌ها" badge="Earnings" />
    </template>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <DashboardUDashboardKpiCard
        title="فروش ناخالص کل"
        :value="formatPrice(dashboardStats?.totalGrossSales || 0)"
        icon="💰"
        subtitle="فاکتورهای تایید شده"
        :loading="loading"
      />

      <DashboardUDashboardKpiCard
        title="کمیسیون کسر شده پلتفرم"
        :value="formatPrice(dashboardStats?.totalCommissionDeducted || 0)"
        icon="⚡"
        subtitle="نرخ توافقی پلتفرم"
        :loading="loading"
      />

      <DashboardUDashboardKpiCard
        title="درآمد خالص حاصله"
        :value="formatPrice(dashboardStats?.netPayableSales || 0)"
        icon="💎"
        subtitle="مجموع طلب بعد از کسر کارمزد"
        :loading="loading"
      />

      <DashboardUDashboardKpiCard
        title="مانده طلب در انتظار تسویه"
        :value="formatPrice(dashboardStats?.pendingSettlementAmount || 0)"
        icon="🏦"
        subtitle="واریز در موعد تسویه آتی"
        :loading="loading"
      />
    </div>

    <!-- Settlement History Table -->
    <DashboardUDashboardDataTable
      :columns="columns"
      :rows="settlements"
      search-placeholder="جستجوی شماره بچ تسویه یا کد رهگیری پایا..."
      :loading="loading"
    >
      <template #batchNumber="{ row }">
        <div class="font-mono font-bold text-[#60A5FA]">
          {{ row.batchNumber }}
        </div>
      </template>

      <template #period="{ row }">
        <span class="font-mono text-xs text-[#9696AD]">
          {{ formatDate(row.periodStart) }} الی {{ formatDate(row.periodEnd) }}
        </span>
      </template>

      <template #totalSalesAmount="{ row }">
        <span class="font-bold font-mono text-[#F4F4F8]">
          {{ formatPrice(row.totalSalesAmount) }}
        </span>
      </template>

      <template #totalCommissionDeducted="{ row }">
        <span class="font-mono text-[#8B5CF6]">
          {{ formatPrice(row.totalCommissionDeducted) }}
        </span>
      </template>

      <template #netPayableAmount="{ row }">
        <span class="font-bold font-mono text-emerald-400">
          {{ formatPrice(row.netPayableAmount) }}
        </span>
      </template>

      <template #status="{ row }">
        <DashboardUDashboardBadge
          :variant="row.status === 'PAID' ? 'success' : (row.status === 'APPROVED' ? 'blue' : 'warning')"
          :dot="true"
        >
          {{ row.status === 'PAID' ? 'واریز شده' : (row.status === 'APPROVED' ? 'تایید مالی شده' : 'در انتظار تایید') }}
        </DashboardUDashboardBadge>
      </template>

      <template #payoutReference="{ row }">
        <span v-if="row.payoutReference" class="font-mono text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
          {{ row.payoutReference }}
        </span>
        <span v-else class="text-xs text-[#9696AD]">در نوبت واریز</span>
      </template>
    </DashboardUDashboardDataTable>
  </DashboardUDashboardPanel>
</template>

