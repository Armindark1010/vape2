import { c as SITE, B as BRANDS_LINE, _ as __nuxt_component_0, A as ArrowLeftIcon, d as TRUST, C as CheckIcon, H as HERO_IMG, b as CATS_META, e as PROMO_IMG, W as WHY } from './server.mjs';
import { defineComponent, withAsyncContext, computed, unref, withCtx, createTextVNode, createVNode, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { V as VaporBackground, C as CategorySlider } from './CategorySlider-iz3CSavZ.mjs';
import { P as ProductCard } from './ProductCard-CumuzPRn.mjs';
import { S as SectionRow, P as ProductRail, R as RailItem } from './RailItem-C7_DSAjG.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useSeoMeta({
      title: `${SITE.name} | فروشگاه تخصصی ویپ، سالت و پاد — ${SITE.tagline}`,
      description: "فروشگاه تخصصی ویپورا — خرید آنلاین پاد یک‌بارمصرف، سالت نیکوتین، مود و لوازم جانبی اصل با هولوگرام. ارسال فوری تهران، پرداخت در محل، ضمانت اصالت23 کالا.",
      ogTitle: `${SITE.name} — ${SITE.tagline}`,
      ogDescription: "پاد یک‌بارمصرف، سالت نیکوتین و مود اصل با ضمانت اصالت و ارسال فوری.",
      ogImage: "https://images.pexels.com/photos/19344605/pexels-photo-19344605.jpeg?auto=compress&cs=tinysrgb&w=1200"
    });
    const { data: allProducts } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/products",
      {
        query: { limit: 40 },
        default: () => []
      },
      "$owO_kAt5pw"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: categories } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/categories",
      {
        default: () => []
      },
      "$o8n_4kUJh1"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const newest = computed(
      () => [...allProducts.value || []].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 10)
    );
    const best = computed(() => (allProducts.value || []).filter((p) => p.bestSeller).slice(0, 8));
    const deal = computed(
      () => (allProducts.value || []).find((p) => p.discountPrice != null) || allProducts.value?.[0] || {
        id: 1,
        slug: "elfbar-te6000",
        name: "ELFBAR TE6000",
        price: 115e4,
        discountPrice: 99e4,
        categorySlug: "pods"
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><section class="relative flex min-h-[88svh] items-center overflow-hidden">`);
      _push(ssrRenderComponent(VaporBackground, null, null, _parent));
      _push(`<div class="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,transparent_40%,#09090b_88%)]"></div><div class="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-ink to-transparent"></div><div class="wrap relative z-10 grid w-full items-center gap-8 pt-6 pb-16 lg:grid-cols-[1.15fr_1fr] lg:gap-6"><div><span class="inline-flex items-center gap-2 rounded-full border border-vio/30 bg-vio/10 px-4 py-2 text-[11.5px] font-bold text-vio"><span class="pulse-ring h-1.5 w-1.5 rounded-full bg-vio"></span> ورژن جدید پادهای ۱۰۰۰۰ پافی رسید </span><h1 class="mt-6 font-display text-[40px] leading-[1.2] font-extrabold text-snow sm:text-6xl lg:text-[64px] lg:leading-[1.15]"> دودِ نرم، <br><span class="text-grad">طعمِ ناب.</span></h1><p class="mt-5 max-w-md text-[14.5px] leading-8 text-mist"> فروشگاهسیسی تخصصی ویپ، سالت و پاد با ضمانت اصالت کالا. از ${ssrInterpolate(unref(BRANDS_LINE)[0])} تا ${ssrInterpolate(unref(BRANDS_LINE)[3])} — هرچی بخوای، اصلش پیش ماست. 🔥 </p><div class="mt-8 flex flex-wrap items-center gap-3">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/shop",
        class: "pressable flex h-14 items-center gap-2 rounded-2xl bg-gradient-to-l from-vio to-ice px-8 text-[15px] font-extrabold text-ink glow-v"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` مشاهده محصولات `);
            _push2(ssrRenderComponent(unref(ArrowLeftIcon), {
              size: 18,
              sw: 2.4
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(" مشاهده محصولات "),
              createVNode(unref(ArrowLeftIcon), {
                size: 18,
                sw: 2.4
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/categories",
        class: "pressable flex h-14 items-center gap-2 rounded-2xl border border-white/14 bg-white/4 px-7 text-[14px] font-extrabold text-snow backdrop-blur"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` دسته‌بندی‌ها `);
          } else {
            return [
              createTextVNode(" دسته‌بندی‌ها ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><ul class="mt-9 flex flex-wrap gap-x-6 gap-y-3"><!--[-->`);
      ssrRenderList(unref(TRUST).slice(0, 3), (t) => {
        _push(`<li class="flex items-center gap-2 text-[12px] text-mist"><span class="grid h-5 w-5 place-items-center rounded-full bg-neon/15 text-neon">`);
        _push(ssrRenderComponent(unref(CheckIcon), {
          size: 11,
          sw: 3
        }, null, _parent));
        _push(`</span><strong class="text-snow">${ssrInterpolate(t.t)}</strong> · ${ssrInterpolate(t.s)}</li>`);
      });
      _push(`<!--]--></ul></div><div class="relative mx-auto hidden w-full max-w-sm lg:block"><div class="floaty relative overflow-hidden rounded-[28px] border border-vio/30 bg-panel glow-v"><img${ssrRenderAttr("src", unref(HERO_IMG))} alt="پاد یک‌بارمصرف" class="aspect-[3/4] w-full object-cover"><div class="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent"></div><div class="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl glass px-5 py-4"><div><p dir="ltr" class="text-[13px] font-extrabold text-snow">${ssrInterpolate(deal.value.name)}</p><p class="mt-1 text-[11px] text-mist">${ssrInterpolate(unref(CATS_META)[deal.value.categorySlug]?.label)}</p></div><div class="text-left"><p class="text-[10px] text-dim line-through tnum">${ssrInterpolate((deal.value.price / 1e3).toLocaleString("en-US"))} هزار</p><p class="text-[15px] font-extrabold text-neon tnum">${ssrInterpolate(((deal.value.discountPrice ?? deal.value.price) / 1e3).toLocaleString("en-US"))} هزار</p></div></div>`);
      if (deal.value.discountPrice) {
        _push(`<span class="absolute top-4 right-4 rounded-xl bg-neon px-2.5 py-1 text-[11px] font-extrabold text-ink" dir="ltr"> ٪${ssrInterpolate(Math.round((deal.value.price - deal.value.discountPrice) / deal.value.price * 100))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></section><div class="hairline-t hairline-b overflow-hidden bg-white/[0.02] py-4" aria-hidden="true"><div class="marquee-track flex items-center gap-0"><!--[-->`);
      ssrRenderList([0, 1], (dup) => {
        _push(`<div class="flex shrink-0 items-center"><!--[-->`);
        ssrRenderList(unref(BRANDS_LINE), (b) => {
          _push(`<span dir="ltr" class="flex items-center gap-10 pr-10 text-[15px] font-extrabold tracking-[0.2em] whitespace-nowrap text-white/25">${ssrInterpolate(b)} <span class="text-vio/60">✦</span></span>`);
        });
        _push(`<!--]--></div>`);
      });
      _push(`<!--]--></div></div>`);
      _push(ssrRenderComponent(CategorySlider, {
        cats: (unref(categories) || []).map((c) => ({ slug: c.slug, name: c.name, count: c.count, image: c.image }))
      }, null, _parent));
      _push(ssrRenderComponent(SectionRow, {
        title: "تازه‌های ویپورا ☁️",
        sub: "جدیدترین پادها و سالت‌ها — زود تموم میشن",
        href: "/shop?sort=newest"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(ProductRail, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(newest.value, (p, i) => {
                    _push3(ssrRenderComponent(RailItem, {
                      key: p.id
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(ProductCard, {
                            p,
                            index: i
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(ProductCard, {
                              p,
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
                    (openBlock(true), createBlock(Fragment, null, renderList(newest.value, (p, i) => {
                      return openBlock(), createBlock(RailItem, {
                        key: p.id
                      }, {
                        default: withCtx(() => [
                          createVNode(ProductCard, {
                            p,
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
                  (openBlock(true), createBlock(Fragment, null, renderList(newest.value, (p, i) => {
                    return openBlock(), createBlock(RailItem, {
                      key: p.id
                    }, {
                      default: withCtx(() => [
                        createVNode(ProductCard, {
                          p,
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
      _push(`<section class="wrap mt-12"><div class="relative overflow-hidden rounded-[26px] border border-neon/20"><img${ssrRenderAttr("src", unref(PROMO_IMG))} alt="" class="absolute inset-0 h-full w-full object-cover" loading="lazy"><div class="absolute inset-0 bg-gradient-to-l from-ink/95 via-ink/80 to-ink/40"></div><div class="relative flex flex-col gap-5 px-6 py-10 sm:px-10 md:flex-row md:items-center md:justify-between"><div><span class="rounded-lg bg-neon/15 px-3 py-1.5 text-[11px] font-extrabold text-neon">پیشنهاد ویژه این هفته</span><h2 class="mt-4 max-w-sm font-display text-[26px] leading-10 font-extrabold text-snow sm:text-3xl"> تا <span class="text-grad">٪۱۵ تخفیف</span> روی همه سالت‌ها </h2><p class="mt-2 text-[13px] text-mist"> کد تخفیف: <strong dir="ltr" class="rounded-lg border border-dashed border-neon/50 bg-ink/60 px-2 py-1 font-mono text-neon">VAPORA15</strong> — در صفحه پرداخت وارد کن </p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/shop?category=salts",
        class: "pressable inline-flex h-13 w-fit items-center gap-2 self-start rounded-2xl bg-gradient-to-l from-neon to-ice px-7 py-4 text-[14px] font-extrabold text-ink glow-g md:self-center"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` خرید سالت `);
            _push2(ssrRenderComponent(unref(ArrowLeftIcon), {
              size: 17,
              sw: 2.4
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(" خرید سالت "),
              createVNode(unref(ArrowLeftIcon), {
                size: 17,
                sw: 2.4
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></section>`);
      _push(ssrRenderComponent(SectionRow, {
        title: "پرفروش‌ترین‌ها 🔥",
        sub: "آنچه واپرها بیشتر از همه دوستشون دارن",
        href: "/shop?sort=popular"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="wrap grid grid-cols-2 gap-3 md:gap-5 xl:grid-cols-4"${_scopeId}><!--[-->`);
            ssrRenderList(best.value, (p, i) => {
              _push2(ssrRenderComponent(ProductCard, {
                key: p.id,
                p,
                index: i
              }, null, _parent2, _scopeId));
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "wrap grid grid-cols-2 gap-3 md:gap-5 xl:grid-cols-4" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(best.value, (p, i) => {
                  return openBlock(), createBlock(ProductCard, {
                    key: p.id,
                    p,
                    index: i
                  }, null, 8, ["p", "index"]);
                }), 128))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<section class="wrap mt-14"><div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><!--[-->`);
      ssrRenderList(unref(WHY), (w) => {
        _push(`<div class="card-g rounded-[22px] p-5 transition-all duration-300 hover:border-vio/30 hover:glow-v"><span class="text-[26px]">${ssrInterpolate(w.emoji)}</span><h3 class="mt-3 text-[14px] font-extrabold text-snow">${ssrInterpolate(w.t)}</h3><p class="mt-2 text-[11.5px] leading-6 text-dim">${ssrInterpolate(w.s)}</p></div>`);
      });
      _push(`<!--]--></div></section><section class="wrap mt-14"><div class="relative overflow-hidden rounded-[26px] border border-vio/25 p-8 text-center sm:p-12"><div class="pointer-events-none absolute -top-20 left-1/2 h-56 w-[500px] -translate-x-1/2 rounded-full bg-vio/15 blur-3xl"></div><p class="relative text-[12px] font-extrabold tracking-widest text-vio">خرید مطمئن با ${ssrInterpolate(unref(SITE).name)}</p><h2 class="relative mt-3 font-display text-[26px] font-extrabold text-snow sm:text-3xl"> آماده‌ای یه <span class="text-grad">کلیک</span> تا طعم موردعلاقه‌ت فاصله داری؟ </h2>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/shop",
        class: "pressable relative mt-7 inline-flex h-14 items-center gap-2 rounded-2xl bg-gradient-to-l from-vio to-ice px-10 text-[15px] font-extrabold text-ink glow-v"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` شروع خرید `);
            _push2(ssrRenderComponent(unref(ArrowLeftIcon), {
              size: 18,
              sw: 2.4
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(" شروع خرید "),
              createVNode(unref(ArrowLeftIcon), {
                size: 18,
                sw: 2.4
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BD8lGozE.mjs.map
