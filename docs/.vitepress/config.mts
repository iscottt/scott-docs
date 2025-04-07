import { defineConfigWithTheme } from "vitepress";
import mdItCustomAttrs from 'markdown-it-custom-attrs'
import sidebar from "./theme/sidebar";
const ogImage = "https://scott-studio.cn/uploads/2025/04/adKkrAWumr_wS8VdwIRMZz2c.svg";
const ogTitle = "木木笔记";
const ogUrl = "https://docs.scott-studio.cn/";
const ogDescription = "木木笔记 —— 灵感的栖息地";
export default defineConfigWithTheme({
  title: "木木笔记",
  description: "灵感的栖息地",
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "https://scott-studio.cn/uploads/2025/04/adKkrAWumr_wS8VdwIRMZz2c.svg" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:title", content: ogTitle }],
    ["meta", { property: "og:image", content: ogImage }],
    ["meta", { property: "og:url", content: ogUrl }],
    ["meta", { property: "og:description", content: ogDescription }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:site", content: "@vite_js" }],
    ["meta", { name: "theme-color", content: "#646cff" }],
    [
      "link",
      { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/@fancyapps/ui/dist/fancybox.css" },
    ],
    ["script", { src: "https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.umd.js" }],
  ],
  themeConfig: {
    logo: "https://scott-studio.cn/uploads/2025/04/adKkrAWumr_wS8VdwIRMZz2c.svg",
    socialLinks: [
      { icon: "github", link: "https://github.com/iscottt/scott-docs" },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'COPYRIGHT © 2022 - 至今 木木笔记'
    },

    search: {
      provider: 'local'
    },
    nav: [
      { text: "首页", link: "/" },
      {
        text: "博客",
        items: [
          { text: 'SCOTT Studio', link: "https://blog.scott-studio.cn" },
          { text: '三禾木木', link: "https://scott-studio.cn" },
        ]
      },
      {
        text: "主题",
        items: [
          { text: "Somnia", link: "/themes/Somnia/guide", activeMatch: "/themes/Somnia" },
          { text: "THYUU/星度", link: "/themes/thyuu/guide", activeMatch: "/themes/thyuu" },
        ]
      },
      {
        text: "掘金小册",
        items: [
          { text: "CSS技术揭秘与实战通关", link: "/study/css/background", activeMatch: "/study/css" },
          { text: "Nuxt3.0全栈开发", link: "/study/nuxt/lesson1", activeMatch: "/study/nuxt" },
        ]
      }
    ],
    sidebar,
    aside: true,
    // outline设置为deep可以解析2-6层深度的标题嵌套
    outline: 'deep',
    // 设置所有aside的标题
    outlineTitle: "文章Wiki",
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
  },
  markdown: {
    config: (md) => {
      // use more markdown-it plugins!
      md.use(mdItCustomAttrs, 'image', {
        'data-fancybox': "gallery"
      })
    }
  }
});
