<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuth } from '~/composables/useAuth';

definePageMeta({
  layout: 'supplier',
});

useSeoMeta({
  title: 'کالاهای تخصیص‌یافته و موجودی انبار — پرتال تأمین‌کنندگان',
});

const { token } = useAuth();
const products = ref<any[]>([]);
const loading = ref(true);
const stockInput = ref<{ [key: number]: number }>({});
const updatingStock = ref<number | null>(null);

const columns = [
  { key: 'name', label: 'نام محصول', sortable: true },
  { key: 'category', label: 'دسته‌بندی' },
  { key: 'price', label: 'قیمت فروش', sortable: true, align: 'left' as const },
  { key: 'stock', label: 'موجودی انبار', sortable: true, align: 'center' as const },
  { key: 'status', label: 'وضعیت', align: 'center' as const },
  { key: 'actions', label: 'بروزرسانی', align: 'center' as const },
];

const loadProducts = async () => {
  loading.value = true;
  try {
    const headers: Record<string, string> = {};
    if (token.value) headers['Authorization'] = `Bearer ${token.value}`;
    const res = await $fetch<any[]>('/api/v1/suppliers/portal/products', { headers });
    products.value = res || [];
    for (const p of products.value) {
      stockInput.value[p.id] = p.stock;
    }
  } catch (err) {
    console.warn('Error loading supplier products:', err);
  } finally {
    loading.value = false;
  }
};

const updateStock = async (id: number) => {
  const stock = stockInput.value[id];
  if (stock === undefined || stock < 0) return;
  updatingStock.value = id;
  try {
    const headers: Record<string, string> = {};
    if (token.value) headers['Authorization'] = `Bearer ${token.value}`;
    await $fetch(`/api/v1/suppliers/portal/products/${id}/stock`, {
      method: 'PATCH',
      headers,
      body: { stock: Number(stock) },
    });
    const target = products.value.find(p => p.id === id);
    if (target) target.stock = Number(stock);
    alert('موجودی با موفقیت ثبت شد.');
  } catch (err: any) {
    alert('خطا: ' + (err?.data?.message || err.message));
  } finally {
    updatingStock.value = null;
  }
};

const formatPrice = (v: number) => (v || 0).toLocaleString('fa-IR') + ' تومان';

onMounted(() => {
  loadProducts();
});
</script>

<template>
  <DashboardUDashboardPanel>
    <template #header>
      <DashboardUDashboardNavbar title="کالاهای تخصیص‌یافته به این تأمین‌کننده" badge="My Inventory" />
    </template>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <DashboardUDashboardKpiCard
        title="تعداد محصولات من"
        :value="products.length.toLocaleString('fa-IR') + ' کالا'"
        icon="📦"
        subtitle="کالاهای ثبت‌شده تحت برند شما"
        :loading="loading"
      />

      <DashboardUDashboardKpiCard
        title="کالاهای با موجودی مناسب"
        :value="products.filter(p => (p.stock || 0) > 5).length.toLocaleString('fa-IR')"
        icon="✅"
        subtitle="موجودی کافی در انبار"
        :loading="loading"
      />

      <DashboardUDashboardKpiCard
        title="هشدار اتمام موجودی"
        :value="products.filter(p => (p.stock || 0) <= 5).length.toLocaleString('fa-IR')"
        icon="⚠️"
        subtitle="نیازمند تأمین و شارژ فوری"
        :loading="loading"
      />

      <DashboardUDashboardKpiCard
        title="مجوز قیمت‌گذاری"
        :value="'تایید شده'"
        icon="🛡️"
        subtitle="همگام با سیستم مرکزی ویپ‌لب"
      />
    </div>

    <DashboardUDashboardDataTable
      :columns="columns"
      :rows="products"
      search-placeholder="جستجوی محصول تخصیصی..."
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
        <span class="font-bold font-mono text-[#F4F4F8]">{{ formatPrice(row.price) }}</span>
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
          {{ (row.stock || 0) === 0 ? 'ناموجود' : ((row.stock || 0) <= 5 ? 'کسری انبار' : 'موجود') }}
        </DashboardUDashboardBadge>
      </template>

      <template #actions="{ row }">
        <button
          type="button"
          :disabled="updatingStock === row.id"
          @click="updateStock(row.id)"
          class="px-3 py-1 rounded-lg bg-gradient-to-l from-[#3B82F6] to-[#1D4ED8] text-white text-xs font-bold transition disabled:opacity-50 cursor-pointer shadow-sm shadow-[#3B82F6]/20"
        >
          {{ updatingStock === row.id ? '...' : 'ثبت موجودی' }}
        </button>
      </template>
    </DashboardUDashboardDataTable>
  </DashboardUDashboardPanel>
</template>

