<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useMedia, type MediaFileItem } from '~/composables/useMedia';

interface Props {
  modelValue: boolean;
  selectedUrl?: string;
  title?: string;
  multiple?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  selectedUrl: '',
  title: 'انتخاب تصویر از کتابخانه رسانه (MinIO)',
  multiple: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'select', url: string, item?: MediaFileItem): void;
}>();

const { getMediaList, uploadSingle, formatBytes, uploading } = useMedia();

const activeTab = ref<'library' | 'upload' | 'url'>('library');
const mediaItems = ref<MediaFileItem[]>([]);
const loading = ref(false);
const searchQuery = ref('');
const selectedItem = ref<MediaFileItem | null>(null);
const externalUrlInput = ref('');
const isDragOver = ref(false);
const uploadError = ref<string | null>(null);

const close = () => {
  emit('update:modelValue', false);
};

const loadMedia = async () => {
  loading.value = true;
  try {
    const res = await getMediaList({
      search: searchQuery.value,
      type: 'images',
      limit: 30,
    });
    mediaItems.value = res.items;

    // Pre-select if URL matches
    if (props.selectedUrl && !selectedItem.value) {
      const match = mediaItems.value.find(item => item.url === props.selectedUrl);
      if (match) {
        selectedItem.value = match;
      }
    }
  } finally {
    loading.value = false;
  }
};

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    if (props.selectedUrl) {
      externalUrlInput.value = props.selectedUrl;
    }
    loadMedia();
  } else {
    selectedItem.value = null;
    uploadError.value = null;
  }
});

let searchTimeout: any = null;
watch(searchQuery, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    loadMedia();
  }, 300);
});

const handleSelect = (item: MediaFileItem) => {
  selectedItem.value = item;
};

const confirmSelection = () => {
  if (activeTab.value === 'url') {
    if (externalUrlInput.value.trim()) {
      emit('select', externalUrlInput.value.trim());
      close();
    }
    return;
  }

  if (selectedItem.value) {
    emit('select', selectedItem.value.url, selectedItem.value);
    close();
  }
};

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;
  const file = input.files[0];
  if (!file) return;
  await processUpload(file);
};

const handleDrop = async (e: DragEvent) => {
  isDragOver.value = false;
  if (!e.dataTransfer?.files || e.dataTransfer.files.length === 0) return;
  const file = e.dataTransfer.files[0];
  if (!file) return;
  await processUpload(file);
};

const processUpload = async (file: File) => {
  uploadError.value = null;
  try {
    const uploaded = await uploadSingle(file);
    mediaItems.value.unshift(uploaded);
    selectedItem.value = uploaded;
    // Automatically select and apply the freshly uploaded MinIO image
    emit('select', uploaded.url, uploaded);
    close();
  } catch (err: any) {
    uploadError.value = err.message || 'خطا در آپلود فایل';
  }
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) {
    close();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  clearTimeout(searchTimeout);
});
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <div v-if="modelValue" class="relative z-[9999]" dir="rtl">
        <!-- Backdrop -->
        <div
          class="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
          @click="close"
        ></div>

        <!-- Dialog Container -->
        <div class="fixed inset-0 z-[10001] flex items-center justify-center p-3 sm:p-6 pointer-events-none">
          <div
            class="w-full max-w-4xl max-h-[92vh] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col animate-in zoom-in-95 duration-150"
          >
            <!-- Header -->
            <div class="px-6 py-4 border-b border-zinc-800 bg-zinc-950/80 flex items-center justify-between shrink-0">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-[#00DC82]/10 border border-[#00DC82]/20 flex items-center justify-center text-[#00DC82]">
                  <DashboardIcon name="banners" :size="18" />
                </div>
                <div>
                  <h3 class="text-sm font-bold text-white">{{ title }}</h3>
                  <p class="text-[11px] text-zinc-400">فضای ذخیره‌سازی ابری توزیع‌شده MinIO S3</p>
                </div>
              </div>

              <!-- Close Button -->
              <button
                type="button"
                @click="close"
                class="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition flex items-center justify-center cursor-pointer"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Tab Switcher & Search Bar -->
            <div class="px-6 py-3 border-b border-zinc-800 bg-zinc-950/40 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <!-- Tabs -->
              <div class="flex items-center gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
                <button
                  type="button"
                  @click="activeTab = 'library'"
                  class="px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer"
                  :class="activeTab === 'library' ? 'bg-[#00DC82] text-zinc-950 font-bold shadow-sm' : 'text-zinc-400 hover:text-white'"
                >
                  کتابخانه فایل‌ها ({{ mediaItems.length }})
                </button>
                <button
                  type="button"
                  @click="activeTab = 'upload'"
                  class="px-3.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
                  :class="activeTab === 'upload' ? 'bg-[#00DC82] text-zinc-950 font-bold shadow-sm' : 'text-zinc-400 hover:text-white'"
                >
                  <span>آپلود تصویر جدید</span>
                  <DashboardIcon name="plus" :size="12" />
                </button>
                <button
                  type="button"
                  @click="activeTab = 'url'"
                  class="px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer"
                  :class="activeTab === 'url' ? 'bg-[#00DC82] text-zinc-950 font-bold shadow-sm' : 'text-zinc-400 hover:text-white'"
                >
                  لینک دستی (URL)
                </button>
              </div>

              <!-- Search input for library -->
              <div v-if="activeTab === 'library'" class="relative min-w-[220px]">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="جستجو در تصاویر..."
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-[#00DC82] focus:outline-none pr-8"
                />
                <DashboardIcon name="search" :size="14" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              </div>
            </div>

            <!-- Tab 1: Library Grid + Sidebar -->
            <div v-if="activeTab === 'library'" class="flex-1 overflow-hidden flex flex-col md:flex-row min-h-0">
              <!-- Grid Items -->
              <div class="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <!-- Loading State -->
                <div v-if="loading" class="h-64 flex flex-col items-center justify-center text-zinc-500 gap-2">
                  <div class="w-7 h-7 border-2 border-[#00DC82] border-t-transparent rounded-full animate-spin"></div>
                  <span class="text-xs">در حال بارگذاری تصاویر از MinIO...</span>
                </div>

                <!-- Empty State -->
                <div v-else-if="mediaItems.length === 0" class="h-64 flex flex-col items-center justify-center text-center p-6 text-zinc-500">
                  <DashboardIcon name="banners" :size="32" class="mb-2 text-zinc-600" />
                  <p class="text-xs font-bold text-zinc-300">تصویری یافت نشد</p>
                  <p class="text-[11px] text-zinc-500 mt-1">می‌توانید از تب «آپلود تصویر جدید» اولین فایل را ذخیره کنید.</p>
                </div>

                <!-- Grid -->
                <div v-else class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  <div
                    v-for="item in mediaItems"
                    :key="item.id"
                    @click="handleSelect(item)"
                    class="group relative aspect-square rounded-xl overflow-hidden border cursor-pointer transition-all duration-150 bg-zinc-950"
                    :class="selectedItem?.id === item.id
                      ? 'border-[#00DC82] ring-2 ring-[#00DC82]/50 scale-[0.98]'
                      : 'border-zinc-800 hover:border-zinc-700'"
                  >
                    <img
                      :src="item.url"
                      :alt="item.originalName"
                      class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      loading="lazy"
                    />

                    <!-- Selection checkmark overlay -->
                    <div
                      v-if="selectedItem?.id === item.id"
                      class="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#00DC82] text-zinc-950 flex items-center justify-center text-xs font-bold shadow-md"
                    >
                      ✓
                    </div>

                    <!-- Format & Size Badge -->
                    <div class="absolute bottom-1 right-1 left-1 flex items-center justify-between text-[9px] px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-white/90">
                      <span class="uppercase font-mono">{{ item.originalName.split('.').pop() || 'IMG' }}</span>
                      <span class="font-mono">{{ formatBytes(item.size) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Selected Item Details Sidebar -->
              <div
                class="w-full md:w-72 border-t md:border-t-0 md:border-r border-zinc-800 bg-zinc-950/40 p-4 flex flex-col justify-between shrink-0 overflow-y-auto"
              >
                <div v-if="selectedItem" class="space-y-3">
                  <span class="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">مشخصات فایل انتخابی</span>

                  <div class="aspect-video w-full rounded-xl overflow-hidden border border-zinc-800 bg-black/40 flex items-center justify-center">
                    <img :src="selectedItem.url" :alt="selectedItem.originalName" class="max-h-full max-w-full object-contain" />
                  </div>

                  <div class="space-y-1.5 text-xs text-zinc-400">
                    <div class="flex items-center justify-between">
                      <span>نام فایل:</span>
                      <span class="text-white font-medium truncate max-w-[140px]" :title="selectedItem.originalName">
                        {{ selectedItem.originalName }}
                      </span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span>حجم:</span>
                      <span class="text-white font-mono">{{ formatBytes(selectedItem.size) }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span>فرمت:</span>
                      <span class="text-white font-mono">{{ selectedItem.mimeType }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span>فضای ذخیره:</span>
                      <span class="text-[#00DC82] font-mono">{{ selectedItem.bucket }}</span>
                    </div>
                  </div>
                </div>

                <div v-else class="h-40 flex flex-col items-center justify-center text-center text-zinc-500">
                  <DashboardIcon name="overview" :size="24" class="mb-1 text-zinc-600" />
                  <p class="text-xs">یک تصویر را از لیست انتخاب کنید</p>
                </div>

                <!-- Confirm Action inside sidebar -->
                <div class="pt-4 border-t border-zinc-800 mt-auto">
                  <button
                    type="button"
                    :disabled="!selectedItem"
                    @click="confirmSelection"
                    class="w-full py-2.5 px-4 rounded-xl bg-[#00DC82] hover:bg-[#00c575] disabled:opacity-40 disabled:hover:bg-[#00DC82] text-zinc-950 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>تأیید و انتخاب تصویر</span>
                    <span>✓</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Tab 2: Upload Area -->
            <div v-else-if="activeTab === 'upload'" class="flex-1 p-6 overflow-y-auto flex flex-col items-center justify-center">
              <div
                @dragover.prevent="isDragOver = true"
                @dragleave.prevent="isDragOver = false"
                @drop.prevent="handleDrop"
                class="w-full max-w-xl p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center transition-all bg-zinc-950/40"
                :class="isDragOver ? 'border-[#00DC82] bg-[#00DC82]/10 scale-[1.01]' : 'border-zinc-800 hover:border-zinc-700'"
              >
                <div class="w-16 h-16 rounded-2xl bg-[#00DC82]/10 border border-[#00DC82]/20 flex items-center justify-center mb-4 text-[#00DC82]">
                  <DashboardIcon name="banners" :size="32" />
                </div>

                <h4 class="text-sm font-bold text-white mb-1">
                  تصویر را بکشید و در این قسمت رها کنید
                </h4>
                <p class="text-xs text-zinc-400 mb-4">
                  پشتیبانی از فرمت‌های WebP, PNG, JPG, SVG, GIF تا حداکثر ۱۵ مگابایت
                </p>

                <!-- File input trigger -->
                <label
                  class="cursor-pointer px-5 py-2.5 rounded-xl bg-[#00DC82] hover:bg-[#00c575] text-zinc-950 text-xs font-bold transition flex items-center gap-2"
                >
                  <span v-if="uploading" class="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  <span>{{ uploading ? 'در حال آپلود به MinIO...' : 'انتخاب فایل از دستگاه' }}</span>
                  <input
                    type="file"
                    class="hidden"
                    accept="image/*"
                    :disabled="uploading"
                    @change="handleFileUpload"
                  />
                </label>

                <!-- Error feedback -->
                <p v-if="uploadError" class="mt-4 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 rounded-lg">
                  {{ uploadError }}
                </p>
              </div>
            </div>

            <!-- Tab 3: External URL -->
            <div v-else-if="activeTab === 'url'" class="flex-1 p-6 overflow-y-auto flex flex-col justify-center items-center">
              <div class="w-full max-w-lg space-y-4 bg-zinc-950/60 p-6 rounded-2xl border border-zinc-800">
                <h4 class="text-sm font-bold text-white">درج مستقیم لینک اینترنتی تصویر</h4>
                <p class="text-xs text-zinc-400">می‌توانید نشانی یک تصویر را از هر منبع یا CDN خارجی وارد کنید:</p>

                <input
                  v-model="externalUrlInput"
                  type="url"
                  placeholder="https://example.com/images/vape-sample.webp"
                  class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-[#00DC82] focus:outline-none"
                  dir="ltr"
                />

                <div v-if="externalUrlInput.trim()" class="aspect-video w-full max-h-48 rounded-xl overflow-hidden border border-zinc-800 bg-black flex items-center justify-center">
                  <img :src="externalUrlInput" alt="Preview" class="max-h-full max-w-full object-contain" />
                </div>

                <button
                  type="button"
                  :disabled="!externalUrlInput.trim()"
                  @click="confirmSelection"
                  class="w-full py-2.5 px-4 rounded-xl bg-[#00DC82] hover:bg-[#00c575] disabled:opacity-40 text-zinc-950 text-xs font-bold transition cursor-pointer"
                >
                  تأیید و اعمال نشانی تصویر
                </button>
              </div>
            </div>

            <!-- Footer -->
            <div class="px-6 py-3 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between text-xs text-zinc-400 shrink-0">
              <div class="flex items-center gap-2 font-mono text-[11px]">
                <span class="w-2 h-2 rounded-full bg-[#00DC82] animate-pulse" />
                <span>MinIO S3 Bucket: vapelab-media</span>
              </div>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="close"
                  class="px-4 py-1.5 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-medium transition cursor-pointer"
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #29293B;
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #3E3E54;
}
</style>
