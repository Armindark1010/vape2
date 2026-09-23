# -------------------------------------------------------------
# مرحله اول: بیلد پروژه انگولار (Build Stage)
# -------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# -------------------------------------------------------------
# مرحله دوم: سرو بسیار سبک با وب‌سرور Nginx (Production Runner)
# -------------------------------------------------------------
FROM nginx:alpine

# تنظیمات Nginx با پشتیبانی از SPA routing و هدایت درخواست‌های API
COPY nginx.conf /etc/nginx/conf.d/default.conf

# کپی فایل‌های نهایی کامپایل‌شده انگولار
COPY --from=builder /app/dist/vapora-admin/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
