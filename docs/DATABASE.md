# مستندات پایگاه داده ویپ‌لب (Database Documentation)

این سند توصیف‌کننده ساختار پایگاه داده رابطه‌ای PostgreSQL و مدل‌های اورام Prisma در سامانه ویپ‌لب است.

---

## ۱. مشخصات عمومی

- **موتور دیتابیس:** PostgreSQL 16
- **ابزار ORM:** Prisma Client 6.19.3
- **واحد پول ذخیره‌شده:** تومان ایران (بدون ممیز، عدد صحیح `Int`)
- **کلیدهای اصلی:** شناسه عدد صحیح خودافزاینده (`Int @id @default(autoincrement())`)

---

## ۲. مدل‌های اصلی سامانه

### ۲.۱ کاربران (`User`)
- `id`: شناسه کاربر
- `username`: نام کاربری یکتا
- `email`: ایمیل کاربر (یکتا)
- `phone`: شماره موبایل
- `passwordHash`: هش امن رمز عبور تولید شده با `bcryptjs`
- `role`: نقش کاربر (`CUSTOMER`, `ADMIN`, `SUPPLIER`)
- `isAdmin`: پرچم دسترسی سیستمی

### ۲.۲ تأمین‌کنندگان (`Supplier`)
- `id`: شناسه تأمین‌کننده
- `userId`: شناسه کاربر متصل (یکتا)
- `companyName`: نام رسمی تأمین‌کننده
- `contactPerson`: شخص رابط
- `phone`: تلفن تماس
- `shebaNumber`: شماره شبا (IBAN) جهت پرداخت‌های پایا / ساتنا
- `commissionRate`: درصد کمیسیون پیش‌فرض پلتفرم برای این تأمین‌کننده (مثلاً ۱۰٪)
- `isActive`: وضعیت فعال بودن حساب

### ۲.۳ کاتالوگ محصولات، انواع کالا و تنوع‌ها (`Product`, `ProductType`, `ProductAttribute`, `ProductVariant`)
- `Product`:
  - `id`: عدد صحیح خودافزاینده
  - `name`, `slug`, `sku`, `tagline`, `shortDescription`, `description`
  - `seoTitle`, `seoDescription`: متا تگ‌های سئو برای موتورهای جستجو
  - `price`, `discountPrice`, `compareAtPrice`: قیمت فعلی، تخفیف و قیمت خط‌خورده به تومان
  - `stock`: مجموع کل موجودی فیزیکی تنوع‌های فعال کالا
  - `brandId`, `categoryId`, `productTypeId`, `supplierId`: کلیدهای ارتباطی خارجی
  - `images`: آرایه آدرس تصاویر گالری کالا
- `ProductType` (انواع محصول):
  - `id`, `name`, `slug` (مانند `disposable-vape`, `nicotine-salt`, `pod-system`, `lighter-accessories`), `description`, `icon`
- `ProductAttribute` (ویژگی‌های فنی پویا):
  - `productTypeId`: نوع محصول مرتبط
  - `code`: شناسه یکتای ویژگی (مانند `nicotine`, `flavor`, `puff_count`, `vg_pg_ratio`)
  - `type`: نوع ورودی (`text`, `number`, `select`, `multiselect`, `boolean`, `color`)
  - `isVariant`: آیا در تولید ماتریس تنوع‌ها استفاده می‌شود؟
  - `isRequired`, `isVisible`, `displayOrder`, `options`, `unit`
- `ProductAttributeValue`:
  - `productId`, `attributeId`, `value`: مقادیر مشخصات فنی ثبت‌شده برای کالا
- `ProductVariant` (تنوع‌های محصول):
  - `id`: شناسه تنوع
  - `productId`: کالای مرجع
  - `sku`: کد انبارداری مجزا و یکتا (مانند `OXB-NIC50-BLU`)
  - `title`: عنوان تنوع (مانند `بلوبری آیس / ۵۰ میلی‌گرم`)
  - `combinationHash`: هش نرمال‌شده ویژگی‌ها با ایندکس یکتا (`@@unique([productId, combinationHash])`)
  - `combination`: آبجکت JSON مقادیر ترکیب
  - `price`, `compareAtPrice`: قیمت اختصاصی تنوع
  - `stock`: موجودی فیزیکی واقعی این تنوع
  - `reservedQuantity`: تعداد در حال رزرو برای سبدهای خرید یا سفارش‌های در انتظار
  - `image`: تصویر اختصاصی این تنوع
  - `isActive`: وضعیت فروش تنوع
- `VariantAttributeValue`:
  - مقدار نرمال‌شده هر ویژگی تشکیل‌دهنده تنوع

### ۲.۴ گردش و حسابرسی انبار (`InventoryMovement`)
- `id`: شناسه ثبت لاگ
- `productId`, `variantId`: تنوع و کالای مربوطه
- `type`: نوع عملیات انبارداری (`PURCHASE_RECEIPT`, `SALE_DEDUCTION`, `ORDER_RESERVED`, `RESERVATION_RELEASED`, `MANUAL_ADJUSTMENT`, `RETURN_RESTOCK`)
- `delta`: میزان تغییر موجودی (مثبت برای ورود/شارژ، منفی برای رزرو یا فروش قطعی)
- `stockBefore`, `stockAfter`: مانده موجودی قبل و بعد از تراکنش
- `reason`: توضیح سیستمی یا یادداشت اپراتور انبار
- `orderId`, `userId`: سفارش و کاربر ایجادکننده تراکنش

### ۲.۵ رزرو موقت انبار (`InventoryReservation` و `ReservationItem`)
- مکانیزم جلوگیری از پیش‌فروش غیرمجاز (Overselling):
- `token`: توکن یکتای رزرو ۱۰ دقیقه‌ای
- `status`: وضعیت (`ACTIVE`, `COMMITTED`, `RELEASED`, `EXPIRED`)
- `expiresAt`: زمان پایان مهلت رزرو
- `ReservationItem`:
  - `productId`: کالای رزرو شده
  - `variantId`: تنوع انتخابی کالا (کلید خارجی با پشتیبانی از موجودی تفکیکی)
  - `quantity`: تعداد واحد نگه‌داشته شده

### ۲.۶ سفارش‌ها و اقلام فاکتور (`Order` و `OrderItem`)
- `Order`:
  - `id`, `number`: شناسه و شماره فاکتور رسمی (یکتا)
  - `userId`: شناسه خریدار احراز هویت شده (ثبت سفارش مهمان مسدود است)
  - `reservationId`: شناسه اتصال به رزرو موفق انبار
  - `subtotal`, `discount`, `shippingFee`, `total`: مبالغ به تومان
  - `status`: وضعیت سفارش (`pending`, `paid`, `processing`, `shipped`, `delivered`, `cancelled`, `refunded`)
  - `platformCommissionRate`: درصد کمیسیون در زمان ثبت سفارش (Snapshot)
  - `platformCommissionAmount`: سهم خالص پلتفرم به تومان
- `OrderItem`:
  - `orderId`, `productId`, `variantId`: ثبت دقیق تنوع خریداری شده به همراه قیمت و عنوان در لحظه خرید
  - `supplierPayableAmount`: سهم خالص قابل پرداخت به تأمین‌کننده
  - `isSettled`: نشانگر تسویه شدن یا نشدن با تأمین‌کننده در دسته‌های هفتگی
- `OrderItem`:
  - `orderId`, `productId`, `name`, `price`, `qty`, `flavor`, `nicotine`

### ۲.۶ تراکنش‌های مالی و دفتر روزنامه دوبل (`TransactionJournal` و `PaymentTransaction`)
- `PaymentTransaction`: ثبت اطلاعات پرداخت درگاه بانکی شامل `idempotencyKey` و کد ارجاع شاپرک.
- `TransactionJournal`: دفتر کل حسابداری تغییرناپذیر (Append-Only) دوبل:
  - `orderId`: شماره سفارش مربوطه
  - `accountType`: نوع حساب (`ASSET_GATEWAY`, `REVENUE_COMMISSION`, `LIABILITY_SUPPLIER`, `LIABILITY_CUSTOMER_REFUND`, `EXPENSE_PLATFORM`)
  - `entryType`: ماهیت سند (`DEBIT`, `CREDIT`)
  - `amount`: مبلغ سند به تومان
  - `description`: شرح تراکنش حسابداری
  - `recordedAt`: تاریخ و ساعت قطعی ثبت سند

### ۲.۷ دسته‌های تسویه هفتگی (`SettlementBatch`)
- `batchNumber`: شناسه سند هفتگی (مانند `SETTLE-2026-W44-SUP-1`)
- `supplierId`: تأمین‌کننده ذینفع
- `totalGrossSales`: مجموع فروش ناخالص اقلام تأمین‌کننده در بازه هفتگی
- `platformCommissionTotal`: کل کمیسیون کسر شده پلتفرم
- `supplierPayableTotal`: مبلغ خالص واریز شده به حساب شبای تأمین‌کننده
- `status`: وضعیت واریز (`PENDING`, `APPROVED`, `PAID`, `CANCELLED`)
- `paymentReference`: شماره پیگیری فیش حواله پایا / ساتنا

### ۲.۸ سایر جداول عملیاتی
- `MediaFile` (`media_files`): کتابخانه رسانه‌ها و فایلهای ذخیره‌شده در MinIO S3 شامل نام یکتا، نام اصلی، پسوند، نوع MIME، حجم به بایت، کلید آبجکت استوریج (Key)، آدرس مستقیم عمومی (URL)، ابعاد و شناسه کاربر آپلودکننده.
- `Banner`: بنرهای فروشگاه
- `Address`: نشانی‌های تحویل مرسوله کاربران
- `Coupon`: کوپن‌های تخفیف درصدی و ثابت
- `ProductAlert`: ثبت درخواست‌های «موجود شد خبرم کن»
- `GlobalSetting`: تنظیمات سیستم (مانند درصد کمیسیون عمومی پلتفرم)
- `Subscriber` و `ContactMessage`: خبرنامه و فرم‌های تماس
