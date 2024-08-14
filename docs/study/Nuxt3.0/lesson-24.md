大家好，我是村长！

从本节开始，我们准备完成一个实战项目，验证一下前面所学知识。本节安排如下：

  * 需求分析；
  * 项目创建；
  * 接口设计；
  * 接口实现；
  * 主体布局；
  * 首页实现；
  * 详情页实现；
  * 课程页实现；
  * 专栏页实现；
  * 项目部署。

## 项目概要

项目名为《羊村学堂》，顾名思义是我们羊村的学习网站，小羊们在羊村学堂可以通过订阅课程或者专栏文章学习编程知识，需要付出的代价是“草”。该网站将包括以下页面模块：

  * 用户登录、注册

![](img\24\1.image)

  * 网站首页：展示最新课程和专栏、推荐课程和专栏

![](img\24\2.image)

  * 课程页：分页展示课程列表

![](img\24\3.image)

  * 课程详情：课程详细介绍、课程表、购买链接

![](img\24\4.image)

  * 专栏页：分页展示专栏列表

  * 专栏详情：专栏详细内容、购买链接

  * 订单页：订单详情和确认

![](img\24\5.image)

  * 支付页：支付订单

![](img\24\6.image)

  * 用户中心：用户信息、已购课程等

![](img\24\7.image)

## 数据模型

根据以上页面和业务，我们提取以下数据模型：

  * 用户：用户名、头像、昵称、性别、密码等；

  * 课程：名称、现价、原价、封面、描述、详情；

  * 目录：标题、资源地址；

  * 专栏：名称、封面、描述、详情；

  * 订单：产品 id、下单时间、订单状态。

下面是 schema.prisma：

    
    
    datasource db {
      provider = "mysql"
      url      = env("DATABASE_URL")
    }
    
    generator client {
      provider = "prisma-client-js"
    }
    
    model Column {
      id      Int     @id @default(autoincrement())
      title   String
      cover   String
      desc    String?
      content String? @db.Text
    }
    
    model Course {
      id     Int              @id @default(autoincrement())
      title  String
      cover  String
      price  Decimal
      oPrice Decimal
      desc   String?
      detail String?          @db.Text
      users  UsersOnCourses[]
      orders Order[]
    }
    
    model Catalogue {
      id     Int    @id @default(autoincrement())
      title  String
      source String
      course   Course @relation(fields: [courseId], references: [id])
      courseId Int
    }
    
    model User {
      id       Int              @id @default(autoincrement())
      username String           @unique
      password String
      nickname String?
      avatar   String?
      sex      String?
      courses  UsersOnCourses[]
      orders   Order[]
    }
    
    model UsersOnCourses {
      user     User   @relation(fields: [userId], references: [id])
      userId   Int
      course   Course @relation(fields: [courseId], references: [id])
      courseId Int
    
      @@id([userId, courseId])
    }
    
    model Order {
      id        Int         @id @default(autoincrement())
      course    Course      @relation(fields: [courseId], references: [id])
      courseId  Int
      user      User        @relation(fields: [userId], references: [id])
      userId    Int
      createdAt DateTime
      status    OrderStatus
    }
    
    enum OrderStatus {
      WAIT_CONFIRM
      WAIT_PAY
      COMPLETED
    }
    

加一个脚本方便执行，package.json：

    
    
    "migrate": "npx prisma migrate dev --name init --schema server/database/schema.prisma"
    

执行之后的效果如下图：

![](img\24\8.image)

## 数据接口

根据以上页面和业务，我们需要提供以下数据接口：

  * 登录、注册：login、register ；

  * 课程页：course ；

  * 课程详情：course/:id ；

  * 专栏页：column ；

  * 专栏详情：column/:id ；

  * 订单页：order(get/patch) ；

  * 用户中心：user(get/patch)，upload，changePassword(patch)。

## 下次预告

下节课我们先从项目基础布局开始的我们开发之旅！

