大家好，我是村长！

上一讲我们掌握了项目中静态资源的使用方法，并整合的样式库
Tailwindcss。要快速构建视图，我们还需要引入一个组件库。我估计大家应该挺烦每次使用组件时的各种导入和注册操作，这点 Nuxt3
早就解决了，组件用就完了！而且不仅仅是组件，项目中的复用逻辑 composables，工具方法 utils 等都会自动导入，这可以有效提升开发体验。

下面我们就来体验一下 Nuxt3 丝滑的自动导入功能！

## Nuxt 自动导入特性

Nuxt3 中会处理以下依赖的自动导入。

  * Nuxt 自动导入：数据访问 useFetch、状态管理 useState、App 上下文 useNuxtApp、运行时配置 useRuntimeConfig 等等。

  * Vue自动导入：ref、reactive、computed 等等。

  * 基于路径自动导入：

    * 组件目录：/components ；

    * hooks目录：/composables ；

    * 工具库目录：/utils 。

## 组件自动导入

Nuxt 中约定把组件放在`components/`目录中，这些组件只要被用在页面或其他组件中，就会自动导入并注册。

创建 components/Navbar.vue：

    
    
    <template>
      <nav
        class="border-b border-slate-200 px-5 py-2 flex items-center justify-between"
      >
        <h1 class="text-2xl font-bold">Nuxt3 in Action</h1>
        <img
          class="w-[50px] border-[1px] border-slate-300 rounded-full inline-block"
          src="~/assets/avatar.png"
          alt="avatar"
        />
      </nav>
    </template>
    

下面就可以直接使用了，layouts/default.vue:

    
    
    <template>
      <div>
        <Navbar></Navbar>
        <slot />
      </div>
    </template>
    

### 组件名称约定

没有嵌套的组件会以文件名直接导入，但如果存在嵌套关系呢？例如下面的路径：

    
    
    | components/
    --| base/
    ----| foo/
    ------| Button.vue
    

那么 **组件名称将会基于路径和文件名以大驼峰方式连起来**
，比如上面的`base/foo/Button.vue`注册名称将会是`BaseFooButton`，用起来将会像下面这样：

    
    
    <BaseFooButton />
    

我们尝试一下，从 Navbar 中提取一个 Avatar 组件，以便后续添加其他功能，路径像下面这样设计：

    
    
    | components/
    --| nav/
    ----| Bar.vue
    --- Avatar.vue
    

这样，访问导航组件的名称是：`NavBar`，注意`Bar`变成大写了，default.vue：

    
    
    <template>
      <div>
        <NavBar></NavBar>
        <slot />
      </div>
    </template>
    

再看看 Bar.vue 的变化：

    
    
    <template>
      <nav
        class="border-b border-slate-200 px-5 py-2 flex items-center justify-between"
      >
        <h1 class="text-2xl font-bold">Nuxt3 in Action</h1>
        <Avatar></Avatar>
      </nav>
    </template>
    

最后创建 components/Avatar.vue：

    
    
    <template>
      <img
        class="w-[50px] border-[1px] border-slate-300 rounded-full inline-block"
        src="~/assets/avatar.png"
        alt="avatar"
      />
    </template>
    

## 整合组件库：Naive UI

下面进行 Naive UI 整合工作，我在实践中发现需要解决的问题比较多，例如：

  * Naive UI 组件库按需自动导入；

  * Tailwindcss 覆盖组件库样式问题；

  * TS 类型支持等等。

还好，社区有现成的解决方案可用，我们可以安装 @huntersofbook/naive-ui-nuxt 模块：

    
    
    yarn add @huntersofbook/naive-ui-nuxt -D
    

配置，nuxt.config.ts：

    
    
    // https://nuxt.com/docs/api/configuration/nuxt-config
    export default defineNuxtConfig({
      modules: ["@huntersofbook/naive-ui-nuxt"],
    });
    

测试一下，index.vue：

    
    
    <template>
      <div class="flex items-center flex-col gap-2">
        <h1>Index Page</h1>
        <div>
          <NButton>hello</NButton>
        </div>
        <NuxtLink to="/detail/1">detail 1</NuxtLink>
      </div>
    </template>
    

效果如下：

![](img\7\1.image)

## 总结

自动导入体验之后会觉得非常舒爽，开发体验爆棚。不过很快会有一些疑惑：

  * 哪些库可以直接用，哪些库不能自动导入。这时候大家可以回到本节开头部分，再确认一下 Nuxt3 提供了哪些库和目录的默认导入。

  * Nuxt3 默认只扫描根目录中模块。

  * 可以通过设置 nuxt.config.ts 中 `imports` 选项自定义扫描目录：

    *         export default defineNuxtConfig({
          imports: {
            dirs: [
              // 扫描顶层目录中模块
              'composables',
              // 扫描内嵌一层深度的模块，指定特定文件名和后缀名
              'composables/*/index.{ts,js,mjs,mts}',
              // 扫描给定目录中所有模块
              'composables/**'
            ]
          }
        })
        

## 下次预告

好了！相信大家都可以很自如地使用各种组件和第三方库了，下一步，我们学习 Nuxt 提供给我们的服务端能力，开发一些项目中需要的接口，全栈开发正式起航！

