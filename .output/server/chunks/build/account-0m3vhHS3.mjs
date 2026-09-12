import { D as DEMO_USER, U as UserIcon, m as money, _ as __nuxt_component_0, f as ChevronLeftIcon, C as CheckIcon, c as SITE } from './server.mjs';
import { defineComponent, withAsyncContext, computed, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer';
import { u as useSeoMeta } from './v4-z_h3gB1X.mjs';
import { u as useFetch } from './fetch-D0KPqKjg.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-router';
import '@vue/shared';

const MONTHS = ["ژانویه", "فوریه", "مارس", "آوریل", "مه", "ژوئن", "ژوئیه", "اوت", "سپتامبر", "اکتبر", "نوامبر", "دسامبر"];
function formatDateFa(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()} ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "account",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useSeoMeta({
      title: "حساب کاربری",
      robots: "noindex, follow"
    });
    const { data: orders } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/orders",
      {
        query: { email: DEMO_USER.email },
        default: () => []
      },
      "$nsAN8XezDo"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const shipped = computed(
      () => (orders.value || []).filter((o) => ["shipped", "delivered", "processing"].includes(o.status))
    );
    const totalSpent = computed(
      () => (orders.value || []).reduce((s, o) => s + o.total, 0)
    );
    const labelFa = {
      pending: "در انتظار پرداخت",
      processing: "در حال آماده‌سازی",
      shipped: "ارسال شده",
      delivered: "تحویل شده",
      refunded: "عودت داده شده"
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "wrap pt-8 pb-4" }, _attrs))}><div class="card-g relative overflow-hidden rounded-[24px] p-6"><div class="pointer-events-none absolute -top-16 left-1/3 h-40 w-72 rounded-full bg-vio/15 blur-3xl"></div><div class="relative flex flex-wrap items-center gap-5"><span class="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-vio to-ice text-[22px] font-extrabold text-ink"> آ </span><div class="min-w-0 flex-1"><h1 class="text-[19px] font-extrabold text-snow">${ssrInterpolate(unref(DEMO_USER).name)}</h1><p class="mt-1 flex items-center gap-2 text-[12px] text-dim" dir="ltr">`);
      _push(ssrRenderComponent(unref(UserIcon), { size: 13 }, null, _parent));
      _push(` ${ssrInterpolate(unref(DEMO_USER).email)} · ${ssrInterpolate(unref(DEMO_USER).phone)}</p><p class="mt-1 text-[11px] text-vio">عضو از ${ssrInterpolate(unref(DEMO_USER).joined)} · حساب دمو</p></div><span class="rounded-xl border border-neon/25 bg-neon/10 px-3 py-1.5 text-[11px] font-extrabold text-neon">تأیید سن ✓</span></div></div><div class="mt-4 grid grid-cols-3 gap-3"><div class="card-g rounded-[20px] p-4 text-center"><p class="truncate text-[16px] font-extrabold text-snow tnum">${ssrInterpolate((unref(orders) || []).length)}</p><p class="mt-1 text-[10.5px] text-dim">سفارش‌ها</p></div><div class="card-g rounded-[20px] p-4 text-center"><p class="truncate text-[16px] font-extrabold text-snow tnum">${ssrInterpolate(shipped.value.length)}</p><p class="mt-1 text-[10.5px] text-dim">در جریان</p></div><div class="card-g rounded-[20px] p-4 text-center"><p class="truncate text-[16px] font-extrabold text-snow tnum">${ssrInterpolate(unref(money)(totalSpent.value))}</p><p class="mt-1 text-[10.5px] text-dim">مجموع خرید</p></div></div><h2 class="mt-8 mb-4 text-[16px] font-extrabold text-snow">سفارش‌های اخیر</h2>`);
      if ((unref(orders) || []).length === 0) {
        _push(`<div class="card-g rounded-[20px] p-10 text-center"><p class="text-5xl">📦</p><p class="mt-4 text-[14px] font-extrabold text-snow">هنوز سفارشی ثبت نکردی</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/shop",
          class: "pressable mt-5 inline-flex h-12 items-center rounded-2xl bg-gradient-to-l from-vio to-ice px-6 text-[13px] font-extrabold text-ink"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` اولین خریدت رو شروع کن `);
            } else {
              return [
                createTextVNode(" اولین خریدت رو شروع کن ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<ul class="space-y-3"><!--[-->`);
        ssrRenderList((unref(orders) || []).slice(0, 6), (o) => {
          _push(`<li><details class="card-g group overflow-hidden rounded-[20px] p-0 transition-colors open:border-vio/25"><summary class="flex cursor-pointer list-none items-center gap-3.5 p-3.5 sm:p-4 [&amp;::-webkit-details-marker]:hidden"><div class="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/8 bg-white/5 flex items-center justify-center">`);
          if (o.items[0]?.image) {
            _push(`<img${ssrRenderAttr("src", o.items[0].image)} alt="" class="h-full w-full object-cover" loading="lazy">`);
          } else {
            _push(ssrRenderComponent(unref(UserIcon), {
              size: 18,
              class: "text-dim"
            }, null, _parent));
          }
          _push(`</div><div class="min-w-0 flex-1"><span dir="ltr" class="block truncate text-right text-[13.5px] font-extrabold text-snow">${ssrInterpolate(o.number)}</span><span class="text-[11px] text-dim">${ssrInterpolate(unref(formatDateFa)(o.createdAt))} · ${ssrInterpolate(o.items.reduce((s, it) => s + it.qty, 0))} کالا</span></div><span class="${ssrRenderClass([[
            o.status === "delivered" ? "border-neon/30 bg-neon/10 text-neon" : o.status === "refunded" ? "border-blush/30 bg-blush/10 text-blush" : "border-vio/30 bg-vio/10 text-vio"
          ], "shrink-0 rounded-xl border px-3 py-1.5 text-[10.5px] font-extrabold"])}">${ssrInterpolate(labelFa[o.status] ?? o.status)}</span>`);
          _push(ssrRenderComponent(unref(ChevronLeftIcon), {
            size: 15,
            class: "shrink-0 text-dim transition-transform duration-300 group-open:-rotate-90"
          }, null, _parent));
          _push(`</summary><div class="border-t border-white/8 bg-white/2 p-4"><ul class="space-y-2.5"><!--[-->`);
          ssrRenderList(o.items, (it, j) => {
            _push(`<li class="flex items-center justify-between text-[12.5px]"><span class="text-mist">${ssrInterpolate(it.qty)} × <span dir="ltr">${ssrInterpolate(it.name)}</span></span><span class="font-extrabold text-snow tnum">${ssrInterpolate(unref(money)(it.price * it.qty))}</span></li>`);
          });
          _push(`<!--]--></ul><div class="mt-3 flex items-center justify-between border-t border-white/8 pt-3"><span class="text-[11px] text-dim">${ssrInterpolate(o.status === "delivered" ? "تحویل موفق — ممنون که با ویپورا بودی 💜" : "در حال پیگیری توسط تیم ارسال")}</span><span class="text-[14px] font-extrabold text-neon tnum">${ssrInterpolate(unref(money)(o.total))}</span></div></div></details></li>`);
        });
        _push(`<!--]--></ul>`);
      }
      _push(`<div class="card-g mt-8 rounded-[22px] p-6"><h2 class="flex items-center gap-2 text-[15px] font-extrabold text-snow">`);
      _push(ssrRenderComponent(unref(CheckIcon), {
        size: 18,
        class: "text-neon"
      }, null, _parent));
      _push(` چرا ویپورا؟ </h2><p class="mt-3 text-[12.5px] leading-7 text-dim">${ssrInterpolate(unref(SITE).name)} فقط کالای اورجینال با هولوگرام اصالت می‌فروشد؛ اگر بعد از اسکن هولوگرام مطمئن نشدی، تا ۷ روز می‌تونی کالا رو برگردونی و کل مبلغ رو پس بگیری. </p></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/account.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=account-0m3vhHS3.mjs.map
