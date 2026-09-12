# 🌌 مستند جامع وضعیت پروژه ویپورا (Vapora Project State & History)
**تاریخ آخرین به‌روزرسانی:** ۱۲ سپتامبر ۲۰۲۶ (۲۱ شهریور ۱۴۰۵)  
**نسخه پروژه:** ۲.۰.۰ Full-Stack (Nuxt 3 + Angular Admin + NestJS API + Drizzle ORM)

---

## 🧭 ۱. خلاصه معماری و اجزای کلیدی پروژه

پروژه **ویپورا (VAPORA)** یک اکوسیستم کامل فروشگاه تخصصی ویپ، سالت و پاد است که از ۳ بخش اصلی تشکیل شده است:

1. **فروشگاه عمومی (Storefront):**
   - **فریم‌ورک:** Nuxt 3 (Vue 3 Composition API + TypeScript)
   - **مسیر:** `/app`, `/server`, `/public`
   - **پورت اجرا:** `http://localhost:3000`
   - **ویژگی‌ها:** استایل مدرن دارک نئونی، SSR بهینه، موتور سه‌بعدی Google Model-Viewer، سیستم احراز هویت با نام کاربری و پسورد (بدون OTP).

2. **پنل مدیریت اختصاصی ادمین (Admin Panel):**
   - **فریم‌ورک:** Angular 18+ (Standalone Components + Signals + RxJS + Reactive Forms)
   - **مسیر:** `/admin`
   - **پورت اجرا:** `http://localhost:4200`
   - **ویژگی‌ها:** معماری ماژولار (`/core`, `/features`, `/shared`, `/layout`)، سرچ زنده با عملگرهای RxJS (`debounceTime`, `distinctUntilChanged`, `switchMap`)، گارد مسیرها بر اساس نقش (`full-admin` در برابر `operator`)، اینترسپتور سراسری توکن و خطای ۴۰۱، کامنت‌های آموزشی خط‌به‌خط ویژه توسعه‌دهندگان Vue/Nuxt.

3. **بک‌اند مجزا و مستندات API (Backend API):**
   - **فریم‌ورک:** NestJS + Drizzle ORM / Prisma
   - **مسیر:** `/backend`
   - **پورت اجرا:** `http://localhost:4000` (مستندات سوآگر در `http://localhost:4000/api/docs`)

---

## 🛠️ ۲. لیست تغییرات و قابلیت‌های پیاده‌سازی شده در این سشن

### ۱. سیستم احراز هویت واقعی با Username/Password (حذف کاربر دمو)
- **حذف کامل `DEMO_USER`:** کاربر فیک از صفحه چک‌اوت، هدر و حساب کاربری حذف شد.
- **ثبت‌نام و ورود بدون OTP:** فرم‌ها فقط نام کاربری، ایمیل/تلفن و رمز عبور می‌گیرند (هیچ کد پیامکی پرسیده نمی‌شود).
- **مودال ورود هوشمند با قابلیت Resume Action ([AuthModal.vue](file:///d:/program/vape2/app/components/vapor/AuthModal.vue)):**
  - اگر کاربر مهمان روی **دکمه لایک (❤️)** یا **افزودن به سبد (+)** کلیک کند، مودال لاگین باز می‌شود.
  - پس از ورود یا ثبت‌نام، همان عملیات (لایک یا افزودن به سبد) بلافاصله خودکار اجرا می‌شود!
- **پایداری داده‌ها (Persistence):** توکن و اطلاعات کاربر در `localStorage` و سرور مدیریت می‌شود.

### ۲. نمایش و اسکن سه‌بعدی محصولات با موتور گوگل (Google Model-Viewer)
- **پیکربندی اسکریپت رسمی CDN گوگل** در `nuxt.config.ts` به همراه `vue.compilerOptions.isCustomElement`.
- **کامپوننت نمایشگر سه‌بعدی ([Product3DViewer.vue](file:///d:/program/vape2/app/components/vapor/Product3DViewer.vue)):**
  - نورپردازی استودیویی PBR با HDRI نچرال (`environment-image="neutral"`).
  - سایه‌های طبیعی، کنترل چرخش ۳۶۰ درجه و حالت واقعیت افزوده (AR برای iOS Quick Look و Android Scene Viewer).
  - پشتیبانی از درگ و دراپ فایل‌های سه‌بعدی `.glb` و `.gltf` (خروجی اسکنرهای موبایل مثل Scaniverse و Polycam).
- **صفحه استودیو اسکن:** در دسترس در مسیر `http://localhost:3000/studio/scan`.

### ۳. ساخت کامل پنل ادمین انگولار ([/admin](file:///d:/program/vape2/admin))
- **معماری Standalone بدون نیاز به NgModule:** استفاده از توابع نوین `provideRouter`, `provideHttpClient(withInterceptors([authInterceptor]))`.
- **طراحی UI/UX Pro Max و ریسپانسیو فوق‌پیشرفته:**
  - **چارت تعاملی پیشرفته با فیلترهای چندگانه ([AnalyticsChartComponent](file:///d:/program/vape2/admin/src/app/shared/components/analytics-chart/analytics-chart.component.ts)):**
    - سوئیچ بین ۴ معیار کلیدی: 💰 **درآمد و فروش** | 👁️ **بازدیدها** | 🛒❌ **بازدیدهای بدون خرید (کالاهای دیده شده و سبدهای رها شده)** | 🎯 **نرخ تبدیل (%)**.
    - سوئیچ بازه زمانی: ۷ روز گذشته و ۳۰ روز گذشته.
    - خلاصه قیف فروش (Conversion Funnel): بازدید محصول ➔ افزودن به سبد ➔ پرداخت موفق ➔ درصد انصراف قبل از خرید.
    - نمودار ستونی واکنشی SVG با قابلیت Hover و تولتیپ‌های تحلیلی.
  - **داشبورد تحلیلی هوش تجاری (BI Dashboard):**
    - ۴ شاخص کلیدی مالی و عملیاتی (KPIs: درآمد کل، فروش امروز، میانگین فاکتور AOV، سفارشات معلق، بحران انبار).
    - سهم فروش دسته‌بندی‌ها (Category Distribution) با نوارهای پیشرفت نئونی.
    - **پرفروش‌ترین و پرطرفدارترین محصولات (Best Sellers 🔥)** با رتبه‌بندی #1 تا #4، حجم فروش و روند تقاضا.
    - **محصولات راکد و رو دست مانده در انبار (Dead Stock ❄️)** با نمایش سرمایه قفل شده، روزهای بدون فروش و دکمه‌های اقدام تخفیف پیشنهادی.
    - **هشدارهای فوری شارژ انبار (Urgent Restock ⚡)** برای کالاهای در حال اتمام با اعلام زمان تحویل تأمین‌کننده.
  - **تجربه کاربری موبایل (Mobile UX):**
    - دراور سایدبار شناور (Off-canvas Drawer) با افکت بلور پس‌زمینه (Backdrop Blur).
    - نوار ناوبری پایین صفحه اختصاصی موبایل ([MobileNavComponent](file:///d:/program/vape2/admin/src/app/layout/mobile-nav/mobile-nav.component.ts)) با تب‌های لمسی و سوئیچ سریع.
    - نمایش کارتی هوشمند سفارشات و محصولات در موبایل به جای جداول عریض افقی.
- **سرچ زنده جریانی با RxJS (`product-list.component.ts`):**
  - `debounceTime(300)` + `distinctUntilChanged()` + `switchMap()`.
- **فرم‌های واکنشی (`ProductFormComponent`):**
  - با `FormGroup` و `Validators` برای ایجاد و ویرایش محصولات.
- **مدیریت سفارشات (`OrderListComponent`):**
  - فیلتر وضعیت، مودال بررسی فاکتور و تغییر وضعیت لحظه‌ای.

---

## 🧠 ۳. راهنمای تطبیق مفاهیم Angular با Nuxt / Vue (Vue Developer Cheat-Sheet)

| مفهوم در Angular | معادل در Vue / Nuxt 3 | عملکرد و تفاوت |
| :--- | :--- | :--- |
| **`@Injectable()` / Services** | `composables/useX.ts` | تزریق وابستگی سازمانی یکتا (Singleton). |
| **`signal()` / `computed()`** | `ref()` / `computed()` | مدیریت استیت محلی واکنشی و اتمیک بدون وابستگی به Zone.js. |
| **`Observable` + `HttpClient`** | `useFetch()` / `$fetch` با Promise | مدیریت جریانی درخواست‌های شبکه با امکان Cancel و Retry. |
| **`CanActivateFn` (Guards)** | `middleware/auth.ts` | گارد محافظتی که قبل از دانلود فایل‌های Lazy صفحه اجرا می‌شود. |
| **`HttpInterceptorFn`** | هوک `onRequest` در `useFetch` | تزریق خودکار هدر Bearer Token و هندل خطای ۴۰۱ در سطح کل اپ. |
| **`Reactive Forms` (`FormGroup`)** | VeeValidate / FormKit | اعتبارسنجی مستقل از قالب و مستقیم در تایپ‌اسکریپت. |
| **`TomanPipe` (`@Pipe`)** | فیلترها یا تابع `money()` در Vue | تبدیل و کش کردن فرمت قیمت در تمپلیت با سینتکس `{{ price \| toman }}`. |
| **`<router-outlet>`** | `<slot />` / `<NuxtPage />` | محل رندر صفحات فرزند درون لایوت. |

---

## 🚀 ۴. دستورات راه‌اندازی سریع در هر سیستم جدید

```bash
# ==========================================
# ۱. اجرای فروشگاه اصلی (Nuxt 3)
# ==========================================
yarn install
yarn dev --host 0.0.0.0
# در دسترس در: http://localhost:3000

# ==========================================
# ۲. اجرای پنل ادمین (Angular)
# ==========================================
cd admin
npm install
npm start
# سرور روی 0.0.0.0 اجرا می‌شود: http://localhost:4200 (یا آی‌پی شبکه شما)

# ==========================================
# ۳. اجرای بک‌اند مجزا (اختیاری)
# ==========================================
cd backend
npm install
npm run start:dev
# در دسترس در: http://localhost:4000
```
