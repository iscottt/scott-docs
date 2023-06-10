---
# 这一段可以省略，因为默认布局就是doc
layout: doc

# title定义浏览器标签页上显示的标题
title: 快速上手
---
<div class="title-wrapper">
   <div class="page-title">主题介绍</div>
   <div class="post-title">—— Salary使用手册 · 主题介绍
      <span class="lastModifyTime">
         <i role="img" class="n-icon" style="--n-bezier: cubic-bezier(.4, 0, .2, 1);"><i class="el-icon-time"></i></i> 最后更新： 11 天前
      </span>
   </div>
</div>

# Button 按钮

常用操作按钮

## 基础用法

基础的函数用法

使用<mark>size</mark>、`type`、`ghost`、`round`属性来定义 Button 的样式。

![anchor text](https://blog.scott-studio.cn/uploads/2023/06/mario-cover.webp)
```vue
<template>
 <div style="margin-bottom:20px;">
    <SButton>默认按钮</SButton>
    <SButton type="primary">主要按钮</SButton>
    <SButton type="danger">危险按钮</SButton>
    <SButton type="warning">警告按钮</SButton>
    <SButton type="success">成功按钮</SButton>
 </div>
 <div style="margin-bottom:20px;">
    <SButton type="primary" ghost>主要按钮</SButton>
    <SButton type="danger" ghost>危险按钮</SButton>
    <SButton type="warning" ghost>警告按钮</SButton>
    <SButton type="success" ghost>成功按钮</SButton>
 </div>
 <div style="margin-bottom:20px;">
  <SButton size="small" type="primary">小按钮</SButton>
  <SButton size="medium" type="danger">中按钮</SButton>
  <SButton size="large" type="warning">大按钮</SButton>
 </div>
 <div style="margin-bottom:20px;">
    <SButton>默认按钮</SButton>
    <SButton type="primary" icon="search">搜索按钮</SButton>
    <SButton type="primary" icon="edit">编辑按钮</SButton>
    <SButton type="warning" icon="message">提示按钮</SButton>
    <SButton type="danger" icon="delete">删除按钮</SButton>
    <SButton type="success" icon="check">成功按钮</SButton>
 </div>
 <div style="margin-bottom:20px;">
  <SButton type="primary" round icon="search"></SButton>
  <SButton type="warning" round icon="edit"></SButton>
  <SButton type="danger" round icon="check"></SButton>
  <SButton type="success" round icon="message"></SButton>
  <SButton round icon="delete"></SButton>
 </div>
</template>
```


## 图标按钮

带图标的按钮可增强辨识度（有文字）或节省空间（无文字）。

设置 icon 属性即可，icon 的列表可以参考 Element 的 icon 组件，也可以设置在文字右边的 icon ，只要使用 i 标签即可，可以使用自定义图标。


```vue
<template>
  <div class="flex flex-row">
    <SButton icon="edit" ghost type="danger"></SButton>
    <SButton icon="delete" ghost type="warning"></SButton>
    <SButton icon="share" ghost type="success"></SButton>
    <SButton round ghost icon="search" type="primary">搜索</SButton>
  </div>
</template>
```

::: tip 提示
如果需要在 Button 内嵌入其他组件，可以直接在 Button 内使用其他组件即可，例如使用 Icon 组件实现带图标的按钮。
:::

::: warning 警告
如果需要在 Button 内嵌入其他组件，可以直接在 Button 内使用其他组件即可，例如使用 Icon 组件实现带图标的按钮。
:::

::: danger 错误
如果需要在 Button 内嵌入其他组件，可以直接在 Button 内使用其他组件即可，例如使用 Icon 组件实现带图标的按钮。
:::
