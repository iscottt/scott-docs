---
# 这一段可以省略，因为默认布局就是doc
layout: doc

# title定义浏览器标签页上显示的标题
title: Somnia-开通支付接口
---
<div class="title-wrapper">
   <div class="page-title">开通支付接口</div>
   <div class="post-title">—— Somnia使用手册 · 使用打赏送礼品功能 
      <span class="lastModifyTime">
          <i class="fa-regular fa-clock"></i> 最后更新： 2024-09-07 11:27:53
      </span>
   </div>
</div>


**网站接入支付功能流程：** 首先你支付宝要有开通当面付这个功能，然后获取配置相关秘钥，最后拿到网站或则其他需要支付功能的地方使用。

<mark>注意：选公钥时一定要选支付宝公钥！支付宝公钥！支付宝公钥！</mark>

## 申请当面付接口

- 支付宝当面付申请地址
- APPID在左边！在左边！在左边！
- 其他没用到的请不要填写以免出现BUG

![](../../../assets//imgs/tip.jpeg)

### 打开[支付宝开放平台](https://open.alipay.com/)并登录

![](../../../assets//imgs/step-1.jpeg)

### 点击开发者中心

![](../../../assets//imgs/step-2.jpeg)

### 选择网页&移动应用后点创建应用，选择应用类型选的是支付接入

![](../../../assets//imgs/step-3.jpeg)

接下来随便填即可

::: tip 提示

类目选择生活百货（不建议选择金融网络），营业执照是非必填项，可以不上传，上传门头，可以利用搜索引擎或者大众点评，联系方式，（据说可以随便输入，建议输入真实的
:::

**选择你创建的应用选择当面付并签约，审核很快一般也就2-3分钟。（签约需要提供营业执照照片以及门店招牌/门店照片随便在网上照一张就可以了）**

![](../../../assets//imgs/step-4.jpeg)

### 设置接口加签方式（也就是支付密钥和公钥）

首先，我们先下载支付宝开发工具并安装：

1. 安装后打开开发工具并选择生成密钥。（如图所示）

![](../../../assets//imgs/step-5.jpeg)

2. 生成好的密钥

生成密钥后，就可以在应用的开发配置页面进行配置。点击 设置 后，复制上一步生成的公钥，点击 保存设置，即可完成公钥的设置，如下图所示。



::: warning 注意

一定要选下面的公钥
:::

![](https://oss.zibll.com/zibll.com/2020/04/2f14ebc265a6-1.png)

## 完成

至此，你的当面付接口就全部弄好了，填入对应的网站对接后台即可

1. 应用 APPID：2022xxxxxx
3. 应用公钥：为你软件生成的`应用公钥`
4. 商户私钥：为你软件中生成的`应用私钥`
