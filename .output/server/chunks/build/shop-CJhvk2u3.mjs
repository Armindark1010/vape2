import { _ as __nuxt_component_0, b as CATS_META, S as SlidersIcon, C as CheckIcon, h as haptic } from './server.mjs';
import { defineComponent, withAsyncContext, computed, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, ref, watch, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderAttr } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';
import { P as ProductCard } from './ProductCard-CumuzPRn.mjs';
import { B as BottomSheet } from './BottomSheet-BdjUp6uW.mjs';
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
import '@vue/shared';

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "FilterSheet",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    initial: {},
    cats: {},
    brands: {},
    priceCeil: {},
    sortOptions: {}
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const router = useRouter();
    const d = ref({ ...props.initial });
    watch(
      () => props.initial,
      (newVal) => {
        d.value = { ...newVal };
      },
      { deep: true }
    );
    const apply = () => {
      haptic(10);
      const query = {};
      if (d.value.category) query.category = d.value.category;
      if (d.value.brand) query.brand = d.value.brand;
      if (d.value.inStock) query.stock = "in";
      if (d.value.max != null && d.value.max < props.priceCeil) query.max = String(d.value.max);
      if (d.value.sort && d.value.sort !== "popular") query.sort = d.value.sort;
      router.replace({ path: "/shop", query });
      emit("close");
    };
    const reset = () => {
      d.value = { sort: "popular" };
      router.replace({ path: "/shop" });
      emit("close");
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(BottomSheet, mergeProps({
        open: __props.open,
        label: "فیلترها",
        snap: "80svh",
        onClose: ($event) => emit("close")
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-between px-5 pb-1"${_scopeId}><h2 class="text-[16px] font-extrabold text-snow"${_scopeId}>فیلتر محصولات</h2><button class="pressable rounded-xl px-3 py-2 text-[12px] font-bold text-blush cursor-pointer"${_scopeId}> حذف همه فیلترها </button></div><div class="flex-1 space-y-6 overflow-y-auto px-5 py-4"${_scopeId}><div${_scopeId}><p class="mb-3 text-[12px] font-extrabold text-mist"${_scopeId}>مرتب‌سازی بر اساس</p><div class="no-scrollbar flex gap-2 overflow-x-auto"${_scopeId}><!--[-->`);
            ssrRenderList(__props.sortOptions, (o) => {
              _push2(`<button class="${ssrRenderClass([[
                (d.value.sort ?? "popular") === o.v ? "border border-vio/50 bg-vio/15 text-snow glow-v" : "border border-white/10 bg-white/4 text-mist"
              ], "pressable h-11 shrink-0 rounded-2xl px-4 text-[12.5px] font-bold transition-colors cursor-pointer"])}"${_scopeId}>${ssrInterpolate(o.l)}</button>`);
            });
            _push2(`<!--]--></div></div><div${_scopeId}><p class="mb-3 text-[12px] font-extrabold text-mist"${_scopeId}>دسته‌بندی</p><div class="flex flex-wrap gap-2"${_scopeId}><!--[-->`);
            ssrRenderList(__props.cats, (c) => {
              _push2(`<button class="${ssrRenderClass([[
                d.value.category === c.slug ? "border border-vio/50 bg-vio/15 text-snow glow-v" : "border border-white/10 bg-white/4 text-mist"
              ], "pressable h-11 rounded-2xl px-4 text-[13px] font-bold cursor-pointer"])}"${_scopeId}>${ssrInterpolate(c.name)}</button>`);
            });
            _push2(`<!--]--></div></div><div${_scopeId}><p class="mb-3 text-[12px] font-extrabold text-mist"${_scopeId}>برند</p><div class="flex flex-wrap gap-2"${_scopeId}><!--[-->`);
            ssrRenderList(__props.brands, (b) => {
              _push2(`<button class="${ssrRenderClass([[
                d.value.brand === b.slug ? "border border-neon/50 bg-neon/12 text-neon" : "border border-white/10 bg-white/4 text-mist"
              ], "pressable h-11 rounded-2xl px-4 text-[13px] font-bold cursor-pointer"])}"${_scopeId}><span dir="ltr"${_scopeId}>${ssrInterpolate(b.name)}</span></button>`);
            });
            _push2(`<!--]--></div></div><div${_scopeId}><p class="mb-3 text-[12px] font-extrabold text-mist"${_scopeId}> حداکثر قیمت: <span class="text-snow tnum"${_scopeId}>${ssrInterpolate((d.value.max ?? __props.priceCeil).toLocaleString("en-US"))} تومان</span></p><input type="range"${ssrRenderAttr("min", 1e5)}${ssrRenderAttr("max", __props.priceCeil)}${ssrRenderAttr("step", 5e4)}${ssrRenderAttr("value", d.value.max ?? __props.priceCeil)} class="w-full accent-[#a78bfa] cursor-pointer" aria-label="حداکثر قیمت"${_scopeId}><div class="mt-1 flex justify-between text-[10.5px] text-dim tnum"${_scopeId}><span${_scopeId}>۱۰۰ هزار</span><span${_scopeId}>${ssrInterpolate((__props.priceCeil / 1e6).toLocaleString("en-US"))} میلیون</span></div></div><button class="flex h-14 w-full items-center justify-between rounded-2xl border border-white/10 bg-white/4 px-4 cursor-pointer" role="checkbox"${ssrRenderAttr("aria-checked", !!d.value.inStock)}${_scopeId}><span class="text-[13px] font-bold text-snow"${_scopeId}>فقط کالاهای موجود</span><span class="${ssrRenderClass([[
              d.value.inStock ? "border-neon bg-neon text-ink" : "border-white/20"
            ], "grid h-6 w-6 place-items-center rounded-lg border transition-colors"])}"${_scopeId}>`);
            if (d.value.inStock) {
              _push2(ssrRenderComponent(unref(CheckIcon), {
                size: 14,
                sw: 3
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</span></button></div><div class="border-t border-white/8 px-5 pt-3 pb-4"${_scopeId}><button class="pressable h-14 w-full rounded-2xl bg-gradient-to-l from-vio to-ice text-[15px] font-extrabold text-ink glow-v cursor-pointer"${_scopeId}> نمایش نتایج </button></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-between px-5 pb-1" }, [
                createVNode("h2", { class: "text-[16px] font-extrabold text-snow" }, "فیلتر محصولات"),
                createVNode("button", {
                  class: "pressable rounded-xl px-3 py-2 text-[12px] font-bold text-blush cursor-pointer",
                  onClick: reset
                }, " حذف همه فیلترها ")
              ]),
              createVNode("div", { class: "flex-1 space-y-6 overflow-y-auto px-5 py-4" }, [
                createVNode("div", null, [
                  createVNode("p", { class: "mb-3 text-[12px] font-extrabold text-mist" }, "مرتب‌سازی بر اساس"),
                  createVNode("div", { class: "no-scrollbar flex gap-2 overflow-x-auto" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.sortOptions, (o) => {
                      return openBlock(), createBlock("button", {
                        key: o.v,
                        class: ["pressable h-11 shrink-0 rounded-2xl px-4 text-[12.5px] font-bold transition-colors cursor-pointer", [
                          (d.value.sort ?? "popular") === o.v ? "border border-vio/50 bg-vio/15 text-snow glow-v" : "border border-white/10 bg-white/4 text-mist"
                        ]],
                        onClick: ($event) => d.value.sort = o.v
                      }, toDisplayString(o.l), 11, ["onClick"]);
                    }), 128))
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("p", { class: "mb-3 text-[12px] font-extrabold text-mist" }, "دسته‌بندی"),
                  createVNode("div", { class: "flex flex-wrap gap-2" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.cats, (c) => {
                      return openBlock(), createBlock("button", {
                        key: c.slug,
                        class: ["pressable h-11 rounded-2xl px-4 text-[13px] font-bold cursor-pointer", [
                          d.value.category === c.slug ? "border border-vio/50 bg-vio/15 text-snow glow-v" : "border border-white/10 bg-white/4 text-mist"
                        ]],
                        onClick: ($event) => d.value.category = d.value.category === c.slug ? void 0 : c.slug
                      }, toDisplayString(c.name), 11, ["onClick"]);
                    }), 128))
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("p", { class: "mb-3 text-[12px] font-extrabold text-mist" }, "برند"),
                  createVNode("div", { class: "flex flex-wrap gap-2" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.brands, (b) => {
                      return openBlock(), createBlock("button", {
                        key: b.slug,
                        class: ["pressable h-11 rounded-2xl px-4 text-[13px] font-bold cursor-pointer", [
                          d.value.brand === b.slug ? "border border-neon/50 bg-neon/12 text-neon" : "border border-white/10 bg-white/4 text-mist"
                        ]],
                        onClick: ($event) => d.value.brand = d.value.brand === b.slug ? void 0 : b.slug
                      }, [
                        createVNode("span", { dir: "ltr" }, toDisplayString(b.name), 1)
                      ], 10, ["onClick"]);
                    }), 128))
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("p", { class: "mb-3 text-[12px] font-extrabold text-mist" }, [
                    createTextVNode(" حداکثر قیمت: "),
                    createVNode("span", { class: "text-snow tnum" }, toDisplayString((d.value.max ?? __props.priceCeil).toLocaleString("en-US")) + " تومان", 1)
                  ]),
                  createVNode("input", {
                    type: "range",
                    min: 1e5,
                    max: __props.priceCeil,
                    step: 5e4,
                    value: d.value.max ?? __props.priceCeil,
                    class: "w-full accent-[#a78bfa] cursor-pointer",
                    "aria-label": "حداکثر قیمت",
                    onInput: (e) => d.value.max = Number(e.target.value)
                  }, null, 40, ["max", "value", "onInput"]),
                  createVNode("div", { class: "mt-1 flex justify-between text-[10.5px] text-dim tnum" }, [
                    createVNode("span", null, "۱۰۰ هزار"),
                    createVNode("span", null, toDisplayString((__props.priceCeil / 1e6).toLocaleString("en-US")) + " میلیون", 1)
                  ])
                ]),
                createVNode("button", {
                  class: "flex h-14 w-full items-center justify-between rounded-2xl border border-white/10 bg-white/4 px-4 cursor-pointer",
                  role: "checkbox",
                  "aria-checked": !!d.value.inStock,
                  onClick: ($event) => d.value.inStock = !d.value.inStock
                }, [
                  createVNode("span", { class: "text-[13px] font-bold text-snow" }, "فقط کالاهای موجود"),
                  createVNode("span", {
                    class: ["grid h-6 w-6 place-items-center rounded-lg border transition-colors", [
                      d.value.inStock ? "border-neon bg-neon text-ink" : "border-white/20"
                    ]]
                  }, [
                    d.value.inStock ? (openBlock(), createBlock(unref(CheckIcon), {
                      key: 0,
                      size: 14,
                      sw: 3
                    })) : createCommentVNode("", true)
                  ], 2)
                ], 8, ["aria-checked", "onClick"])
              ]),
              createVNode("div", { class: "border-t border-white/8 px-5 pt-3 pb-4" }, [
                createVNode("button", {
                  class: "pressable h-14 w-full rounded-2xl bg-gradient-to-l from-vio to-ice text-[15px] font-extrabold text-ink glow-v cursor-pointer",
                  onClick: apply
                }, " نمایش نتایج ")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vapor/FilterSheet.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const FilterSheet = Object.assign(_sfc_main$2, { __name: "VaporFilterSheet" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ShopBar",
  __ssrInlineRender: true,
  props: {
    initial: {},
    cats: {},
    brands: {},
    priceCeil: {},
    sortOptions: {},
    count: {}
  },
  setup(__props) {
    const props = __props;
    const open = ref(false);
    useRouter();
    const active = computed(() => {
      return (props.initial.category ? 1 : 0) + (props.initial.brand ? 1 : 0) + (props.initial.inStock ? 1 : 0) + (props.initial.max ? 1 : 0) + (props.initial.sort && props.initial.sort !== "popular" ? 1 : 0);
    });
    const chips = computed(() => {
      const list = [];
      const cl = (o) => {
        const q = new URLSearchParams();
        const merged = { ...props.initial, ...o };
        Object.entries(merged).forEach(([k, v]) => {
          if (v === void 0 || v === false) return;
          if (v === true) q.set(k, "in");
          else q.set(k, String(v));
        });
        const str = q.toString();
        return str ? `/shop?${str}` : "/shop";
      };
      if (props.initial.category) {
        const n = props.cats.find((c) => c.slug === props.initial.category)?.name;
        list.push({ label: n ?? props.initial.category, href: cl({ category: void 0 }) });
      }
      if (props.initial.brand) {
        list.push({ label: props.initial.brand.toUpperCase(), href: cl({ brand: void 0 }) });
      }
      if (props.initial.max) {
        list.push({ label: `تا ${(props.initial.max / 1e3).toLocaleString("en-US")} هزار`, href: cl({ max: void 0 }) });
      }
      return list;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="mt-5 flex items-center justify-between gap-3"><div class="flex min-w-0 items-center gap-2"><!--[-->`);
      ssrRenderList(chips.value, (c) => {
        _push(`<button class="pressable flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-vio/30 bg-vio/10 px-3 text-[11.5px] font-bold text-vio cursor-pointer">${ssrInterpolate(c.label)} <span class="text-dim">✕</span></button>`);
      });
      _push(`<!--]--><span class="shrink-0 text-[11.5px] text-dim tnum">${ssrInterpolate(__props.count)} کالا </span></div><button class="pressable relative flex h-12 shrink-0 items-center gap-2 rounded-2xl border border-white/12 bg-white/4 px-5 text-[13px] font-extrabold text-snow cursor-pointer" aria-haspopup="dialog">`);
      _push(ssrRenderComponent(unref(SlidersIcon), {
        size: 18,
        class: "text-vio"
      }, null, _parent));
      _push(` فیلتر `);
      if (active.value > 0) {
        _push(`<span class="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-gradient-to-l from-neon to-ice px-1 text-[10px] font-extrabold text-ink tnum">${ssrInterpolate(active.value)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button></div>`);
      _push(ssrRenderComponent(FilterSheet, {
        open: open.value,
        initial: __props.initial,
        cats: __props.cats,
        brands: __props.brands,
        "price-ceil": __props.priceCeil,
        "sort-options": __props.sortOptions,
        onClose: ($event) => open.value = false
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vapor/ShopBar.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ShopBar = Object.assign(_sfc_main$1, { __name: "VaporShopBar" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "shop",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useSeoMeta({
      title: "فروشگاه",
      description: "خرید آنلاین پاد یک‌بارمصرف، سالت نیکوتین و مود — اصل با هولوگرام و ارسال فوری."
    });
    const SORTS = [
      { v: "popular", l: "پرفروش‌ترین" },
      { v: "newest", l: "جدیدترین" },
      { v: "price-asc", l: "ارزان‌ترین" },
      { v: "price-desc", l: "گران‌ترین" },
      { v: "rating", l: "بالاترین امتیاز" }
    ];
    const route = useRoute();
    const { data: categories } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/categories",
      { default: () => [] },
      "$Kv5SJo8wGu"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: brands } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/brands",
      { default: () => [] },
      "$t8pZLVbebV"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: allProducts } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/products",
      {
        query: { limit: 60 },
        default: () => []
      },
      "$9f9pAo2lam"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const currentFilters = computed(() => ({
      category: route.query.category,
      brand: route.query.brand,
      max: route.query.max ? Number(route.query.max) : void 0,
      min: route.query.min ? Number(route.query.min) : void 0,
      stock: route.query.stock === "in" ? "in" : void 0,
      sort: route.query.sort || "popular",
      q: route.query.q
    }));
    const { data: products } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/products",
      {
        query: currentFilters,
        watch: [() => route.query],
        default: () => []
      },
      "$IFQHXFi4xE"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const catName = computed(
      () => categories.value?.find((c) => c.slug === route.query.category)?.name
    );
    const brandName = computed(
      () => brands.value?.find((b) => b.slug === route.query.brand)?.name
    );
    const priceCeil = computed(() => {
      const allPrices = (allProducts.value || []).map((p) => p.discountPrice ?? p.price);
      const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : 3e6;
      return Math.ceil(maxPrice / 1e5) * 1e5;
    });
    const initial = computed(() => ({
      category: route.query.category,
      brand: route.query.brand,
      inStock: route.query.stock === "in",
      max: route.query.max ? Number(route.query.max) : void 0,
      sort: route.query.sort || "popular"
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "wrap pt-8 pb-4" }, _attrs))}><div class="flex flex-wrap items-end justify-between gap-4"><div><p class="text-[11px] font-extrabold tracking-widest text-vio">${ssrInterpolate(catName.value ? `دسته: ${catName.value}` : "فروشگاه ویپورا")}</p><h1 class="mt-1 font-display text-[28px] font-extrabold text-snow lg:text-4xl">${ssrInterpolate(catName.value ? catName.value : "همه محصولات")} `);
      if (brandName.value) {
        _push(`<span dir="ltr" class="text-grad"> · ${ssrInterpolate(brandName.value)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</h1><p class="mt-2 text-[12.5px] text-dim tnum">${ssrInterpolate((unref(products) || []).length)} محصول · ارسال فوری تهران 🚚</p></div></div><div class="no-scrollbar mt-6 flex gap-2 overflow-x-auto">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/shop",
        class: [
          "pressable flex h-12 shrink-0 items-center gap-2 rounded-2xl px-4 text-[13px] font-bold",
          !unref(route).query.category ? "border border-vio/50 bg-vio/15 text-snow glow-v" : "border border-white/10 bg-white/4 text-mist"
        ]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` همه `);
          } else {
            return [
              createTextVNode(" همه ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--[-->`);
      ssrRenderList(unref(categories) || [], (c) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: c.slug,
          to: unref(route).query.category === c.slug ? "/shop" : `/shop?category=${c.slug}`,
          class: [
            "pressable flex h-12 shrink-0 items-center gap-2 rounded-2xl px-4 text-[13px] font-bold",
            unref(route).query.category === c.slug ? "border border-vio/50 bg-vio/15 text-snow glow-v" : "border border-white/10 bg-white/4 text-mist"
          ]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span${_scopeId}>${ssrInterpolate(unref(CATS_META)[c.slug]?.emoji ?? "✨")}</span> ${ssrInterpolate(c.name)}`);
            } else {
              return [
                createVNode("span", null, toDisplayString(unref(CATS_META)[c.slug]?.emoji ?? "✨"), 1),
                createTextVNode(" " + toDisplayString(c.name), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(ShopBar, {
        initial: initial.value,
        cats: (unref(categories) || []).map((c) => ({ slug: c.slug, name: c.name })),
        brands: (unref(brands) || []).map((b) => ({ slug: b.slug, name: b.name })),
        "price-ceil": priceCeil.value,
        "sort-options": SORTS,
        count: (unref(products) || []).length
      }, null, _parent));
      if ((unref(products) || []).length === 0) {
        _push(`<div class="card-g mt-6 rounded-[24px] p-14 text-center"><p class="text-5xl">😔</p><p class="mt-4 text-[16px] font-extrabold text-snow">چیزی با این فیلترها پیدا نشد</p><p class="mt-2 text-[12.5px] text-dim">فیلترها رو ساده‌تر کن یا همه محصولات رو ببین</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/shop",
          class: "pressable mt-6 inline-flex h-12 items-center rounded-2xl bg-gradient-to-l from-vio to-ice px-7 text-[13px] font-extrabold text-ink"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` حذف فیلترها `);
            } else {
              return [
                createTextVNode(" حذف فیلترها ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="mt-5 grid grid-cols-2 gap-3 md:gap-5 xl:grid-cols-4 2xl:grid-cols-5"><!--[-->`);
        ssrRenderList(unref(products) || [], (p, i) => {
          _push(ssrRenderComponent(ProductCard, {
            key: p.id,
            p,
            index: i
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      }
      _push(`<p class="mt-10 text-center text-[11px] leading-6 text-dim"> همه کالاهای ویپورا دارای <strong class="text-mist">هولوگرام اصالت</strong> هستند · در صورت مغایرت، وجه کامل برگردانده می‌شود. </p></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/shop.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=shop-CJhvk2u3.mjs.map
