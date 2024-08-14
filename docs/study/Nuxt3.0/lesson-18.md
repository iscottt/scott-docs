大家好，我是村长！

前面我提到了一个开发中常见需求：能够复用之前项目中的配置、已存在的组件、工具方法等等。Nuxt3 提供的 layers
特性能使我们非常容易地创建和维护这样的项目基础结构。

本节将会包括如下内容：

  * layers 的使用场景；

  * layers 使用方法 ；

  * layers 常见用例；

  * 如何定制一个 layers。

## Layers 使用场景

以下情况下比较适合使用 layers：

  * 共享可重用配置项；
  * 使用 components 目录共享组件库；
  * 使用 composables 和 utils 目录共享工具函数；
  * 创建 Nuxt 主题；
  * 创建模块预设；
  * 共享标准初始化步骤。

## Layers 使用方法

我们可以在 nuxt.config.ts 中配置 `extends` 选项从而继承一个 layers 配置。

有三种配置 layers 方式：

  * 相对地址：从本地继承；
  * Npm 包名：从 npm 安装；
  * Github URL：从 Github 下载。

就像下面这样配置，nuxt.config.ts：

    
    
    export default defineNuxtConfig({
      extends: [
        '../base',                     // 从本地继承
        '@my-themes/awesome',          // 从 npm 安装
        'github:my-themes/awesome#v1', // 从 github 下载
      ]
    })
    

### 范例：使用 docus 建设文档网站

社区有个用于文档建设的项目叫 docus，提供了 50 多个组件和设计系统便于创建文档类页面。docus 完全基于 layers
方式创建，因此可以快速在已存在的 Nuxt 项目中引入。

首先安装 docus：

    
    
    yarn add @nuxt-themes/docus
    

接下来只需要在项目中添加 extends 选项，nuxt.config.ts：

    
    
    defineNuxtConfig({
      extends: '@nuxt-themes/docus'
    })
    

这就好了！下面在 content 目录创建一个页面试试，content/index.md：

    
    
    ---
    title: "Get Started"
    description: "Let's learn how to use my amazing module."
    aside: true
    bottom: true
    toc: true
    ---
    
    # Get Started
    Let's learn how to use my amazing module.
    go to [installed](/install) page.
    
    ## 使用组件
    
    ### alert 组件
    ::alert{type="info"}
    Check out an **info** alert with `code`.
    ::
    
    ## 配置页面
    
    ### layout
    

效果如下：

![](img\18\1.image)

## 定制一个 layers

下面我带大家定制一个 layers 结构，它基本上和一个 Nuxt 项目的结构是一致的，因此非常容易构建和维护。

### 基本范例

下面我们重构之前案例为如下结构：nuxt-docus 是之前的 docus 项目， base 基于 layers 结构存放公用资源，nuxt-app 使用
base 中的资源。

    
    
    base/
    nuxt-app/
    nuxt-docus/
    

base 中至少应该存放一个 nuxt.config.ts 文件，存放一些通用配置，这指明当前目录是一个 layers 结构:

    
    
    export default defineNuxtConfig({
      app: {
        head: {
          title: 'Extending configs by layers',
          meta: [
            { name: 'description', content: 'I am using the extends feature in nuxt3!' }
          ],
        }
      }
    })
    

同时我们再创建一个公用组件 BaseButton.vue:

    
    
     <template>
      <button
        class="text-white px-4 py-2 flex-1 flex items-center justify-center shadow-lg rounded bg-sky-500 hover:bg-sky-600"
      >
        <slot>按钮</slot>
      </button>
    </template>
    

准备就绪，我们在 nuxt-app 中配置该继承 base：

    
    
    // https://nuxt.com/docs/api/configuration/nuxt-config
    export default defineNuxtConfig({
      modules: [
        '@nuxtjs/tailwindcss'
      ],
      extends: [
        '../base'
      ]
    })
    

现在 app.vue 中可以直接使用 BaseButton：

    
    
    <BaseButton></BaseButton>
    

### 从模版项目开始定制 layers

Nuxi 有个命令可以初始化一个 layer 结构让我们快速开始：

    
    
    npx nuxi init --template layer nuxt-layer
    

## 总结

layers
相关知识就跟小伙伴们介绍到这里了，可以看到利用层特性很容易复用已存在的项目中的共享资源，让我们项目可维护性大增。例如我们有一个大项目，可以做成一个
monorepo 项目，提取通用部分到 layers 中共享，其他项目按模块拆分，这样项目整体就会变得非常清爽易维护。

## 下次预告

下节课我们一起完成 Nuxt 项目工程化搭建工作，会包括一些常见的代码规范化、测试等任务。

