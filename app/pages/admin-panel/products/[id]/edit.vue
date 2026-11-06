<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DynamicSpecsForm from '~/components/admin/DynamicSpecsForm.vue';
import VariantMatrixGenerator, { type VariantItem } from '~/components/admin/VariantMatrixGenerator.vue';
import ImagePickerModal from '~/components/dashboard/ImagePickerModal.vue';
import { useMedia } from '~/composables/useMedia';

definePageMeta({
  layout: 'admin',
});

const route = useRoute();
const router = useRouter();
const productId = Number(route.params.id);

useSeoMeta({
  title: 'ویرایش محصول — پنل مدیریت ویپ‌لب',
});

const { uploadSingle, uploadMultiple } = useMedia();
const directMainUploading = ref(false);
const directGalleryUploading = ref(false);
const mainFileInput = ref<HTMLInputElement | null>(null);
const galleryFileInput = ref<HTMLInputElement | null>(null);

const onDirectMainUpload = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;
  const file = input.files[0];
  if (!file) return;

  directMainUploading.value = true;
  try {
    const uploaded = await uploadSingle(file);
    form.value.mainImage = uploaded.url;
  } catch (err: any) {
    alert('خطا در آپلود عکس به MinIO: ' + (err.message || 'خطای سرور'));
  } finally {
    directMainUploading.value = false;
    input.value = '';
  }
};

const onDirectGalleryUpload = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;
  const files = Array.from(input.files);

  directGalleryUploading.value = true;
  try {
    const res = await uploadMultiple(files);
    if (res.uploaded && res.uploaded.length > 0) {
      res.uploaded.forEach((item) => {
        if (!form.value.galleryImages.includes(item.url)) {
          form.value.galleryImages.push(item.url);
        }
      });
    }
    if (res.errors && res.errors.length > 0) {
      alert(`تعداد ${res.errors.length} فایل با خطا مواجه شد.`);
    }
  } catch (err: any) {
    alert('خطا در آپلود گالری به MinIO: ' + (err.message || 'خطای سرور'));
  } finally {
    directGalleryUploading.value = false;
    input.value = '';
  }
};

// Active section tab
const activeTab = ref<'general' | 'media' | 'specs' | 'variants' | 'pricing' | 'seo'>('general');

// Loading states
const saving = ref(false);
const loading = ref(true);
const errorMessage = ref<string | null>(null);

// Lookups
const categories = ref<any[]>([]);
const brands = ref<any[]>([]);
const productTypes = ref<any[]>([]);
const suppliers = ref<any[]>([]);

// Product Form Model
const form = ref({
  name: '',
  slug: '',
  sku: '',
  tagline: '',
  shortDescription: '',
  description: '',
  categoryId: undefined as number | undefined,
  brandId: undefined as number | undefined,
  productTypeId: undefined as number | undefined,
  supplierId: undefined as number | undefined,
  price: 0,
  discountPrice: null as number | null,
  compareAtPrice: null as number | null,
  stock: 0,
  featured: false,
  newArrival: false,
  bestSeller: false,
  seoTitle: '',
  seoDescription: '',
  mainImage: '',
  galleryImages: [] as string[],
});

// Dynamic Attribute Values: { [attributeId]: value }
const dynamicAttributeValues = ref<Record<number, any>>({});

// Variants List
const variants = ref<VariantItem[]>([]);

// Selected Product Type Object
const selectedProductType = computed(() => {
  if (!form.value.productTypeId) return null;
  return productTypes.value.find((pt) => pt.id === form.value.productTypeId) || null;
});

// Image Picker Modal State
const imagePickerOpen = ref(false);
const imagePickerMode = ref<'main' | 'gallery'>('main');

const openImagePicker = (mode: 'main' | 'gallery') => {
  imagePickerMode.value = mode;
  imagePickerOpen.value = true;
};

const onImagePicked = (url: string) => {
  if (imagePickerMode.value === 'main') {
    form.value.mainImage = url;
  } else {
    if (!form.value.galleryImages.includes(url)) {
      form.value.galleryImages.push(url);
    }
  }
};

const removeGalleryImage = (index: number) => {
  form.value.galleryImages.splice(index, 1);
};

// Fetch product & lookups on mounted
onMounted(async () => {
  loading.value = true;
  try {
    const [cats, brs, types, sups, productData] = await Promise.all([
      $fetch<any[]>('/api/v1/categories').catch(() => []),
      $fetch<any[]>('/api/v1/brands').catch(() => []),
      $fetch<any[]>('/api/v1/product-types').catch(() => []),
      $fetch<any[]>('/api/v1/suppliers').catch(() => []),
      $fetch<any>(`/api/v1/products/${productId}`),
    ]);

    categories.value = cats || [];
    brands.value = brs || [];
    productTypes.value = types || [];
    suppliers.value = sups || [];

    // Populate form from existing product
    if (productData) {
      form.value.name = productData.name || '';
      form.value.slug = productData.slug || '';
      form.value.sku = productData.sku || '';
      form.value.tagline = productData.tagline || '';
      form.value.shortDescription = productData.shortDescription || '';
      form.value.description = productData.description || '';
      form.value.categoryId = productData.categoryId || productData.category?.id;
      form.value.brandId = productData.brandId || productData.brand?.id;
      form.value.productTypeId = productData.productTypeId || productData.productType?.id;
      form.value.supplierId = productData.supplierId;
      form.value.price = productData.price || 0;
      form.value.discountPrice = productData.discountPrice;
      form.value.compareAtPrice = productData.compareAtPrice;
      form.value.stock = productData.stock || 0;
      form.value.featured = Boolean(productData.featured);
      form.value.newArrival = Boolean(productData.newArrival);
      form.value.bestSeller = Boolean(productData.bestSeller);
      form.value.seoTitle = productData.seoTitle || '';
      form.value.seoDescription = productData.seoDescription || '';

      const imgs = Array.isArray(productData.images) ? productData.images : [];
      form.value.mainImage = imgs[0] || '';
      form.value.galleryImages = imgs.slice(1);

      // Populate dynamic attribute values
      if (Array.isArray(productData.attributeValues)) {
        const attrMap: Record<number, any> = {};
        productData.attributeValues.forEach((av: any) => {
          try {
            attrMap[av.attributeId] = JSON.parse(av.value);
          } catch {
            attrMap[av.attributeId] = av.value;
          }
        });
        dynamicAttributeValues.value = attrMap;
      }

      // Populate variants
      if (Array.isArray(productData.variants)) {
        variants.value = productData.variants.map((v: any) => ({
          id: v.id,
          sku: v.sku,
          title: v.title,
          combination: v.combination || {},
          combinationHash: v.combinationHash,
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          stock: v.stock,
          reservedQuantity: v.reservedQuantity || 0,
          availableStock: Math.max(0, (v.stock || 0) - (v.reservedQuantity || 0)),
          image: v.image,
          weight: v.weight,
          isActive: v.isActive !== false,
        }));
      }
    }
  } catch (err: any) {
    console.error('Error loading product for edit:', err);
    errorMessage.value = err?.data?.message || err.message || 'خطا در بارگذاری اطلاعات کالا';
  } finally {
    loading.value = false;
  }
});

// Submit Updates
const handleSubmit = async () => {
  errorMessage.value = null;

  if (!form.value.name.trim()) {
    errorMessage.value = 'وارد کردن نام محصول الزامی است.';
    activeTab.value = 'general';
    return;
  }

  saving.value = true;

  try {
    // Prepare images array
    const allImages: string[] = [];
    if (form.value.mainImage) allImages.push(form.value.mainImage);
    form.value.galleryImages.forEach((img) => {
      if (!allImages.includes(img)) allImages.push(img);
    });

    // Prepare dynamic attribute values
    const attrValuesPayload = Object.entries(dynamicAttributeValues.value)
      .filter(([_, val]) => val !== undefined && val !== null && val !== '')
      .map(([attrId, val]) => ({
        attributeId: Number(attrId),
        value: val,
      }));

    // Prepare variants payload
    const variantsPayload = variants.value.map((v) => ({
      id: v.id,
      sku: v.sku,
      title: v.title,
      combination: v.combination,
      price: Number(v.price) || Number(form.value.price),
      compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
      stock: Number(v.stock) || 0,
      image: v.image || form.value.mainImage || null,
      weight: v.weight ? Number(v.weight) : null,
      isActive: v.isActive,
    }));

    const computedTotalStock = variantsPayload.length
      ? variantsPayload.reduce((sum, v) => sum + v.stock, 0)
      : Number(form.value.stock) || 0;

    const payload = {
      name: form.value.name.trim(),
      slug: form.value.slug.trim() || undefined,
      sku: form.value.sku.trim() || undefined,
      tagline: form.value.tagline || null,
      shortDescription: form.value.shortDescription || null,
      description: form.value.description || '',
      seoTitle: form.value.seoTitle || null,
      seoDescription: form.value.seoDescription || null,
      price: Number(form.value.price),
      discountPrice: form.value.discountPrice ? Number(form.value.discountPrice) : null,
      compareAtPrice: form.value.compareAtPrice ? Number(form.value.compareAtPrice) : null,
      stock: computedTotalStock,
      categoryId: form.value.categoryId ? Number(form.value.categoryId) : undefined,
      brandId: form.value.brandId ? Number(form.value.brandId) : undefined,
      productTypeId: form.value.productTypeId ? Number(form.value.productTypeId) : undefined,
      supplierId: form.value.supplierId ? Number(form.value.supplierId) : undefined,
      images: allImages,
      featured: form.value.featured,
      newArrival: form.value.newArrival,
      bestSeller: form.value.bestSeller,
      attributeValues: attrValuesPayload,
      variants: variantsPayload,
    };

    await $fetch(`/api/v1/products/${productId}`, {
      method: 'PUT',
      body: payload,
    });

    alert('تغییرات محصول و تنوع‌ها با موفقیت ذخیره گردید.');
    router.push('/admin-panel/products');
  } catch (err: any) {
    console.error('Update product error:', err);
    errorMessage.value = err?.data?.message || err.message || 'خطا در ذخیره تغییرات';
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <div class="space-y-6 max-w-7xl mx-auto pb-24">
    <!-- Top Action Header -->
    <div class="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
      <div>
        <div class="flex items-center gap-2 text-xs text-zinc-400 mb-1">
          <NuxtLink to="/admin-panel/products" class="hover:text-purple-400 transition">کاتالوگ کالاها</NuxtLink>
          <span>/</span>
          <span class="text-zinc-200">ویرایش محصول #{{ productId }}</span>
        </div>
        <h1 class="text-xl md:text-2xl font-black text-zinc-100 flex items-center gap-2">
          <span class="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </span>
          ویرایش محصول: {{ form.name || 'در حال بارگذاری...' }}
        </h1>
      </div>

      <div class="flex items-center gap-2.5">
        <NuxtLink
          to="/admin-panel/products"
          class="px-4 py-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 text-xs font-semibold transition"
        >
          انصراف و بازگشت
        </NuxtLink>
        <button
          type="button"
          @click="handleSubmit"
          :disabled="saving || loading"
          class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition flex items-center gap-2 disabled:opacity-50 active:scale-95 cursor-pointer"
        >
          <span v-if="saving" class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
          <span>{{ saving ? 'در حال ذخیره...' : 'ذخیره تغییرات محصول' }}</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-16 text-center text-zinc-400 text-sm">
      <div class="w-8 h-8 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-3"></div>
      در حال دریافت اطلاعات محصول و تنوع‌ها...
    </div>

    <div v-else class="space-y-6">
      <!-- Error Alert -->
      <div v-if="errorMessage" class="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 text-xs flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-rose-400 font-bold">⚠️ خطا:</span>
          <span>{{ errorMessage }}</span>
        </div>
        <button @click="errorMessage = null" class="text-rose-400 hover:text-rose-200">✕</button>
      </div>

      <!-- Tab Navigation Bar -->
      <div class="flex overflow-x-auto gap-1 p-1.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
        <button
          type="button"
          @click="activeTab = 'general'"
          :class="[
            'px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2',
            activeTab === 'general'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50',
          ]"
        >
          <span>۱. اطلاعات عمومی</span>
        </button>

        <button
          type="button"
          @click="activeTab = 'media'"
          :class="[
            'px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2',
            activeTab === 'media'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50',
          ]"
        >
          <span>۲. تصاویر و گالری</span>
          <span v-if="form.mainImage" class="w-2 h-2 rounded-full bg-emerald-400"></span>
        </button>

        <button
          type="button"
          @click="activeTab = 'specs'"
          :class="[
            'px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2',
            activeTab === 'specs'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50',
          ]"
        >
          <span>۳. مشخصات فنی داینامیک</span>
          <span v-if="selectedProductType" class="text-[10px] bg-purple-950 px-1.5 py-0.5 rounded text-purple-300">
            {{ selectedProductType.name }}
          </span>
        </button>

        <button
          type="button"
          @click="activeTab = 'variants'"
          :class="[
            'px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2',
            activeTab === 'variants'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50',
          ]"
        >
          <span>۴. تنوع‌ها (Variants)</span>
          <span class="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
            {{ variants.length }}
          </span>
        </button>

        <button
          type="button"
          @click="activeTab = 'pricing'"
          :class="[
            'px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2',
            activeTab === 'pricing'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50',
          ]"
        >
          <span>۵. قیمت و انبار پایه</span>
        </button>

        <button
          type="button"
          @click="activeTab = 'seo'"
          :class="[
            'px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2',
            activeTab === 'seo'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50',
          ]"
        >
          <span>۶. سئو و انتشار</span>
        </button>
      </div>

      <!-- TAB 1: General Info -->
      <div v-show="activeTab === 'general'" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-5">
            <div class="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 space-y-4">
              <h3 class="text-sm font-bold text-zinc-200 border-b border-zinc-800 pb-3 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-purple-500"></span>
                نام و هویت کالا
              </h3>

              <div>
                <label class="block text-xs font-semibold text-zinc-300 mb-1.5">
                  نام رسمی محصول <span class="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="form.name"
                  class="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-zinc-300 mb-1.5">اسلاگ یکتا (Slug)</label>
                  <input
                    type="text"
                    v-model="form.slug"
                    class="w-full px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 text-left focus:outline-none focus:border-purple-500 transition"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-zinc-300 mb-1.5">کد انبارداری ریشه (Base SKU)</label>
                  <input
                    type="text"
                    v-model="form.sku"
                    class="w-full px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 text-left focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-zinc-300 mb-1.5">شعار تبلیغاتی کوتاه</label>
                <input
                  type="text"
                  v-model="form.tagline"
                  class="w-full px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-zinc-300 mb-1.5">توضیح مختصر محصول</label>
                <textarea
                  v-model="form.shortDescription"
                  rows="2"
                  class="w-full px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-purple-500 transition resize-none"
                ></textarea>
              </div>

              <div>
                <label class="block text-xs font-semibold text-zinc-300 mb-1.5">معرفی کامل و مشخصات</label>
                <textarea
                  v-model="form.description"
                  rows="6"
                  class="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-purple-500 transition leading-relaxed"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="space-y-5">
            <div class="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 space-y-4">
              <h3 class="text-sm font-bold text-zinc-200 border-b border-zinc-800 pb-3 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
                دسته‌بندی و روابط
              </h3>

              <div>
                <label class="block text-xs font-semibold text-zinc-300 mb-1.5">نوع محصول</label>
                <select
                  v-model="form.productTypeId"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option v-for="pt in productTypes" :key="pt.id" :value="pt.id">
                    {{ pt.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-zinc-300 mb-1.5">دسته‌بندی فروشگاه</label>
                <select
                  v-model="form.categoryId"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-zinc-300 mb-1.5">برند سازنده</label>
                <select
                  v-model="form.brandId"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option v-for="b in brands" :key="b.id" :value="b.id">
                    {{ b.name }}
                  </option>
                </select>
              </div>

              <div v-if="suppliers.length > 0">
                <label class="block text-xs font-semibold text-zinc-300 mb-1.5">تأمین‌کننده مارکت‌پلیس</label>
                <select
                  v-model="form.supplierId"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option :value="undefined">تأمین مستقیم (فروشگاه ویپ‌لب)</option>
                  <option v-for="s in suppliers" :key="s.id" :value="s.id">
                    {{ s.companyName }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 2: Media & Gallery -->
      <div v-show="activeTab === 'media'" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main Image -->
          <div class="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 space-y-4">
            <h3 class="text-sm font-bold text-zinc-200 border-b border-zinc-800 pb-3 flex items-center justify-between">
              <span class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-[#00DC82]"></span>
                تصویر اصلی کالا
              </span>
              <span class="text-[10px] text-zinc-400">پیش‌فرض در کاتالوگ</span>
            </h3>

            <div
              @click="openImagePicker('main')"
              class="aspect-square w-full rounded-2xl border-2 border-dashed border-zinc-800 bg-zinc-950/60 overflow-hidden hover:border-[#00DC82]/80 transition cursor-pointer flex flex-col items-center justify-center p-4 relative group"
            >
              <img
                v-if="form.mainImage"
                :src="form.mainImage"
                alt="Main image"
                class="w-full h-full object-contain rounded-xl"
              />
              <div v-else class="text-center space-y-2">
                <div class="w-12 h-12 rounded-xl bg-[#00DC82]/10 border border-[#00DC82]/20 flex items-center justify-center mx-auto text-[#00DC82]">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p class="text-xs font-bold text-zinc-300">کلیک برای انتخاب تصویر از کتابخانه MinIO</p>
                <p class="text-[10px] text-zinc-500">فرمت‌های مجاز: WebP, PNG, JPG</p>
              </div>

              <div
                v-if="form.mainImage"
                class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2"
              >
                <span class="text-xs text-white bg-[#00DC82] px-3 py-1.5 rounded-lg font-bold">تغییر تصویر</span>
                <button
                  type="button"
                  @click.stop="form.mainImage = ''"
                  class="text-xs text-rose-300 bg-rose-950/80 border border-rose-800 px-3 py-1.5 rounded-lg font-bold hover:bg-rose-900"
                >
                  حذف
                </button>
              </div>
            </div>

            <!-- Direct Main Image Upload Action -->
            <div class="pt-2 flex items-center gap-2">
              <input
                ref="mainFileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="onDirectMainUpload"
              />
              <button
                type="button"
                :disabled="directMainUploading"
                @click="mainFileInput?.click()"
                class="w-full py-2 px-3 rounded-xl bg-[#00DC82]/10 border border-[#00DC82]/30 hover:bg-[#00DC82]/20 text-[#00DC82] text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span v-if="directMainUploading" class="w-3.5 h-3.5 border-2 border-[#00DC82] border-t-transparent rounded-full animate-spin" />
                <span v-else>📤</span>
                <span>{{ directMainUploading ? 'در حال آپلود به MinIO...' : 'آپلود مستقیم از کامپیوتر' }}</span>
              </button>
            </div>
          </div>

          <!-- Gallery Images (2 Cols) -->
          <div class="lg:col-span-2 p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 space-y-4">
            <div class="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 class="text-sm font-bold text-zinc-200 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-[#00DC82]"></span>
                گالری تصاویر محصول
              </h3>

              <div class="flex items-center gap-2">
                <!-- Direct Multi-File Upload -->
                <input
                  ref="galleryFileInput"
                  type="file"
                  multiple
                  accept="image/*"
                  class="hidden"
                  @change="onDirectGalleryUpload"
                />
                <button
                  type="button"
                  :disabled="directGalleryUploading"
                  @click="galleryFileInput?.click()"
                  class="px-3 py-1.5 rounded-xl bg-[#00DC82]/10 border border-[#00DC82]/30 hover:bg-[#00DC82]/20 text-[#00DC82] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <span v-if="directGalleryUploading" class="w-3 h-3 border-2 border-[#00DC82] border-t-transparent rounded-full animate-spin" />
                  <span v-else>📁</span>
                  <span>{{ directGalleryUploading ? 'آپلود چندتایی...' : 'آپلود مستقیم چندتایی' }}</span>
                </button>

                <button
                  type="button"
                  @click="openImagePicker('gallery')"
                  class="px-3.5 py-1.5 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-zinc-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>+</span> انتخاب از کتابخانه
                </button>
              </div>
            </div>

            <div v-if="form.galleryImages.length === 0" class="p-10 border border-dashed border-zinc-800 rounded-xl text-center text-zinc-500 text-xs">
              عکسی در گالری اضافه نشده است.
            </div>

            <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <div
                v-for="(img, idx) in form.galleryImages"
                :key="img + idx"
                class="aspect-square rounded-xl border border-zinc-800 bg-zinc-950 relative overflow-hidden group"
              >
                <img :src="img" alt="Gallery" class="w-full h-full object-cover" />
                <button
                  type="button"
                  @click="removeGalleryImage(idx)"
                  class="absolute top-1.5 right-1.5 bg-rose-950/80 border border-rose-800/80 text-rose-300 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition hover:bg-rose-900"
                  title="حذف از گالری"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 3: Dynamic Technical Specs -->
      <div v-show="activeTab === 'specs'" class="space-y-6">
        <div class="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 space-y-4">
          <h3 class="text-sm font-bold text-zinc-200 border-b border-zinc-800 pb-3 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-cyan-500"></span>
            مشخصات فنی داینامیک: {{ selectedProductType?.name }}
          </h3>

          <DynamicSpecsForm
            :product-type="selectedProductType"
            v-model="dynamicAttributeValues"
          />
        </div>
      </div>

      <!-- TAB 4: Variants -->
      <div v-show="activeTab === 'variants'" class="space-y-6">
        <VariantMatrixGenerator
          :product-type="selectedProductType"
          v-model:variants="variants"
          :base-sku="form.sku"
          :base-price="form.price"
          :compare-at-price="form.compareAtPrice"
          :default-stock="form.stock"
        />
      </div>

      <!-- TAB 5: Pricing -->
      <div v-show="activeTab === 'pricing'" class="space-y-6">
        <div class="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 space-y-5 max-w-3xl">
          <h3 class="text-sm font-bold text-zinc-200 border-b border-zinc-800 pb-3 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            قیمت‌گذاری پایه و موجودی ریشه
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-zinc-300 mb-1.5">قیمت پایه فروش (تومان)</label>
              <input
                type="number"
                v-model.number="form.price"
                class="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm font-mono text-zinc-100 text-left focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-zinc-300 mb-1.5">قیمت قبل تخفیف (تومان)</label>
              <input
                type="number"
                v-model.number="form.compareAtPrice"
                class="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm font-mono text-zinc-400 text-left focus:outline-none focus:border-purple-500 transition"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-zinc-300 mb-1.5">موجودی ریشه کالا</label>
            <input
              type="number"
              v-model.number="form.stock"
              class="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm font-mono text-zinc-100 text-left focus:outline-none focus:border-purple-500 transition"
            />
          </div>
        </div>
      </div>

      <!-- TAB 6: SEO -->
      <div v-show="activeTab === 'seo'" class="space-y-6">
        <div class="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 space-y-5 max-w-3xl">
          <h3 class="text-sm font-bold text-zinc-200 border-b border-zinc-800 pb-3 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-amber-500"></span>
            تنظیمات انتشار و سئو
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label class="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 flex items-center justify-between cursor-pointer hover:border-zinc-700 transition">
              <span class="text-xs text-zinc-300 font-medium">محصول ویژه</span>
              <input type="checkbox" v-model="form.featured" class="w-4 h-4 rounded text-purple-600 bg-zinc-900 border-zinc-800" />
            </label>

            <label class="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 flex items-center justify-between cursor-pointer hover:border-zinc-700 transition">
              <span class="text-xs text-zinc-300 font-medium">محصول جدید</span>
              <input type="checkbox" v-model="form.newArrival" class="w-4 h-4 rounded text-purple-600 bg-zinc-900 border-zinc-800" />
            </label>

            <label class="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 flex items-center justify-between cursor-pointer hover:border-zinc-700 transition">
              <span class="text-xs text-zinc-300 font-medium">پرفروش</span>
              <input type="checkbox" v-model="form.bestSeller" class="w-4 h-4 rounded text-purple-600 bg-zinc-900 border-zinc-800" />
            </label>
          </div>

          <div>
            <label class="block text-xs font-semibold text-zinc-300 mb-1.5">عنوان سئو</label>
            <input
              type="text"
              v-model="form.seoTitle"
              class="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-zinc-300 mb-1.5">توضیحات سئو</label>
            <textarea
              v-model="form.seoDescription"
              rows="3"
              class="w-full px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-purple-500 transition resize-none"
            ></textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Picker Modal -->
    <ImagePickerModal
      v-model="imagePickerOpen"
      @select="onImagePicked"
      :title="imagePickerMode === 'main' ? 'انتخاب تصویر شاخص محصول' : 'انتخاب تصویر برای گالری محصول'"
    />
  </div>
</template>

