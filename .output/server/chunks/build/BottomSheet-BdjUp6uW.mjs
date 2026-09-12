import { defineComponent, ref, watch, useSSRContext } from 'vue';
import { ssrRenderTeleport, ssrRenderAttr, ssrRenderStyle, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BottomSheet",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    label: {},
    snap: { default: "88svh" }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    ref(null);
    const currentY = ref(0);
    ref(false);
    watch(
      () => props.open,
      (isOpen) => {
        return;
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.open) {
          _push2(`<div class="relative z-[80]"><template><button class="fixed inset-0 z-[80] w-full bg-black/65 backdrop-blur-[3px] cursor-pointer"${ssrRenderAttr("aria-label", `بستن ${__props.label}`)}></button></template><template><div role="dialog" aria-modal="true"${ssrRenderAttr("aria-label", __props.label)} class="safe-bottom fixed inset-x-0 bottom-0 z-[81] flex flex-col rounded-t-[26px] border-t border-white/10 bg-[#0e0e13]/95 backdrop-blur-2xl sheet-shadow transition-transform duration-75" style="${ssrRenderStyle({
            height: __props.snap,
            maxHeight: "92svh",
            transform: currentY.value > 0 ? `translateY(${currentY.value}px)` : void 0
          })}"><div class="flex shrink-0 cursor-grab touch-none items-center justify-center pt-3 pb-1 active:cursor-grabbing" aria-hidden="true"><span class="h-1.5 w-12 rounded-full bg-white/20"></span></div>`);
          ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent);
          _push2(`</div></template></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vapor/BottomSheet.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const BottomSheet = Object.assign(_sfc_main, { __name: "VaporBottomSheet" });

export { BottomSheet as B };
//# sourceMappingURL=BottomSheet-BdjUp6uW.mjs.map
