<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useVape } from "~/composables/useVape";
import { SITE, haptic, BRANDS_LINE } from "~/utils/vape";
import {
  HomeIcon,
  GridIcon,
  SearchIcon,
  BagIcon,
  UserIcon,
  CloseIcon,
  DropletIcon,
} from "~/components/vapor/VIcons";

type Hit = { id: number; slug: string; name: string; price: number; image: string; tagline: string | null };

const route = useRoute();
const router = useRouter();
const { cartCount, setCartOpen, hydrated } = useVape();

const searchOpen = ref(false);
const q = ref("");
const hits = ref<Hit[] | null>(null);
const busy = ref(false);
const boxRef = ref<HTMLInputElement | null>(null);
let deb: ReturnType<typeof setTimeout> | undefined;

const items = [
  { id: "home", label: "خانه", href: "/", Icon: HomeIcon },
  { id: "cats", label: "دسته‌بندی‌ها", href: "/categories", Icon: GridIcon },
  { id: "search", label: "جستجو", action: "search" as const, Icon: SearchIcon },
  { id: "cart", label: "سبد خرید", action: "cart" as const, Icon: BagIcon },
  { id: "acc", label: "حساب", href: "/account", Icon: UserIcon },
];

watch(
  () => route.path,
  () => {
    if (searchOpen.value) {
      searchOpen.value = false;
    }
  }
);

watch(searchOpen, (isOpen) => {
  if (typeof document === "undefined") return;
  if (isOpen) {
    setTimeout(() => boxRef.value?.focus(), 120);
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});

onUnmounted(() => {
  if (typeof document !== "undefined") {
    document.body.style.overflow = "";
  }
});

const search = (term: string) => {
  q.value = term;
  if (deb) clearTimeout(deb);
  if (term.trim().length < 2) {
    hits.value = null;
    return;
  }
  busy.value = true;
  deb = setTimeout(async () => {
    try {
      const d = await $fetch<Hit[]>(`/api/search?q=${encodeURIComponent(term.trim())}`);
      hits.value = Array.isArray(d) ? d : [];
    } catch {
      hits.value = [];
    } finally {
      busy.value = false;
    }
  }, 180);
};

const go = (slug: string) => {
  searchOpen.value = false;
  router.push(`/product/${slug}`);
};

const isActive = (href?: string) => {
  if (!href) return false;
  if (href === "/") return route.path === "/";
  return route.path.startsWith(href);
};

const onItemClick = (it: (typeof items)[0]) => {
  haptic(8);
  if (it.action === "cart") {
    setCartOpen(true);
  } else if (it.action === "search") {
    searchOpen.value = true;
  }
};
</script>

<template>
  <div>
    <!-- هدر دسکتاپ -->
    <header class="glass sticky top-0 z-50 hidden border-b border-white/8 lg:block">
      <div class="wrap flex h-16 items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2.5" aria-label="ویپورا">
          <span class="text-vio"><DropletIcon :size="22" /></span>
          <span dir="ltr" class="font-extrabold tracking-[0.3em] text-snow">{{ SITE.latin }}</span>
          <span class="rounded-full bg-vio/15 px-2.5 py-1 text-[10px] font-bold text-vio">ویپ و سالت</span>
        </NuxtLink>
        <nav class="flex items-center gap-8 text-[13px] font-semibold text-mist">
          <NuxtLink to="/" class="hover:text-snow">خانه</NuxtLink>
          <NuxtLink to="/categories" class="hover:text-snow">دسته‌بندی‌ها</NuxtLink>
          <NuxtLink to="/shop" class="hover:text-snow">فروشگاه</NuxtLink>
        </nav>
        <div class="flex items-center gap-2">
          <button
            class="pressable flex h-11 items-center gap-2 rounded-xl border border-white/12 px-4 text-[13px] text-mist cursor-pointer"
            aria-label="جستجو"
            @click="searchOpen = true"
          >
            <SearchIcon :size="17" /> جستجو
          </button>
          <button
            class="pressable relative grid h-11 w-11 place-items-center rounded-xl border border-white/12 text-snow cursor-pointer"
            :aria-label="`سبد خرید (${cartCount})`"
            @click="setCartOpen(true)"
          >
            <BagIcon :size="19" />
            <span
              v-if="cartCount > 0"
              class="absolute -top-1.5 -left-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-gradient-to-l from-neon to-ice px-1 text-[10px] font-extrabold text-ink"
            >
              {{ cartCount }}
            </span>
          </button>
          <NuxtLink
            to="/account"
            class="pressable grid h-11 w-11 place-items-center rounded-xl border border-white/12 text-snow transition-colors hover:border-vio/40 hover:text-vio"
            aria-label="حساب کاربری"
          >
            <UserIcon :size="19" />
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- نوار پایین موبایل -->
    <nav
      class="glass safe-bottom fixed inset-x-0 bottom-0 z-[70] border-t border-white/10 pb-1 lg:hidden"
      aria-label="ناوبری اصلی"
    >
      <div class="mx-auto flex h-[62px] max-w-lg items-stretch justify-around px-1">
        <template v-for="it in items" :key="it.id">
          <!-- Link item -->
          <NuxtLink
            v-if="it.href"
            :to="it.href"
            :aria-label="it.label"
            :aria-current="isActive(it.href) ? 'page' : undefined"
            class="pressable relative flex w-[20%] flex-col items-center justify-center gap-1 rounded-2xl"
            @click="haptic(8)"
          >
            <span class="relative">
              <component
                :is="it.Icon"
                :size="23"
                :class="isActive(it.href) ? 'text-snow' : 'text-dim'"
                :sw="isActive(it.href) ? 2 : 1.7"
              />
            </span>
            <span :class="['text-[10px] font-semibold', isActive(it.href) ? 'text-snow' : 'text-dim']">
              {{ it.label }}
            </span>
            <span v-if="isActive(it.href)" class="absolute bottom-0.5 h-1 w-1 rounded-full bg-vio" />
          </NuxtLink>

          <!-- Button action item (Search, Cart) -->
          <button
            v-else
            type="button"
            :aria-label="it.label"
            class="pressable relative flex w-[20%] flex-col items-center justify-center gap-1 rounded-2xl cursor-pointer"
            @click="onItemClick(it)"
          >
            <span class="relative">
              <component
                :is="it.Icon"
                :size="23"
                class="text-dim"
                :sw="1.7"
              />
              <span
                v-if="it.action === 'cart' && hydrated && cartCount > 0"
                class="absolute -top-2.5 -right-2.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-gradient-to-l from-neon to-ice px-1 text-[9.5px] font-extrabold text-ink"
              >
                {{ cartCount > 99 ? "99" : cartCount }}
              </span>
            </span>
            <span class="text-[10px] font-semibold text-dim">
              {{ it.label }}
            </span>
          </button>
        </template>
      </div>
    </nav>

    <!-- جستجوی سریع تمام‌صفحه -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-10"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-8"
      >
        <div
          v-if="searchOpen"
          class="fixed inset-0 z-[90] overflow-y-auto bg-ink/90 backdrop-blur-2xl"
          role="dialog"
          aria-modal="true"
          aria-label="جستجوی سریع"
        >
          <div class="mx-auto min-h-svh w-full max-w-2xl px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-28">
            <div class="flex items-center gap-3">
              <div class="relative flex-1">
                <SearchIcon :size="20" class="absolute top-1/2 right-4 -translate-y-1/2 text-dim" />
                <input
                  ref="boxRef"
                  :value="q"
                  placeholder="دنبال چه طعمی هستی؟ (انگور یخ، بلوبری…)"
                  class="input h-14 rounded-2xl pr-12 text-[15px]"
                  aria-label="جستجو"
                  @input="(e: any) => search(e.target.value)"
                />
              </div>
              <button
                class="pressable grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/12 text-mist cursor-pointer"
                aria-label="بستن جستجو"
                @click="searchOpen = false"
              >
                <CloseIcon :size="20" />
              </button>
            </div>

            <!-- Empty query suggestions -->
            <div v-if="q.trim().length < 2" class="mt-8">
              <p class="mb-3 text-[12px] font-bold text-dim">جستجوهای پرطرفدار</p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="s in ['انگور یخ', 'بلوبری', 'تنباکو', 'نعناع', 'سالت ۵۰', 'پاد ۶۰۰۰']"
                  :key="s"
                  class="pressable rounded-full border border-white/12 bg-white/4 px-4 py-2.5 text-[13px] text-mist cursor-pointer"
                  @click="search(s)"
                >
                  {{ s }}
                </button>
              </div>
              <p class="mt-10 mb-3 text-[12px] font-bold text-dim">برندهای معتبر</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="b in BRANDS_LINE"
                  :key="b"
                  dir="ltr"
                  class="rounded-lg bg-white/4 px-3 py-2 text-[12px] font-bold tracking-wider text-mist"
                >
                  {{ b }}
                </span>
              </div>
            </div>

            <!-- Results -->
            <div v-else class="mt-6">
              <!-- Loading -->
              <div v-if="busy" class="grid grid-cols-2 gap-4 pt-2" aria-busy="true">
                <div v-for="i in 4" :key="i" class="skeleton h-56 w-full" />
              </div>

              <!-- Not found -->
              <div v-else-if="hits && hits.length === 0" class="rounded-2xl border border-dashed border-white/12 p-10 text-center">
                <p class="text-4xl">🔍</p>
                <p class="mt-3 text-sm font-semibold text-mist">چیزی پیدا نشد</p>
                <p class="mt-1 text-[12px] text-dim">املا را بررسی کن یا کلمه دیگری را امتحان کن</p>
              </div>

              <!-- Hit cards -->
              <div v-else class="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <button
                  v-for="h in hits ?? []"
                  :key="h.id"
                  class="text-right cursor-pointer"
                  @click="go(h.slug)"
                >
                  <div class="card-g overflow-hidden rounded-2xl">
                    <img :src="h.image" :alt="h.name" class="aspect-[4/5] w-full object-cover" loading="lazy" />
                  </div>
                  <p dir="ltr" class="mt-2 truncate text-right text-[13px] font-bold text-snow">
                    {{ h.name }}
                  </p>
                  <p class="mt-0.5 text-[11px] font-semibold text-neon tnum">
                    {{ h.price.toLocaleString("en-US") }} تومان
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
