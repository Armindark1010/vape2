<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import StockMovementModal from '~/components/admin/StockMovementModal.vue';

definePageMeta({
  layout: 'admin',
});

useSeoMeta({
  title: 'مدیریت محصولات، کاتالوگ و تنوع‌ها — ویپ‌لب',
});

const router = useRouter();

const products = ref<any[]>([]);
const categories = ref<any[]>([]);
const brands = ref<any[]>([]);
const productTypes = ref<any[]>([]);
const loading = ref(true);

// Filters
const searchQuery = ref('');
const selectedType = ref('');
const selectedCategory = ref('');
const selectedBrand = ref('');
const selectedStockStatus = ref('');
const selectedSort = ref('newest');

// Movement modal
const movementModalOpen = ref(false);
const activeProductForMovement = ref<any | null>(null);

const loadData = async () => {
  loading.value = true;
  try {
    const queryParams = new URLSearchParams();
    if (searchQuery.value) queryParams.append('search', searchQuery.value);
    if (selectedType.value) queryParams.append('productType', selectedType.value);
    if (selectedCategory.value) queryParams.append('category', selectedCategory.value);
    if (selectedBrand.value) queryParams.append('brand', selectedBrand.value);
    if (selectedStockStatus.value) queryParams.append('stockStatus', selectedStockStatus.value);
    if (selectedSort.value) queryParams.append('sort', selectedSort.value);
    queryParams.append('limit', '100');

    const [prodRes, catRes, brandRes, typeRes] = await Promise.all([
      $fetch<any>(`/api/v1/products?${queryParams.toString()}`),
      $fetch<any[]>('/api/v1/categories').catch(() => []),
      $fetch<any[]>('/api/v1/brands').catch(() => []),
      $fetch<any[]>('/api/v1/product-types').catch(() => []),
    ]);

    products.value = prodRes.items || prodRes || [];
    categories.value = catRes || [];
    brands.value = brandRes || [];
    productTypes.value = typeRes || [];
  } catch (err) {
    console.warn('Error loading products list:', err);
  } finally {
    loading.value = false;
  }
};

let searchTimer: any = null;
watch([searchQuery, selectedType, selectedCategory, selectedBrand, selectedStockStatus, selectedSort], () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    loadData();
  }, 250);
});

// KPIs
const totalVariantsCount = computed(() =>
  products.value.reduce((acc, p) => acc + (p.variantsCount || (p.variants?.length ?? 1)), 0)
);
const inStockCount = computed(() => products.value.filter((p) => (p.availableStock ?? p.stock) > 5).length);
const lowStockCount = computed(
  () => products.value.filter((p) => (p.availableStock ?? p.stock) > 0 && (p.availableStock ?? p.stock) <= 5).length
);
const outOfStockCount = computed(() => products.value.filter((p) => (p.availableStock ?? p.stock) <= 0).length);

// Formatters
const formatPrice = (v: number) => {
  return (v || 0).toLocaleString('fa-IR') + ' تومان';
};

const formatPriceRange = (p: any) => {
  if (p.minVariantPrice && p.maxVariantPrice && p.minVariantPrice !== p.maxVariantPrice) {
    return `${p.minVariantPrice.toLocaleString('fa-IR')} الی ${p.maxVariantPrice.toLocaleString('fa-IR')} تومان`;
  }
  return formatPrice(p.discountPrice || p.price);
};

// Navigation
const navigateToCreate = () => {
  router.push('/admin-panel/products/create');
};

const navigateToEdit = (productId: number) => {
  router.push(`/admin-panel/products/${productId}/edit`);
};

// Movements
const openMovements = (product: any) => {
  activeProductForMovement.value = product;
  movementModalOpen.value = true;
};

// Delete Product
const handleDeleteProduct = async (p: any) => {
  if (!confirm(`آیا از حذف محصول "${p.name}" اطمینان دارید؟`)) return;
  try {
    await $fetch(`/api/v1/products/${p.id}`, { method: 'DELETE' });
    await loadData();
  } catch (err: any) {
    alert('خطا در حذف محصول: ' + (err?.data?.message || err.message));
  }
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <DashboardUDashboardPanel>
    <template #header>
      <DashboardUDashboardNavbar title="کاتالوگ محصولات، تنوع‌ها و انبارداری" badge="Products & Variants">
        <template #right>
          <button
            type="button"
            @click="navigateToCreate"
            class="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <DashboardIcon name="plus" :size="15" />
            <span>افزودن محصول جدید (صفحه اختصاصی)</span>
          </button>
        </template>
      </DashboardUDashboardNavbar>
    </template>

    <div class="space-y-5">
      <!-- KPI Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DashboardUDashboardKpiCard
          title="تعداد کل محصولات"
          :value="products.length.toLocaleString('fa-IR') + ' کالا'"
          icon="products"
          :subtitle="`${totalVariantsCount.toLocaleString('fa-IR')} تنوع مستقل`"
          :loading="loading"
        />

        <DashboardUDashboardKpiCard
          title="موجود در انبار"
          :value="inStockCount.toLocaleString('fa-IR')"
          icon="check"
          subtitle="موجودی آزاد و قابل خرید"
          :loading="loading"
        />

        <DashboardUDashboardKpiCard
          title="هشدار کسری انبار"
          :value="lowStockCount.toLocaleString('fa-IR')"
          icon="clock"
          subtitle="موجودی ۵ عدد یا کمتر"
          :loading="loading"
        />

        <DashboardUDashboardKpiCard
          title="اتمام موجودی"
          :value="outOfStockCount.toLocaleString('fa-IR')"
          icon="trash"
          subtitle="نیازمند شارژ مجدد"
          :loading="loading"
        />
      </div>

      <!-- Advanced Filter & Search Bar -->
      <div class="p-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 space-y-3">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <!-- Search -->
          <div class="lg:col-span-2">
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="جستجوی نام کالا، اسلاگ، SKU..."
                class="w-full pl-3 pr-9 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
              />
              <svg class="w-4 h-4 text-zinc-500 absolute right-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Product Type Filter -->
          <div>
            <select
              v-model="selectedType"
              class="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="">همه انواع محصول</option>
              <option v-for="t in productTypes" :key="t.id" :value="t.slug">
                {{ t.name }}
              </option>
            </select>
          </div>

          <!-- Category Filter -->
          <div>
            <select
              v-model="selectedCategory"
              class="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="">همه دسته‌بندی‌ها</option>
              <option v-for="c in categories" :key="c.id" :value="c.slug">
                {{ c.name }}
              </option>
            </select>
          </div>

          <!-- Brand Filter -->
          <div>
            <select
              v-model="selectedBrand"
              class="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="">همه برندها</option>
              <option v-for="b in brands" :key="b.id" :value="b.slug">
                {{ b.name }}
              </option>
            </select>
          </div>

          <!-- Stock Status Filter -->
          <div>
            <select
              v-model="selectedStockStatus"
              class="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="">همه وضعیت‌های موجودی</option>
              <option value="in_stock">موجود در انبار</option>
              <option value="low_stock">کسری موجودی (زیر ۵ عدد)</option>
              <option value="out_of_stock">ناموجود</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Products Data Table -->
      <div class="overflow-x-auto rounded-2xl border border-zinc-800/80 bg-zinc-950 shadow-xl">
        <table class="w-full text-right text-xs">
          <thead>
            <tr class="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400 font-semibold">
              <th class="p-3.5 w-16 text-center">تصویر</th>
              <th class="p-3.5">نام، اسلاگ و SKU</th>
              <th class="p-3.5">نوع محصول</th>
              <th class="p-3.5">دسته‌بندی و برند</th>
              <th class="p-3.5 text-center">تنوع‌ها (Variants)</th>
              <th class="p-3.5 text-center">موجودی فیزیکی / آزاد</th>
              <th class="p-3.5 text-left">قیمت فروش</th>
              <th class="p-3.5 text-center">وضعیت</th>
              <th class="p-3.5 text-center w-36">عملیات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-900">
            <tr v-if="loading">
              <td colspan="9" class="p-12 text-center text-zinc-400">
                <div class="w-7 h-7 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-2"></div>
                در حال بارگذاری کاتالوگ...
              </td>
            </tr>

            <tr v-else-if="products.length === 0">
              <td colspan="9" class="p-12 text-center text-zinc-500">
                محصولی مطابق فیلترهای انتخابی یافت نشد.
              </td>
            </tr>

            <tr
              v-for="p in products"
              :key="p.id"
              class="hover:bg-zinc-900/40 transition-colors duration-150"
            >
              <!-- Image -->
              <td class="p-3 text-center">
                <div class="w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden mx-auto">
                  <img
                    v-if="p.image || p.images?.[0]"
                    :src="p.image || p.images[0]"
                    :alt="p.name"
                    class="w-full h-full object-cover"
                  />
                  <DashboardIcon v-else name="products" :size="18" class="text-zinc-600" />
                </div>
              </td>

              <!-- Name & SKU -->
              <td class="p-3">
                <div class="font-bold text-zinc-100 max-w-xs truncate">{{ p.name }}</div>
                <div class="flex items-center gap-2 mt-0.5">
                  <span class="text-[10px] text-zinc-500 font-mono">{{ p.slug }}</span>
                  <span v-if="p.sku" class="text-[10px] text-purple-400 font-mono bg-purple-950/60 px-1.5 py-0.2 rounded border border-purple-800/40">
                    {{ p.sku }}
                  </span>
                </div>
              </td>

              <!-- Product Type -->
              <td class="p-3">
                <span class="px-2 py-0.5 rounded-lg text-[11px] bg-zinc-900 text-zinc-300 border border-zinc-800 inline-block font-medium">
                  {{ p.productType || 'استاندارد' }}
                </span>
              </td>

              <!-- Category & Brand -->
              <td class="p-3">
                <div class="text-zinc-300 font-medium">{{ p.category || '-' }}</div>
                <div class="text-[11px] text-zinc-500">{{ p.brand || '-' }}</div>
              </td>

              <!-- Variants Count -->
              <td class="p-3 text-center">
                <span class="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-purple-950/80 border border-purple-800/60 text-purple-300 inline-flex items-center gap-1">
                  <span>{{ p.variantsCount || (p.variants?.length ?? 1) }}</span>
                  <span class="text-[9px] font-sans">تنوع</span>
                </span>
              </td>

              <!-- Stock Status -->
              <td class="p-3 text-center">
                <div class="font-mono font-bold text-xs" :class="[(p.availableStock ?? p.stock) > 5 ? 'text-emerald-400' : (p.availableStock ?? p.stock) > 0 ? 'text-amber-400' : 'text-rose-500']">
                  {{ (p.availableStock ?? p.stock).toLocaleString('fa-IR') }} عدد آزاد
                </div>
                <div class="text-[10px] text-zinc-500 font-mono mt-0.5">
                  کل: {{ (p.stock || 0).toLocaleString('fa-IR') }}
                  <span v-if="p.reservedStock"> | رزرو: {{ p.reservedStock }}</span>
                </div>
              </td>

              <!-- Price -->
              <td class="p-3 text-left font-mono font-bold text-zinc-100">
                {{ formatPriceRange(p) }}
              </td>

              <!-- Status Tags -->
              <td class="p-3 text-center">
                <div class="flex items-center justify-center gap-1">
                  <span v-if="p.featured" class="w-2 h-2 rounded-full bg-amber-400" title="ویژه"></span>
                  <span v-if="p.newArrival" class="w-2 h-2 rounded-full bg-cyan-400" title="جدید"></span>
                  <span v-if="p.bestSeller" class="w-2 h-2 rounded-full bg-purple-400" title="پرفروش"></span>
                  <span class="text-[10px] text-zinc-400">فعال</span>
                </div>
              </td>

              <!-- Actions -->
              <td class="p-3 text-center">
                <div class="flex items-center justify-center gap-1">
                  <!-- Edit Button -->
                  <button
                    type="button"
                    @click="navigateToEdit(p.id)"
                    class="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-purple-500 text-purple-400 hover:bg-purple-600/10 transition"
                    title="ویرایش کامل محصول و تنوع‌ها"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  <!-- Movement History Button -->
                  <button
                    type="button"
                    @click="openMovements(p)"
                    class="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-cyan-500 text-cyan-400 hover:bg-cyan-600/10 transition"
                    title="مشاهده تاریخچه انبارداری"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </button>

                  <!-- Delete Button -->
                  <button
                    type="button"
                    @click="handleDeleteProduct(p)"
                    class="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-rose-500 text-rose-400 hover:bg-rose-600/10 transition"
                    title="حذف کالا"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Stock Movement Modal -->
    <StockMovementModal
      v-model="movementModalOpen"
      :product-id="activeProductForMovement?.id || null"
      :product-name="activeProductForMovement?.name || ''"
      :variants="activeProductForMovement?.variants || []"
      @adjusted="loadData"
    />
  </DashboardUDashboardPanel>
</template>
