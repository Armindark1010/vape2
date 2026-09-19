import { ref } from 'vue';
import { useAuth } from '~/composables/useAuth';
import { useVape } from '~/composables/useVape';

export type RestockAlertItem = {
  productId: string | number;
  productSlug: string;
  productTitle: string;
  phoneNumber?: string;
  subscribedAt: string;
};

const STORAGE_KEY = 'vapelab.restock_alerts';
const subscribedAlerts = ref<RestockAlertItem[]>([]);

export function useRestockAlerts() {
  const { user, requireAuth } = useAuth();
  const { toast } = useVape();

  // لود اولیه از localStorage
  const init = () => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        subscribedAlerts.value = JSON.parse(stored);
      }
    } catch {
      subscribedAlerts.value = [];
    }
  };

  if (typeof window !== 'undefined') {
    init();
  }

  const saveStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subscribedAlerts.value));
    }
  };

  /**
   * درخواست مجوز نوتیفیکیشن مرورگر و رجیستر Service Worker
   */
  const requestBrowserPermission = async (): Promise<boolean> => {
    if (typeof window === 'undefined') return false;

    // ثبت Service Worker
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/sw.js');
      } catch (err) {
        console.warn('[SW Registration Error]:', err);
      }
    }

    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  };

  /**
   * پخش صدای دلنشین اعلان شارژ با Web Audio API
   */
  const playAlertSound = () => {
    try {
      if (typeof window === 'undefined') return;
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // Audio not supported
    }
  };

  /**
   * ارسال نوتیفیکیشن مستقیم به سیستم‌عامل/مرورگر کاربر از طریق ServiceWorker یا Web Notification
   */
  const sendBrowserNotification = async (
    title: string,
    body: string,
    slug?: string,
  ) => {
    if (typeof window === 'undefined') return;

    // ۱. پخش فوری صدای اعلان
    playAlertSound();

    // ۲. بررسی وجود API نوتیفیکیشن
    if (!('Notification' in window)) {
      console.warn('[Notification API not supported in this browser]');
      return;
    }

    // ۳. درخواست دسترسی در صورت عدم تایید قبلی
    if (Notification.permission !== 'granted') {
      try {
        const p = await Notification.requestPermission();
        if (p !== 'granted') {
          console.warn('[Notification permission was not granted by user]:', p);
          return;
        }
      } catch (err) {
        console.warn('[Notification requestPermission error]:', err);
        return;
      }
    }

    const options: NotificationOptions = {
      body,
      icon: '/favicon.png',
      badge: '/favicon.png',
      dir: 'rtl',
      lang: 'fa',
      tag: `restock-${slug || Date.now()}`,
      requireInteraction: true,
      data: {
        url: slug ? `/product/${slug}` : '/',
      },
    };

    // ارسال مستقیم از شیء Notification مرورگر
    try {
      const notif = new Notification(title, options);
      notif.onclick = () => {
        window.focus();
        if (slug) {
          window.location.href = `/product/${slug}`;
        }
      };
    } catch (err) {
      console.warn('[Direct Notification fallback to SW]:', err);
    }

    // ارسال از طریق Service Worker (در صورتی که رجیستر شده باشد)
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg && reg.showNotification) {
          await reg.showNotification(title, options);
        }
      } catch (swErr) {
        console.warn('[SW ShowNotification error]:', swErr);
      }
    }
  };

  const isSubscribed = (productId: string | number) => {
    return subscribedAlerts.value.some((a) => String(a.productId) === String(productId));
  };

  /**
   * عملیات مستقیم ثبت اشتراک از روی پروفایل کاربر (بدون باز شدن مودال اضافی)
   */
  const doSubscribe = async (product: { id: string | number; slug: string; name: string }) => {
    const phone = user.value?.phoneNumber || undefined;

    // درخواست فعال‌سازی نوتیفیکیشن مرورگر در پس‌زمینه
    requestBrowserPermission();

    try {
      // ارسال به سرور با اطلاعات حساب
      await $fetch(`/api/v1/products/${product.id}/notify-me`, {
        method: 'POST',
        body: { phoneNumber: phone },
      }).catch(() => {
        console.log('[Restock Fallback] Subscribed locally for product:', product.name);
      });

      // ثبت لوکال
      if (!isSubscribed(product.id)) {
        subscribedAlerts.value.push({
          productId: product.id,
          productSlug: product.slug,
          productTitle: product.name,
          phoneNumber: phone,
          subscribedAt: new Date().toISOString(),
        });
        saveStorage();
      }

      toast(`اطلاع‌رسانی موجودی برای «${product.name}» فعال شد ✓`);
    } catch (err: any) {
      toast(err?.data?.message || 'خطا در ثبت درخواست', 'err');
    }
  };

  /**
   * سوئیچ یک‌کلیکه ثبت / لغو اطلاع‌رسانی موجودی با احراز هویت خودکار
   */
  const toggleRestock = (product: { id: string | number; slug: string; name: string }) => {
    if (isSubscribed(product.id)) {
      unsubscribe(product.id);
      return;
    }

    // بررسی ورود کاربر؛ در صورت عدم لاگین، مستقیماً پنجره ورود باز شده و پس از ورود درجا اکتیو می‌شود
    requireAuth(() => {
      doSubscribe(product);
    }, 'برای فعال‌سازی اطلاع‌رسانی موجودی، لطفاً وارد حساب شوید');
  };

  const removeAlert = (productId: string | number) => {
    subscribedAlerts.value = subscribedAlerts.value.filter(
      (a) => String(a.productId) !== String(productId),
    );
    saveStorage();
  };

  const unsubscribe = (productId: string | number) => {
    removeAlert(productId);
    toast('اطلاع‌رسانی موجودی برای این کالا لغو شد');
  };

  /**
   * بررسی زنده موجودی برای اطلاع‌رسانی در لحظه شارژ به کاربر آنلاین در مرورگر
   */
  const checkRestocked = (products: { id: string | number; name: string; slug: string; stock: number }[]) => {
    if (!products || products.length === 0 || subscribedAlerts.value.length === 0) return;

    for (const p of products) {
      if (p.stock > 0 && isSubscribed(p.id)) {
        console.log('[Restock Alert Triggered!]:', p.name);

        // ۱. ارسال اعلان مستقیم در سیستم‌عامل / مرورگر (Web Notification)
        sendBrowserNotification(
          '🎉 کالای محبوب شما موجود شد!',
          `کالای «${p.name}» در فروشگاه ویپ‌لب شارژ شد. جهت خرید کلیک کنید.`,
          p.slug,
        );

        // ۲. ارسال توست جذاب درون‌برنامه‌ای
        toast(`🔥 کالای «${p.name}» که منتظرش بودید موجود شد!`);

        // ۳. حذف سایلنت از لیست منتظرها
        removeAlert(p.id);
      }
    }
  };

  return {
    subscribedAlerts,
    isSubscribed,
    toggleRestock,
    unsubscribe,
    requestBrowserPermission,
    sendBrowserNotification,
    checkRestocked,
    init,
  };
}
