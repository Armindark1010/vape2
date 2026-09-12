import { o as createError, c as SITE, _ as __nuxt_component_0, f as ChevronLeftIcon, p as FlameIcon, g as ShieldIcon, n as TruckIcon, R as RefreshIcon, u as useVape, m as money, j as StarIcon, P as PlusIcon, M as MinusIcon, k as HeartIcon, l as BagIcon, Z as ZapIcon } from './server.mjs';
import { defineComponent, computed, withAsyncContext, unref, mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, resolveDynamicComponent, openBlock, createBlock, Fragment, renderList, ref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderVNode, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';
import { S as SectionRow, P as ProductRail, R as RailItem } from './RailItem-C7_DSAjG.mjs';
import { P as ProductCard } from './ProductCard-CumuzPRn.mjs';
import { u as useFetch } from './fetch-D0KPqKjg.mjs';
import { u as useSeoMeta, a as useHead } from './v4-z_h3gB1X.mjs';
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
import '@vue/shared';

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "BuyBox",
  __ssrInlineRender: true,
  props: {
    product: {}
  },
  setup(__props) {
    const props = __props;
    useRouter();
    const { inWish } = useVape();
    const qty = ref(1);
    const opts = computed(() => {
      try {
        return props.product.specs?.options ? JSON.parse(props.product.specs.options) : null;
      } catch {
        return null;
      }
    });
    const flavor = ref(opts.value?.flavors?.[0] ?? null);
    const nic = ref(opts.value?.nicotine?.[0] ?? null);
    const price = computed(() => props.product.discountPrice ?? props.product.price);
    const pct = computed(
      () => props.product.discountPrice ? Math.round((props.product.price - props.product.discountPrice) / props.product.price * 100) : 0
    );
    const out = computed(() => props.product.stock <= 0);
    const saved = computed(() => inWish(props.product.id));
    const nics = computed(() => opts.value?.nicotine ?? []);
    const flavors = computed(() => opts.value?.flavors ?? []);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-5" }, _attrs))}><div><p dir="ltr" class="text-[11px] font-extrabold tracking-[0.18em] text-vio">${ssrInterpolate(__props.product.brand)}</p><h1 dir="ltr" class="mt-1.5 text-right text-[22px] font-extrabold leading-8 text-snow">${ssrInterpolate(__props.product.name)}</h1>`);
      if (__props.product.tagline) {
        _push(`<p class="mt-2 text-[13px] leading-6 text-mist">${ssrInterpolate(__props.product.tagline)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-center gap-3"><p class="text-[22px] font-extrabold text-snow tnum">${ssrInterpolate(unref(money)(price.value))}</p>`);
      if (__props.product.discountPrice != null) {
        _push(`<p class="text-[13px] text-dim line-through tnum">${ssrInterpolate(unref(money)(__props.product.price))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (pct.value > 0) {
        _push(`<span class="rounded-lg bg-neon/15 px-2 py-1 text-[11px] font-extrabold text-neon" dir="ltr"> ٪${ssrInterpolate(pct.value)} تخفیف </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-center gap-2 text-[12px]"><span class="flex items-center gap-1 font-bold text-snow" dir="ltr">`);
      _push(ssrRenderComponent(unref(StarIcon), {
        size: 15,
        filled: true,
        class: "text-gold"
      }, null, _parent));
      _push(` ${ssrInterpolate(__props.product.rating.toFixed(1))}</span><span class="text-dim tnum">(${ssrInterpolate(__props.product.reviewCount)} نظر)</span><span class="mx-1 text-dim">·</span>`);
      if (out.value) {
        _push(`<span class="font-extrabold text-blush">ناموجود — به‌زودی</span>`);
      } else if (__props.product.stock < 8) {
        _push(`<span class="font-extrabold text-gold">فقط ${ssrInterpolate(__props.product.stock)} عدد مونده 🔥</span>`);
      } else {
        _push(`<span class="flex items-center gap-1.5 font-extrabold text-neon"><span class="pulse-ring h-2 w-2 rounded-full bg-neon"></span> موجود در انبار </span>`);
      }
      _push(`</div>`);
      if (flavors.value.length > 0) {
        _push(`<div><p class="mb-2.5 text-[12px] font-extrabold text-mist">انتخاب طعم</p><div class="flex flex-wrap gap-2" role="radiogroup" aria-label="طعم"><!--[-->`);
        ssrRenderList(flavors.value, (f) => {
          _push(`<button role="radio"${ssrRenderAttr("aria-checked", flavor.value === f)} class="${ssrRenderClass([[
            flavor.value === f ? "border border-vio/60 bg-vio/15 text-snow glow-v" : "border border-white/10 bg-white/4 text-mist"
          ], "pressable relative h-12 min-w-[92px] rounded-2xl px-4 text-[13px] font-bold transition-colors duration-300 cursor-pointer"])}">`);
          if (flavor.value === f) {
            _push(`<span class="absolute inset-0 rounded-2xl border-2 border-vio pointer-events-none"></span>`);
          } else {
            _push(`<!---->`);
          }
          _push(` ${ssrInterpolate(f)}</button>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (nics.value.length > 0) {
        _push(`<div><p class="mb-2.5 text-[12px] font-extrabold text-mist">میزان نیکوتین</p><div class="flex gap-2" role="radiogroup" aria-label="نیکوتین"><!--[-->`);
        ssrRenderList(nics.value, (n) => {
          _push(`<button role="radio"${ssrRenderAttr("aria-checked", nic.value === n)} class="${ssrRenderClass([[
            nic.value === n ? "bg-gradient-to-l from-neon/90 to-ice/90 text-ink glow-g" : "border border-white/10 bg-white/4 text-mist"
          ], "pressable h-14 flex-1 rounded-2xl transition-all duration-300 cursor-pointer"])}"><span dir="ltr" class="block text-[15px] font-extrabold tnum">${ssrInterpolate(n)}mg</span><span class="block text-[9.5px] font-bold opacity-70">${ssrInterpolate(Number(n) >= 35 ? "قوی · سالت" : "ملایم")}</span></button>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (opts.value?.puffs) {
        _push(`<p class="rounded-xl border border-ice/20 bg-ice/8 px-4 py-2.5 text-[12px] text-ice"> 💨 تعداد پاف تقریبی: <strong dir="ltr">${ssrInterpolate(opts.value.puffs)}</strong></p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex items-center gap-3"><span class="text-[12px] font-extrabold text-mist">تعداد</span><div class="flex h-12 items-center overflow-hidden rounded-2xl border border-white/12" dir="ltr"><button class="grid h-full w-12 place-items-center text-snow active:bg-white/8 cursor-pointer" aria-label="افزایش">`);
      _push(ssrRenderComponent(unref(PlusIcon), { size: 16 }, null, _parent));
      _push(`</button><span class="grid h-full w-10 place-items-center text-[15px] font-extrabold text-snow tnum">${ssrInterpolate(qty.value)}</span><button class="grid h-full w-12 place-items-center text-snow active:bg-white/8 cursor-pointer" aria-label="کاهش">`);
      _push(ssrRenderComponent(unref(MinusIcon), { size: 16 }, null, _parent));
      _push(`</button></div><button class="${ssrRenderClass([[
        saved.value ? "border-blush/50 bg-blush/15 text-blush" : "border-white/12 text-mist"
      ], "pressable grid h-12 w-12 place-items-center rounded-2xl border cursor-pointer"])}"${ssrRenderAttr("aria-pressed", saved.value)} aria-label="علاقه‌مندی">`);
      _push(ssrRenderComponent(unref(HeartIcon), {
        size: 20,
        filled: saved.value
      }, null, _parent));
      _push(`</button></div><div class="grid grid-cols-2 gap-3"><button${ssrIncludeBooleanAttr(out.value) ? " disabled" : ""} class="pressable flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-vio to-ice text-[14.5px] font-extrabold text-ink glow-v disabled:opacity-50 cursor-pointer">`);
      _push(ssrRenderComponent(unref(BagIcon), {
        size: 18,
        sw: 2.2
      }, null, _parent));
      _push(` افزودن به سبد </button><button${ssrIncludeBooleanAttr(out.value) ? " disabled" : ""} class="pressable flex h-14 items-center justify-center gap-2 rounded-2xl border border-neon/40 bg-neon/10 text-[14.5px] font-extrabold text-neon disabled:opacity-50 cursor-pointer">`);
      _push(ssrRenderComponent(unref(ZapIcon), {
        size: 18,
        sw: 2.2
      }, null, _parent));
      _push(` خرید فوری </button></div><div class="grid grid-cols-3 gap-2"><!--[-->`);
      ssrRenderList([
        { I: unref(ShieldIcon), t: "ضمانت اصالت" },
        { I: unref(TruckIcon), t: "ارسال امروز" },
        { I: unref(StarIcon), t: "بازگشت ۷ روزه" }
      ], (item) => {
        _push(`<div class="flex flex-col items-center gap-1.5 rounded-2xl border border-white/8 bg-white/3 px-2 py-3 text-center">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.I), {
          size: 17,
          class: "text-vio"
        }, null), _parent);
        _push(`<span class="text-[10px] font-bold text-mist">${ssrInterpolate(item.t)}</span></div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vapor/BuyBox.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const BuyBox = Object.assign(_sfc_main$2, { __name: "VaporBuyBox" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Gallery",
  __ssrInlineRender: true,
  props: {
    images: {},
    name: {}
  },
  setup(__props) {
    const props = __props;
    const imgs = computed(() => props.images && props.images.length ? props.images : [""]);
    const i = ref(0);
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="relative touch-pan-y overflow-hidden rounded-[24px] border border-white/10 bg-panel select-none"><div class="aspect-[4/5] overflow-hidden relative"><img${ssrRenderAttr("src", imgs.value[i.value])}${ssrRenderAttr("alt", `${__props.name} — عکس ${i.value + 1}`)} class="h-full w-full object-cover transition-all duration-300" draggable="false"></div>`);
      if (imgs.value.length > 1) {
        _push(`<!--[--><button class="pressable absolute top-1/2 right-3 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-ink/55 text-snow backdrop-blur cursor-pointer" aria-label="عکس قبلی">`);
        _push(ssrRenderComponent(unref(ChevronLeftIcon), { size: 18 }, null, _parent));
        _push(`</button><button class="pressable absolute top-1/2 left-3 grid h-11 w-11 -translate-y-1/2 rotate-180 place-items-center rounded-full bg-ink/55 text-snow backdrop-blur cursor-pointer" aria-label="عکس بعدی">`);
        _push(ssrRenderComponent(unref(ChevronLeftIcon), { size: 18 }, null, _parent));
        _push(`</button><div class="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5"><!--[-->`);
        ssrRenderList(imgs.value, (_, x) => {
          _push(`<button${ssrRenderAttr("aria-label", `عکس ${x + 1}`)} class="${ssrRenderClass([[x === i.value ? "w-5 bg-vio" : "w-1.5 bg-white/35"], "h-1.5 rounded-full transition-all duration-300 cursor-pointer"])}"></button>`);
        });
        _push(`<!--]--></div><!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (imgs.value.length > 1) {
        _push(`<div class="no-scrollbar mt-3 flex gap-2 overflow-x-auto"><!--[-->`);
        ssrRenderList(imgs.value, (img, x) => {
          _push(`<button${ssrRenderAttr("aria-label", `مشاهده عکس ${x + 1}`)} class="${ssrRenderClass([[x === i.value ? "border-vio" : "border-transparent opacity-55"], "relative h-16 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition-colors cursor-pointer"])}"><img${ssrRenderAttr("src", img)} alt="" loading="lazy" class="h-full w-full object-cover"></button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vapor/Gallery.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Gallery = Object.assign(_sfc_main$1, { __name: "VaporGallery" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const slug = computed(() => route.params.slug);
    const { data: product, error } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      () => `/api/products/${slug.value}`,
      {
        key: `product-${slug.value}`
      },
      "$H9vbB7y6gr"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    if (error.value || !product.value) {
      throw createError({ statusCode: 404, message: "محصول پیدا نشد", fatal: true });
    }
    const { data: allProducts } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/products",
      {
        query: { limit: 40 },
        default: () => []
      },
      "$UfjT-iue_f"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const related = computed(
      () => (allProducts.value || []).filter((p) => p.categorySlug === product.value?.categorySlug && p.slug !== product.value?.slug).slice(0, 8)
    );
    const specEntries = computed(
      () => Object.entries(product.value?.specs ?? {}).filter(([k]) => k !== "options")
    );
    useSeoMeta({
      title: computed(() => product.value ? `${product.value.name} | ${product.value.brand}` : "محصول"),
      description: computed(() => product.value?.tagline ?? product.value?.description?.slice(0, 150)),
      ogTitle: computed(() => product.value?.name),
      ogDescription: computed(() => product.value?.tagline ?? void 0),
      ogImage: computed(() => product.value?.images?.[0])
    });
    const jsonLd = computed(() => {
      if (!product.value) return null;
      return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.value.name,
        image: product.value.images,
        description: product.value.description,
        brand: { "@type": "Brand", name: product.value.brand },
        offers: {
          "@type": "Offer",
          priceCurrency: "IRR",
          price: String((product.value.discountPrice ?? product.value.price) * 10),
          availability: product.value.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          url: `${SITE.domain}/product/${product.value.slug}`
        }
      };
    });
    useHead({
      script: computed(
        () => jsonLd.value ? [
          {
            type: "application/ld+json",
            children: JSON.stringify(jsonLd.value)
          }
        ] : []
      )
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      if (unref(product)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "wrap pt-4 pb-4" }, _attrs))}><nav aria-label="مسیر صفحه" class="flex items-center gap-1.5 overflow-x-auto py-2 text-[12px] whitespace-nowrap text-dim no-scrollbar">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "hover:text-vio"
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
        _push(ssrRenderComponent(unref(ChevronLeftIcon), { size: 12 }, null, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/shop?category=${unref(product).categorySlug}`,
          class: "hover:text-vio"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(product).category)}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(product).category), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(ChevronLeftIcon), { size: 12 }, null, _parent));
        _push(`<span class="text-mist">${ssrInterpolate(unref(product).name)}</span></nav><div class="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14">`);
        _push(ssrRenderComponent(Gallery, {
          images: unref(product).images,
          name: unref(product).name
        }, null, _parent));
        _push(`<div class="lg:pt-4">`);
        _push(ssrRenderComponent(BuyBox, { product: unref(product) }, null, _parent));
        _push(`</div></div><section class="mt-12 grid gap-6 lg:grid-cols-2"><div class="card-g rounded-[22px] p-6"><h2 class="flex items-center gap-2 text-[16px] font-extrabold text-snow">`);
        _push(ssrRenderComponent(unref(FlameIcon), {
          size: 18,
          class: "text-vio"
        }, null, _parent));
        _push(` درباره محصول </h2><p class="mt-4 text-[13px] leading-8 text-mist">${ssrInterpolate(unref(product).description)}</p></div><div class="card-g rounded-[22px] p-6"><h2 class="text-[16px] font-extrabold text-snow">مشخصات فنی</h2><dl class="mt-4 divide-y divide-white/6"><!--[-->`);
        ssrRenderList(specEntries.value, ([k, v]) => {
          _push(`<div class="flex items-center justify-between gap-4 py-2.5"><dt class="text-[12.5px] text-dim">${ssrInterpolate(k)}</dt><dd dir="ltr" class="text-left text-[12.5px] font-extrabold text-snow">${ssrInterpolate(v)}</dd></div>`);
        });
        _push(`<!--]--><div class="flex items-center justify-between gap-4 py-2.5"><dt class="text-[12.5px] text-dim">وضعیت موجودی</dt><dd class="${ssrRenderClass(unref(product).stock > 0 ? "font-extrabold text-neon" : "font-extrabold text-blush")}">${ssrInterpolate(unref(product).stock > 0 ? `${unref(product).stock} عدد در انبار` : "ناموجود")}</dd></div></dl><div class="mt-4 grid grid-cols-3 gap-2 border-t border-white/8 pt-4"><!--[-->`);
        ssrRenderList([
          { I: unref(ShieldIcon), t: "ضمانت اصالت" },
          { I: unref(TruckIcon), t: "ارسال سریع" },
          { I: unref(RefreshIcon), t: "بازگشت ۷ روزه" }
        ], (item) => {
          _push(`<div class="flex flex-col items-center gap-1.5 rounded-xl bg-white/3 py-3 text-center">`);
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.I), {
            size: 16,
            class: "text-neon"
          }, null), _parent);
          _push(`<span class="text-[9.5px] font-bold text-dim">${ssrInterpolate(item.t)}</span></div>`);
        });
        _push(`<!--]--></div></div></section>`);
        if (related.value.length > 0) {
          _push(`<div class="mt-14">`);
          _push(ssrRenderComponent(SectionRow, {
            title: "شاید این‌ها هم خوشت بیاد 💜",
            sub: "بر اساس دسته‌بندی همین محصول"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(ProductRail, null, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<!--[-->`);
                      ssrRenderList(related.value, (r, i) => {
                        _push3(ssrRenderComponent(RailItem, {
                          key: r.id
                        }, {
                          default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(ssrRenderComponent(ProductCard, {
                                p: r,
                                index: i
                              }, null, _parent4, _scopeId3));
                            } else {
                              return [
                                createVNode(ProductCard, {
                                  p: r,
                                  index: i
                                }, null, 8, ["p", "index"])
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                      });
                      _push3(`<!--]-->`);
                    } else {
                      return [
                        (openBlock(true), createBlock(Fragment, null, renderList(related.value, (r, i) => {
                          return openBlock(), createBlock(RailItem, {
                            key: r.id
                          }, {
                            default: withCtx(() => [
                              createVNode(ProductCard, {
                                p: r,
                                index: i
                              }, null, 8, ["p", "index"])
                            ]),
                            _: 2
                          }, 1024);
                        }), 128))
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                return [
                  createVNode(ProductRail, null, {
                    default: withCtx(() => [
                      (openBlock(true), createBlock(Fragment, null, renderList(related.value, (r, i) => {
                        return openBlock(), createBlock(RailItem, {
                          key: r.id
                        }, {
                          default: withCtx(() => [
                            createVNode(ProductCard, {
                              p: r,
                              index: i
                            }, null, 8, ["p", "index"])
                          ]),
                          _: 2
                        }, 1024);
                      }), 128))
                    ]),
                    _: 1
                  })
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<p class="mt-12 rounded-2xl border border-blush/20 bg-blush/6 p-5 text-center text-[11.5px] leading-6 text-mist"> ⚠️ محصولات نیکوتین‌دار فقط برای افراد بالای ۱۸ سال قابل خرید است. مصرف دخانیات برای سلامتی مضر است. </p></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/product/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-D785jl0B.mjs.map
