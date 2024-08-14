大家好，我是村长！截至目前为止，Nuxt 开发相关的内容告一段落。

本讲我们将探讨 Nuxt 项目的打包与部署，涉及内容如下：

  * 多种打包方式；

  * 部署为 Node.js 服务；

  * 部署为静态服务；

  * 云服务。

## 多种打包方式

与传统服务端渲染只能发布于 Node.js 服务不同，Nuxt 应用不仅可以发布在 Node.js 服务上，还能预渲染内容做为静态服务，Nuxt3
甚至可以发布在 serverless 或 cdn 等云服务环境。

打包 Nuxt 项目可以用`nuxt build`或`nuxt generate`，根据配置不同，可分为以下几种方式：

  * SSR：`nuxt build`。代码会被打包到`.output`目录，打包产物分为 public 和 server 两部分。入口为 index.mjs，可以使用 node 或 pm2 等进程管理工具启动服务，也可以配合`nuxt preview`启动预览服务。

  * SPA：`ssr:false` \+ `nuxt generate`。产物只有 .output/public 中的静态文件，发布 .output/public 即可。但是 SPA 需要在运行时访问接口获取数据，因此仍然需要提供接口服务才能正常显示页面。

  * SSG：`nuxt generate`。产物只有 .output/public 中的静态文件，发布 .output/public 即可。这种方式会在创建时生成页面内容，因此只需要提供静态服务即可预览。

  * 其他服务：`presets`，可用于其他非 node 运行时打包，例如 deno，serverless，edge worker 等。产物根据预设不同会有不同，部署需要按照对应的平台进行操作。

### 打包 SSR

默认情况下，直接执行`nuxt build`：

    
    
    yarn build
    

打包结果如下：server 内会有内容，index.mjs 为入口文件。

![](img\13\1.image)

### 打包 SSG

默认情况下直接执行 `nuxt generate`：

    
    
    yarn generate
    

下图为 generate 结果：server是空的，只有 public 中的静态内容。

![](img\13\2.image)

### 打包 SPA

配置 `ssr: false`，然后执行 `nuxt generate`：

    
    
    export default defineNuxtConfig({
      ssr: false,
    })
    
    
    
    yarn generate
    

下图为 generate 结果：server是空的，跟 SSG 略有不同，动态的 detail 没有了，会作为前端动态路由出现。

![](img\13\3.image)

### 使用 presets

配置 `nitro.preset`选项即可。

![](img\13\4.image)

例如，我们准备发布到 vercel，可以设置 `nitro.preset` 为 `vercel` 或 `vercel edge`。

## 部署为 Node.js 服务

针对前面介绍的 SSR 方式打包，访问页面需要服务器实时渲染，因此需要启动 node server。

### 启动 node.js 服务

执行如下命令启动服务：

    
    
    node .output/server/index.mjs
    

服务启动效果如下：

![](img\13\5.image)

访问
[http://localhost:3000/，效果如初：](http://localhost:3000/%EF%BC%8C%E6%95%88%E6%9E%9C%E5%A6%82%E5%88%9D%EF%BC%9A)

![](img\13\6.image)

这意味着我们只需要将 `.output` 中的内容上传至服务器并启动 node 服务即可。

### 运行时配置

服务器上可能有多个应用，因此需要配置端口号等。传递环境变量可以修改端口号等的默认配置，例如：

  * PORT：端口号；

  * HOST：服务地址；

  * NITRO_SSL_CERT 和 NITRO_SSL_KEY：启用 HTTPS。

下面我们修改端口号为 8080：

    
    
    PORT=8080 node .output/server/index.mjs
    

效果如下：

![](img\13\7.image)

### 进程管理

服务器一般会有 pm2 之类的工具便于管理多个服务进程，可以配置 ecosystem.config.js：

    
    
    module.exports = {
      apps: [
        {
          name: 'czblog',
          port: '8080',
          exec_mode: 'cluster',
          instances: 'max',
          script: './.output/server/index.mjs'
        }
      ]
    }
    

启动服务：

    
    
    pm2 start ecosystem.config.js
    

> 安装 pm2：`npm i pm2 -g`。

启动效果如下:

![](img\13\8.image)

访问
[http://localhost:8080，效果是一致的。](http://localhost:8080%EF%BC%8C%E6%95%88%E6%9E%9C%E6%98%AF%E4%B8%80%E8%87%B4%E7%9A%84%E3%80%82)

## 部署静态服务

如果生成的是 SPA 或 SSG，则仅需上传 public 中的内容到服务器，并启动一个静态服务即可，例如 nginx。

作为演示，我们这里使用 serve：

    
    
    cd .output/public
    # 需要先安装 serve 包
    serve
    

![](img\13\9.image)

访问
[http://localhost:3000，效果如下：](http://localhost:3000%EF%BC%8C%E6%95%88%E6%9E%9C%E5%A6%82%E4%B8%8B%EF%BC%9A)

![](img\13\10.image)

## 部署到云服务

Nuxt 应用可以部署在 serverless 或 edge 环境，但是打包时需要 Nuxt 有对应的 present 支持，目前官方提供了 13
个云服务提供商的 presents：

  1. Azure；
  2. Vercel；
  3. Netlify；
  4. StormKit；
  5. Cloudflare；
  6. AWS Lamda；
  7. Firebase；
  8. Cleavr；
  9. DigitalOcean；
  10. Edgio；
  11. Heroku；
  12. Layer0；
  13. Render.com。

列表中前五个是支持零配置的，比较推荐。很遗憾暂时没有国内的提供商，如果想要发布需要更多的配置。

### 部署到 Vercel

Vercel 是 next.js 东家，大名鼎鼎，对 Nuxt 应用发布支持也是最好的。

这里就以 Vercel 为例给大家演示 Nuxt 应用发布过程：

  1. 修改预设为 `vercel`，nuxt.config.ts：

    
    
    export default defineNuxtConfig({
      nitro: {
        preset: 'vercel'
      }
    })
    

  2. 发布项目代码到 github / gitlab：

![](img\13\11.image)

  3. 前往 [vercel](https://vercel.com/new) 导入项目：

![](img\13\12.image)

  4. 发布项目：配置会自动导入，点击 Deploy 发布。

![](img\13\13.image)

  5. 部署成功：

![](img\13\14.image)

  6. 预览项目：虽然部署成功，但是数据获取失败了，这是因为我们的代码需要访问文件系统，这是 Serverless Function 不支持的。

![](img\13\15.image)

因此，我们可以修改“创建命令”为`nuxt generate`，使我们应用成为全静态网站：

![](img\13\16.image)

修改完成再次执行发布任务，你可以：

  * 修改代码并 push 到 github 触发；
  * 在 Vercel 控制台 Deployments 发布记录中点击右侧三个点 - Redeploy。

![](img\13\17.image)

等待发布结束，观察是否已经变为静态输出，大家看下图中已经没有 Serverless Functions 了。

![](img\13\18.image)

再看效果如下图：

![](img\13\19.image)

似乎正常了，其实不然！点击下一页，发现又出状况了：

![](img\13\20.image)

这是由于 SSG 采用爬虫方式抓取要生成的内容，页面中如果没有链接则无从获取，比如上面的“上一页”、“下一页”按钮，执行的是 JS
代码获取，因此这些页面既不会生成，点击也不能正常显示。这要求我们实现时必须明确地在页面中出现链接，我们可以尝试做如下修改方案：

  * 分页采用明确的页码链接列表；
  * 把文章分成各种分类，增加一个页面显示分类文章列表；
  * ……

大家可以尝试一下~

## 总结

总算告一段落了，可以看到比起 SPA
的部署，其他渲染模式部署真是复杂多了！但是这会让我们被迫学习更多服务端知识，思考服务器运行方式，还能实践很多部署运维操作，可谓收获多多！如果你一时记不住这些知识，可以在打包前想一下自己的需要，问自己几个问题：

  * 我这个网站纯静态行不行？可以了当然好，这是性能最优，部署最简单的方式。

  * 如果不能纯静态，是否看重 SEO，可以打包为 SPA 吗？可以了也不错，性能很好，部署简单。

  * 如果都不行，那就服务端渲染，此时还可以问自己将来准备部署到哪？如果自己有 ECS 之类的服务器，可以随便折腾，需要什么运行环境都可以安装，或者索性用 docker 做个镜像。

  * 如果要部署为云函数那就麻烦了，目前 Nuxt 就提供了国外十几个供应商的 preset，国内的没有整合，可能不太能接受国外的，自己折腾又是个黑盒子，preset 开发暂时也没有文档。这种方式如果要考虑，就要选在国内有分店的，比如我知道 azure 就有。

## 下次预告

关于发布就给大家讲到这里，一些发布的细节还未涉及，我们将在后续项目中详细演示。

