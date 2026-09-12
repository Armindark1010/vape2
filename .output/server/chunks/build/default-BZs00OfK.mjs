import { defineComponent, shallowRef, getCurrentInstance, provide, cloneVNode, h, createElementBlock, mergeProps, ref, watch, withCtx, unref, createVNode, toDisplayString, createTextVNode, resolveDynamicComponent, openBlock, createBlock, createCommentVNode, computed, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderVNode, ssrRenderClass, ssrRenderTeleport, ssrRenderStyle, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { y as sanitizeTag, u as useVape, _ as __nuxt_component_0$1, i as DropletIcon, c as SITE, t as SearchIcon, l as BagIcon, U as UserIcon, v as HomeIcon, G as GridIcon, h as haptic, w as CloseIcon, B as BRANDS_LINE, x as DISCLAIMER, F as FREE_SHIPPING, A as ArrowLeftIcon, m as money, T as TrashIcon, P as PlusIcon, M as MinusIcon, C as CheckIcon, Z as ZapIcon, p as FlameIcon } from './server.mjs';
import { useRoute, useRouter } from 'vue-router';
import { B as BottomSheet } from './BottomSheet-BdjUp6uW.mjs';
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

defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = /* @__PURE__ */ Symbol.for("nuxt:client-only");
const __nuxt_component_0 = defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  ...false,
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      if (mounted.value) {
        const vnodes = slots.default?.();
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = sanitizeTag(props.fallbackTag || props.placeholderTag, "span");
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});

const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "BottomNav",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const { cartCount, hydrated } = useVape();
    const searchOpen = ref(false);
    const q = ref("");
    const hits = ref(null);
    const busy = ref(false);
    ref(null);
    const items = [
      { id: "home", label: "خانه", href: "/", Icon: HomeIcon },
      { id: "cats", label: "دسته‌بندی‌ها", href: "/categories", Icon: GridIcon },
      { id: "search", label: "جستجو", action: "search", Icon: SearchIcon },
      { id: "cart", label: "سبد خرید", action: "cart", Icon: BagIcon },
      { id: "acc", label: "حساب", href: "/account", Icon: UserIcon }
    ];
    watch(
      () => route.path,
      () => {
        if (searchOpen.value) {
          searchOpen.value = false;
        }
      }
    );
    watch(searchOpen, (isOpen) => {
      return;
    });
    const isActive = (href) => {
      if (!href) return false;
      if (href === "/") return route.path === "/";
      return route.path.startsWith(href);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(_attrs)}><header class="glass sticky top-0 z-50 hidden border-b border-white/8 lg:block"><div class="wrap flex h-16 items-center justify-between">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center gap-2.5",
        "aria-label": "ویپورا"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-vio"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(DropletIcon), { size: 22 }, null, _parent2, _scopeId));
            _push2(`</span><span dir="ltr" class="font-extrabold tracking-[0.3em] text-snow"${_scopeId}>${ssrInterpolate(unref(SITE).latin)}</span><span class="rounded-full bg-vio/15 px-2.5 py-1 text-[10px] font-bold text-vio"${_scopeId}>ویپ و سالت</span>`);
          } else {
            return [
              createVNode("span", { class: "text-vio" }, [
                createVNode(unref(DropletIcon), { size: 22 })
              ]),
              createVNode("span", {
                dir: "ltr",
                class: "font-extrabold tracking-[0.3em] text-snow"
              }, toDisplayString(unref(SITE).latin), 1),
              createVNode("span", { class: "rounded-full bg-vio/15 px-2.5 py-1 text-[10px] font-bold text-vio" }, "ویپ و سالت")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="flex items-center gap-8 text-[13px] font-semibold text-mist">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "hover:text-snow"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`خانه`);
          } else {
            return [
              createTextVNode("خانه")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/categories",
        class: "hover:text-snow"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`دسته‌بندی‌ها`);
          } else {
            return [
              createTextVNode("دسته‌بندی‌ها")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/shop",
        class: "hover:text-snow"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`فروشگاه`);
          } else {
            return [
              createTextVNode("فروشگاه")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav><div class="flex items-center gap-2"><button class="pressable flex h-11 items-center gap-2 rounded-xl border border-white/12 px-4 text-[13px] text-mist cursor-pointer" aria-label="جستجو">`);
      _push(ssrRenderComponent(unref(SearchIcon), { size: 17 }, null, _parent));
      _push(` جستجو </button><button class="pressable relative grid h-11 w-11 place-items-center rounded-xl border border-white/12 text-snow cursor-pointer"${ssrRenderAttr("aria-label", `سبد خرید (${unref(cartCount)})`)}>`);
      _push(ssrRenderComponent(unref(BagIcon), { size: 19 }, null, _parent));
      if (unref(cartCount) > 0) {
        _push(`<span class="absolute -top-1.5 -left-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-gradient-to-l from-neon to-ice px-1 text-[10px] font-extrabold text-ink">${ssrInterpolate(unref(cartCount))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/account",
        class: "pressable grid h-11 w-11 place-items-center rounded-xl border border-white/12 text-snow transition-colors hover:border-vio/40 hover:text-vio",
        "aria-label": "حساب کاربری"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(UserIcon), { size: 19 }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(UserIcon), { size: 19 })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></header><nav class="glass safe-bottom fixed inset-x-0 bottom-0 z-[70] border-t border-white/10 pb-1 lg:hidden" aria-label="ناوبری اصلی"><div class="mx-auto flex h-[62px] max-w-lg items-stretch justify-around px-1"><!--[-->`);
      ssrRenderList(items, (it) => {
        _push(`<!--[-->`);
        if (it.href) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: it.href,
            "aria-label": it.label,
            "aria-current": isActive(it.href) ? "page" : void 0,
            class: "pressable relative flex w-[20%] flex-col items-center justify-center gap-1 rounded-2xl",
            onClick: ($event) => unref(haptic)(8)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<span class="relative"${_scopeId}>`);
                ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(it.Icon), {
                  size: 23,
                  class: isActive(it.href) ? "text-snow" : "text-dim",
                  sw: isActive(it.href) ? 2 : 1.7
                }, null), _parent2, _scopeId);
                _push2(`</span><span class="${ssrRenderClass(["text-[10px] font-semibold", isActive(it.href) ? "text-snow" : "text-dim"])}"${_scopeId}>${ssrInterpolate(it.label)}</span>`);
                if (isActive(it.href)) {
                  _push2(`<span class="absolute bottom-0.5 h-1 w-1 rounded-full bg-vio"${_scopeId}></span>`);
                } else {
                  _push2(`<!---->`);
                }
              } else {
                return [
                  createVNode("span", { class: "relative" }, [
                    (openBlock(), createBlock(resolveDynamicComponent(it.Icon), {
                      size: 23,
                      class: isActive(it.href) ? "text-snow" : "text-dim",
                      sw: isActive(it.href) ? 2 : 1.7
                    }, null, 8, ["class", "sw"]))
                  ]),
                  createVNode("span", {
                    class: ["text-[10px] font-semibold", isActive(it.href) ? "text-snow" : "text-dim"]
                  }, toDisplayString(it.label), 3),
                  isActive(it.href) ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "absolute bottom-0.5 h-1 w-1 rounded-full bg-vio"
                  })) : createCommentVNode("", true)
                ];
              }
            }),
            _: 2
          }, _parent));
        } else {
          _push(`<button type="button"${ssrRenderAttr("aria-label", it.label)} class="pressable relative flex w-[20%] flex-col items-center justify-center gap-1 rounded-2xl cursor-pointer"><span class="relative">`);
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(it.Icon), {
            size: 23,
            class: "text-dim",
            sw: 1.7
          }, null), _parent);
          if (it.action === "cart" && unref(hydrated) && unref(cartCount) > 0) {
            _push(`<span class="absolute -top-2.5 -right-2.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-gradient-to-l from-neon to-ice px-1 text-[9.5px] font-extrabold text-ink">${ssrInterpolate(unref(cartCount) > 99 ? "99" : unref(cartCount))}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</span><span class="text-[10px] font-semibold text-dim">${ssrInterpolate(it.label)}</span></button>`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--></div></nav>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (searchOpen.value) {
          _push2(`<div class="fixed inset-0 z-[90] overflow-y-auto bg-ink/90 backdrop-blur-2xl" role="dialog" aria-modal="true" aria-label="جستجوی سریع"><div class="mx-auto min-h-svh w-full max-w-2xl px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-28"><div class="flex items-center gap-3"><div class="relative flex-1">`);
          _push2(ssrRenderComponent(unref(SearchIcon), {
            size: 20,
            class: "absolute top-1/2 right-4 -translate-y-1/2 text-dim"
          }, null, _parent));
          _push2(`<input${ssrRenderAttr("value", q.value)} placeholder="دنبال چه طعمی هستی؟ (انگور یخ، بلوبری…)" class="input h-14 rounded-2xl pr-12 text-[15px]" aria-label="جستجو"></div><button class="pressable grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/12 text-mist cursor-pointer" aria-label="بستن جستجو">`);
          _push2(ssrRenderComponent(unref(CloseIcon), { size: 20 }, null, _parent));
          _push2(`</button></div>`);
          if (q.value.trim().length < 2) {
            _push2(`<div class="mt-8"><p class="mb-3 text-[12px] font-bold text-dim">جستجوهای پرطرفدار</p><div class="flex flex-wrap gap-2"><!--[-->`);
            ssrRenderList(["انگور یخ", "بلوبری", "تنباکو", "نعناع", "سالت ۵۰", "پاد ۶۰۰۰"], (s) => {
              _push2(`<button class="pressable rounded-full border border-white/12 bg-white/4 px-4 py-2.5 text-[13px] text-mist cursor-pointer">${ssrInterpolate(s)}</button>`);
            });
            _push2(`<!--]--></div><p class="mt-10 mb-3 text-[12px] font-bold text-dim">برندهای معتبر</p><div class="flex flex-wrap gap-2"><!--[-->`);
            ssrRenderList(unref(BRANDS_LINE), (b) => {
              _push2(`<span dir="ltr" class="rounded-lg bg-white/4 px-3 py-2 text-[12px] font-bold tracking-wider text-mist">${ssrInterpolate(b)}</span>`);
            });
            _push2(`<!--]--></div></div>`);
          } else {
            _push2(`<div class="mt-6">`);
            if (busy.value) {
              _push2(`<div class="grid grid-cols-2 gap-4 pt-2" aria-busy="true"><!--[-->`);
              ssrRenderList(4, (i) => {
                _push2(`<div class="skeleton h-56 w-full"></div>`);
              });
              _push2(`<!--]--></div>`);
            } else if (hits.value && hits.value.length === 0) {
              _push2(`<div class="rounded-2xl border border-dashed border-white/12 p-10 text-center"><p class="text-4xl">🔍</p><p class="mt-3 text-sm font-semibold text-mist">چیزی پیدا نشد</p><p class="mt-1 text-[12px] text-dim">املا را بررسی کن یا کلمه دیگری را امتحان کن</p></div>`);
            } else {
              _push2(`<div class="grid grid-cols-2 gap-4 sm:grid-cols-3"><!--[-->`);
              ssrRenderList(hits.value ?? [], (h) => {
                _push2(`<button class="text-right cursor-pointer"><div class="card-g overflow-hidden rounded-2xl"><img${ssrRenderAttr("src", h.image)}${ssrRenderAttr("alt", h.name)} class="aspect-[4/5] w-full object-cover" loading="lazy"></div><p dir="ltr" class="mt-2 truncate text-right text-[13px] font-bold text-snow">${ssrInterpolate(h.name)}</p><p class="mt-0.5 text-[11px] font-semibold text-neon tnum">${ssrInterpolate(h.price.toLocaleString("en-US"))} تومان </p></button>`);
              });
              _push2(`<!--]--></div>`);
            }
            _push2(`</div>`);
          }
          _push2(`</div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vapor/BottomNav.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const BottomNav = Object.assign(_sfc_main$7, { __name: "VaporBottomNav" });
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "FooterV",
  __ssrInlineRender: true,
  setup(__props) {
    const cols = [
      {
        t: "دسترسی سریع",
        links: [
          ["خانه", "/"],
          ["دسته‌بندی‌ها", "/categories"],
          ["فروشگاه", "/shop"],
          ["جدیدترین‌ها", "/shop?sort=newest"]
        ]
      },
      {
        t: "خدمات",
        links: [
          ["پیگیری سفارش", "/account"],
          ["سبد خرید", "/cart"],
          ["تکمیل خرید", "/checkout"],
          ["حساب کاربری", "/account"]
        ]
      },
      {
        t: "خرید مطمئن",
        links: [
          ["ضمانت اصالت کالا", "/categories"],
          ["راهنمای انتخاب", "/categories"],
          ["پرداخت در محل", "/checkout"],
          ["تماس: ۰۲۱-۹۱۰۰۲۲۳۳", "tel:02191002233"]
        ]
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "mt-16 border-t border-white/8 bg-[#0b0b0f]" }, _attrs))}><div class="wrap grid gap-10 py-12 md:grid-cols-[1.3fr_repeat(3,1fr)]"><div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center gap-2.5"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-vio"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(DropletIcon), { size: 22 }, null, _parent2, _scopeId));
            _push2(`</span><span dir="ltr" class="text-[15px] font-extrabold tracking-[0.3em] text-snow"${_scopeId}>${ssrInterpolate(unref(SITE).latin)}</span>`);
          } else {
            return [
              createVNode("span", { class: "text-vio" }, [
                createVNode(unref(DropletIcon), { size: 22 })
              ]),
              createVNode("span", {
                dir: "ltr",
                class: "text-[15px] font-extrabold tracking-[0.3em] text-snow"
              }, toDisplayString(unref(SITE).latin), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<p class="mt-4 max-w-xs text-[12.5px] leading-6 text-dim"> فروشگاه تخصصی ویپ، سالت و پاد — فقط با کالای اورجینال و هولوگرام‌دار. ${ssrInterpolate(unref(SITE).tagline)}. </p><p class="mt-4 text-[12px] font-bold text-mist" dir="ltr">${ssrInterpolate(unref(SITE).phone)}</p></div><!--[-->`);
      ssrRenderList(cols, (c) => {
        _push(`<nav${ssrRenderAttr("aria-label", c.t)}><p class="mb-4 text-[12px] font-extrabold text-snow">${ssrInterpolate(c.t)}</p><ul class="space-y-2.5"><!--[-->`);
        ssrRenderList(c.links, ([l, h]) => {
          _push(`<li>`);
          if (h.startsWith("tel:")) {
            _push(`<a${ssrRenderAttr("href", h)} class="text-[12.5px] text-dim transition-colors hover:text-vio">${ssrInterpolate(l)}</a>`);
          } else {
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: h,
              class: "text-[12.5px] text-dim transition-colors hover:text-vio"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(l)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(l), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          }
          _push(`</li>`);
        });
        _push(`<!--]--></ul></nav>`);
      });
      _push(`<!--]--></div><div class="border-t border-white/8 px-5 py-6"><p class="mx-auto max-w-3xl text-center text-[10.5px] leading-5 text-dim/80">${ssrInterpolate(unref(DISCLAIMER))}</p><p class="mt-3 text-center text-[11px] text-dim"> © ۱۴۰۴ ${ssrInterpolate(unref(SITE).name)} — کلیه حقوق محفوظ است. فروش فقط به افراد بالای ۱۸ سال. </p></div></footer>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vapor/FooterV.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const FooterV = Object.assign(_sfc_main$6, { __name: "VaporFooterV" });
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "CartSheet",
  __ssrInlineRender: true,
  setup(__props) {
    const { cartOpen, setCartOpen, cart, cartTotal, cartCount, setQty, remove, hydrated } = useVape();
    const remaining = computed(() => FREE_SHIPPING - cartTotal.value);
    const progress = computed(() => Math.min(100, cartTotal.value / FREE_SHIPPING * 100));
    const increment = (k, currentQty) => {
      haptic(6);
      setQty(k, currentQty + 1);
    };
    const decrement = (k, currentQty) => {
      haptic(6);
      setQty(k, currentQty - 1);
    };
    const goToCheckout = () => {
      haptic(12);
      setCartOpen(false);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(ssrRenderComponent(BottomSheet, mergeProps({
        open: unref(cartOpen),
        label: "سبد خرید",
        onClose: ($event) => unref(setCartOpen)(false)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between px-5 pb-2"${_scopeId}><h2 class="flex items-center gap-2 text-[16px] font-extrabold text-snow"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(BagIcon), {
              size: 19,
              class: "text-vio"
            }, null, _parent2, _scopeId));
            _push2(` سبد خرید <span class="text-[12px] font-bold text-dim tnum"${_scopeId}>(${ssrInterpolate(unref(cartCount))})</span></h2>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/cart",
              class: "pressable flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-bold text-vio",
              onClick: ($event) => unref(setCartOpen)(false)
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` مشاهده کامل `);
                  _push3(ssrRenderComponent(unref(ArrowLeftIcon), { size: 14 }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createTextVNode(" مشاهده کامل "),
                    createVNode(unref(ArrowLeftIcon), { size: 14 })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            if (!unref(hydrated) || unref(cart).length === 0) {
              _push2(`<div class="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center"${_scopeId}><span class="text-5xl"${_scopeId}>🛒</span><p class="text-[15px] font-extrabold text-snow"${_scopeId}>سبدت خالیه</p><p class="max-w-[240px] text-[12px] leading-6 text-dim"${_scopeId}> چند تا پاد خوش‌طعم و سالت اصل می‌تونه امروز همدمت باشه. </p><button class="pressable h-12 rounded-2xl bg-gradient-to-l from-vio to-ice px-8 text-[13px] font-extrabold text-ink cursor-pointer"${_scopeId}> برو به فروشگاه </button></div>`);
            } else {
              _push2(`<!--[--><div class="mx-5 mt-2 rounded-xl border border-white/8 bg-white/4 px-4 py-3"${_scopeId}>`);
              if (remaining.value > 0) {
                _push2(`<p class="text-[11.5px] text-mist"${_scopeId}> تا <strong class="text-ice"${_scopeId}>${ssrInterpolate(unref(money)(remaining.value))}</strong> دیگه ارسال رایگانه 🚚 </p>`);
              } else {
                _push2(`<p class="text-[11.5px] font-bold text-neon"${_scopeId}> ارسال سفارشت رایگان شد 🎉 </p>`);
              }
              _push2(`<div class="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"${_scopeId}><div class="h-full rounded-full bg-gradient-to-l from-vio via-ice to-neon transition-all duration-500 ease-out" style="${ssrRenderStyle({ width: `${progress.value}%` })}"${_scopeId}></div></div></div><ul class="flex-1 space-y-3 overflow-y-auto px-5 py-4"${_scopeId}><!--[-->`);
              ssrRenderList(unref(cart), (c) => {
                _push2(`<li class="card-g flex gap-3 rounded-2xl p-3"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_NuxtLink, {
                  to: `/product/${c.slug}`,
                  class: "shrink-0 overflow-hidden rounded-xl",
                  onClick: ($event) => unref(setCartOpen)(false)
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<img${ssrRenderAttr("src", c.img)}${ssrRenderAttr("alt", c.name)} class="h-24 w-20 object-cover" loading="lazy"${_scopeId2}>`);
                    } else {
                      return [
                        createVNode("img", {
                          src: c.img,
                          alt: c.name,
                          class: "h-24 w-20 object-cover",
                          loading: "lazy"
                        }, null, 8, ["src", "alt"])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`<div class="flex min-w-0 flex-1 flex-col"${_scopeId}><div class="flex items-start justify-between gap-2"${_scopeId}><div class="min-w-0"${_scopeId}><p dir="ltr" class="truncate text-right text-[13px] font-extrabold text-snow"${_scopeId}>${ssrInterpolate(c.name)}</p><p class="mt-0.5 text-[11px] text-mist"${_scopeId}>`);
                if (c.flavor) {
                  _push2(`<span${_scopeId}>طعم: ${ssrInterpolate(c.flavor)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                if (c.flavor && c.nicotine) {
                  _push2(`<span${_scopeId}> · </span>`);
                } else {
                  _push2(`<!---->`);
                }
                if (c.nicotine) {
                  _push2(`<span dir="ltr"${_scopeId}>نیکوتین ${ssrInterpolate(c.nicotine)}mg</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</p></div><button class="pressable grid h-9 w-9 shrink-0 place-items-center rounded-xl text-dim hover:bg-white/6 hover:text-blush cursor-pointer" aria-label="حذف از سبد"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(TrashIcon), { size: 16 }, null, _parent2, _scopeId));
                _push2(`</button></div><div class="mt-auto flex items-center justify-between pt-2"${_scopeId}><div class="flex h-9 items-center overflow-hidden rounded-xl border border-white/12" dir="ltr"${_scopeId}><button class="grid h-full w-9 place-items-center text-snow active:bg-white/8 cursor-pointer" aria-label="افزایش تعداد"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(PlusIcon), { size: 14 }, null, _parent2, _scopeId));
                _push2(`</button><span class="grid h-full w-8 place-items-center text-[13px] font-extrabold text-snow tnum"${_scopeId}>${ssrInterpolate(c.qty)}</span><button class="grid h-full w-9 place-items-center text-snow active:bg-white/8 cursor-pointer" aria-label="کاهش تعداد"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(MinusIcon), { size: 14 }, null, _parent2, _scopeId));
                _push2(`</button></div><p class="text-[14px] font-extrabold text-neon tnum"${_scopeId}>${ssrInterpolate(unref(money)(c.price * c.qty))}</p></div></div></li>`);
              });
              _push2(`<!--]--></ul><div class="border-t border-white/8 px-5 pt-4 pb-4"${_scopeId}><div class="mb-4 flex items-center justify-between"${_scopeId}><span class="text-[13px] text-mist"${_scopeId}>جمع کل</span><span class="text-[17px] font-extrabold text-snow tnum"${_scopeId}>${ssrInterpolate(unref(money)(unref(cartTotal)))}</span></div>`);
              _push2(ssrRenderComponent(_component_NuxtLink, {
                to: "/checkout",
                class: "pressable flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-vio to-ice text-[15px] font-extrabold text-ink glow-v",
                onClick: goToCheckout
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` ادامه خرید و پرداخت `);
                    _push3(ssrRenderComponent(unref(ArrowLeftIcon), {
                      size: 17,
                      sw: 2.4
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createTextVNode(" ادامه خرید و پرداخت "),
                      createVNode(unref(ArrowLeftIcon), {
                        size: 17,
                        sw: 2.4
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<p class="mt-3 text-center text-[10.5px] text-dim"${_scopeId}> پرداخت در محل برای تهران فعال است · کالا ۱۰۰٪ اورجینال </p></div><!--]-->`);
            }
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between px-5 pb-2" }, [
                createVNode("h2", { class: "flex items-center gap-2 text-[16px] font-extrabold text-snow" }, [
                  createVNode(unref(BagIcon), {
                    size: 19,
                    class: "text-vio"
                  }),
                  createTextVNode(" سبد خرید "),
                  createVNode("span", { class: "text-[12px] font-bold text-dim tnum" }, "(" + toDisplayString(unref(cartCount)) + ")", 1)
                ]),
                createVNode(_component_NuxtLink, {
                  to: "/cart",
                  class: "pressable flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-bold text-vio",
                  onClick: ($event) => unref(setCartOpen)(false)
                }, {
                  default: withCtx(() => [
                    createTextVNode(" مشاهده کامل "),
                    createVNode(unref(ArrowLeftIcon), { size: 14 })
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ]),
              !unref(hydrated) || unref(cart).length === 0 ? (openBlock(), createBlock("div", {
                key: 0,
                class: "flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center"
              }, [
                createVNode("span", { class: "text-5xl" }, "🛒"),
                createVNode("p", { class: "text-[15px] font-extrabold text-snow" }, "سبدت خالیه"),
                createVNode("p", { class: "max-w-[240px] text-[12px] leading-6 text-dim" }, " چند تا پاد خوش‌طعم و سالت اصل می‌تونه امروز همدمت باشه. "),
                createVNode("button", {
                  class: "pressable h-12 rounded-2xl bg-gradient-to-l from-vio to-ice px-8 text-[13px] font-extrabold text-ink cursor-pointer",
                  onClick: ($event) => unref(setCartOpen)(false)
                }, " برو به فروشگاه ", 8, ["onClick"])
              ])) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                createVNode("div", { class: "mx-5 mt-2 rounded-xl border border-white/8 bg-white/4 px-4 py-3" }, [
                  remaining.value > 0 ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "text-[11.5px] text-mist"
                  }, [
                    createTextVNode(" تا "),
                    createVNode("strong", { class: "text-ice" }, toDisplayString(unref(money)(remaining.value)), 1),
                    createTextVNode(" دیگه ارسال رایگانه 🚚 ")
                  ])) : (openBlock(), createBlock("p", {
                    key: 1,
                    class: "text-[11.5px] font-bold text-neon"
                  }, " ارسال سفارشت رایگان شد 🎉 ")),
                  createVNode("div", { class: "mt-2 h-1.5 overflow-hidden rounded-full bg-white/10" }, [
                    createVNode("div", {
                      class: "h-full rounded-full bg-gradient-to-l from-vio via-ice to-neon transition-all duration-500 ease-out",
                      style: { width: `${progress.value}%` }
                    }, null, 4)
                  ])
                ]),
                createVNode("ul", { class: "flex-1 space-y-3 overflow-y-auto px-5 py-4" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(cart), (c) => {
                    return openBlock(), createBlock("li", {
                      key: c.k,
                      class: "card-g flex gap-3 rounded-2xl p-3"
                    }, [
                      createVNode(_component_NuxtLink, {
                        to: `/product/${c.slug}`,
                        class: "shrink-0 overflow-hidden rounded-xl",
                        onClick: ($event) => unref(setCartOpen)(false)
                      }, {
                        default: withCtx(() => [
                          createVNode("img", {
                            src: c.img,
                            alt: c.name,
                            class: "h-24 w-20 object-cover",
                            loading: "lazy"
                          }, null, 8, ["src", "alt"])
                        ]),
                        _: 2
                      }, 1032, ["to", "onClick"]),
                      createVNode("div", { class: "flex min-w-0 flex-1 flex-col" }, [
                        createVNode("div", { class: "flex items-start justify-between gap-2" }, [
                          createVNode("div", { class: "min-w-0" }, [
                            createVNode("p", {
                              dir: "ltr",
                              class: "truncate text-right text-[13px] font-extrabold text-snow"
                            }, toDisplayString(c.name), 1),
                            createVNode("p", { class: "mt-0.5 text-[11px] text-mist" }, [
                              c.flavor ? (openBlock(), createBlock("span", { key: 0 }, "طعم: " + toDisplayString(c.flavor), 1)) : createCommentVNode("", true),
                              c.flavor && c.nicotine ? (openBlock(), createBlock("span", { key: 1 }, " · ")) : createCommentVNode("", true),
                              c.nicotine ? (openBlock(), createBlock("span", {
                                key: 2,
                                dir: "ltr"
                              }, "نیکوتین " + toDisplayString(c.nicotine) + "mg", 1)) : createCommentVNode("", true)
                            ])
                          ]),
                          createVNode("button", {
                            class: "pressable grid h-9 w-9 shrink-0 place-items-center rounded-xl text-dim hover:bg-white/6 hover:text-blush cursor-pointer",
                            "aria-label": "حذف از سبد",
                            onClick: ($event) => unref(remove)(c.k)
                          }, [
                            createVNode(unref(TrashIcon), { size: 16 })
                          ], 8, ["onClick"])
                        ]),
                        createVNode("div", { class: "mt-auto flex items-center justify-between pt-2" }, [
                          createVNode("div", {
                            class: "flex h-9 items-center overflow-hidden rounded-xl border border-white/12",
                            dir: "ltr"
                          }, [
                            createVNode("button", {
                              class: "grid h-full w-9 place-items-center text-snow active:bg-white/8 cursor-pointer",
                              "aria-label": "افزایش تعداد",
                              onClick: ($event) => increment(c.k, c.qty)
                            }, [
                              createVNode(unref(PlusIcon), { size: 14 })
                            ], 8, ["onClick"]),
                            createVNode("span", { class: "grid h-full w-8 place-items-center text-[13px] font-extrabold text-snow tnum" }, toDisplayString(c.qty), 1),
                            createVNode("button", {
                              class: "grid h-full w-9 place-items-center text-snow active:bg-white/8 cursor-pointer",
                              "aria-label": "کاهش تعداد",
                              onClick: ($event) => decrement(c.k, c.qty)
                            }, [
                              createVNode(unref(MinusIcon), { size: 14 })
                            ], 8, ["onClick"])
                          ]),
                          createVNode("p", { class: "text-[14px] font-extrabold text-neon tnum" }, toDisplayString(unref(money)(c.price * c.qty)), 1)
                        ])
                      ])
                    ]);
                  }), 128))
                ]),
                createVNode("div", { class: "border-t border-white/8 px-5 pt-4 pb-4" }, [
                  createVNode("div", { class: "mb-4 flex items-center justify-between" }, [
                    createVNode("span", { class: "text-[13px] text-mist" }, "جمع کل"),
                    createVNode("span", { class: "text-[17px] font-extrabold text-snow tnum" }, toDisplayString(unref(money)(unref(cartTotal))), 1)
                  ]),
                  createVNode(_component_NuxtLink, {
                    to: "/checkout",
                    class: "pressable flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-vio to-ice text-[15px] font-extrabold text-ink glow-v",
                    onClick: goToCheckout
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" ادامه خرید و پرداخت "),
                      createVNode(unref(ArrowLeftIcon), {
                        size: 17,
                        sw: 2.4
                      })
                    ]),
                    _: 1
                  }),
                  createVNode("p", { class: "mt-3 text-center text-[10.5px] text-dim" }, " پرداخت در محل برای تهران فعال است · کالا ۱۰۰٪ اورجینال ")
                ])
              ], 64))
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vapor/CartSheet.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const CartSheet = Object.assign(_sfc_main$5, { __name: "VaporCartSheet" });
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "AgeGate",
  __ssrInlineRender: true,
  setup(__props) {
    const { ageOk, hydrated } = useVape();
    const under = ref(false);
    const updateOverflow = () => {
      return;
    };
    watch([hydrated, ageOk, under], updateOverflow);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0;
      _push(ssrRenderComponent(_component_ClientOnly, _attrs, {}, _parent));
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vapor/AgeGate.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const AgeGate = Object.assign(_sfc_main$4, { __name: "VaporAgeGate" });
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "Toasts",
  __ssrInlineRender: true,
  setup(__props) {
    const { toasts } = useVape();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pointer-events-none fixed inset-x-0 bottom-24 z-[100] flex flex-col items-center gap-2 px-4 lg:bottom-8" }, _attrs))}><!--[-->`);
      ssrRenderList(unref(toasts), (t) => {
        _push(`<div class="${ssrRenderClass([[
          t.kind === "ok" ? "border-neon/25 bg-[#0c120e]/92 text-neon" : "border-blush/25 bg-[#160c14]/92 text-blush"
        ], "pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-xl"])}"><span class="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/8">`);
        if (t.kind === "ok") {
          _push(ssrRenderComponent(unref(CheckIcon), {
            size: 13,
            sw: 2.6
          }, null, _parent));
        } else {
          _push(ssrRenderComponent(unref(CloseIcon), {
            size: 13,
            sw: 2.6
          }, null, _parent));
        }
        _push(`</span><p class="text-[13px] font-bold text-snow">${ssrInterpolate(t.msg)}</p><button class="mr-1 text-dim cursor-pointer" aria-label="بستن پیام">`);
        _push(ssrRenderComponent(unref(CloseIcon), { size: 14 }, null, _parent));
        _push(`</button></div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vapor/Toasts.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const Toasts = Object.assign(_sfc_main$3, { __name: "VaporToasts" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "IceMeter",
  __ssrInlineRender: true,
  props: {
    level: { default: 0 },
    max: { default: 5 }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "flex items-center gap-1.5",
        title: `میزان خنکی: ${__props.level} از ${__props.max}`
      }, _attrs))}><div class="flex items-end gap-1"><!--[-->`);
      ssrRenderList(__props.max, (i) => {
        _push(`<span class="${ssrRenderClass([
          i <= __props.level ? "bg-ice shadow-[0_0_8px_rgba(125,211,252,0.9)]" : "bg-white/15",
          "w-1.5 rounded-full transition-all duration-300"
        ])}" style="${ssrRenderStyle({ height: `${8 + i * 2.5}px` })}"></span>`);
      });
      _push(`<!--]--></div><span class="ms-1 text-[11px] font-extrabold text-ice"> ❄️ ${ssrInterpolate(__props.level)}/${ssrInterpolate(__props.max)}</span></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vapor/IceMeter.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const IceMeter = Object.assign(_sfc_main$2, { __name: "VaporIceMeter" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AIAssistant",
  __ssrInlineRender: true,
  setup(__props) {
    useVape();
    const isOpen = ref(false);
    const activeTab = ref("wizard");
    const inputMessage = ref("");
    const isTyping = ref(false);
    ref(null);
    const wizard = ref({
      goal: "smoke",
      category: "salts",
      taste: "fruity",
      cooling: 3
    });
    const goals = [
      { id: "smoke", label: "ترک سیگار", sub: "گیرایی و نیکوتین قوی", emoji: "🚬" },
      { id: "hookah", label: "جایگزین قلیان", sub: "دود زیاد و طعم میوه‌ای", emoji: "💨" },
      { id: "newbie", label: "اولین بار / تفریحی", sub: "ساده بدون تنظیمات", emoji: "🌱" },
      { id: "pro", label: "کاربر با سابقه", sub: "طعم‌های پیچیده و کاستوم", emoji: "⚡" }
    ];
    const tastes = [
      { id: "fruity", label: "میوه‌ای و استوایی", desc: "انبه، بلوبری، هلو، هندوانه", icon: "🥭" },
      { id: "ice", label: "خنک و آیس (Ice)", desc: "یخ، نعناع، طراوت شدید گلو", icon: "❄️" },
      { id: "tobacco", label: "تنباکویی و سیگاری", desc: "تنباکو کوبایی، وانیل تنباکو", icon: "🍂" },
      { id: "dessert", label: "دسری و شیرین", desc: "کیک خامه‌ای، کارامل، کاستارد", icon: "🧁" }
    ];
    const messages = ref([
      {
        id: "welcome-1",
        sender: "bot",
        text: "سلام! من **دستیار هوشمند ویپورا** هستم ☁️✨\nمی‌تونم بر اساس نیاز، ذائقه و بودجه شما دقیق‌ترین طعم و دستگاه رو بهتون پیشنهاد بدم یا به هر سوالتون درباره ویپینگ پاسخ بدم.",
        time: (/* @__PURE__ */ new Date()).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })
      }
    ]);
    const quickPrompts = [
      "ارزان‌ترین پادهای موجود 🏷️",
      "یه سالت میوه‌ای فوق خنک ❄️",
      "بهترین سالت برای ترک سیگار 🍂",
      "پرفروش‌ترین پادهای ۱۰۰۰۰ پاف 🔥",
      "تفاوت سالت با جویس چیه؟ 🤔"
    ];
    const closeAssistant = () => {
      isOpen.value = false;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(_attrs)}><button class="fixed bottom-20 left-4 lg:bottom-7 lg:left-7 z-[60] flex items-center gap-2.5 rounded-full border border-vio/50 bg-gradient-to-r from-[#17142b]/95 to-[#0e0e13]/95 p-2.5 pe-4 text-snow shadow-[0_8px_30px_rgba(167,139,250,0.4)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-vio hover:shadow-[0_10px_35px_rgba(167,139,250,0.6)] group cursor-pointer" aria-label="مشاور هوشمند طعم"><span class="relative grid h-10 w-10 place-items-center rounded-full bg-gradient-to-tr from-vio to-ice text-ink font-bold shadow-md"><span class="pulse-ring absolute inset-0 rounded-full bg-vio/40"></span>`);
      _push(ssrRenderComponent(unref(ZapIcon), {
        size: 20,
        class: "relative z-10"
      }, null, _parent));
      _push(`</span><div class="text-right"><p class="text-[12.5px] font-extrabold leading-tight text-snow flex items-center gap-1"> مشاور هوشمند <span class="h-2 w-2 rounded-full bg-neon animate-pulse"></span></p><p class="text-[10px] text-vio font-bold">پیشنهاد طعم و نیکوتین</p></div></button>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (isOpen.value) {
          _push2(`<div class="relative z-[95]"><div class="fixed inset-0 bg-black/70 backdrop-blur-[6px]"></div><div class="fixed inset-x-0 bottom-0 lg:inset-auto lg:bottom-6 lg:left-6 lg:w-[460px] h-[85vh] lg:h-[650px] max-h-[90vh] flex flex-col rounded-t-[30px] lg:rounded-[28px] border border-vio/30 bg-[#0d0d12]/98 shadow-[0_20px_70px_rgba(0,0,0,0.9)] backdrop-blur-2xl overflow-hidden"><div class="relative px-5 py-4 border-b border-white/10 bg-gradient-to-r from-vio/15 via-transparent to-ice/10 flex items-center justify-between"><div class="flex items-center gap-3"><div class="relative grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-vio to-ice text-ink shadow-lg">`);
          _push2(ssrRenderComponent(unref(ZapIcon), { size: 20 }, null, _parent));
          _push2(`<span class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0e0e13] bg-neon"></span></div><div><h3 class="text-[14.5px] font-extrabold text-snow flex items-center gap-1.5"> دستیار و استعدادیاب طعم <span class="rounded-lg bg-vio/20 px-2 py-0.5 text-[9.5px] font-bold text-vio">AI</span></h3><p class="text-[11px] text-mist">پاسخگویی آنی و تحلیل اختصاصی ذائقه</p></div></div><button class="pressable grid h-9 w-9 place-items-center rounded-xl bg-white/6 text-dim hover:text-snow cursor-pointer" aria-label="بستن">`);
          _push2(ssrRenderComponent(unref(CloseIcon), { size: 16 }, null, _parent));
          _push2(`</button></div><div class="flex border-b border-white/8 bg-white/[0.02] p-1.5 gap-1.5"><button class="${ssrRenderClass([activeTab.value === "wizard" ? "bg-vio/20 text-vio border border-vio/40 shadow-sm" : "text-dim hover:text-mist", "flex-1 py-2 rounded-xl text-[12px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"])}">`);
          _push2(ssrRenderComponent(unref(FlameIcon), { size: 14 }, null, _parent));
          _push2(` تست انتخاب طعم (Wizard) </button><button class="${ssrRenderClass([activeTab.value === "chat" ? "bg-vio/20 text-vio border border-vio/40 shadow-sm" : "text-dim hover:text-mist", "flex-1 py-2 rounded-xl text-[12px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"])}">`);
          _push2(ssrRenderComponent(unref(DropletIcon), { size: 14 }, null, _parent));
          _push2(` گفتگوی آزاد با هوش مصنوعی </button></div>`);
          if (activeTab.value === "wizard") {
            _push2(`<div class="flex-1 overflow-y-auto p-5 space-y-6"><div><label class="block text-[12.5px] font-extrabold text-snow mb-2.5"> ۱. هدف اصلی شما از مصرف ویپ چیست؟ </label><div class="grid grid-cols-2 gap-2"><!--[-->`);
            ssrRenderList(goals, (g) => {
              _push2(`<button class="${ssrRenderClass([wizard.value.goal === g.id ? "border-vio bg-vio/15 glow-v" : "border-white/10 bg-white/3 text-mist", "pressable p-3 rounded-2xl border text-right transition-all cursor-pointer"])}"><span class="text-xl block mb-1">${ssrInterpolate(g.emoji)}</span><p class="text-[13px] font-extrabold text-snow">${ssrInterpolate(g.label)}</p><p class="text-[10px] text-dim mt-0.5">${ssrInterpolate(g.sub)}</p></button>`);
            });
            _push2(`<!--]--></div></div><div><label class="block text-[12.5px] font-extrabold text-snow mb-2.5"> ۲. سلیقه طعمی مورد علاقه شما: </label><div class="grid grid-cols-2 gap-2"><!--[-->`);
            ssrRenderList(tastes, (t) => {
              _push2(`<button class="${ssrRenderClass([wizard.value.taste === t.id ? "border-neon bg-neon/12 glow-g" : "border-white/10 bg-white/3 text-mist", "pressable p-3 rounded-2xl border text-right transition-all cursor-pointer"])}"><span class="text-xl block mb-1">${ssrInterpolate(t.icon)}</span><p class="text-[13px] font-extrabold text-snow">${ssrInterpolate(t.label)}</p><p class="text-[10.5px] text-dim mt-0.5">${ssrInterpolate(t.desc)}</p></button>`);
            });
            _push2(`<!--]--></div></div><div class="rounded-2xl border border-white/10 bg-white/3 p-4"><div class="flex items-center justify-between mb-2"><span class="text-[12.5px] font-extrabold text-snow">۳. میزان خنکی و حس یخ (Ice Level):</span>`);
            _push2(ssrRenderComponent(IceMeter, {
              level: wizard.value.cooling
            }, null, _parent));
            _push2(`</div><input type="range" min="0" max="5" step="1"${ssrRenderAttr("value", wizard.value.cooling)} class="w-full accent-[#7dd3fc] cursor-pointer"><div class="flex justify-between text-[10.5px] text-dim mt-1.5"><span>بدون خنکی (گرم)</span><span>متعادل (آیس استاندارد)</span><span>یخ قطبی ❄️🔥</span></div></div><button class="pressable w-full h-14 rounded-2xl bg-gradient-to-l from-vio to-ice text-ink text-[14.5px] font-extrabold glow-v flex items-center justify-center gap-2 cursor-pointer">`);
            _push2(ssrRenderComponent(unref(ZapIcon), {
              size: 18,
              sw: 2.4
            }, null, _parent));
            _push2(` یافتن بهترین طعم و دستگاه من </button></div>`);
          } else {
            _push2(`<div class="flex-1 flex flex-col min-h-0"><div class="flex-1 overflow-y-auto p-4 space-y-4"><!--[-->`);
            ssrRenderList(messages.value, (msg) => {
              _push2(`<div class="${ssrRenderClass([msg.sender === "user" ? "items-end" : "items-start", "flex flex-col gap-1.5"])}"><div class="${ssrRenderClass([
                msg.sender === "user" ? "bg-gradient-to-r from-vio to-vio/80 text-white rounded-br-none shadow-md" : "card-g text-snow rounded-bl-none border border-white/12",
                "max-w-[88%] rounded-[20px] p-3.5 text-[13px] leading-6"
              ])}"><p class="whitespace-pre-line">${ssrInterpolate(msg.text)}</p>`);
              if (msg.products && msg.products.length > 0) {
                _push2(`<div class="mt-3.5 space-y-2.5 pt-2 border-t border-white/10"><!--[-->`);
                ssrRenderList(msg.products, (rec) => {
                  _push2(`<div class="p-3 rounded-xl bg-[#0e0e14]/90 border border-white/10 flex flex-col gap-2 transition-all hover:border-vio/40"><div class="flex gap-3 items-center">`);
                  _push2(ssrRenderComponent(_component_NuxtLink, {
                    to: `/product/${rec.product.slug}`,
                    onClick: closeAssistant,
                    class: "shrink-0 overflow-hidden rounded-lg"
                  }, {
                    default: withCtx((_, _push3, _parent2, _scopeId) => {
                      if (_push3) {
                        _push3(`<img${ssrRenderAttr("src", rec.product.images[0])}${ssrRenderAttr("alt", rec.product.name)} class="h-16 w-14 object-cover rounded-lg border border-white/10"${_scopeId}>`);
                      } else {
                        return [
                          createVNode("img", {
                            src: rec.product.images[0],
                            alt: rec.product.name,
                            class: "h-16 w-14 object-cover rounded-lg border border-white/10"
                          }, null, 8, ["src", "alt"])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent));
                  _push2(`<div class="min-w-0 flex-1"><div class="flex items-center justify-between gap-1">`);
                  _push2(ssrRenderComponent(_component_NuxtLink, {
                    to: `/product/${rec.product.slug}`,
                    onClick: closeAssistant,
                    dir: "ltr",
                    class: "text-[12.5px] font-extrabold text-snow truncate hover:text-vio"
                  }, {
                    default: withCtx((_, _push3, _parent2, _scopeId) => {
                      if (_push3) {
                        _push3(`${ssrInterpolate(rec.product.name)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(rec.product.name), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent));
                  _push2(`<span class="shrink-0 rounded-md bg-neon/15 border border-neon/30 px-1.5 py-0.5 text-[10px] font-extrabold text-neon"> ٪${ssrInterpolate(rec.matchScore)} تطابق </span></div><p class="text-[10.5px] text-vio font-medium mt-0.5">${ssrInterpolate(rec.reason)}</p>`);
                  if (rec.suggestedFlavor) {
                    _push2(`<div class="mt-1 flex items-center gap-1.5 flex-wrap"><span class="text-[9.5px] text-mist">طعم پیشنهادی:</span><span class="text-[10px] font-bold text-ice bg-ice/10 px-2 py-0.5 rounded-full border border-ice/25">${ssrInterpolate(rec.suggestedFlavor)}</span></div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`<div class="flex items-center justify-between mt-2 pt-1.5 border-t border-white/5"><div class="flex items-center gap-1.5"><span class="text-[12px] font-extrabold text-snow tnum">${ssrInterpolate(unref(money)(rec.product.discountPrice ?? rec.product.price))}</span>`);
                  if (rec.product.discountPrice) {
                    _push2(`<span class="text-[10px] text-dim line-through tnum">${ssrInterpolate(unref(money)(rec.product.price))}</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div><button class="pressable px-3 py-1 rounded-lg bg-gradient-to-l from-vio to-ice text-ink text-[11px] font-extrabold flex items-center gap-1 shadow-sm hover:brightness-110 cursor-pointer">`);
                  _push2(ssrRenderComponent(unref(PlusIcon), {
                    size: 13,
                    sw: 2.6
                  }, null, _parent));
                  _push2(` خرید مستقیم </button></div></div></div></div>`);
                });
                _push2(`<!--]--></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><span class="text-[9.5px] text-dim px-1">${ssrInterpolate(msg.time)}</span></div>`);
            });
            _push2(`<!--]-->`);
            if (isTyping.value) {
              _push2(`<div class="flex items-center gap-2 text-mist text-[12px] card-g p-3 rounded-2xl w-fit"><span class="flex gap-1"><span class="h-2 w-2 rounded-full bg-vio animate-bounce" style="${ssrRenderStyle({ "animation-delay": "0ms" })}"></span><span class="h-2 w-2 rounded-full bg-ice animate-bounce" style="${ssrRenderStyle({ "animation-delay": "150ms" })}"></span><span class="h-2 w-2 rounded-full bg-neon animate-bounce" style="${ssrRenderStyle({ "animation-delay": "300ms" })}"></span></span> در حال تحلیل هوشمند و آماده‌سازی پیشنهاد... </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="px-4 py-2 overflow-x-auto no-scrollbar flex gap-2 border-t border-white/6 bg-white/[0.01]"><!--[-->`);
            ssrRenderList(quickPrompts, (qp) => {
              _push2(`<button class="pressable shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-full border border-white/10 bg-white/4 text-mist hover:text-snow hover:border-vio/40 cursor-pointer">${ssrInterpolate(qp)}</button>`);
            });
            _push2(`<!--]--></div><form class="p-3 border-t border-white/10 flex items-center gap-2 bg-[#09090b]"><input${ssrRenderAttr("value", inputMessage.value)} placeholder="طعم، نیکوتین یا دستگاه مدنظرت رو بنویس..." class="input h-12 text-[13px] rounded-2xl flex-1 px-4"${ssrIncludeBooleanAttr(isTyping.value) ? " disabled" : ""}><button type="submit"${ssrIncludeBooleanAttr(!inputMessage.value.trim() || isTyping.value) ? " disabled" : ""} class="pressable h-12 w-12 grid place-items-center rounded-2xl bg-gradient-to-l from-vio to-ice text-ink font-bold disabled:opacity-40 cursor-pointer" aria-label="ارسال">`);
            _push2(ssrRenderComponent(unref(ArrowLeftIcon), {
              size: 18,
              sw: 2.6
            }, null, _parent));
            _push2(`</button></form></div>`);
          }
          _push2(`</div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vapor/AIAssistant.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AIAssistant = Object.assign(_sfc_main$1, { __name: "VaporAIAssistant" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "font-sans antialiased min-h-screen flex flex-col justify-between" }, _attrs))}><a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[130] focus:rounded-xl focus:bg-vio focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-ink"> پرش به محتوا </a>`);
      _push(ssrRenderComponent(BottomNav, null, null, _parent));
      _push(`<main id="main" class="pb-[92px] lg:pb-0 flex-1">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
      _push(ssrRenderComponent(FooterV, null, null, _parent));
      _push(ssrRenderComponent(CartSheet, null, null, _parent));
      _push(ssrRenderComponent(AgeGate, null, null, _parent));
      _push(ssrRenderComponent(Toasts, null, null, _parent));
      _push(ssrRenderComponent(AIAssistant, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-BZs00OfK.mjs.map
