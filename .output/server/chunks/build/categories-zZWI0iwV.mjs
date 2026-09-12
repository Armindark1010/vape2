import { defineComponent, withAsyncContext, computed, unref, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { V as VaporBackground, C as CategorySlider } from './CategorySlider-iz3CSavZ.mjs';
import { S as SectionRow, P as ProductRail, R as RailItem } from './RailItem-C7_DSAjG.mjs';
import { P as ProductCard } from './ProductCard-CumuzPRn.mjs';
import { b as CATS_META } from './server.mjs';
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
  __name: "categories",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useSeoMeta({
      title: "دسته‌بندی‌ها",
      description: "دسته‌بندی تخصصی پاد یک‌بارمصرف، سالت نیکوتین، مود و لوازم جانبی ویپ."
    });
    const { data: categories } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/categories",
      { default: () => [] },
      "$YL7Lj4SnjA"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: allProducts } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/products",
      {
        query: { limit: 40 },
        default: () => []
      },
      "$cqHgdMaonC"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const perCategory = computed(() => {
      const map = {};
      for (const c of categories.value || []) {
        map[c.slug] = (allProducts.value || []).filter((p) => p.categorySlug === c.slug).slice(0, 4);
      }
      return map;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><section class="relative overflow-hidden">`);
      _push(ssrRenderComponent(VaporBackground, { "class-name": "opacity-60" }, null, _parent));
      _push(`<div class="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent"></div><div class="wrap relative z-10 pt-10 pb-8 lg:pt-16"><p class="text-[11px] font-extrabold tracking-widest text-vio">برو به دسته‌ی دلخواهت</p><h1 class="mt-2 font-display text-[32px] font-extrabold text-snow lg:text-5xl"> دسته‌بندی <span class="text-grad">محصولات</span></h1></div></section>`);
      _push(ssrRenderComponent(CategorySlider, {
        cats: (unref(categories) || []).map((c) => ({ slug: c.slug, name: c.name, count: c.count, image: c.image }))
      }, null, _parent));
      _push(`<!--[-->`);
      ssrRenderList(unref(categories) || [], (c) => {
        _push(`<!--[-->`);
        if ((perCategory.value[c.slug] || []).length > 0) {
          _push(ssrRenderComponent(SectionRow, {
            title: `${unref(CATS_META)[c.slug]?.emoji ?? "✨"} ${c.name}`,
            sub: unref(CATS_META)[c.slug]?.sub,
            href: `/shop?category=${c.slug}`
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(ProductRail, null, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<!--[-->`);
                      ssrRenderList(perCategory.value[c.slug], (p, i) => {
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
                        (openBlock(true), createBlock(Fragment, null, renderList(perCategory.value[c.slug], (p, i) => {
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
                  _: 2
                }, _parent2, _scopeId));
              } else {
                return [
                  createVNode(ProductRail, null, {
                    default: withCtx(() => [
                      (openBlock(true), createBlock(Fragment, null, renderList(perCategory.value[c.slug], (p, i) => {
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
                    _: 2
                  }, 1024)
                ];
              }
            }),
            _: 2
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--><section class="wrap mt-14"><div class="card-g rounded-[24px] p-6 sm:p-8"><h2 class="font-display text-[20px] font-extrabold text-snow">راهنمای انتخاب 🤔</h2><div class="mt-5 grid gap-4 sm:grid-cols-2"><!--[-->`);
      ssrRenderList([
        ["اولین باره؟", "پاد یک‌بارمصرف با نیکوتین ۲۰ رو انتخاب کن؛ ساده، بدون دردسر و خوش‌طعم."],
        ["سیگاری بودی؟", "سالت با نیکوتین ۳۵ یا ۵۰ بهترین گزینه برای حس مشابه سیگار است."],
        ["مصرف روزانه؟", "مود با کویل قابل تعویض هم اقتصادی‌تره و هم بخار بهتری داره."],
        ["شک داری؟", "چت با پشتیبان واپر (پایین صفحه) یا تماس با ما — مشاوره رایگانه."]
      ], ([t, s]) => {
        _push(`<div class="rounded-2xl border border-white/8 bg-white/3 p-4"><p class="text-[13.5px] font-extrabold text-snow">${ssrInterpolate(t)}</p><p class="mt-1.5 text-[12px] leading-6 text-dim">${ssrInterpolate(s)}</p></div>`);
      });
      _push(`<!--]--></div></div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/categories.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=categories-zZWI0iwV.mjs.map
