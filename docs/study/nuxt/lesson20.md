大家好，我是村长！

本节课主要关注服务端开发相关知识，这主要是为接下来的项目篇做准备。

Nuxt
是全栈框架，给我们准备了丰富的服务端开发特性，旨在让大家能够通过一套方案就能完成全栈开发任务。但是有不少小伙伴是纯前端出身，对服务端一些知识有欠缺，例如数据库、接口设计开发等不是很熟悉，所以，我们本节课计划完成如下学习任务：

  * 掌握 MySQL 数据库开发和设计基础；
  * 掌握基于 APIFox 的接口设计流程和方法；
  * 掌握 Node.js ORM 方案 Prisma。

下面，我们先从数据库环境准备开始，将会包括如下内容：

  * 数据库分类和选择；

  * 安装数据库和管理工具。

## 数据库分类和选择

在当今的互联网中，最常见的数据库模型主要是两种，即 **关系型数据库** 和 **非关系型数据库：**

  * 关系型数据库模型是把复杂的数据结构归结为简单的二元关系（即二维表格形式）。在关系型数据库中，对数据的操作几乎全部建立在一个或多个关系表格上，通过对这些关联的表格分类、合并、连接或选取等运算来实现数据库的管理。

  * NoSQL，泛指非关系型的数据库。随着互联网 Web2.0 网站的兴起，传统的关系数据库在应付 Web2.0 网站，特别是超大规模和高并发的 SNS 类型的 Web2.0 纯动态网站已经显得力不从心，暴露了很多难以克服的问题。

而非关系型的数据库则由于其本身的特点得到了非常迅速的发展。NoSQL
数据库在特定的场景下可以发挥出难以想象的高效率和高性能，它是作为对传统关系型数据库的一个有效的补充。

这两类数据库的代表就是 **MySQL** 和 **MongoDB** ，那么如何做选择？

作为文档数据库，由于 MongoDB 并不限制用户存储数据的体量和类型，因此适合大数据的应用环境。这对基于云的服务特别有利。

而得益于 MongoDB
的水平可扩展能力，以及与云服务的敏捷性结合，它不但能够减少开发者的工作量，简化业务与项目的扩展流程，还能够提供高可用性和数据的快速恢复。

不过，MongoDB 在数据可靠性、一致性以及安全性等方面，不如 MySQL。此外，当应用程序需要提供多行事务(比如会计和银行系统)时，以 MySQL
为首的关系型数据库提供了高事务处理率。与 MySQL 专注于提供事务的 ACID 和安全性不同的是，MongoDB 更专注于提供高插入率。

因此，我强烈建议大家将 MySQL 用于具有固定数据模式，且不打算在数据的多样性方面进行扩展的项目。因为在确保数据完整性和可靠性的同时，MySQL
不但方便维护，而且成本较低。

相反，MongoDB
是那些正在成长，但数据架构并不固定的业务或项目的最合适选择。因为它允许开发者在无需任何结构的情况下，自由地更新、检索和存储文档，因此它通常适用于内容管理、物联网处理，以及实时分析等项目。

## 安装数据库和管理工具

利用 docker 安装数据库和管理工具是最简单快捷的方式，而且还可以以同样的方式在服务器上安装。因此我这里用 docker 方式搭建 MySQL
开发环境。

### 安装 docker

首先去[官网](https://www.docker.com/)下载并安装 Docker Desktop，下载适合自己的版本，比如我下载的是 Mac 版：

![](img\20\1.image)

启动 Docker Desktop：

![](img\20\2.image)

### 通过 docker-compose 安装 MySQL 和 Adminer

Docker 安装好之后，就可以找到合适的镜像安装所需软件，我们这里准备安装 MySQL 数据库和管理端 Adminer。

首先，我们在项目根目录下创建一个 `docker-compose.yml` 文件，并粘贴如下内容：

    
    
    version: '3.7'
    services:
      mysql_db_container:
        image: mysql:latest
        command: --default-authentication-plugin=mysql_native_password
        environment:
          MYSQL_ROOT_PASSWORD: rootpassword  # root账号密码
        ports:
          - 3306:3306
        volumes:
          - mysql_db_data_container:/var/lib/mysql
      adminer_container:
        image: adminer:latest
        environment:
          ADMINER_DEFAULT_SERVER: mysql_db_container
        ports:
          - 8080:8080
    
    volumes:
      mysql_db_data_container:
    

然后使用 docker-compose 命令拉取镜像，在命令行输入如下命令：

    
    
    docker compose up -d
    

执行结束，效果如下：

![](img\20\3.image)

现在再看一下 Docker Desktop 的运行状态，MySQL 和 Adminer 顺利启动了：

![](img\20\4.image)

## 使用 Adminer

下面就可以通过 Adminer
管理数据库了，浏览器中输入：[http://localhost:8080，](http://localhost:8080%EF%BC%8C)

这里用户名输入：root，密码输入：rootpassword（如果修改了，就输入修改过的密码），效果如下：

![](img\20\5.image)

> 注意如果端口不合适，可以在 docker-compose.yml 中修改 `ports`

点击登录，应该能看到下面的管理界面：

![](img\20\6.image)

## 总结

好了，关于数据库开发环境的准备工作就给大家讲到这里。有了 docker 的加持，这些工具的安装配置跟之前比起来变得非常简单。如果大家有更偏爱的管理工具，例如
Navicat 等等，可以不用拉取 Adminer 镜像，单独安装客户端。

## 下次预告

下一节，我们将使用 Adminer 进行用户管理、数据库创建、数据库表设计等管理任务，帮助大家掌握数据库相关的基础知识，为后续项目开发做准备。

