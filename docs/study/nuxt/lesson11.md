大家好，我是村长！上一节我们学习了如何 Nuxt3 内置状态管理方法`useState()`，还整合了优秀的全局状态管理库
Pinia。本节我们探讨项目开发过程中如何处理各种错误，以使我们项目更加健壮并能够提供更好的用户体验。

本节涉及内容如下：

  * 三种错误类型分类；

  * 不同错误情况的处理方式。

## 三种错误类型

Nuxt3 是全栈框架，代码可能运行在客户端和服务端，因此错误类型可分为以下三种情况：

  * Vue 渲染过程中的错误（包括客户端和服务端）；

  * Nitro 引擎内部运行时错误；

  * 服务器和客户端启动错误（包括客户端和服务端）。

## Vue 渲染过程中的错误

视图层是通过 Vue 实现的，因此不管是 SSR，还是 SPA 在渲染过程中的错误，都可以在 Vue 层面处理，当然也可以等错误传播到顶层时通过 Nuxt
提供的生命周期钩子处理。

### 利用 Vue 选项处理错误

首先看一下 Vue 层面的处理方法：`onErrorCaptured`，这是 Vue 实例提供的全局配置选项，可以这样配置：

    
    
    app.config.errorHandler = (error, context) => {}
    

现在的问题是如何获得 Vue 实例，方法是通过 Nuxt 提供的插件机制获取：

    
    
    export default defineNuxtPlugin((nuxtApp) => {
      // 通过 nuxtApp.vueApp 获取 Vue 实例
      nuxtApp.vueApp.config.errorHandler = (error, context) => {
        // ...
      }
    })
    

> 关于 Nuxt 插件机制，我们在后续章节会详细介绍

下面我们在个人博客范例中添加错误捕获功能，创建 ~/plugins/error.ts：

    
    
    export default defineNuxtPlugin((nuxtApp) => {
      nuxtApp.vueApp.config.errorHandler = (..._args) => {
        console.log('vue error handler')
      }
    })
    

测试效果：这里访问了一个不存在的变量：

![](img\11\1.image)

![](img\11\2.image)

### 利用 Nuxt 钩子处理错误

还有一种处理方式，是利用 Nuxt 层级的钩子捕获来自 Vue 传播上来的错误。可用的钩子有两个：

  * app:error：整个应用层面的错误捕获；

  * vue:error：仅 Vue 层面的错误捕获。

添加两个钩子`app:error`, `vue:error`，plugins/error.ts。

    
    
    export default defineNuxtPlugin((nuxtApp) => {
      nuxtApp.hook('app:error', (..._args) => {
        console.log('app:error')
      })
      nuxtApp.hook('vue:error', (..._args) => {
        console.log('app:error')
      })
    })
    

观察错误输出：三个错误处理都触发了，而且有自下而上的先后顺序 errorHandler -> vue:error -> app:error。

![]()

## 服务端错误处理

如果错误发生在服务端，比如 API Route 或 Nitro 服务器内部发生的错误，此时服务端会有一个 JSON 响应或者 HTML
错误页面，像下面这样：

![](img\11\4.image)

### 抛出异常

前面的页面对开发者友好，对用户却不怎么友好，因此我们可以在服务端自定义错误信息。

大家可以使用 `createError` 方法抛出异常，然后在客户端处理，就像下面这样：

    
    
    export default defineEventHandler((event) => {
      // 参数类型有问题就抛出异常
      const id = parseInt(event.context.params.id) as number
      if (!Number.isInteger(id)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'ID 应该是一个整数',
        })
      }
      return 'ok'
    })
    

### 范例：文章详情接口错误处理

下面我们修改文章详情接口，如果用户传递的 id 没有对应的文章，则抛出异常，server/detail/[id].ts:

    
    
    export default defineEventHandler(async (event) => {
      // ...省略部分代码
      // 判断 fullPath 是否可以访问
      try {
        fs.accessSync(fullPath);
        // ...省略读取文章内容部分代码
      } catch (err) {
        // 没有此文件或没有访问权限
        throw createError({
          statusCode: 404,
          statusMessage: "文章不存在"
        });
      }
    });
    

相应的，客户端要处理该异常，我们看一下 [id].vue 中如何处理：可以获取`useAsyncData`返回的`error`并显示：

    
    
    <template>
      <div class="p-5">
        <!-- 显示错误信息 -->
        <div v-if="error">{{ errorMsg }}</div>
        <div v-else-if="pending">加载中...</div>
        <div v-else>
          <!-- ...省略部分代码 -->
        </div>
      </div>
    </template>
    <script setup lang="ts">
    import { NuxtError } from "#app";
    const fetchPost = () => $fetch(`/api/detail/${route.params.id}`);
    // 添加 error
    const { data, pending, error } = await useAsyncData("post", fetchPost);
    // 获取服务端返回的错误信息
    const errorMsg = computed(() => (error.value as NuxtError).statusMessage)
    </script>
    

效果如下：

![](img\11\5.image)

## 自定义错误页面

有另一种交互处理，是显示一个全屏错误页面给用户以提供更好的体验，Nuxt 对错误信息页面有默认处理，如果需要自定义，可以 **在项目根目录创建一个
error.vue** ，该页面会接收一个包含错误信息的 error 属性。

### 范例：自定义错误页面

创建 ~/error.vue：

    
    
    <template>
      <div class="pt-10">
        <h1 class="text-2xl text-center mb-2">
          出了点错 - {{ props.error?.statusCode }}
        </h1>
        <NEmpty description="你什么也找不到">
          <template #extra>
            <n-button @click="retry">重试</n-button>
            <n-button @click="handleError">回到首页</n-button>
          </template>
        </NEmpty>
      </div>
    </template>
    
    <script setup lang="ts">
    const props = defineProps({
      error: Object,
    });
    console.log(props.error);
    const router = useRouter();
    const retry = () => window.location.href = props.error!.url;
    const handleError = () => clearError({ redirect: "/" });
    </script>
    

现在再看一下错误页面效果，是不是好多了？

![](img\11\6.image)

### 显示错误页面

Nuxt 提供了 showError 方法显示全屏错误，传递一个字符串或者错误对象即可。

    
    
    showError('文件不存在')
    showError(new Error('文件不存在'))
    

### 范例：详情页报错使用自定义错误页

前面详情页报错是在当前页显示错误信息，如果想要全屏显示，可以调用 showError 方法，[id].vue:

    
    
    const { data, pending, error } = await useAsyncData("post", fetchPost);
    const errorMsg = computed(() => (error.value as NuxtError).statusMessage)
    // 显示全屏错误页
    watchEffect(() => {
      // error 存在，则显示错误页
      if (unref(error)) {
        showError(errorMsg.value as string);
      }
    });
    

## 组件级错误处理

Nuxt 还有一个组件级的错误处理组件 ， **专门用于处理客户端错误** 。

### NuxtErrorBoundary

我们可以把` <NuxtErrorBoundary>` 作为容器组件将内容包起来，其默认插槽中发生的错误会被捕获，避免向上冒泡，并且渲染 error
插槽。我们可以像下面这样使用 ：

    
    
    <template>
      <NuxtErrorBoundary @error="errorLogger">
        <!-- 默认插槽放置要渲染的内容 -->
        <!-- ... -->
        <!-- error 插槽处理错误，接收 error 为错误信息 -->
        <template #error="{ error }">
          这里显示错误信息
          <button @click="error = null">
            设置 error = null 清除错误，显示内容
          </button>
        </template>
      </NuxtErrorBoundary>
    </template>
    

### 范例：在组件内处理错误

创建页面 pages/error-handle.vue:

    
    
    <template>
      <NuxtErrorBoundary>
        <!-- 默认插槽显示正常内容 -->
        <!-- 触发一个错误 -->
        <ThrowError></ThrowError>
        <!-- error插槽显示错误时内容 -->
        <template #error="{ error }">
          <p class="my-4 text-xl text-gray-500">发生了一些错误 {{ error }}</p>
          <NButton type="success" @click="error.value = null"> 修正错误 </NButton>
        </template>
      </NuxtErrorBoundary>
    </template>
    

创建 ThrowError 抛出错误，components/ThrowError.vue:

    
    
    <template>
      <div>
        <NButton @click="throwError">你点我试试</NButton>
      </div>
    </template>
    <script setup lang="ts">
    const throwError = () => {
      throw new Error("来自 ThrowError 组件的异常");
    };
    </script>
    

## 总结

到这里，错误处理常见的情况和方法都介绍完了。结合 Nuxt 提供的全局钩子，可以配合 Sentry 等系统做错误监控；结合 Nuxt 提供的异常
API，可以更好地编写服务端友好的错误处理代码；结合自定义错误页面可以做统一错误处理，给用户更好的体验；结合 NuxtErrorBoundary
可以做好局部组件内的错误处理。

## 下次预告

下一步我们将结合开发实践，给大家介绍一些比较常用的 Nuxt 配置，这会让我们在未来的项目开发中更加得心应手。

