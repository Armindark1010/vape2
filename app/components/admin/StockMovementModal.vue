<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  productId: number | null;
  productName: string;
  variants: any[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'adjusted'): void;
}>();

const movements = ref<any[]>([]);
const loading = ref(false);
const adjustMode = ref(false);

const selectedVariantId = ref<number | null>(null);
const adjustDelta = ref<number>(0);
const adjustReason = ref('');
const saving = ref(false);

const close = () => {
  emit('update:modelValue', false);
};

const loadMovements = async () => {
  if (!props.productId) return;
  loading.value = true;
  try {
    const res = await $fetch<any[]>(`/api/v1/products/${props.productId}/inventory-movements`);
    movements.value = res || [];
  } catch (err) {
    console.warn('Error loading inventory movements:', err);
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen && props.productId) {
      adjustMode.value = false;
      adjustDelta.value = 0;
      adjustReason.value = '';
      selectedVariantId.value = props.variants[0]?.id || null;
      loadMovements();
    }
  }
);

const handleAdjustStock = async () => {
  if (!selectedVariantId.value || adjustDelta.value === 0) {
    alert('تنوع و مقدار تغییر موجودی الزامی است');
    return;
  }

  saving.value = true;
  try {
    await $fetch(`/api/v1/products/variants/${selectedVariantId.value}/stock-adjust`, {
      method: 'POST',
      body: {
        delta: Number(adjustDelta.value),
        reason: adjustReason.value.trim() || 'تنظیم دستی موجودی توسط ادمین',
      },
    });
    adjustMode.value = false;
    await loadMovements();
    emit('adjusted');
  } catch (err: any) {
    alert('خطا در تنظیم موجودی: ' + (err?.data?.message || err.message));
  } finally {
    saving.value = false;
  }
};

const formatType = (type: string) => {
  switch (type) {
    case 'PURCHASE_RECEIPT':
      return { label: 'ورود به انبار / شارژ اولیه', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40' };
    case 'SALE_DEDUCTION':
      return { label: 'کسر فروش پس از پرداخت', color: 'text-rose-400 bg-rose-950/60 border-rose-800/40' };
    case 'MANUAL_ADJUSTMENT':
      return { label: 'تنظیم دستی ادمین', color: 'text-amber-400 bg-amber-950/60 border-amber-800/40' };
    case 'ORDER_RESERVED':
      return { label: 'رزرو در سبد خرید', color: 'text-blue-400 bg-blue-950/60 border-blue-800/40' };
    case 'RESERVATION_RELEASED':
      return { label: 'آزادسازی رزرو منقضی‌شده', color: 'text-zinc-400 bg-zinc-900 border-zinc-800' };
    default:
      return { label: type, color: 'text-zinc-400 bg-zinc-900 border-zinc-800' };
  }
};
</script>

<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    @click.self="close"
  >
    <div class="w-full max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="p-5 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/40">
        <div>
          <h3 class="text-base font-bold text-zinc-100 flex items-center gap-2">
            <span>تاریخچه تحرکات انبار و موجودی</span>
            <span class="text-xs text-purple-400 font-normal">({{ productName }})</span>
          </h3>
          <p class="text-xs text-zinc-400 mt-1">رهگیری دقیق لاگ ورود، خروج، رزرو و تراکنش‌های فروش هر تنوع</p>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="adjustMode = !adjustMode"
            class="px-3 py-1.5 rounded-xl border border-purple-500/50 hover:bg-purple-600/20 text-purple-300 text-xs font-bold transition"
          >
            {{ adjustMode ? 'مشاهده لاگ‌ها' : 'تنظیم دستی موجودی' }}
          </button>
          <button
            type="button"
            @click="close"
            class="text-zinc-400 hover:text-zinc-100 p-1 rounded-lg hover:bg-zinc-800 transition"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-5 overflow-y-auto flex-1 space-y-4">
        <!-- Adjust Form -->
        <div v-if="adjustMode" class="p-4 rounded-xl border border-purple-900/40 bg-purple-950/20 space-y-4">
          <h4 class="text-xs font-bold text-purple-300">فرم تنظیم دستی موجودی تنوع:</h4>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs text-zinc-400 mb-1.5 font-medium">انتخاب تنوع محصول</label>
              <select
                v-model="selectedVariantId"
                class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-purple-500"
              >
                <option v-for="v in variants" :key="v.id" :value="v.id">
                  {{ v.title }} (موجودی فعلی: {{ v.stock }}) - SKU: {{ v.sku }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs text-zinc-400 mb-1.5 font-medium">مقدار تغییر (Delta)</label>
              <input
                type="number"
                v-model.number="adjustDelta"
                placeholder="مثال: +10 یا -5"
                class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 font-mono text-left focus:outline-none focus:border-purple-500"
              />
              <span class="text-[10px] text-zinc-500 mt-1 block">
                برای افزایش عدد مثبت (مثلاً 10) و برای کاهش عدد منفی (مثلاً -3) وارد کنید.
              </span>
            </div>
          </div>

          <div>
            <label class="block text-xs text-zinc-400 mb-1.5 font-medium">دلیل / توضیحات انبارداری</label>
            <input
              type="text"
              v-model="adjustReason"
              placeholder="مثال: رسید فاکتور خرید تأمین‌کننده یا انبارگردانی دوره‌ای..."
              class="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button
              type="button"
              @click="adjustMode = false"
              class="px-3.5 py-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs"
            >
              انصراف
            </button>
            <button
              type="button"
              @click="handleAdjustStock"
              :disabled="saving"
              class="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition disabled:opacity-50"
            >
              {{ saving ? 'در حال ثبت...' : 'ثبت تغییر موجودی' }}
            </button>
          </div>
        </div>

        <!-- History Table -->
        <div v-else class="space-y-3">
          <div v-if="loading" class="p-8 text-center text-zinc-500 text-xs">
            در حال بارگذاری تاریخچه...
          </div>

          <div v-else-if="movements.length === 0" class="p-8 text-center text-zinc-500 text-xs">
            هنوز رکوردی در تاریخچه موجودی این کالا ثبت نشده است.
          </div>

          <div v-else class="overflow-x-auto rounded-xl border border-zinc-800/80 bg-zinc-950">
            <table class="w-full text-right text-xs">
              <thead>
                <tr class="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400 font-medium">
                  <th class="p-3">نوع عملیات</th>
                  <th class="p-3">تنوع</th>
                  <th class="p-3 text-center">تغییر (Delta)</th>
                  <th class="p-3 text-center">موجودی قبلی</th>
                  <th class="p-3 text-center">موجودی نهایی</th>
                  <th class="p-3">علت / فاکتور</th>
                  <th class="p-3 text-left">تاریخ</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-900">
                <tr v-for="m in movements" :key="m.id" class="hover:bg-zinc-900/30">
                  <td class="p-3">
                    <span :class="['px-2 py-0.5 rounded text-[11px] border font-medium inline-block', formatType(m.type).color]">
                      {{ formatType(m.type).label }}
                    </span>
                  </td>
                  <td class="p-3 text-zinc-200 font-medium">
                    {{ m.variant?.title || 'پیش‌فرض' }}
                  </td>
                  <td class="p-3 text-center font-mono font-bold" :class="[m.delta >= 0 ? 'text-emerald-400' : 'text-rose-400']">
                    {{ m.delta >= 0 ? `+${m.delta}` : m.delta }}
                  </td>
                  <td class="p-3 text-center font-mono text-zinc-400">
                    {{ m.stockBefore }}
                  </td>
                  <td class="p-3 text-center font-mono text-cyan-400 font-bold">
                    {{ m.stockAfter }}
                  </td>
                  <td class="p-3 text-zinc-400 max-w-xs truncate">
                    {{ m.reason || '-' }}
                  </td>
                  <td class="p-3 text-left text-zinc-500 font-mono text-[11px]">
                    {{ new Date(m.createdAt).toLocaleDateString('fa-IR', { hour: '2-digit', minute: '2-digit' }) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

