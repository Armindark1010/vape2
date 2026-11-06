<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMedia } from '~/composables/useMedia';

definePageMeta({
  layout: 'admin',
});

useSeoMeta({
  title: 'مدیریت دسته‌بندی‌های کالا — ویپ‌لب',
});

const { uploadSingle, uploading } = useMedia();

const categories = ref<any[]>([]);
const loading = ref(true);
const modalOpen = ref(false);
const imagePickerOpen = ref(false);
const editingCategory = ref<any | null>(null);
const saving = ref(false);
const categoryFileInput = ref<HTMLInputElement | null>(null);

const form = ref({
  name: '',
  slug: '',
  description: '',
  image: '',
  featured: true,
});

const columns = [
  { key: 'preview', label: 'تصویر / آیکون', align: 'center' as const },
  { key: 'name', label: 'نام دسته‌بندی', sortable: true },
  { key: 'slug', label: 'اسلاگ انگلیسی (Slug)' },
  { key: 'description', label: 'توضیحات کوتاه' },
  { key: 'productsCount', label: 'تنوع کالاها', sortable: true, align: 'center' as const },
  { key: 'featured', label: 'ویژه صفحه اصلی', align: 'center' as const },
  { key: 'actions', label: 'عملیات', align: 'center' as const },
];

const loadCategories = async () => {
  loading.value = true;
  try {
    const res = await $fetch<any[]>('/api/v1/categories');
    categories.value = res.map(c => ({
      ...c,
      productsCount: c.products?.length ?? c._count?.products ?? c.productCount ?? 0,
    }));
  } catch (err) {
    console.warn('Error loading categories:', err);
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  editingCategory.value = null;
  form.value = {
    name: '',
    slug: '',
    description: '',
    image: '',
    featured: true,
  };
  modalOpen.value = true;
};

const openEditModal = (c: any) => {
  editingCategory.value = c;
  form.value = {
    name: c.name,
    slug: c.slug,
    description: c.description || '',
    image: c.image || '',
    featured: c.featured !== false,
  };
  modalOpen.value = true;
};

const onDirectUpload = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;
  const file = input.files[0];
  if (!file) return;

  try {
    const uploaded = await uploadSingle(file);
    form.value.image = uploaded.url;
  } catch (err: any) {
    alert('خطا در آپلود عکس به MinIO: ' + (err.message || 'خطای سرور'));
  } finally {
    input.value = '';
  }
};

const saveCategory = async () => {
  if (!form.value.name.trim()) {
    alert('نام دسته‌بندی الزامی است');
    return;
  }

  saving.value = true;
  try {
    if (editingCategory.value) {
      await $fetch(`/api/v1/categories/${editingCategory.value.id}`, {
        method: 'PATCH',
        body: form.value,
      });
    } else {
      await $fetch('/api/v1/categories', {
        method: 'POST',
        body: form.value,
      });
    }
    modalOpen.value = false;
    await loadCategories();
  } catch (err: any) {
    alert('خطا در ذخیره دسته‌بندی: ' + (err?.data?.message || err.message));
  } finally {
    saving.value = false;
  }
};

const deleteCategory = async (c: any) => {
  if (!confirm(`آیا از حذف دسته‌بندی "${c.name}" اطمینان دارید؟`)) return;
  try {
    await $fetch(`/api/v1/categories/${c.id}`, {
      method: 'DELETE',
    });
    await loadCategories();
  } catch (err: any) {
    alert('خطا در حذف دسته‌بندی: ' + (err?.data?.message || err.message));
  }
};

onMounted(() => {
  loadCategories();
});
</script>

<template>
  <DashboardUDashboardPanel>
    <template #header>
      <DashboardUDashboardNavbar title="دسته‌بندی‌های تخصصی ویپ‌لب" badge="Categories">
        <template #right>
          <button
            type="button"
            @click="openCreateModal"
            class="px-3.5 py-1.5 rounded-xl bg-[#00DC82] text-zinc-950 font-bold text-xs hover:bg-[#00c575] transition flex items-center gap-1.5 cursor-pointer"
          >
            <DashboardIcon name="plus" :size="15" />
            <span>ایجاد دسته‌بندی جدید</span>
          </button>
        </template>
      </DashboardUDashboardNavbar>
    </template>

    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <DashboardUDashboardKpiCard
        title="تعداد دسته‌بندی‌های فعال"
        :value="categories.length.toLocaleString('fa-IR')"
        icon="categories"
        subtitle="شامل پاد، سالت، جویس و کویل"
        :loading="loading"
      />

      <DashboardUDashboardKpiCard
        title="دسته‌بندی‌های ویژه"
        :value="categories.filter(c => c.featured).length.toLocaleString('fa-IR')"
        icon="overview"
        subtitle="نمایش در اسلایدر صفحه نخست"
        :loading="loading"
      />

      <DashboardUDashboardKpiCard
        title="مجموع کالاهای دسته‌بندی شده"
        :value="categories.reduce((sum, c) => sum + (c.productsCount || 0), 0).toLocaleString('fa-IR') + ' کالا'"
        icon="products"
        subtitle="تخصیص یافته به کاتالوگ"
        :loading="loading"
      />
    </div>

    <DashboardUDashboardDataTable
      :columns="columns"
      :rows="categories"
      search-placeholder="جستجوی نام دسته‌بندی یا اسلاگ..."
      :loading="loading"
    >
      <template #preview="{ row }">
        <div class="w-10 h-10 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 flex items-center justify-center mx-auto">
          <img v-if="row.image" :src="row.image" :alt="row.name" class="w-full h-full object-cover" />
          <DashboardIcon v-else name="categories" :size="20" class="text-zinc-600" />
        </div>
      </template>

      <template #name="{ row }">
        <div class="flex items-center gap-2.5">
          <DashboardIcon name="categories" :size="16" class="text-[#00DC82]" />
          <span class="font-bold text-white">{{ row.name }}</span>
        </div>
      </template>

      <template #slug="{ row }">
        <span class="font-mono text-xs text-zinc-400">{{ row.slug }}</span>
      </template>

      <template #description="{ row }">
        <span class="text-xs text-zinc-400">{{ row.description || 'توضیحی ثبت نشده است' }}</span>
      </template>

      <template #productsCount="{ row }">
        <span class="font-mono font-bold text-[#00DC82] px-2 py-0.5 rounded bg-[#00DC82]/10 border border-[#00DC82]/25">
          {{ (row.productsCount || 0).toLocaleString('fa-IR') }}
        </span>
      </template>

      <template #featured="{ row }">
        <DashboardUDashboardBadge :variant="row.featured ? 'success' : 'neutral'" :dot="true">
          {{ row.featured ? 'ویژه' : 'عادی' }}
        </DashboardUDashboardBadge>
      </template>

      <template #actions="{ row }">
        <div class="flex items-center justify-center gap-1.5">
          <button
            type="button"
            @click="openEditModal(row)"
            class="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-200 hover:text-white transition cursor-pointer"
          >
            ویرایش
          </button>
          <button
            type="button"
            @click="deleteCategory(row)"
            class="px-2.5 py-1 rounded-lg border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 text-xs transition cursor-pointer"
          >
            حذف
          </button>
        </div>
      </template>
    </DashboardUDashboardDataTable>

    <!-- Create / Edit Modal -->
    <DashboardUDashboardModal
      v-model="modalOpen"
      :title="editingCategory ? 'ویرایش دسته‌بندی کالا' : 'ایجاد دسته‌بندی جدید'"
      description="پیکربندی نام، شناسه انگلیسی و تصویر دسته‌بندی در MinIO"
      max-width="md"
    >
      <div class="space-y-4 text-right">
        <div>
          <label class="block text-xs font-bold text-zinc-300 mb-1.5">نام دسته‌بندی</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="مثال: پاد یک‌بارمصرف"
            class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#00DC82]"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-zinc-300 mb-1.5">شناسه انگلیسی (Slug)</label>
          <input
            v-model="form.slug"
            type="text"
            placeholder="disposable-pod"
            class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-[#00DC82]"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-zinc-300 mb-1.5">توضیحات کوتاه</label>
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="توضیح کوتاه درباره این دسته از محصولات..."
            class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#00DC82]"
          />
        </div>

        <!-- Image with MinIO Upload -->
        <div>
          <label class="block text-xs font-bold text-zinc-300 mb-1.5">تصویر / آیکون دسته‌بندی (MinIO)</label>
          <div class="flex items-center gap-2">
            <input
              v-model="form.image"
              type="text"
              placeholder="نشانی تصویر در MinIO..."
              class="flex-1 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-[#00DC82]"
            />

            <input
              ref="categoryFileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="onDirectUpload"
            />
            <button
              type="button"
              :disabled="uploading"
              @click="categoryFileInput?.click()"
              class="px-3 py-2 rounded-xl bg-[#00DC82]/10 border border-[#00DC82]/30 hover:bg-[#00DC82]/20 text-[#00DC82] text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
              title="آپلود مستقیم عکس به MinIO"
            >
              <span v-if="uploading" class="w-3.5 h-3.5 border-2 border-[#00DC82] border-t-transparent rounded-full animate-spin" />
              <DashboardIcon v-else name="plus" :size="14" />
              <span>{{ uploading ? 'آپلود...' : 'آپلود' }}</span>
            </button>

            <button
              type="button"
              @click="imagePickerOpen = true"
              class="px-3.5 py-2 rounded-xl bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <DashboardIcon name="categories" :size="15" />
              <span>کتابخانه</span>
            </button>
          </div>
        </div>

        <div v-if="form.image" class="pt-2">
          <div class="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
            <img :src="form.image" alt="Preview" class="w-12 h-12 rounded-lg object-cover border border-zinc-800" />
            <div class="flex-1 truncate font-mono text-xs text-zinc-400">{{ form.image }}</div>
            <button type="button" @click="form.image = ''" class="text-rose-400 text-xs hover:underline">حذف</button>
          </div>
        </div>

        <div class="flex items-center gap-2 pt-2">
          <input
            id="featuredCat"
            v-model="form.featured"
            type="checkbox"
            class="rounded border-zinc-800 text-[#00DC82] focus:ring-[#00DC82]"
          />
          <label for="featuredCat" class="text-xs text-zinc-300 font-bold cursor-pointer">
            نمایش در دسته‌بندی‌های برگزیده صفحه اصلی (Featured)
          </label>
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
          :disabled="saving"
          @click="saveCategory"
          class="px-5 py-2 rounded-xl bg-[#00DC82] text-zinc-950 hover:bg-[#00c575] font-bold text-xs transition disabled:opacity-50 cursor-pointer"
        >
          {{ saving ? 'در حال ثبت...' : 'ذخیره دسته‌بندی' }}
        </button>
      </template>
    </DashboardUDashboardModal>

    <!-- Global Image Picker Modal -->
    <DashboardImagePickerModal
      v-model="imagePickerOpen"
      :selected-url="form.image"
      title="انتخاب تصویر دسته‌بندی از کتابخانه رسانه MinIO"
      @select="(url) => form.image = url"
    />
  </DashboardUDashboardPanel>
</template>
