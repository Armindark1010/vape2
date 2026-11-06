# مستندات رابط برنامه‌نویسی کاربردی (API Documentation)

بک‌اند مقتدر سامانه با NestJS پیاده‌سازی شده و تمامی روت‌ها روی پورت ۴۰۰۰ اجرا می‌شوند. مستندات زنده Swagger از طریق آدرس `http://localhost:4000/api/docs` در دسترس است.

تمامی روت‌ها از هر دو پیشوند `/api/v1/...` و `/api/...` پشتیبانی می‌کنند.

---

## ۱. احراز هویت (`/api/v1/auth`)

### ورود با نام کاربری/ایمیل و رمز عبور
- **متد:** `POST /api/v1/auth/login-password` یا `POST /api/v1/auth/login`
- **ورودی:**
  ```json
  {
    "usernameOrEmail": "admin@vapelab.ir",
    "password": "Password123!"
  }
  ```
- **خروجی:** توکن JWT، تنظیم خودکار کوکی امن HttpOnly (`vapelab_token`) و آبجکت پروفایل کاربر.

### ثبت‌نام کاربر
- **متد:** `POST /api/v1/auth/register`
- **ورودی:** `{ "name", "email", "phone", "password", "username" }`

### مشخصات کاربر جاری
- **متد:** `GET /api/v1/auth/me`
- **احراز هویت:** اجباری (Bearer یا کوکی `vapelab_token`)

### خروج از حساب
- **متد:** `POST /api/v1/auth/logout`

---

## ۲. رزرو انبار (`/api/v1/cart`)

### ایجاد یا تمدید رزرو ۱۰ دقیقه‌ای انبار
- **متد:** `POST /api/v1/cart/reserve`
- **ورودی:**
  ```json
  {
    "items": [{ "productId": 1, "qty": 2 }],
    "reservationToken": "res_abc123"
  }
  ```
- **خروجی:** `{ "ok": true, "reservationId": "res_...", "expiresAt": "...", "remainingSeconds": 600 }`

### آزادسازی رزرو موقت
- **متد:** `POST /api/v1/cart/release-reservation`

### بررسی وضعیت رزرو
- **متد:** `GET /api/v1/cart/reservation-status?token=res_...`

---

## ۳. سفارش‌ها و پرداخت (`/api/v1/orders`)

### ثبت سفارش خرید (الزام ورود کاربر و رزرو معتبر)
- **متد:** `POST /api/v1/orders` یا `POST /api/checkout`
- **احراز هویت:** اجباری (نقش `CUSTOMER` یا بالاتر)
- **ورودی:**
  ```json
  {
    "items": [{ "productId": 1, "qty": 2, "flavor": "انبه یخی" }],
    "reservationToken": "res_...",
    "paymentMethod": "online",
    "shippingAddress": {
      "line1": "خیابان ولیعصر، پلاک ۱۰",
      "city": "تهران",
      "zip": "1968634567"
    },
    "couponCode": "VAPE10"
  }
  ```
- **خروجی:** جزئیات سفارش ثبت‌شده در وضعیت `pending` به همراه آدرس هدایت به درگاه سندباکس زرین‌پال (`paymentUrl`).

### استعلام فاکتور سفارش با شماره سفارش
- **متد:** `GET /api/v1/orders?number=ORD-...` یا `GET /api/orders?number=ORD-...`
- **خروجی:** اطلاعات کامل سفارش شامل اقلام، وضعیت پرداخت (`paid`، `unpaid`، `failed`)، کد ارجاع بانکی و آدرس پستی.

### رهگیری سفارش با شماره، کد پستی یا موبایل
- **متد:** `GET /api/v1/orders/track?q=...`
- **خروجی:** `{ "ok": true, "order": { ... } }`

### شروع پرداخت
- **متد:** `POST /api/v1/orders/:id/payment/initiate` یا `POST /api/payment/request`
- **خروجی:** آدرس درگاه پرداخت سندباکس زرین‌پال (`https://sandbox.zarinpal.com/pg/StartPay/...`).

### تایید پرداخت و کسر قطعی موجودی (کال‌بک درگاه)
- **متد:** `POST /api/payment/verify` یا `POST /api/v1/payment/verify`
- **ورودی:**
  ```json
  {
    "orderNumber": "ORD-123456",
    "status": "success",
    "refId": "A000000000000000000000000000000g3ewe",
    "gateway": "zarinpal"
  }
  ```
- **رفتار:** استعلام مستقیم از وب‌سرویس REST v4 سندباکس زرین‌پال، اجرای ترنزکشن اتمیک در دیتابیس، تبدیل رزرو به `COMMITTED`، کسر قطعی فیزیکی از موجودی محصول، تغییر وضعیت سفارش به `paid`، صدور `TransactionJournal` و بازگرداندن `redirectUrl` مناسب.

### سفارش‌های مشتری جاری
- **متد:** `GET /api/v1/orders/my-orders`

---

## ۴. پرتال تأمین‌کنندگان (`/api/v1/suppliers`)

### داشبورد اختصاصی تأمین‌کننده
- **متد:** `GET /api/v1/suppliers/portal/dashboard`
- **احراز هویت:** اجباری (`SUPPLIER`)
- **خروجی:** اطلاعات شرکت، نرخ کمیسیون، کالاهای تخصیص‌یافته، سفارش‌ها و تسویه‌حساب‌ها.

### به‌روزرسانی موجودی انبار کالای اختصاصی
- **متد:** `PATCH /api/v1/suppliers/portal/products/:id/stock`
- **احراز هویت:** اجباری (`SUPPLIER` - فقط برای کالای متعلق به خود تأمین‌کننده)
- **ورودی:** `{ "stock": 25 }`

---

## ۵. تسویه‌حساب مالی هفتگی (`/api/v1/settlements`)

### محاسبه و صدور خودکار دسته‌های تسویه هفتگی
- **متد:** `POST /api/v1/settlements/batches/generate`
- **احراز هویت:** اجباری (`ADMIN`)

### تایید پرداخت و ثبت فیش حواله پایا
- **متد:** `POST /api/v1/settlements/batches/:id/approve-payment`
- **احراز هویت:** اجباری (`ADMIN`)
- **ورودی:** `{ "paymentReference": "PAYA-987654" }`

---

## ۶. پنل مدیریت ادمین (`/api/v1/admin`)

- `GET /api/v1/admin/stats`: آمار شاخص‌های کلیدی عملکرد (KPIs)
- `GET /api/v1/admin/orders`: لیست سفارش‌ها به همراه جزئیات خریدار و اقلام
- `PATCH /api/v1/admin/orders`: به‌روزرسانی وضعیت سفارش، کد رهگیری و نام شرکت پستی
- `GET /api/v1/admin/banners`: مشاهده تمام بنرها
- `POST /api/v1/admin/banners`: ایجاد بنر جدید
- `PATCH /api/v1/admin/banners`: ویرایش بنر
- `DELETE /api/v1/admin/banners`: حذف بنر

---

## ۷. مدیریت رسانه و فایل‌های ابری MinIO S3 (`/api/v1/media`)

### آپلود فایل تکی به MinIO S3
- **متد:** `POST /api/v1/media/upload`
- **احراز هویت:** اجباری (`ADMIN`)
- **بدنه درخواستی:** `multipart/form-data` با فیلد `file`
- **محدودیت:** حداکثر ۱۵ مگابایت، فرمت‌های تصویری و مدل‌های ۳بعدی GLB
- **خروجی:** آبجکت رسانه ذخیره‌شده شامل `id`, `filename`, `url`, `size`, `bucket`, `key`

### آپلود گروهی و همزمان فایل‌ها
- **متد:** `POST /api/v1/media/upload-multiple`
- **احراز هویت:** اجباری (`ADMIN`)
- **بدنه درخواستی:** `multipart/form-data` با فیلد `files` (حداکثر ۱۵ فایل همزمان)

### دریافت لیست و فیلتر رسانه‌ها
- **متد:** `GET /api/v1/media`
- **پارامترهای جستجو:** `search`, `type`, `sortBy`, `order`, `page`, `limit`
- **خروجی:** لیست صفحه‌بندی‌شده به همراه آمار کل فایل‌ها و حجم ذخیره‌سازی مصرفی

### حذف تک فایل
- **متد:** `DELETE /api/v1/media/:id`
- **احراز هویت:** اجباری (`ADMIN`)

### حذف گروهی فایل‌ها
- **متد:** `POST /api/v1/media/bulk-delete`
- **احراز هویت:** اجباری (`ADMIN`)
- **ورودی:** `{ "ids": [1, 2, 3] }`

---

## ۸. انواع محصول، ویژگی‌های پویا و تنوع‌ها (`/api/v1/product-types` و `/api/v1/products`)

### دریافت لیست تمام انواع محصول به همراه مشخصات فنی
- **متد:** `GET /api/v1/product-types` یا `GET /api/product-types`
- **خروجی:** آرایه انواع محصول (`ProductType`) شامل صفت‌های هر نوع (`attributes` با فیلدهای `code`, `name`, `type`, `isRequired`, `isVariant`, `options`, `unit`).

### تعریف نوع محصول جدید
- **متد:** `POST /api/v1/product-types`
- **ورودی:** `{ "name": "...", "slug": "...", "description": "...", "icon": "..." }`

### افزودن مشخصه فنی پویا به یک نوع محصول
- **متد:** `POST /api/v1/product-types/:id/attributes`
- **ورودی:** `{ "name": "حجم مخزن", "code": "tank_capacity", "type": "number", "isRequired": false, "isVariant": false, "unit": "ml" }`

### ثبت محصول جدید همراه با مقادیر مشخصات و ماتریس تنوع‌ها
- **متد:** `POST /api/v1/products`
- **ورودی نمونه:**
  ```json
  {
    "name": "پاد اکسلیم پرو اوکسوا",
    "slug": "oxva-xlim-pro",
    "sku": "OXVA-XLIM-PRO",
    "productTypeId": 3,
    "categoryId": 1,
    "brandId": 2,
    "price": 1850000,
    "description": "...",
    "attributeValues": [
      { "attributeCode": "battery_capacity", "value": "1000" },
      { "attributeCode": "max_wattage", "value": "30" }
    ],
    "variants": [
      {
        "title": "مشکی کربن / ۱۰۰۰ میلی‌آمپر",
        "sku": "OXVA-XLIM-BLK",
        "price": 1850000,
        "compareAtPrice": 2100000,
        "stock": 10,
        "combination": { "color": "Black Carbon" },
        "attributeValues": [{ "attributeCode": "color", "value": "Black Carbon" }]
      }
    ]
  }
  ```
- **خروجی:** کالای ثبت‌شده به همراه تمام تنوع‌ها، کد هش یکتا (`combinationHash`) و لاگ گردش اولیه موجودی (`PURCHASE_RECEIPT`).

### تعدیل دستی موجودی انبار تنوع کالا
- **متد:** `POST /api/v1/products/:id/variants/:variantId/stock-adjust`
- **ورودی:**
  ```json
  {
    "newStock": 25,
    "reason": "شارژ محموله ورودی جدید از گمرک"
  }
  ```
- **خروجی:** موجودی به‌روزشده تنوع، همگام‌سازی موجودی کل کالا و ثبت رکورد `MANUAL_ADJUSTMENT` در تاریخچه انبار.

### تاریخچه گردش انبار یک محصول یا تنوع
- **متد:** `GET /api/v1/products/:id/inventory-movements` یا `GET /api/v1/products/variants/:variantId/movements`
- **خروجی:** لیست کامل لاگ‌های `InventoryMovement` شامل مقدار تغییر (`delta`)، موجودی قبل و بعد (`stockBefore`, `stockAfter`)، علت و تاریخ دقیق.
