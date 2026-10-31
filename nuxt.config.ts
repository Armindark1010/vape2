// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },

  devServer: {
    https: false,
    port: 3001,
    host: '0.0.0.0',
  },


  future: {
    compatibilityVersion: 4,
  },

  postcss: {
    plugins: {
      "@tailwindcss/postcss": {},
    },
  },

  css: ["~/assets/css/main.css"],

  app: {
    head: {
      htmlAttrs: {
        lang: "fa",
        dir: "rtl",
      },
      title: "ویپ‌لب | فروشگاه تخصصی ویپ، سالت و پاد — دودِ نرم، طعمِ ناب",
      titleTemplate: "%s | ویپ‌لب (VAPELAB)",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
        { name: "theme-color", content: "#09090b" },
        {
          name: "description",
          content:
            "فروشگاه تخصصی ویپ‌لب (VAPELAB) — خرید آنلاین پاد یک‌بارمصرف، سالت نیکوتین، مود و لوازم جانبی اصل با هولوگرام. ارسال فوری تهران، پرداخت در محل، ضمانت اصالت کالا.",
        },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "fa_IR" },
        { property: "og:title", content: "ویپ‌لب — دودِ نرم، طعمِ ناب" },
        {
          property: "og:description",
          content: "پاد یک‌بارمصرف، سالت نیکوتین و مود اصل با ضمانت اصالت و ارسال فوری.",
        },
        {
          property: "og:image",
          content:
            "https://images.pexels.com/photos/19344605/pexels-photo-19344605.jpeg?auto=compress&cs=tinysrgb&w=1200",
        },
      ],
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&display=swap",
        },
        {
          rel: "icon",
          type: "image/png",
          href: "/favicon.png",
        },
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/favicon.svg",
        },
        {
          rel: "apple-touch-icon",
          href: "/favicon.png",
        },
      ],
      script: [
        {
          type: "module",
          src: "https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js",
        },
      ],
    },
  },

  vue: {
    compilerOptions: {
      isCustomElement: (tag: string) => tag === "model-viewer",
    },
  },
});
