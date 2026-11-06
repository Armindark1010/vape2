<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuth } from '~/composables/useAuth';

definePageMeta({
  layout: 'supplier',
});

useSeoMeta({
  title: 'پرتال اختصاصی تأمین‌کنندگان — ویپ‌لب',
});

const { user, isLoggedIn, token } = useAuth();

interface SupplierDashboardData {
  supplier: {
    id: number;
    companyName: string;
    contactName: string;
    commissionRate: number;
    iban: string;
  };
  stats: {
    totalGrossSales: number;
    totalCommissionDeducted: number;
    netPayableSales: number;
    totalOrders: number;
    pendingOrdersCount: number;
    productsCount: number;
    activeProducts: number;
    lowStockCount: number;
    outOfStockCount: number;
    pendingSettlementAmount: number;
    lastSettlementDate: string | null;
    lastSettlementAmount: number;
    currency: string;
  };
  timeline: Array<{ date: string; revenue: number; orders: number; commission: number }>;
}

const dashboardData = ref<SupplierDashboardData | null>(null);
const myProducts = ref<any[]>([]);
const loading = ref(true);
const updatingStock = ref<number | null>(null);
const stockInput = ref<{ [key: number]: number }>({});

const productColumns = [
  { key: 'name', label: 'نام محصول تخصیص یافته', sortable: true },
  { key: 'category', label: 'دسته‌بندی' },
  { key: 'price', label: 'قیمت مصرف‌کننده', sortable: true, align: 'left' as const },
  { key: 'stock', label: 'موجودی انبار', sortable: true, align: 'center' as const },
  { key: 'status', label: 'وضعیت تامین', align: 'center' as const },
  { key: 'actions', label: 'بروزرسانی موجودی', align: 'center' as const },
];

const loadSupplierData = async () => {
  if (!isLoggedIn.value) return;
  loading.value = true;
  try {
    const headers: Record<string, string> = {};
    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`;
    }

    const [dashRes, prodsRes] = await Promise.all([
      $fetch<SupplierDashboardData>('/api/v1/suppliers/portal/dashboard', { headers }),
      $fetch<any[]>('/api/v1/suppliers/portal/products', { headers }),
    ]);

    dashboardData.value = dashRes;
    myProducts.value = prodsRes || [];

    for (const p of myProducts.value) {
      stockInput.value[p.id] = p.stock;
    }
  } catch (err) {
    console.warn('Error loading supplier portal data:', err);
  } finally {
    loading.value = false;
  }
};

const updateStock = async (productId: number) => {
  const newStock = stockInput.value[productId];
  if (newStock === undefined || newStock < 0) return;

  updatingStock.value = productId;
  try {
    const headers: Record<string, string> = {};
    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`;
    }

    await $fetch(`/api/v1/suppliers/portal/products/${productId}/stock`, {
      method: 'PATCH',
      headers,
      body: { stock: Number(newStock) },
    });

    const target = myProducts.value.find(p => p.id === productId);
    if (target) target.stock = Number(newStock);
    alert('موجودی کالا با موفقیت بروز شد.');
  } catch (err: any) {
    alert('خطا در بروزرسانی موجودی: ' + (err?.data?.message || err.message));
  } finally {
    updatingStock.value = null;
  }
};

const formatCurrency = (val: number) => {
  return (val || 0).toLocaleString('fa-IR') + ' تومان';
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return 'هیچ تسویه‌ای ثبت نشده';
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
};

onMounted(() => {
  loadSupplierData();
});
</script>

<template>
  <DashboardUDashboardPanel>
    <template #header>
      <DashboardUDashboardNavbar
        :title="`داشبورد اختصاصی: ${dashboardData?.supplier?.companyName || user?.name || 'تأمین‌کننده'}`"
        badge="Partner Portal"
      >
        <template #right>
          <button
            type="button"
            @click="loadSupplierData"
            class="px-3 py-1.5 rounded-xl bg-[#13131F] border border-[#29293B] text-xs text-[#9696AD] hover:text-[#F4F4F8] transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>🔄</span>
            <span>بروزرسانی داده‌ها</span>
          </button>
        </template>
      </DashboardUDashboardNavbar>
    </template>

    <!-- 8 Supplier KPI Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <!-- 1. Total Sales -->
      <DashboardUDashboardKpiCard
        title="فروش ناخالص کل من"
        :value="formatCurrency(dashboardData?.stats?.totalGrossSales || 0)"
        icon="💰"
        subtitle="مجموع ارزش اقلام فروخته شده"
        :loading="loading"
      />

      <!-- 2. Total Orders -->
      <DashboardUDashboardKpiCard
        title="تعداد سفارشات کالاهای من"
        :value="(dashboardData?.stats?.totalOrders || 0).toLocaleString('fa-IR') + ' سفارش'"
        icon="🚚"
        subtitle="سفارشات شامل محصولات این شرکت"
        :loading="loading"
      />

      <!-- 3. Pending Orders -->
      <DashboardUDashboardKpiCard
        title="سفارشات جاری و معلق"
        :value="(dashboardData?.stats?.pendingOrdersCount || 0).toLocaleString('fa-IR') + ' مورد'"
        icon="⏳"
        subtitle="در حال پردازش یا تحویل به پست"
        :loading="loading"
      />

      <!-- 4. Active Products -->
      <DashboardUDashboardKpiCard
        title="کالاهای دارای موجودی"
        :value="(dashboardData?.stats?.activeProducts || 0).toLocaleString('fa-IR') + ' کالا'"
        icon="✅"
        subtitle="موجود و آماده فروش آنلاین"
        :loading="loading"
      />

      <!-- 5. Low Stock Products -->
      <DashboardUDashboardKpiCard
        title="هشدار کسری انبار"
        :value="(dashboardData?.stats?.lowStockCount || 0).toLocaleString('fa-IR') + ' کالا'"
        icon="⚠️"
        subtitle="کمتر از ۵ عدد باقی‌مانده"
        :loading="loading"
      />

      <!-- 6. Out of Stock Products -->
      <DashboardUDashboardKpiCard
        title="کالاهای ناموجود"
        :value="(dashboardData?.stats?.outOfStockCount || 0).toLocaleString('fa-IR') + ' کالا'"
        icon="🚫"
        subtitle="نیازمند شارژ فوری انبار"
        :loading="loading"
      />

      <!-- 7. Pending Balance -->
      <DashboardUDashboardKpiCard
        title="مانده طلب تسویه‌نشده"
        :value="formatCurrency(dashboardData?.stats?.pendingSettlementAmount || 0)"
        icon="🏦"
        subtitle="خالص طلب در انتظار دوره واریز"
        :loading="loading"
      />

      <!-- 8. Last Settlement -->
      <DashboardUDashboardKpiCard
        title="آخرین تسویه انجام‌شده"
        :value="dashboardData?.stats?.lastSettlementAmount ? formatCurrency(dashboardData.stats.lastSettlementAmount) : 'بدون سابقه'"
        icon="📑"
        :subtitle="formatDate(dashboardData?.stats?.lastSettlementDate || null)"
        :loading="loading"
      />
    </div>

    <!-- Chart: Supplier Revenue & Orders -->
    <DashboardUDashboardChart
      :timeline="dashboardData?.timeline || []"
      title="نمودار فروش و سفارشات محصولات اختصاصی شما"
    />

    <!-- Quick Inventory Stock Management -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-base">📦</span>
          <h2 class="text-base font-bold text-[#F4F4F8]">مدیریت سریع موجودی کالاهای تخصیص‌یافته</h2>
        </div>
        <span class="text-xs text-[#9696AD]">
          درصد کارمزد کسر شده پلتفرم: <strong class="text-[#3B82F6] font-mono">{{ dashboardData?.supplier?.commissionRate || 10 }}%</strong>
        </span>
      </div>

      <DashboardUDashboardDataTable
        :columns="productColumns"
        :rows="myProducts"
        search-placeholder="جستجوی کالای تخصیص یافته..."
        :loading="loading"
      >
        <template #name="{ row }">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-[#1A1A29] border border-[#29293B] flex items-center justify-center text-sm shrink-0 overflow-hidden">
              <img v-if="row.images?.[0]" :src="row.images[0]" :alt="row.name" class="w-full h-full object-cover" />
              <span v-else>💨</span>
            </div>
            <div>
              <div class="font-bold text-[#F4F4F8] max-w-xs truncate">{{ row.name }}</div>
              <div class="text-[10px] text-[#9696AD] font-mono">شناسه: #{{ row.id }}</div>
            </div>
          </div>
        </template>

        <template #category="{ row }">
          <span class="text-xs text-[#9696AD]">{{ row.category?.name || '---' }}</span>
        </template>

        <template #price="{ row }">
          <span class="font-bold font-mono text-[#F4F4F8]">{{ formatCurrency(row.price) }}</span>
        </template>

        <template #stock="{ row }">
          <div class="flex items-center justify-center gap-1.5">
            <input
              v-model="stockInput[row.id]"
              type="number"
              min="0"
              class="w-16 px-2 py-1 rounded-lg bg-[#1A1A29] border border-[#29293B] text-center font-mono text-xs text-[#F4F4F8] focus:outline-none focus:border-[#3B82F6]"
            />
            <span class="text-[10.5px] text-[#9696AD]">عدد</span>
          </div>
        </template>

        <template #status="{ row }">
          <DashboardUDashboardBadge
            :variant="(row.stock || 0) === 0 ? 'danger' : ((row.stock || 0) <= 5 ? 'warning' : 'success')"
            :dot="true"
          >
            {{ (row.stock || 0) === 0 ? 'اتمام موجودی' : ((row.stock || 0) <= 5 ? 'کسری انبار' : 'موجود') }}
          </DashboardUDashboardBadge>
        </template>

        <template #actions="{ row }">
          <button
            type="button"
            :disabled="updatingStock === row.id"
            @click="updateStock(row.id)"
            class="px-3 py-1 rounded-lg bg-gradient-to-l from-[#3B82F6] to-[#1D4ED8] text-white text-xs font-bold transition disabled:opacity-50 cursor-pointer shadow-sm shadow-[#3B82F6]/20"
          >
            {{ updatingStock === row.id ? '...' : 'بروزرسانی انبار' }}
          </button>
        </template>
      </DashboardUDashboardDataTable>
    </div>
  </DashboardUDashboardPanel>
</template>
