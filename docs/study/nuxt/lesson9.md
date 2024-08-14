大家好，我是村长！

上一讲我们学习了如何基于 API Route 编写接口，有了接口就需要获取数据，Nuxt3 中提供的多种数据访问 API：

  * $fetch；

  * useAsyncData；

  * useLazyAsyncData；

  * useFetch；

  * useLazyFetch。

## 为什么需要 $fetch？

前面说过，如果开发团队有服务端，并且接口已经开发完毕，则我们可以直接调用这些接口。但是由于我们是服务端渲染，不得不考虑接口的调用时机问题：

  * 首屏渲染，调用发生在服务端；
  * 客户端激活之后，调用发生在客户端。

这导致我们首先需要判断代码执行环境，其次发送请求的 API
可能不同，另外如果在客户端发送请求到其他接口服务器还会存在跨域问题，需要给项目配代理，很复杂是吧！ **这就是 Nuxt3 为什么替我们封装了**
**`$fetch`** **，它全局可用，可以智能处理调用时机，还能统一 API，避免配置代理** 。

## Nuxt3 数据访问 API

上节课我们用到了`$fetch`，我们会像下面这样使用它:

    
    
    const { data } = await $fetch('/api/hello', { query: { name: 'tom' } })
    const { result } = await $fetch('/api/post', { method: 'post', body: newPost })
    

可以看到，$fetch 的 API 和 fetch 是一样的，实际调用的是
[unjs/ofetch](https://github.com/unjs/ofetch)。它的用法符合我们之前的编码习惯，返回
Promise，然后用户负责处理后续操作。但如果要加上一些其他 loading、error 等反馈，我们通常要添加额外组件状态来实现，比较繁琐。

后来到了 hooks 时代，React 社区出现了诸如 ahooks、swr 等库，通过封装请求，暴露出 data、loading、error
等状态，然后可以在组件内直接使用，非常高效。Nuxt3 也为我们提供了四个接口，通过封装
$fetch，给用户提供响应式数据便于直接使用。下面我们一起来看一下它们的使用方式异同：

### useFetch

页面、组件或者插件中可以使用`useFetch`获取任意 URL
资源。`useFetch`是对`useAsyncData`和`$fetch`的封装，只需传入请求的 URL
或者一个请求函数即可，一些选项会自动填入，用起来最简洁，是最推荐的数据获取方式。

`useFetch`方法签名：

    
    
    function useFetch(
      url: string | Request | Ref<string | Request> | () => string | Request,
      options?: UseFetchOptions<DataT>
    ): Promise<AsyncData<DataT>>
    
    type AsyncData<DataT> = {
      data: Ref<DataT> // 返回数据
      pending: Ref<boolean> // 加载状态
      refresh: (opts?: { dedupe?: boolean }) => Promise<void> // 刷新数据
      execute: () => Promise<void> // 同 refresh，没有去重选项
      error: Ref<Error | boolean> // 错误信息
    }
    

我们实践一下，将前面的博客列表获取操作重构为`useFetch()`方式。

很明显，我们处理各种状态更便捷了！index.vue：

    
    
    <template>
      <div class="flex items-center flex-col gap-2 py-4">
        <!-- 处理请求错误 -->
        <div v-if="error" class="text-red-300">{{ error.message }}</div>
        <!-- 处理加载状态 -->
        <div v-if="pending">加载中...</div>
        <div v-else>
            <div v-for="post in posts" :key="post.id">
              <NuxtLink class="text-lg" :to="`/detail/${post.id}`">{{
                post.title
              }}</NuxtLink>
              <p class="text-slate-500">发布于: {{ post.date }}</p>
            </div>
        </div>
      </div>
    </template>
    
    <script setup lang="ts">
      // const posts = await $fetch("/api/posts");
      const { data: posts, pending, error } = await useFetch('/api/posts')
    </script>
    

### useLazyFetch

该方法等效于`useFetch`设置了`lazy`选项为 true，不同之处在于它 **不会阻塞路由导航** ，这意味着我们需要处理 data 为 null
的情况（或者通过 default 选项给 data 设置一个默认值）。

前面的例子，将 useFetch 替换为 useLazyFetch 同样可行：

    
    
    const { data: posts, pending, error } = await useLazyFetch('/api/posts')
    

### useAsyncData

下面说一下`useAsyncData`，该方法和 `useFetch` 相比功能上是相同的，但是更底层，使用方法类似于 ahooks 库中的
`useRequest`，我们需要提供一个用于缓存去重的 key 和数据请求的处理函数。也就是说，`useFetch`
相当于：`useAsyncData(key, () => $fetch(url))`。

`useAsyncData`签名如下，因此 useAsyncData 有两种用法：一种传 key，一种不传 key，但是即使你不传，Nuxt
也会帮你生成一个，所以该用哪个不用我说了吧！？

    
    
    function useAsyncData(
      handler: (nuxtApp?: NuxtApp) => Promise<DataT>,
      options?: AsyncDataOptions<DataT>
    ): AsyncData<DataT>
    function useAsyncData(
      key: string,
      handler: (nuxtApp?: NuxtApp) => Promise<DataT>,
      options?: AsyncDataOptions<DataT>
    ): Promise<AsyncData<DataT>>
    

我们实践一下，用 `useAsyncData` 获取文章内容数据，detail/[id].vue：

    
    
    <template>
      <div class="p-5">
        <div v-if="pending">加载中...</div>
        <div v-else>
          <h1 class="text-2xl">{{ data?.title }}</h1>
          <div v-html="data?.content"></div>
        </div>
      </div>
    </template>
    
    <script setup lang="ts">
    const router = useRoute();
    const fetchPost = () => $fetch(`/api/detail/${router.params.id}`);
    const { data, pending } = await useAsyncData(fetchPost);
    </script>
    

### useLazyAsyncData

该方法等效于`useAsyncData`，仅仅设置了`lazy`选项为true，也就是它不会阻塞路由导航，这意味着我们需要处理 data 为 null
的情况，或者通过 default 选项给 data 设置一个默认值。

## 刷新数据

有时候页面数据是需要刷新的，比如：翻页、条件过滤、搜索等。

我们可以使用`useFetch()`等 API 返回的`refresh()`刷新数据。需要注意，如果请求的 key
参数没有发生变化，我们实际上拿到的还是之前缓存的结果。例如下面代码执行 `refresh()` 并不会得到最新数据：

    
    
    const { data, refresh } = useFetch('/api/somedata')
    // 数据并没有刷新！
    refresh()
    

而想要获取最新数据，就要在 url 中添加一个参数，并作为函数返回值传给`useFetch`：

    
    
    // url需要改为由函数返回
    const { data, refresh } = useFetch(() => `/api/somedata?page=${page}`)
    // 数据刷新！
    page++
    refresh()
    

### 范例：分页获取文章列表

下面的范例在请求参数上添加一个页码，则页码变化后再刷新就可以得到最新的数据了，index.vue：

    
    
    <script setup lang="ts">
    const page = ref(1);
    const {
      data: posts,
      pending,
      error,
      refresh, // 获取刷新函数
    } = await useFetch(() => `/api/posts?page=${page.value}&size=2`); // 注意修改为工厂函数方式
    
    function prev() {
      page.value--;
      refresh();
    }
    
    function next() {
      page.value++;
      refresh();
    }
    </script>
    

相应的，我们需要修改 posts 接口，posts.ts：

    
    
    export default defineEventHandler((event) => {
      // 获取当前页码 page
      const query = getQuery(event);
      const page = Number(query.page);
      const size = Number(query.size);
    
      // ...
      // 降序排列、分页
      const start = (page - 1) * size;
      const end = start + size;
      return posts
        .sort((a, b) => (a.date < b.date ? 1 : -1))
        .slice(start, end);
    });
    

## 总结

到这里我们全面了解了 Nuxt3 中各种数据请求 API 的使用方法。如果大家有选择困难症，我建议大家减少选项，因为 `useFetch`
本质上是高层封装，可以完全替代其他几个 API，另外如果我们还是想使用传统的数据获取方式，那就选择 `$fetch`就好了！

## 下次预告

解决数据获取的任务之后，下一步就是状态管理了，Nuxt3 有一个内置的 useState 方法可以用于全局状态的管理，当然我们也会整合 Pinia
到项目中以便满足后面项目开发需要。

