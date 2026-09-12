import { u as useVape, F as FREE_SHIPPING, C as CheckIcon, _ as __nuxt_component_0, A as ArrowLeftIcon, m as money, g as ShieldIcon, i as DropletIcon } from './server.mjs';
import { defineComponent, ref, computed, unref, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
import { u as useSeoMeta } from './v4-z_h3gB1X.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "checkout",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "تکمیل سفارش"
    });
    const { cart, cartTotal, ageOk, hydrated } = useVape();
    const done = ref(null);
    const busy = ref(false);
    const err = ref("");
    const f = ref({ name: "", phone: "", city: "تهران", addr: "", zip: "", note: "" });
    const shipping = computed(
      () => cartTotal.value >= FREE_SHIPPING || cart.value.length === 0 ? 0 : 65e3
    );
    const total = computed(() => cartTotal.value + shipping.value);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (done.value) {
        _push(`<div class="wrap flex min-h-[75svh] flex-col items-center justify-center py-10 text-center"><span class="grid h-24 w-24 place-items-center rounded-full border border-neon/40 bg-neon/12 text-neon glow-g">`);
        _push(ssrRenderComponent(unref(CheckIcon), {
          size: 40,
          sw: 2.6
        }, null, _parent));
        _push(`</span><h1 class="mt-8 font-display text-[26px] font-extrabold text-snow">سفارشت ثبت شد! 🎉</h1><p class="mt-3 text-[13.5px] leading-7 text-mist"> شماره پیگیری: <strong dir="ltr" class="text-vio">${ssrInterpolate(done.value)}</strong><br> تیم ویپورا به‌زودی برای هماهنگی ارسال باهات تماس می‌گیره. </p><div class="mt-8 flex flex-wrap justify-center gap-3">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/shop",
          class: "pressable inline-flex h-13 items-center rounded-2xl bg-gradient-to-l from-vio to-ice px-7 py-4 text-[13.5px] font-extrabold text-ink glow-v"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` ادامه خرید `);
            } else {
              return [
                createTextVNode(" ادامه خرید ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/account",
          class: "pressable inline-flex h-13 items-center rounded-2xl border border-white/14 px-7 py-4 text-[13.5px] font-extrabold text-snow"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` پیگیری سفارش `);
            } else {
              return [
                createTextVNode(" پیگیری سفارش ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else if (!unref(hydrated)) {
        _push(`<div class="wrap pt-8" aria-busy="true"><div class="skeleton h-10 w-64"></div><div class="mt-8 grid gap-6 lg:grid-cols-2"><div class="skeleton h-96 w-full"></div><div class="skeleton h-96 w-full"></div></div></div>`);
      } else if (unref(cart).length === 0) {
        _push(`<div class="wrap flex min-h-[70svh] flex-col items-center justify-center text-center"><p class="text-6xl">🧾</p><h1 class="mt-5 text-[20px] font-extrabold text-snow">چیزی برای پرداخت نیست</h1><p class="mt-2 text-[13px] text-dim">اول چند محصول خوش‌طعم به سبدت اضافه کن.</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/shop",
          class: "pressable mt-7 inline-flex h-13 items-center rounded-2xl bg-gradient-to-l from-vio to-ice px-8 py-4 text-[14px] font-extrabold text-ink glow-v"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` رفتن به فروشگاه `);
            } else {
              return [
                createTextVNode(" رفتن به فروشگاه ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="wrap pt-8 pb-4">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/cart",
          class: "mb-4 inline-flex items-center gap-2 text-[13px] font-bold text-vio"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(ArrowLeftIcon), { size: 16 }, null, _parent2, _scopeId));
              _push2(` بازگشت به سبد `);
            } else {
              return [
                createVNode(unref(ArrowLeftIcon), { size: 16 }),
                createTextVNode(" بازگشت به سبد ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<h1 class="font-display text-[26px] font-extrabold text-snow">تکمیل سفارش</h1>`);
        if (!unref(ageOk)) {
          _push(`<p class="mt-4 rounded-2xl border border-blush/25 bg-blush/8 px-4 py-3 text-[12.5px] text-blush"> ⚠️ گیت تأیید سن را کامل نکرده‌اید — برای خرید، ورود شما باید بالای ۱۸ سال باشد. </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<form class="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_380px]"><div class="space-y-4"><div class="card-g rounded-[22px] p-5"><h2 class="mb-4 flex items-center gap-2 text-[15px] font-extrabold text-snow"><span class="grid h-7 w-7 place-items-center rounded-full bg-vio/15 text-[12px] text-vio">۱</span> اطلاعات گیرنده </h2><div class="grid gap-4 sm:grid-cols-2"><label class="block"><span class="mb-1.5 block text-[11.5px] font-bold text-dim">نام و نام خانوادگی</span><input${ssrRenderAttr("value", f.value.name)} class="input" placeholder="مثلاً آرمان رضایی"></label><label class="block"><span class="mb-1.5 block text-[11.5px] font-bold text-dim">شماره موبایل</span><input${ssrRenderAttr("value", f.value.phone)} class="input" dir="ltr" inputmode="tel" placeholder="0912 345 6789"></label><label class="block sm:col-span-2"><span class="mb-1.5 block text-[11.5px] font-bold text-dim">آدرس کامل</span><input${ssrRenderAttr("value", f.value.addr)} class="input" placeholder="خیابان، کوچه، پلاک، واحد"></label><label class="block"><span class="mb-1.5 block text-[11.5px] font-bold text-dim">شهر</span><select class="input"><!--[-->`);
        ssrRenderList(["تهران", "کرج", "شیراز", "اصفهان", "مشهد", "تبریز", "رشت"], (c) => {
          _push(`<option${ssrIncludeBooleanAttr(Array.isArray(f.value.city) ? ssrLooseContain(f.value.city, null) : ssrLooseEqual(f.value.city, null)) ? " selected" : ""}>${ssrInterpolate(c)}</option>`);
        });
        _push(`<!--]--></select></label><label class="block"><span class="mb-1.5 block text-[11.5px] font-bold text-dim">کد پستی</span><input${ssrRenderAttr("value", f.value.zip)} class="input" dir="ltr" placeholder="—"></label><label class="block sm:col-span-2"><span class="mb-1.5 block text-[11.5px] font-bold text-dim">توضیحات (اختیاری)</span><input${ssrRenderAttr("value", f.value.note)} class="input" placeholder="مثلاً: بعد از ۶ عصر تماس بگیرید"></label></div></div><div class="card-g rounded-[22px] p-5"><h2 class="mb-3 flex items-center gap-2 text-[15px] font-extrabold text-snow"><span class="grid h-7 w-7 place-items-center rounded-full bg-vio/15 text-[12px] text-vio">۲</span> روش پرداخت </h2><label class="flex cursor-pointer items-center gap-3 rounded-2xl border border-neon/40 bg-neon/8 px-4 py-4"><input type="radio" checked readonly class="accent-[#4ade80]"><span class="flex-1 text-[13.5px] font-extrabold text-snow">پرداخت در محل (فقط تهران)</span><span class="text-[11px] text-dim">تحویل بگیر، بعد پرداخت کن</span></label><label class="mt-2 flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/3 px-4 py-4 opacity-60"><input type="radio" disabled><span class="flex-1 text-[13.5px] font-extrabold text-snow">پرداخت آنلاین (به‌زودی)</span></label></div></div><aside class="card-g sticky top-20 rounded-[22px] p-5"><h2 class="text-[15px] font-extrabold text-snow">سفارش شما</h2><ul class="mt-4 max-h-60 space-y-3 overflow-y-auto"><!--[-->`);
        ssrRenderList(unref(cart), (c) => {
          _push(`<li class="flex items-center gap-3"><img${ssrRenderAttr("src", c.img)} alt="" class="h-14 w-12 rounded-xl object-cover" loading="lazy"><div class="min-w-0 flex-1"><p dir="ltr" class="truncate text-right text-[12.5px] font-extrabold text-snow">${ssrInterpolate(c.name)}</p><p class="text-[10.5px] text-dim tnum">${ssrInterpolate(c.qty)} × ${ssrInterpolate(unref(money)(c.price))} `);
          if (c.flavor) {
            _push(`<span> · ${ssrInterpolate(c.flavor)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</p></div><span class="text-[12.5px] font-extrabold text-snow tnum">${ssrInterpolate(unref(money)(c.price * c.qty))}</span></li>`);
        });
        _push(`<!--]--></ul><dl class="mt-5 space-y-3 border-t border-white/8 pt-4 text-[13px]"><div class="flex justify-between"><dt class="text-dim">جمع کالاها</dt><dd class="font-extrabold text-snow tnum">${ssrInterpolate(unref(money)(unref(cartTotal)))}</dd></div><div class="flex justify-between"><dt class="text-dim">ارسال</dt><dd class="${ssrRenderClass(["font-extrabold tnum", shipping.value === 0 ? "text-neon" : "text-snow"])}">${ssrInterpolate(shipping.value === 0 ? "رایگان" : unref(money)(shipping.value))}</dd></div><div class="flex justify-between border-t border-white/8 pt-3"><dt class="text-[15px] font-extrabold text-snow">قابل پرداخت</dt><dd class="text-[18px] font-extrabold text-grad tnum">${ssrInterpolate(unref(money)(total.value))}</dd></div></dl>`);
        if (err.value) {
          _push(`<p class="mt-4 rounded-xl border border-blush/30 bg-blush/8 px-3 py-2.5 text-[12px] text-blush">${ssrInterpolate(err.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button${ssrIncludeBooleanAttr(busy.value) ? " disabled" : ""} class="pressable mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-vio to-ice text-[15px] font-extrabold text-ink glow-v disabled:opacity-60 cursor-pointer">`);
        if (busy.value) {
          _push(`<span class="h-5 w-5 animate-spin rounded-full border-2 border-ink border-t-transparent"></span>`);
        } else {
          _push(`<!--[-->`);
          _push(ssrRenderComponent(unref(ShieldIcon), {
            size: 18,
            sw: 2.2
          }, null, _parent));
          _push(` ثبت سفارش — ${ssrInterpolate(unref(money)(total.value))}<!--]-->`);
        }
        _push(`</button><p class="mt-3 flex items-center justify-center gap-1.5 text-[10.5px] text-dim">`);
        _push(ssrRenderComponent(unref(DropletIcon), {
          size: 12,
          class: "text-vio"
        }, null, _parent));
        _push(` فروش فقط به افراد بالای ۱۸ سال — ${ssrInterpolate(unref(money)(0))} اضافه‌هزینه‌ای در کار نیست </p></aside></form></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/checkout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=checkout-BzZIsO8M.mjs.map
