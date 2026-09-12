# VAPORA Store - Project Knowledge & Instructions

## Project Overview
This repository contains **VAPORA (ویپورا)**, a specialized luxury e-commerce platform for vape, pod, and nicotine salt products.

### Architecture
1. **Storefront (Nuxt 3 / Vue 3 / Vite)**:
   - Root `/app`, `/server`, `/public`
   - Real authentication (Username + Password, NO OTP).
   - Global auth modal (`AuthModal.vue`) with resume action on login.
   - Google Model-Viewer (`<model-viewer>`) for photorealistic 3D/AR product viewing (`/studio/scan` and product pages).
   - Drizzle ORM + PostgreSQL with fallback data for seamless operation.
2. **Admin Panel (Angular Standalone / SCSS)**:
   - Located in `/admin` (runs on port 4200 via `npm start`).
   - Standalone components (no NgModules), Signals, RxJS streams (`debounceTime`, `distinctUntilChanged`, `switchMap`), Reactive Forms.
   - Role-based route guards (`full-admin` vs `operator`), HTTP interceptor for token & 401 handling.
   - Persian educational comments comparing Angular concepts to Vue/Nuxt equivalents.
3. **Backend API (NestJS)**:
   - Located in `/backend` (runs on port 4000 with Swagger at `/api/docs`).

## Key Guidelines & Conventions
- **No OTP**: Authentication uses username/email + password directly.
- **Persian UI**: All storefront and admin UI elements support Persian typography (Vazirmatn) and RTL layout.
- **Educational Comments**: When developing in `/admin`, include Persian comments explaining Angular vs Vue/Nuxt concepts.
- **Workflow / "جنریت" Rule**: When the user requests "جنریت", ask the mandatory confirmation question *"آیا کدها روی سرور آپلود و آماده شده‌اند؟"* and follow the standard 4-step generation workflow.
