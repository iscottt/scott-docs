大家好，我是村长！

本节我们讲一下中间件，什么是中间件？大家如果接触过 express、koa 这类 node.js 框架，应该都会知道它们其实就是 **请求拦截器**
，当一个请求过来时，通过中间件可以增加自己的处理逻辑，相当于流水线上加一道“工序”。在 Nuxt 中也存在这种中间件机制，只不过被细分为两种：

  * Route middleware：路由中间件；
  * Server middleware：服务器中间件。

## 路由中间件

路由中间件并不是一定运行在客户端的中间件，而是运行在 Nuxt 应用中 Vue 渲染部分，路由中间件会在进入路由之前被调用，如果是
SSR，这个执行时刻既可能在服务端（首屏），也可能在客户端。

### 中间件类型

路由中间件根据影响范围和使用方式的不同，又分为三种：

  * 匿名中间件：只影响一个页面，不可复用；

  * 具名中间件：指定若干影响页面，可复用、组合；

  * 全局中间件：影响所有页面，文件名需要加后缀 global。

### 中间件使用

匿名中间件用法，mid.vue：

    
    
    definePageMeta({
      middleware(to, from) {
        console.log('匿名中间件，具体页面执行');
      }
    })
    

具名中间件用法，mid.vue：

    
    
    definePageMeta({
      middleware: ['amid', 'bmid']
    })
    

定义具名中间件，amid.ts：

    
    
    export default defineNuxtRouteMiddleware((to, from) => {
      console.log('具名中间件a，影响指定页面：' + to.path); 
    })
    

全局中间件，创建 cmid.global.ts：

    
    
    export default defineNuxtRouteMiddleware((to, from) => {
      console.log('全局中间件c，影响所有页面');
    })
    

效果如下：

![](img\15\1.image)

### 参数和工具方法

中间件可以获取目标路由 to 和来源路由 from，还有两个很常用的工具方法：

  * abortNavigation(error)：跳过，留在 from；
  * navigateTo(route)：指定跳转目标。

    
    
    export default defineNuxtRouteMiddleware((to, from) => {
      if (to.params.id === '1') {
        return abortNavigation()
      }
      return navigateTo('/')
    })
    

### 范例：路由守卫

下面给应用加一个路由守卫功能：如果没有登录则不能访问详情页 [id].vue。

首先创建 middleware/auth.ts：

    
    
    export default defineNuxtRouteMiddleware((to, from) => {
      const store = useUser();
      // 未登录，导航到登录页
      if (!store.isLogin) {
        return navigateTo("/login?callback=" + to.path)
      }
    })
    

页面中注册一下中间件，[id].vue：

    
    
    definePageMeta({
      middleware: ['auth']
    })
    
    // 现在留言不需要在页内判断登录态
    

## 服务端中间件

每当请求到达服务器时，会在处理其他路由之前先执行中间件。因此可以用服务端中间件做一些诸如：请求头检测、请求日志、扩展请求上下文对象等等任务。

### 服务端中间件使用

Nuxt 会自动读取 ~/server/middleware 中的文件作为服务端中间件，例如下面请求日志中间件：

    
    
    export default defineEventHandler((event) => {
      console.log('New request: ' + event.node.req.url)
    })
    

中间件还可以执行审查、扩展上下文或抛出错误：

    
    
    export default defineEventHandler((event) => {
      // 扩展上下文对象
      event.context.userInfo = { user: ‘cunzhang’ }
      // 审查请求信息
      const id = parseInt(event.context.params.id) as number
      if (!Number.isInteger(id)) {
        // 抛出错误
        return sendError(createError({
          statusCode: 400,
          statusMessage: 'ID should be an integer',
        }))
      }
    })
    

### 范例：保护指定服务端接口

下面我们完成一个接口保护的需求：用户如果未登录，不能调用 `/api/detail/xxx`。

首先实现一个 server 中间件，检查指定接口请求中是否包含 token，~/server/middleware/auth.ts：

    
    
    import { H3Event } from "h3";
    
    export default defineEventHandler((event) => {
      // 请求不被允许时返回响应错误
      const isAllowed = protectAuthRoute(event);
      if (!isAllowed) {
        return sendError(
          event,
          createError({ statusCode: 401, statusMessage: "Unauthorized" })
        );
      }
    });
    
    function protectAuthRoute(event: H3Event) {
      const protectedRoutes = ["/api/detail"];
      // path 不以 protectedRoutes 中任何项为起始则允许请求
      if (
        !event?.path ||
        !protectedRoutes.some((route) => event.path?.startsWith(route))
      ) {
        return true;
      }
      return authCheck(event);
    }
    
    // 检查是否已认证
    function authCheck(event: H3Event) { 
      const token = getHeader(event, "token");
      if (!token) {
        return false;
      }
      return true;
    }
    

对应的，客户端详情页 `[id].vue` 不再需要中间件保护，同时需要在请求时携带令牌，并且处理可能的响应错误：

    
    
    // definePageMeta({
    //   middleware: ["auth"],
    // });
    
    const route = useRoute();
    const router = useRouter();
    const store = useUser();
    const fetchPost = () =>
      $fetch(`/api/detail/${route.params.id}`, {
        // 如果已登录，请求时携带令牌
        headers: store.isLogin ? { token: "abc" } : {},
        onResponseError: ({ response }) => {
          // 如果响应 401 错误，重新登录
          if (response.status === 401) {
            router.push("/login?callback=" + route.path);
          }
        },
      });
    

效果如下：

![](img\15\2.image)

## 总结

至此，中间件的使用就介绍完了。可以看见中间件类似拦截器，前端拦截页面路由，后端拦截请求。路由中间件非常灵活，可以很容易控制作用范围和组合；服务端中间件则只能全局作用，在使用时要注意是不是指向作用于部分路由，如果是的话，要做一些额外的判断逻辑。

## 下次预告

除了中间件，Nuxt 还提供了另一种扩展框架能力的手段：插件，下次内容我们将给大家介绍插件的使用。

