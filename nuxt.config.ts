// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  css: ["~/assets/css/main.css"],
  app: {
    baseURL: '/retro-clipper/',
    head: {
      htmlAttrs: { lang: "en" },
      title: "Free Online Clipboard Manager & History | Clipper",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content: "Save and find text, code, links, and AI prompts with Clipper, a free online clipboard manager. Your snippets stay in this browser; no account needed.",
        },
        { name: "robots", content: "index, follow" },
        { property: "og:type", content: "website" },
        { property: "og:title", content: "Free Online Clipboard Manager & History | Clipper" },
        { property: "og:url", content: "https://retrocore.dev/retro-clipper/" },
        {
          property: "og:description",
          content: "Save and find text, code, links, and AI prompts with Clipper, a free online clipboard manager. Your snippets stay in this browser; no account needed.",
        },
        { property: "og:image", content: "https://retrocore.dev/retro-clipper/og-image.png" },
        { property: "og:image:alt", content: "Clipper online clipboard manager" },
        { property: "og:image:type", content: "image/png" },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Free Online Clipboard Manager & History | Clipper" },
        {
          name: "twitter:description",
          content: "Save and find text, code, links, and AI prompts with Clipper, a free online clipboard manager. Your snippets stay in this browser; no account needed.",
        },
        { name: "twitter:image", content: "https://retrocore.dev/retro-clipper/og-image.png" },
      ],
      link: [
        { rel: "canonical", href: "https://retrocore.dev/retro-clipper/" },
        { rel: 'icon', type: 'image/x-icon', href: '/retro-clipper/favicon.ico' },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Share+Tech+Mono&family=VT323&family=JetBrains+Mono:wght@500;800&display=swap",
        },
      ],
    },
  },
});
