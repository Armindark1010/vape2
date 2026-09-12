# 🅰️ پنل ادمین انگولار فروشگاه ویپورا (Angular Standalone Admin Panel)

این پروژه یک پنل مدیریت کامل و ماژولار است که با آخرین نسخه استانداردهای **Angular (Standalone Architecture)**، **Reactive Forms**، **RxJS Streams** و **Signals** برای فروشگاه ویپ و سالت ویپورا ساخته شده است.

> 🎓 **ویژه توسعه‌دهندگان Vue / Nuxt 3:**
> تمام فایل‌های این پروژه برای آموزش گام‌به‌گام و مقایسه دقیق معماری Angular با Vue/Nuxt کامنت‌گذاری آموزشی شده‌اند.

---

## 🚀 دستورات اجرا و راه‌اندازی

```bash
# ۱. رفتن به پوشه ادمین
cd admin

# ۲. نصب پکیج‌ها
npm install
# یا
yarn install

# ۳. اجرای سرور توسعه روی پورت ۴۲۰۰
npm start
# یا
ng serve --port 4200
```
سپس در مرورگر به آدرس `http://localhost:4200` مراجعه کنید.

---

## 🧠 راهنمای تطبیق مفاهیم Angular با Nuxt / Vue (Cheat Sheet)

| بخش پروژه | مفهوم در Angular | معادل در Vue / Nuxt 3 | تفاوت و چرایی در Angular |
| :--- | :--- | :--- | :--- |
| **احراز هویت** | `AuthService` با `signal()` و `computed()` | `composables/useAuth.ts` با `ref()` و `computed()` | در انگولار سرویس با `@Injectable` تعریف می‌شود تا Dependency Injection یکتایی آن را تضمین کند. |
| **محافظت از صفحات** | `authGuard` (`CanActivateFn`) | `middleware/auth.ts` (`defineNuxtRouteMiddleware`) | گاردها قبل از اینکه فایل‌های صفحه Lazy Download شوند، دسترسی را بررسی می‌کنند. |
| **مدیریت ریکوئست‌ها** | `authInterceptor` (`HttpInterceptorFn`) | هوک `onRequest` در `useFetch` یا Axios Interceptor | تمام درخواست‌های خروجی هدر `Authorization: Bearer` می‌گیرند و خطای ۴۰۱ خودکار مدیریت می‌شود. |
| **جستجوی زنده (Live Search)** | RxJS: `debounceTime`, `distinctUntilChanged`, `switchMap` | `watch(query, debounce(...))` با Vue Use | با `switchMap`، در صورت تایپ کلمه جدید، ریکوئست قبلی در شبکه **Cancel** می‌شود تا از خطای تداخل پاسخ‌ها (Race Condition) جلوگیری شود. |
| **فرم‌ها و اعتبارسنجی** | `Reactive Forms` (`FormGroup`, `FormControl`, `Validators`) | VeeValidate / FormKit | ولیدیشن‌ها مستقیماً در TypeScript نوشته می‌شوند و به DOM وابسته نیستند. |
| **فرمت‌کننده‌ها** | `TomanPipe` (`@Pipe`) | فیلترها / توابع `money()` در Vue | با علامت `| toman` در تمپلیت صدا زده می‌شود و عملکرد آن کش می‌شود. |
| **رویدادها و ورودی‌ها** | `@Input()` و `@Output() EventEmitter` | `defineProps()` و `defineEmits()` | ارتباط کامپوننت فرزند و والد به صورت استاندارد. |

---

## 📂 ساختار ماژولار پروژه

```text
admin/src/app/
├── core/                         # هسته مرکزی و مستقل
│   ├── models/                   # اینترفیس‌ها و تایپ‌ها (User, Product, Order, Stats)
│   ├── services/                 # سرویس‌های AuthService, ProductService, OrderService
│   ├── guards/                   # گاردهای authGuard و roleGuard
│   └── interceptors/             # اینترسپتور auth.interceptor.ts
├── layout/                       # ساختار قالب و لایوت
│   ├── admin-layout.component.ts # لایوت اصلی با <router-outlet>
│   ├── sidebar/                  # منوی سایدبار تاشو و راست‌چین
│   └── header/                   # هدر بالا با تله‌متری زنده و نشانگر نقش
├── features/                     # ماژول‌های بیزینس و صفحات
│   ├── auth/login/               # صفحه ورود ادمین با انتخاب نقش
│   ├── dashboard/                # داشبورد شاخص‌های کلیدی عملکرد (KPIs)
│   ├── products/                 # لیست محصولات با سرچ زنده و فرم CRUD
│   └── orders/                   # مدیریت سفارشات و تغییر وضعیت
└── shared/                       # کامپوننت‌ها و ابزارهای مشترک
    ├── components/status-badge/  # بج وضعیت انبار و سفارش
    └── pipes/toman.pipe.ts       # پایپ فرمت قیمت به تومان
```
