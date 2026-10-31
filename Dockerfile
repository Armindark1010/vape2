# -------------------------------------------------------------
# مرحله اول: ساخت و کامپایل پروژه (Build Stage)
# -------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# کپی کردن فایل‌های پکیج برای استفاده از کش لایه‌های داکر
COPY package*.json ./

# نصب وابستگی‌ها
RUN npm install

# کپی کردن کل سورس کد به داخل داکر
COPY . .

# بیلد کردن پروژه Nuxt 3 برای پروداکشن
RUN npm run build

# -------------------------------------------------------------
# مرحله دوم: اجرای بسیار سبک نسخه نهایی (Production Runner)
# -------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# فقط خروجی تمیز و کامپایل‌شده مرحله قبل را برمی‌داریم
COPY --from=builder /app/.output ./.output

EXPOSE 3000

# روشن کردن سرور سریع Nitro در Nuxt
CMD ["node", ".output/server/index.mjs"]
