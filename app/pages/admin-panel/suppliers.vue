<script setup lang="ts">
import { ref, onMounted } from 'vue';

definePageMeta({
  layout: 'admin',
});

useSeoMeta({
  title: 'مدیریت تأمین‌کنندگان مارکت‌پلیس ویپ‌لب',
});

const suppliers = ref<any[]>([]);
const loading = ref(true);
const editModalOpen = ref(false);
const selectedSupplier = ref<any | null>(null);
const saving = ref(false);

const columns = [
  { key: 'companyName', label: 'نام تجاری / شرکت', sortable: true },
  { key: 'contact', label: 'مسئول ارتباط و تماس' },
  { key: 'email', label: 'ایمیل سازمانی' },
  { key: 'commissionRate', label: 'کارمزد (%)', sortable: true, align: 'center' as const },
  { key: 'productsCount', label: 'کالاهای تخصیصی', sortable: true, align: 'center' as const },
  { key: 'isActive', label: 'وضعیت فعالیت', sortable: true, align: 'center' as const },
  { key: 'actions', label: 'عملیات', align: 'center' as const },
];

const loadSuppliers = async () => {
  loading.value = true;
  try {
    const res = await $fetch<any[]>('/api/v1/suppliers/admin/list');
    suppliers.value = res.map(s => ({
      ...s,
      contact: `${s.contactName || '---'} (${s.phone || s.user?.phone || '---'})`,
      email: s.email || s.user?.email,
      productsCount: s._count?.products ?? 0,
      settlementsCount: s._count?.settlements ?? 0,
    }));
  } catch (err) {
    console.warn('Error loading suppliers:', err);
  } finally {
    loading.value = false;
  }
};

const toggleSupplierStatus = async (supplier: any) => {
  const newStatus = !supplier.isActive;
  const actionText = newStatus ? 'فعال‌سازی' : 'تعلیق موقت';
  if (!confirm(`آیا از ${actionText} تأمین‌کننده "${supplier.companyName}" اطمینان دارید؟`)) return;

  try {
    await $fetch(`/api/v1/suppliers/admin/${supplier.id}`, {
      method: 'PATCH',
      body: { isActive: newStatus },
    });
    supplier.isActive = newStatus;
  } catch (err: any) {
    alert('خطا در تغییر وضعیت: ' + (err?.data?.message || err.message));
  }
};

const openEditModal = (supplier: any) => {
  selectedSupplier.value = { ...supplier };
  editModalOpen.value = true;
};

const saveSupplierChanges = async () => {
  if (!selectedSupplier.value) return;
  saving.value = true;
  try {
    await $fetch(`/api/v1/suppliers/admin/${selectedSupplier.value.id}`, {
      method: 'PATCH',
      body: {
        companyName: selectedSupplier.value.companyName,
        contactName: selectedSupplier.value.contactName,
        phone: selectedSupplier.value.phone,
        email: selectedSupplier.value.email,
        iban: selectedSupplier.value.iban,
        commissionRate: Number(selectedSupplier.value.commissionRate),
      },
    });
    editModalOpen.value = false;
    await loadSuppliers();
  } catch (err: any) {
    alert('خطا در ذخیره تغییرات: ' + (err?.data?.message || err.message));
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  loadSuppliers();
});
</script>

<template>
  <DashboardUDashboardPanel>
    <template #header>
      <DashboardUDashboardNavbar title="مدیریت جامع تأمین‌کنندگان" badge="Suppliers">
        <template #right>
          <NuxtLink
            to="/admin-panel/suppliers/create"
            class="px-3.5 py-1.5 rounded-xl bg-[#00DC82] text-zinc-950 font-bold text-xs hover:bg-[#00c575] transition flex items-center gap-1.5 cursor-pointer"
          >
            <DashboardIcon name="plus" :size="15" />
            <span>ثبت تأمین‌کننده جدید</span>
          </NuxtLink>
        </template>
      </DashboardUDashboardNavbar>
    </template>

    <!-- Summary KPI cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <DashboardUDashboardKpiCard
        title="تعداد تأمین‌کنندگان همکار"
        :value="suppliers.length.toLocaleString('fa-IR') + ' شرکت'"
        icon="suppliers"
        subtitle="تأمین‌کنندگان ثبت‌شده"
        :loading="loading"
      />

      <DashboardUDashboardKpiCard
        title="تأمین‌کنندگان فعال"
        :value="suppliers.filter(s => s.isActive).length.toLocaleString('fa-IR') + ' فعال'"
        icon="check"
        subtitle="دارای مجوز فروش جاری"
        :loading="loading"
      />

      <DashboardUDashboardKpiCard
        title="میانگین نرخ کارمزد"
        :value="'۱۰%'"
        icon="zap"
        subtitle="کارمزد پیش‌فرض پلتفرم"
      />

      <DashboardUDashboardKpiCard
        title="تسویه‌های ثبت‌شده"
        :value="suppliers.reduce((sum, s) => sum + s.settlementsCount, 0).toLocaleString('fa-IR') + ' دوره'"
        icon="settlements"
        subtitle="دوره‌های مالی منعقد شده"
        :loading="loading"
      />
    </div>

    <!-- Suppliers Table -->
    <DashboardUDashboardDataTable
      :columns="columns"
      :rows="suppliers"
      search-placeholder="جستجوی نام شرکت، نام مسئول، تلفن یا شماره شبا..."
      :loading="loading"
    >
      <template #companyName="{ row }">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-[#00DC82]/10 border border-[#00DC82]/20 flex items-center justify-center text-[#00DC82] shrink-0">
            <DashboardIcon name="suppliers" :size="16" />
          </div>
          <div>
            <div class="font-bold text-white">{{ row.companyName }}</div>
            <div class="text-[10px] text-zinc-500 font-mono">شناسه: #SUP-{{ row.id }}</div>
          </div>
        </div>
      </template>

      <template #contact="{ row }">
        <div>
          <div class="font-medium text-white">{{ row.contactName || '---' }}</div>
          <div class="text-[10.5px] text-zinc-500 font-mono">{{ row.phone || row.user?.phone || '---' }}</div>
        </div>
      </template>

      <template #email="{ row }">
        <span class="font-mono text-xs text-zinc-400">{{ row.email || row.user?.email || '---' }}</span>
      </template>

      <template #commissionRate="{ row }">
        <span class="font-bold font-mono text-[#00DC82] px-2 py-0.5 rounded bg-[#00DC82]/10 border border-[#00DC82]/25">
          {{ row.commissionRate }}%
        </span>
      </template>

      <template #productsCount="{ row }">
        <span class="font-mono font-medium text-white">
          {{ row.productsCount }} کالا
        </span>
      </template>

      <template #isActive="{ row }">
        <DashboardUDashboardBadge
          :variant="row.isActive ? 'success' : 'danger'"
          :dot="true"
        >
          {{ row.isActive ? 'فعال و مجاز' : 'معلق / غیرفعال' }}
        </DashboardUDashboardBadge>
      </template>

      <template #actions="{ row }">
        <div class="flex items-center justify-center gap-1.5">
          <button
            type="button"
            @click="openEditModal(row)"
            class="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-200 hover:text-white transition cursor-pointer"
          >
            ویرایش
          </button>
          <button
            type="button"
            @click="toggleSupplierStatus(row)"
            class="px-2 py-1 rounded-lg border text-xs transition cursor-pointer"
            :class="row.isActive ? 'border-rose-500/30 text-rose-400 hover:bg-rose-500/10' : 'border-[#00DC82]/30 text-[#00DC82] hover:bg-[#00DC82]/10'"
          >
            {{ row.isActive ? 'تعلیق' : 'فعال‌سازی' }}
          </button>
        </div>
      </template>
    </DashboardUDashboardDataTable>

    <!-- Edit Supplier Modal -->
    <DashboardUDashboardModal
      v-model="editModalOpen"
      title="ویرایش اطلاعات تأمین‌کننده"
      description="بروزرسانی مشخصات سازمانی، شماره شبا و درصد کارمزد اختصاصی"
      max-width="md"
    >
      <div v-if="selectedSupplier" class="space-y-4 text-right">
        <div>
          <label class="block text-xs font-bold text-zinc-300 mb-1.5">نام شرکت / فروشگاه تجاری</label>
          <input
            v-model="selectedSupplier.companyName"
            type="text"
            class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#00DC82]"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-zinc-300 mb-1.5">شخص رابط / مدیر</label>
            <input
              v-model="selectedSupplier.contactName"
              type="text"
              class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#00DC82]"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-zinc-300 mb-1.5">درصد کمیسیون پلتفرم (%)</label>
            <input
              v-model="selectedSupplier.commissionRate"
              type="number"
              min="0"
              max="100"
              class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-[#00DC82]"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-zinc-300 mb-1.5">تلفن همراه مسئول</label>
            <input
              v-model="selectedSupplier.phone"
              type="text"
              class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-[#00DC82]"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-zinc-300 mb-1.5">ایمیل مکاتبات</label>
            <input
              v-model="selectedSupplier.email"
              type="email"
              class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-[#00DC82]"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-zinc-300 mb-1.5">شماره شبا جهت تسویه بانکی</label>
          <input
            v-model="selectedSupplier.iban"
            type="text"
            placeholder="IR..."
            class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-[#00DC82]"
          />
        </div>
      </div>

      <template #footer>
        <button
          type="button"
          @click="editModalOpen = false"
          class="px-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-zinc-400 hover:text-white transition cursor-pointer"
        >
          انصراف
        </button>
        <button
          type="button"
          :disabled="saving"
          @click="saveSupplierChanges"
          class="px-5 py-2 rounded-xl bg-[#00DC82] text-zinc-950 hover:bg-[#00c575] font-bold text-xs transition disabled:opacity-50 cursor-pointer"
        >
          {{ saving ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}
        </button>
      </template>
    </DashboardUDashboardModal>
  </DashboardUDashboardPanel>
</template>
