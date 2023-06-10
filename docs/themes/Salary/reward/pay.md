---
# 这一段可以省略，因为默认布局就是doc
layout: doc

# title定义浏览器标签页上显示的标题
title: Salary-开通支付接口
---
<div class="title-wrapper">
   <div class="page-title">开通支付接口</div>
   <div class="post-title">—— Salary使用手册 · 使用打赏送礼品功能 
      <span class="lastModifyTime">
          <i class="fa-regular fa-clock"></i> 最后更新： 1 天前
      </span>
   </div>
</div>


<mark>教程源自互联网，经实践可用。编写时版本与当下有出入，请根据实际情况调整</mark>

**网站接入支付功能流程：** 首先你支付宝要有开通当面付这个功能，然后获取配置相关秘钥，最后拿到网站或则其他需要支付功能的地方使用。

# 第一步：申请当面付接口

1. 支付宝当面付申请地址

当面付入口：[https://b.alipay.com/signing/productSetV2.htm](https://b.alipay.com/signing/productSetV2.htm)，打开支付宝账号，登录自己的支付号账号，点击产品中心——>当面付。

![ss](https://docs.panda-studio.cn:8282/images/20230530110507_20210718220756_482604.jpg)
![ss](https://docs.panda-studio.cn:8282/images/20230530110517_1615785643-b3f7ba9b421a662.png)
![ss](https://docs.panda-studio.cn:8282/images/20230530110517_1615785643-b3f7ba9b421a662.png)

按下图示选择类别：

![ss](https://docs.panda-studio.cn:8282/images/20230530110546_20210718220858_292741.png)

::: tip 提示

类目选择生活百货（不建议选择金融网络），营业执照是非必填项，可以不上传，上传门头，可以利用搜索引擎或者大众点评，联系方式，（据说可以随便输入，建议输入真实的
:::

2. 确认提交后等待审核！客服工作时间（9:00-19:00）

![提交成功](https://docs.panda-studio.cn:8282/images/20230530110706_20210718220926_167314.png)

3. 通过之后继续下一步，点击进入开放平台

![](https://docs.panda-studio.cn:8282/images/20230530110840_20210718220945_069501.png)

4. 进入到我的开放平台之后，点击导航栏的开发中心，选择开发者接入，选择网页&移动应用

![](https://docs.panda-studio.cn:8282/images/20230530110903_20220828162909-1024x314.jpg)
![](https://docs.panda-studio.cn:8282/images/20230530110934_20210718221054_064849-1024x455.png)
![](https://docs.panda-studio.cn:8282/images/20230530110950_20210718221116_303617.png)
![](https://docs.panda-studio.cn:8282/images/20230530111011_20220828162403-1024x747.jpg)

# 第二步：应用 ID&支付宝公钥的获取方法

1. 进入支付宝开放平台控制台：[https://openhome.alipay.com/platform/keyManage.htm](https://openhome.alipay.com/platform/keyManage.htm)
2. 商户 APPID：进入之后把 APPID：后面的数字记录下来
3. 应用公钥：然后点击`接口加签方式`后面的`查看/设置`打开之后复制`应用公钥`
4. 把上面的 `APPID` 和应用公钥记录下来备用

![](https://docs.panda-studio.cn:8282/images/20230530111217_20220822124046-1024x376.jpg)
![](https://docs.panda-studio.cn:8282/images/20230530111230_20220822123540.jpg)

# 第三步：获取商户私钥即密钥

1. 打开支付宝开放平台开发文档地址：https://opendocs.alipay.com/common/02kipk

![](https://docs.panda-studio.cn:8282/images/20230530111318_20220822123549.jpg)
![](https://docs.panda-studio.cn:8282/images/20230530111332_20220822123556.jpg)

自己是什么电脑就下载什么版本

2. 打开软件之后先登入

![](https://docs.panda-studio.cn:8282/images/20230530111403_20220822123605.jpg)

3. 然后点击生成秘钥

![](https://docs.panda-studio.cn:8282/images/20230530111425_20220822123624.jpg)

4. 软件生成秘钥之后，点击复制公钥，复制好之后再点击上传公钥，如下图

![](https://docs.panda-studio.cn:8282/images/20230530111447_20220822123637.jpg)

5. 点击上传公钥之后会自动进入支付宝开发秘钥控制台

6. 然后点击`接口加签方式`后面的`查看/设置`选择`加签变更`

7. 最后把你刚才在软件里面复制的`应用公钥`填入进去，保存即可

![](https://docs.panda-studio.cn:8282/images/20230530111539_20220822123655.jpg)

# 完成

至此，你的当面付接口就全部弄好了，填入对应的网站对接后台即可

1. 应用 APPID：2022xxxxxx
3. 应用公钥：为你软件生成的`应用公钥`
4. 商户私钥：为你软件中生成的`应用私钥`
