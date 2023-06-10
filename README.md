## SCOTT 的文档站

### 1. 介绍

SCOTT 的文档站是一个基于 VuePress 的文档站，主要用于记录 SCOTT 的一些技术文档。

### 2. 使用

#### 2.1 安装

```bash
# 安装依赖
yarn install
# 或者
npm install
```

#### 2.2 运行

```bash
# 运行
yarn docs:dev
# 或者
npm run docs:dev
```

#### 2.3 打包

```bash
# 打包
yarn docs:build
# 或者
npm run docs:build
```

### 3. 部署

#### 3.1 配置

在 `docs/.vuepress/config.js` 中配置 `base` 为你的仓库名，例如我的仓库名为 `docs`，则配置如下：

```js
module.exports = {
  base: '/docs/'
}
```

#### 3.2 部署

```bash
# 打包
yarn docs:build
# 或者
npm run docs:build
```

将打包后的 `docs/.vuepress/dist` 目录下的文件上传到你的仓库中，例如我的仓库名为 `docs`，则上传到 `docs` 目录下。

#### 3.3 配置 GitHub Pages

在你的仓库中，点击 `Settings`，然后点击 `Pages`，在 `Source` 中选择 `gh-pages branch`，点击 `Save`，然后就可以通过 `https://你的用户名.github.io/你的仓库名/` 来访问你的文档站了。

### 4. 配置

#### 4.1 配置主题

在 `docs/.vuepress/config.js` 中配置 `theme` 为你想要的主题，例如我想要使用 `vuepress-theme-reco` 主题，则配置如下：

```js
module.exports = {
  theme: 'reco'
}
```

#### 4.2 配置导航栏

在 `docs/.vuepress/config.js` 中配置 `themeConfig.nav` 为你想要的导航栏，例如我想要配置导航栏为 `导航一` 和 `导航二`，则配置如下：

```js
module.exports = {
  themeConfig: {
    nav: [
      { text: '导航一', link: '/guide/' },
      { text: '导航二', link: '/config/' }
    ]
  }
}
```

#### 4.3 配置侧边栏

在 `docs/.vuepress/config.js` 中配置 `themeConfig.sidebar` 为你想要的侧边栏，例如我想要配置侧边栏为 `侧边栏一` 和 `侧边栏二`，则配置如下：

```js
module.exports = {
  themeConfig: {
    sidebar: [
      {
        title: '侧边栏一',
        collapsable: false,
        children: [
          '/guide/',
          '/config/'
        ]
      },
      {
        title: '侧边栏二',
        collapsable: false,
        children: [
          '/guide/',
          '/config/'
        ]
      }
    ]
  }
}
```

#### 4.4 配置侧边栏深度

在 `docs/.vuepress/config.js` 中配置 `themeConfig.sidebarDepth` 为你想要的侧边栏深度，例如我想要配置侧边栏深度为 `1`，则配置如下：

```js
module.exports = {
  themeConfig: {
    sidebarDepth: 1
  }
}
```

#### 4.5 配置最后更新时间

在 `docs/.vuepress/config.js` 中配置 `themeConfig.lastUpdated` 为 `true`，则会在每个页面的最后更新时间后面显示 `最后更新时间`，例如我想要配置最后更新时间为 `true`，则配置如下：

```js
module.exports = {
  themeConfig: {
    lastUpdated: true
  }
}
```

#### 4.6 配置 Git 仓库

在 `docs/.vuepress/config.js` 中配置 `themeConfig.repo` 为你的 Git 仓库地址，例如我想要配置 Git 仓库地址为 `

```js
module.exports = {
  themeConfig: {
    repo: ''
  }
}
```

#### 4.7 配置 Git 仓库链接

在 `docs/.vuepress/config.js` 中配置 `themeConfig.repoLabel` 为你的 Git 仓库链接，例如我想要配置 Git 仓库链接为 `

```js
module.exports = {
  themeConfig: {
    repoLabel: ''
  }
}
```

#### 4.8 配置编辑链接

在 `docs/.vuepress/config.js` 中配置 `themeConfig.editLinks` 为 `true`，则会在每个页面的最后更新时间后面显示 `编辑链接`，例如我想要配置编辑链接为 `true`，则配置如下：

```js
module.exports = {
  themeConfig: {
    editLinks: true
  }
}
```

#### 4.9 配置编辑链接文本

在 `docs/.vuepress/config.js` 中配置 `themeConfig.editLinkText` 为你想要的编辑链接文本，例如我想要配置编辑链接文本为 `编辑链接`，则配置如下：

```js
module.exports = {
  themeConfig: {
    editLinkText: '编辑链接'
  }
}
```

#### 4.10 配置作者

在 `docs/.vuepress/config.js` 中配置 `themeConfig.author` 为你的作者名，例如我想要配置作者名为 `SCOTT`，则配置如下：

```js
module.exports = {
  themeConfig: {
    author: 'SCOTT'
  }
}
```

#### 4.11 配置作者头像

在 `docs/.vuepress/config.js` 中配置 `themeConfig.authorAvatar` 为你的作者头像地址，例如我想要配置作者头像地址为 `https://avatars.githubusercontent.com/u/32385320?v=4`，则配置如下：

```js
module.exports = {
  themeConfig: {
    authorAvatar: 'https://avatars.githubusercontent.com/u/32385320?v=4'
  }
}
```

#### 4.12 配置项目开始时间

在 `docs/.vuepress/config.js` 中配置 `themeConfig.startYear` 为你的项目开始时间，例如我想要配置项目开始时间为 `2021`，则配置如下：

```js
module.exports = {
  themeConfig: {
    startYear: '2021'
  }
}
```

