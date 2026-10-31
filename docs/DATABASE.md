# 🗄️ مستند پایگاه داده ویپ‌لب (VAPELAB Database Specification)

این مستند تشریح‌کننده ساختار پایگاه‌داده، مدل‌ها، روابط (Relationships) و استراتژی دوگانه Drizzle ORM و Prisma در پروژه ویپ‌لب است.

---

## ۱. پایگاه داده اصلی (PostgreSQL)
پروژه از دیتابیس رابطه‌ای **PostgreSQL** به عنوان ذخیره‌ساز اصلی استفاده می‌کند.
- **ارتباط در Nuxt Server:** کتابخانه `drizzle-orm` و درایور استاندارد `pg`.
- **ارتباط در NestJS Backend:** کتابخانه `@prisma/client`.

---

## ۲. جداول و مدل‌های Drizzle ORM (`/server/db/schema.ts`)

### ۲.۱. جدول کاربران (`users`)
ذخیره اطلاعات خریداران و مدیران سیستم:
| نام ستون | نوع داده | کلید / محدودیت | توضیحات |
| :--- | :--- | :--- | :--- |
| `id` | `serial` | Primary Key | شناسه عددی یکتا |
| `name` | `text` | NOT NULL | نام و نام‌خانوادگی |
| `email` | `text` | NOT NULL, UNIQUE | ایمیل کاربر برای احراز هویت |
| `phone` | `text` | NULL | شماره همراه جهت هماهنگی پیک |
| `is_admin` | `boolean` | DEFAULT `false` | دسترسی ادمین فروشگاه |
| `created_at` | `timestamp` | DEFAULT `now()` | زمان ثبت‌نام |

### ۲.۲. جدول برندها (`brands`)
برندهای معتبر تولیدکننده ویپ و سالت (مانند Vaporesso, GeekVape, Nasty):
| نام ستون | نوع داده | کلید / محدودیت | توضیحات |
| :--- | :--- | :--- | :--- |
| `id` | `serial` | Primary Key | شناسه برند |
| `name` | `text` | NOT NULL, UNIQUE | نام رسمی برند |
| `slug` | `text` | NOT NULL, UNIQUE | اسلاگ خوانا برای آدرس URL |
| `description` | `text` | NULL | توضیحات تاریخچه برند |

### ۲.۳. جدول دسته‌بندی‌ها (`categories`)
دسته‌بندی‌های اصلی (پاد یکبارمصرف، سالت نیکوتین، پادسیستم، جویس):
| نام ستون | نوع داده | کلید / محدودیت | توضیحات |
| :--- | :--- | :--- | :--- |
| `id` | `serial` | Primary Key | شناسه دسته‌بندی |
| `name` | `text` | NOT NULL, UNIQUE | نام دسته‌بندی |
| `slug` | `text` | NOT NULL, UNIQUE | اسلاگ مسیر |
| `description` | `text` | NULL | توضیحات سئو |
| `image` | `text` | NULL | آیکون یا تصویر بنر |
| `featured` | `boolean` | DEFAULT `true` | نمایش در اسلایدر صفحه نخست |

### ۲.۴. جدول محصولات (`products`)
هسته مرکزی فروشگاه شامل مشخصات فنی و موجودی:
| نام ستون | نوع داده | کلید / محدودیت | توضیحات |
| :--- | :--- | :--- | :--- |
| `id` | `serial` | Primary Key | شناسه کالا |
| `slug` | `text` | NOT NULL, UNIQUE | نام مستعار URL |
| `name` | `text` | NOT NULL | نام تجاری محصول |
| `tagline` | `text` | NULL | شعار یا توصیف کوتاه طعم |
| `description` | `text` | NOT NULL | توضیحات مفصل و راهنمای مصرف |
| `specs` | `jsonb` | NULL | مشخصات فنی (ظرفیت باتری، نوع کویل، مقاومت) |
| `price` | `integer` | NOT NULL | قیمت اصلی به تومان |
| `discount_price` | `integer` | NULL | قیمت با تخفیف شگفت‌انگیز |
| `rating` | `integer` | DEFAULT `0` | امتیاز اعشاری ضرب در ۱۰ (مثلاً ۴۸ معادل ۴.۸) |
| `review_count` | `integer` | DEFAULT `0` | تعداد نظرات ثبت‌شده |
| `stock` | `integer` | DEFAULT `0` | موجودی فیزیکی آماده ارسال در انبار |
| `brand_id` | `integer` | Foreign Key ➔ `brands.id` | برند مربوطه |
| `category_id` | `integer` | Foreign Key ➔ `categories.id` | دسته‌بندی محصول |
| `images` | `jsonb` | Array of URLs | گالری تصاویر محصول |
| `featured` | `boolean` | DEFAULT `false` | نمایش در محصولات ویژه |
| `new_arrival` | `boolean` | DEFAULT `false` | برچسب کالای جدید |
| `best_seller` | `boolean` | DEFAULT `false` | برچسب پرفروش‌ترین‌ها |
| `created_at` | `timestamp` | DEFAULT `now()` | تاریخ درج محصول |

### ۲.۵. جدول سفارشات (`orders`) و اقلام (`order_items`)
- **انام وضعیت سفارش (`order_status`):**
  - `pending`: در انتظار پرداخت یا تایید
  - `processing`: در حال پردازش در انبار و بسته‌بندی
  - `shipped`: تحویل پیک یا شرکت پست
  - `delivered`: تحویل شده به مشتری
  - `refunded`: مرجوع یا بازگشت وجه
- **فیلدهای جدول `orders`:** `id`, `number` (کد یکتا فاکتور), `user_id`, `name`, `email`, `phone`, `shipping` (آدرس کامل به صورت JSONB), `coupon_code`, `subtotal`, `discount`, `shipping_fee`, `total`, `status`, `created_at`.
- **فیلدهای جدول `order_items`:** `id`, `order_id` (FK), `product_id` (FK), `name`, `image`, `price`, `qty`.

### ۲.۶. جداول مکمل
- **`reviews`:** نظرات و نقدهای خریداران با امتیاز ۱ تا ۵.
- **`wishlist`:** نشان‌شده‌ها و علاقه‌مندی‌های کاربران لاگین‌شده.
- **`coupons`:** کدهای تخفیف درصدی و ریالی با تاریخ انقضا و حداقل خرید.
- **`subscribers`:** ایمیل‌های ثبت‌نامی خبرنامه تخفیف‌ها.

---

## ۳. مدل‌های Prisma در بک‌اند (`/backend/prisma/schema.prisma`)
مدل‌های پریزما برای سرویس‌های مستقل بک‌اند طراحی شده و شامل موارد تخصصی زیر است:
- **`User`:** دارای فیلدهای `role` (انام `CUSTOMER`, `OPERATOR`, `ADMIN`) و فیلد رمزنگاری شده `passwordHash`.
- **`ProductAlert`:** جدول ذخیره‌سازی درخواست‌های «موجود شد خبرم کن» با فیلدهای شماره تماس، شناسه کالا و وضعیت اطلاع‌رسانی (`AlertStatus`).
- **`Cart` و `CartItem`:** ذخیره‌سازی سبد خرید ابری کاربران بین دستگاه‌های مختلف با مشخصات انتخابی طعم (`flavor`) و نیکوتین (`nicotine`).

---

## ۴. لایه داده‌های فال‌بک (Offline Fallback Resilience)
- **فایل:** `/server/db/fallbackData.ts`
- **هدف:** تضمین پایداری فروشگاه و جلوگیری از بروز خطای ۵۰۰ در محیط‌های دولوپمنت یا شرایط قطعی موقت اتصال پایگاه‌داده.
- **مکانیزم عملکرد:** در صورت عدم موفقیت کوئری‌ها در `server/db/queries.ts`، سیستم به صورت هوشمند و بدون اختلال در تجربه کاربر، داده‌های معتبر و ساختاریافته محلی را برمی‌گرداند.
