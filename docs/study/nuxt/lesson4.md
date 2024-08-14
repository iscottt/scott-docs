小伙伴们大家好，我是村长，很高兴又和大家见面了。

本篇我们将通过一个完整的个人博客案例来驱动学习 Nuxt 核心知识，尽量做到理论实践相结合，这样大家能够更牢固的掌握所学知识。

## 内容概要

本节作为起步，主要涉及环境准备和项目创建，让大家对 Nuxt 项目有个整体认知。具体内容如下：

  * 开发环境和工具准备；

  * 创建并完成第一个 Nuxt.js 应用；

  * 如何打包和预览项目；

  * 如何解决创建项目时可能出现的 443 错误。

## 环境准备

我们需要安装`node`作为`nuxt`的运行时，开发工具官方推荐使用`VS Code`，语法支持需要安装`Volar`插件。

  * node.js lts；

  * VS Code；

  * Volar。

## 安装使用

### 创建项目

打开命令行终端，输入下面命令创建一个`Nuxt3`项目：

    
    
    npx nuxi init nuxt3-app
    

> 踩坑指南：如果因为众所周知的原因出现 443 错误，请参考本文最后一部分的操作指南。

### 安装依赖

可以使用喜欢的包管理工具安装和管理依赖，`npm`/`yarn`/`pnpm`均可：

    
    
    yarn install
    

### 启动项目

使用 `yarn dev`以开发模式启动 nuxt:

    
    
    yarn dev
    

### 预览项目

✨浏览器会自动打开：[http://localhost:3000](http://localhost:3000/)

## 最小应用

在 `Nuxt`
中默认情况下有一个`app.vue`，如果我们只准备开发一个简单的单页应用或者就是一个落地页时，那么这样就够用了，此时`Nuxt`不会引入`vue-
router`作为依赖。

但是这种情况很少见，我们通常需要创建不少页面再配置路由，并且在它们之间来回跳转。在 Nuxt
中要创建一个路由页面非常简单，你只需要创建一个`pages`目录，并创建一个`index.vue`这样的视图组件就好了，`Nuxt`会自动引入`vue-
router`依赖，同时根据你创建的文件名称自动帮你配置一个路由。

下面我们来体验一下这个特性，我们创建`pages/index.vue`，并添加如下内容：

    
    
    <template>
      <div>Index Page</div>
    </template>
    

想要生效还要对 app.vue 稍作修改：

  * 移除欢迎页面`<NuxtWelcome />`；
  * 添加一个路由出口`<NuxtPage />`：

    
    
    <template>
      <div>
        <!-- 移除欢迎页面 -->
        <!-- <NuxtWelcome /> -->
    
        <!-- 路由出口 -->
        <NuxtPage></NuxtPage>
      </div>
    </template>
    

下面我们可以输入 <http://localhost:3000> 看一下效果：

![](img\4\1.image)

那如果我有另一个页面`detail.vue`想要跳转过去应该怎么做呢？

可以像下面这样，在`index.vue`中添加一个`NuxtLink`：

    
    
    <template>
      <!-- ... -->
      <!--跳转链接-->
      <NuxtLink to="/detail">Detail Page</NuxtLink>
    </template>
    

现在可以自由的跳转了！

![](img\4\2.image)

## 打包和预览

未来项目开发完毕，我需要打包并给用户提供预览服务。打开`package.json`，有如下 5 个命令：

  * build：打包创建项目；

  * dev：启动开发服务器；

  * generate：生成静态网站；

  * preview：启动预览服务；

  * postinstall：生成 .nuxt 目录。

### 项目打包

打开命令行终端，输入`build`命令打包项目：

    
    
    yarn build
    

> .output 目录即为打包结果。

### 预览服务

打包结果想要被用户浏览，需要启动预览服务，执行`preview`命令即可：

    
    
    yarn preview
    

>
> 可以输入终端提示的地址测试一下结果，例如我这里是：[http://localhost:3000。](http://localhost:3000%E3%80%82)
>
> 注意：这里是带有端口号的，未来可以在服务器配置`nginx`反向代理到该服务，用户就可以更方便地访问我们的站点。

## 项目创建错误踩坑指南

由于众所周知的原因，有些小伙伴可能在第一步创建项目的时候就遇到如下错误：

    
    
    ➜  nuxt-in-action npx nuxi init nuxt3-app                               
    Nuxi 3.0.0                                                                   
     ERROR  Failed to download template from registry: request to 
     https://raw.githubusercontent.com/nuxt/starter/templates/templates/v3.json failed, 
     reason: connect ECONNREFUSED 0.0.0.0:443
    

这是因为`nuxi`在创建项目时需要到`raw.githubusercontent.com`拉取项目模版，由于域名解析失败导致创建流程失败。解决方案也很简单，我们可以获取这个网址的`ip`地址，并在`/etc/hosts`中配置好，这样就能够顺利拉取项目模版，并成功创建项目。

我们访问
[ipaddress.com](http://ipaddress.com/website/raw.githubusercontent.com)，找到下面
IPv4 Addresses，例如：`185.199.108.133`

![](img\4\3.image)

然后添加该 ip 地址到 hosts，mac下 hosts 配置路径：`/etc/hosts`。

    
    
    sudo vi /etc/hosts
    

新增一行，`185.199.108.133 raw.githubusercontent.com`。

> vim操作步骤：
>
>   * 输入`i`进入 insert 模式，添加完成；
>   * 输入`esc`退出 insert 模式；
>   * 最后输入`:wq`保存并退出。
>

添加完 host 后，再次执行`npx nuxi init nuxt-app`，创建成功！

其他情况：

  * 如果你是 windows 电脑，可以自行搜索：windows 如何修改 hosts 文件；

  * 如果不想尝试或还是失败，可以直接克隆我们的范例项目即可。

## 总结

好了，本讲给大家展示了一个 Nuxt3 项目从创建到打包的完整流程。我自己在开发过程发现，创建项目时确实不那么稳定，即使按照本文的方案设置了
hosts，依然有创建失败的概率，大家可以克服一下，比如把这个项目提前存好，在开发的时候复制一份即可，不用每次都去 Github 拉取。

## 下次预告

这个基于文件的约定路由用起来可太方便了，但是还有不少常用需求，比如：

  * 嵌套路由怎么搞？
  * 动态路由怎么搞？

这些我们都会在下一讲中一一道来！

