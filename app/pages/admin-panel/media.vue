<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useMedia, type MediaFileItem, type MediaStats } from '~/composables/useMedia';

definePageMeta({
  layout: 'admin',
});

const {
  getMediaList,
  uploadMultiple,
  deleteMedia,
  bulkDeleteMedia,
  formatBytes,
  loading,
  uploading,
  error,
} = useMedia();

const mediaItems = ref<MediaFileItem[]>([]);
const stats = ref<MediaStats>({
  totalFiles: 0,
  totalBytes: 0,
  s3Available: true,
  bucketName: 'vapelab-media',
});

const searchQuery = ref('');
const selectedType = ref('all');
const sortBy = ref<'createdAt' | 'size' | 'originalName'>('createdAt');
const sortOrder = ref<'asc' | 'desc'>('desc');
const page = ref(1);
const limit = ref(24);
const totalPages = ref(1);
const totalItems = ref(0);

// Multi-selection state
const selectedIds = ref<number[]>([]);
const isSelectAll = computed(() => {
  return mediaItems.value.length > 0 && selectedIds.value.length === mediaItems.value.length;
});

// Drag & drop upload area state
const showUploadZone = ref(false);
const isDragOver = ref(false);
const uploadQueue = ref<{ name: string; size: number; status: 'pending' | 'success' | 'error' }[]>([]);

// Preview modal state
const previewItem = ref<MediaFileItem | null>(null);

// Toast feedback
const toastMessage = ref<string | null>(null);
const showToast = (msg: string) => {
  toastMessage.value = msg;
  setTimeout(() => {
    toastMessage.value = null;
  }, 2500);
};

const loadMedia = async () => {
  const res = await getMediaList({
    search: searchQuery.value,
    type: selectedType.value,
    sortBy: sortBy.value,
    order: sortOrder.value,
    page: page.value,
    limit: limit.value,
  });

  mediaItems.value = res.items;
  totalItems.value = res.total;
  totalPages.value = res.totalPages;
  stats.value = res.stats;
  selectedIds.value = [];
};

let searchDebounce: any = null;
watch([searchQuery, selectedType, sortBy, sortOrder], () => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    page.value = 1;
    loadMedia();
  }, 300);
});

onMounted(() => {
  loadMedia();
});

// Selection handlers
const toggleSelect = (id: number) => {
  const index = selectedIds.value.indexOf(id);
  if (index > -1) {
    selectedIds.value.splice(index, 1);
  } else {
    selectedIds.value.push(id);
  }
};

const toggleSelectAll = () => {
  if (isSelectAll.value) {
    selectedIds.value = [];
  } else {
    selectedIds.value = mediaItems.value.map(i => i.id);
  }
};

// Copy URL to clipboard
const copyUrl = async (url: string) => {
  try {
    await navigator.clipboard.writeText(url);
    showToast('نشانی تصویر در کلیپ‌بورد کپی شد!');
  } catch {
    showToast('خطا در کپی نشانی');
  }
};

// Delete single file
const handleDelete = async (item: MediaFileItem) => {
  if (!confirm(`آیا از حذف دائمی فایل «${item.originalName}» از مخزن MinIO اطمینان دارید؟`)) {
    return;
  }
  const ok = await deleteMedia(item.id);
  if (ok) {
    showToast('فایل با موفقیت حذف شد');
    loadMedia();
  } else {
    showToast('خطا در حذف فایل');
  }
};

// Bulk Delete
const handleBulkDelete = async () => {
  if (selectedIds.value.length === 0) return;
  if (!confirm(`آیا از حذف گروهی ${selectedIds.value.length} تصویر انتخاب شده اطمینان دارید؟`)) {
    return;
  }

  const deleted = await bulkDeleteMedia(selectedIds.value);
  showToast(`${deleted} فایل با موفقیت حذف شدند`);
  loadMedia();
};

// File Upload Handler
const handleFilesUpload = async (files: FileList | File[]) => {
  if (!files || files.length === 0) return;

  uploadQueue.value = Array.from(files).map(f => ({
    name: f.name,
    size: f.size,
    status: 'pending',
  }));

  try {
    const res = await uploadMultiple(files);
    showToast(`${res.uploaded.length} فایل با موفقیت در MinIO ذخیره شد`);
    uploadQueue.value = [];
    showUploadZone.value = false;
    loadMedia();
  } catch (err: any) {
    showToast(`خطا در آپلود: ${err.message}`);
  }
};

const onDropFiles = (e: DragEvent) => {
  isDragOver.value = false;
  if (e.dataTransfer?.files) {
    handleFilesUpload(e.dataTransfer.files);
  }
};

const onFileInputChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files) {
    handleFilesUpload(input.files);
  }
};
</script>

<template>
  <DashboardUDashboardPanel>
    <!-- Top Navbar Header -->
    <template #header>
      <DashboardUDashboardNavbar title="کتابخانه رسانه و گالری فایل‌ها (MinIO S3)">
        <template #right>
          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="showUploadZone = !showUploadZone"
              class="px-3.5 py-1.5 rounded-xl bg-[#00DC82] hover:bg-[#00c575] text-zinc-950 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <DashboardIcon name="plus" :size="14" />
              <span>{{ showUploadZone ? 'بستن فرم آپلود' : 'آپلود فایل جدید' }}</span>
            </button>
            <button
              type="button"
              @click="loadMedia"
              class="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition cursor-pointer"
              title="تازه‌سازی لیست"
            >
              <DashboardIcon name="refresh" :size="16" />
            </button>
          </div>
        </template>
      </DashboardUDashboardNavbar>
    </template>

    <!-- Main Content Body -->
    <div class="space-y-6">
      <!-- Storage Status & KPI Banner -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
          <div>
            <span class="text-xs text-zinc-400 block mb-1">کل فایل‌های ذخیره شده</span>
            <span class="text-xl font-bold text-white font-mono">{{ stats.totalFiles }}</span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-[#00DC82]/10 border border-[#00DC82]/20 flex items-center justify-center text-lg text-[#00DC82]">
            <DashboardIcon name="banners" :size="20" />
          </div>
        </div>

        <div class="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
          <div>
            <span class="text-xs text-zinc-400 block mb-1">فضای اشغال‌شده کل</span>
            <span class="text-xl font-bold text-white font-mono">{{ formatBytes(stats.totalBytes) }}</span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-lg text-sky-400">
            <DashboardIcon name="finance" :size="20" />
          </div>
        </div>

        <div class="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
          <div>
            <span class="text-xs text-zinc-400 block mb-1">باکت ذخیره‌سازی ابری</span>
            <span class="text-sm font-bold text-white font-mono">{{ stats.bucketName }}</span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-[#00DC82]/10 border border-[#00DC82]/20 flex items-center justify-center text-lg text-[#00DC82]">
            <DashboardIcon name="categories" :size="20" />
          </div>
        </div>

        <div class="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
          <div>
            <span class="text-xs text-zinc-400 block mb-1">وضعیت سرویس MinIO</span>
            <div class="flex items-center gap-1.5 mt-1">
              <span class="w-2 h-2 rounded-full" :class="stats.s3Available ? 'bg-[#00DC82] animate-pulse' : 'bg-amber-400'" />
              <span class="text-xs font-bold" :class="stats.s3Available ? 'text-[#00DC82]' : 'text-amber-400'">
                {{ stats.s3Available ? 'متصل (S3 Live)' : 'حالت لوکال (Local)' }}
              </span>
            </div>
          </div>
          <div class="w-10 h-10 rounded-xl bg-[#00DC82]/10 border border-[#00DC82]/20 flex items-center justify-center text-lg text-[#00DC82]">
            <DashboardIcon name="zap" :size="20" />
          </div>
        </div>
      </div>

      <!-- Collapsible Drag & Drop Upload Zone -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform opacity-0 -translate-y-2 scale-98"
        enter-to-class="transform opacity-100 translate-y-0 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform opacity-100 translate-y-0 scale-100"
        leave-to-class="transform opacity-0 -translate-y-2 scale-98"
      >
        <div
          v-if="showUploadZone"
          @dragover.prevent="isDragOver = true"
          @dragleave.prevent="isDragOver = false"
          @drop.prevent="onDropFiles"
          class="p-8 rounded-xl border-2 border-dashed bg-zinc-950/60 flex flex-col items-center justify-center text-center transition-all duration-200 relative overflow-hidden"
          :class="isDragOver ? 'border-[#00DC82] bg-[#00DC82]/10 scale-[1.01]' : 'border-zinc-800 hover:border-zinc-700'"
        >
          <div class="w-16 h-16 rounded-xl bg-[#00DC82]/10 border border-[#00DC82]/20 flex items-center justify-center mb-3 text-[#00DC82]">
            <DashboardIcon name="banners" :size="32" />
          </div>

          <h3 class="text-base font-bold text-white mb-1">
            فایل‌ها و تصاویر را به این قسمت بکشید و رها کنید
          </h3>
          <p class="text-xs text-zinc-400 mb-4 max-w-md">
            پشتیبانی از آپلود چندگانه تصاویر با فرمت‌های WebP, PNG, JPG, GIF, SVG, AVIF و مدل‌های سه‌بعدی GLB تا ۱۵ مگابایت
          </p>

          <label
            class="cursor-pointer px-6 py-2.5 rounded-xl bg-[#00DC82] hover:bg-[#00c575] text-zinc-950 text-xs font-bold transition flex items-center gap-2"
          >
            <span v-if="uploading" class="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
            <span>{{ uploading ? 'در حال آپلود و اعتبارسنجی در MinIO...' : 'انتخاب تصاویر از حافظه دستگاه' }}</span>
            <input
              type="file"
              multiple
              accept="image/*,.glb,.gltf"
              class="hidden"
              :disabled="uploading"
              @change="onFileInputChange"
            />
          </label>

          <!-- Upload Progress Status -->
          <div v-if="uploading" class="mt-4 w-full max-w-sm">
            <div class="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden">
              <div class="h-full bg-[#00DC82] animate-pulse rounded-full w-full"></div>
            </div>
            <span class="text-[11px] text-zinc-500 mt-1.5 block">ارسال داده به S3 باکت {{ stats.bucketName }}...</span>
          </div>
        </div>
      </Transition>

      <!-- Search, Filters and Sorting Bar -->
      <div class="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <!-- Search Input -->
        <div class="relative flex-1 min-w-[240px]">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="جستجو در نام فایل‌های ذخیره‌شده..."
            class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#00DC82] focus:outline-none pr-9"
          />
          <DashboardIcon name="search" :size="14" class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        </div>

        <!-- Filter Buttons -->
        <div class="flex items-center gap-1.5 p-1 bg-zinc-950 rounded-xl border border-zinc-800">
          <button
            type="button"
            @click="selectedType = 'all'"
            class="px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer"
            :class="selectedType === 'all' ? 'bg-[#00DC82] text-zinc-950 font-bold shadow-sm' : 'text-zinc-400 hover:text-white'"
          >
            همه
          </button>
          <button
            type="button"
            @click="selectedType = 'images'"
            class="px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer"
            :class="selectedType === 'images' ? 'bg-[#00DC82] text-zinc-950 font-bold shadow-sm' : 'text-zinc-400 hover:text-white'"
          >
            تصاویر
          </button>
          <button
            type="button"
            @click="selectedType = 'webp'"
            class="px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer"
            :class="selectedType === 'webp' ? 'bg-[#00DC82] text-zinc-950 font-bold shadow-sm' : 'text-zinc-400 hover:text-white'"
          >
            WebP
          </button>
          <button
            type="button"
            @click="selectedType = '3d'"
            class="px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer"
            :class="selectedType === '3d' ? 'bg-[#00DC82] text-zinc-950 font-bold shadow-sm' : 'text-zinc-400 hover:text-white'"
          >
            مدل‌های ۳بعدی
          </button>
        </div>

        <!-- Sort Selectors -->
        <div class="flex items-center gap-2 text-xs text-zinc-400">
          <span>مرتب‌سازی:</span>
          <select
            v-model="sortBy"
            class="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white focus:border-[#00DC82] focus:outline-none"
          >
            <option value="createdAt">تاریخ آپلود</option>
            <option value="size">حجم فایل</option>
            <option value="originalName">نام فایل</option>
          </select>
          <button
            type="button"
            @click="sortOrder = sortOrder === 'desc' ? 'asc' : 'desc'"
            class="w-8 h-8 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 flex items-center justify-center text-white text-xs transition cursor-pointer"
            :title="sortOrder === 'desc' ? 'نزولی' : 'صعودی'"
          >
            {{ sortOrder === 'desc' ? '↓' : '↑' }}
          </button>
        </div>
      </div>

      <!-- Bulk Actions Bar (Appears when items are checked) -->
      <div
        v-if="selectedIds.length > 0"
        class="p-3 px-5 rounded-xl bg-[#00DC82]/10 border border-[#00DC82]/25 flex items-center justify-between text-xs animate-in fade-in duration-150"
      >
        <div class="flex items-center gap-3">
          <input
            type="checkbox"
            :checked="isSelectAll"
            @change="toggleSelectAll"
            class="w-4 h-4 rounded text-[#00DC82] focus:ring-0 bg-zinc-950 border-zinc-800"
          />
          <span class="font-bold text-white">
            {{ selectedIds.length }} فایل انتخاب شده است
          </span>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="handleBulkDelete"
            class="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <DashboardIcon name="trash" :size="14" />
            <span>حذف گروهی</span>
          </button>
          <button
            type="button"
            @click="selectedIds = []"
            class="px-3 py-1.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
          >
            لغو انتخاب
          </button>
        </div>
      </div>

      <!-- Media Grid -->
      <div v-if="loading" class="h-64 flex flex-col items-center justify-center text-zinc-500 gap-2">
        <div class="w-8 h-8 border-2 border-[#00DC82] border-t-transparent rounded-full animate-spin"></div>
        <span class="text-xs">در حال دریافت لیست رسانه‌ها از مخزن MinIO...</span>
      </div>

      <div
        v-else-if="mediaItems.length === 0"
        class="h-72 rounded-xl border border-zinc-800 bg-zinc-900/40 flex flex-col items-center justify-center text-center p-6 text-zinc-500"
      >
        <DashboardIcon name="banners" :size="36" class="mb-3 text-zinc-600" />
        <h4 class="text-sm font-bold text-white">کتابخانه رسانه‌ها خالی است</h4>
        <p class="text-xs text-zinc-400 mt-1 max-w-sm">
          می‌توانید با کشیدن تصاویر روی کادر بالا یا کلیک روی «آپلود فایل جدید»، تصاویر را در MinIO ذخیره نمایید.
        </p>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div
          v-for="item in mediaItems"
          :key="item.id"
          class="group relative rounded-xl overflow-hidden border bg-zinc-900/60 transition-all duration-200 flex flex-col"
          :class="selectedIds.includes(item.id)
            ? 'border-[#00DC82] ring-2 ring-[#00DC82]/50'
            : 'border-zinc-800 hover:border-zinc-700'"
        >
          <!-- Thumbnail area -->
          <div class="relative aspect-square w-full bg-black/40 overflow-hidden flex items-center justify-center">
            <img
              v-if="item.mimeType.startsWith('image/')"
              :src="item.url"
              :alt="item.originalName"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div v-else class="flex flex-col items-center justify-center text-2xl text-[#9696AD]">
              📦
              <span class="text-[10px] mt-1 font-mono uppercase">{{ item.originalName.split('.').pop() }}</span>
            </div>

            <!-- Checkbox Overlay -->
            <div class="absolute top-2 right-2 z-10">
              <input
                type="checkbox"
                :checked="selectedIds.includes(item.id)"
                @change="toggleSelect(item.id)"
                class="w-4 h-4 rounded text-[#00DC82] bg-zinc-950/80 border-white/30 focus:ring-0 cursor-pointer"
              />
            </div>

            <!-- Hover Action Toolbar -->
            <div
              class="absolute inset-0 bg-black/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center gap-2 p-2"
            >
              <button
                type="button"
                @click="previewItem = item"
                class="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition cursor-pointer"
                title="مشاهده پیش‌نمایش بزرگ"
              >
                <DashboardIcon name="overview" :size="14" />
              </button>
              <button
                type="button"
                @click="copyUrl(item.url)"
                class="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition cursor-pointer"
                title="کپی لینک مستقیم"
              >
                <DashboardIcon name="refresh" :size="14" />
              </button>
              <button
                type="button"
                @click="handleDelete(item)"
                class="w-8 h-8 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 flex items-center justify-center text-xs transition cursor-pointer"
                title="حذف از MinIO"
              >
                <DashboardIcon name="trash" :size="14" />
              </button>
            </div>
          </div>

          <!-- Card Info Footer -->
          <div class="p-2.5 space-y-1">
            <div class="text-[11px] font-bold text-white truncate" :title="item.originalName">
              {{ item.originalName }}
            </div>
            <div class="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
              <span class="uppercase font-bold text-[#00DC82]">{{ item.originalName.split('.').pop() || 'IMG' }}</span>
              <span>{{ formatBytes(item.size) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Full Image Preview Modal -->
    <ClientOnly>
      <Teleport to="body">
        <div v-if="previewItem" class="relative z-[10000]" dir="rtl">
          <div class="fixed inset-0 bg-black/85 backdrop-blur-md" @click="previewItem = null"></div>

          <div class="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
            <div
              class="w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]"
            >
              <!-- Modal Header -->
              <div class="px-6 py-4 border-b border-zinc-800 flex items-center justify-between shrink-0 bg-zinc-950/80">
                <div>
                  <h3 class="text-sm font-bold text-white">{{ previewItem.originalName }}</h3>
                  <span class="text-[11px] text-zinc-400 font-mono">{{ formatBytes(previewItem.size) }} • {{ previewItem.mimeType }}</span>
                </div>
                <button
                  type="button"
                  @click="previewItem = null"
                  class="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <!-- Image Display -->
              <div class="flex-1 overflow-y-auto p-6 flex items-center justify-center bg-black/60">
                <img :src="previewItem.url" :alt="previewItem.originalName" class="max-h-[60vh] max-w-full object-contain rounded-xl" />
              </div>

              <!-- Metadata & Actions Footer -->
              <div class="px-6 py-4 border-t border-zinc-800 bg-zinc-950/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div class="flex items-center gap-2 min-w-0 max-w-md">
                  <span class="text-zinc-400 shrink-0">نشانی URL:</span>
                  <input
                    type="text"
                    readonly
                    :value="previewItem.url"
                    class="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-[11px] font-mono text-white w-full"
                    dir="ltr"
                  />
                </div>

                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    @click="copyUrl(previewItem.url)"
                    class="px-4 py-2 rounded-xl bg-[#00DC82] hover:bg-[#00c575] text-zinc-950 font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>کپی نشانی فایل</span>
                  </button>
                  <a
                    :href="previewItem.url"
                    target="_blank"
                    download
                    class="px-4 py-2 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-white font-medium transition"
                  >
                    دانلود مستقیم
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Teleport>
    </ClientOnly>

    <!-- Toast Notification -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="transform opacity-0 translate-y-2"
      enter-to-class="transform opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform opacity-100 translate-y-0"
      leave-to-class="transform opacity-0 translate-y-2"
    >
      <div
        v-if="toastMessage"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10001] px-4 py-2.5 rounded-xl bg-[#00DC82] text-zinc-950 text-xs font-bold shadow-2xl flex items-center gap-2"
      >
        <span>✓</span>
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>
  </DashboardUDashboardPanel>
</template>
