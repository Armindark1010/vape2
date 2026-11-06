<script setup lang="ts">
import { ref, onMounted } from 'vue';

definePageMeta({
  layout: 'admin',
});

useSeoMeta({
  title: 'مدیریت و پیگیری سفارشات — ویپ‌لب',
});

const orders = ref<any[]>([]);
const loading = ref(true);
const statusFilter = ref('all');
const selectedOrder = ref<any | null>(null);
const modalOpen = ref(false);
const updating = ref(false);

const columns = [
  { key: 'orderNumber', label: 'شماره سفارش', sortable: true },
  { key: 'customer', label: 'مشتری و اطلاعات تماس' },
  { key: 'createdAt', label: 'تاریخ ثبت', sortable: true },
  { key: 'courierInfo', label: 'ارسال و کد رهگیری' },
  { key: 'status', label: 'وضعیت سفارش', sortable: true, align: 'center' as const },
  { key: 'total', label: 'مبلغ پرداختی', sortable: true, align: 'left' as const },
  { key: 'actions', label: 'اقدامات', align: 'center' as const },
];

const loadOrders = async () => {
  loading.value = true;
  try {
    const url = statusFilter.value === 'all' ? '/api/admin/orders' : `/api/admin/orders?status=${statusFilter.value}`;
    const res = await $fetch<{ orders: any[] }>(url);
    orders.value = res.orders || [];
  } catch (err) {
    console.warn('Error loading orders:', err);
  } finally {
    loading.value = false;
  }
};

const openDetails = (order: any) => {
  selectedOrder.value = { ...order };
  modalOpen.value = true;
};

const saveOrder = async () => {
  if (!selectedOrder.value) return;
  updating.value = true;
  try {
    await $fetch('/api/admin/orders', {
      method: 'PATCH',
      body: {
        id: selectedOrder.value.id,
        status: selectedOrder.value.status,
        trackingCode: selectedOrder.value.trackingCode,
        courier: selectedOrder.value.courier,
      },
    });
    modalOpen.value = false;
    await loadOrders();
  } catch (err: any) {
    alert('خطا در ذخیره وضعیت سفارش: ' + (err?.data?.message || err.message));
  } finally {
    updating.value = false;
  }
};

const getStatusBadgeVariant = (st: string) => {
  switch (st) {
    case 'delivered':
    case 'paid':
      return 'success';
    case 'processing':
    case 'shipped':
      return 'blue';
    case 'pending':
      return 'warning';
    case 'cancelled':
    case 'refunded':
      return 'danger';
    default:
      return 'neutral';
  }
};

const getStatusLabel = (st: string) => {
  switch (st) {
    case 'pending': return 'در انتظار پرداخت';
    case 'paid': return 'پرداخت شده';
    case 'processing': return 'در حال پردازش انبار';
    case 'shipped': return 'تحویل پست / پیک';
    case 'delivered': return 'تحویل شده';
    case 'cancelled': return 'لغو شده';
    default: return st;
  }
};

const formatCurrency = (val: number) => {
  return (val || 0).toLocaleString('fa-IR') + ' تومان';
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '---';
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
};

onMounted(() => {
  loadOrders();
});
</script>

<template>
  <DashboardUDashboardPanel>
    <template #header>
      <DashboardUDashboardNavbar title="مدیریت و پردازش سفارشات مشتریان" badge="Orders">
        <template #right>
          <div class="flex items-center gap-2">
            <!-- Status Filter Dropdown -->
            <select
              v-model="statusFilter"
              @change="loadOrders"
              class="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#00DC82]"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="pending">در انتظار پرداخت</option>
              <option value="paid">پرداخت شده</option>
              <option value="processing">در حال پردازش</option>
              <option value="shipped">ارسال شده</option>
              <option value="delivered">تحویل شده</option>
              <option value="cancelled">لغو شده</option>
            </select>
          </div>
        </template>
      </DashboardUDashboardNavbar>
    </template>

    <!-- KPI Summary -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <DashboardUDashboardKpiCard
        title="تعداد سفارشات لود شده"
        :value="orders.length.toLocaleString('fa-IR') + ' سفارش'"
        icon="orders"
        subtitle="بر اساس فیلتر انتخابی"
        :loading="loading"
      />

      <DashboardUDashboardKpiCard
        title="مجموع مبالغ"
        :value="formatCurrency(orders.reduce((sum, o) => sum + o.total, 0))"
        icon="revenue"
        subtitle="ارزش ناخالص فاکتورها"
        :loading="loading"
      />

      <DashboardUDashboardKpiCard
        title="آماده ارسال / پردازش"
        :value="orders.filter(o => ['paid', 'processing'].includes(o.status)).length.toLocaleString('fa-IR')"
        icon="products"
        subtitle="نیازمند بسته‌بندی انبار"
        :loading="loading"
      />

      <DashboardUDashboardKpiCard
        title="تحویل شده به خریدار"
        :value="orders.filter(o => o.status === 'delivered').length.toLocaleString('fa-IR')"
        icon="check"
        subtitle="تکمیل و بسته شده"
        :loading="loading"
      />
    </div>

    <!-- Orders Data Table -->
    <DashboardUDashboardDataTable
      :columns="columns"
      :rows="orders"
      search-placeholder="جستجوی شماره سفارش، نام خریدار، تلفن یا کد رهگیری..."
      :loading="loading"
    >
      <template #orderNumber="{ row }">
        <div class="font-mono font-bold text-[#00DC82]">
          #{{ row.orderNumber || row.id }}
        </div>
      </template>

      <template #customer="{ row }">
        <div>
          <div class="font-bold text-white">{{ row.customer?.name || 'مشتری' }}</div>
          <div class="text-[10.5px] text-zinc-500 font-mono">{{ row.customer?.phone || row.customer?.email }}</div>
        </div>
      </template>

      <template #createdAt="{ row }">
        <span class="font-mono text-xs text-zinc-400">
          {{ formatDate(row.createdAt) }}
        </span>
      </template>

      <template #courierInfo="{ row }">
        <div>
          <div class="font-medium text-zinc-200 text-xs">{{ row.courier || 'پست پیشتاز' }}</div>
          <div v-if="row.trackingCode" class="text-[10.5px] text-[#00DC82] font-mono">
            {{ row.trackingCode }}
          </div>
          <div v-else class="text-[10px] text-zinc-500">بدون کد رهگیری</div>
        </div>
      </template>

      <template #status="{ row }">
        <DashboardUDashboardBadge
          :variant="getStatusBadgeVariant(row.status)"
          :dot="true"
        >
          {{ getStatusLabel(row.status) }}
        </DashboardUDashboardBadge>
      </template>

      <template #total="{ row }">
        <span class="font-bold font-mono text-white">
          {{ formatCurrency(row.total) }}
        </span>
      </template>

      <template #actions="{ row }">
        <button
          type="button"
          @click="openDetails(row)"
          class="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-200 hover:text-white transition cursor-pointer"
        >
          جزئیات و ویرایش
        </button>
      </template>
    </DashboardUDashboardDataTable>

    <!-- Modal for Order Review and Status Update -->
    <DashboardUDashboardModal
      v-model="modalOpen"
      :title="`مدیریت سفارش #${selectedOrder?.orderNumber || selectedOrder?.id}`"
      description="اقلام سفارش، آدرس ارسال و کد رهگیری مرسوله پستی"
      max-width="lg"
    >
      <div v-if="selectedOrder" class="space-y-4 text-right">
        <!-- Customer Details Box -->
        <div class="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 grid grid-cols-2 gap-3 text-xs">
          <div>
            <span class="text-zinc-500 block">خریدار:</span>
            <span class="font-bold text-white">{{ selectedOrder.customer?.name }}</span>
          </div>
          <div>
            <span class="text-zinc-500 block">تلفن:</span>
            <span class="font-mono text-white">{{ selectedOrder.customer?.phone }}</span>
          </div>
          <div class="col-span-2">
            <span class="text-zinc-500 block">نشانی کامل پستی:</span>
            <span class="text-zinc-300">{{ selectedOrder.customer?.address }}, {{ selectedOrder.customer?.city }}</span>
          </div>
        </div>

        <!-- Items list -->
        <div>
          <h4 class="text-xs font-bold text-zinc-400 mb-2 uppercase">اقلام سبد خرید</h4>
          <div class="divide-y divide-zinc-800 border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950/60">
            <div
              v-for="item in selectedOrder.items || []"
              :key="item.id"
              class="p-2.5 flex items-center justify-between text-xs"
            >
              <div class="flex items-center gap-2.5">
                <span class="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center text-[10px] text-[#00DC82] font-mono">
                  {{ item.quantity }}×
                </span>
                <span class="font-medium text-white">{{ item.productName }}</span>
              </div>
              <span class="font-mono text-zinc-400">{{ formatCurrency(item.price * item.quantity) }}</span>
            </div>
          </div>
        </div>

        <!-- Form fields -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label class="block text-xs font-bold text-zinc-300 mb-1.5">وضعیت پردازش</label>
            <select
              v-model="selectedOrder.status"
              class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#00DC82]"
            >
              <option value="pending">در انتظار پرداخت</option>
              <option value="paid">پرداخت شده</option>
              <option value="processing">در حال پردازش انبار</option>
              <option value="shipped">تحویل پیک / پست</option>
              <option value="delivered">تحویل مشتری شده</option>
              <option value="cancelled">لغو شده</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-zinc-300 mb-1.5">سرویس ارسال</label>
            <input
              v-model="selectedOrder.courier"
              type="text"
              class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#00DC82]"
            />
          </div>

          <div class="sm:col-span-2">
            <label class="block text-xs font-bold text-zinc-300 mb-1.5">کد رهگیری مرسوله پستی</label>
            <input
              v-model="selectedOrder.trackingCode"
              type="text"
              placeholder="کد ۲۴ رقمی پست یا بارنامه..."
              class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-[#00DC82]"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <button
          type="button"
          @click="modalOpen = false"
          class="px-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-zinc-400 hover:text-white transition cursor-pointer"
        >
          انصراف
        </button>
        <button
          type="button"
          :disabled="updating"
          @click="saveOrder"
          class="px-5 py-2 rounded-xl bg-[#00DC82] text-zinc-950 hover:bg-[#00c575] font-bold text-xs transition disabled:opacity-50 cursor-pointer"
        >
          {{ updating ? 'در حال ثبت...' : 'ذخیره تغییرات' }}
        </button>
      </template>
    </DashboardUDashboardModal>
  </DashboardUDashboardPanel>
</template>
