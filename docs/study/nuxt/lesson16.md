大家好，我是村长！本节我们讲解 Nuxt 插件使用。

插件跟中间件比起来，后者影响的是路由请求本身，而插件影响的是 Nuxt 框架本身，框架主要由自身构建体系、Vue 和 Nitro
构成，所以插件影响的就是这三方面，本节包括如下内容：

  * 创建和注册插件；

  * 插件常见用例。

## 创建和注册插件

Nuxt3 会自动读取 plugins 目录下的文件注册为插件，并在创建 Vue 应用时加载它们。

### 创建插件

使用 `defineNuxtPlugin()` 声明一个插件，像下面这样：

    
    
    // 唯一的参数是 NuxtApp 实例
    export default defineNuxtPlugin(nuxtApp => {
      // Doing something with nuxtApp
      console.log(nuxtApp)
    })
    

### 注册插件

前面提到 Nuxt3 会自动读取 plugins 目录下的文件并加载，但还是有一些细节需要大家了解：

  * 实际上只注册 plugins 目录下根文件和子目录下的 index 文件。

    * ![](img\16\1.image)
  * 插件的执行顺序可以用数字来控制，因为插件之间可能有依赖关系。

    * ![](img\16\2.image)
  * 可在文件名上使用 `.server` 或 `.client` 后缀使插件仅作用于服务端或者客户端。

    *         plugins/
        | - server-plugin.server.ts
        | - client-plugin.client.ts
        

## Nuxt 上下文：NuxtApp

我们看到定义插件时，可以获取到 nuxtApp 对象，该对象是 NuxtApp 的实例，实际上是 Nuxt
提供的运行时上下文，可以同时用于客户端和服务端，并能帮我们访问 Vue实例、运行时钩子、运行时配置的变量、内部状态等。

我们需要了解 nuxtApp 一些重要的方法和属性以便使用：

  * `provide (name, value)`：定义全局变量和方法；

  * `hook(name, cb)`：定义 nuxt 钩子函数；

  * `vueApp`：获取 vue 实例；

  * `ssrContext`：服务端渲染时的上下文；

  * `payload`：从服务端到客户端传递的数据和状态；

  * `isHydrating`：用于检测是否正在客户端注水过程中。

## 常见插件用例

### 用例：使用 Nuxt 生命周期钩子

一个比较常见的插件用例是使用 Nuxt 生命周期钩子实现一些扩展功能，比如在前面的“错误处理”章节中，我们就曾利用插件编写生命周期处理错误的功能：

    
    
    export default defineNuxtPlugin((nuxtApp) => {
      nuxtApp.hook('app:error', (..._args) => {
        console.log('app:error')
      })
      nuxtApp.hook('vue:error', (..._args) => {
        console.log('vue:error')
      })
    })
    

### 用例：访问 Vue 实例

如果要扩展 Vue，我们就需要访问 Vue 实例，然后引入 Vue 插件或其他扩展方式。在 Nuxt3 中可以在插件中通过 `nuxtApp.vueApp`
访问：

比如我们之前配置全局实例方法的范例可以做以下简化：两个 `vueApp` 是同一个实例，plugins/alert.ts。

    
    
    export default defineNuxtPlugin((nuxtApp) => {
      // nuxtApp.hook("app:created", (vueApp) => {
      //   vueApp.config.globalProperties.$alert = (msg: string) => {
      //     const message = useMessage();
      //     message.warning(msg);
      //   };
      // });
      nuxtApp.vueApp.config.globalProperties.$alert = (msg: string) => {
        const message = useMessage();
        message.warning(msg);
      };
    });
    

### 用例：添加全局帮助方法

一个常见用例是给 NuxtApp 实例提供一些额外的帮助方法，我们可以通过 `nuxtApp.provide(key, fn)`
定义这些方法，比如下面例子定义了一个格式化日期的帮助方法 `format`：

    
    
    import dayjs from "dayjs";
    
    export default defineNuxtPlugin((nuxtApp) => {
      nuxtApp.provide("format", (date?: Date, template?: string) => {
        return dayjs(date).format(template);
      });
    });
    

使用 `useNuxtApp()` 获取这个帮助方法，需要额外加一个 `$`，helper.vue：

    
    
    <template>
      <div>
        <ClientOnly>
          <p>{{ date1 }}</p>
          <p>{{ date2 }}</p>
        </ClientOnly>
      </div>
    </template>
    
    <script setup lang="ts">
    const nuxtApp = useNuxtApp();
    const date1 = nuxtApp.$format()
    const date2 = nuxtApp.$format(new Date, 'YYYY/MM/DD')
    </script>
    

#### 给注入方法提供类型支持

通过模块扩展可以给注入的方法、属性提供类型支持，例如前面创建的`format()`方法，创建 ~/types/index.d.ts：

    
    
    declare module '#app' {
      interface NuxtApp {
        $format (date?: Date, msg?: string): string
      }
    }
    
    declare module 'vue' {
      interface ComponentCustomProperties {
        $format (date?: Date, msg?: string): string
      }
    }
    
    export { }
    

效果如下：

![](img\16\3.image)

## 总结

插件整体上来看是一种用户自定义扩展框架的方式，它跟中间件的区别主要在影响的范围和执行时刻上，我们暂时应该用到的不会太多，先做到全面了它的工作解机制即可。

## 下次预告

说到扩展框架能力，最通用、强大的方式当属模块，下次课程我们将对模块的使用和编写做一个全面的学习。

