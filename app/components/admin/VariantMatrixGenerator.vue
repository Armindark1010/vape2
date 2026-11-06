<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import ImagePickerModal from '~/components/dashboard/ImagePickerModal.vue';

export interface VariantItem {
  id?: number;
  sku: string;
  title: string;
  combination: Record<string, string>;
  combinationHash?: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  reservedQuantity?: number;
  availableStock?: number;
  image?: string | null;
  weight?: number | null;
  isActive: boolean;
}

interface Attribute {
  id: number;
  name: string;
  code: string;
  type: string;
  isVariant: boolean;
  options?: any;
  unit?: string | null;
}

interface ProductType {
  id: number;
  name: string;
  attributes?: Attribute[];
}

const props = withDefaults(
  defineProps<{
    productType: ProductType | null;
    variants: VariantItem[];
    baseSku: string;
    basePrice: number;
    compareAtPrice?: number | null;
    defaultStock?: number;
  }>(),
  {
    baseSku: 'VAPE-PROD',
    basePrice: 0,
    compareAtPrice: null,
    defaultStock: 10,
  }
);

const emit = defineEmits<{
  (e: 'update:variants', variants: VariantItem[]): void;
}>();

// Filter variant attributes for current product type
const variantAttributes = computed(() => {
  if (!props.productType?.attributes) return [];
  return props.productType.attributes.filter((a) => a.isVariant);
});

// Selected options dictionary: { [attrCode]: string[] }
const selectedOptions = ref<Record<string, string[]>>({});
const customInputs = ref<Record<string, string>>({});

// Initialize selected options when productType changes or if editing
watch(
  () => props.productType,
  (newType) => {
    if (!newType?.attributes) {
      selectedOptions.value = {};
      return;
    }
    const currentCodes = Object.keys(selectedOptions.value);
    newType.attributes.forEach((attr) => {
      if (attr.isVariant && !currentCodes.includes(attr.code)) {
        selectedOptions.value[attr.code] = [];
      }
    });
  },
  { immediate: true }
);

// Helper to parse options
const getAttributePredefinedOptions = (attr: Attribute): string[] => {
  if (!attr.options) return [];
  if (Array.isArray(attr.options)) {
    return attr.options.map((opt) =>
      typeof opt === 'object' && opt !== null ? opt.value || opt.label : String(opt)
    );
  }
  if (typeof attr.options === 'string') {
    try {
      const parsed = JSON.parse(attr.options);
      if (Array.isArray(parsed)) return parsed.map((x) => String(x));
    } catch {
      return attr.options.split(/[\s,]+/).filter(Boolean);
    }
  }
  return [];
};

// Toggle option selection
const toggleOption = (attrCode: string, option: string) => {
  if (!selectedOptions.value[attrCode]) {
    selectedOptions.value[attrCode] = [];
  }
  const idx = selectedOptions.value[attrCode].indexOf(option);
  if (idx >= 0) {
    selectedOptions.value[attrCode].splice(idx, 1);
  } else {
    selectedOptions.value[attrCode].push(option);
  }
};

// Add custom tag
const addCustomOption = (attrCode: string) => {
  const val = customInputs.value[attrCode]?.trim();
  if (!val) return;
  if (!selectedOptions.value[attrCode]) {
    selectedOptions.value[attrCode] = [];
  }
  if (!selectedOptions.value[attrCode].includes(val)) {
    selectedOptions.value[attrCode].push(val);
  }
  customInputs.value[attrCode] = '';
};

// Remove tag
const removeOption = (attrCode: string, option: string) => {
  if (!selectedOptions.value[attrCode]) return;
  selectedOptions.value[attrCode] = selectedOptions.value[attrCode].filter((x) => x !== option);
};

// Canonical Hash Generator
const generateCanonicalHash = (comb: Record<string, string>): string => {
  const sortedKeys = Object.keys(comb).sort();
  return sortedKeys
    .map((k) => `${k.toLowerCase().trim()}:${String(comb[k]).toLowerCase().trim()}`)
    .join('|');
};

// Matrix Generator
const generateMatrix = () => {
  const activeAttrs = variantAttributes.value.filter(
    (a) => a && selectedOptions.value[a.code] && (selectedOptions.value[a.code]?.length ?? 0) > 0
  );

  if (activeAttrs.length === 0) {
    alert('حداقل برای یکی از ویژگی‌های تنوع، گزینه‌ای انتخاب کنید.');
    return;
  }

  // Cartesian product algorithm
  const keys = activeAttrs.map((a) => a.code);
  const valuesArrays: string[][] = activeAttrs.map((a) => selectedOptions.value[a.code] || []);

  const cartesian = (...arrays: string[][]): string[][] => {
    return arrays.reduce((acc, curr) => acc.flatMap((c) => curr.map((n) => [...c, n])), [[]] as string[][]);
  };

  const combinations = cartesian(...valuesArrays);

  // Preserve existing variant data (price, stock, image) if match exists
  const existingMap = new Map<string, VariantItem>();
  props.variants.forEach((v) => {
    const hash = generateCanonicalHash(v.combination);
    existingMap.set(hash, v);
  });

  const generated: VariantItem[] = [];

  combinations.forEach((comboValues, idx) => {
    const combination: Record<string, string> = {};
    keys.forEach((key, kIdx) => {
      combination[key] = comboValues[kIdx] ?? '';
    });

    const hash = generateCanonicalHash(combination);
    const existing = existingMap.get(hash);

    if (existing) {
      generated.push(existing);
    } else {
      // Create new SKU slug
      const slugSuffix = comboValues
        .map((cv) =>
          cv
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '')
            .slice(0, 4)
            .toUpperCase()
        )
        .filter(Boolean)
        .join('-');

      const sku = `${props.baseSku || 'SKU'}-${slugSuffix || idx + 1}`;
      const title = comboValues.join(' / ');

      generated.push({
        sku,
        title,
        combination,
        combinationHash: hash,
        price: props.basePrice || 0,
        compareAtPrice: props.compareAtPrice || null,
        stock: props.defaultStock || 10,
        reservedQuantity: 0,
        availableStock: props.defaultStock || 10,
        image: null,
        isActive: true,
      });
    }
  });

  emit('update:variants', generated);
};

// Add single manual variant
const addManualVariant = () => {
  const newSku = `${props.baseSku || 'SKU'}-MAN-${Date.now().toString().slice(-4)}`;
  const updated = [
    ...props.variants,
    {
      sku: newSku,
      title: 'تنوع دستی جدید',
      combination: { نوع: 'سفارشی' },
      combinationHash: `custom:${Date.now()}`,
      price: props.basePrice || 0,
      compareAtPrice: props.compareAtPrice || null,
      stock: props.defaultStock || 10,
      reservedQuantity: 0,
      availableStock: props.defaultStock || 10,
      image: null,
      isActive: true,
    },
  ];
  emit('update:variants', updated);
};

// Delete single variant
const removeVariant = (index: number) => {
  const updated = [...props.variants];
  updated.splice(index, 1);
  emit('update:variants', updated);
};

// Bulk Actions
const bulkStockInput = ref<number | ''>('');
const bulkPriceInput = ref<number | ''>('');

const applyBulkStock = () => {
  if (bulkStockInput.value === '' || isNaN(Number(bulkStockInput.value))) return;
  const val = Math.max(0, Number(bulkStockInput.value));
  const updated = props.variants.map((v) => ({
    ...v,
    stock: val,
    availableStock: Math.max(0, val - (v.reservedQuantity || 0)),
  }));
  emit('update:variants', updated);
  bulkStockInput.value = '';
};

const applyBulkPrice = () => {
  if (bulkPriceInput.value === '' || isNaN(Number(bulkPriceInput.value))) return;
  const val = Math.max(0, Number(bulkPriceInput.value));
  const updated = props.variants.map((v) => ({ ...v, price: val }));
  emit('update:variants', updated);
  bulkPriceInput.value = '';
};

// Image Picker Modal State
const imagePickerOpen = ref(false);
const activeVariantIndex = ref<number | null>(null);

const openImagePicker = (index: number) => {
  activeVariantIndex.value = index;
  imagePickerOpen.value = true;
};

const onImageSelected = (url: string) => {
  if (activeVariantIndex.value !== null) {
    const current = props.variants[activeVariantIndex.value];
    if (current) {
      const updated: VariantItem[] = [...props.variants];
      updated[activeVariantIndex.value] = {
        ...current,
        image: url,
      };
      emit('update:variants', updated);
    }
  }
  activeVariantIndex.value = null;
};

// Total stock across variants
const totalStock = computed(() => props.variants.reduce((acc, v) => acc + (Number(v.stock) || 0), 0));
const totalAvailable = computed(() =>
  props.variants.reduce((acc, v) => acc + Math.max(0, (v.stock || 0) - (v.reservedQuantity || 0)), 0)
);
</script>

<template>
  <div class="space-y-6">
    <!-- 1. Attribute Option Pickers & Generator -->
    <div v-if="variantAttributes.length > 0" class="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-5">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div>
          <h4 class="text-sm font-bold text-zinc-100 flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-[#00DC82] animate-pulse"></span>
            تولید هوشمند ماتریس تنوع‌ها (Variant Generator)
          </h4>
          <p class="text-xs text-zinc-400 mt-1">
            ویژگی‌های موردنظر را انتخاب کنید تا تمام ترکیب‌های مجاز با موجودی و SKU اختصاصی تولید شوند.
          </p>
        </div>
        <button
          type="button"
          @click="generateMatrix"
          class="px-4 py-2 rounded-xl bg-[#00DC82] hover:bg-[#00c575] text-zinc-950 text-xs font-bold transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          تولید ماتریس تنوع‌ها
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div
          v-for="attr in variantAttributes"
          :key="attr.id"
          class="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-3"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-zinc-200">{{ attr.name }}</span>
            <span class="text-[10px] text-[#00DC82] font-mono bg-[#00DC82]/10 px-2 py-0.5 rounded border border-[#00DC82]/20">
              {{ selectedOptions[attr.code]?.length || 0 }} مورد انتخاب شده
            </span>
          </div>

          <!-- Predefined chips -->
          <div class="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
            <button
              v-for="opt in getAttributePredefinedOptions(attr)"
              :key="opt"
              type="button"
              @click="toggleOption(attr.code, opt)"
              :class="[
                'text-xs px-2.5 py-1 rounded-lg transition-all duration-150 border cursor-pointer',
                selectedOptions[attr.code]?.includes(opt)
                  ? 'bg-[#00DC82]/20 text-[#00DC82] border-[#00DC82]/40 font-medium'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200',
              ]"
            >
              {{ opt }}
            </button>
          </div>

          <!-- Custom tag adder -->
          <div class="flex items-center gap-1.5 pt-1">
            <input
              type="text"
              v-model="customInputs[attr.code]"
              @keydown.enter.prevent="addCustomOption(attr.code)"
              :placeholder="`افزودن ${attr.name} دلخواه...`"
              class="flex-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-[#00DC82]"
            />
            <button
              type="button"
              @click="addCustomOption(attr.code)"
              class="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition cursor-pointer"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. Variants Table & Bulk Actions -->
    <div class="space-y-3">
      <!-- Toolbar -->
      <div class="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1.5 text-xs">
            <span class="text-zinc-400">تعداد تنوع‌ها:</span>
            <span class="font-bold text-zinc-100 font-mono">{{ variants.length }}</span>
          </div>
          <div class="h-4 w-px bg-zinc-800"></div>
          <div class="flex items-center gap-1.5 text-xs">
            <span class="text-zinc-400">کل موجودی فیزیکی:</span>
            <span class="font-bold text-emerald-400 font-mono">{{ totalStock.toLocaleString('fa-IR') }}</span>
          </div>
          <div class="h-4 w-px bg-zinc-800"></div>
          <div class="flex items-center gap-1.5 text-xs">
            <span class="text-zinc-400">موجودی آزاد:</span>
            <span class="font-bold text-cyan-400 font-mono">{{ totalAvailable.toLocaleString('fa-IR') }}</span>
          </div>
        </div>

        <!-- Bulk controls -->
        <div class="flex flex-wrap items-center gap-2">
          <div class="flex items-center gap-1">
            <input
              type="number"
              v-model="bulkStockInput"
              placeholder="موجودی همه"
              class="w-24 px-2 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 font-mono placeholder-zinc-600 focus:outline-none focus:border-[#00DC82]"
            />
            <button
              type="button"
              @click="applyBulkStock"
              class="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-300 font-bold transition cursor-pointer"
            >
              اعمال موجودی
            </button>
          </div>

          <div class="flex items-center gap-1">
            <input
              type="number"
              v-model="bulkPriceInput"
              placeholder="قیمت همه"
              class="w-28 px-2 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 font-mono placeholder-zinc-600 focus:outline-none focus:border-[#00DC82]"
            />
            <button
              type="button"
              @click="applyBulkPrice"
              class="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-300 font-bold transition cursor-pointer"
            >
              اعمال قیمت
            </button>
          </div>

          <button
            type="button"
            @click="addManualVariant"
            class="px-3 py-1 rounded-lg border border-[#00DC82]/40 hover:bg-[#00DC82]/10 text-[#00DC82] text-xs font-bold transition flex items-center gap-1 cursor-pointer"
          >
            <span>+</span> افزودن دستی
          </button>
        </div>
      </div>

      <!-- Table Container -->
      <div class="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 shadow-inner">
        <table class="w-full text-right text-xs">
          <thead>
            <tr class="border-b border-zinc-800/80 bg-zinc-900/80 text-zinc-400 font-medium">
              <th class="p-3 w-14 text-center">تصویر</th>
              <th class="p-3">ترکیب ویژگی‌ها</th>
              <th class="p-3 w-40">کد انبارداری (SKU)</th>
              <th class="p-3 w-32">قیمت (تومان)</th>
              <th class="p-3 w-32">قیمت قبل تخفیف</th>
              <th class="p-3 w-24 text-center">موجودی کل</th>
              <th class="p-3 w-20 text-center">رزرو</th>
              <th class="p-3 w-20 text-center">آزاد</th>
              <th class="p-3 w-16 text-center">وضعیت</th>
              <th class="p-3 w-12 text-center">حذف</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-900">
            <tr v-if="variants.length === 0">
              <td colspan="10" class="p-8 text-center text-zinc-500">
                هنوز تنوعی ایجاد نشده است. از ماتریس‌ساز بالا استفاده کنید یا روی «افزودن دستی» کلیک کنید.
              </td>
            </tr>

            <tr
              v-for="(v, idx) in variants"
              :key="v.sku + idx"
              :class="[
                'transition hover:bg-zinc-900/40',
                !v.isActive ? 'opacity-60 bg-zinc-950/80' : '',
              ]"
            >
              <!-- 1. Image -->
              <td class="p-2.5 text-center">
                <button
                  type="button"
                  @click="openImagePicker(idx)"
                  class="w-10 h-10 rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden hover:border-[#00DC82] transition relative group mx-auto flex items-center justify-center cursor-pointer"
                  title="انتخاب تصویر تنوع"
                >
                  <img
                    v-if="v.image"
                    :src="v.image"
                    alt="Variant image"
                    class="w-full h-full object-cover"
                  />
                  <svg v-else class="w-4 h-4 text-zinc-600 group-hover:text-[#00DC82] transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
              </td>

              <!-- 2. Combination Chips -->
              <td class="p-2.5">
                <div class="flex flex-wrap gap-1 items-center">
                  <span
                    v-for="(val, key) in v.combination"
                    :key="key"
                    class="px-2 py-0.5 rounded-md bg-[#00DC82]/10 border border-[#00DC82]/20 text-[#00DC82] text-[11px] font-medium"
                  >
                    <span class="text-zinc-400 text-[10px]">{{ key }}:</span> {{ val }}
                  </span>
                </div>
              </td>

              <!-- 3. SKU -->
              <td class="p-2.5">
                <input
                  type="text"
                  v-model="v.sku"
                  class="w-full px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-100 focus:outline-none focus:border-[#00DC82]"
                />
              </td>

              <!-- 4. Price -->
              <td class="p-2.5">
                <input
                  type="number"
                  v-model.number="v.price"
                  class="w-full px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-100 text-left focus:outline-none focus:border-[#00DC82]"
                />
              </td>

              <!-- 5. Compare-at Price -->
              <td class="p-2.5">
                <input
                  type="number"
                  v-model.number="v.compareAtPrice"
                  placeholder="اختیاری"
                  class="w-full px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 placeholder-zinc-700 text-left focus:outline-none focus:border-[#00DC82]"
                />
              </td>

              <!-- 6. Physical Stock -->
              <td class="p-2.5 text-center">
                <input
                  type="number"
                  v-model.number="v.stock"
                  @input="v.availableStock = Math.max(0, (v.stock || 0) - (v.reservedQuantity || 0))"
                  min="0"
                  class="w-20 px-2 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-mono text-center text-emerald-400 font-bold focus:outline-none focus:border-[#00DC82]"
                />
              </td>

              <!-- 7. Reserved Qty (Readonly) -->
              <td class="p-2.5 text-center font-mono text-zinc-400 font-medium">
                {{ v.reservedQuantity || 0 }}
              </td>

              <!-- 8. Available Qty -->
              <td class="p-2.5 text-center font-mono font-bold" :class="[Math.max(0, (v.stock || 0) - (v.reservedQuantity || 0)) > 0 ? 'text-cyan-400' : 'text-rose-500']">
                {{ Math.max(0, (v.stock || 0) - (v.reservedQuantity || 0)) }}
              </td>

              <!-- 9. Active Toggle -->
              <td class="p-2.5 text-center">
                <input
                  type="checkbox"
                  v-model="v.isActive"
                  class="w-4 h-4 rounded text-[#00DC82] bg-zinc-900 border-zinc-800 focus:ring-0 cursor-pointer"
                  title="فعال / غیرفعال"
                />
              </td>

              <!-- 10. Actions -->
              <td class="p-2.5 text-center">
                <button
                  type="button"
                  @click="removeVariant(idx)"
                  class="text-zinc-500 hover:text-rose-400 transition p-1 rounded hover:bg-rose-500/10 cursor-pointer"
                  title="حذف این تنوع"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Image Picker Modal Integration -->
    <ImagePickerModal
      v-model="imagePickerOpen"
      @select="onImageSelected"
      title="انتخاب تصویر تنوع محصول از کتابخانه MinIO"
    />
  </div>
</template>
