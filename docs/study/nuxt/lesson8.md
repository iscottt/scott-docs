大家好，我是村长！

上一讲我们体验了自动导入功能，整合了
NaiveUI。再加上前面若干章节的学习，视图开发部分告一段落，紧接着我们需要服务端提供接口和数据来填充视图。获取接口和数据通常有两种情况：

  1. 接口已经存在或者由其他后端同事提供；
  2. 接口并不存在需要我们自行编写。

第一种情况属于数据获取范畴，我们将在下一讲讲解；本讲我们针对第二种情况，给大家讲解如何使用 Nuxt3 提供的 API Route
自己编写接口，主要包括以下知识点：

  * 创建服务端 API；
  * 处理请求参数；
  * 返回响应数据。

## 创建服务端 API

Nuxt 项目下`~/server/api`目录下的文件会被注册为服务端
API，并约定在这些文件中导出一个默认函数`defineEventHandler(handler)`，handler 中可以直接返回 JSON 数据或
Promise，当然也可以使用 `event.node.res.end()` 发送响应，虽然这没有必要。

下面我们创建一个 server/api/hello.ts 测试一下：这里我们返回给用户一个 json 数据。

    
    
    export default defineEventHandler((event) => {
      return {
        message: 'hello，nuxt3！'
      }
    })
    

这个接口可以使用`$fetch('/api/hello')`请求，创建一个 hello.vue：

    
    
    <template>
      <div>
        {{ message }}
      </div>
    </template>
    
    <script setup lang="ts">
    const { message } = await $fetch('/api/hello')
    </script>
    

测试效果如下：

![](img\8\1.image)

## 范例：获取博客列表

下面我们实践一下，实现一个博客需求：

  * 创建一个 /api/posts 接口，获取指定目录下 markdown 文章列表数据。

创建 content 目录，创建若干 markdown 文件作为文章：

    
    
    |-content
    ---test1.md
    ---test2.md
    ---test3.md
    

创建 server/api/posts.ts，获取 content 中文件列表并返回。

    
    
    import fs from "fs";
    import path from "path";
    import matter from 'gray-matter';
    
    // 文章目录
    const postsDir = path.join(process.cwd(), "content");
    
    export default defineEventHandler((event) => {
      const fileNames = fs.readdirSync(postsDir);
      const posts = fileNames.map((fileName) => {
        // 获取文件名作为文章标题
        const id = fileName.replace(/.md$/, "");
    
        // 获取文章标题和创建日期
        const fullPath = path.join(postsDir, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterInfo = matter(fileContents);
        const fileInfo = fs.statSync(fullPath);
    
        return {
          id,
          title: matterInfo.data.title,
          date: fileInfo.ctime,
        };
      });
      // 降序排列
      return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
    });
    

> 需要安装 `gray-matter`。

请求文章列表数据，index.vue：

    
    
    <template>
      <div class="flex items-center flex-col gap-2 py-4">
        <!-- <h1>Index Page</h1>
        <div>
          <NButton>hello</NButton>
        </div>
        <NuxtLink to="/detail/1">detail 1</NuxtLink> -->
        <div v-for="post in posts" :key="post.id">
          <NuxtLink class="text-lg" :to="`/detail/${post.id}`">{{
            post.title
          }}</NuxtLink>
          <p class="text-slate-500">发布于: {{ post.date }}</p>
        </div>
      </div>
    </template>
    
    <script setup lang="ts">
    const posts = await $fetch("/api/posts");
    </script>
    

效果如下：

![](img\8\2.image)

## 处理请求参数

常用的请求参数形式有三种：

  * 路由参数，例如：/api/hello/[name].ts；

  * 请求体，例如：post 请求中的 data；

  * 查询参数，例如：/api/hello?name=cunzhang。

### 获取路由参数

假如创建 API 接口文件 server/api/detail/[id].ts，可以通过 `getRouterParam(event, 'id')`
获取参数 id：

    
    
    import fs from "fs";
    import path from "path";
    import matter from "gray-matter";
    import { remark } from "remark";
    import html from "remark-html";
    
    // 文章目录
    const postsDir = path.join(process.cwd(), "content");
    
    export default defineEventHandler(async (event) => {
      const fileName = getRouterParam(event, 'id') + ".md";
    
      // 获取文章内容
      const fullPath = path.join(postsDir, fileName);
      const fileContent = fs.readFileSync(fullPath, "utf-8");
    
      // 解析扉页信息
      const matterInfo = matter(fileContent);
    
      // 转换markdown为HTML
      const processedContent = await remark().use(html).process(matterInfo.content);
      const content = processedContent.toString();
    
      return {
        title: matterInfo.data.title,
        content,
      };
    });
    

> 需要安装`remark`和`remark-html`。

接下来，当我们跳转到 detail 页面时，就可以获取这篇文章内容并显示，detail.vue：

    
    
    <template>
      <div class="p-5">
        <h1 class="text-2xl">{{ title }}</h1>
        <div v-html="content"></div>
      </div>
    </template>
    
    <script setup lang="ts">
    const router = useRoute();
    const { title, content } = await $fetch(`/api/detail/${router.params.id}`);
    </script>
    

效果如下：

![](img\8\3.image)

### 获取请求体

用户发送 post 类型的请求提交数据的时候，请求数据通常通过 request body，类似这样：

    
    
    $fetch('/api/create-post', { method: 'post', body: { id: 'new id' } })
    

在 Nuxt 中，服务端可以通过`readBody(event)`获取 request body 数据：

    
    
    export default defineEventHandler(async (event) => {
        const body = await readBody(event)
        return { body }
    })
    

### 获取查询参数

用户发送类似 `/api/query?param1=a&param2=b `这样的包含查询参数的请求时，可以通过`getQuery(event)`获取参数：

    
    
    export default defineEventHandler((event) => {
      const query = getQuery(event)
      return { a: query.param1, b: query.param2 }
    })
    

## 更多工具方法

Nitro 的底层实现基于 [h3](http://github.com/unjs/h3)，除了前面介绍的
getRouterParam()、readBody()、getQuery()
等还有不少非常有用[工具方法](https://www.jsdocs.io/package/h3#package-index-
functions)，例如：getCookie()、 getMethod()、getHeader()
等，大家可以先看文档探索一下，后续范例和项目中都会陆续用到。

## 总结

本讲我们初步演示了 API Route 编写接口，调用接口的方法。应该说还有一些知识点未涉及，比如：

  * 请求头的处理；
  * cookie、session、token 等的使用；
  * 数据持久化；
  * 路由中间件；
  * ……

这些内容我们会分散在后续的数据请求、Nuxt 进阶、项目实战等章节给大家讲解。

## 下次预告

下一步，我们学习 Nuxt 提供的数据获取模块的最佳实践，它们会极大简化 SSR 场景下的数据交互复杂度！

