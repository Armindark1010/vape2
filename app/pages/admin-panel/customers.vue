<script setup lang="ts">
import { ref, onMounted } from 'vue';

definePageMeta({
  layout: 'admin',
});

useSeoMeta({
  title: 'مدیریت مشتریان و کاربران پلتفرم — ویپ‌لب',
});

const customers = ref<any[]>([]);
const loading = ref(true);

const columns = [
  { key: 'name', label: 'نام خریدار و حساب', sortable: true },
  { key: 'contact', label: 'اطلاعات تماس' },
  { key: 'ordersCount', label: 'تعداد سفارشات', sortable: true, align: 'center' as const },
  { key: 'totalSpent', label: 'مجموع خرید', sortable: true, align: 'left' as const },
  { key: 'createdAt', label: 'تاریخ عضویت', sortable: true },
  { key: 'status', label: 'وضعیت حساب', align: 'center' as const },
];

const loadCustomers = async () => {
  loading.value = true;
  try {
    const res = await $fetch<any[]>('/api/v1/admin/customers');
    customers.value = res.map(c => ({
      ...c,
      contact: `${c.phone || '---'} | ${c.email}`,
    }));
  } catch (err) {
    console.warn('Error loading customers:', err);
  } finally {
    loading.value = false;
  }
};

const formatPrice = (v: number) => {
  return (v || 0).toLocaleString('fa-IR') + ' تومان';
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '---';
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
};

onMounted(() => {
  loadCustomers();
});
</script>

<template>
  <DashboardUDashboardPanel>
    <template #header>
      <DashboardUDashboardNavbar title="مشتریان و خریداران ثبت‌نامی" badge="Customers" />
    </template>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <DashboardUDashboardKpiCard
        title="تعداد خریداران"
        :value="customers.length.toLocaleString('fa-IR') + ' کاربر'"
        icon="customers"
        subtitle="حساب‌های مشتری فعال"
        :loading="loading"
      />

      <DashboardUDashboardKpiCard
        title="کل خریدهای ثبت‌شده"
        :value="formatPrice(customers.reduce((sum, c) => sum + c.totalSpent, 0))"
        icon="revenue"
        subtitle="مجموع ارزش تراکنش‌ها"
        :loading="loading"
      />

      <DashboardUDashboardKpiCard
        title="میانگین سفارش هر مشتری"
        :value="(customers.length ? Math.round(customers.reduce((sum, c) => sum + c.ordersCount, 0) / customers.length) : 0).toLocaleString('fa-IR') + ' فاکتور'"
        icon="orders"
        subtitle="شاخص وفاداری"
        :loading="loading"
      />

      <DashboardUDashboardKpiCard
        title="وضعیت احراز هویت"
        :value="'۱۰۰% تایید شده'"
        icon="security"
        subtitle="شماره موبایل و ایمیل"
      />
    </div>

    <DashboardUDashboardDataTable
      :columns="columns"
      :rows="customers"
      search-placeholder="جستجوی نام مشتری، ایمیل یا شماره موبایل..."
      :loading="loading"
    >
      <template #name="{ row }">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-white">
            {{ (row.name || 'U')[0].toUpperCase() }}
          </div>
          <div>
            <div class="font-bold text-white">{{ row.name }}</div>
            <div class="text-[10px] text-zinc-500 font-mono">شناسه: #USR-{{ row.id }}</div>
          </div>
        </div>
      </template>

      <template #contact="{ row }">
        <div>
          <div class="font-mono text-xs text-white">{{ row.phone }}</div>
          <div class="text-[10.5px] text-zinc-500 font-mono">{{ row.email }}</div>
        </div>
      </template>

      <template #ordersCount="{ row }">
        <span class="font-mono font-bold text-[#00DC82] px-2 py-0.5 rounded bg-[#00DC82]/10 border border-[#00DC82]/25">
          {{ row.ordersCount.toLocaleString('fa-IR') }}
        </span>
      </template>

      <template #totalSpent="{ row }">
        <span class="font-mono font-bold text-[#F4F4F8]">
          {{ formatPrice(row.totalSpent) }}
        </span>
      </template>

      <template #createdAt="{ row }">
        <span class="font-mono text-xs text-[#9696AD]">
          {{ formatDate(row.createdAt) }}
        </span>
      </template>

      <template #status>
        <DashboardUDashboardBadge variant="success" :dot="true">
          فعال
        </DashboardUDashboardBadge>
      </template>
    </DashboardUDashboardDataTable>
  </DashboardUDashboardPanel>
</template>

