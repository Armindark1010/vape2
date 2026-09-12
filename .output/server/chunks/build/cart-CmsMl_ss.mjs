import { u as useVape, F as FREE_SHIPPING, _ as __nuxt_component_0, A as ArrowLeftIcon, m as money, T as TrashIcon, P as PlusIcon, M as MinusIcon, a as TagIcon, C as CheckIcon } from './server.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderClass } from 'vue/server-renderer';
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
  __name: "cart",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "سبد خرید"
    });
    const { cart, cartTotal, hydrated } = useVape();
    const code = ref("");
    const msg = ref(null);
    const coupon = ref(null);
    const busy = ref(false);
    const discount = computed(
      () => coupon.value ? Math.round(cartTotal.value * coupon.value.percent / 100) : 0
    );
    const shipping = computed(
      () => cartTotal.value - discount.value >= FREE_SHIPPING || cart.value.length === 0 ? 0 : 65e3
    );
    const total = computed(() => cartTotal.value - discount.value + shipping.value);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "wrap pt-8 pb-4" }, _attrs))}><div class="flex items-center gap-3"><h1 class="font-display text-[26px] font-extrabold text-snow">سبد خرید</h1><span class="text-[12.5px] text-dim tnum">(${ssrInterpolate(unref(cart).length)}) کالا</span></div>`);
      if (!unref(hydrated)) {
        _push(`<div class="mt-8 space-y-4" aria-busy="true"><!--[-->`);
        ssrRenderList(2, (i) => {
          _push(`<div class="skeleton h-32 w-full"></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(cart).length === 0) {
        _push(`<div class="card-g mt-8 rounded-[24px] p-14 text-center"><p class="text-6xl">🛒</p><h2 class="mt-5 text-[18px] font-extrabold text-snow">سبد خریدت خالیه</h2><p class="mt-2 text-[13px] leading-7 text-dim"> یه پاد خوش‌طعم، یه سالت اصل یا یه مود حرفه‌ای — انتخاب با توئه. </p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/shop",
          class: "pressable mt-7 inline-flex h-13 items-center gap-2 rounded-2xl bg-gradient-to-l from-vio to-ice px-8 py-4 text-[14px] font-extrabold text-ink glow-v"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` رفتن به فروشگاه `);
              _push2(ssrRenderComponent(unref(ArrowLeftIcon), {
                size: 17,
                sw: 2.4
              }, null, _parent2, _scopeId));
            } else {
              return [
                createTextVNode(" رفتن به فروشگاه "),
                createVNode(unref(ArrowLeftIcon), {
                  size: 17,
                  sw: 2.4
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_380px]"><ul class="space-y-3"><!--[-->`);
        ssrRenderList(unref(cart), (c) => {
          _push(`<li class="card-g flex gap-4 rounded-[20px] p-4">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/product/${c.slug}`,
            class: "shrink-0 overflow-hidden rounded-2xl"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<img${ssrRenderAttr("src", c.img)}${ssrRenderAttr("alt", c.name)} class="h-28 w-24 object-cover" loading="lazy"${_scopeId}>`);
              } else {
                return [
                  createVNode("img", {
                    src: c.img,
                    alt: c.name,
                    class: "h-28 w-24 object-cover",
                    loading: "lazy"
                  }, null, 8, ["src", "alt"])
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<div class="flex min-w-0 flex-1 flex-col"><div class="flex items-start justify-between gap-3"><div class="min-w-0">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/product/${c.slug}`,
            dir: "ltr",
            class: "block truncate text-right text-[14px] font-extrabold text-snow"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(c.name)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(c.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<p class="mt-1 text-[11.5px] text-mist">`);
          if (c.flavor) {
            _push(`<span>طعم: ${ssrInterpolate(c.flavor)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (c.nicotine) {
            _push(`<span dir="ltr"> · نیکوتین ${ssrInterpolate(c.nicotine)}mg</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</p><p class="mt-2 text-[13px] font-extrabold text-neon tnum">${ssrInterpolate(unref(money)(c.price * c.qty))}</p></div><button class="pressable grid h-10 w-10 place-items-center rounded-xl text-dim hover:bg-white/6 hover:text-blush cursor-pointer" aria-label="حذف">`);
          _push(ssrRenderComponent(unref(TrashIcon), { size: 17 }, null, _parent));
          _push(`</button></div><div class="mt-auto flex h-11 w-fit items-center overflow-hidden rounded-2xl border border-white/12 pt-0" dir="ltr"><button class="grid h-full w-11 place-items-center text-snow active:bg-white/8 cursor-pointer" aria-label="افزایش">`);
          _push(ssrRenderComponent(unref(PlusIcon), { size: 15 }, null, _parent));
          _push(`</button><span class="grid h-full w-10 place-items-center text-[14px] font-extrabold text-snow tnum">${ssrInterpolate(c.qty)}</span><button class="grid h-full w-11 place-items-center text-snow active:bg-white/8 cursor-pointer" aria-label="کاهش">`);
          _push(ssrRenderComponent(unref(MinusIcon), { size: 15 }, null, _parent));
          _push(`</button></div></div></li>`);
        });
        _push(`<!--]--></ul><aside class="card-g sticky top-20 rounded-[22px] p-5"><h2 class="text-[15px] font-extrabold text-snow">خلاصه سفارش</h2><form class="mt-4 flex gap-2"><label class="sr-only" for="cp">کد تخفیف</label><input id="cp"${ssrRenderAttr("value", code.value)} placeholder="کد تخفیف (VAPORA15)" dir="ltr" class="input h-12 flex-1 text-center text-[13px] font-bold"><button${ssrIncludeBooleanAttr(busy.value || !code.value.trim()) ? " disabled" : ""} class="pressable grid h-12 w-14 place-items-center rounded-2xl border border-white/12 text-vio disabled:opacity-40 cursor-pointer" aria-label="اعمال کد تخفیف">`);
        _push(ssrRenderComponent(unref(TagIcon), { size: 18 }, null, _parent));
        _push(`</button></form>`);
        if (msg.value) {
          _push(`<p class="${ssrRenderClass([
            "mt-2 flex items-center gap-1.5 text-[11.5px] font-bold",
            msg.value.ok ? "text-neon" : "text-blush"
          ])}">`);
          _push(ssrRenderComponent(unref(CheckIcon), { size: 12 }, null, _parent));
          _push(` ${ssrInterpolate(msg.value.t)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<dl class="mt-5 space-y-3 border-t border-white/8 pt-4 text-[13px]"><div class="flex justify-between"><dt class="text-dim">جمع کالاها</dt><dd class="font-extrabold text-snow tnum">${ssrInterpolate(unref(money)(unref(cartTotal)))}</dd></div>`);
        if (discount.value > 0) {
          _push(`<div class="flex justify-between text-neon"><dt>تخفیف (${ssrInterpolate(coupon.value?.code)})</dt><dd class="font-extrabold tnum">−${ssrInterpolate(unref(money)(discount.value))}</dd></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex justify-between"><dt class="text-dim">ارسال</dt><dd class="${ssrRenderClass(["font-extrabold tnum", shipping.value === 0 ? "text-neon" : "text-snow"])}">${ssrInterpolate(shipping.value === 0 ? "رایگان 🎉" : unref(money)(shipping.value))}</dd></div><div class="flex items-center justify-between border-t border-white/8 pt-3"><dt class="text-[15px] font-extrabold text-snow">مبلغ قابل پرداخت</dt><dd class="text-[18px] font-extrabold text-grad tnum">${ssrInterpolate(unref(money)(total.value))}</dd></div></dl>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/checkout",
          class: "pressable mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-vio to-ice text-[15px] font-extrabold text-ink glow-v"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` ادامه و پرداخت `);
              _push2(ssrRenderComponent(unref(ArrowLeftIcon), {
                size: 18,
                sw: 2.4
              }, null, _parent2, _scopeId));
            } else {
              return [
                createTextVNode(" ادامه و پرداخت "),
                createVNode(unref(ArrowLeftIcon), {
                  size: 18,
                  sw: 2.4
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<p class="mt-3 text-center text-[10.5px] text-dim">پرداخت در محل (تهران) · ضمانت اصالت کالا</p></aside></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/cart.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=cart-CmsMl_ss.mjs.map
