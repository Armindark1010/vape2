
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T

interface _GlobalComponents {
  VaporAIAssistant: typeof import("../../app/components/vapor/AIAssistant.vue")['default']
  VaporAgeGate: typeof import("../../app/components/vapor/AgeGate.vue")['default']
  VaporBottomNav: typeof import("../../app/components/vapor/BottomNav.vue")['default']
  VaporBottomSheet: typeof import("../../app/components/vapor/BottomSheet.vue")['default']
  VaporBuyBox: typeof import("../../app/components/vapor/BuyBox.vue")['default']
  VaporCartSheet: typeof import("../../app/components/vapor/CartSheet.vue")['default']
  VaporCategorySlider: typeof import("../../app/components/vapor/CategorySlider.vue")['default']
  VaporFilterSheet: typeof import("../../app/components/vapor/FilterSheet.vue")['default']
  VaporFooterV: typeof import("../../app/components/vapor/FooterV.vue")['default']
  VaporGallery: typeof import("../../app/components/vapor/Gallery.vue")['default']
  VaporIceMeter: typeof import("../../app/components/vapor/IceMeter.vue")['default']
  VaporProductCard: typeof import("../../app/components/vapor/ProductCard.vue")['default']
  VaporProductRail: typeof import("../../app/components/vapor/ProductRail.vue")['default']
  VaporRailItem: typeof import("../../app/components/vapor/RailItem.vue")['default']
  VaporSectionRow: typeof import("../../app/components/vapor/SectionRow.vue")['default']
  VaporShopBar: typeof import("../../app/components/vapor/ShopBar.vue")['default']
  VaporToasts: typeof import("../../app/components/vapor/Toasts.vue")['default']
  VaporVIcons: typeof import("../../app/components/vapor/VIcons")['default']
  VaporBackground: typeof import("../../app/components/vapor/VaporBackground.vue")['default']
  NuxtWelcome: typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']
  NuxtLayout: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
  NuxtErrorBoundary: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
  ClientOnly: typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']
  DevOnly: typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']
  ServerPlaceholder: typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']
  NuxtLink: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']
  NuxtLoadingIndicator: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
  NuxtTime: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
  NuxtRouteAnnouncer: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
  NuxtImg: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
  NuxtPicture: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
  NuxtPage: typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']
  NoScript: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']
  Link: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']
  Base: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']
  Title: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']
  Meta: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']
  Style: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']
  Head: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']
  Html: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']
  Body: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']
  NuxtIsland: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']
  LazyVaporAIAssistant: LazyComponent<typeof import("../../app/components/vapor/AIAssistant.vue")['default']>
  LazyVaporAgeGate: LazyComponent<typeof import("../../app/components/vapor/AgeGate.vue")['default']>
  LazyVaporBottomNav: LazyComponent<typeof import("../../app/components/vapor/BottomNav.vue")['default']>
  LazyVaporBottomSheet: LazyComponent<typeof import("../../app/components/vapor/BottomSheet.vue")['default']>
  LazyVaporBuyBox: LazyComponent<typeof import("../../app/components/vapor/BuyBox.vue")['default']>
  LazyVaporCartSheet: LazyComponent<typeof import("../../app/components/vapor/CartSheet.vue")['default']>
  LazyVaporCategorySlider: LazyComponent<typeof import("../../app/components/vapor/CategorySlider.vue")['default']>
  LazyVaporFilterSheet: LazyComponent<typeof import("../../app/components/vapor/FilterSheet.vue")['default']>
  LazyVaporFooterV: LazyComponent<typeof import("../../app/components/vapor/FooterV.vue")['default']>
  LazyVaporGallery: LazyComponent<typeof import("../../app/components/vapor/Gallery.vue")['default']>
  LazyVaporIceMeter: LazyComponent<typeof import("../../app/components/vapor/IceMeter.vue")['default']>
  LazyVaporProductCard: LazyComponent<typeof import("../../app/components/vapor/ProductCard.vue")['default']>
  LazyVaporProductRail: LazyComponent<typeof import("../../app/components/vapor/ProductRail.vue")['default']>
  LazyVaporRailItem: LazyComponent<typeof import("../../app/components/vapor/RailItem.vue")['default']>
  LazyVaporSectionRow: LazyComponent<typeof import("../../app/components/vapor/SectionRow.vue")['default']>
  LazyVaporShopBar: LazyComponent<typeof import("../../app/components/vapor/ShopBar.vue")['default']>
  LazyVaporToasts: LazyComponent<typeof import("../../app/components/vapor/Toasts.vue")['default']>
  LazyVaporVIcons: LazyComponent<typeof import("../../app/components/vapor/VIcons")['default']>
  LazyVaporBackground: LazyComponent<typeof import("../../app/components/vapor/VaporBackground.vue")['default']>
  LazyNuxtWelcome: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
  LazyNuxtLayout: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
  LazyNuxtErrorBoundary: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
  LazyClientOnly: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']>
  LazyDevOnly: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']>
  LazyServerPlaceholder: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
  LazyNuxtLink: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
  LazyNuxtLoadingIndicator: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
  LazyNuxtTime: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
  LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
  LazyNuxtImg: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
  LazyNuxtPicture: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
  LazyNuxtPage: LazyComponent<typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']>
  LazyNoScript: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
  LazyLink: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']>
  LazyBase: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']>
  LazyTitle: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']>
  LazyMeta: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']>
  LazyStyle: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']>
  LazyHead: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']>
  LazyHtml: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']>
  LazyBody: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']>
  LazyNuxtIsland: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
