大家好，我是村长！

非常高兴大家跟我一起走到这里，眼看就要大功告成了，我们撒花庆祝一下！

本讲我们将项目部署上线，涉及以下内容：

  * docker 镜像制作；

  * docker-compose 编排镜像；

  * 本地部署测试；

  * 部署到华为云；

  * Nginx 反代。

## 整体架构

我们将制作一个 Docker 镜像把 Nuxt 作为 Web 服务一部分封装起来，然后和原先开发环境中的 MySQL 和 adminer 编排在一起。

然后我们连接服务器，克隆项目之后启动 docker-compose。

最后配置 Nginx 对外暴露服务。

![](img\33\1.image)

## 制作 Docker 镜像

首先制作一个 Docker 镜像，提供 Node 环境，安装依赖，启动 Nuxt 服务。

Dockerfile：

    
    
    #Dockerfile
    #制定node镜像的版本
    FROM node:18-alpine
    #移动当前目录下面的文件到app目录下
    ADD . /app/
    #进入到app目录下面，类似cd
    WORKDIR /app
    #安装依赖
    RUN npm config set registry https://registry.npm.taobao.org/ && \    
        npm i
    #对外暴露的端口
    EXPOSE 3000
    #程序启动脚本
    CMD ["npm", "start"]
    

添加一个 start 命令，package.json

    
    
      "scripts": {
        "start": "nuxt start",
      }
    

## 制作 Docker-Compose 编排

引入前面制作的镜像，同时还要编排启动顺序，保证数据库最先启动，然后才是 adminer 和 Nuxt 项目。

    
    
    version: '3.7'
    services:
      mysql_db_container:
        image: mysql:latest
        command: --default-authentication-plugin=mysql_native_password
        environment:
          MYSQL_ROOT_PASSWORD: rootpassword # root账号密码
          #MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD} # root账号密码
        ports:
          - 3306:3306
        volumes:
          - mysql_db_data_container:/var/lib/mysql
        healthcheck:
          test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
          interval: 30s
          timeout: 10s
          retries: 5
      adminer_container:
        image: adminer:latest
        environment:
          ADMINER_DEFAULT_SERVER: mysql_db_container
        ports:
          - 8080:8080
      nuxt_app_container:
        container_name: nuxt_app
        restart: always
        #构建容器
        build:
          context: .
          # 自动输入Y防止造成编译卡死
          args:
            - "-y"
        ports:
          - "3004:3000"
        environment:
          DATABASE_URL: mysql://root:rootpassword@mysql_db_container:3306/ycxt
          NUXT_BASE_URL: https://jsonplaceholder.typicode.com
          JSON_SECRET: thisisjsonsecret
        command: >
          /bin/sh -c 'npm run migrate && npm run build && npm start'
        depends_on:
          mysql_db_container:
            condition: service_healthy
    volumes:
      mysql_db_data_container:
    

## 在开发机测试

本机先测试一下：

    
    
    # 后台启动
    docker-compose up -d
    
    # 如果之前本地曾执行过，那么执行下面强制容器刷新
    docker-compose up -d --force-recreate --build
    

如果你和我一样遇到了以下错误：

>
>     ------
>      > [internal] load metadata for docker.io/library/node:18-alpine:
>     ------
>     failed to solve: rpc error: code = Unknown desc = failed to solve with
> frontend dockerfile.v0: failed to create LLB definition: unexpected status
> code [manifests 18-alpine]: 403 Forbidden
>  

请执行以下命令手动安装 node:18-alpine，然后再执行

>
>     docker pull node:18-alpine
>  

## 部署到华为云

接下来连接华为云，克隆项目，启动 Docker 镜像。

    
    
    # 登录华为云
    # 需要提前设置好秘钥
    ssh root@123.249.115.108
    
    # 克隆项目代码
    cd source
    git clone git@github.com:57code/nuxt-app.git
    
    # 进入项目目录
    cd nuxt-app
    
    # 启动docker
    docker-compose up -d
    

如果创建过，则先停止 docker-compose 并删除目录：

>
>     # 删除目录
>     cd source/nuxt-app
>     docker-compose down
>     cd ..
>     rm -rf nuxt-app
>  

## 开放端口

如果你的服务器没有任何 Web 服务，则可以使用 80 端口（替换截图中的 3004 为 80），从而避免下面的开放端口操作：

![](img\33\2.image)

前面我对外暴露端口号是 3004，原因是服务器已经有 3 个应用占据了 3000~3003。所以如果我现在想要访问，就需要登上云服务商控制台开放 3004
端口（一般在 ECS 安全组配置），之后再用 IP + 端口访问：

    
    
    http://123.249.115.108:3004
    

## Nginx 配置反向代理

显然大家不想这样访问，因此我们再配置一下 Nginx，如果你还没装，则需要安装一下，不会的话可以百度。这里配置 Nginx 主要目标有两个：

  * 配置一个域名避免输入IP；

  * 代理到 3004 避免开放 3004 端口。

域名解析也需要去云服务商控制台配置，如果你没有域名可以直接使用 IP 地址。

下面是服务器上的 Nginx 配置目录：/etc/nginx/sites-enabled/nuxt，可以用 vi 编辑如下内容：

    
    
    server {
        listen 80;
        server_name nuxt3.cn;
        location / {
                proxy_pass  http://localhost:3004/;
                proxy_redirect     off;
                proxy_set_header   Host             $host;
                proxy_set_header   X-Real-IP        $remote_addr;
                proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
        }
    }
    

重新加载以使 Nginx 配置生效：

    
    
    # 测试配置文件是否正确
    nginx -t 
    
    # 重启nginx服务
    nginx -s reload
    

