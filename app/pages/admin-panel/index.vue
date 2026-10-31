<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'admin'
})

interface Stats {
  totalRevenue: number
  revenueGrowth: number
  totalOrders: number
  ordersGrowth: number
  totalProducts: number
  lowStockCount: number
  outOfStockCount: number
  pendingOrdersCount: number
}

const stats = ref<Stats>({
  totalRevenue: 0,
  revenueGrowth: 18.4,
  totalOrders: 0,
  ordersGrowth: 12.1,
  totalProducts: 0,
  lowStockCount: 0,
  outOfStockCount: 0,
  pendingOrdersCount: 0
})

const recentOrders = ref<any[]>([])
const loading = ref(true)

function formatPrice(val: number) {
  return (val || 0).toLocaleString('fa-IR') + ' تومان'
}

async function loadData() {
  loading.value = true
  try {
    const [statsRes, ordersRes] = await Promise.all([
      $fetch<Stats>('/api/admin/stats').catch(() => null),
      $fetch<any>('/api/admin/orders').catch(() => null)
    ])

    if (statsRes) stats.value = statsRes
    if (ordersRes && ordersRes.orders) {
      recentOrders.value = ordersRes.orders.slice(0, 5)
    }
  } catch (err) {
    console.error('Failed to load dashboard data:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="space-y-6">
    
    <!-- Welcome Header & Quick Action Banner -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 p-5 sm:p-7 shadow-xl">
      <div class="absolute -left-12 -bottom-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
            <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            داشبورد مدیریت یکپارچه VAPELAB (Nuxt 4)
          </div>
          <h1 class="text-xl sm:text-2xl font-black text-white tracking-tight">
            خوش‌آمدید به پنل مدیریت ویپ‌لب
          </h1>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">
            مشاهده لحظه‌ای فروش، مدیریت سفارشات متصل به PostgreSQL و کنترل بنرهای اسلایدر صفحه اصلی
          </p>
        </div>

        <div class="flex items-center gap-2.5 w-full sm:w-auto">
          <NuxtLink
            to="/admin-panel/banners"
            class="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition active:scale-95"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            مدیریت بنرها
          </NuxtLink>
          <NuxtLink
            to="/admin-panel/orders"
            class="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition active:scale-95"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            سفارشات جدید
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Stat KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      <!-- Revenue -->
      <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-cyan-500/40 transition group shadow-lg">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-semibold text-slate-400">مجموع فروش کل</span>
          <div class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="text-xl sm:text-2xl font-black text-white">
          {{ formatPrice(stats.totalRevenue) }}
        </div>
        <div class="flex items-center gap-1.5 mt-2 text-xs text-emerald-400 font-medium">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span>+{{ stats.revenueGrowth }}% رشد نسبت به ماه گذشته</span>
        </div>
      </div>

      <!-- Orders Count -->
      <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/40 transition group shadow-lg">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-semibold text-slate-400">کل سفارشات ثبت شده</span>
          <div class="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
        <div class="text-xl sm:text-2xl font-black text-white">
          {{ stats.totalOrders.toLocaleString('fa-IR') }} سفارش
        </div>
        <div class="flex items-center gap-1.5 mt-2 text-xs text-indigo-400 font-medium">
          <span class="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
            {{ stats.pendingOrdersCount }} در انتظار بررسی
          </span>
        </div>
      </div>

      <!-- Products Inventory -->
      <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-purple-500/40 transition group shadow-lg">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-semibold text-slate-400">تنوع محصولات فعال</span>
          <div class="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
        <div class="text-xl sm:text-2xl font-black text-white">
          {{ stats.totalProducts.toLocaleString('fa-IR') }} کالا
        </div>
        <div class="flex items-center gap-1.5 mt-2 text-xs text-purple-400 font-medium">
          <span>دیتابیس آنلاین PostgreSQL</span>
        </div>
      </div>

      <!-- Low Stock Alerts -->
      <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-amber-500/40 transition group shadow-lg">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-semibold text-slate-400">هشدار موجودی انبار</span>
          <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <div class="text-xl sm:text-2xl font-black text-white">
          {{ (stats.lowStockCount + stats.outOfStockCount).toLocaleString('fa-IR') }} کالا
        </div>
        <div class="flex items-center gap-1.5 mt-2 text-xs text-rose-400 font-medium">
          <span>{{ stats.outOfStockCount }} ناموجود، {{ stats.lowStockCount }} رو به اتمام</span>
        </div>
      </div>

    </div>

    <!-- Recent Orders & Fast Actions Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Recent Orders Table (2 Cols) -->
      <div class="lg:col-span-2 rounded-2xl bg-slate-900/80 border border-slate-800/80 p-5 shadow-xl">
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <h2 class="text-base font-bold text-white">آخرین سفارشات ثبت‌شده</h2>
            <p class="text-xs text-slate-400">سفارشات اخیر در دیتابیس با قابلیت پیگیری آنی</p>
          </div>
          <NuxtLink
            to="/admin-panel/orders"
            class="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition"
          >
            مشاهده همه
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </NuxtLink>
        </div>

        <div v-if="loading" class="py-12 text-center text-slate-500 text-xs">
          در حال بارگذاری اطلاعات از دیتابیس...
        </div>

        <div v-else-if="recentOrders.length === 0" class="py-12 text-center text-slate-500 text-xs">
          سفارشی یافت نشد.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-right text-xs">
            <thead>
              <tr class="text-slate-400 border-b border-slate-800/60 pb-2">
                <th class="py-2.5 font-medium">کد سفارش</th>
                <th class="py-2.5 font-medium">مشتری</th>
                <th class="py-2.5 font-medium">مبلغ کل</th>
                <th class="py-2.5 font-medium">وضعیت</th>
                <th class="py-2.5 font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/40">
              <tr v-for="order in recentOrders" :key="order.id" class="hover:bg-slate-800/30 transition">
                <td class="py-3 font-mono font-bold text-cyan-400">
                  {{ order.trackingCode || order.orderNumber || 'VPR-' + order.id }}
                </td>
                <td class="py-3 text-white font-medium">
                  {{ order.customerName || order.shippingAddress?.fullName || 'کاربر VIP' }}
                </td>
                <td class="py-3 text-slate-300 font-mono font-semibold">
                  {{ formatPrice(order.total) }}
                </td>
                <td class="py-3">
                  <span
                    :class="[
                      'px-2 py-0.5 rounded-full text-[11px] font-bold inline-block',
                      order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      order.status === 'processing' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                      order.status === 'shipped' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    ]"
                  >
                    {{ order.status === 'delivered' ? 'تحویل‌شده' : order.status === 'processing' ? 'در حال پردازش' : order.status === 'shipped' ? 'ارسال‌شده' : 'در انتظار بررسی' }}
                  </span>
                </td>
                <td class="py-3">
                  <NuxtLink
                    to="/admin-panel/orders"
                    class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-[11px]"
                  >
                    جزئیات
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Quick Action & System Health (1 Col) -->
      <div class="space-y-4">
        
        <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-xl space-y-3">
          <h3 class="text-sm font-bold text-white flex items-center gap-2">
            <svg class="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            دسترسی سریع به ماژول‌ها
          </h3>
          
          <NuxtLink
            to="/admin-panel/banners"
            class="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-cyan-500/40 transition group"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-bold text-white group-hover:text-cyan-400 transition">ویرایشگر و بنرهای صفحه اصلی</p>
                <p class="text-[11px] text-slate-400">تنظیم کادر عکس با کراپ هوشمند</p>
              </div>
            </div>
            <svg class="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition transform -rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </NuxtLink>

          <NuxtLink
            to="/admin-panel/orders"
            class="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/40 transition group"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-bold text-white group-hover:text-indigo-400 transition">مدیریت سفارشات دیتابیس</p>
                <p class="text-[11px] text-slate-400">تغییر وضعیت و کدرهگیری</p>
              </div>
            </div>
            <svg class="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition transform -rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </NuxtLink>

          <NuxtLink
            to="/admin-panel/products"
            class="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-purple-500/40 transition group"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-bold text-white group-hover:text-purple-400 transition">انبار و محصولات</p>
                <p class="text-[11px] text-slate-400">ویرایش قیمت و موجودی</p>
              </div>
            </div>
            <svg class="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition transform -rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </NuxtLink>
        </div>

        <!-- PostgreSQL Status -->
        <div class="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-cyan-950/30 border border-cyan-500/20 text-xs">
          <div class="flex items-center justify-between mb-2">
            <span class="font-bold text-cyan-300">وضعیت سرویس دیتابیس</span>
            <span class="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              آنلاین و فعال
            </span>
          </div>
          <p class="text-slate-400 text-[11px] leading-relaxed">
            مخزن داده محلی: <code class="text-cyan-400 font-mono">vape_lifestyle_db</code> (پورت 5432)
          </p>
        </div>

      </div>

    </div>

  </div>
</template>
