<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

interface Props {
  modelValue: boolean;
  title?: string;
  description?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  maxWidth: 'md',
});

const emit = defineEmits(['update:modelValue', 'close']);

const close = () => {
  emit('update:modelValue', false);
  emit('close');
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
});

const maxWidthClass = computed(() => {
  switch (props.maxWidth) {
    case 'sm': return 'max-w-sm';
    case 'lg': return 'max-w-2xl';
    case 'xl': return 'max-w-4xl';
    case '2xl': return 'max-w-6xl';
    case 'md':
    default:
      return 'max-w-lg';
  }
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
        />

        <!-- Dialog -->
        <div class="fixed inset-0 z-[10001] flex items-center justify-center p-4 pointer-events-none">
          <div
            class="w-full bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
            :class="maxWidthClass"
          >
            <!-- Modal Header -->
            <div class="px-6 py-4 border-b border-zinc-800 flex items-center justify-between shrink-0 bg-zinc-950/80">
              <div>
                <h3 v-if="title" class="text-base font-bold text-white">{{ title }}</h3>
                <p v-if="description" class="text-xs text-zinc-400 mt-0.5">{{ description }}</p>
              </div>
              <button
                type="button"
                @click="close"
                class="w-8 h-8 rounded-xl bg-zinc-800/60 border border-zinc-700/60 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Modal Body -->
            <div class="p-6 overflow-y-auto flex-1 space-y-4">
              <slot />
            </div>

            <!-- Modal Footer -->
            <div v-if="$slots.footer" class="px-6 py-3.5 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-end gap-2.5 shrink-0">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </ClientOnly>
</template>

