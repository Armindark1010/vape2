import { defineComponent, ref, mergeProps, withCtx, createTextVNode, unref, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { _ as __nuxt_component_0, b as CATS_META } from './server.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "VaporBackground",
  __ssrInlineRender: true,
  props: {
    className: {}
  },
  setup(__props) {
    const holder = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "holder",
        ref: holder,
        "aria-hidden": "true",
        class: ["pointer-events-none absolute inset-0 overflow-hidden", __props.className]
      }, _attrs))}></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vapor/VaporBackground.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const VaporBackground = Object.assign(_sfc_main$1, { __name: "VaporBackground" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CategorySlider",
  __ssrInlineRender: true,
  props: {
    cats: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "wrap mt-10" }, _attrs))}><div class="mb-4 flex items-end justify-between"><div><h2 class="text-[19px] font-extrabold text-snow">دسته‌بندی‌ها</h2><p class="mt-1 text-[11.5px] text-dim">سریع‌ترین راه رسیدن به طعم دلخواهت</p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/categories",
        class: "pressable rounded-xl px-2 py-2 text-[12px] font-extrabold text-vio"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` همه دسته‌ها ← `);
          } else {
            return [
              createTextVNode(" همه دسته‌ها ← ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="no-scrollbar snap-x-mandatory -mx-0 flex gap-3 overflow-x-auto pb-1 lg:grid lg:grid-cols-4"><!--[-->`);
      ssrRenderList(__props.cats, (c, i) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: c.slug,
          to: `/shop?category=${c.slug}`,
          class: [
            "group relative block w-[72vw] max-w-[300px] shrink-0 snap-start overflow-hidden rounded-[22px] border border-white/10 lg:w-auto",
            i === 0 ? "lg:col-span-1" : ""
          ]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="relative aspect-[16/11] w-full overflow-hidden sm:aspect-[16/10]"${_scopeId}><img${ssrRenderAttr("src", c.image ?? "")}${ssrRenderAttr("alt", c.name)} loading="lazy" decoding="async" class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"${_scopeId}><div class="${ssrRenderClass([
                "absolute inset-0 bg-gradient-to-t to-transparent",
                unref(CATS_META)[c.slug]?.tint === "neon" ? "from-ink via-neon/15" : unref(CATS_META)[c.slug]?.tint === "ice" ? "from-ink via-ice/15" : unref(CATS_META)[c.slug]?.tint === "blush" ? "from-ink via-blush/15" : "from-ink via-vio/20"
              ])}"${_scopeId}></div><div class="absolute inset-x-0 bottom-0 flex items-end justify-between p-4"${_scopeId}><div${_scopeId}><p class="text-[17px] font-extrabold text-snow drop-shadow-md"${_scopeId}>${ssrInterpolate(c.name)}</p><p class="mt-0.5 text-[11px] text-mist tnum"${_scopeId}>${ssrInterpolate(c.count)} محصول</p></div><span class="text-[24px] drop-shadow-[0_0_14px_rgba(167,139,250,0.8)]"${_scopeId}>${ssrInterpolate(unref(CATS_META)[c.slug]?.emoji ?? "✨")}</span></div></div>`);
            } else {
              return [
                createVNode("div", { class: "relative aspect-[16/11] w-full overflow-hidden sm:aspect-[16/10]" }, [
                  createVNode("img", {
                    src: c.image ?? "",
                    alt: c.name,
                    loading: "lazy",
                    decoding: "async",
                    class: "absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
                  }, null, 8, ["src", "alt"]),
                  createVNode("div", {
                    class: [
                      "absolute inset-0 bg-gradient-to-t to-transparent",
                      unref(CATS_META)[c.slug]?.tint === "neon" ? "from-ink via-neon/15" : unref(CATS_META)[c.slug]?.tint === "ice" ? "from-ink via-ice/15" : unref(CATS_META)[c.slug]?.tint === "blush" ? "from-ink via-blush/15" : "from-ink via-vio/20"
                    ]
                  }, null, 2),
                  createVNode("div", { class: "absolute inset-x-0 bottom-0 flex items-end justify-between p-4" }, [
                    createVNode("div", null, [
                      createVNode("p", { class: "text-[17px] font-extrabold text-snow drop-shadow-md" }, toDisplayString(c.name), 1),
                      createVNode("p", { class: "mt-0.5 text-[11px] text-mist tnum" }, toDisplayString(c.count) + " محصول", 1)
                    ]),
                    createVNode("span", { class: "text-[24px] drop-shadow-[0_0_14px_rgba(167,139,250,0.8)]" }, toDisplayString(unref(CATS_META)[c.slug]?.emoji ?? "✨"), 1)
                  ])
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vapor/CategorySlider.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CategorySlider = Object.assign(_sfc_main, { __name: "VaporCategorySlider" });

export { CategorySlider as C, VaporBackground as V };
//# sourceMappingURL=CategorySlider-iz3CSavZ.mjs.map
