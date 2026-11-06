<script setup lang="ts">
import { ref, computed } from 'vue';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  align?: 'right' | 'center' | 'left';
}

interface Props {
  columns: TableColumn[];
  rows: any[];
  searchPlaceholder?: string;
  itemsPerPage?: number;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  searchPlaceholder: 'جستجو در جدول...',
  itemsPerPage: 10,
  loading: false,
});

defineSlots<{
  [key: string]: (props: { row: any; value: any }) => any;
}>();

const searchQuery = ref('');
const currentPage = ref(1);
const sortKey = ref<string | null>(null);
const sortOrder = ref<'asc' | 'desc'>('desc');

const filteredRows = computed(() => {
  let list = [...props.rows];
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(row => {
      return Object.values(row).some(val => {
        if (typeof val === 'string' || typeof val === 'number') {
          return String(val).toLowerCase().includes(q);
        }
        if (typeof val === 'object' && val !== null) {
          return Object.values(val).some(sub => String(sub).toLowerCase().includes(q));
        }
        return false;
      });
    });
  }

  if (sortKey.value) {
    list.sort((a, b) => {
      const valA = a[sortKey.value!];
      const valB = b[sortKey.value!];
      if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return list;
});

const totalPages = computed(() => Math.ceil(filteredRows.value.length / props.itemsPerPage) || 1);

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * props.itemsPerPage;
  return filteredRows.value.slice(start, start + props.itemsPerPage);
});

const toggleSort = (colKey: string) => {
  if (sortKey.value === colKey) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = colKey;
    sortOrder.value = 'desc';
  }
};
</script>

<template>
  <div class="rounded-xl bg-zinc-900/60 border border-zinc-800 shadow-sm overflow-hidden flex flex-col">
    <!-- Table Controls Header -->
    <div class="p-4 border-b border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-950/60">
      <div class="flex items-center gap-2.5 flex-1 max-w-md">
        <div class="relative w-full">
          <svg class="w-4 h-4 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="searchPlaceholder"
            class="w-full pr-9 pl-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00DC82] transition"
          />
        </div>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <slot name="actions" :row="{}" :value="undefined" />
      </div>
    </div>

    <!-- Table Content Area -->
    <div class="overflow-x-auto min-h-[240px]">
      <table class="w-full text-right text-xs">
        <thead class="bg-zinc-950/80 text-zinc-400 font-semibold uppercase border-b border-zinc-800 select-none">
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              class="px-4 py-3.5 whitespace-nowrap"
              :class="[
                col.sortable ? 'cursor-pointer hover:text-white' : '',
                col.align === 'center' ? 'text-center' : (col.align === 'left' ? 'text-left' : 'text-right')
              ]"
              @click="col.sortable ? toggleSort(col.key) : undefined"
            >
              <div class="inline-flex items-center gap-1.5" :class="{ 'justify-center': col.align === 'center' }">
                <span>{{ col.label }}</span>
                <span v-if="col.sortable" class="text-[10px] text-zinc-500">
                  <template v-if="sortKey === col.key">
                    {{ sortOrder === 'asc' ? '▲' : '▼' }}
                  </template>
                  <template v-else>
                    ⇅
                  </template>
                </span>
              </div>
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-zinc-800/60">
          <tr v-if="loading">
            <td :colspan="columns.length" class="text-center py-12 text-zinc-400">
              <div class="inline-flex items-center gap-2">
                <span class="w-4 h-4 rounded-full border-2 border-[#00DC82] border-t-transparent animate-spin"></span>
                <span>در حال دریافت اطلاعات از سرور...</span>
              </div>
            </td>
          </tr>

          <tr v-else-if="paginatedRows.length === 0">
            <td :colspan="columns.length" class="text-center py-12 text-zinc-500">
              موردی برای نمایش یافت نشد.
            </td>
          </tr>

          <tr
            v-else
            v-for="(row, idx) in paginatedRows"
            :key="idx"
            class="hover:bg-zinc-850/40 transition-colors"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              class="px-4 py-3.5 whitespace-nowrap text-zinc-200"
              :class="col.align === 'center' ? 'text-center' : (col.align === 'left' ? 'text-left font-mono' : 'text-right')"
            >
              <slot :name="col.key" :row="row" :value="row[col.key]">
                {{ row[col.key] ?? '---' }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Table Footer / Pagination -->
    <div class="p-3.5 border-t border-zinc-800 bg-zinc-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
      <div>
        نمایش
        <span class="font-bold text-white font-mono">
          {{ filteredRows.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0 }}
        </span>
        تا
        <span class="font-bold text-white font-mono">
          {{ Math.min(currentPage * itemsPerPage, filteredRows.length) }}
        </span>
        از
        <span class="font-bold text-white font-mono">{{ filteredRows.length }}</span>
        مورد
      </div>

      <div class="flex items-center gap-1.5">
        <button
          type="button"
          :disabled="currentPage <= 1"
          @click="currentPage--"
          class="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-zinc-700 hover:text-white transition cursor-pointer"
        >
          قبلی
        </button>

        <span class="px-2 font-mono text-white">
          {{ currentPage }} / {{ totalPages }}
        </span>

        <button
          type="button"
          :disabled="currentPage >= totalPages"
          @click="currentPage++"
          class="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-zinc-700 hover:text-white transition cursor-pointer"
        >
          بعدی
        </button>
      </div>
    </div>
  </div>
</template>
