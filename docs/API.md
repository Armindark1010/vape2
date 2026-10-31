# 📡 مستند کامل APIها (VAPELAB API Specification)

این سند قراردادهای فنی (Contracts) تمامی اندپوینت‌های فعال در سیستم را تشریح می‌کند.

---

## ۱. احراز هویت (Authentication APIs)

### ۱.۱. ورود با نام کاربری/ایمیل و رمز عبور
* **مسیر:** `POST /api/auth/login` یا `POST /api/v1/auth/login-password`
* **دسترسی:** عمومی (Public)
* **بدنه درخواست (Request Body):**
```json
{
  "username": "armin_vape",
  "password": "SecurePassword123"
}
```
* **پاسخ موفق (Response 200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "آرمین",
    "email": "user@vapelab.ir",
    "isAdmin": true
  }
}
```
* **خطاها (400 / 401):** `{ "error": "نام کاربری یا رمز عبور اشتباه است" }`

### ۱.۲. ثبت‌نام کاربر جدید
* **مسیر:** `POST /api/auth/register` یا `POST /api/v1/auth/register`
* **دسترسی:** عمومی
* **بدنه درخواست:**
```json
{
  "name": "کاربر جدید",
  "email": "new@vapelab.ir",
  "password": "SecurePassword123",
  "phone": "09120000000"
}
```
* **پاسخ موفق (Response 201):** بازگرداندن سشن و توکن معتبر.

### ۱.۳. اطلاعات پروفایل جاری
* **مسیر:** `GET /api/v1/auth/me`
* **هدر:** `Authorization: Bearer <token>`
* **پاسخ (200):** مشخصات کاربری و نقش‌ها.

---

## ۲. کاتالوگ و محصولات (Products & Catalog APIs)

### ۲.۱. لیست محصولات با فیلتر پیشرفته
* **مسیر:** `GET /api/products`
* **پارامترهای جستجو (Query Parameters):**
  * `cat`: شناسه یا اسلاگ دسته‌بندی
  * `brand`: شناسه یا اسلاگ برند
  * `featured`: فقط کالاهای ویژه (`true/false`)
  * `best`: پرفروش‌ترین‌ها (`true/false`)
  * `new`: جدیدترین کالاها (`true/false`)
  * `sort`: مرتب‌سازی (`price-asc`, `price-desc`, `newest`, `popular`)
  * `limit`: تعداد در هر صفحه (پیش‌فرض ۲۰)
* **پاسخ موفق (200):** آرایه‌ای از آبجکت‌های محصول با فیلدهای کامل مشخصات، قیمت، گالری و موجودی.

### ۲.۲. جستجوی زنده (Live Search)
* **مسیر:** `GET /api/search?q=Vaporesso`
* **پاسخ (200):** لیست فشرده نتایج برای اینپوت جستجوی هدر.

### ۲.۳. دسته‌بندی‌ها و برندها
* **مسیر:** `GET /api/categories` و `GET /api/brands`
* **پاسخ (200):** لیست نام‌ها، اسلاگ‌ها و عکس‌های شاخص.

### ۲.۴. هشدار شارژ موجودی (Restock Alert)
* **مسیر:** `POST /api/v1/products/:id/notify-me`
* **بدنه درخواست:**
```json
{
  "phone": "09121234567",
  "email": "notify@example.com"
}
```

---

## ۳. سبد خرید و رزرو موجودی (Cart & Reservation APIs)

### ۳.۱. رزرو موقت موجودی انبار (۱۰ دقیقه)
* **مسیر:** `POST /api/v1/cart/reserve`
* **هدف:** جلوگیری از فروش همزمان یک کالا به چند نفر (Anti-Overselling).
* **بدنه درخواست:**
```json
{
  "cartToken": "cart_uuid_12345",
  "items": [
    { "productId": 4, "qty": 2 }
  ]
}
```
* **پاسخ موفق (200):**
```json
{
  "success": true,
  "reservationToken": "res_987654321",
  "expiresAt": "2026-10-31T12:20:00.000Z",
  "remainingSeconds": 600
}
```

### ۳.۲. لغو رزرو موقت موجودی
* **مسیر:** `POST /api/v1/cart/release-reservation`
* **بدنه درخواست:** `{ "reservationToken": "res_987654321" }`

---

## ۴. تسویه‌حساب و سفارشات (Checkout & Orders)

### ۴.۱. ایجاد سفارش نهایی
* **مسیر:** `POST /api/checkout`
* **دسترسی:** عمومی یا با هدر احراز هویت
* **بدنه درخواست:**
```json
{
  "name": "آرمین صادقی",
  "email": "order@vapelab.ir",
  "phone": "09123456789",
  "shipping": {
    "line1": "تهران، خیابان ولیعصر، پلاک ۱۰۰",
    "city": "تهران",
    "zip": "1999999999",
    "country": "ایران"
  },
  "items": [
    { "id": 1, "name": "پاد کالیبرن جی ۳", "price": 1850000, "qty": 1 }
  ],
  "couponCode": "VAPE10"
}
```
* **پاسخ موفق (200):**
```json
{
  "success": true,
  "orderNumber": "VAPE-1730364000-842",
  "total": 1665000,
  "status": "pending"
}
```

### ۴.۲. بررسی کد تخفیف
* **مسیر:** `GET /api/coupon?code=WELCOME`
* **پاسخ (200):** درصد تخفیف، سقف تخفیف و معتبر بودن کوپن.

---

## ۵. دستیار هوش مصنوعی ویپ (AI Assistant & Sommelier)

### ۵.۱. چت و کوییز انتخاب ویپ
* **مسیر:** `POST /api/ai/chat`
* **بدنه درخواست کوییز:**
```json
{
  "wizard": {
    "goal": "smoke",
    "taste": "tobacco",
    "cooling": 1,
    "nicotine": 50
  }
}
```
* **بدنه درخواست چت آزاد:**
```json
{
  "message": "بهترین سالت نیکوتین خنک میوه‌ای برای پاد اکسلیم چیه؟",
  "history": []
}
```
* **پاسخ (200):** متن مشاوره شخصی‌سازی شده به همراه لیست دقیق کارت محصولات پیشنهادی و امتیاز تطابق (Match Score).

---

## ۶. اندپوینت‌های پنل مدیریت ادمین (Admin APIs)

### ۶.۱. شاخص‌های تحلیلی و هوش تجاری
* **مسیر:** `GET /api/admin/stats`
* **پاسخ (200):**
  * آمار کل فروش و مقایسه با هفته قبل
  * میانگین رقم سبد خرید (AOV)
  * کالاهای خواب انبار (Dead Stock) و سرمایه قفل‌شده
  * شاخص‌های قیف فروش (Funnel) برای چارت SVG

### ۶.۲. مدیریت سفارشات در ادمین
* **مسیرها:**
  * `GET /api/admin/orders`: دریافت لیست فاکتورها با فیلتر وضعیت.
  * `PATCH /api/admin/orders`: تغییر وضعیت سفارش (مثلاً از `pending` به `shipped`).

### ۶.۳. مدیریت محصولات در ادمین
* **مسیر:** `POST /api/admin/products`
* **هدف:** ثبت محصول جدید یا ویرایش اطلاعات و موجودی انبار کالا.
