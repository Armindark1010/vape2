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

const supplierGroups: NavGroup[] = [
  {
    name: 'Overview',
    items: [
      { label: 'داشبورد تأمین‌کننده', to: '/supplier', icon: '📊' },
    ],
  },
  {
    name: 'My Business',
    items: [
      { label: 'کالاهای تخصیص‌یافته', to: '/supplier/products', icon: '📦' },
      { label: 'موجودی انبار', to: '/supplier/products#inventory', icon: '🏷️' },
      { label: 'سفارشات کالاهای من', to: '/supplier/orders', icon: '🚚', badge: 'سفارشات' },
    ],
  },
  {
    name: 'Finance',
    items: [
      { label: 'درآمد و کارمزد من', to: '/supplier/finance', icon: '💰' },
      { label: 'جزئیات کارمزد پلتفرم', to: '/supplier/finance#commission', icon: '⚡' },
      { label: 'بچ‌های تسویه‌حساب', to: '/supplier/finance#settlements', icon: '📑' },
      { label: 'تاریخچه پرداخت‌ها', to: '/supplier/finance#payments', icon: '💳' },
    ],
  },
  {
    name: 'Account',
    items: [
      { label: 'مشخصات و پروفایل تجاری', to: '/supplier/profile', icon: '🏢' },
      { label: 'تنظیمات حساب کاربری', to: '/supplier/profile#settings', icon: '⚙️' },
      { label: 'اعلان‌ها و هشدارها', to: '/supplier/profile#alerts', icon: '🔔' },
    ],
  },
];

const collapsedGroups = ref<{ [key: string]: boolean }>({});
const toggleGroup = (name: string) => {
  collapsedGroups.value[name] = !collapsedGroups.value[name];
};

onMounted(() => {
  if (!isLoggedIn.value || (user.value?.role !== 'SUPPLIER' && user.value?.role !== 'ADMIN')) {
    if (route.path !== '/supplier/login') {
      router.replace('/supplier/login');
    }
  }
});
</script>

<template>
  <DashboardUDashboardGroup>
    <!-- Supplier Dedicated Sidebar -->
    <DashboardUDashboardSidebar>
      <!-- Top Slot: Supplier Business Card -->
      <template #header="{ collapsed }">
        <DashboardTeamsMenu
          :collapsed="collapsed"
          :title="user?.supplier?.companyName || 'پرتال رسمی تأمین‌کننده'"
          subtitle="سامانه همکاران تجاری ویپ‌لب"
          badge="تأمین‌کننده"
          icon="🏭"
        />
      </template>

      <!-- Navigation Menu -->
      <template #default="{ collapsed }">
        <div class="mb-4">
          <DashboardUDashboardSearch :collapsed="collapsed" />
        </div>

        <div class="space-y-4">
          <div v-for="group in supplierGroups" :key="group.name" class="space-y-1">
            <div
              v-if="!collapsed"
              class="flex items-center justify-between px-2.5 py-1 text-[11px] font-bold text-[#9696AD] uppercase tracking-wider cursor-pointer hover:text-[#F4F4F8] select-none transition"
              @click="toggleGroup(group.name)"
            >
              <span>{{ group.name }}</span>
              <span class="text-[9px] transition-transform duration-150" :class="{ 'rotate-180': collapsedGroups[group.name] }">
                ▼
              </span>
            </div>

            <div v-show="!collapsedGroups[group.name]" class="space-y-0.5">
              <NuxtLink
                v-for="item in group.items"
                :key="item.to"
                :to="item.to"
                class="group flex items-center justify-between rounded-xl px-2.5 py-2 text-[12.5px] font-medium transition-all duration-150"
                :class="[
                  route.path === item.to || (item.to.includes('#') && route.fullPath.includes(item.to))
                    ? 'bg-[#3B82F6]/15 text-[#F4F4F8] font-bold border border-[#3B82F6]/30 shadow-sm shadow-[#3B82F6]/10'
                    : 'text-[#9696AD] hover:bg-[#1A1A29]/70 hover:text-[#F4F4F8] border border-transparent'
                ]"
                :title="collapsed ? item.label : undefined"
              >
                <div class="flex items-center gap-2.5 min-w-0">
                  <span class="text-[15px] shrink-0 transition-transform group-hover:scale-110">
                    {{ item.icon }}
                  </span>
                  <span v-if="!collapsed" class="truncate">
                    {{ item.label }}
                  </span>
                </div>

                <span
                  v-if="item.badge && !collapsed"
                  class="rounded-full bg-[#3B82F6]/20 border border-[#3B82F6]/30 px-1.5 py-0.2 text-[9.5px] font-bold text-[#60A5FA] shrink-0"
                >
                  {{ item.badge }}
                </span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </template>

      <!-- Bottom Slot: User Profile -->
      <template #footer="{ collapsed }">
        <DashboardUserMenu :collapsed="collapsed" />
      </template>
    </DashboardUDashboardSidebar>

    <!-- Main Supplier Content Slot -->
    <slot />

    <!-- Global Notifications Slideover -->
    <DashboardNotificationsSlideover />
  </DashboardUDashboardGroup>
</template>

