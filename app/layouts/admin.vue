<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth';

const route = useRoute();
const router = useRouter();
const { user, isLoggedIn } = useAuth();

interface NavLink {
  label: string;
  to: string;
  icon: string;
  badge?: string;
}

interface NavGroup {
  name: string;
  items: NavLink[];
}

const navigationGroups: NavGroup[] = [
  {
    name: 'Overview',
    items: [
      { label: 'داشبورد آمار و تحلیل', to: '/admin-panel', icon: 'overview' },
    ],
  },
  {
    name: 'Marketplace',
    items: [
      { label: 'کالاها و محصولات', to: '/admin-panel/products', icon: 'products' },
      { label: 'دسته‌بندی‌ها', to: '/admin-panel/categories', icon: 'categories' },
      { label: 'برندها', to: '/admin-panel/brands', icon: 'brands' },
      { label: 'سفارشات مشتریان', to: '/admin-panel/orders', icon: 'orders', badge: 'جدید' },
      { label: 'مشتریان پلتفرم', to: '/admin-panel/customers', icon: 'customers' },
    ],
  },
  {
    name: 'Supplier Management',
    items: [
      { label: 'لیست تأمین‌کنندگان', to: '/admin-panel/suppliers', icon: 'suppliers' },
      { label: 'ایجاد تأمین‌کننده جدید', to: '/admin-panel/suppliers/create', icon: 'plus' },
      { label: 'کالاهای تخصیص‌یافته', to: '/admin-panel/suppliers#products', icon: 'products' },
      { label: 'سفارشات تأمین‌کنندگان', to: '/admin-panel/suppliers#orders', icon: 'shipping' },
      { label: 'عملکرد تأمین‌کنندگان', to: '/admin-panel/suppliers#performance', icon: 'commission' },
    ],
  },
  {
    name: 'Finance',
    items: [
      { label: 'بررسی اجمالی مالی', to: '/admin-panel/finance', icon: 'finance' },
      { label: 'کمیسیون و درآمد پلتفرم', to: '/admin-panel/finance#commissions', icon: 'commission' },
      { label: 'بچ‌های تسویه حساب', to: '/admin-panel/finance/settlements', icon: 'settlements', badge: 'تسویه' },
      { label: 'مانده حساب تأمین‌کنندگان', to: '/admin-panel/finance#balances', icon: 'balance' },
      { label: 'دفتر روزنامه تراکنش‌ها', to: '/admin-panel/finance#journal', icon: 'journal' },
    ],
  },
  {
    name: 'Marketing',
    items: [
      { label: 'مدیریت بنرها', to: '/admin-panel/banners', icon: 'banners', badge: 'ویژه' },
      { label: 'کدهای تخفیف', to: '/admin-panel/marketing/coupons', icon: 'coupons' },
      { label: 'کمپین‌های فروش', to: '/admin-panel/marketing/campaigns', icon: 'campaigns' },
    ],
  },
  {
    name: 'Platform',
    items: [
      { label: 'تنظیمات عمومی', to: '/admin-panel/settings', icon: 'settings' },
      { label: 'تنظیمات کمیسیون', to: '/admin-panel/settings#commission', icon: 'zap' },
      { label: 'درگاه‌های پرداخت', to: '/admin-panel/settings#payment', icon: 'finance' },
      { label: 'حمل و نقل و پیک', to: '/admin-panel/settings#shipping', icon: 'shipping' },
      { label: 'تنظیمات اعلان‌ها', to: '/admin-panel/settings#notifications', icon: 'notifications' },
    ],
  },
  {
    name: 'Access Management',
    items: [
      { label: 'مدیران سیستم', to: '/admin-panel/access/admins', icon: 'security' },
      { label: 'نقش‌ها و دسترسی‌ها', to: '/admin-panel/access/roles', icon: 'roles' },
      { label: 'لاگ فعالیت‌ها', to: '/admin-panel/access/audit', icon: 'audit' },
    ],
  },
];

const collapsedGroups = ref<{ [key: string]: boolean }>({});

const toggleGroup = (name: string) => {
  collapsedGroups.value[name] = !collapsedGroups.value[name];
};

const isLinkActive = (to: string) => {
  if (to === '/admin-panel') {
    return route.path === '/admin-panel';
  }
  if (to.includes('#')) {
    return route.fullPath.includes(to);
  }
  return route.path === to || route.path.startsWith(to + '/');
};

onMounted(() => {
  if (!isLoggedIn.value || (user.value?.role !== 'ADMIN' && !user.value?.isAdmin)) {
    if (route.path !== '/admin-panel/login') {
      router.replace('/admin-panel/login');
    }
  }
});
</script>

<template>
  <DashboardUDashboardGroup>
    <!-- Official Nuxt Dashboard Sidebar -->
    <DashboardUDashboardSidebar>
      <!-- Top Slot: Workspace / Store Selector -->
      <template #header="{ collapsed }">
        <DashboardTeamsMenu
          :collapsed="collapsed"
          title="ویپ‌لب — مدیریت ارشد"
          subtitle="VAPELAB Marketplace Admin"
          badge="Nuxt Pro"
          icon="nuxt"
        />
      </template>

      <!-- Main Navigation Menu -->
      <template #default="{ collapsed }">
        <!-- Search Trigger Button -->
        <div class="mb-4">
          <DashboardUDashboardSearch :collapsed="collapsed" />
        </div>

        <!-- Navigation Groups -->
        <div class="space-y-4">
          <div v-for="group in navigationGroups" :key="group.name" class="space-y-1">
            <!-- Group Header -->
            <div
              v-if="!collapsed"
              class="flex items-center justify-between px-2.5 py-1 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-300 select-none transition"
              @click="toggleGroup(group.name)"
            >
              <span>{{ group.name }}</span>
              <svg
                class="w-3 h-3 text-zinc-500 transition-transform duration-150"
                :class="{ 'rotate-180': collapsedGroups[group.name] }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <!-- Group Links -->
            <div v-show="!collapsedGroups[group.name]" class="space-y-0.5">
              <NuxtLink
                v-for="item in group.items"
                :key="item.to"
                :to="item.to"
                class="group flex items-center justify-between rounded-xl px-2.5 py-2 text-[12.5px] transition-all duration-150"
                :class="[
                  isLinkActive(item.to)
                    ? 'bg-[#00DC82]/10 text-[#00DC82] font-bold border border-[#00DC82]/25 shadow-sm shadow-[#00DC82]/5'
                    : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100 border border-transparent font-medium'
                ]"
                :title="collapsed ? item.label : undefined"
              >
                <div class="flex items-center gap-2.5 min-w-0">
                  <DashboardIcon
                    :name="item.icon"
                    :size="17"
                    :class="isLinkActive(item.to) ? 'text-[#8B5CF6]' : 'text-zinc-400 group-hover:text-zinc-200'"
                  />
                  <span v-if="!collapsed" class="truncate">
                    {{ item.label }}
                  </span>
                </div>

                <span
                  v-if="item.badge && !collapsed"
                  class="rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 px-1.5 py-0.2 text-[9.5px] font-bold text-[#8B5CF6] shrink-0"
                >
                  {{ item.badge }}
                </span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </template>

      <!-- Bottom Slot: User Profile Menu -->
      <template #footer="{ collapsed }">
        <DashboardUserMenu :collapsed="collapsed" />
      </template>
    </DashboardUDashboardSidebar>

    <!-- Main Content Panel Slot -->
    <slot />

    <!-- Global Notifications Slideover -->
    <DashboardNotificationsSlideover />
  </DashboardUDashboardGroup>
</template>
