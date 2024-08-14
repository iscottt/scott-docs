大家好，我是村长！本节我们给大家介绍 Nuxt 中最强大的扩展方法“模块”的使用和开发知识。

跟前面讲过的中间件、插件比起来，模块可以认为是一组来自第三方的自定义功能的整合，可以大大简化功能扩展和整合工作难度，社区存在大量优秀模块可以使用，我们不需要从零开发常用需求。如果说
Nuxt
是一台机器，那么中间件、插件都只能算是机器内的零件，而模块则是完成特定功能的一个完整部件。显然后者影响面更大，复用性更强，应该说是我们项目开发中的主要扩展手段。

本节将会包括如下内容：

  * 查找优秀模块；

  * 模块的使用指南；

  * 如何开发模块。

## 查找优秀模块

Nuxt 模块可以以 npm
包的形式发布，社区已经建立了一个相当繁荣的模块生态，我们可以通过下面链接访问：[https://nuxt.com/modules](https://modules.nuxtjs.org/?version=3.x)

目前社区模块相当丰富：

![](img\17\1.image)

### 模块分类

可以通过分类过滤模块版本和功能，目前`Nuxt3`已经是默认分类，另外还有`Nuxt2+Bridge`或`Nuxt2`这两种过滤：

![](img\17\2.image)

还可以根据功能过滤需要的模块，例如下面我选择 UI 过滤出相关模块：

![](img\17\3.image)

## 使用模块

使用模块分为两步：

  1. 安装模块；

  2. 引入、配置模块。

### 安装模块

首先安装模块，我们以 Color-Mode 模块为例演示：

    
    
    yarn add @nuxtjs/color-mode
    

### 引入和配置模块

其次引入模块，添加模块到 nuxt.config.ts 文件 `modules` 选项中，有两种添加方式：

  * 字符串：此方式仅引入，不配置。

    *         export default defineNuxtConfig({
          modules: ['@nuxtjs/color-mode']
        })
        

  * 数组：此方式在引入模块同时添加行内配置。

    *         export default defineNuxtConfig({
          modules: [["@nuxtjs/color-mode", { preference: "dark" }]],
        })
        

  * 有的模块还可以通过独立配置项配置：

    *         export default defineNuxtConfig({
          modules: ['@nuxtjs/color-mode'],
          colorMode: {
            preference: "dark"
          }
        })
        

### 使用模块特性

下面我们在项目中就可以使用模块提供的各种功能了。 例如 Color-Mode 提供的 theme 切换功能，index.vue:

    
    
    <template>
      <div>
        <h1>Color mode: {{ $colorMode.value }}</h1>
        <select v-model="$colorMode.preference">
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="sepia">Sepia</option>
        </select>
      </div>
    </template>
    <script setup>
    const colorMode = useColorMode();
    console.log(colorMode.preference);
    </script>
    
    <style>
    body {
      background-color: #fff;
      color: rgba(0, 0, 0, 0.8);
    }
    .dark-mode body {
      background-color: #091a28;
      color: #ebf4f1;
    }
    .sepia-mode body {
      background-color: #f1e7d0;
      color: #433422;
    }
    </style>
    

## 编写模块

如果大家对于编写模块感兴趣，可以使用工具包 @nuxt/kit
并查阅官方提供的模块开发指南：<https://nuxt.com/docs/guide/going-further/modules>

## 总结

模块的相关知识就跟大家介绍完了，可以看到各种项目开发中常见的需求，社区模块几乎都有支持，能够使我们的开发效率倍增。因此，大家如果想在开发中更加得心应手，未来仍需要花一定时间多多探索各种模块。如果确实没有找到合适的模块，还可以尝试开发一个自己的模块并发布到
npm 上造福社区。

## 下次预告

大家应该还会有个问题，一个项目中可能编写了各种插件、中间件，并引入了不少模块，开始另一个新项目的时候还要再从头开始来一遍。这个问题要如何解决呢？在下节中我们会给大家介绍
Nuxt3 的一个新概念：layers，它正是被用来解决这个问题的。

