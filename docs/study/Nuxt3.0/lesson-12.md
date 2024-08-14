大家好，我是村长！

上一节我们学习了 Nuxt3 处理异常的各种方法，本讲我们将结合项目开发实践给大家介绍一些比较常用的配置项，为以后的项目开发做准备，本节涉及内容如下：

  * 几种配置方式对比；

  * 开发常用配置；

  * 配置 Meta 信息。

## 几种配置方式对比

Nuxt 应用中有三种常见的配置方式：

  * nuxt.config.ts：覆盖或扩展默认 Nuxt 配置；

  * app.config.ts：配置公共变量；

  * 外部配置文件：配置项目中其他方面。

### nuxt.config.ts

Nuxt 其实有一套默认配置，能够应付大部分需要。但是当我们需要覆盖或扩展默认 Nuxt 配置时，我们就可以在项目根目录下创建一个
nuxt.config.ts，它默认导出 defineNuxtConfig() 的执行结果，再和默认 nuxt
配置合并并最终生效，例如我们前面增加的模块配置：

    
    
    export default defineNuxtConfig({
      modules: [
        "@nuxtjs/tailwindcss",
        "@pinia/nuxt",
        "@huntersofbook/naive-ui-nuxt",
      ],
    });
    

我们会在后面演示一些开发中比较常见的配置方法。

### app.config.ts

如果需要配置一些项目需要的公共变量，可以在项目根目录创建
app.config.ts，这些变量是响应式的，不仅在运行时可以访问，还可以改变。例如下面的配置范例：

    
    
    export default defineAppConfig({
      title: 'Hello Nuxt',
      theme: {
        dark: true,
        colors: {
          primary: '#ff0000'
        }
      }
    })
    

> 实际上，nuxt.config.ts 中有个 appConfig 选项可以起到相同的作用。

访问 app.config.ts 中的变量：

    
    
     const appConfig = useAppConfig()
    

#### 范例：根据配置项设置黑暗模式

创建 ~/pages/config.vue，根据 app.config.ts 中的配置控制黑暗模式和标题。

    
    
    <template>
      <div :class="{ dark: appConfig.theme.dark }">
        <p
          class="bg-blue-300 dark:bg-slate-600 dark:text-slate-200"
          @click="appConfig.title = 'hello'"
        >
          appConfig: {{ appConfig.title }}
        </p>
    
        <label>
          dark mode:
          <NSwitch id="toggle" v-model:value="appConfig.theme.dark" />
        </label>
      </div>
    </template>
    
    <script setup lang="ts">
    const appConfig = useAppConfig();
    </script>
    

> 需要额外开启 tailwind 黑暗模式，tailwind.config.js：
>  
>  
>     module.exports = {
>       darkMode: 'class',
>     }
>  

效果如下：

![](img\12\1.image)

### 外部配置文件

Nuxt 只认 `nuxt.config.ts`，因此一些大家熟悉的独立配置文件会被忽略，作为替代，nuxt.config.ts
中会有对应的配置项，我们来看一下都有哪些：

  * ~~nitro.config.ts~~ ：不能使用，使用 nitro 选项配置；
  * ~~postcss.config.js~~ ：不能使用，使用 postcss 选项配置；
  * ~~vite.config.ts~~ ：不能使用，使用 vite 选项配置；
  * ~~webpack.config.ts~~ ：不能使用，使用 webpack 选项配置。

当然，还有一些配置文件依然可以使用：

  * tsconfig.json；

  * .eslintrc.js；

  * .prettieerrc.json；

  * .stylelintrc.json；

  * tailwind.config.js；

  * vitest.config.js。

## 开发常用配置

下面我们演示一些开发中非常常用的配置项，掌握它们对我们开发很有帮助。

### 配置打包工具

Nuxt 支持 Vite、Webpack 两种打包工具，默认使用 Vite。我们可以根据项目需要选择，设置 builder 即可。

下面配置设置打包工具为 Webpack：

    
    
    export default defineNuxtConfig({
      builder: "webpack"
    });
    

> 注意：需要安装 @nuxt/webpack-builder。

相应的，如果要修改对应打包工具配置，可以使用 Vite 或 Webpack 选项：

    
    
    export default defineNuxtConfig({
      vite: {},
      webpack: {}
    });
    

### 配置渲染模式

Nuxt 默认渲染模式是 SSR 模式。

可以通过设置 `ssr: false` 修改渲染模式为 SPA，nuxt.config.ts：

    
    
    export default defineNuxtConfig({
      ssr: false,
    })
    

可以通过设置 `nitro.presets` 选项修改渲染模式为非 node 模式，nuxt.config.ts：

    
    
    export default defineNuxtConfig({
      nitro: {
        preset: 'vercel'
      },
    })
    

### 端口号

配置了端口号为 8080，避免和其他本地服务端口冲突，package.json:

    
    
    {
      "scripts": {
        "dev": "nuxt dev --port=8080"
      }
    }
    

### 环境变量

Nuxt 配置中有一个运行时配置 `runtimeConfig` 可用于对外暴露值，就像环境变量、秘钥等。默认情况下这些 key 只能用于服务端，除非把
key 存储在 `runtimeConfig.public` 字段中。跟 `appConfig` 比起来，它们只能在 nuxt.config
中定义，值可以被环境变量覆盖，且不能在运行时修改。

添加 `runtimeConfig`，nuxt.config.ts：

    
    
    export default defineNuxtConfig({
      runtimeConfig: {
        // 只能用于服务端的 keys
        apiSecret: '123',
        // 可用于客户端的 keys
        public: {
          apiBase: '/api'
        }
      }
    })
    

访问`runtimeConfig`，修改 config.vue：

    
    
    <template>
      <div :class="{ dark: appConfig.theme.dark }">
        <!-- ... -->
        <!-- 客户端只能访问public里面的key -->
        <p
          class="bg-blue-300 dark:bg-slate-600 dark:text-slate-200"
          @click="appConfig.title = 'hello'"
        >
          runtimeConfig.public.apiBase: {{ runtimeConfig.public.apiBase }}
        </p>
        <!-- ... -->
      </div>
    </template>
    
    <script setup lang="ts">
    const runtimeConfig = useRuntimeConfig()
    console.log('Runtime config:', runtimeConfig)
    // 只在服务端才能输出
    if (process.server) {
      console.log('API secret:', runtimeConfig.apiSecret)
    }
    </script>
    

服务端效果如下：apiBase 和 apiSecret 都可以访问：

![](img\12\2.image)

客户端效果如下：只有 apiBase：

![](img\12\3.image)

#### 范例：环境变量配置

结合 dotenv 可以配置环境变量并覆盖 runtimeConfig 中的对应项，创建 .env 文件:

    
    
    NUXT_API_SECRET=api_secret_token
    NUXT_PUBLIC_API_BASE=https://nuxt3.cn
    

> 注意 `NUXT`，`NUXT_PUBLIC` 前缀，以及驼峰转换对应关系。

现在再看效果：

![](img\12\4.image)

![](img\12\5.image)

### 自动导入

该选项主要设置自动导入，例如前面的 store 目录就可以通过配置该选项，避免用户每次使用时手动导入。nuxt.config.ts：

    
    
    export default defineNuxtConfig({
      imports: {
        dirs: ['store']
      },
    }
    

现在 [id].vue 和 login.vue 中都不需要手动导入 `useUser` 了！

## 配置 Meta 信息

我们常常因为 SEO 等需求需要修改页头等 Meta 信息，Nuxt 提供三种修改 Meta 信息的方法：

  * 全局配置页头信息；
  * composables 方法；
  * 内置组件修改。

### 全局配置页头信息

通过 `app.head` 可以全局配置网站页头信息：

    
    
    export default defineNuxtConfig({
      app: {
        head: {
          charset: 'utf-8', // 快捷方式
          viewport: 'width=device-width, initial-scale=1', // 快捷方式
          title: 'My App',
          meta: [
            { name: 'description', content: 'My amazing site.' },
            { name: 'charset', content: 'utf-8' },
          ],
          "link": [],
          "style": [],
          "script": []
        }
      }
    })
    

#### 范例：设置博客范例页头信息

我们在 nuxt.config.ts 中配置整站的描述和关键字：

    
    
    export default defineNuxtConfig({
      app: {
        head: {
          title: "村长的技术空间",
          meta: [
            { name: "description", content: "专注于前端技术分享" },
            { name: "keywords", content: "nuxt,vue,ts,frontend" },
          ]
        },
      }
    })
    

效果如下：

![](img\12\6.image)

![](img\12\7.image)

### composables 方法

Nuxt 提供了一个 useHead() 可以在组件内修改 meta 信息：

    
    
    <script setup lang="ts">
    useHead({
      title: 'My App',
      meta: [
        { name: 'description', content: 'My amazing site.' }
      ],
      bodyAttrs: {
        class: 'test'
      },
      script: [ { children: 'console.log('Hello world')' } ]
    })
    </script>
    

#### 范例：设置各子页面标题

设置首页标题，index.vue

    
    
    useHead({
      title: '文章列表'
    })
    

这样虽然生效，但之前设置的网站名称被覆盖了：

![](img\12\8.image)

可以设置标题模板解决此问题，app.vue：

    
    
    <script setup lang="ts">
    useHead({
      titleTemplate: (s) => {
        return s ? `${s} - 村长的技术空间` : "村长的技术空间";
      },
    });
    </script>
    

问题解决了：

![](img\12\9.image)

再去详情页设置页面标题，[id].vue：

    
    
    const route = useRoute();
    // 设置为当前文章id
    useHead({
      title: route.params.id as string
    });
    

效果如下：

![](img\12\10.image)

当然也可以设置为文章标题：

    
    
    const { data, pending, error } = await useAsyncData("post", fetchPost);
    // 设置为文章结果
    useHead({
      title: data.value?.title
    });
    

效果如下：

![](img\12\11.image)

### 内置组件修改

Nuxt 还提供了多种组件可以在模板中设置具体页面页头信息：`<Title>`, `<Base>`, `<NoScript>`, `<Style>`,
`<Meta>`, `<Link>`, `<Body>`, `<Html>` , `<Head>`，像下面这样使用：

    
    
    <script setup>
    const title = ref('Hello World')
    </script>
    
    <template>
      <div>
        <Head>
          <Title>{{ title }}</Title>
          <Meta name="description" :content="title" />
        </Head>
      </div>
    </template>
    

这更符合大家直觉了！在 [id].vue 中试一下：效果如初~

    
    
    <template>
      <div class="p-5">
        <Head>
          <Title>{{ data?.title }}</Title>
        </Head>
        <!-- ... -->
      </div>
    </template>
    

## 总结

到这里，开发中常见选项设置就跟大家讨论完毕了。我们不太可能在一节中覆盖全部内容，但是我们演示这些都是最常见的配置需求，可以解决大家大部分问题。更多细节还需要大家多多阅读[文档](https://nuxt.com/docs/api/configuration/nuxt-
config)。

## 下次预告

由于服务端渲染不再像 SPA 一样是一堆静态文件，因此在部署上会复杂一些。下一步我们将探讨 Nuxt 项目的打包部署相关知识。

