// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },

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
      title: "ویپورا | فروشگاه تخصصی ویپ، سالت و پاد — دودِ نرم، طعمِ ناب",
      titleTemplate: "%s | ویپورا",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
        { name: "theme-color", content: "#09090b" },
        {
          name: "description",
          content:
            "فروشگاه تخصصی ویپورا — خرید آنلاین پاد یک‌بارمصرف، سالت نیکوتین، مود و لوازم جانبی اصل با هولوگرام. ارسال فوری تهران، پرداخت در محل، ضمانت اصالت کالا.",
        },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "fa_IR" },
        { property: "og:title", content: "ویپورا — دودِ نرم، طعمِ ناب" },
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
          type: "image/svg+xml",
          href: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' rx='7' fill='%2309090b'/%3E%3Cpath d='M12 4.5s5.2 5.4 5.2 9.2a5.2 5.2 0 0 1-10.4 0C6.8 9.9 12 4.5 12 4.5Z' fill='%23a78bfa'/%3E%3C/svg%3E",
        },
      ],
    },
  },
});
