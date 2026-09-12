import { _ as __nuxt_component_0 } from './server.mjs';
import { defineComponent, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "SectionRow",
  __ssrInlineRender: true,
  props: {
    title: {},
    sub: {},
    href: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "mt-10" }, _attrs))}><div class="wrap mb-4 flex items-end justify-between"><div><h2 class="text-[19px] font-extrabold text-snow">${ssrInterpolate(__props.title)}</h2>`);
      if (__props.sub) {
        _push(`<p class="mt-1 text-[11.5px] text-dim">${ssrInterpolate(__props.sub)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (__props.href) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: __props.href,
          class: "pressable rounded-xl px-2 py-2 text-[12px] font-extrabold text-vio"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` مشاهده همه ← `);
            } else {
              return [
                createTextVNode(" مشاهده همه ← ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</section>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vapor/SectionRow.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const SectionRow = Object.assign(_sfc_main$2, { __name: "VaporSectionRow" });
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "no-scrollbar snap-x-mandatory flex gap-3 overflow-x-auto px-[max(1rem,calc((100vw-80rem)/2+1rem))] pb-1" }, _attrs))}>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vapor/ProductRail.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ProductRail = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]), { __name: "VaporProductRail" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "RailItem",
  __ssrInlineRender: true,
  props: {
    width: { default: "w-[46vw] max-w-[240px] min-w-[200px]" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: [__props.width, "shrink-0 snap-start"]
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vapor/RailItem.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const RailItem = Object.assign(_sfc_main, { __name: "VaporRailItem" });

export { ProductRail as P, RailItem as R, SectionRow as S };
//# sourceMappingURL=RailItem-C7_DSAjG.mjs.map
