/* ==========================================================================
   📌 گارد محافظت از روت‌ها (Route Guards - auth.guard.ts)
   ==========================================================================
   💡 این معادل چیه؟
   توی Nuxt 3 این مفهوم دقیقاً معادل Middleware روت‌هاست (`middleware/auth.ts`):
     export default defineNuxtRouteMiddleware((to, from) => {
       const { isLoggedIn } = useAuth();
       if (!isLoggedIn.value) return navigateTo('/auth/login');
     });

   در Angular:
   گاردها به صورت تابع‌های سبک (`CanActivateFn`) نوشته می‌شوند و به آرایه
   `canActivate: [authGuard]` در تنظیمات روت اختصاص داده می‌شوند.
   مزیت انگولار: گارد می‌تواند قبل از دانلود شدن حتی ۱ بایت از فایل‌های روتِ
   Lazy Load شده، دسترسی را بسنجد و جلوی دانلود بی‌مورد باندل را بگیرد!
   ========================================================================== */

import { inject } from '@angular/core';
import { Router, type CanActivateFn, type ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * گارد احراز هویت عمومی ادمین:
 * اگر کاربر لاگین نباشد، به صفحه /auth/login ریدایرکت می‌شود.
 */
export const authGuard: CanActivateFn = (route, state) => {
  // 💡 inject() معادل `const auth = useAuth()` در Vue Composition API است
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true; // دسترسی مجاز است
  }

  // ذخیره آدرس فعلی به عنوان query param برای برگشت بعد از لاگین
  router.navigate(['/auth/login'], {
    queryParams: { returnUrl: state.url },
  });
  return false;
};

/**
 * گارد دسترسی بر اساس نقش (Role-Based Access Guard):
 * برای بخش‌هایی مثل تنظیمات سیستم یا حذف محصولات که فقط مدیر ارشد مجاز است.
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRole = route.data['role']; // نقش مورد نیاز تعریف شده در روت

  if (!requiredRole || authService.hasRole(requiredRole)) {
    return true;
  }

  // اگر نقش کافی نداشت، به داشبورد برمی‌گردد
  alert('⚠️ شما دسترسی لازم برای ورود به این بخش را ندارید (نیازمند سطح مدیر ارشد).');
  router.navigate(['/dashboard']);
  return false;
};
