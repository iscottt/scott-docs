大家好，我是村长！

本节我们实现课程页面、专栏页面的设计和具体实现，我们需要完成以下任务：

  * 课程页、专栏页设计；

  * 编写数据接口；

  * 编写前端页面。

## 页面设计

课程页和专栏页的设计非常相似，因此统一处理。它们由 3 部分构成：

  * 面包屑；
  * 内容列表；
  * 分页器。

![](img\28\1.image)

## 接口实现

我们需要实现两个接口：

  * course：分页获取课程列表

    * Query params：page和size
    * 返回 { ok: boolean, data: { courses: Course[], total: number}}
  * column：分页获取专栏列表

    * Query params：page和size

    * 返回 { ok: boolean, data: { columns: Column[], total: number}}

更新两个repository，columnRepository.ts

    
    
    export async function getColumns({ page, size }): Promise<{ columns: Column[] | null; total: number }> {
      const [columns, total] = await Promise.all([
        prisma.column.findMany({
          orderBy: { id: 'desc' },
          skip: page * size,
          take: size,
        }),
        prisma.column.count(),
      ])
      return { columns, total }
    }
    

courseRepository.ts

    
    
    export async function getCourses({ page, size }): Promise<{ courses: Course[] | null; total: number }> {
      const [courses, total] = await Promise.all([
        prisma.course.findMany({
          orderBy: { id: 'desc' },
          skip: page * size,
          take: size,
        }),
        prisma.course.count(),
      ])
      return { courses, total }
    }
    

分别实现 course 和 column 接口，server/api/course.ts

    
    
    import { getCourses } from '../database/repositories/courseRepository'
    
    export default defineEventHandler(async (e) => {
      try {
        // 获取分页信息
        const query = getQuery(e)
        const page = query.page ? parseInt(query.page as string) : 0
        const size = query.size ? parseInt(query.size as string) : 8
        // 分页获取课程列表和总条数
        const { courses, total } = await getCourses({ page, size })
    
        return { ok: true, data: { list: courses, total } }
      }
      catch (error) {
        return sendError(e, createError('获取数据失败'))
      }
    })
    

server/api/column.ts

    
    
    import { getColumns } from '../database/repositories/columnRepository'
    
    export default defineEventHandler(async (e) => {
      try {
        // 获取分页信息
        const query = getQuery(e)
        const page = query.page ? parseInt(query.page as string) : 0
        const size = query.size ? parseInt(query.size as string) : 8
        // 分页获取课程列表和总条数
        const { columns, total } = await getColumns({ page, size })
    
        return { ok: true, data: { list: columns, total } }
      }
      catch (error) {
        return sendError(e, createError('获取数据失败'))
      }
    })
    

## 前端页面实现

课程页面和专栏页面非常相似，它们都包括了：

  * 面包屑；
  * 列表；
  * 分页。

因此完全可以用一个列表页来实现，仅区别一下商品类型即可，因此可以：

  * 通过一个动态路由`/list/:type`区分；

  * 删除之前 course.vue 和 column.vue；

  * 修改 MyHeader.vue 中的导航链接地址；

  * 修改 index.vue 中的“更多课程”和“更多专栏”链接地址。

下面创建这个目录结构：

![](img\28\2.image)

[type].vue

    
    
    <!-- 课程列表页 -->
    <script setup lang="ts">
    import type { IResult } from '~/types/IResult'
    
    const route = useRoute()
    const type = route.params.type as string
    const title = type === 'course' ? '课程' : '专栏'
    useHead({ title })
    
    const url = type === 'course' ? '/api/course' : '/api/column'
    const page = ref(1)
    const size = ref(8)
    const {
      data,
    } = await useFetch<IResult>(() => `${url}?page=${page.value - 1}`, {
      watch: [page],
    })
    
    const onPageChange = (pageNum) => {
      page.value = pageNum
    }
    </script>
    
    <template>
      <div>
        <NBreadcrumb class="mb-5">
          <NBreadcrumbItem>
            <nuxt-link to="/">
              首页
            </nuxt-link>
          </NBreadcrumbItem>
          <NBreadcrumbItem>
            {{ title }}
          </NBreadcrumbItem>
        </NBreadcrumb>
        <!-- 课程渲染 -->
        <NGrid :x-gap="20" :cols="4">
          <NGi v-for="item in data?.data.list" :key="item.id">
            <Prod :data="item" :type="type" />
          </NGi>
        </NGrid>
        <!-- 分页组件 -->
        <div class="flex justify-center items-center mt-5 mb-10">
          <NPagination
            size="large" :item-count="data?.data.total" :page="page" :page-size="size"
            :on-update:page="onPageChange"
          />
        </div>
      </div>
    </template>
    

效果如下：

![](img\28\3.image)

## 下次预告

接下来，我们计划完成详情页相关的开发。

