/* ==========================================================================
   📌 کامپوننت ریشه برنامه (Root Component - app.component.ts)
   ==========================================================================
   💡 این معادل چیه؟
   توی Nuxt 3 این فایل دقیقاً معادل `app.vue` است:
     <template>
       <NuxtLayout>
         <NuxtPage />
       </NuxtLayout>
     </template>

   در Angular:
   تگ `<router-outlet></router-outlet>` نقطه مرکزی نمایش روت‌های تعریف شده در
   `app.routes.ts` است.
   ========================================================================== */

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <!-- نقطه ورود و رندر روت‌های سطح اول برنامه (معادل <NuxtPage />) -->
    <router-outlet></router-outlet>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `]
})
export class AppComponent {
  title = 'Vapora Admin Panel';
}
