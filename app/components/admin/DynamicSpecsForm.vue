<script setup lang="ts">
import { computed } from 'vue';

interface AttributeOption {
  label?: string;
  value?: string;
}

interface Attribute {
  id: number;
  name: string;
  code: string;
  type: string;
  isRequired: boolean;
  isVariant: boolean;
  isVisible: boolean;
  displayOrder: number;
  options?: any;
  unit?: string | null;
}

interface ProductType {
  id: number;
  name: string;
  slug: string;
  attributes?: Attribute[];
}

const props = defineProps<{
  productType: ProductType | null;
  modelValue: Record<number, any>;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<number, any>): void;
}>();

// Filter non-variant technical attributes
const technicalAttributes = computed(() => {
  if (!props.productType?.attributes) return [];
  return props.productType.attributes.filter((attr) => !attr.isVariant);
});

const parseOptions = (options: any): string[] => {
  if (!options) return [];
  if (Array.isArray(options)) {
    return options.map((opt) => (typeof opt === 'object' && opt !== null ? opt.value || opt.label : String(opt)));
  }
  if (typeof options === 'string') {
    try {
      const parsed = JSON.parse(options);
      if (Array.isArray(parsed)) return parseOptions(parsed);
    } catch {
      return options.split(/[\s,]+/).filter(Boolean);
    }
  }
  return [];
};

const updateAttrValue = (attributeId: number, val: any) => {
  const updated = { ...props.modelValue, [attributeId]: val };
  emit('update:modelValue', updated);
};
</script>

<template>
  <div class="space-y-4">
    <div v-if="!productType" class="p-6 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 text-center">
      <p class="text-sm text-zinc-400">ابتدا نوع محصول را در بخش اطلاعات پایه انتخاب کنید تا مشخصات فنی مربوطه بارگذاری شوند.</p>
    </div>

    <div v-else-if="technicalAttributes.length === 0" class="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 text-center">
      <p class="text-sm text-zinc-400">برای نوع محصول «{{ productType.name }}» مشخصات فنی غیرتنوعی تعریف نشده است.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="attr in technicalAttributes"
        :key="attr.id"
        class="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/50 hover:border-zinc-700/80 transition-all duration-200"
      >
        <div class="flex items-center justify-between mb-2">
          <label class="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <span>{{ attr.name }}</span>
            <span v-if="attr.isRequired" class="text-rose-500 font-bold">*</span>
            <span v-if="attr.unit" class="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50">
              {{ attr.unit }}
            </span>
          </label>
          <span class="text-[10px] text-zinc-500 font-mono">{{ attr.code }}</span>
        </div>

        <!-- Text Input -->
        <input
          v-if="attr.type === 'text'"
          type="text"
          :value="modelValue[attr.id] || ''"
          @input="updateAttrValue(attr.id, ($event.target as HTMLInputElement).value)"
          :placeholder="`مقدار ${attr.name}...`"
          class="w-full px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 transition"
        />

        <!-- Number Input -->
        <div v-else-if="attr.type === 'number'" class="relative">
          <input
            type="number"
            :value="modelValue[attr.id] ?? ''"
            @input="updateAttrValue(attr.id, ($event.target as HTMLInputElement).value ? Number(($event.target as HTMLInputElement).value) : '')"
            :placeholder="`مثال: 5000`"
            class="w-full px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 transition font-mono"
          />
          <span v-if="attr.unit" class="absolute left-3 top-2 text-xs text-zinc-500 select-none">
            {{ attr.unit }}
          </span>
        </div>

        <!-- Select Dropdown -->
        <select
          v-else-if="attr.type === 'select'"
          :value="modelValue[attr.id] || ''"
          @change="updateAttrValue(attr.id, ($event.target as HTMLSelectElement).value)"
          class="w-full px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 transition cursor-pointer"
        >
          <option value="">-- انتخاب کنید --</option>
          <option v-for="opt in parseOptions(attr.options)" :key="opt" :value="opt">
            {{ opt }}
          </option>
        </select>

        <!-- Boolean Toggle -->
        <div v-else-if="attr.type === 'boolean'" class="flex items-center gap-3 pt-1">
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              :checked="Boolean(modelValue[attr.id])"
              @change="updateAttrValue(attr.id, ($event.target as HTMLInputElement).checked)"
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
          <span class="text-xs text-zinc-400">
            {{ modelValue[attr.id] ? 'دارد / بله' : 'ندارد / خیر' }}
          </span>
        </div>

        <!-- Color or Fallback -->
        <div v-else class="flex items-center gap-2">
          <input
            type="text"
            :value="modelValue[attr.id] || ''"
            @input="updateAttrValue(attr.id, ($event.target as HTMLInputElement).value)"
            :placeholder="`مقدار ${attr.name}...`"
            class="flex-1 px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 transition"
          />
        </div>
      </div>
    </div>
  </div>
</template>

