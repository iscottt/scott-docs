大家好，我是村长！

本节我们实现支付业务，支付流程实际上就是订单状态的变化过程，下面我们先看一下详细流程。

## 支付流程

从用户点击“订阅”按钮开始，支付流程就开启了：

  1. 首先创建订单（状态为等待确认 WAIT_CONFIRM)；

  2. 然后跳转订单确认页面；

  3. 用户确认订单（状态变为等待支付 WAIT_PAY）；

  4. 并跳转支付页面；

  5. 用户扫码支付结束（订单状态变为已完成 COMPLETED)；

  6. 页面发现订单完成跳转至课程详情页。

## 页面设计

下面是流程中两个关键页面的草图，分别是：

订单确认页，order-confirm.vue。

![](img\30\1.image)

支付页，order-pay.vue。

![](img\30\2.image)

## 接口实现

我们需要实现两个接口：

  * /order：创建订单。

    * method: post
    * body：{ courseId: number }
    * 返回 { ok: boolean, data: { orderId: number } }
  * /order/[id]：获取订单详情。

    * method：get
    * 返回 { ok: boolean, data: Order }
  * /order: 更新订单状态。

    * method：patch

    * body: { id: number, status: string }

    * 返回 { ok: boolean }

创建 orderRepository，server/database/repositories/orderRepository.ts

    
    
    import type { Order } from '@prisma/client'
    import prisma from '~/server/database/client'
    
    export async function createOrder(data: Order) {
      const user = await prisma.order.create({ data })
      return user
    }
    
    export async function getOrderById(id: number) {
      const result = await prisma.order.findUnique({
        where: {
          id,
        },
        include: {
          course: {
            select: {
              title: true,
              cover: true,
              price: true,
            },
          },
        },
      })
      return result
    }
    
    export async function updateOrder(id: number, data: Partial<Order>) {
      const result = await prisma.order.update({
        where: {
          id,
        },
        data,
      })
      return result
    }
    

分别实现 3 个接口：

  * 创建订单，server/api/order.post.ts

  * 更新订单，server/api/order.patch.ts

  * 订单详情，server/api/order/[id].ts

server/api/order.post.ts

    
    
    import type { Order } from '@prisma/client'
    import { OrderStatus } from '@prisma/client'
    import { isNuxtError } from 'nuxt/app'
    import { getTokenInfo } from '../database/service/token'
    import { createOrder } from '../database/repositories/orderRepositor'
    
    export default defineEventHandler(async (e) => {
      const { courseId } = await readBody(e)
    
      const result = getTokenInfo(e)
      if (isNuxtError(result))
        return sendError(e, result)
    
      const order = {
        courseId,
        userId: result.id,
        createdAt: new Date(),
        status: OrderStatus.WAIT_CONFIRM,
      } as Order
    
      const o = await createOrder(order)
    
      return { ok: true, data: { orderId: o.id } }
    })
    

更新订单，server/api/order.patch.ts

    
    
    import { updateOrder } from '../database/repositories/orderRepositor'
    
    export default defineEventHandler(async (e) => {
      const body = await readBody(e)
    
      try {
        await updateOrder(body.id, { status: body.status })
        return { ok: true }
      }
      catch (error) {
        return sendError(e, createError('订单状态更新失败'))
      }
    })
    

订单详情，server/api/order/[id].ts

    
    
    import { getOrderById } from '~/server/database/repositories/orderRepositor'
    
    export default defineEventHandler(async (e) => {
      const id = e.context.params?.id ? parseInt(e.context.params.id) : undefined
      if (!id) {
        return sendError(e, createError({
          statusCode: 400,
          statusMessage: '缺少订单id',
        }))
      }
      const order = await getOrderById(id)
      return { ok: true, data: order }
    })
    

## 前端页面实现

前端需要新增两个页面：

  * 订单确认页面；

  * 支付页面。

第一个变化是详情页中点击“订阅”按钮的操作，我们首先创建订单，成功之后跳转确认页并传入 orderId

[id].vue

    
    
    const subscribe = async () => {
      // 创建订单
      const { ok, data } = await httpPost<IResult>('/api/order', { courseId: id })
    
      if (ok) {
        // 然后跳转订单确认页面
        navigateTo(`/order-confirm/?id=${data.orderId}`)
      }
    }
    

接下来实现订单确认，我们获取订单详情和关联的课程内容，order-confirm.vue

    
    
    <script setup lang="ts">
    import type { IResult } from '../types/IResult'
    
    const route = useRoute()
    const id = route.query.id
    const { data } = await httpGet<IResult>(`/api/order/${id}`)
    const course = computed(() => data.course)
    // 创建订单
    const confirmOrder = async () => {
      navigateTo(`/order-pay/?id=${id}`)
    }
    </script>
    
    <template>
      <NCard class="font-semibold mb-3 text-gray-500" size="medium">
        <h2>产品信息</h2>
        <div class="flex mb-5">
          <NImage
            :src="`/${course.cover}`" object-fit="cover"
            class="rounded w-[380px] h-[210px] mr-5"
          />
          <div class="flex flex-1 ml-4 flex-col">
            <h5 class="flex text-xl text-gray-600 ">
              {{ course.title }}
            </h5>
            <p class="my-2 text-sm text-gray-400 ml-[0.1rem]">
              {{ course.desc }}
            </p>
          </div>
        </div>
    
        <div class="flex items-center mb-5">
          <span class="text-red-400 text-xl">请在 30 分钟内完成支付</span>
        </div>
    
        <div class="flex justify-end items-center">
          总计：
          <span class="text-green-600 font-bold pr-4 text-2xl">
            🌱 {{ course.price }}
          </span>
          <NButton type="primary" @click="confirmOrder">
            确认订单
          </NButton>
        </div>
      </NCard>
    </template>
    

最后是支付页，这里刻意简化了支付流程，实际上二维码是后端生成的支付链接生成的，同时前端页面应该轮询支付状态，待成功之后跳转页面。order-pay.vue：

    
    
    <script setup lang="ts">
    import type { Course } from '.prisma/client'
    import type { IResult } from '../types/IResult'
    
    const route = useRoute()
    const { id } = route.query
    
    // 获取订单过期时间，用于倒计时，如果已过期可以设置isTimeout，略
    const { data } = await httpGet<IResult>(`/api/order/${id}`)
    const course = computed<Course | undefined>(() => data?.course)
    
    if (process.client) {
      setTimeout(async () => {
        const { ok } = await httpPost<IResult>('/api/ordercomplete', { id, status: 'COMPLETED' })
    
        if (ok)
          navigateTo(`/course/detail/${course.value!.id}`)
      }, 5000)
    }
    
    const isTimeout = ref(false)
    </script>
    
    <template>
      <div class="flex justify-center">
        <NCard class="w-[450px] mb-10 text-center">
          <h1 class="text-3xl mb-2 text-center">
            确认支付
          </h1>
          <p class="flex  text-gray-500 justify-center">
            <span v-if="!isTimeout">
              距离过期还有&nbsp;
              <Counter :expire="30" class="text-rose-500" @end="isTimeout = true" />
            </span>
            <span v-else>订单已过期，请重新订阅课程</span>
          </p>
          <h5 class="flex justify-center items-center mt-0 mb-3">
            总额：
            <span class="text-green-600 font-bold text-2xl">
              🌱 {{ course?.price }}
            </span>
          </h5>
          <img src="/qrcode.jpg">
          <div class="flex justify-center items-center py-4 text-green-500">
            <div class="ml-3 text-gray-500 text-sm">
              <p>请用防狼枪扫射二维码</p>
            </div>
          </div>
        </NCard>
      </div>
    </template>
    

这个页面用到一个倒计时器，Counter.vue：

    
    
    <script setup lang="ts">
    const props = defineProps({
      expires: {
        type: Number,
        default: 30,
      },
    })
    
    const emit = defineEmits(['end'])
    
    const transform = (data: number) => {
      const minutes = Math.floor((data % (60 * 60)) / 60)
      const seconds = data % 60
      return `${minutes < 10 ? (`0${minutes}`) : minutes}:${seconds < 10 ? (`0${seconds}`) : seconds}`
    }
    
    let timer: any
    const timeout = ref(0)
    
    onMounted(() => init())
    onBeforeUnmount(() => clearInterval(timer!))
    
    // 初始化倒计时
    function init() {
      if (timer)
        clearInterval(timer)
    
      timeout.value = props.expires * 60
      if (timeout.value > 0)
        timer = setInterval(handleTimeout, 1000)
    }
    
    function handleTimeout() {
      if (timeout.value === 0) {
        emit('end')
        return clearInterval(timer)
      }
      timeout.value--
    }
    </script>
    
    <template>
      <div class="text-center">
        {{ transform(timeout) }}
      </div>
    </template>
    

完成！最终效果如下：

![](img\30\3.image)

![](img\30\4.image)

## 下次预告

接下来，我们就剩下用户中心的开发工作了。

