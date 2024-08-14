大家好，我是村长！上一节我们学习了基于 Nuxt3 中数据访问的各种姿势，本节我们探究项目开发中另一个重要需求：全局状态管理。

本来这是一个比较简单的事情，但是只要涉及服务端渲染，问题就会复杂化，状态的初始化在服务端进行，想要带着状态信息到客户端，就要提前序列化存储，到了客户端激活时，又要确保在被调用前恢复。这些操作如果没有框架支持会相当复杂。还好
Nuxt 替我们处理了这些，隐藏了很多处理细节，我们不需要关心序列化或 XSS 攻击，只是使用就好了。本节涉及内容如下：

  * Nuxt 内置的状态管理模块 `useState()`；

  * 整合全局状态管理库：Pinia。

## Nuxt3 内置的状态管理

Nuxt3 提供了 `useState()`，用于创建响应式的且服务端友好的跨组件状态。

> useState() 对于 React 用户来说在熟悉不过了，两者确实有类似之处，但是除了给组件声明状态之外，Nuxt3 中的 useState()
> 还能用于创建全局状态。

### useState 方法签名

可以看到 `useState()`有两个重载，一个接收提供初始值的工厂函数，另一个多了唯一的 key 用于缓存数据，而返回值是一个 Ref 类型。

    
    
    useState<T>(init?: () => T | Ref<T>): Ref<T>
    useState<T>(key: string, init?: () => T | Ref<T>): Ref<T>
    

### useState 基本用法

我们在组件中用 useState() 声明一个状态，counter.vue。

    
    
    <template>
      <div class="p-4">
        Counter: {{ counter }} 
        <div class="mt-2">
          <NButton
            @click="
              counter++;
            "
            >+</NButton
          >
          <NButton
            @click="
              counter--;
            "
            >-</NButton
          >
        </div>
      </div>
    </template>
    
    <script setup lang="ts">
    const counter = useState("counter", () => Math.round(Math.random() * 1000));
    </script>
    

### useState() 和 ref() 的选择

看起来和 `ref()` 并没有什么两样，但是实际上是有差别的：

  * useState(key, init) 是有缓存性的，如果 key 不变，init 只做初始化，则多次调用同一个 useState，结果是一样的；

  * 服务端友好性，得益于缓存性，即便 init 返回值是不稳定的，也能保证前端注水时前后端状态的一致性。

下面范例演示了这一点。添加一个类似的 counter，但是用 `ref()` 声明，counter.vue。

    
    
    <template>
      <div class="p-4">
        Counter: {{ counter }} CounterRef: {{ counterRef }}
        <div class="mt-2">
          <NButton
            @click="
              counter++;
              counterRef++;
            "
            >+</NButton
          >
          <NButton
            @click="
              counter--;
              counterRef--;
            "
            >-</NButton
          >
        </div>
      </div>
    </template>
    
    <script setup lang="ts">
    const counterRef = ref(Math.round(Math.random() * 1000));
    const counter = useState("counter", () => Math.round(Math.random() * 1000));
    </script>
    

效果如下：

![](img\10\1.image)

但是控制台出现了警告信息：注水时发现 CounterRef 不匹配，这是因为初始值不确定的情况下，ref() 无法保证服务端和客户端的状态一致性。但是
useState() 可以保证一致性，这是其服务端友好性的一个表现。

![](img\10\2.image)

### 共享状态

我们可以使用 useState() 创建可在组件之间共享的全局状态。

可以在 composables 目录中创建一个
composable，并在里面导出一个函数，该函数由`useState()`返回全局状态，例如，composables/counter.ts：

    
    
    export const useCounter = () => useState('count', () => 1)
    

现在，在所有组件内都可以获取该状态。

创建一个 components/Counter.vue:

    
    
    <template>
      <div class="py-4">
        Count: {{ count }} Count2: {{ count2 }}
        <div class="mt-2">
          <NButton
            @click="
              count++;
              count2++;
            "
            >+</NButton
          >
          <NButton
            @click="
              count--;
              count2--;
            "
            >-</NButton
          >
        </div>
      </div>
    </template>
    
    <script setup lang="ts">
    // 全局状态
    const count = useCounter();
    // 局部状态
    const count2 = ref(1);
    </script>
    

在 page/counter.vue 里引入 Counter：

    
    
    <template>
      <div class="p-4">
        Count: {{ count }} Counter: {{ counter }} CounterRef: {{ counterRef }}
        <div class="mt-2">
          <NButton
            @click="
              counter++;
              counterRef++;
            "
            >+</NButton
          >
          <NButton
            @click="
              counter--;
              counterRef--;
            "
            >-</NButton
          >
        </div>
    
        <Counter></Counter>
        <Counter></Counter>
      </div>
    </template>
    
    <script setup lang="ts">
    // 局部状态
    const counterRef = ref(Math.round(Math.random() * 1000));
    const counter = useState("counter", () => Math.round(Math.random() * 1000));
    // 全局状态
    const count = useCounter();
    </script>
    

效果如下：可以观察 count 同步变化情况。

![](img\10\3.image)

### 范例：判断登录态

我们给范例博客增加一个留言功能：要求留言者已登录，否则跳转登录页。

首先创建这个全局登录状态，创建 composables/user.ts：

    
    
    export const useLogin = () => useState(() => false)
    

给详情页添加一个留言框，并在提交留言时判断登录态，[id].vue：

    
    
    <template>
      <div class="p-5">
        <div v-if="pending">加载中...</div>
        <div v-else>
          <h1 class="text-2xl">{{ data?.title }}</h1>
          <div v-html="data?.content"></div>
          <!-- 评论区 -->
          <div class="py-2">
            <NInput
              v-model:value="value"
              type="textarea"
              placeholder="输入评论"
            />
            <NButton @click="onSubmit">发送</NButton>
          </div>
        </div>
      </div>
    </template>
    <script setup lang="ts">
    // 省略部分代码...
    // 增加评论相关逻辑，注意登录状态的获取和使用
    const value = useState("comment", () => "");
    const isLogin = useLogin()
    const router = useRouter()
    const onSubmit = () => {
      if (isLogin.value) {
        // 提交留言...
        value.value = ''
      } else {
        // 要求登录
        router.push('/login?callback=' + route.path)
      }
    }
    </script>
    

创建登录页，登录成功设置登录态，login.vue：

    
    
    <template>
      <div>
        <NButton @click="onLogin">登录</NButton>
      </div>
    </template>
    
    <script setup lang="ts">
    const isLogin = useLogin()
    const router = useRouter()
    const route = useRoute()
    const onLogin = () => {
      isLogin.value = true
      const callback= route.query.callback?.toString() || ''
      router.push(callback)
    }
    </script>
    

效果如下：

![](img\10\4.image)

## 整合 Pinia

当然，我们还有更好全局状态管理方案的选择，那就是 Pinia。

我们可以使用 `@pinia/nuxt` 模块简化整合难度，首先安装依赖：

    
    
    yarn add @pinia/nuxt
    

添加配置文件，nuxt.config.ts：

    
    
    export default defineNuxtConfig({
      modules: [
        // 引入 Pinia
        [
          "@pinia/nuxt",
          {
            autoImports: [
              // 自动引入 `defineStore(), storeToRefs()`
              "defineStore",
              "storeToRefs"
            ],
          },
        ]
      ],
    });
    

下面我们重构博客案例，使用 Pinia 实现登录态需求，需要修改如下文件：

  * 创建 store/counter.ts、store/user.ts：定义全局状态；

  * 修改 [id].vue：获取登录状态；

  * 修改 login.vue：登录成功设置登录状态；

  * 修改 counter.vue，Counter.vue：获取 count 状态。

创建 store/counter.ts、store/user.ts：使用 defineStore() 定义状态。

    
    
    export const useCounter = defineStore("count", {
      state: () => ({
        value: 1
      })
    });
    
    
    
    export const useUser = defineStore("user", {
      state: () => ({
        isLogin: false
      })
    });
    

修改 [id].vue，login.vue：获取登录状态。

    
    
    import { useUser } from '~/store/user';
    // 获取状态，转换为 Ref，其他代码无需改变
    const store = useUser();
    const { isLogin } = storeToRefs(store)
    

修改 counter.vue，Counter.vue：

    
    
    import { useCounter } from '~/store/counter';
    
    // 全局状态
    const store = useCounter();
    const { value: count } = storeToRefs(store);
    

## 总结

到这里，两种常见的状态管理方式都掌握了！到底选哪一种其实很容易，当我们业务很简单，只有非常简单的状态获取和设置，useState()就够用了。当我们业务逐渐复杂起来，数据状态对象本身越来越庞大，还有很多派生状态，以及复杂的更新状态业务，那就需要使用
Pinia 了。

## 下次预告

有了数据和状态，下一步是编写各种业务代码了！在这个过程中，不犯错误的可能性几乎为零，因此处理错误就是我们必须要考虑的问题了。因此，下节我们看看 Nuxt
项目如何处理异常。

