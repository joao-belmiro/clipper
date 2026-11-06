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
      title: "Online Clipboard Manager & History | Clipper",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content: "Keep a searchable history of text, code, prompts, and links in your browser. Copy and organize snippets with this free online clipboard manager; your data stays on this device.",
        },
        { name: "robots", content: "index, follow" },
        { property: "og:type", content: "website" },
        { property: "og:title", content: "Online Clipboard Manager & History | Clipper" },
        {
          property: "og:description",
          content: "Keep a searchable history of text, code, prompts, and links in your browser. Copy and organize snippets with this free online clipboard manager; your data stays on this device.",
        },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: "Online Clipboard Manager & History | Clipper" },
        {
          name: "twitter:description",
          content: "Keep a searchable history of text, code, prompts, and links in your browser. Copy and organize snippets with this free online clipboard manager; your data stays on this device.",
        },
      ],
      link: [
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
