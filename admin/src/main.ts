/* ==========================================================================
   📌 نقطه ورود برنامه (Main Bootstrap - main.ts)
   ==========================================================================
   💡 این معادل چیه؟
   توی Nuxt 3 این فایل معادل فایل پنهان `entry.mjs` یا `app.vue` است که Nuxt
   خودکار لود می‌کرد. در Angular، ما کامپوننت ریشه (`AppComponent`) را با
   تنظیمات اپلیکیشن (`appConfig`) به مرورگر می‌شناسانیم (Bootstrap).
   ========================================================================== */

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error('خطا در بارگذاری برنامه انگولار:', err));
