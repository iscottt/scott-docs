大家好，我是村长！

前面我们学习了数据库和接口的设计，是时候编写一些接口获取并返回数据。但是还是有个问题，我们可能对数据库查询语言 SQL 不是很熟悉，编写和调试 SQL
语句是非常耗时的工作。

还好，社区有很多 ORM(对象关系映射) 库，可以很好规避这个问题，例如本节我要给大家介绍的 Prisma，就是一个 ORM
库，它可以大幅简化数据库操作。本节涉及内容如下：

  * 什么是 Prisma；
  * 快速体验 Prisma；
  * 整合 Prisma 到 Nuxt 项目。

## 什么是 Prisma？

**Prisma 是一个使用 TypeScript 和 Node.js 开发的 ORM (对象关系映射) 库**
，用于简化对数据库的访问和操作。它提供了一种高级语言来定义数据模型，并且可以生成数据库架构和数据访问代码。

![](img\23\1.image)

## 快速体验 Prisma

Prisma 通过以下流程简化我们的开发工作:

首先我们创建一个 Prisma schema（结构）：下面 schema 描述了我们要用 prisma-client-js 客户端和 MySQL
数据库交互。同时我们准备创建两个模型 Post 和
User，它们代表了未来要创建的数据库表结构。server/database/schema.prisma：

    
    
            datasource db {
              provider = "mysql"
              url      = env("DATABASE_URL")
            }
    
            generator client {
              provider = "prisma-client-js"
            }
    
            model Post {
              id        Int     @id @default(autoincrement())
              title     String
              content   String?
              published Boolean @default(false)
              author    User?   @relation(fields: [authorId], references: [id])
              authorId  Int?
            }
    
            model User {
              id    Int     @id @default(autoincrement())
              email String  @unique
              name  String?
              posts Post[]
            }
    

添加环境变量 DATABASE_URL，.env

    
    
    DATABASE_URL="mysql://root:rootpassword@localhost:3306/test"
    

然后通过定义生成数据库表结构，我们需要执行 `prisma migrate` CLI 命令，这个命令同时会生成 prisma client：

    
    
    npx prisma migrate dev --name init --schema server/database/schema.prisma 
    

![image.png](img\23\2.image) ![image.png](img\23\3.image)

最后在代码中通过 client 访问数据库：

    
    
    import { PrismaClient } from '@prisma/client'
    
    const prisma = new PrismaClient()
    
    async function main() {
      // 查询所有用户
      const allUsers = await client.user.findMany()
      // eslint-disable-next-line no-console
      console.log(allUsers)
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
    

执行这段代码：

    
    
    npx ts-node server/database/test.ts
    

注意需要配置一下 ts-node 模块选项，tsconfig.json：

    
    
    {
      // https://nuxt.com/docs/guide/concepts/typescript
      "extends": "./.nuxt/tsconfig.json",
      "ts-node": {
        "compilerOptions": {
          "module":"CommonJS"
        }
      }
    }
    

执行结果如下，此时并没有数据，所以返回空数组。

![image.png](img\23\4.image)

我们插入一些数据进去：

    
    
      await prisma.user.create({
        data: {
          name: '村长',
          email: 'yt0379@qq.com',
          posts: {
            create: {
              title: '10分钟速通下一代ORM解决方案：Prisma',
            },
          },
        },
      })
    

查询时添加 include 选项：

    
    
      const allUsers = await prisma.user.findMany({
        include: {
          posts: true,
        },
      })
      console.dir(allUsers, { depth: null })
    

查询结果如下：

![](img\23\5.image)

最后更新数据可以使用 `update({...})`：

    
    
      const post = await prisma.post.update({
        where: { id: 1 },
        data: { published: true },
      })
    
      console.log(post)
    

![image.png](img\23\6.image)

## 整合 Prisma 到 Nuxt 项目

下面我们整合 Prisma 到 Nuxt 项目中，主要是客户端和连接管理，以及业务代码拆分。

### 客户端和连接管理

我们观察到前面的例子中，每次调用查询后，都会明确的关闭连接，以避免连接池耗尽。不过官方文档明确表示，对于一个 long-running
application，建议我们使用一个单例的 PrismaClient。

server/database/client.ts

    
    
    import { PrismaClient } from '@prisma/client'
    
    const prisma = new PrismaClient()
    export default prisma
    

### 业务代码拆分

在 Java 领域一般不会把数据库操作代码和其他业务代码混在一起，代码会被拆分为 controller 和 service 层，将数据库操作代码放
controller 层，业务代码放在 service 层，最后在接口中组合。

因此我们也模仿这种组织结构，创建一个 repositories 目录，将数据库相关操作按照表作为单元拆分，类似于 controller
层。然后在接口中调用这些 repository 进行组合完成业务。如果大家觉得业务过于复杂，还可以继续提取出 service。

![](img\23\7.image)

### 范例：编写用户登录接口

下面我们编写一个用户登录接口，演示一下前面提到的代码组织方式。

首先创建 userRepository.ts，编写 createUser 和 getUserByEmail 两个方法：

    
    
    import type { User } from '@prisma/client'
    import prisma from '~/server/database/client'
    import type { IUser } from '~/types/IUser'
    
    export async function getUserByEmail(email: string): Promise<User | null> {
      return await prisma.user.findUnique({
        where: {
          email,
        },
      })
    }
    
    export async function createUser(data: IUser) {
      const user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
        },
      })
    
      return user
    }
    

这里需要创建一个 User 类型，创建 ~/types/IUser.ts:

    
    
    export interface IUser {
      id?: number
      email: string
      name?: string
    }
    

下面编写登录接口，~/server/api/login.ts：

    
    
    import { getUserByEmail } from '../database/repositories/userRepository'
    
    export default defineEventHandler(async (e) => {
      const { email } = await readBody(e)
    
      if (!email)
        return sendError(e, createError('email required!'))
    
      try {
        const user = await getUserByEmail(email)
    
        if (!user) {
          return sendError(e, createError({
            statusCode: 401,
            statusMessage: 'email not exist!',
          }))
        }
    
        return user
      }
      catch (error) {
        console.error(error)
        return sendError(e, createError('Failed to retrieve data!'))
      }
    })
    

编写一个登录页面测试一下，~/pages/login.vue：

    
    
    <script setup lang="ts">
    const email = useState(() => '')
    const onLogin = () => {
      $fetch('/api/login', {
        method: 'post',
        body: {
          email: email.value,
        },
      }).then((user) => {
        console.log(user)
      }).catch((err) => {
        console.log(err)
      })
    }
    </script>
    
    <template>
      <div>
        <NInput v-model:value="email" />
        <NButton @click="onLogin">
          登录
        </NButton>
      </div>
    </template>
    

测试结果非常理想！

![](img\23\8.image)

![](img\23\9.image)

## 总结

好了，关于如何使用 Prisma 访问数据库就跟大家讲到这里了，再总结一下使用流程：

  1. 创建 schema.prisma；
  2. 生成数据库；
  3. 创建 PrismaClient；
  4. 访问数据库。

## 下次预告

现在可以说万事俱备了，下节课我们正式开启项目实战，咱们下节再见！

