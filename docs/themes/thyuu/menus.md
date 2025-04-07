---
# 这一段可以省略，因为默认布局就是doc
layout: doc

# title定义浏览器标签页上显示的标题
title: THYUU/星度主题文档-菜单与链接
---
<div class="title-wrapper">
   <div class="page-title">菜单与链接</div>
   <div class="post-title">—— THYUU/星度主题文档
      <span class="lastModifyTime">
          <i class="fa-regular fa-clock"></i> 最后更新： 2025-04-07 14:27:25
      </span>
   </div>
</div>

## 添加菜单

`网站后台/外观/菜单`
 - **顶部菜单**：全站顶部导航菜单
 - **首页顶部图标**：只在首页显示的自定义图标菜单
 - **底部菜单**：显示在全站底部导航菜单

从边栏选择想要添加到菜单的文章/页面，或添加自定义链接

## 添加二级菜单

1. 在边栏的“自定义链接”部分输入“文本”（URL可留空）后，添加到菜单
2. 将其他菜单使用鼠标拖拽到此链接的下级并调整位置

**注： 用于展开子菜单的父级在主题中不可作为链接使用。因此只输入文本即可**

## 使用图标


1. 访问 [FontAwesome](https://kunkunyu.com/themes/thyuu-xingdu/assets/icons/demo_index.html)（若存在可访问性的问题，请尝试使用国际互联网）
2. 选中 `Font Class` 选项卡
3. 复制 `.icon-xxx` 然后将最前面的点去除
5. 将它粘贴到菜单的“文本”位置。图标和文本用`·`分隔例如：`icon-crown·菜单文本`
6. 这样，就会在“菜单文本”的前面显示一个苹果图标了

## 一些固定的URL链接

**主题中有一些固定的URL链接，可以在菜单中添加，也可以在文章中添加**

|  URL   | 位置  |
|  ----  | ----  |
| /  | 首页 |
| /type/image  | 模板为`图片`的文章 |
| /type/gallery  | 模板为`相册`的文章 |
| /type/audio  | 模板为`音频`的文章 |
| /type/video  | 模板为`视频`的文章 |
| /type/quote  | 模板为`一句话`的文章 |
| /type/aside  | 模板为`双栏`的文章 |
| /date/年-月-日  | 根据时间日期去查询文章 |
| /category/别名  | 按分类查询 |
| /tag/别名  | 按标签查询 |
| /sitemap.xml  | 站点地图 |
