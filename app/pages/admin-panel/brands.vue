<script setup lang="ts">
import { ref, onMounted } from 'vue';

definePageMeta({
  layout: 'admin',
});

useSeoMeta({
  title: 'مدیریت برندها و تولیدکنندگان — ویپ‌لب',
});

const brands = ref<any[]>([]);
const loading = ref(true);

const columns = [
  { key: 'name', label: 'نام برند', sortable: true },
  { key: 'slug', label: 'شناسه لاتین (Slug)' },
  { key: 'description', label: 'توضیحات برند' },
  { key: 'productsCount', label: 'تعداد محصولات مرتبط', sortable: true, align: 'center' as const },
];

const loadBrands = async () => {
  loading.value = true;
  try {
    const res = await $fetch<any[]>('/api/v1/brands');
    brands.value = res.map(b => ({
      ...b,
      productsCount: b.products?.length ?? b._count?.products ?? 0,
    }));
  } catch (err) {
    console.warn('Error loading brands:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadBrands();
});
</script>

<template>
  <DashboardUDashboardPanel>
    <template #header>
      <DashboardUDashboardNavbar title="برندها و کمپانی‌های معتبر سازنده" badge="Brands" />
    </template>

    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <DashboardUDashboardKpiCard
        title="تعداد کل برندهای ثبت‌شده"
        :value="brands.length.toLocaleString('fa-IR')"
        icon="brands"
        subtitle="برندهای جهانی ویپینگ"
        :loading="loading"
      />

      <DashboardUDashboardKpiCard
        title="تضمین اصالت اورجینال"
        :value="'۱۰۰% تضمین اصل'"
        icon="zap"
        subtitle="بررسی هولوگرام و بچ‌کد"
      />

      <DashboardUDashboardKpiCard
        title="محصولات دارای برند"
        :value="brands.reduce((sum, b) => sum + b.productsCount, 0).toLocaleString('fa-IR') + ' کالا'"
        icon="products"
        subtitle="تخصیص‌یافته به برندها"
        :loading="loading"
      />
    </div>

    <DashboardUDashboardDataTable
      :columns="columns"
      :rows="brands"
      search-placeholder="جستجوی نام برند یا شناسه لاتین..."
      :loading="loading"
    >
      <template #name="{ row }">
        <div class="flex items-center gap-2.5">
          <DashboardIcon name="brands" :size="16" class="text-[#00DC82]" />
          <span class="font-bold text-white">{{ row.name }}</span>
        </div>
      </template>

      <template #slug="{ row }">
        <span class="font-mono text-xs text-zinc-400">{{ row.slug }}</span>
      </template>

      <template #description="{ row }">
        <span class="text-xs text-zinc-400">{{ row.description || 'توضیحات سازنده ثبت نشده است' }}</span>
      </template>

      <template #productsCount="{ row }">
        <span class="font-mono font-bold text-[#00DC82] px-2 py-0.5 rounded bg-[#00DC82]/10 border border-[#00DC82]/25">
          {{ row.productsCount.toLocaleString('fa-IR') }} کالا
        </span>
      </template>
    </DashboardUDashboardDataTable>
  </DashboardUDashboardPanel>
</template>

