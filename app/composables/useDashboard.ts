import { computed, watch, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export interface DashboardNotification {
  id: string | number;
  title: string;
  description: string;
  time: string;
  category: 'order' | 'settlement' | 'inventory' | 'system';
  icon: string;
  unread: boolean;
  link?: string;
  createdAt?: string;
}

export const useDashboard = () => {
  const route = useRoute();
  const router = useRouter();

  // Slideover open/closed state
  const isNotificationsSlideoverOpen = useState<boolean>('dashboard:notificationsOpen', () => false);

  // Notifications store
  const notifications = useState<DashboardNotification[]>('dashboard:notifications', () => [
    {
      id: 'notif-1',
      title: 'ثبت و پرداخت سفارش جدید #VAPE-1004',
      description: 'سفارش جدید به مبلغ ۳٬۲۰۰٬۰۰۰ تومان توسط مشتری ثبت و تایید درگاه بانکی شد.',
      time: '۵ دقیقه پیش',
      category: 'order',
      icon: 'orders',
      unread: true,
      link: '/admin-panel/orders',
    },
    {
      id: 'notif-2',
      title: 'درخواست تسویه حساب هفتگی تامین‌کننده',
      description: 'بچ تسویه شماره #SET-2026-08 متعلق به شرکت نیکوتین‌پارس آماده صدور حواله پایا است.',
      time: '۳۵ دقیقه پیش',
      category: 'settlement',
      icon: 'finance',
      unread: true,
      link: '/admin-panel/finance/settlements',
    },
    {
      id: 'notif-3',
      title: 'هشدار کسری موجودی انبار',
      description: 'موجودی سالت نیکوتین توت‌فرنگی نستی به کمتر از ۳ عدد رسیده و نیازمند شارژ است.',
      time: '۲ ساعت پیش',
      category: 'inventory',
      icon: 'products',
      unread: false,
      link: '/admin-panel/products',
    },
    {
      id: 'notif-4',
      title: 'ورود موفق به حساب مدیر کل',
      description: 'ورود موفقیت‌آمیز به پنل ادمین از طریق نشست امن محلی ثبت شد.',
      time: 'امروز، ۱۰:۱۵',
      category: 'system',
      icon: 'security',
      unread: false,
    },
  ]);

  const unreadCount = computed(() => {
    return notifications.value.filter(n => n.unread).length;
  });

  const toggleNotifications = () => {
    isNotificationsSlideoverOpen.value = !isNotificationsSlideoverOpen.value;
  };

  const openNotifications = () => {
    isNotificationsSlideoverOpen.value = true;
  };

  const closeNotifications = () => {
    isNotificationsSlideoverOpen.value = false;
  };

  const markAllRead = () => {
    notifications.value.forEach(n => {
      n.unread = false;
    });
  };

  const markAsRead = (id: string | number) => {
    const item = notifications.value.find(n => n.id === id);
    if (item) {
      item.unread = false;
    }
  };

  const clearAllNotifications = () => {
    notifications.value = [];
  };

  // Close slideover upon route navigation
  watch(
    () => route.fullPath,
    () => {
      isNotificationsSlideoverOpen.value = false;
    }
  );

  return {
    isNotificationsSlideoverOpen,
    notifications,
    unreadCount,
    toggleNotifications,
    openNotifications,
    closeNotifications,
    markAllRead,
    markAsRead,
    clearAllNotifications,
  };
};

