大家好，我是村长！

上一讲我们掌握了文件路由的各种使用方法，并用 layouts 特性实现快速页面布局。本节我们继续完善个人博客的功能和用户体验，添加一些图片和 CSS
样式，并且引入目前比较流行的 CSS 库：Tailwindcss。

## 资源目录

Nuxt 项目存放样式、图片等静态资源的目录默认有两个：

  * public：会被作为应用程序根目录提供给用户，打包工具不会处理，访问时添加`/`即可，例如：`/logo.png`。

    
    
    <template>
      <img src="/logo.png" />
    </template>
    

  * assets：打包工具会处理，访问时以`~`开头，例如：`~/assets/logo.png`。

    
    
    <template>
      <img src="~/assets/logo.png" />
    </template>
    

> 除了`~`，Nuxt3 中还有一些默认别名：
>  
>  
>     {
>       "~~": "/<rootDir>",
>       "@@": "/<rootDir>",
>       "~": "/<rootDir>",
>       "@": "/<rootDir>",
>       "assets": "/<rootDir>/assets",
>       "public": "/<rootDir>/public"
>     }
>  

下面我们引入一个作者头像图片试一下，layouts/default.vue：

    
    
    <template>
      <div>
        <nav>
          导航栏
          <img class="avatar" src="~/assets/avatar.png" alt="avatar" />
        </nav>
        <slot />
      </div>
    </template>
    <style scoped>
    .avatar {
      width: 50px;
      border: 1px solid rgb(218, 218, 218);
      border-radius: 50%;
    }
    </style>
    

可以正常使用!

![](img\6\1.image)

## 全局样式

有两种方式可以配全局样式：

  * 配置文件 nuxt.config.ts；

  * app.vue 中引入。

### nuxt.config.ts 配置全局样式:

    
    
    export default defineNuxtConfig({
      css: [
        'assets/global.css'
      ]
    })
    

创建 assets/global.css：

    
    
    a {
      text-decoration: none;
      color: #3370ff;
    }
    

### app.vue 中引入全局样式

也可以在 app.vue 中引入样式：

    
    
    <script>
    import "~/assets/global.css";
    </script>
    

效果如下：

![](img\6\2.image)

### 使用 CSS 预处理器：Sass

如果要使用 Sass，安装 `sass` 即可：

    
    
    yarn add sass -D 
    

对应的，重命名 global.css 为 global.scss，并添加一个变量测试一下：

    
    
    $linkColor: #3370ff;
    
    a {
      text-decoration: none;
      color: $linkColor;
    }
    

修改配置文件，nuxt.config.ts：

    
    
    export default defineNuxtConfig({
      css: [
        'assets/global.scss'
      ]
    })
    

效果如初~

![](img\6\3.image)

### 全局样式导入

如果想在 pages 和 components 里面使用 Sass 变量，则需要配置全局样式导入。

首先创建 assets/_variables.scss，移动变量到它里面。然后添加一个 vite 配置，nuxt.config.ts

    
    
    // https://nuxt.com/docs/api/configuration/nuxt-config
    export default defineNuxtConfig({
      css: ["assets/global.scss"],
      vite: {
        css: {
          preprocessorOptions: {
            scss: {
              additionalData: '@import "~/assets/_variables.scss";',
            },
          },
        },
      },
    });
    

下面就可以在组件页面中使用这些变量了，[id].vue：

    
    
    <style scoped lang="scss">
    p {
      color: $linkColor
    }
    </style>
    

效果如下：

![](img\6\4.image)

## 整合 Tailwindcss

现在原子化 css 已经非常流行了，例如 Tailwindcss、Windicss 等，能够提升开发效率和体验。我们在后续项目开发中也将使用
Tailwindcss，因此这里给大家演示一下如何整合。

### 整合 Tailwindcss

安装 @nuxtjs/tailwindcss 模块：

    
    
    yarn add --dev @nuxtjs/tailwindcss
    

添加配置项，nuxt.config.ts：

    
    
    {
      modules: [
        '@nuxtjs/tailwindcss'
      ]
    }
    

### 配置全局样式和变量

Tailwind 官方强烈建议单独使用 postcss，不要和其他 Sass 等预处理器混用。因此我们将替换掉前面的实现。

添加全局样式文件，请注意路径和文件名必须是：`assets/css/tailwind.css`

    
    
    @import '_variables.css';
    
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    
    a {
      text-decoration: none;
      color: var(--link-color);
    }
    

_variables.css 就是前面的 _variables. scss，同时修改内容为：

    
    
    :root {
      --link-color: #3370ff;
    }
    

最后，修改组件中使用方式，[id].vue:

    
    
    <style scoped>
    p {
      color: var(--link-color)
    }
    </style>
    

除了头像部分，这是因为 tailwind 默认样式导致，我们添加一些 class 修正一下：

    
    
    <img
        class="w-[50px] border-[1px] border-slate-300 rounded-full inline-block"
        src="~/assets/avatar.png"
        alt="avatar"
    />
    

效果基本如初~

![](img\6\5.image)

### 样式调整

最后我们调整导航样式，让它看起来更像个导航~ default.vue：

    
    
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
    

效果还不错：

![](img\6\6.image)

## 下次预告

好了！相信大家都可以很自如的使用各种图片和样式资源了，下一步，我们体验 Nuxt 丝滑的自动导入特性，并整合组件库到项目中，以备后续项目功能开发使用！

