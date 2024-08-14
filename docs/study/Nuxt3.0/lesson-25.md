大家好，我是村长！

本节我们实现项目基础布局，前面大家也看到了，我们的网站包括两个布局：

  * 基础布局：用于网站内容部分；
  * 登录布局：用于登录、注册部分。

## 基础布局

基础布局为上中下结构，包括：

  * MyHeader
  * Content
  * MyFooter

![](img\25\1.image)

### 创建基础布局

下面我们创建基础布局，layouts/default.vue

    
    
    <template>
      <div class="min-w-[1024px] bg-gray-100 flex flex-col min-h-screen">
        <MyHeader />
        <main class="container m-auto mt-20">
          <slot />
        </main>
        <MyFooter />
      </div>
    </template>
    

### MyHeader 组件

这里我们需要创建 components/MyHeader.vue 和 components/MyFooter.vue。

MyHeader 组件：包含 logo、导航栏、登录按钮或用户信息。

    
    
    <script setup>
    const route = useRoute()
    const menus = ref([
      { path: '/', label: '首页' },
      { path: '/column', label: '专栏' },
      { path: '/course', label: '课程' },
    ])
    </script>
    
    <template>
      <div class="bg-white fixed top-0 left-0 right-0 shadow-sm z-1000">
        <div class="container m-auto flex items-center h-[60px] px-4">
          <NButton text strong class="text-xl" @click="navigateTo('/')">
            羊村学堂
          </NButton>
    
          <div class="flex-1 flex items-center px-4">
            <Menu
              v-for="menu in menus"
              :key="menu.path"
              :active="route.path === menu.path"
              @click="navigateTo(menu.path)"
            >
              {{ menu.label }}
            </Menu>
          </div>
    
          <NuxtLink to="/login">
            <NButton secondary strong>
              登录
            </NButton>
          </NuxtLink>
        </div>
      </div>
    </template>
    

Menu.vue 组件：

    
    
    <script setup>
    defineProps({
      active: {
        type: Boolean,
        default: false,
      },
    })
    </script>
    
    <template>
      <div class="transition-all duration-[0.2s] px-2 py-1 mx-1 rounded cursor-pointer hover:(bg-blue-50 text-blue-700) active:(!bg-blue-100)" :class="{ 'menu-item-active': active }">
        <slot />
      </div>
    </template>
    
    <style>
    .menu-item-active {
      background-color: rgb(219, 254, 238);
      color: rgb(52, 157, 96);
    }
    </style>
    

### MyFooter组件

MyFooter组件：链接和版权信息。

    
    
    <template>
      <div class="mt-auto bg-dark-400 text-light-500">
        <div class="flex items-center justify-center pb-1 pt-2">
          <a href="https://github.com/57code/nuxt-app" class="p-3">项目代码</a>
          <a href="https://s.juejin.cn/ds/AC8SpfR/" class="p-3">视频课程</a>
        </div>
        <div class="mx-auto border-solid border-0 border-t border-gray-700 text-center py-4">
          Copyright© 2023 by YCXT
        </div>
      </div>
    </template>
    

## 登录/注册布局

下面完成登录布局，登录、注册页面仅需一个居中的容器即可：

![](img\25\2.image)

### 创建登录布局

下面创建登录布局组件，layouts/blank.vue：

    
    
    <template>
      <div class="min-h-screen flex justify-center items-center bg-gray-100">
        <div class="shadow-lg bg-white rounded-lg p-5">
          <slot />
        </div>
      </div>
    </template>
    

## 应用布局

### 添加布局组件

首先给 app.vue 添加布局组件：

    
    
    <template>
      <div>
        <NMessageProvider>
          <!-- 添加NuxtLayout -->
          <NuxtLayout>
            <NuxtPage />
          </NuxtLayout>
        </NMessageProvider>
      </div>
    </template>
    
    <style>
    a {
      color: white;
      text-decoration: none;
    }
    </style>
    

### 创建页面

下面创建相关页面测试一下：

  * course.vue；

  * column.vue；

  * login.vue；

  * register.vue。

course.vue 和 column.vue 使用默认布局，也暂时不需要内容。login.vue 和 register.vue 需要明确指定 blank
布局：

    
    
    definePageMeta({
      layout: 'blank',
    })
    

下面是 login.vue 和 register.vue 完整内容：

    
    
    <script setup lang="ts">
    useHead({
      title: '登录',
    })
    
    definePageMeta({
      layout: 'blank',
    })
    </script>
    
    <template>
      <h2 class="flex justify-between">
        返回羊村
        <nuxt-link to="/register">
          <NButton quaternary type="primary" size="tiny">
            还未入村？
          </NButton>
        </nuxt-link>
      </h2>
    
      <NAlert title="演示账号和密码为：test" type="info" class="mb-6" />
    
      <NForm ref="formRef" class="w-[340px]" size="large">
        <NFormItem :show-label="false" path="username">
          <NInput clearable placeholder="用户名" />
        </NFormItem>
        <NFormItem :show-label="false" path="password">
          <NInput clearable placeholder="密码" type="password" />
        </NFormItem>
    
        <div>
          <NButton class="w-full" type="primary">
            登录
          </NButton>
        </div>
      </NForm>
    </template>
    
    
    
    <script setup lang="ts">
    useHead({
      title: '注册',
    })
    
    definePageMeta({
      layout: 'blank',
    })
    </script>
    
    <template>
      <h2>加入羊群</h2>
      <NForm ref="formRef" class="w-[340px]" size="large">
        <NFormItem :show-label="false" path="username">
          <NInput clearable placeholder="用户名" />
        </NFormItem>
        <NFormItem :show-label="false" path="password">
          <NInput clearable placeholder="密码" type="password" />
        </NFormItem>
        <NFormItem :show-label="false" path="repassword">
          <NInput clearable placeholder="确认密码" type="password" />
        </NFormItem>
    
        <div>
          <NButton class="w-full" type="primary">
            登录
          </NButton>
        </div>
        <div class="flex justify-center items-center w-full text-xs mt-5 text-gray-600">
          注册即同意
          <NButton quaternary type="primary" size="tiny">
            《服务协议》
          </NButton>
          和
          <NButton quaternary type="primary" size="tiny">
            《隐私政策》
          </NButton>
        </div>
      </NForm>
    </template>
    

## 最终效果

主页和登录页在应用了布局之后的最终效果如下：

![](img\25\3.image)

![](img\25\4.image)

## 下次预告

布局结束，打好了基础，接下来完成项目登录注册部分的业务！

