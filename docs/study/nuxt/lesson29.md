大家好，我是村长！

本节我们实现课程、专栏详情页的设计和具体实现，我们需要完成以下任务：

  * 详情页设计；

  * 编写服务端接口；

  * 编写前端页面。

## 页面设计

课程、专栏详情页设计非常相似，因此统一处理。它们由 3 部分构成：

  * 课程/专栏简介：不同点是专栏没有价格；
  * 详情/目录：不同点是专栏没有目录；
  * 推荐列表：暂时显示最新的两个。

![](img\29\1.image)

## 接口实现

我们需要实现两个接口：

  * /course/[id]：获取指定课程详情

    * 返回 { ok: boolean, data: { item: Course, recommend: Course[] }}
  * /column/[id]：分页获取专栏列表

    * 返回 { ok: boolean, data: { item: Column, recommend: Column[] }}

更新两个 repository，columnRepository.ts

    
    
    export async function getColumnById(id: number): Promise<Column | null> {
      const result = await prisma.column.findFirst({
        where: {
          id,
        },
      })
      return result
    }
    

courseRepository.ts：这里涉及关联数据 catalogue 查询

    
    
    export async function getCourseById(id: number): Promise<Course | null> {
      const result = await prisma.course.findFirst({
        where: {
          id,
        },
        include: { Catalogue: true },
      })
      return result
    }
    

分别实现 course 和 column 接口，server/api/course/[id].ts

    
    
    import { getCourseById, getCourses } from '~/server/database/repositories/courseRepository'
    
    export default defineEventHandler(async (e) => {
      const id = e.context.params?.id ? parseInt(e.context.params.id) : undefined
      if (!id)
        return sendError(e, createError({ statusCode: 400, statusMessage: '参数错误' }))
      try {
        const course = await getCourseById(id)
        if (!course)
          return sendError(e, createError({ statusCode: 404, statusMessage: '没有对应课程' }))
    
        const { courses: recommend } = await getCourses({ page: 1, size: 2 })
    
        return { ok: true, data: { item: course, recommend } }
      }
      catch (error) {
        return sendError(e, createError({ statusCode: 500, statusMessage: '服务器错误' }))
      }
    })
    

server/api/column/[id].ts

    
    
    import { getColumnById, getColumns } from '~/server/database/repositories/columnRepository'
    
    export default defineEventHandler(async (e) => {
      const id = e.context.params?.id ? parseInt(e.context.params.id) : undefined
      if (!id)
        return sendError(e, createError({ statusCode: 400, statusMessage: '参数错误' }))
      try {
        const column = await getColumnById(id)
        if (!column)
          return sendError(e, createError({ statusCode: 404, statusMessage: '没有对应专栏' }))
    
        const { columns: recommend } = await getColumns({ page: 1, size: 2 })
    
        return { ok: true, data: { item: column, recommend } }
      }
      catch (error) {
        return sendError(e, createError({ statusCode: 500, statusMessage: '服务器错误' }))
      }
    })
    

## 前端页面实现

课程详情页面和专栏详情页面非常相似，它们都包括了：

  * 简介
  * 详情
  * 推荐列表

仅仅少了课程表，因此完全可以用一个详情页来实现，仅区别一下商品类型即可，因此可以通过一个动态路由`/:type/detail/:id`区分。

下面创建这个目录结构：

![](img\29\2.image)

下面完成详情页，[id].vue

    
    
    <script setup lang="ts">
    import type { IResult } from '~/types/IResult'
    
    const route = useRoute()
    const { id, type } = route.params
    
    const { data } = useFetch<IResult>(`/api/${type}/${id}`)
    const item = computed(() => data.value?.data.item)
    useHead({ title: item.value?.title || '详情' })
    
    const tabs = ref([{
      label: '详情',
      value: 'detail',
    }])
    const curr = ref('detail')
    
    if (type === 'course') {
      tabs.value.push({
        label: '目录',
        value: 'catalogue',
      })
    }
    
    const subscribe = () => {
      navigateTo(`/createorder?id=${id}`)
    }
    </script>
    
    <template>
      <section class="rounded bg-white flex p-5 my-2">
        <NImage
          :src="`/${data?.data.item.cover}`" object-fit="cover"
          class="rounded w-[380px] h-[210px] mr-5"
        />
        <div class="flex flex-1 flex-col py-2">
          <div class="flex flex-col items-start">
            <div class="flex items-center">
              <span class="text-xl mr-2">{{ data?.data.item.title }}</span>
            </div>
            <p class="my-2 text-sm text-gray-400 ml-[0.1rem]">
              {{ data?.data.item.desc }}
            </p>
            <div v-if="type === 'course'">
              <span class="text-green-600 font-bold">
                🌱 {{ data?.data.item.price }}
              </span>
              <span class="text-gray-500 text-xs line-through ml-2">
                {{ data?.data.item.oPrice }}
              </span>
            </div>
          </div>
    
          <div class="mt-auto">
            <NButton type="primary" @click="subscribe">
              快到碗里来
            </NButton>
          </div>
        </div>
      </section>
    
      <NGrid :x-gap="20" class="pt-2">
        <NGridItem :span="18">
          <section class="bg-white shadow-white mb-5 rounded">
            <Tabs
              :data="tabs"
              :state="curr"
              @change="curr = $event"
            />
            <div
              v-if="curr === 'detail'"
              class="pt-4 pb-10 px-10 content"
              v-html="data?.data.item.detail"
            />
            <Catalogue v-else :data="item.Catalogue" />
          </section>
        </NGridItem>
        <NGridItem :span="6">
          <section class="bg-white shawdow rounded mb-5">
            <div class="p-3 border-b ">
              <h4>精品推荐</h4>
            </div>
            <div class="p-3">
              <Prod v-for="prod in data?.data.recommend" :key="prod.id" :data="prod" />
            </div>
          </section>
        </NGridItem>
      </NGrid>
    </template>
    
    <style>
    .content img {
      max-width: 100% !important;
    }
    </style>
    

这里提出来一个 Tabs 和 Catalogue 组件，分别如下：

    
    
    <!-- 搜索结果页tab组件 -->
    <script setup lang="ts">
    defineProps({
      data: {
        type: Array<{ label: string; value: string }>,
        required: true,
      },
      state: String,
    })
    
    const emit = defineEmits(['change'])
    
    const changeTab = (state: string) => {
      emit('change', state)
    }
    </script>
    
    <template>
      <div class="w-full flex overflow-x-auto bg-white rounded mb-4 border-b">
        <span
          v-for="item in data"
          :key="item.value"
          class="py-3 px-4 text-gray-700 text-sm cursor-pointer flex-shrink-0 hover:text-green-600"
          :class="{ 'tab-item-active': item.value === state }"
          @click="changeTab(item.value)"
        >
          {{ item.label }}
        </span>
      </div>
    </template>
    
    <style>
    .tab-item-active {
        border-bottom: 2px solid rgb(3, 168, 9);
        @apply text-green-400 border-green-500;
    }
    </style>
    

Catalouge.vue

    
    
    <script setup lang="ts">
    import type { Catalogue } from '.prisma/client'
    
    defineProps({
      data: Array<Catalogue>,
    })
    </script>
    
    <template>
      <ul class="list-none">
        <li
          v-for="(item, index) in data"
          :key="item.id"
          class="flex p-5 border-b cursor-pointer text-sm hover: ( !bg-gray-100) active:( !bg-gray-200)"
          @click="navigateTo(item.source, { external: true })"
        >
          <NTag :bordered="false" type="info" size="small" class="mr-3">
            第{{ index + 1 }}节
          </NTag>
          <span>{{ item.title }}</span>
        </li>
      </ul>
    </template>
    

效果如下：

![](img\29\3.image)

## 下次预告

接下来，我们计划完成订阅购买流程相关的开发。

