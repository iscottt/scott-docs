大家好，我是村长！

从本篇开始我们将探讨 Nuxt 工程架构相关的知识，我们将学习一些进阶知识，从更高层级审视 Nuxt，从而更加得心应手地使用 Nuxt。本篇涉及内容如下：

  * Nuxt 框架生命周期；
  * 中间件使用；
  * 插件的使用；
  * 模块的使用；
  * 层的使用；
  * 项目模版使用；
  * 工程化搭建。

## Nuxt 生命周期钩子

本节探讨的是 Nuxt 的生命周期钩子，为什么要了解这个知识呢？

主要是因为我们后续的项目扩展知识需要用到各种钩子函数，比如编写一个 Nuxt
插件或者模块，我们常常需要在框架执行的某个特定阶段做一些特定的事情，又或者我们需要获取并修改 Nuxt 应用实例或者 Vue 实例，等等。

比如前面章节中在错误处理时，我们就用到过钩子函数：

    
    
    export default defineNuxtPlugin((nuxtApp) => {
      nuxtApp.hook('app:error', (..._args) => {
        console.log('app:error')
      })
      nuxtApp.hook('vue:error', (..._args) => {
        console.log('vue:error')
      })
    })
    

## Nuxt 生命周期分类

由于 Nuxt 整合了 Vue、Nitro 前后端两个运行时，再加上它自身的创建过程，因此框架生命周期钩子分为三类：

  * Nuxt 钩子；

  * Vue App 钩子；

  * Nitro App 钩子。

### Nuxt 钩子

Nuxt 钩子在构建时执行，贯穿初始化和构建过程中各种工具和引擎，例如 Nuxi、Vite、Webpack、Nitro 等，主要用于编写模块时构建上下文。

基本用法如下：

    
    
    import { defineNuxtModule } from '@nuxt/kit'
    
    export default defineNuxtModule({
      setup (options, nuxt) {
        nuxt.hook('ready', async (nuxt: Nuxt) => { 
          // 在这里配置 nuxt
        })
      }
    })
    

我们做一个实际应用作为演示：在整合 NaiveUI 时，如果按照官方操作自动导入，则无法获得 TS 类型支持。

这个需求可以用一个模块来完成：这里利用了 prepare:types 这个钩子配置 ts：

    
    
    import { defineNuxtModule } from '@nuxt/kit'
    
    export default defineNuxtModule({
      setup (options, nuxt) {
        nuxt.hook('prepare:types', ({ tsConfig, references }) => {
          tsConfig.compilerOptions!.types.push('naive-ui/volar')
          references.push({
            path: resolve(nuxt.options.buildDir, 'types/naive-ui.d.ts'),
          })
        })
      }
    })
    

### Vue App 钩子

会在运行时调用，主要用于编写插件，从而可以在渲染生命周期中插入代码逻辑。

基本用法如下：

    
    
    export default defineNuxtPlugin((nuxtApp) => {
      nuxtApp.hook('app:created', (vueApp) => {
        // 可以在这里修改 vue 实例
      })
    })
    

我们做一个实际应用作为演示：给 Vue 添加一个全局的方法 $alert。

这个需求可以用一个插件来完成：这里利用了 app:created 这个钩子配置 Vue 实例：

    
    
    // plugins/alert.ts
    export default defineNuxtPlugin((nuxtApp) => {
      nuxtApp.hook("app:created", (vueApp) => {
        vueApp.config.globalProperties.$alert = (msg: string) => {
          const message = useMessage();
          message.warning(msg);
        };
      });
    });
    

试用一下，index.vue：

    
    
    const ins = getCurrentInstance()
    onMounted(() => {
      ins?.proxy?.$alert('component mounted！')
    })
    

### Nitro App 钩子

会在 Nitro 引擎运行时调用，用于编写服务端插件，从而可以修改或扩展引擎的默认行为。

例如下面插件利用 render:html 钩子修改了最终渲染的 html 内容，并在响应时打了一条日志：

    
    
    export default defineNitroPlugin((nitroApp) => {
      nitroApp.hooks.hook('render:html', (html, { event }) => {
        console.log('render:html', html)
        html.bodyAppend.push('<hr>Appended by custom plugin')
      })
      nitroApp.hooks.hook('render:response', (response, { event }) => {
        console.log('render:response', response)
      })
    })
    

## 可用钩子列表

文档中有一个比较详细的可用钩子列表，大家可以参考：

<https://nuxt.com/docs/api/advanced/hooks>

## 总结

Nuxt 中的钩子函数比 Vue
复杂多了，想要一下掌握非常困难。我建议大家可以先整体上了解一下都有哪些钩子，大概是干什么的，以后在真正有需要的时候，知道有这么个东西，就会给你带来解决问题的思路。另外学习其他优秀项目的时候，如果见到了，也可以很容易理解和消化人家的代码。

## 下次预告

关于生命周期就给大家讲到这里了，后续的学习中我们还会见到它们。下次内容我们将给大家介绍中间件的使用。

