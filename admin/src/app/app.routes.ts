/* ==========================================================================
   📌 تنظیمات و جدول روت‌های انگولار (Application Routes - app.routes.ts)
   ==========================================================================
   💡 این معادل چیه؟
   توی Nuxt 3 روتینگ به صورت خودکار از روی ساختار پوشه `pages/` ساخته می‌شد
   (File-based Routing).
   
   در Angular:
   ما جدول روت‌ها را به صورت صریح و ساختاریافته (Explicit Routes) تعریف می‌کنیم.
   مزیت‌های کلیدی:
   1. **Lazy Loading خودکار**: با دستور `loadComponent: () => import(...)`،
      کدهای هر صفحه فقط زمانی که کاربر واقعاً به آن صفحه مراجعه کند دانلود می‌شوند!
   2. **اعمال گاردها (`canActivate`)**: قبل از لود شدن صفحه، گارد `authGuard`
      بررسی می‌کند آیا کاربر لاگین است یا خیر.
   ========================================================================== */

import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // 1️⃣ روت‌های عمومی و احراز هویت (بدون نیاز به لاگین)
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
    title: 'ورود به پنل مدیریت ویپورا',
  },

  // 2️⃣ روت‌های محافظت‌شده داخل لایوت اصلی ادمین (نیازمند گارد authGuard)
  {
    path: '',
    loadComponent: () =>
      import('./layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    canActivate: [authGuard], // 🛡️ محافظت با گارد احراز هویت
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        title: 'داشبورد مدیریت | ویپورا',
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/product-list/product-list.component').then(
            (m) => m.ProductListComponent
          ),
        title: 'مدیریت محصولات | ویپورا',
      },
      {
        path: 'products/new',
        loadComponent: () =>
          import('./features/products/product-form/product-form.component').then(
            (m) => m.ProductFormComponent
          ),
        title: 'افزودن محصول جدید | ویپورا',
      },
      {
        path: 'products/edit/:id',
        loadComponent: () =>
          import('./features/products/product-form/product-form.component').then(
            (m) => m.ProductFormComponent
          ),
        title: 'ویرایش محصول | ویپورا',
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/orders/order-list/order-list.component').then(
            (m) => m.OrderListComponent
          ),
        title: 'مدیریت سفارشات | ویپورا',
      },
      {
        path: 'banners',
        loadComponent: () =>
          import('./features/banners/banner-list/banner-list.component').then(
            (m) => m.BannerListComponent
          ),
        title: 'مدیریت بنرها و اسلایدر | ویپورا',
      },

      {
        path: 'settings',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        canActivate: [roleGuard],
        data: { role: 'full-admin' }, // فقط مدیر کل دسترسی دارد
        title: 'تنظیمات سیستم | ویپورا',
      },
    ],
  },

  // 3️⃣ هدایت روت‌های نامعتبر به داشبورد
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
