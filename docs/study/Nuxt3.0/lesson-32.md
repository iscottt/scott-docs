大家好，我是村长！

前面完成了项目开发的大部分工作，本节我们从安全和用户体验等角度出发，对项目做一些必要的改进，我们计划完成以下功能：

  * 页面权限控制；
  * 加载进度反馈；
  * ……

## 如何提供良好用户体验？

想要提供良好的用户体验给用户，通常需要做到以下几点：

  1. 网站导航：为用户提供直观和易理解的网站导航结构。确保网站的导航条、面包屑和搜索框等元素在网站的每个页面上都存在。
  2. 访问速度：确保网站能被快速加载。在移动设备上访问网站的用户特别需要更快的加载速度。
  3. 响应式设计：确保网站在所有设备上都能够良好的呈现，并且自适应屏幕大小和分辨率。
  4. 内容呈现：网站上的内容应该清晰明了。
  5. 安全：确保网站的安全性，用户信息不被泄露。
  6. 交互和反馈：简化用户交互方式，例如注册、登录、购买等过程的简化。提供及时的交互反馈，例如友好的错误提示，加载进度反馈等。

## 响应式设计

我们网站之前没有考虑移动端适配，这导致用户在移动端观看体验非常差。实际上利用 tailwind 和 naive-ui 提供的响应式特性可以很容易适配移动端。

接下来以首页为例，演示一下如何通过简单调整实现移动端适配。

首先是 banner 高度调整，之前高度为 400px，移动端显然要低一些，我们按照 1024 / 375 的比例缩放到 150px
左右，pages/index.vue：

    
    
      <n-carousel show-arrow class="mb-6">
        <div
          v-for="item in slides" :key="item.label"
          class="text-white w-full rounded cursor-pointer text-center leading-[400px]
    -       h-[400px]
    +       h-[150px] 
    +       lg:h-[400px]"
          :style="{ backgroundColor: item.bgColor }"
        >
          {{ item.label }}
        </div>
      </n-carousel>
    

看一下效果：

![](img\32\1.image)

接下来是调整布局整体最小宽度，之前有设置一个 min-w-[1024px]，现在显然需要是大于 1024px
之后才起作用，layouts/default.vue：

    
    
    <div 
        class="bg-gray-100 flex flex-col min-h-screen
    -     min-w-[1024px]
    +     lg:min-w-[1024px]"
    >
        <MyHeader />
        <main class="container m-auto mt-20">
          <slot />
        </main>
        <MyFooter />
      </div>
    

效果如下：

![](img\32\2.image)

登录按钮溢出去了，这是因为 padding 没有算在容器宽度内，大屏下空间充裕看不出来。可以看到，我们添加了 box-border，同时缩小了小屏下的
padding 值，MyHeader.vue：

    
    
    <div class="container m-auto flex items-center h-[60px]
    -  px-4" 
    +  lg:px-4 px-2 box-border"
    >
    

效果好多了：

![](img\32\3.image)

最后是课程和专栏列表显示调整，在小屏中只需要显示一列，这可以利用 NGrid 的响应式特性。例如，ProdList.vue 组件中定义响应式的
cols：之前是写死的 4 列，现在则是 m 断点时才显示 4 列，小屏显示 1 列，这里大家显然可以做得再细一点，比如 iPad 宽度下显示两列。

    
    
    <NGrid responsive="screen" x-gap="12" class="mb-6"
    -  :cols="4"
    +  cols="1 m:4"
    >
      <NGi v-for="item in data" :key="item.id">
        <Prod :data="item" :type="type" />
      </NGi>
    </NGrid>
    

> 还有值得注意的点，naive-ui 中断点和 tailwind 不甚相同，可以通过 NConfigProvider 修改。

看一下显示效果：

![](img\32\4.image)

其他页面调整大家可以自行尝试。

## 页面权限控制

在我们项目会有一些页面需要权限控制，比如：

  * 用户中心页面；
  * 订单确认页面；
  * 支付页面；
  * ……

这些页面通常需要用户登录之后才能查看，而我们之前并未处理。

### 通过路由中间件实现页面权限控制

在以前，我们做 vue 应用页面权限控制，通常会采用路由守卫的方式，即通过 vue-router 实例提供的 beforeEach
等钩子添加路由守卫从而达到页面权限管理的目的。

Nuxt 中封装了 vue-router，想要获取路由器实例可以通过 useRouter，然后再添加守卫。然而官方却不推荐这么做，详情参见：

<https://nuxt.com/docs/api/composables/use-router#navigation-guards>

显然从简化实现和开发体验考虑，我们应该使用路由中间件来实现。

### 创建 Auth 中间件

下面我们创建一个 auth 中间件，通过判断是否存在 token 判断用户是否登录，通过 navigateTo 重定向。创建
~/middleware/auth.ts：

    
    
    export default defineNuxtRouteMiddleware((to, from) => {
      const token = useCookie('token')
      const route = useRoute()
    
      // 未登录重定向到登录页
      if (!token.value) {
        if (process.client)
          message.error('请先登录')
    
        return navigateTo(`/login?from=${route.fullPath}`)
      }
    })
    

### 注册中间件

然后，在需要的页面注册 auth 中间件。

pages/usercenter.vue

    
    
    definePageMeta({
      middleware: ['auth'],
    })
    

同样的还有订单和支付页，不再赘述。最终效果如下：

![](img\32\5.image)

## 加载进度反馈

加载进度反馈是提升用户体验的有效方法，大家应该注意到 useFetch 这类 API 的特点就是会返回一个 pending
状态，这个用来实现加载进度反馈再合适不过了。

### 骨架屏

加载进度反馈的方式就很多了，比较经典的有：

  * 进度条
  * 菊花图
  * 骨架屏

我们结合 naive-ui 骨架屏组件完成一个加载进度反馈实现，~/components/Loading.vue:

    
    
    <script setup lang="ts">
    const props = defineProps({
      pending: {
        type: Boolean,
        default: false,
      },
    })
    
    // 防止加载过快画面闪烁
    const loading = ref(false)
    watchEffect(() => {
      if (props.pending && !loading.value) {
        loading.value = true
      }
      else {
        setTimeout(() => {
          loading.value = false
        }, 200)
      }
    })
    </script>
    
    <template>
      <div>
        <template v-if="loading">
          <slot name="loading">
            <NCard v-for="i in 4" :key="i" class="mb-5">
              <NSkeleton text style="width: 30%" />
              <NSkeleton text :repeat="2" />
              <NSkeleton text style="width: 45%" />
              <NSkeleton text style="width: 60%" />
            </NCard>
          </slot>
        </template>
        <template v-else>
          <slot />
        </template>
      </div>
    </template>
    

我们在 Loading
中实现了默认的骨架屏模版，在不同页面使用的时候还需要根据内容做调整，比如我们会给课程列表和专栏列表专门做一个骨架屏组件，components/LoadingCourseSkeleton.vue：

    
    
    <template>
      <NGrid :x-gap="20" :y-gap="5" :cols="4">
        <NGridItem v-for="i in 8" :key="i">
          <NCard class="mb-5">
            <template #cover>
              <NSkeleton height="150px" width="100%" />
            </template>
            <NSkeleton width="50%" height="15px" class="my-2" />
            <NSkeleton text style="width: 60%" />
          </NCard>
        </NGridItem>
      </NGrid>
    </template>
    

下面在页面中使用 Loading，我们只需引入 pending 状态并设置在 Loading 的 pending
属性上即可。同时，我们还替换了默认的骨架屏为 LoadingCourseSkeleton，这样出来的效果一致性更好！

pages/list/[type].vue

    
    
    <script setup lang="ts">
    const {
       data,
    +  pending,
    } = await useFetch<IResult>(() => `${url}?page=${page.value - 1}`, {
      watch: [page],
    })
    </script>
    <template>
    +   <Loading :pending="pending">
    +     <template #loading>
    +       <LoadingCourseSkeleton />
    +     </template>
    +     <template #default>
            <!-- 课程渲染 -->
            <NGrid :x-gap="20" :cols="4">
              <NGi v-for="item in data?.data.list" :key="item.id">
                <Prod :data="item" :type="type" />
              </NGi>
            </NGrid>
            <!-- 分页组件 -->
            <div class="flex justify-center items-center mt-5 mb-10">
              <NPagination
                size="large" :item-count="data?.data.total" :page="page" :page-size="size"
                :on-update:page="onPageChange"
              />
            </div>
    +    </template>
    +  </Loading>
     </template>
    

最终效果如下：

![](img\32\6.image)

## 下次预告

下一讲将会是收官之作，给大家演示一下项目部署流程。

