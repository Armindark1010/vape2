<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuth } from '~/composables/useAuth';

definePageMeta({
  layout: 'supplier',
});

useSeoMeta({
  title: 'سفارشات کالاهای من — پرتال تأمین‌کنندگان',
});

const { token } = useAuth();
const orders = ref<any[]>([]);
const loading = ref(true);

const columns = [
  { key: 'orderNumber', label: 'شماره فاکتور سفارش', sortable: true },
  { key: 'productName', label: 'کالای فروخته شده' },
  { key: 'quantity', label: 'تعداد', sortable: true, align: 'center' as const },
  { key: 'grossTotal', label: 'مبلغ ناخالص فروش', sortable: true, align: 'left' as const },
  { key: 'platformCommission', label: 'کارمزد کسر شده', sortable: true, align: 'left' as const },
  { key: 'supplierPayable', label: 'خالص طلب شما', sortable: true, align: 'left' as const },
  { key: 'orderStatus', label: 'وضعیت فاکتور', sortable: true, align: 'center' as const },
  { key: 'isSettled', label: 'وضعیت تسویه', sortable: true, align: 'center' as const },
];

const loadOrders = async () => {
  loading.value = true;
  try {
    const headers: Record<string, string> = {};
    if (token.value) headers['Authorization'] = `Bearer ${token.value}`;
    const res = await $fetch<any[]>('/api/v1/suppliers/portal/orders', { headers });
    orders.value = res || [];
  } catch (err) {
    console.warn('Error loading supplier orders:', err);
  } finally {
    loading.value = false;
  }
};

const formatPrice = (v: number) => (v || 0).toLocaleString('fa-IR') + ' تومان';

const getStatusBadge = (st: string) => {
  switch (st) {
    case 'delivered':
    case 'paid':
      return 'success';
    case 'processing':
    case 'shipped':
      return 'blue';
    case 'pending':
      return 'warning';
    default:
      return 'neutral';
  }
};

const getStatusLabel = (st: string) => {
  switch (st) {
    case 'pending': return 'معلق';
    case 'paid': return 'پرداخت شده';
    case 'processing': return 'در حال پردازش';
    case 'shipped': return 'ارسال شده';
    case 'delivered': return 'تحویل شده';
    case 'cancelled': return 'لغو شده';
    default: return st;
  }
};

onMounted(() => {
  loadOrders();
});
</script>

<template>
  <DashboardUDashboardPanel>
    <template #header>
      <DashboardUDashboardNavbar title="سفارشات فروش کالاهای این شرکت" badge="Sales Orders" />
    </template>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <DashboardUDashboardKpiCard
        title="تعداد کل اقلام سفارش"
        :value="orders.length.toLocaleString('fa-IR') + ' مورد'"
        icon="🛍️"
        subtitle="اقلام فروخته شده من"
        :loading="loading"
      />

      <DashboardUDashboardKpiCard
        title="مجموع فروش ناخالص"
        :value="formatPrice(orders.reduce((sum, o) => sum + o.grossTotal, 0))"
        icon="💰"
        subtitle="قیمت مصرف‌کننده فاکتورها"
        :loading="loading"
      />

      <DashboardUDashboardKpiCard
        title="سهم خالص شما"
        :value="formatPrice(orders.reduce((sum, o) => sum + o.supplierPayable, 0))"
        icon="💸"
        subtitle="پس از کسر کمیسیون پلتفرم"
        :loading="loading"
      />

      <DashboardUDashboardKpiCard
        title="تسویه‌نشده در صف پرداخت"
        :value="formatPrice(orders.filter(o => !o.isSettled).reduce((sum, o) => sum + o.supplierPayable, 0))"
        icon="⏳"
        subtitle="واریز در بچ تسویه هفتگی"
        :loading="loading"
      />
    </div>

    <!-- Data Table -->
    <DashboardUDashboardDataTable
      :columns="columns"
      :rows="orders"
      search-placeholder="جستجوی شماره سفارش یا نام محصول..."
      :loading="loading"
    >
      <template #orderNumber="{ row }">
        <div class="font-mono font-bold text-[#60A5FA]">
          #{{ row.orderNumber || row.orderId }}
        </div>
      </template>

      <template #productName="{ row }">
        <span class="font-medium text-[#F4F4F8] max-w-xs truncate block">
          {{ row.productName }}
        </span>
      </template>

      <template #quantity="{ row }">
        <span class="font-mono font-bold text-[#F4F4F8]">
          {{ row.quantity }} عدد
        </span>
      </template>

      <template #grossTotal="{ row }">
        <span class="font-mono font-bold text-[#F4F4F8]">
          {{ formatPrice(row.grossTotal) }}
        </span>
      </template>

      <template #platformCommission="{ row }">
        <span class="font-mono text-[#8B5CF6]">
          {{ formatPrice(row.platformCommission) }}
        </span>
      </template>

      <template #supplierPayable="{ row }">
        <span class="font-mono font-bold text-emerald-400">
          {{ formatPrice(row.supplierPayable) }}
        </span>
      </template>

      <template #orderStatus="{ row }">
        <DashboardUDashboardBadge :variant="getStatusBadge(row.orderStatus)" :dot="true">
          {{ getStatusLabel(row.orderStatus) }}
        </DashboardUDashboardBadge>
      </template>

      <template #isSettled="{ row }">
        <DashboardUDashboardBadge :variant="row.isSettled ? 'success' : 'warning'" :dot="true">
          {{ row.isSettled ? 'تسویه شده' : 'در انتظار دوره' }}
        </DashboardUDashboardBadge>
      </template>
    </DashboardUDashboardDataTable>
  </DashboardUDashboardPanel>
</template>

