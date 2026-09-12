import { u as useVape, _ as __nuxt_component_0, k as HeartIcon, j as StarIcon, b as CATS_META, m as money, P as PlusIcon } from './server.mjs';
import { defineComponent, computed, mergeProps, withCtx, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ProductCard",
  __ssrInlineRender: true,
  props: {
    p: {},
    index: { default: 0 }
  },
  setup(__props) {
    const props = __props;
    const { inWish } = useVape();
    const out = computed(() => props.p.stock <= 0);
    const price = computed(() => props.p.discountPrice ?? props.p.price);
    const pct = computed(
      () => props.p.discountPrice ? Math.round((props.p.price - props.p.discountPrice) / props.p.price * 100) : 0
    );
    const saved = computed(() => inWish(props.p.id));
    const flavorHint = computed(() => props.p.tagline);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "group relative" }, _attrs))}><div class="card-g relative overflow-hidden rounded-[20px] transition-all duration-500 hover:border-vio/40 hover:glow-v active:scale-[0.985]">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/product/${__props.p.slug}`,
        class: "relative block overflow-hidden"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="aspect-[4/5] overflow-hidden bg-panel"${_scopeId}><img${ssrRenderAttr("src", __props.p.images[0])}${ssrRenderAttr("alt", __props.p.name)}${ssrRenderAttr("loading", __props.index < 4 ? "eager" : "lazy")} decoding="async" class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"${_scopeId}></div><div class="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-80"${_scopeId}></div><div class="absolute top-3 right-3 z-10 flex flex-wrap items-center gap-1.5 pointer-events-none"${_scopeId}>`);
            if (pct.value > 0) {
              _push2(`<span class="rounded-xl bg-gradient-to-l from-neon to-ice px-2.5 py-1 text-[11px] font-extrabold text-ink tnum shadow-sm" dir="ltr"${_scopeId}> ٪${ssrInterpolate(pct.value)}</span>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.p.newArrival) {
              _push2(`<span class="rounded-xl bg-vio/85 px-2.5 py-1 text-[10.5px] font-extrabold text-white backdrop-blur shadow-sm"${_scopeId}> جدید </span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (out.value) {
              _push2(`<span class="absolute inset-0 grid place-items-center bg-ink/60 backdrop-blur-[2px] text-[13px] font-extrabold text-blush"${_scopeId}> ناموجود </span>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("div", { class: "aspect-[4/5] overflow-hidden bg-panel" }, [
                createVNode("img", {
                  src: __props.p.images[0],
                  alt: __props.p.name,
                  loading: __props.index < 4 ? "eager" : "lazy",
                  decoding: "async",
                  class: "h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                }, null, 8, ["src", "alt", "loading"])
              ]),
              createVNode("div", { class: "pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-80" }),
              createVNode("div", { class: "absolute top-3 right-3 z-10 flex flex-wrap items-center gap-1.5 pointer-events-none" }, [
                pct.value > 0 ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: "rounded-xl bg-gradient-to-l from-neon to-ice px-2.5 py-1 text-[11px] font-extrabold text-ink tnum shadow-sm",
                  dir: "ltr"
                }, " ٪" + toDisplayString(pct.value), 1)) : createCommentVNode("", true),
                __props.p.newArrival ? (openBlock(), createBlock("span", {
                  key: 1,
                  class: "rounded-xl bg-vio/85 px-2.5 py-1 text-[10.5px] font-extrabold text-white backdrop-blur shadow-sm"
                }, " جدید ")) : createCommentVNode("", true)
              ]),
              out.value ? (openBlock(), createBlock("span", {
                key: 0,
                class: "absolute inset-0 grid place-items-center bg-ink/60 backdrop-blur-[2px] text-[13px] font-extrabold text-blush"
              }, " ناموجود ")) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button class="${ssrRenderClass([[
        saved.value ? "bg-blush text-ink shadow-[0_0_14px_rgba(240,171,252,0.5)]" : "bg-ink/60 text-snow hover:bg-ink/80 hover:text-blush"
      ], "pressable absolute top-3 left-3 z-10 grid h-10 w-10 place-items-center rounded-full backdrop-blur-md border border-white/10 transition-colors cursor-pointer"])}"${ssrRenderAttr("aria-pressed", saved.value)}${ssrRenderAttr("aria-label", saved.value ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها")}>`);
      _push(ssrRenderComponent(unref(HeartIcon), {
        size: 18,
        filled: saved.value
      }, null, _parent));
      _push(`</button><div class="p-3.5"><div class="flex items-center justify-between gap-2"><p dir="ltr" class="truncate text-[12.5px] font-extrabold tracking-wide text-snow">${ssrInterpolate(__props.p.name)}</p><span class="flex shrink-0 items-center gap-1 text-[11px] font-bold text-gold tnum" dir="ltr">`);
      _push(ssrRenderComponent(unref(StarIcon), {
        size: 12,
        filled: true,
        class: "text-gold"
      }, null, _parent));
      _push(` ${ssrInterpolate(__props.p.rating.toFixed(1))}</span></div>`);
      if (flavorHint.value) {
        _push(`<p class="mt-1 truncate text-[11px] text-mist">${ssrInterpolate(flavorHint.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<p class="mt-0.5 text-[10px] font-bold text-dim" dir="ltr">${ssrInterpolate(__props.p.brand)} · ${ssrInterpolate(unref(CATS_META)[__props.p.categorySlug]?.label ?? "")}</p><div class="mt-3 flex items-center justify-between gap-2"><div><p class="text-[13.5px] font-extrabold text-snow tnum">${ssrInterpolate(unref(money)(price.value))}</p>`);
      if (__props.p.discountPrice != null) {
        _push(`<p class="text-[10.5px] text-dim line-through tnum">${ssrInterpolate(unref(money)(__props.p.price))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button${ssrIncludeBooleanAttr(out.value) ? " disabled" : ""} class="${ssrRenderClass([[
        out.value ? "bg-white/6 text-dim" : "bg-gradient-to-br from-vio to-ice text-ink shadow-[0_6px_22px_-6px_rgba(167,139,250,0.65)]"
      ], "pressable grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition-all duration-300 cursor-pointer"])}"${ssrRenderAttr("aria-label", `افزودن ${__props.p.name} به سبد`)}>`);
      _push(ssrRenderComponent(unref(PlusIcon), {
        size: 22,
        sw: 2.4
      }, null, _parent));
      _push(`</button></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vapor/ProductCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ProductCard = Object.assign(_sfc_main, { __name: "VaporProductCard" });

export { ProductCard as P };
//# sourceMappingURL=ProductCard-CumuzPRn.mjs.map
