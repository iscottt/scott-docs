---
# 这一段可以省略，因为默认布局就是doc
layout: doc

# title定义浏览器标签页上显示的标题
title: Somnia-菜单与链接
---
<div class="title-wrapper">
   <div class="page-title">菜单与链接</div>
   <div class="post-title">—— Somnia使用手册
      <span class="lastModifyTime">
          <i class="fa-regular fa-clock"></i> 最后更新： 1 天前
      </span>
   </div>
</div>

## 添加菜单

`网站后台/外观/菜单`

从边栏选择想要添加到菜单的文章/页面，或添加自定义链接

## 添加二级菜单

1. 在边栏的“自定义链接”部分输入“文本”（URL可留空）后，添加到菜单
2. 将其他菜单使用鼠标拖拽到此链接的下级并调整位置

**注： 用于展开子菜单的父级在主题中不可作为链接使用。因此只输入文本即可**

## 使用图标

**主题使用 FomtAwesome 作为前台全局图标，可在下面的链接搜索免费的图标进行使用，不支持Pro版收费图标。**

1. 访问 [FontAwesome](https://fontawesome.com/v6/search?o=r&m=free)（若存在可访问性的问题，请尝试使用国际互联网）
2. 在输入框中输入图标，例如：apple
3. 在 “Free” 类型下，选择一个你喜欢的图标
4. 点击喜欢的图标后，复制 HTML 代码，例如：`<i class="fa-brands fa-apple"></i>`
5. 将它粘贴到菜单的“文本”位置。例如：`<i class="fa-brands fa-apple"></i> 菜单文本`
6. 这样，就会在“菜单文本”的前面显示一个苹果图标了

## 一些固定的URL链接

**主题中有一些固定的URL链接，可以在菜单中添加，也可以在文章中添加**

|  URL   | 位置  |
|  ----  | ----  |
| /  | 首页 |
| /articles  | 所有文章 |
| /sitemap.xml  | 站点地图 |
