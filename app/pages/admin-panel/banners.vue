<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ImageCropperModal from '~/components/admin/ImageCropperModal.vue'

definePageMeta({
  layout: 'admin'
})

interface Banner {
  id: number
  title: string
  subtitle: string | null
  badge: string | null
  imageUrl: string
  ctaText: string | null
  ctaLink: string | null
  position: string
  order: number
  isActive: boolean
  createdAt?: string
}

const banners = ref<Banner[]>([])
const loading = ref(true)
const saving = ref(false)
const showEditorModal = ref(false)
const showCropper = ref(false)

// Editing state
const editingBanner = ref<Partial<Banner>>({
  title: '',
  subtitle: '',
  badge: '',
  imageUrl: '',
  ctaText: 'مشاهده و خرید',
  ctaLink: '/products',
  position: 'hero',
  order: 0,
  isActive: true
})
const isEditMode = ref(false)

async function fetchBanners() {
  loading.value = true
  try {
    const res = await $fetch<any>('/api/admin/banners')
    const list = Array.isArray(res) ? res : (res?.banners || [])
    banners.value = list.map((b: any) => ({
      id: b.id,
      title: b.title,
      subtitle: b.subtitle,
      badge: b.badge,
      imageUrl: b.imageUrl || b.image || '',
      ctaText: b.ctaText || b.buttonText || 'مشاهده و خرید',
      ctaLink: b.ctaLink || b.link || '/shop',
      position: b.position || 'hero',
      order: b.order ?? b.sortOrder ?? 0,
      isActive: b.isActive !== undefined ? b.isActive : (b.active !== undefined ? b.active : true),
      createdAt: b.createdAt
    }))
  } catch (err) {
    console.error('Failed to load banners:', err)
  } finally {
    loading.value = false
  }
}

function openCreateModal() {
  isEditMode.value = false
  editingBanner.value = {
    title: '',
    subtitle: '',
    badge: 'تخفیف ویژه',
    imageUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=1400&q=80',
    ctaText: 'خرید فوری با تخفیف',
    ctaLink: '/shop',
    position: 'hero',
    order: banners.value.length + 1,
    isActive: true
  }
  showEditorModal.value = true
}

function openEditModal(banner: Banner) {
  isEditMode.value = true
  editingBanner.value = { ...banner }
  showEditorModal.value = true
}

function openCropperForImage() {
  showCropper.value = true
}

function onImageCropped(dataUrl: string) {
  editingBanner.value.imageUrl = dataUrl
}

async function saveBanner() {
  if (!editingBanner.value.title || !editingBanner.value.imageUrl) {
    alert('لطفاً عنوان و تصویر بنر را مشخص کنید.')
    return
  }

  saving.value = true
  try {
    const payload = {
      id: editingBanner.value.id,
      title: editingBanner.value.title,
      subtitle: editingBanner.value.subtitle,
      badge: editingBanner.value.badge,
      image: editingBanner.value.imageUrl,
      imageUrl: editingBanner.value.imageUrl,
      buttonText: editingBanner.value.ctaText,
      ctaText: editingBanner.value.ctaText,
      link: editingBanner.value.ctaLink,
      ctaLink: editingBanner.value.ctaLink,
      position: editingBanner.value.position,
      sortOrder: editingBanner.value.order,
      order: editingBanner.value.order,
      active: editingBanner.value.isActive,
      isActive: editingBanner.value.isActive
    }

    if (isEditMode.value && editingBanner.value.id) {
      await $fetch('/api/admin/banners', {
        method: 'PATCH',
        body: payload
      })
    } else {
      await $fetch('/api/admin/banners', {
        method: 'POST',
        body: payload
      })
    }
    showEditorModal.value = false
    await fetchBanners()
  } catch (err: any) {
    alert('خطا در ذخیره بنر در دیتابیس: ' + (err.message || 'نامشخص'))
  } finally {
    saving.value = false
  }
}

async function toggleActive(banner: Banner) {
  const newStatus = !banner.isActive
  banner.isActive = newStatus
  try {
    await $fetch('/api/admin/banners', {
      method: 'PATCH',
      body: {
        id: banner.id,
        active: newStatus,
        isActive: newStatus
      }
    })
  } catch (err) {
    banner.isActive = !newStatus
    alert('خطا در تغییر وضعیت بنر')
  }
}

async function deleteBanner(banner: Banner) {
  if (!confirm(`آیا از حذف بنر "${banner.title}" اطمینان دارید؟`)) return

  try {
    await $fetch('/api/admin/banners', {
      method: 'DELETE',
      body: { id: banner.id }
    })
    await fetchBanners()
  } catch (err: any) {
    alert('خطا در حذف بنر: ' + err.message)
  }
}

onMounted(() => {
  fetchBanners()
})
</script>

<template>
  <div class="space-y-6">
    
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-1">
          <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          مدیریت اسلایدر و بنرهای دیتابیس
        </div>
        <h1 class="text-xl sm:text-2xl font-black text-white">بنرهای تبلیغاتی و اسلایدر صفحه اصلی</h1>
        <p class="text-xs text-slate-400 mt-1">ویرایش، کراپ تصاویر و اولویت‌بندی نمایش بنرها در فرانت‌اند</p>
      </div>

      <button
        @click="openCreateModal"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition active:scale-95 shrink-0"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        افزودن بنر جدید
      </button>
    </div>

    <!-- Banners Grid -->
    <div v-if="loading" class="py-16 text-center text-slate-500 text-xs">
      در حال دریافت بنرها از PostgreSQL...
    </div>

    <div v-else-if="banners.length === 0" class="py-16 text-center bg-slate-900/50 rounded-2xl border border-slate-800 p-8">
      <div class="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-3">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 class="text-sm font-bold text-white mb-1">هیچ بنری ثبت نشده است</h3>
      <p class="text-xs text-slate-400 mb-4">برای ساخت اولین اسلاید صفحه اصلی روی دکمه زیر کلیک کنید.</p>
      <button
        @click="openCreateModal"
        class="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition"
      >
        ایجاد اولین بنر
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div
        v-for="banner in banners"
        :key="banner.id"
        class="relative overflow-hidden rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/30 transition shadow-xl flex flex-col group"
      >
        <!-- Banner Image Preview Card -->
        <div class="relative h-48 w-full overflow-hidden bg-slate-950">
          <img
            :src="banner.imageUrl"
            :alt="banner.title"
            class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

          <!-- Position & Badge tag -->
          <div class="absolute top-3 right-3 flex items-center gap-2">
            <span v-if="banner.badge" class="px-2.5 py-1 rounded-lg bg-cyan-500/90 backdrop-blur-md text-slate-950 font-black text-[11px] shadow">
              {{ banner.badge }}
            </span>
            <span class="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700 text-slate-300 font-mono text-[11px]">
              {{ banner.position === 'hero' ? 'اسلایدر هدر' : banner.position === 'promo' ? 'بنر تبلیغاتی میانی' : 'پاپ‌آپ' }}
            </span>
          </div>

          <!-- Active status badge -->
          <div class="absolute top-3 left-3">
            <button
              @click="toggleActive(banner)"
              :class="[
                'px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 backdrop-blur-md border',
                banner.isActive
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              ]"
            >
              <span :class="['w-2 h-2 rounded-full', banner.isActive ? 'bg-emerald-400' : 'bg-rose-400']"></span>
              {{ banner.isActive ? 'فعال در سایت' : 'غیرفعال' }}
            </button>
          </div>

          <!-- Title & Subtitle on Image bottom -->
          <div class="absolute bottom-3 right-3 left-3 text-right">
            <h3 class="text-base font-black text-white drop-shadow-md">{{ banner.title }}</h3>
            <p v-if="banner.subtitle" class="text-xs text-slate-300 drop-shadow line-clamp-1 mt-0.5">{{ banner.subtitle }}</p>
          </div>
        </div>

        <!-- Banner Details & Footer Actions -->
        <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div class="flex items-center justify-between text-xs text-slate-400">
            <span>لینک: <code class="text-cyan-400 font-mono">{{ banner.ctaLink || '/' }}</code></span>
            <span>اولویت ترتیب: <b class="text-white">{{ banner.order }}</b></span>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              @click="openEditModal(banner)"
              class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              ویرایش
            </button>
            <button
              @click="deleteBanner(banner)"
              class="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              حذف
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit/Create Banner Modal -->
    <div v-if="showEditorModal" class="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        <div class="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <h3 class="text-base font-bold text-white">
            {{ isEditMode ? 'ویرایش اطلاعات بنر' : 'افزودن بنر جدید به اسلایدر' }}
          </h3>
          <button @click="showEditorModal = false" class="text-slate-400 hover:text-white">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          
          <!-- Image Preview & Cropper Trigger -->
          <div>
            <label class="block text-slate-300 font-bold mb-2">تصویر بنر (با ابزار کراپ و ادیتور)</label>
            <div class="relative h-40 w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 group">
              <img
                v-if="editingBanner.imageUrl"
                :src="editingBanner.imageUrl"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-slate-500">
                تصویری انتخاب نشده است
              </div>

              <!-- Overlay button to trigger cropper -->
              <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                <button
                  type="button"
                  @click="openCropperForImage"
                  class="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  تنظیم و برش با ادیتور
                </button>
              </div>
            </div>
            <div class="flex items-center justify-between mt-2">
              <input
                v-model="editingBanner.imageUrl"
                type="text"
                placeholder="یا آدرس مستقیم تصویر (URL) را وارد کنید..."
                class="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
              />
              <button
                type="button"
                @click="openCropperForImage"
                class="mr-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 font-medium text-xs transition shrink-0"
              >
                برش / ویرایش
              </button>
            </div>
          </div>

          <!-- Title & Subtitle -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-slate-300 font-bold mb-1">عنوان اصلی بنر *</label>
              <input
                v-model="editingBanner.title"
                type="text"
                placeholder="مثال: جشنواره پاد سیستم‌های لوکس"
                class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-slate-300 font-bold mb-1">متن فرعی / توضیحات</label>
              <input
                v-model="editingBanner.subtitle"
                type="text"
                placeholder="مثال: تا ۳۰٪ تخفیف روی برترین برندهای سال"
                class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <!-- Badge & CTA Button -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-slate-300 font-bold mb-1">بج / برچسب گوشه (Badge)</label>
              <input
                v-model="editingBanner.badge"
                type="text"
                placeholder="مثال: پیشنهاد طلایی"
                class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-slate-300 font-bold mb-1">متن دکمه اکشن (CTA)</label>
              <input
                v-model="editingBanner.ctaText"
                type="text"
                placeholder="مثال: خرید و مشاهده"
                class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <!-- CTA Link & Position -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-slate-300 font-bold mb-1">لینک مقصد دکمه</label>
              <input
                v-model="editingBanner.ctaLink"
                type="text"
                placeholder="/products"
                class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-slate-300 font-bold mb-1">موقعیت بنر</label>
              <select
                v-model="editingBanner.position"
                class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:border-cyan-500 focus:outline-none"
              >
                <option value="hero">اسلایدر هدر اصلی (Hero)</option>
                <option value="promo">بنر میانی صفحه (Promo)</option>
                <option value="popup">پاپ‌آپ اطلاع‌رسانی</option>
              </select>
            </div>
            <div>
              <label class="block text-slate-300 font-bold mb-1">ترتیب نمایش (Order)</label>
              <input
                v-model.number="editingBanner.order"
                type="number"
                class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <!-- Active Checkbox -->
          <div class="pt-2">
            <label class="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                v-model="editingBanner.isActive"
                type="checkbox"
                class="w-4 h-4 rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-0"
              />
              <span class="text-slate-200 font-medium">نمایش فعال در سایت</span>
            </label>
          </div>

        </div>

        <div class="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/90">
          <button
            @click="showEditorModal = false"
            class="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs"
          >
            انصراف
          </button>
          <button
            :disabled="saving"
            @click="saveBanner"
            class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs hover:shadow-lg hover:shadow-cyan-500/25 transition disabled:opacity-50"
          >
            {{ saving ? 'در حال ذخیره...' : (isEditMode ? 'بروزرسانی در دیتابیس' : 'ثبت نهایی بنر') }}
          </button>
        </div>

      </div>
    </div>

    <!-- Integrated Image Cropper Modal -->
    <ImageCropperModal
      v-model="showCropper"
      :initial-image="editingBanner.imageUrl"
      :aspect-ratio="editingBanner.position === 'promo' ? 3/1 : 21/9"
      title="ویرایشگر و برش تصویر بنر"
      @cropped="onImageCropped"
    />

  </div>
</template>
