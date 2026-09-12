/* ==========================================================================
   📌 لوله تبدیل و فرمت قیمت به تومان (Toman Pipe - toman.pipe.ts)
   ==========================================================================
   💡 این معادل چیه؟
   توی Vue 2 فیلترها (Filters) وجود داشتند، اما در Vue 3 حذف شدند و به جای آن
   از توابع فرمت‌کننده مثل `{{ money(product.price) }}` یا `utils/format.ts` استفاده می‌کنیم.
   
   در Angular:
   پایپ‌ها (`Pipe`) ابزارهای قدرتمند و کش‌شده‌ای هستند که مستقیماً در تمپلیت
   با علامت خط عمودی `|` استفاده می‌شوند:
     <span>{{ product.price | toman }}</span>
   انگولار پایپ‌های Pure را بهینه می‌کند تا فقط در صورت تغییر مقدار ورودی دوباره
   محاسبه شوند.
   ========================================================================== */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toman',
  standalone: true, // در انگولار استندالون نیازی به رجیستر در ماژول نیست
})
export class TomanPipe implements PipeTransform {
  transform(value: number | string | null | undefined, showUnit: boolean = true): string {
    if (value == null || isNaN(Number(value))) {
      return '۰ تومان';
    }

    const num = Number(value);
    const formatted = num.toLocaleString('fa-IR');

    return showUnit ? `${formatted} تومان` : formatted;
  }
}
