大家好，我是村长！

本节我们实现首页的页面设计和具体实现，我们需要完成以下任务：

  * 首页页面设计；
  * 种子数据初始化；
  * 编写数据接口；
  * 编写前端页面。

## 首页页面设计

网站首页由 4 部分构成：

  * Banner

  * 内容推荐

  * 最新课程

  * 最新专栏

![](img\27\1.image)

## 种子数据

我们可以提前放入一些种子数据便于界面展现。

创建种子（此处省略部分数据），server/database/seed.ts

    
    
    import { PrismaClient } from '@prisma/client'
    const prisma = new PrismaClient()
    async function main() {
       await prisma.column.create({
        data: {
          title: '上层框架最佳选择: Nuxt',
          cover: 'column-nuxt.png',
          desc: '上层框架最佳选择：Nuxt',
          content: `开箱即用的开发环境...`,
        },
      })
      await prisma.course.create({
        data: {
          title: 'Nuxt全栈开发',
          cover: 'course-nuxt.png',
          desc: '这门课我会全面讲解。。。',
          oPrice: 129,
          price: 99,
          detail: `这门课程共分五个模块：。。。`,
          Catalogue: {
            createMany: {
              data: [
                { title: '01开篇：课程介绍和安排', source: 'https://juejin.cn/video/7202149403342143520/section/7202885295820242947' },
                { title: '02上层框架最佳选择', source: 'https://juejin.cn/video/7202149403342143520/section/7202885295820242947' },
                { title: '03五种渲染模式', source: 'https://juejin.cn/video/7202149403342143520/section/7202885295820242947' },
                { title: '04快速创建首个nuxt项目', source: 'https://juejin.cn/video/7202149403342143520/section/7202885295820242947' }
              ],
            },
          },
        },
      })
    }
    main()
      .then(async () => {
        await prisma.$disconnect()
      })
      .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
      })
    

配置种子脚本，package.json

    
    
    "prisma": {
      "seed": "ts-node server/database/seed.ts"
    },
    "scripts": {
      "seed": "npx prisma db seed"
    },
    

执行脚本

    
    
    yarn seed
    

## 接口实现

我们暂时实现一个接口，推荐内容在后面加入购买业务之后再实现：

  * indexdata：获取最新 4 个专栏和 4 个课程的数据。

创建两个repository，columnRepository.ts

    
    
    import type { Column } from '@prisma/client'
    import prisma from '~/server/database/client'
    
    export async function getNewColumns(): Promise<Column[] | null> {
      const result = await prisma.column.findMany({
        orderBy: { id: 'desc' },
        take: 4,
      })
      return result
    }
    

courseRepository.ts

    
    
    import type { Course } from '@prisma/client'
    import prisma from '~/server/database/client'
    
    export async function getNewCourses(): Promise<Course[] | null> {
      const result = await prisma.course.findMany({
        orderBy: { id: 'desc' },
        take: 4,
      })
      return result
    }
    

实现 indexdata 接口，server/api/indexdata.ts

    
    
    import { getNewColumns } from '../database/repositories/columnRepository'
    import { getNewCourses } from '../database/repositories/courseRepository'
    
    export default defineEventHandler(async (e) => {
      try {
        const columns = await getNewColumns()
        const courses = await getNewCourses()
    
        return { ok: true, data: { columns, courses } }
      }
      catch (error) {
        return sendError(e, createError('获取数据失败'))
      }
    })
    

## 前端页面实现

首页暂时只显示 banner，最新课程和专栏。

index.vue

    
    
    <script setup lang="ts">
    useHead({
      title: '羊村学堂',
    })
    
    const { data, error } = await useFetch('/api/indexdata')
    const slides = [
      { label: '1', bgColor: 'cadetblue' },
      { label: '2', bgColor: 'cornflowerblue' },
      { label: '3', bgColor: 'blueviolet' },
      { label: '4', bgColor: 'brown' },
    ]
    if (process.server && error.value)
      showError('获取数据失败！')
    </script>
    
    <template>
      <n-carousel show-arrow class="mb-6">
        <div
          v-for="item in slides" :key="item.label"
          class="text-white w-full h-[400px] rounded cursor-pointer text-center leading-[400px]"
          :style="{ backgroundColor: item.bgColor }"
        >
          {{ item.label }}
        </div>
      </n-carousel>
      <ProdList
        :data="data?.data.courses!"
        title="最新课程"
      />
      <ProdList
        :data="data?.data.columns!"
        title="最新专栏"
        type="column"
      />
    </template>
    

下面定义产品列表，components/ProdList.vue

    
    
    <script lang="ts" setup>
    defineProps({
      title: {
        type: String,
        default: '标题',
      },
      data: {
        type: Array<any>,
        required: true,
      },
      type: {
        type: String,
        default: 'course',
      },
    })
    </script>
    
    <template>
      <div>
        <div class="flex mb-3">
          <span>{{ title }}</span>
          <NButton quaternary class="ml-auto">
            查看更多
          </NButton>
        </div>
        <NGrid x-gap="12" :cols="4" class="mb-6">
          <NGi v-for="item in data" :key="item.id">
            <Prod :data="item" :type="type" />
          </NGi>
        </NGrid>
      </div>
    </template>
    

商品组件定义，components/Prod.vue

    
    
    <script setup lang="ts">
    import type { Column, Course } from '.prisma/client'
    import type { PropType } from 'vue'
    
    const props = defineProps({
      data: { type: Object as PropType<Course | Column>, required: true },
      type: String,
    })
    
    const open = () => {
      if (props.type === 'course')
        navigateTo(`/course/detail/${props.data!.id}`)
      else
        navigateTo(`/column/detail/${props.data!.id}`)
    }
    </script>
    
    <template>
      <NCard
        class="cursor-pointer mb-5 shadow-md !border-0"
        footer-style="padding:0;"
        @click="open"
      >
        <template #cover>
          <img
            :src="data.cover"
            class="w-[100%] h-[150px]"
          >
        </template>
        <div class="pt-2">
          <span class="font-bold w-full truncate font-semibold">
            {{ data.title }}
          </span>
        </div>
        <div class="mt-2 flex">
          <div v-if="'price' in data">
            <span class="text-green-600 font-bold">
              🌱 {{ data.price }}
            </span>
            <span class="text-gray-500 text-xs line-through ml-2">
              {{ data.oPrice }}
            </span>
          </div>
    
          <span v-else>🌱 免费</span>
        </div>
      </NCard>
    </template>
    

## 错误页

如果发生错误，将显示根目录下 error.vue

    
    
    <script setup>
    defineProps({
      error: Object,
    })
    const handleError = () => clearError({ redirect: '/' })
    </script>
    
    <template>
      <div class="pt-[14rem]">
        <NResult status="500" title="服务器错误" :description="error.message">
          <template #footer>
            <NButton @click="handleError">
              回到首页
            </NButton>
          </template>
        </NResult>
      </div>
    </template>
    

## 下次预告

接下来，我们计划完成课程列表相关的开发。

