大家好，我是村长！

本节我们实现项目登录、注册，我们需要完成以下任务：

  * 鉴权相关接口设计与实现；

  * 前端页面逻辑。

## 接口设计

我们需要三个接口：

  * login：登录接口，接收用户名和密码，返回登录结果；
  * register：注册接口，接收用户名和密码，返回注册结果；
  * userinfo：获取用户信息接口，接收 token，返回用户信息。

下面是 Apifox 中的 login 接口设计：

![](img\26\1.image)

![](img\26\2.image)

![](img\26\3.image)

register 接口类似，不再赘述。

## 接口实现

下面我们实现三个接口。

#### 注册接口

server/api/register.post.ts

    
    
    import bcrypt from 'bcryptjs'
    import jwt from 'jsonwebtoken'
    import type { User } from '@prisma/client'
    import { createUser, getUserByUsername } from '../database/repositories/userRepository'
    
    export default defineEventHandler(async (e) => {
      try {
        const data = await readBody<User>(e)
        const { username, password } = data
        // 校验...
    
        // 获取用户，存在同名用户
        const user = await getUserByUsername(username)
    
        if (user) {
          return sendError(e, createError({
            statusCode: 400,
            statusMessage: '用户名已存在!',
          }))
        }
    
        // 加密
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        data.password = hash
    
        // 入库
        const result = await createUser(data)
    
        // 生成token，写入cookie
        const secret = process.env.JSON_SECRET
        const token = jwt.sign({ username: result.username }, secret, { expiresIn: '24h' })
        setCookie(e, 'token', token, { maxAge: 24 * 3600 })
    
        return { ok: true, data: result }
      }
      catch (error) {
        console.error(error)
        return sendError(e, createError('注册失败!'))
      }
    })
    

这里用到了数据库操作，我们修改一下之前的代码，server/database/reposirory/userRepository.ts:

    
    
    import type { User } from '@prisma/client'
    import prisma from '~/server/database/client'
    
    export async function getUserByUsername(username: string): Promise<User | null> {
      const result = await prisma.user.findUnique({
        where: {
          username,
        },
      })
      return result
    }
    
    export async function createUser(data: User) {
      const user = await prisma.user.create({ data })
      return user
    }
    

#### 登录接口

server/api/login.ts

    
    
    import bcrypt from 'bcryptjs'
    import jwt from 'jsonwebtoken'
    import type { User } from '@prisma/client'
    import { getUserByUsername } from '../database/repositories/userRepository'
    
    export default defineEventHandler(async (e) => {
      const { username, password } = await readBody<User>(e)
    
      // 校验...
    
      try {
        // 获取用户
        const user = await getUserByUsername(username)
    
        if (!user) {
          return sendError(e, createError({
            statusCode: 401,
            statusMessage: '用户错误!',
          }))
        }
    
        // 校验密码
        const result = await bcrypt.compare(password, user.password)
    
        if (!result) {
          return sendError(e, createError({
            statusCode: 401,
            statusMessage: '密码错误!',
          }))
        }
    
        // 写入cookie
        const secret = process.env.JSON_SECRET
        const token = jwt.sign({ username: user.username }, secret, { expiresIn: '24h' })
        setCookie(e, 'token', token, { maxAge: 24 * 3600 })
    
        return { ok: true, data: user }
      }
      catch (error) {
        console.error(error)
        return sendError(e, createError('登录失败!'))
      }
    })
    

#### 获取用户信息

用户如果已经登录过，在固定时间内应当不需要登录。我们可以在页面中发送 token 到服务端，然后获取用户信息并返回。

/server/api/userinfo.get.ts

    
    
    import jwt from 'jsonwebtoken'
    import { getUserByUsername } from '../database/repositories/userRepository'
    
    export default defineEventHandler(async (e) => {
      // 获取令牌
      const token = getCookie(e, 'token')
    
      // 令牌不存在
      if (!token)
        return { ok: false }
    
      let info
      try {
        // 解析token
        info = jwt.verify(token, process.env.JSON_SECRET!)
        const currentTime = Date.now() / 1000
    
        if (info.exp < currentTime) {
          return sendError(e, createError({
            statusCode: 401,
            statusMessage: 'token过期!',
          }))
        }
      }
      catch (error) {
        return sendError(e, createError({
          statusCode: 401,
          statusMessage: 'token不合法!',
        }))
      }
    
      try {
        const user = await getUserByUsername(info.username)
    
        // 用户不存在
        if (!user) {
          return sendError(e, createError({
            statusCode: 401,
            statusMessage: '用户不存在!',
          }))
        }
        return { ok: true, data: user }
      }
      catch (error) {
        console.error(error)
        return sendError(e, createError('获取用户信息失败!'))
      }
    })
    

## 请求封装

接下来要实现前端登录逻辑，需要请求数据，我们把请求封装一下便于使用。

composabes/request.ts

    
    
    import { merge } from 'lodash'
    
    type FetchType = typeof $fetch
    type ReqType = Parameters<FetchType>[0]
    type FetchOptions = Parameters<FetchType>[1]
    
    export function httpRequest<T = unknown>(
      method: any,
      url: ReqType,
      body?: any,
      opts?: FetchOptions,
    ) {
      const token = useCookie('token')
      const router = useRouter()
      const route = useRoute()
    
      const defaultOpts = {
        method,
        // baseURL: '/api',
        headers: { token: token.value } as any,
        body,
        onRequestError() {
          message.error('请求出错，请重试！')
        },
        onResponseError({ response }) {
          console.log(response)
    
          switch (response.status) {
            case 400:
              message.error('参数错误')
              break
            case 401:
              message.error('没有访问权限')
              router.push(`/login?callback=${route.path}`)
              break
            case 403:
              message.error('服务器拒绝访问')
              break
            case 404:
              message.error('请求地址错误')
              break
            case 500:
              message.error('服务器故障')
              break
            default:
              message.error('网络连接故障')
              break
          }
        },
      } as FetchOptions
    
      return $fetch<T>(url, merge(defaultOpts, opts))
    }
    
    export function httpPost<T = unknown>(
      request: ReqType,
      body?: any,
      opts?: FetchOptions,
    ) {
      return httpRequest<T>('post', request, body, opts)
    }
    
    export function httpGet<T = unknown>(
      request: ReqType,
      opts?: FetchOptions,
    ) {
      return httpRequest<T>('get', request, null, opts)
    }
    

## 前端登录注册

#### 登录页面逻辑实现

登录页面需要完成:

  * 数据收集；

  * 数据校验；

  * 请求登录和结果处理。

login.vue

    
    
    <script setup lang="ts">
    import type { FormInst, FormRules } from 'naive-ui'
    
    useHead({
      title: '登录',
    })
    
    // 定义页面布局
    definePageMeta({
      layout: 'blank',
    })
    
    const formRef = ref<FormInst>()
    const model = ref({
      username: '',
      password: '',
    })
    
    const rules: FormRules = {
      username: [{
        required: true,
        message: '请输入用户名',
        trigger: 'blur',
      }],
      password: [{
        required: true,
        message: '请输入密码',
        trigger: 'blur',
      }],
    }
    
    const store = useUser()
    const login = () => {
      // 校验
      formRef.value!.validate(async (errors) => {
        if (!errors) {
          const { ok, data } = await httpPost('/api/login', {
            username: model.value.username,
            password: model.value.password,
          })
          if (ok) {
            // 保存user状态
            store.userInfo = data
            // 跳转首页
            navigateTo('/')
          }
        }
      })
    }
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
    
      <NForm ref="formRef" :model="model" :rules="rules" class="w-[340px]" size="large">
        <NFormItem :show-label="false" path="username">
          <NInput v-model:value="model.username" clearable placeholder="用户名" />
        </NFormItem>
        <NFormItem :show-label="false" path="password">
          <NInput v-model:value="model.password" clearable placeholder="密码" type="password" />
        </NFormItem>
    
        <div>
          <NButton class="w-full" type="primary" @click="login">
            登录
          </NButton>
        </div>
      </NForm>
    </template>
    

这里用到了全局状态，新增一个 store/user.ts

    
    
    export const useUser = defineStore('user', {
      state: () => ({
        userInfo: null,
      }),
    })
    

#### 注册页面逻辑实现

注册页面类似登录页面，但是多了一个确认密码一致性的验证。

    
    
    const model = ref({
      confirmPass: '', // +++
    })
    
    const rules: FormRules = {
      // +++
      confirmPass: [{
        required: true,
        message: '请再次输入密码',
      }, {
        validator: (rule, value, callback) => {
          if (value !== model.value.password) {
            callback(new Error('两次输入的密码不一致'))
            return false
          }
          else {
            callback()
            return true
          }
        },
        trigger: ['blur', 'input'],
      }],
    }
    

## 显示用户信息和注销登录

导航栏中需要显示用户信息，并提供注销登录功能。

![](img\26\4.image)

#### 显示用户信息

根据全局存储的 user 状态决定显示登录按钮还是用户信息，components/MyHeader.vue：

    
    
    <script setup>
    const store = useUser()
    const { userInfo } = storeToRefs(store)
    
    const options = [{
      label: '用户中心',
      key: 'center',
    }, {
      label: '退出',
      key: 'logout',
    }]
    
    const dialog = useDialog()
    const handleSelect = (k) => {
      switch (k) {
        case 'logout':
          dialog.warning({
            content: '确定退出登录吗？',
            positiveText: '退出',
            negativeText: '取消',
            onPositiveClick: () => logout(),
          })
          break
        case 'center':
          navigateTo('/usercenter')
          break
      }
    }
    </script>
    
    <template>
      <div class="bg-white fixed top-0 left-0 right-0 shadow-sm z-1000">
        <div class="container m-auto flex items-center h-[60px] px-4">
          <!-- ... -->
    
          <NuxtLink v-if="!userInfo" to="/login">
            <NButton secondary strong>
              登录
            </NButton>
          </NuxtLink>
    
          <NDropdown
            v-else :options="options" @select="handleSelect"
          >
            <NAvatar
              round size="small"
              :src="userInfo.avatar ? userInfo.avatar : '/avatar.png'"
            />
          </NDropdown>
        </div>
      </div>
    </template>
    

这里用到对话框，注意添加一个 NDialogProvider，app.vue：

    
    
    <NDialogProvider>
      <NMessageProvider>
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </NMessageProvider>
    </NDialogProvider>
    

### 注销登录

点击“退出”可以注销登录状态。

composables/auth.ts

    
    
    export function logout() {
      // 清除状态
      const store = useUser()
      store.userInfo = null
    
      // 清cookie
      const token = useCookie('token')
      if (token.value)
        token.value = null
    
      message.success('退出登录成功')
    
      // 回到首页
      const route = useRoute()
      if (route.path !== '/')
        navigateTo('/')
    }
    

## 登录状态持久化

用户刷新页面，应该保存登录状态才对。这里可以利用之前存储的 token，在布局页上获取用户信息。

default.vue：

    
    
    <script setup lang="ts">
    onMounted(async () => {
      const store = useUser()
      // 获取用户信息
      const { ok, data } = await httpGet('/api/userinfo')
      if (ok)
        store.userInfo = data
    })
    </script>
    

## 下次预告

接下来我们计划完成首页的数据获取和显示！

