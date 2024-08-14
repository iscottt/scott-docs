import { defineConfigWithTheme } from "vitepress";
import mdItCustomAttrs from 'markdown-it-custom-attrs'
import sidebar from "./theme/sidebar";
const ogImage = "https://blog.scott-studio.cn/uploads/2024/08/doc-logo.webp";
const ogTitle = "SCOTTUI";
const ogUrl = "https://vitejs.dev";
const ogDescription = "Next Generation Frontend Tooling";
export default defineConfigWithTheme({
  title: "SCOTT Studio 教程&文档",
  description: "SCOTT的文档站",
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "https://blog.scott-studio.cn/uploads/2024/08/doc-logo.webp" }],
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
    // logo: "./assets/imgs/channel-logo.png",
    socialLinks: [
      { icon: "github", link: "https://github.com/iscottt/scott-docs" },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'COPYRIGHT © 2022 - 至今 SCOTT-STUDIO.CN'
    },

    search: {
      provider: 'local'
    },
    nav: [
      { text: "首页", link: "/" },
      { text: "博客", link: "https://blog.scott-studio.cn" },
      {
        text: "nvPress主题",
        items: [
          { text: "Salary", link: "/themes/Salary/guide",activeMatch: "/themes/Salary" },
        ]
      },
      {
        text:"掘金小册",
        items:[
          { text: "CSS技术揭秘与实战通关", link: "/study/css/background",activeMatch: "/study/css" },
          { text: "Nuxt3.0全栈开发", link: "/study/nuxt/lesson1",activeMatch: "/study/nuxt" },
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
