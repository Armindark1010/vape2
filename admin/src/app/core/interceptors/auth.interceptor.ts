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

  // 1️⃣ اگر توکن وجود داشته باشد، درخواست را Clone کرده و هدر Authorization اضافه می‌کنیم
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'X-Requested-With': 'VaporaAdmin-Angular',
      },
    });
  }

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
