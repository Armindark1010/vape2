/* ==========================================================================
   📌 پیکربندی مرکزی برنامه (Application Configuration - app.config.ts)
   ==========================================================================
   💡 این معادل چیه؟
   توی Nuxt 3 این فایل معادل بخش پلاگین‌ها در `plugins/` و تنظیمات `nuxt.config.ts`
   است.
   در نسخه‌های جدید انگولار (Angular Standalone)، دیگر نیازی به فایل سنگین `app.module.ts`
   نیست؛ به جای آن از توابع مدرن `provideX()` برای معرفی روت‌ها، سرویس HTTP و
   اینترسپتورها استفاده می‌شود.
   ========================================================================== */

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // بهبود عملکرد چنج دیتکشن در انگولار
    provideZoneChangeDetection({ eventCoalescing: true }),

    // معرفی روت‌ها به همراه انیمیشن تغییر صفحه (View Transitions) و بایند خودکار پارامترهای روت
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),

    // معرفی کلاینت HTTP با اینترسپتور احراز هویت (معادل Axios Interceptor یا هوک onRequest در Nuxt)
    provideHttpClient(withInterceptors([authInterceptor])),

    // فعال‌سازی موتور انیمیشن انگولار برای مودال‌ها و تب‌ها
    provideAnimations(),
  ],
};
