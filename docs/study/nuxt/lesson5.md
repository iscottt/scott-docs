大家好，我是村长！

上一讲完成了最小 Nuxt3
应用，我们体验了一下多页面写法。实际开发中情况会复杂得多，比如路由嵌套，动态路由等等。本节我们创建个人博客的基本结构，恰好会用到以下知识点：

  * 嵌套路由；

  * 动态路由；

  * 页面布局。

## 基于文件的路由

如果发现项目根目录下存在 pages 目录，Nuxt 会自动整合 vue-router，并且根据 pages 目录中的文件创建 routes 配置。

### 目前的页面结构

目前我们的页面由主页和详情页构成：

  * 主页：index.vue 负责显示文章列表；
  * 详情页：detail.vue 负责显示文章详细内容。

    
    
    pages/
    --- index.vue
    --- detail.vue
    

前面的文件结构，生成的路由配置大概像下面这样：

    
    
    [
      {
        path: '/',
        component: '~/pages/index.vue',
      },
      {
        path: '/detail',
        component: '~/pages/detail.vue',
      }
    ]
    

虽然免去繁琐的配置工作，但是需要我们首先去了解一下约定好的映射规则，下面我们先看一下动态路由。

## 动态路由

如果 **文件名或者文件夹名称里面包含了方括号** ，它们将被转换为动态路由参数。比如我们像下面这样修改文件结构：

    
    
    pages/
    --- index.vue
    --- detail-[id].vue
    

我们可以在`detail-[id].vue`中访问`id`这个参数:

    
    
    <template>
      {{ $route.params.id }}
    </template>
    

对应的我们在主页中添加一篇文章链接：`/detail-1`

    
    
    <NuxtLink to="/detail-1">detail 1</NuxtLink>
    

效果非常理想！

![](img\5\1.image)

### 理想的路径

前面的路径`/detail-1`相当丑陋，我们希望是`/detail/1`，则再创建一个文件夹包起来即可：

    
    
    pages/
    --- index.vue
    --- detail/
    ------[id].vue
    

创建`/detail/`目录，移动`detail-[id].vue`的过去，重命名为`[id].vue`，这实际上创建了如下路由配置：

    
    
    {
      path: '/detail/:id',
      component: '~/pages/detail/[id].vue'
    }
    

修改`/index.vue`中跳转链接：

    
    
    <NuxtLink to="/detail/1">detail 1</NuxtLink>
    

效果非常理想！

![](img\5\2.image)

## 嵌套路由

如果存在目录和文件同名，就制造了嵌套路由。比如下面目录结构：

    
    
    pages/
    --- detail/
    ------[id].vue
    --- detail.vue
    --- index.vue
    

这实际上创建了如下路由配置：

    
    
    {
      path: '/detail',
      component: '~/pages/detail.vue',
      children: [
        {
          path: '/:id',
          component: '~/pages/detail/[id].vue'
        }
      ]
    }
    

看一下 detail.vue 中的具体实现：需要添加路由出口`<NuxtPage>`。

    
    
    <template>
      <div>
        <h1>Detail Page</h1>
        <NuxtPage></NuxtPage>
      </div>
    </template>
    

相应的，`[id].vue`中的标题不需要了：

    
    
    <template>
      <div>
        <!-- <h1>Detail Page</h1> -->
        <p>{{ $route.params.id }}</p>
      </div>
    </template>
    

测试效果和刚才一样！

## 布局系统

Nuxt 提供了布局系统，可以把公用的页面布局内容提取到`layouts`目录中以便复用。

例如，在我们案例中，需要一个顶部导航栏，显然它在主页和详情页中都存在，放在布局页中再适合不过了！

我们来看一下怎么做！

首先创建 /layouts/default.vue 作为默认布局页：

    
    
    <template>
      <div>
        <nav>导航栏</nav>
        <slot />
      </div>
    </template>
    

`app.vue`中将页面内容作为布局页的插槽：

    
    
    <template>
      <NuxtLayout>
        <NuxtPage></NuxtPage>
      </NuxtLayout>
    </template>
    

看一下效果：非常好！

![](img\5\3.image)

## 下次预告

页面基本结构搭建好了，需要一些图片和 CSS 修饰一下，下一节我们探索一下 Nuxt 中如何正确的使用各种静态资源并整合 CSS 框架。

