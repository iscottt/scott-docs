大家好，我是村长！

本节我们完成用户中心的设计与实现，用户中心主要显示用户信息，我们计划完成以下功能：

  * 已购课程；
  * 修改资料；
  * 修改密码；
  * ……

## 页面设计

下面是用户中心页面的草图：

![](img\31\1.image)

## 接口实现

我们需要实现以下几个接口：

  * /purchased-course：已购课程

    * method: get
    * 返回 { ok: boolean, data: Course[] }
  * /userinfo：更新用户信息

    * method：post
    * Body: User
    * 返回 { ok: boolean }
  * /changePwd: 改密码

    * method：post

    * body: { oldPwd: string, newPwd: string }

    * 返回 { ok: boolean }

创建 server/api/purchased-course.ts

    
    
    import { isNuxtError } from 'nuxt/app'
    import { getCoursesByUser } from '../database/repositories/orderRepository'
    import { getTokenInfo } from '../database/service/token'
    export default defineEventHandler(async (e) => {
      try {
        const token = getTokenInfo(e)
    
        if (isNuxtError(token))
          return token
    
        const courses = await getCoursesByUser(token.id)
    
        return { ok: true, data: courses }
      }
      catch (error) {
        return sendError(e, createError('获取数据失败'))
      }
    })
    

server/database/repositories/orderRepository.ts

    
    
    export async function getCoursesByUser(userId: number) {
      const orders = await prisma.order.findMany({
        where: {
          userId,
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              cover: true,
            },
          },
        },
      })
    
      const courses = orders.flatMap(order => order.course)
      const uniqueCourses = courses.filter((course, index, arr) => arr.findIndex(c => c.id === course.id) === index)
      return uniqueCourses
    }
    

更新用户信息，创建 server/api/userinfo.post.ts，同时修改 userinfo.ts 为
userinfo.get.ts，以区分两个接口：

    
    
    import { isNuxtError } from 'nuxt/app'
    import { updateUser } from '../database/repositories/userRepository'
    import { getTokenInfo } from '../database/service/token'
    
    export default defineEventHandler(async (e) => {
      // 验证权限
      const token = getTokenInfo(e)
    
      if (isNuxtError(token)) {
        return sendError(e, createError({
          statusCode: 401,
          statusMessage: 'token不合法!',
        }))
      }
    
      try {
        // 获取更新数据
        const body = await readBody(e)
    
        if (!body || body.username || body.password) {
          let statusMessage
          if (!body)
            statusMessage = '参数不存在'
          else if (body.username)
            statusMessage = '用户名不能修改'
          else
            statusMessage = '请使用修改密码接口'
          return sendError(e, createError({
            statusCode: 400,
            statusMessage,
          }))
        }
    
        const user = await updateUser(token.id, body)
        return { ok: true, data: user }
      }
      catch (error) {
        console.error(error)
        return sendError(e, createError('更新用户信息失败!'))
      }
    })
    

这里用到 updateUser，userRepository.ts:

    
    
    export async function updateUser(id, data: Partial<User>) {
      const user = await prisma.user.update({
        where: {
          id,
        },
        data,
      })
      return user
    }
    

修改密码，创建 server/api/changePwd.post.ts

    
    
    import { isNuxtError } from 'nuxt/app'
    import bcrypt from 'bcryptjs'
    import { getUserByUsername, updateUser } from '../database/repositories/userRepository'
    import { getTokenInfo } from '../database/service/token'
    
    export default defineEventHandler(async (e) => {
      const token = getTokenInfo(e)
    
      if (isNuxtError(token)) {
        return sendError(e, createError({
          statusCode: 401,
          statusMessage: '请先登录!',
        }))
      }
    
      try {
        // 获取更新数据
        const body = await readBody(e)
    
        if (!body || !body.oldPwd || !body.newPwd) {
          return sendError(e, createError({
            statusCode: 400,
            statusMessage: '参数错误',
          }))
        }
    
        // 验证原密码
        const user = await getUserByUsername(token.username)
    
        // 校验密码
        const result = await bcrypt.compare(body.oldPwd, user!.password)
    
        if (!result) {
          return sendError(e, createError({
            statusCode: 400,
            statusMessage: '原密码错误!',
          }))
        }
    
        // 加密
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(body.newPwd, salt)
    
        await updateUser(token.id, { password: hash })
        return { ok: true }
      }
      catch (error) {
        console.error(error)
        return sendError(e, createError('更新密码失败!'))
      }
    })
    

## 前端页面实现

前端需要新增四个页面：

  * 用户中心：usercenter.vue 。

  * 三个子页面：

    * 已购课程：usercenter/buy.vue ；

    * 用户信息：usercenter/info.vue ；

    * 修改密码：usercenter/pwd.vue 。

首先创建 usercenter.vue：注意这里面结合`<NuxtPage :page-key="pageKey" />`动态显示子页面。

    
    
    <!-- 用户：个人中心页面 -->
    <script setup lang="ts">
    const route = useRoute()
    const pageKey = computed(() => route.fullPath)
    
    const menus = [{
      title: '已购课程',
      name: 'usercenter-buy',
    }, {
      title: '修改资料',
      name: 'usercenter-info',
    }, {
      title: '修改密码',
      name: 'usercenter-pwd',
    }]
    
    const activeName = computed(() => route.name)
    </script>
    
    <template>
      <NGrid :x-gap="20">
        <NGridItem :span="5">
          <ul class="list-none bg-white rounded m-0 p-0">
            <li
              v-for="(item, index) in menus" :key="index"
              class="px-5 py-5 text-sm cursor-pointer hover: (bg-blue-50)"
              :class="{ active: (item.name === activeName) }"
              @click="navigateTo({ name: item.name })"
            >
              {{ item.title }}
            </li>
          </ul>
        </NGridItem>
        <NGridItem :span="19">
          <div class="bg-white rounded mb-5 min-h-[66vh]">
            <NuxtPage :page-key="pageKey" />
          </div>
        </NGridItem>
      </NGrid>
    </template>
    
    <style>
    .active {
      font-weight: bold;
      color: rgba(0, 175, 65);
      background-color: rgba(229, 231, 235);
    }
    </style>
    

接下来实现已购课程子页面，buy.vue

    
    
    <script setup lang="ts">
    useHead({ title: '购买记录' })
    
    const { data, pending } = useFetch('/api/purchased-course')
    </script>
    
    <template>
      <div class="p-3">
        <p v-if="pending">
          loading...
        </p>
        <template v-else>
          <NCard
            v-for="item in data!.data"
            :key="item.id"
            class="cursor-pointer mb-5 shadow-md !border-0"
            footer-style="padding:0;"
          >
            <div class="flex">
              <img
                :src="`/${item.cover}`"
                class="h-[150px]"
              >
              <div class="ml-4">
                <h3 class="pt-2">
                  <span class="font-bold w-full truncate font-semibold">
                    {{ item.title }}
                  </span>
                </h3>
                <div class="mt-2 flex">
                  <NButton @click="navigateTo(`/course/detail/${item.id}`)">
                    继续学习
                  </NButton>
                </div>
              </div>
            </div>
          </NCard>
        </template>
      </div>
    </template>
    

下面是用户信息显示和修改，info.vue：

    
    
    <!-- 修改资料页面 -->
    <script setup lang="ts">
    import type { IResult } from '../../types/IResult'
    
    // 获取用户名
    const store = useUser()
    const { userInfo } = storeToRefs(store)
    
    const formRef = ref(null)
    const form = reactive({
      avatar: '',
      nickname: '',
      sex: '',
    })
    
    watchEffect(() => {
      if (userInfo.value) {
        form.avatar = userInfo.value.avatar
        form.nickname = userInfo.value.nickname
        form.sex = userInfo.value.sex
      }
    })
    
    const loading = ref(false)
    const onSubmit = async () => {
      const { ok, data } = await httpPost<IResult>('/api/userinfo', form)
    
      // 刷新用户信息
      // useRefreshUserInfo()
      if (ok) {
        store.userInfo = data
        message.info('更新成功')
      }
    }
    </script>
    
    <template>
      <div class="p-5">
        <NForm ref="formRef" :model="form" label-width="80" label-placement="left">
          <NFormItem label="昵称" path="nickname">
            <NInput v-model:value="form.nickname" placeholder="请输入昵称" />
          </NFormItem>
          <NFormItem label="性别" path="sex">
            <NRadioGroup v-model:value="form.sex" name="sex">
              <NSpace>
                <NRadio
                  v-for="item in [{
                    value: '保密',
                  }, {
                    value: '男',
                  }, {
                    value: '女',
                  }]" :key="item.value" :value="item.value"
                >
                  {{ item.value }}
                </NRadio>
              </NSpace>
            </NRadioGroup>
          </NFormItem>
          <NFormItem>
            <NButton class="ml-8" type="primary" :loading="loading" @click="onSubmit">
              提交修改
            </NButton>
          </NFormItem>
        </NForm>
      </div>
    </template>
    

最后是修改密码页，pwd.vue：

    
    
    <script setup lang="ts">
    import type { FormInst } from 'naive-ui'
    import type { IResult } from '~/types/IResult'
    
    useHead({ title: '修改密码' })
    
    const formRef = ref<FormInst>()
    const form = reactive({
      oldPwd: '',
      newPwd: '',
      repassword: '',
    })
    
    const rules = {
      oldPwd: [{
        required: true,
        message: '原密码必填',
      }],
      newPwd: [{
        required: true,
        message: '密码必填',
      }],
      repassword: [{
        required: true,
        message: '确认密码必填',
      }, {
        validator(rule, value) {
          return value === form.newPwd
        },
        message: '两次密码输入不一致',
        trigger: ['input', 'blur'],
      }],
    }
    
    const loading = ref(false)
    const onSubmit = () => {
      formRef.value!.validate(async (errors) => {
        if (errors)
          return
    
        const {
          ok,
        } = await httpPost<IResult>('/api/changePwd', form)
    
        if (ok)
          message.success('修改密码成功！')
      })
    }
    </script>
    
    <template>
      <div class="p-5">
        <NForm ref="formRef" :model="form" :rules="rules" label-width="80">
          <NFormItem label="原密码" path="oldPwd">
            <NInput v-model:value="form.oldPwd" placeholder="原密码" type="password" />
          </NFormItem>
          <NFormItem label="新密码" path="newPwd">
            <NInput v-model:value="form.newPwd" placeholder="新密码" type="password" />
          </NFormItem>
          <NFormItem label="确认密码" path="repassword">
            <NInput
              v-model:value="form.repassword" placeholder="确认密码" type="password"
              :disabled="!form.newPwd"
            />
          </NFormItem>
          <div class="flex justify-end">
            <NButton type="primary" :loading="loading" @click="onSubmit">
              密码修改
            </NButton>
          </div>
        </NForm>
      </div>
    </template>
    

完成！最终效果如下：

![](img\31\2.image)

![](img\31\3.image)

![](img\31\4.image)

## 下次预告

功能开发告一段落，下一讲我们做一些用户体验的优化工作。

