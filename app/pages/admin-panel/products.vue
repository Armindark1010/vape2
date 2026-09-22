<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'admin'
})

interface Product {
  id: number
  name: string
  slug: string
  price: number
  originalPrice?: number
  stock: number
  category?: string
  brand?: string
  image?: string
  isFeatured?: boolean
  rating?: number
}

const products = ref<Product[]>([])
const loading = ref(true)
const searchQuery = ref('')
const selectedCategory = ref('all')

async function fetchProducts() {
  loading.value = true
  try {
    const res = await $fetch<Product[]>('/api/products?limit=100')
    products.value = res || []
  } catch (err) {
    console.error('Failed to load products:', err)
  } finally {
    loading.value = false
  }
}

const filteredProducts = computed(() => {
  let list = products.value

  if (selectedCategory.value !== 'all') {
    list = list.filter((p) => p.category === selectedCategory.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      )
    })
  }

  return list
})

function formatPrice(val: number) {
  return (val || 0).toLocaleString('fa-IR') + ' تومان'
}

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div class="space-y-6">
    
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-1">
          <span class="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
          کاتالوگ و انبارداری محصولات PostgreSQL
        </div>
        <h1 class="text-xl sm:text-2xl font-black text-white">مدیریت موجودی کالا و محصولات ویپ‌لب</h1>
        <p class="text-xs text-slate-400 mt-1">مشاهده قیمت، دسته‌بندی و وضعیت موجودی انبار کالاها</p>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="fetchProducts"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          بروزرسانی
        </button>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
      <div class="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
        <button
          v-for="cat in [
            { id: 'all', label: 'همه دسته‌ها' },
            { id: 'vape', label: 'ویپ و ماد' },
            { id: 'pod', label: 'پاد سیستم' },
            { id: 'juice', label: 'جویس و سالت' },
            { id: 'accessory', label: 'کویل و لوازم جانبی' }
          ]"
          :key="cat.id"
          @click="selectedCategory = cat.id"
          :class="[
            'px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap',
            selectedCategory === cat.id
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
          ]"
        >
          {{ cat.label }}
        </button>
      </div>

      <div class="relative w-full sm:w-72">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="جستجوی نام کالا، برند یا دسته..."
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 pl-9 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
        />
        <svg class="w-4 h-4 text-slate-500 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Products Grid / Table -->
    <div class="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
      <div v-if="loading" class="py-16 text-center text-slate-500 text-xs">
        در حال بارگذاری کاتالوگ محصولات...
      </div>

      <div v-else-if="filteredProducts.length === 0" class="py-16 text-center text-slate-500 text-xs">
        کالایی با این مشخصات یافت نشد.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-right text-xs">
          <thead class="bg-slate-950/60 border-b border-slate-800 text-slate-400">
            <tr>
              <th class="py-3 px-4 font-semibold">محصول</th>
              <th class="py-3 px-4 font-semibold">برند / دسته</th>
              <th class="py-3 px-4 font-semibold">قیمت فروش</th>
              <th class="py-3 px-4 font-semibold">موجودی انبار</th>
              <th class="py-3 px-4 font-semibold">وضعیت کالا</th>
              <th class="py-3 px-4 font-semibold text-left">لینک فروشگاه</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60">
            <tr
              v-for="product in filteredProducts"
              :key="product.id"
              class="hover:bg-slate-800/30 transition"
            >
              <!-- Product Image & Name -->
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                    <img
                      :src="product.image || 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=150&q=80'"
                      :alt="product.name"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 class="font-bold text-white">{{ product.name }}</h4>
                    <span class="text-[10px] text-slate-500 font-mono">کد: #{{ product.id }}</span>
                  </div>
                </div>
              </td>

              <!-- Brand & Category -->
              <td class="py-3 px-4">
                <p class="font-bold text-slate-200">{{ product.brand || 'VAPELAB' }}</p>
                <p class="text-[11px] text-slate-400">{{ product.category || 'ویپ' }}</p>
              </td>

              <!-- Price -->
              <td class="py-3 px-4 font-mono font-bold text-cyan-400">
                {{ formatPrice(product.price) }}
              </td>

              <!-- Stock -->
              <td class="py-3 px-4 font-mono">
                <span
                  :class="[
                    'px-2 py-0.5 rounded-md font-bold text-[11px]',
                    product.stock > 5 ? 'bg-emerald-500/10 text-emerald-400' :
                    product.stock > 0 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  ]"
                >
                  {{ product.stock > 0 ? product.stock + ' عدد' : 'ناموجود' }}
                </span>
              </td>

              <!-- Status -->
              <td class="py-3 px-4">
                <span v-if="product.isFeatured" class="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 text-[10px] font-bold ml-1">
                  ویژه
                </span>
                <span class="text-[11px] text-slate-400">فعال در کاتالوگ</span>
              </td>

              <!-- Action View -->
              <td class="py-3 px-4 text-left">
                <NuxtLink
                  :to="'/product/' + (product.slug || product.id)"
                  target="_blank"
                  class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs inline-flex items-center gap-1"
                >
                  <span>مشاهده</span>
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>
