<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'admin'
})

interface OrderItem {
  id: number
  productId: number
  productName: string
  quantity: number
  price: number
  image?: string
}

interface Order {
  id: number
  orderNumber?: string
  trackingCode?: string
  customerName?: string
  email?: string
  phone?: string
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'refunded'
  paymentStatus?: string
  shippingAddress?: any
  courier?: string
  items?: OrderItem[]
  createdAt?: string
}

const orders = ref<Order[]>([])
const loading = ref(true)
const selectedFilter = ref<string>('all')
const searchQuery = ref('')
const selectedOrder = ref<Order | null>(null)
const showDetailModal = ref(false)
const updatingStatus = ref<number | null>(null)

// Tracking code edit
const editingTrackingCode = ref('')
const editingCourier = ref('پست پیشتاز')

async function fetchOrders() {
  loading.value = true
  try {
    const res = await $fetch<{ orders: Order[] }>('/api/admin/orders')
    orders.value = res.orders || []
  } catch (err) {
    console.error('Failed to load orders:', err)
  } finally {
    loading.value = false
  }
}

const filteredOrders = computed(() => {
  let list = orders.value

  if (selectedFilter.value !== 'all') {
    list = list.filter((o) => o.status === selectedFilter.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter((o) => {
      const code = (o.trackingCode || o.orderNumber || 'VPR-' + o.id).toLowerCase()
      const name = (o.customerName || o.shippingAddress?.fullName || '').toLowerCase()
      const phone = (o.phone || o.shippingAddress?.phone || '').toLowerCase()
      const email = (o.email || '').toLowerCase()
      return code.includes(q) || name.includes(q) || phone.includes(q) || email.includes(q)
    })
  }

  return list
})

function formatPrice(val: number) {
  return (val || 0).toLocaleString('fa-IR') + ' تومان'
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'delivered':
      return { label: 'تحویل داده شده', class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' }
    case 'shipped':
      return { label: 'ارسال شده', class: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' }
    case 'processing':
      return { label: 'در حال آماده‌سازی', class: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' }
    case 'refunded':
      return { label: 'مرجوعی / لغو', class: 'bg-rose-500/10 text-rose-400 border-rose-500/30' }
    case 'pending':
    default:
      return { label: 'در انتظار تایید', class: 'bg-amber-500/10 text-amber-400 border-amber-500/30' }
  }
}

async function updateOrderStatus(order: Order, newStatus: Order['status']) {
  updatingStatus.value = order.id
  try {
    await $fetch('/api/admin/orders', {
      method: 'PATCH',
      body: {
        id: order.id,
        status: newStatus,
        trackingCode: order.trackingCode,
        courier: order.courier
      }
    })
    order.status = newStatus
  } catch (err: any) {
    alert('خطا در بروزرسانی وضعیت در دیتابیس: ' + err.message)
  } finally {
    updatingStatus.value = null
  }
}

async function saveTrackingInfo() {
  if (!selectedOrder.value) return

  updatingStatus.value = selectedOrder.value.id
  try {
    await $fetch('/api/admin/orders', {
      method: 'PATCH',
      body: {
        id: selectedOrder.value.id,
        status: selectedOrder.value.status,
        trackingCode: editingTrackingCode.value,
        courier: editingCourier.value
      }
    })
    selectedOrder.value.trackingCode = editingTrackingCode.value
    selectedOrder.value.courier = editingCourier.value
    alert('اطلاعات مرسوله با موفقیت در PostgreSQL ذخیره شد.')
  } catch (err: any) {
    alert('خطا در ثبت اطلاعات رهگیری: ' + err.message)
  } finally {
    updatingStatus.value = null
  }
}

function openOrderDetails(order: Order) {
  selectedOrder.value = order
  editingTrackingCode.value = order.trackingCode || ''
  editingCourier.value = order.courier || 'پست پیشتاز'
  showDetailModal.value = true
}

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <div class="space-y-6">
    
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-1">
          <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          مدیریت سفارشات دیتابیس PostgreSQL
        </div>
        <h1 class="text-xl sm:text-2xl font-black text-white">مدیریت سفارشات و پیگیری مرسولات</h1>
        <p class="text-xs text-slate-400 mt-1">تغییر وضعیت، صدور کد رهگیری پستی و بررسی سبد خریدهای مشتریان</p>
      </div>

      <button
        @click="fetchOrders"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        بروزرسانی داده‌ها
      </button>
    </div>

    <!-- Filter Tabs & Search Bar -->
    <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
      
      <!-- Status Tabs -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
        <button
          v-for="tab in [
            { id: 'all', label: 'همه سفارشات' },
            { id: 'pending', label: 'در انتظار تایید' },
            { id: 'processing', label: 'در حال آماده‌سازی' },
            { id: 'shipped', label: 'ارسال شده' },
            { id: 'delivered', label: 'تحویل داده شده' },
          ]"
          :key="tab.id"
          @click="selectedFilter = tab.id"
          :class="[
            'px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap',
            selectedFilter === tab.id
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Search Input -->
      <div class="relative w-full md:w-72">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="جستجوی کد پیگیری، نام، شماره..."
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 pl-9 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
        />
        <svg class="w-4 h-4 text-slate-500 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

    </div>

    <!-- Orders Table / List -->
    <div class="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
      
      <div v-if="loading" class="py-16 text-center text-slate-500 text-xs">
        در حال ارتباط با پایگاه داده...
      </div>

      <div v-else-if="filteredOrders.length === 0" class="py-16 text-center text-slate-500 text-xs">
        سفارشی با این مشخصات یافت نشد.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-right text-xs">
          <thead class="bg-slate-950/60 border-b border-slate-800 text-slate-400">
            <tr>
              <th class="py-3 px-4 font-semibold">شناسه / کدرهگیری</th>
              <th class="py-3 px-4 font-semibold">مشتری</th>
              <th class="py-3 px-4 font-semibold">مبلغ فاکتور</th>
              <th class="py-3 px-4 font-semibold">وضعیت سفارش</th>
              <th class="py-3 px-4 font-semibold">تغییر وضعیت</th>
              <th class="py-3 px-4 font-semibold text-left">عملیات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60">
            <tr
              v-for="order in filteredOrders"
              :key="order.id"
              class="hover:bg-slate-800/30 transition group"
            >
              <!-- Tracking Code -->
              <td class="py-3 px-4 font-mono">
                <span class="font-bold text-cyan-400 block">{{ order.trackingCode || order.orderNumber || 'VPR-' + order.id }}</span>
                <span class="text-[10px] text-slate-500">{{ order.createdAt ? new Date(order.createdAt).toLocaleDateString('fa-IR') : 'امروز' }}</span>
              </td>

              <!-- Customer -->
              <td class="py-3 px-4">
                <p class="font-bold text-white">{{ order.customerName || order.shippingAddress?.fullName || 'کاربر VIP' }}</p>
                <p class="text-[11px] text-slate-400 font-mono">{{ order.phone || order.shippingAddress?.phone || order.email || '-' }}</p>
              </td>

              <!-- Total -->
              <td class="py-3 px-4 font-mono font-bold text-white">
                {{ formatPrice(order.total) }}
              </td>

              <!-- Status Badge -->
              <td class="py-3 px-4">
                <span
                  :class="[
                    'px-2.5 py-1 rounded-full text-[11px] font-bold border inline-block',
                    getStatusBadge(order.status).class
                  ]"
                >
                  {{ getStatusBadge(order.status).label }}
                </span>
              </td>

              <!-- Quick Status Selector -->
              <td class="py-3 px-4">
                <select
                  :value="order.status"
                  :disabled="updatingStatus === order.id"
                  @change="updateOrderStatus(order, ($event.target as HTMLSelectElement).value as Order['status'])"
                  class="bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:border-cyan-500 focus:outline-none disabled:opacity-50"
                >
                  <option value="pending">در انتظار تایید</option>
                  <option value="processing">در حال آماده‌سازی</option>
                  <option value="shipped">ارسال شده (پست)</option>
                  <option value="delivered">تحویل شده</option>
                  <option value="refunded">لغو / مرجوعی</option>
                </select>
              </td>

              <!-- Action Button -->
              <td class="py-3 px-4 text-left">
                <button
                  @click="openOrderDetails(order)"
                  class="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition flex items-center gap-1 inline-flex"
                >
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  جزئیات کامل
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <!-- Order Detail Modal -->
    <div v-if="showDetailModal && selectedOrder" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        <!-- Header -->
        <div class="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <h3 class="text-base font-bold text-white flex items-center gap-2">
              سفارش <span class="text-cyan-400 font-mono">{{ selectedOrder.trackingCode || selectedOrder.orderNumber || 'VPR-' + selectedOrder.id }}</span>
            </h3>
            <p class="text-xs text-slate-400">جزئیات ثبت شده در پایگاه داده PostgreSQL</p>
          </div>
          <button @click="showDetailModal = false" class="text-slate-400 hover:text-white">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          
          <!-- Shipping / Postal Information Form -->
          <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 class="font-bold text-white flex items-center gap-2">
              <svg class="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
              اطلاعات ارسال و کد رهگیری پستی
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-slate-400 mb-1">سامانه ارسال / پیک</label>
                <input
                  v-model="editingCourier"
                  type="text"
                  class="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label class="block text-slate-400 mb-1">کد رهگیری ۲۴ رقمی پستی</label>
                <input
                  v-model="editingTrackingCode"
                  type="text"
                  placeholder="مثال: 1845903849182390123"
                  class="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
            <button
              @click="saveTrackingInfo"
              class="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
            >
              ذخیره اطلاعات ارسال
            </button>
          </div>

          <!-- Customer Address -->
          <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 class="font-bold text-white">نشانی تحویل گیرنده</h4>
            <p class="text-slate-300">
              {{ selectedOrder.shippingAddress?.address || 'آدرس مستقیم مشتری' }}
            </p>
            <div class="flex flex-wrap gap-4 text-slate-400 pt-1">
              <span>شهر/استان: <b class="text-white">{{ selectedOrder.shippingAddress?.city || 'تهران' }}</b></span>
              <span>کد پستی: <b class="text-white font-mono">{{ selectedOrder.shippingAddress?.postalCode || '-' }}</b></span>
              <span>شماره تماس: <b class="text-white font-mono">{{ selectedOrder.phone || selectedOrder.shippingAddress?.phone || '-' }}</b></span>
            </div>
          </div>

          <!-- Order Items -->
          <div class="space-y-2">
            <h4 class="font-bold text-white">اقلام سبد خرید</h4>
            <div class="divide-y divide-slate-800/80 border border-slate-800 rounded-xl bg-slate-950 overflow-hidden">
              <div
                v-for="item in (selectedOrder.items || [{ id: 1, productName: 'ویپ لوکس Vaporesso XROS 3', price: selectedOrder.total, quantity: 1 }])"
                :key="item.id"
                class="p-3 flex items-center justify-between"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 font-bold">
                    {{ item.quantity }}x
                  </div>
                  <span class="font-bold text-white">{{ item.productName }}</span>
                </div>
                <span class="font-mono text-slate-300">{{ formatPrice(item.price * item.quantity) }}</span>
              </div>
            </div>
          </div>

        </div>

        <div class="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/90">
          <div class="text-xs">
            <span class="text-slate-400">مبلغ کل پرداختی: </span>
            <span class="text-base font-bold font-mono text-cyan-400">{{ formatPrice(selectedOrder.total) }}</span>
          </div>
          <button
            @click="showDetailModal = false"
            class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
          >
            بستن پنجره
          </button>
        </div>

      </div>
    </div>

  </div>
</template>
