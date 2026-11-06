<script setup lang="ts">
import { ref, onMounted } from 'vue';

definePageMeta({
  layout: 'admin',
});

useSeoMeta({
  title: 'داشبورد مدیریت ارشد ویپ‌لب',
});

interface StatsData {
  totalRevenue: number;
  revenueGrowth: number;
  totalOrders: number;
  ordersGrowth: number;
  pendingOrdersCount: number;
  completedOrdersCount: number;
  totalCustomers: number;
  activeSuppliers: number;
  totalProducts: number;
  pendingSettlementsCount: number;
  platformCommission: number;
  timeline: Array<{ date: string; revenue: number; orders: number; commission: number }>;
  categoryDistribution: Array<{ name: string; slug: string; productCount: number }>;
}

const stats = ref<StatsData | null>(null);
const orders = ref<any[]>([]);
const loading = ref(true);
const selectedOrder = ref<any | null>(null);
const orderModalOpen = ref(false);
const updatingOrder = ref(false);

const orderColumns = [
  { key: 'orderNumber', label: 'شماره سفارش', sortable: true },
  { key: 'customer', label: 'مشتری و شماره تماس' },
  { key: 'createdAt', label: 'تاریخ ثبت', sortable: true },
  { key: 'status', label: 'وضعیت سفارش', sortable: true, align: 'center' as const },
  { key: 'total', label: 'مبلغ فاکتور', sortable: true, align: 'left' as const },
  { key: 'actions', label: 'عملیات', align: 'center' as const },
];

const loadData = async () => {
  loading.value = true;
  try {
    const [statsRes, ordersRes] = await Promise.all([
      $fetch<StatsData>('/api/admin/stats'),
      $fetch<{ orders: any[] }>('/api/admin/orders'),
    ]);
    stats.value = statsRes;
    orders.value = ordersRes.orders || [];
  } catch (err) {
    console.warn('Error loading admin dashboard data:', err);
  } finally {
    loading.value = false;
  }
};

const openOrderDetails = (order: any) => {
  selectedOrder.value = { ...order };
  orderModalOpen.value = true;
};

const saveOrderStatus = async () => {
  if (!selectedOrder.value) return;
  updatingOrder.value = true;
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
    orderModalOpen.value = false;
    await loadData();
  } catch (err: any) {
    alert('خطا در بروزرسانی سفارش: ' + (err?.data?.message || err.message));
  } finally {
    updatingOrder.value = false;
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
    case 'shipped': return 'تحویل پیک / پست';
    case 'delivered': return 'تحویل مشتری شده';
    case 'cancelled': return 'لغو شده';
    case 'refunded': return 'مسترد شده';
    default: return st || 'نامشخص';
  }
};

const formatCurrency = (val: number) => {
  return (val || 0).toLocaleString('fa-IR') + ' تومان';
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '---';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('fa-IR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateStr;
  }
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <DashboardUDashboardPanel>
    <!-- Navbar Header -->
    <template #header>
      <DashboardUDashboardNavbar title="داشبورد نظارت و آمار جامع" badge="Real-time">
        <template #right>
          <button
            @click="loadData"
            class="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-400 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
            title="بروزرسانی داده‌ها"
          >
            <DashboardIcon name="refresh" :size="14" />
            <span class="hidden sm:inline">بروزرسانی</span>
          </button>
        </template>
      </DashboardUDashboardNavbar>
    </template>

    <!-- 8 Real KPI Cards Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
      <!-- 1. Total Revenue -->
      <DashboardUDashboardKpiCard
        title="درآمد ناخالص کل"
        :value="formatCurrency(stats?.totalRevenue || 0)"
        icon="revenue"
        :growth="stats?.revenueGrowth"
        subtitle="فروش موفق کل پلتفرم"
        :loading="loading"
      />

      <!-- 2. Total Orders -->
      <DashboardUDashboardKpiCard
        title="تعداد کل سفارشات"
        :value="(stats?.totalOrders || 0).toLocaleString('fa-IR') + ' سفارش'"
        icon="orders"
        :growth="stats?.ordersGrowth"
        subtitle="مجموع تراکنش‌های ثبت شده"
        :loading="loading"
      />

      <!-- 3. Pending Orders -->
      <DashboardUDashboardKpiCard
        title="سفارشات معلق"
        :value="(stats?.pendingOrdersCount || 0).toLocaleString('fa-IR') + ' مورد'"
        icon="clock"
        subtitle="نیاز به پیگیری یا پرداخت"
        :loading="loading"
      />

      <!-- 4. Completed Orders -->
      <DashboardUDashboardKpiCard
        title="سفارشات تکمیل شده"
        :value="(stats?.completedOrdersCount || 0).toLocaleString('fa-IR') + ' سفارش'"
        icon="check"
        subtitle="ارسال و تحویل موفق"
        :loading="loading"
      />

      <!-- 5. Total Customers -->
      <DashboardUDashboardKpiCard
        title="خریداران ثبت‌نامی"
        :value="(stats?.totalCustomers || 0).toLocaleString('fa-IR') + ' کاربر'"
        icon="customers"
        subtitle="مشتریان واقعی پلتفرم"
        :loading="loading"
      />

      <!-- 6. Active Suppliers -->
      <DashboardUDashboardKpiCard
        title="تأمین‌کنندگان فعال"
        :value="(stats?.activeSuppliers || 0).toLocaleString('fa-IR') + ' شرکت'"
        icon="suppliers"
        subtitle="تأمین‌کنندگان رسمی همکار"
        :loading="loading"
      />

      <!-- 7. Total Products -->
      <DashboardUDashboardKpiCard
        title="تنوع کالاها در انبار"
        :value="(stats?.totalProducts || 0).toLocaleString('fa-IR') + ' محصول'"
        icon="products"
        subtitle="محصولات فعال در فروشگاه"
        :loading="loading"
      />

      <!-- 8. Pending Settlements -->
      <DashboardUDashboardKpiCard
        title="تسویه‌های در انتظار تایید"
        :value="(stats?.pendingSettlementsCount || 0).toLocaleString('fa-IR') + ' بچ'"
        icon="settlements"
        subtitle="نیازمند بررسی مالی"
        :loading="loading"
      />
    </div>

    <!-- Interactive Analytics Chart -->
    <DashboardUDashboardChart
      :timeline="stats?.timeline || []"
      title="روند درآمد، سفارشات و کارمزد ویپ‌لب"
    />

    <!-- Quick Insights: Category Distribution -->
    <div class="rounded-xl bg-zinc-900/60 border border-zinc-800 p-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-bold text-white flex items-center gap-2">
          <DashboardIcon name="categories" :size="16" class="text-[#00DC82]" />
          <span>توزیع کالایی در دسته‌بندی‌های فعال ویپ‌لب</span>
        </h3>
        <NuxtLink to="/admin-panel/products" class="text-xs text-[#00DC82] hover:underline font-medium">
          مشاهده تمام کالاها ←
        </NuxtLink>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        <div
          v-for="cat in stats?.categoryDistribution || []"
          :key="cat.slug"
          class="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 transition text-right"
        >
          <div class="text-xs font-bold text-zinc-200 truncate">{{ cat.name }}</div>
          <div class="text-[11px] text-zinc-500 mt-1 font-mono">
            {{ cat.productCount.toLocaleString('fa-IR') }} کالا
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Orders Table -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <DashboardIcon name="orders" :size="18" class="text-[#00DC82]" />
          <h2 class="text-base font-bold text-white">آخرین سفارشات ثبت‌شده در سیستم</h2>
        </div>
        <NuxtLink
          to="/admin-panel/orders"
          class="text-xs text-[#00DC82] hover:underline font-medium transition flex items-center gap-1"
        >
          <span>مشاهده تمامی سفارشات</span>
          <span>←</span>
        </NuxtLink>
      </div>

      <DashboardUDashboardDataTable
        :columns="orderColumns"
        :rows="orders"
        search-placeholder="جستجو بر اساس کد رهگیری، نام مشتری یا تلفن..."
        :items-per-page="8"
        :loading="loading"
      >
        <!-- Custom Cell: Order Number -->
        <template #orderNumber="{ row }">
          <div class="font-mono font-bold text-[#00DC82] flex items-center gap-2">
            <span>#{{ row.orderNumber || row.id }}</span>
            <span v-if="row.trackingCode" class="text-[10px] text-emerald-400 font-mono px-1 bg-emerald-500/10 rounded">
              کد رهگیری
            </span>
          </div>
        </template>

        <!-- Custom Cell: Customer -->
        <template #customer="{ row }">
          <div>
            <div class="font-bold text-white">{{ row.customer?.name || 'مشتری ویپ‌لب' }}</div>
            <div class="text-[10.5px] text-zinc-500 font-mono">{{ row.customer?.phone || row.customer?.email }}</div>
          </div>
        </template>

        <!-- Custom Cell: Date -->
        <template #createdAt="{ row }">
          <span class="text-xs text-zinc-400 font-mono">
            {{ formatDate(row.createdAt) }}
          </span>
        </template>

        <!-- Custom Cell: Status -->
        <template #status="{ row }">
          <DashboardUDashboardBadge
            :variant="getStatusBadgeVariant(row.status)"
            :dot="true"
          >
            {{ getStatusLabel(row.status) }}
          </DashboardUDashboardBadge>
        </template>

        <!-- Custom Cell: Total -->
        <template #total="{ row }">
          <span class="font-bold font-mono text-white">
            {{ formatCurrency(row.total) }}
          </span>
        </template>

        <!-- Custom Cell: Actions -->
        <template #actions="{ row }">
          <button
            type="button"
            @click="openOrderDetails(row)"
            class="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-[11px] text-zinc-200 hover:text-white transition cursor-pointer"
          >
            بررسی و تغییر وضعیت
          </button>
        </template>
      </DashboardUDashboardDataTable>
    </div>

    <!-- Order Inspection & Status Modal -->
    <DashboardUDashboardModal
      v-model="orderModalOpen"
      :title="`مدیریت سفارش #${selectedOrder?.orderNumber || selectedOrder?.id}`"
      description="بررسی اقلام فاکتور، ویرایش وضعیت سفارش و ثبت کد رهگیری مرسوله پستی"
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
            <span class="text-zinc-500 block">شماره تماس:</span>
            <span class="font-mono text-white">{{ selectedOrder.customer?.phone }}</span>
          </div>
          <div class="col-span-2">
            <span class="text-zinc-500 block">نشانی تحویل:</span>
            <span class="text-zinc-300">{{ selectedOrder.customer?.address }}, {{ selectedOrder.customer?.city }}</span>
          </div>
        </div>

        <!-- Ordered Items -->
        <div>
          <h4 class="text-xs font-bold text-zinc-400 mb-2 uppercase">اقلام سفارش داده شده</h4>
          <div class="divide-y divide-zinc-800 border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950/60">
            <div
              v-for="item in selectedOrder.items || []"
              :key="item.id"
              class="p-2.5 flex items-center justify-between text-xs"
            >
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center text-[10px] text-[#00DC82] font-mono">
                  {{ item.quantity }}×
                </span>
                <span class="font-medium text-white">{{ item.productName }}</span>
              </div>
              <span class="font-mono text-zinc-400">{{ formatCurrency(item.price * item.quantity) }}</span>
            </div>
          </div>
        </div>

        <!-- Status & Courier Controls -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label class="block text-xs font-bold text-zinc-300 mb-1.5">وضعیت سفارش</label>
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
            <label class="block text-xs font-bold text-zinc-300 mb-1.5">شرکت حمل‌ونقل / پیک</label>
            <input
              v-model="selectedOrder.courier"
              type="text"
              placeholder="پست پیشتاز / تیپاکس / پیک فوری"
              class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#00DC82]"
            />
          </div>

          <div class="sm:col-span-2">
            <label class="block text-xs font-bold text-zinc-300 mb-1.5">کد رهگیری مرسوله پستی</label>
            <input
              v-model="selectedOrder.trackingCode"
              type="text"
              placeholder="شماره رهگیری ۲۴ رقمی پست یا بارنامه تیپاکس..."
              class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-[#00DC82]"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <button
          type="button"
          @click="orderModalOpen = false"
          class="px-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-zinc-400 hover:text-white transition cursor-pointer"
        >
          انصراف
        </button>
        <button
          type="button"
          :disabled="updatingOrder"
          @click="saveOrderStatus"
          class="px-5 py-2 rounded-xl bg-[#00DC82] text-zinc-950 hover:bg-[#00c575] font-bold text-xs transition disabled:opacity-50 cursor-pointer"
        >
          {{ updatingOrder ? 'در حال ثبت...' : 'ذخیره تغییرات سفارش' }}
        </button>
      </template>
    </DashboardUDashboardModal>
  </DashboardUDashboardPanel>
</template>
