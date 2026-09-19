/* ==========================================================================
   📌 اینترسپتور سراسری HTTP (Auth Interceptor - auth.interceptor.ts)
   ==========================================================================
   💡 این معادل چیه؟
   توی Nuxt 3 این کار را با گزینه‌های `onRequest` و `onResponseError` در `useFetch`
   یا با ساخت یک اینستنس سفارشی از `$fetch.create()` یا Axios Interceptor انجام می‌دادیم:
     const customFetch = $fetch.create({
       onRequest({ options }) {
         options.headers.set('Authorization', `Bearer ${token}`);
       },
       onResponseError({ response }) {
         if (response.status === 401) navigateTo('/login');
       }
     });

   در Angular:
   اینترسپتورها به صورت یک پایپ‌لاین مرکزی (`HttpInterceptorFn`) کار می‌کنند.
   هر درخواستی که از طریق `HttpClient` ارسال شود، قبل از خروج از مرورگر از این تابع
   رد می‌شود و در مسیر بازگشت پاسخ هم از بلوک `catchError` عبور می‌کند.
   ========================================================================== */

import { inject } from '@angular/core';
import { type HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // 1️⃣ بررسی آدرس پایه API (از localStorage یا پورت ۴۲۰۰ به ۳۰۰۱)
  let finalUrl = req.url;
  if (typeof window !== 'undefined' && finalUrl.startsWith('/api')) {
    const customBase = localStorage.getItem('vapelab_api_base_url') || localStorage.getItem('vapora_api_base_url');
    if (customBase && customBase.trim()) {
      finalUrl = `${customBase.trim().replace(/\/+$/, '')}${finalUrl}`;
    } else if (window.location.port === '4200') {
      finalUrl = `https://${window.location.hostname}:3001${finalUrl}`;
    }
  }

  // 2️⃣ تنظیم هدرها و توکن در صورت وجود
  const headers: Record<string, string> = {
    'X-Requested-With': 'VaporaAdmin-Angular',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const authReq = req.clone({
    url: finalUrl,
    setHeaders: headers,
  });

  // 2️⃣ ارسال درخواست به مرحله بعد و گوش دادن به خطاهای احتمالی در پاسخ
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // اگر خطای ۴۰۱ (عدم احراز هویت / منقضی شدن توکن) دریافت شد:
      if (error.status === 401) {
        console.warn('🔒 خطای ۴۰۱: سشن ادمین منقضی شده است. خروج خودکار...');
        authService.logout();
      }

      // لاگ کردن خطای شبکه برای دیباگ سریع‌تر
      console.error(`❌ خطای سرور در مسیر ${req.url} (کد ${error.status}):`, error.message);

      return throwError(() => error);
    })
  );
};
