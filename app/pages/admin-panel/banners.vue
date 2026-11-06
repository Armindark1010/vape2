<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMedia } from '~/composables/useMedia';

definePageMeta({
  layout: 'admin',
});

useSeoMeta({
  title: 'مدیریت بنرهای تبلیغاتی و اسلایدرها — ویپ‌لب',
});

const { uploadSingle, uploading } = useMedia();

const banners = ref<any[]>([]);
const loading = ref(true);
const modalOpen = ref(false);
const imagePickerOpen = ref(false);
const editingBanner = ref<any | null>(null);
const saving = ref(false);
const bannerFileInput = ref<HTMLInputElement | null>(null);

const onDirectUpload = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;
  const file = input.files[0];
  if (!file) return;

  try {
    const uploaded = await uploadSingle(file);
    form.value.imageUrl = uploaded.url;
  } catch (err: any) {
    alert('خطا در آپلود مستقیم به MinIO: ' + (err.message || 'خطای سرور'));
  } finally {
    input.value = '';
  }
};

const form = ref({
  title: '',
  subtitle: '',
  badge: '',
  imageUrl: '',
  linkUrl: '/shop',
  displayOrder: 1,
  isActive: true,
});

const columns = [
  { key: 'preview', label: 'پیش‌نمایش تصویر', align: 'center' as const },
  { key: 'title', label: 'عنوان بنر و متن فرعی', sortable: true },
  { key: 'badge', label: 'نشان / برچسب' },
  { key: 'displayOrder', label: 'اولویت نمایش', sortable: true, align: 'center' as const },
  { key: 'isActive', label: 'وضعیت', sortable: true, align: 'center' as const },
  { key: 'actions', label: 'عملیات', align: 'center' as const },
];

const loadBanners = async () => {
  loading.value = true;
  try {
    const res = await $fetch<any[]>('/api/admin/banners');
    banners.value = res || [];
  } catch (err) {
    console.warn('Error loading banners:', err);
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  editingBanner.value = null;
  form.value = {
    title: '',
    subtitle: '',
    badge: 'تخفیف ویژه',
    imageUrl: 'https://images.pexels.com/photos/19344605/pexels-photo-19344605.jpeg?auto=compress&cs=tinysrgb&w=1200',
    linkUrl: '/shop',
    displayOrder: banners.value.length + 1,
    isActive: true,
  };
  modalOpen.value = true;
};

const openEditModal = (b: any) => {
  editingBanner.value = b;
  form.value = {
    title: b.title,
    subtitle: b.subtitle || '',
    badge: b.badge || '',
    imageUrl: b.imageUrl,
    linkUrl: b.linkUrl || '/shop',
    displayOrder: b.displayOrder || 1,
    isActive: b.isActive !== false,
  };
  modalOpen.value = true;
};

const saveBanner = async () => {
  if (!form.value.title || !form.value.imageUrl) {
    alert('عنوان و آدرس تصویر بنر الزامی است');
    return;
  }

  saving.value = true;
  try {
    if (editingBanner.value) {
      await $fetch('/api/admin/banners', {
        method: 'PATCH',
        body: {
          id: editingBanner.value.id,
          ...form.value,
        },
      });
    } else {
      await $fetch('/api/admin/banners', {
        method: 'POST',
        body: form.value,
      });
    }
    modalOpen.value = false;
    await loadBanners();
  } catch (err: any) {
    alert('خطا در ذخیره بنر: ' + (err?.data?.message || err.message));
  } finally {
    saving.value = false;
  }
};

const toggleBanner = async (b: any) => {
  try {
    await $fetch('/api/admin/banners', {
      method: 'PATCH',
      body: {
        id: b.id,
        isActive: !b.isActive,
      },
    });
    b.isActive = !b.isActive;
  } catch (err: any) {
    alert('خطا در تغییر وضعیت بنر: ' + (err?.data?.message || err.message));
  }
};

const deleteBanner = async (b: any) => {
  if (!confirm(`آیا از حذف بنر "${b.title}" اطمینان دارید؟`)) return;
  try {
    await $fetch('/api/admin/banners', {
      method: 'DELETE',
      body: { id: b.id },
    });
    await loadBanners();
  } catch (err: any) {
    alert('خطا در حذف بنر: ' + (err?.data?.message || err.message));
  }
};

onMounted(() => {
  loadBanners();
});
</script>

<template>
  <DashboardUDashboardPanel>
    <template #header>
      <DashboardUDashboardNavbar title="مدیریت بنرهای اسلایدر صفحه اصلی" badge="Marketing">
        <template #right>
          <button
            type="button"
            @click="openCreateModal"
            class="px-3.5 py-1.5 rounded-xl bg-[#00DC82] text-zinc-950 font-bold text-xs hover:bg-[#00c575] transition flex items-center gap-1.5 cursor-pointer"
          >
            <DashboardIcon name="plus" :size="15" />
            <span>ایجاد بنر جدید</span>
          </button>
        </template>
      </DashboardUDashboardNavbar>
    </template>

    <!-- Table -->
    <DashboardUDashboardDataTable
      :columns="columns"
      :rows="banners"
      search-placeholder="جستجوی عنوان بنر یا لینک..."
      :loading="loading"
    >
      <template #preview="{ row }">
        <div class="w-20 h-10 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
          <img :src="row.imageUrl" :alt="row.title" class="w-full h-full object-cover" />
        </div>
      </template>

      <template #title="{ row }">
        <div>
          <div class="font-bold text-white">{{ row.title }}</div>
          <div class="text-[11px] text-zinc-500">{{ row.subtitle || '---' }}</div>
        </div>
      </template>

      <template #badge="{ row }">
        <span v-if="row.badge" class="px-2 py-0.5 rounded-md bg-[#00DC82]/10 text-[#00DC82] text-[10.5px] font-bold border border-[#00DC82]/25 font-mono">
          {{ row.badge }}
        </span>
        <span v-else class="text-zinc-500 text-xs">---</span>
      </template>

      <template #displayOrder="{ row }">
        <span class="font-mono font-bold text-white">
          {{ row.displayOrder }}
        </span>
      </template>

      <template #isActive="{ row }">
        <DashboardUDashboardBadge :variant="row.isActive ? 'success' : 'neutral'" :dot="true">
          {{ row.isActive ? 'فعال در سایت' : 'غیرفعال' }}
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
            @click="toggleBanner(row)"
            class="px-2 py-1 rounded-lg border text-xs transition cursor-pointer"
            :class="row.isActive ? 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10' : 'border-[#00DC82]/30 text-[#00DC82] hover:bg-[#00DC82]/10'"
          >
            {{ row.isActive ? 'مخفی' : 'نمایش' }}
          </button>
          <button
            type="button"
            @click="deleteBanner(row)"
            class="px-2.5 py-1 rounded-lg border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 text-xs transition cursor-pointer"
          >
            حذف
          </button>
        </div>
      </template>
    </DashboardUDashboardDataTable>

    <!-- Create / Edit Banner Modal -->
    <DashboardUDashboardModal
      v-model="modalOpen"
      :title="editingBanner ? 'ویرایش بنر تبلیغاتی' : 'ایجاد بنر جدید اسلایدر'"
      description="پیکربندی تصویر، متن‌های بازاریابی و لینک مقصد در سایت"
      max-width="md"
    >
      <div class="space-y-4 text-right">
        <div>
          <label class="block text-xs font-bold text-zinc-300 mb-1.5">عنوان اصلی بنر</label>
          <input
            v-model="form.title"
            type="text"
            placeholder="مثال: نسل جدید پادسیستم‌های ۲۰۲۶"
            class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#00DC82]"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-zinc-300 mb-1.5">متن فرعی / توضیحات کوتاه</label>
          <input
            v-model="form.subtitle"
            type="text"
            placeholder="مثال: تجربه کام‌دهی نرم با سالت نیکوتین اصل مالزی"
            class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#00DC82]"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-zinc-300 mb-1.5">برچسب یا نشان (Badge)</label>
            <input
              v-model="form.badge"
              type="text"
              placeholder="تخفیف ویژه / پرفروش"
              class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#00DC82]"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-zinc-300 mb-1.5">اولویت نمایش (Sort Order)</label>
            <input
              v-model="form.displayOrder"
              type="number"
              class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-[#00DC82]"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-zinc-300 mb-1.5">تصویر بنر تبلیغاتی</label>
          <div class="flex items-center gap-2">
            <input
              v-model="form.imageUrl"
              type="text"
              placeholder="نشانی تصویر یا انتخاب از MinIO..."
              class="flex-1 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-[#00DC82]"
            />

            <!-- Direct Upload Trigger -->
            <input
              ref="bannerFileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="onDirectUpload"
            />
            <button
              type="button"
              :disabled="uploading"
              @click="bannerFileInput?.click()"
              class="px-3 py-2 rounded-xl bg-[#00DC82]/10 border border-[#00DC82]/30 hover:bg-[#00DC82]/20 text-[#00DC82] text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
              title="آپلود مستقیم عکس به MinIO"
            >
              <span v-if="uploading" class="w-3.5 h-3.5 border-2 border-[#00DC82] border-t-transparent rounded-full animate-spin" />
              <DashboardIcon v-else name="plus" :size="14" />
              <span>{{ uploading ? 'در حال آپلود...' : 'آپلود به MinIO' }}</span>
            </button>

            <!-- Media Library Modal Trigger -->
            <button
              type="button"
              @click="imagePickerOpen = true"
              class="px-3.5 py-2 rounded-xl bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <DashboardIcon name="banners" :size="15" />
              <span>کتابخانه</span>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-zinc-300 mb-1.5">لینک مقصد بنر (Click Link)</label>
          <input
            v-model="form.linkUrl"
            type="text"
            placeholder="/shop?cat=pods"
            class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-[#00DC82]"
          />
        </div>

        <!-- Preview -->
        <div v-if="form.imageUrl" class="pt-2">
          <div class="flex items-center justify-between mb-1">
            <label class="text-xs font-bold text-zinc-400">پیش‌نمایش بنر انتخابی:</label>
            <button
              type="button"
              @click="imagePickerOpen = true"
              class="text-[11px] text-[#00DC82] hover:underline cursor-pointer"
            >
              تغییر تصویر
            </button>
          </div>
          <div class="h-28 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
            <img :src="form.imageUrl" alt="Preview" class="w-full h-full object-cover" />
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
          :disabled="saving"
          @click="saveBanner"
          class="px-5 py-2 rounded-xl bg-[#00DC82] text-zinc-950 hover:bg-[#00c575] font-bold text-xs transition disabled:opacity-50 cursor-pointer"
        >
          {{ saving ? 'در حال ثبت...' : 'ذخیره بنر' }}
        </button>
      </template>
    </DashboardUDashboardModal>

    <!-- Global Image Picker Modal for Banners -->
    <DashboardImagePickerModal
      v-model="imagePickerOpen"
      :selected-url="form.imageUrl"
      title="انتخاب تصویر بنر از کتابخانه رسانه MinIO"
      @select="(url) => form.imageUrl = url"
    />
  </DashboardUDashboardPanel>
</template>
