---
# 这一段可以省略，因为默认布局就是doc
layout: doc

# title定义浏览器标签页上显示的标题
title: CSS学习笔记-Background
---
<div class="title-wrapper">
   <div class="page-title">background 的 8 种核心技巧</div>
   <div class="post-title">—— CSS学习笔记
      <span class="lastModifyTime">
          <i class="fa-regular fa-clock"></i> 最后更新： 1 天前
      </span>
   </div>
</div>

## 基础

- 纯色背景：`background: #000;`
- 线性渐变：`background: linear-gradient(#fff, #000);`
- 径向渐变：`background: radial-gradient(#fff, #000);`
- 角向渐变：`background: conic-gradient(#fff, #000);`

**对于 background，我们需要注意以下几点。**

 - background 不仅仅用于展示图片，或者是展示单个颜色，它的渐变部分语法，才是整个 background 的核心。
 - background 是支持多重渐变的叠加的，这一点非常重要，它不仅仅只能是单个的线性渐变或者单个的径向渐变，是可以将它们组合在一起使用的。
 - 复杂场景下，灵活使用 `repeating-linear-gradeint（repeating-radial-gradeint）`，它能减少很多代码量。
 - CSS 中存在一种透明色`transparent` ，在渐变中，学会使用透明色非常重要。


## `linear-gradient` 线性渐变

`linear-gradient`为线性渐变，最常见的就是一种颜色到另一种颜色的变化

```css
{
    background: linear-gradient(#fff, #000);
}
```

### 技巧一：渐变色可以是透明的(transprant)

改造一下上面的代码：
  
```css
{
    background: linear-gradient(transparent, #000);
}
```

<mark>**实用案例**</mark>

当我们需要实现下图这样一种遮罩效果的时候，就可以使用从白色到透明色的渐变，通过叠加在元素上方的方式，实现该效果。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72705e06aa19457ea9d122c39ddf82fa~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

```html
<div class="g-container">
  <ul>
    <li>Button</li>
    <li>Button</li>
    <li>Button</li>
    <li>Button</li>
    <li>Button</li>
    <li>Button</li>
  </ul>
</div>

```

```scss
.g-container {
    ...
    
    &::before {
        content: "";
        position: absolute;
        right: 0;
        bottom: 0;
        top: 0;
        width: 100px;
        background: linear-gradient(90deg, transparent, #fff);
    }
}

```
这样，我们就可以轻松实现这样的效果：
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/08f1c8f17c0f45468758dc59852c758c~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

这里的核心在于，透明色或者带透明度的颜色有助于展示出元素下方的内容，当看到一些渐变消失、递进消失的 UI 时，就可以考虑是否能够利用到带透明的渐变效果来实现。

**完整代码你可以戳这里：[https://code.juejin.cn/pen/7246958007114792995](https://code.juejin.cn/pen/7246958007114792995)**



### 技巧二：渐变可以是从一种颜色直接到另外一种颜色

渐变不仅可以是渐变过渡，也可以是实色过渡，也就是一个颜色直接过渡到第二种颜色。

```css
{
    border: 2px solid #000;
    background: linear-gradient(#fff 0%, #fff 50%, #f00 50%, #f00 100%);
}
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44284950e3ae457b80c6a1759f6763ae~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

这里设置了前50%的渐变色为白色，后50%的渐变色为红色，这样就可以实现从白色到红色的过渡。
同时，利用这个技巧，可以做的事情就非常多了。譬如利用渐变实现一个三角形图形，我们可以给上述渐变效果增加一个 45° 的角度，并且结合技巧一，将其中一种颜色设置为透明：

```css
{
    background: linear-gradient(45deg, transparent 50%, #f00 50%);
}
```

这样我们就得到了一个三角形的图形：
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7ad15c3bc3c468d9477ae34ed308fdb~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)


### 技巧三：渐变是可以叠加多层的

基于上述的利用渐变实现三角形这个技巧继续，如果我们再一个图形的四个角，都利用上这个技巧呢？

这里就可以引入渐变的第三个技巧：**渐变是可以叠加多层的**

在同一个div实现叠加4层线性渐变：

```css
.notching{
    width: 200px;
    height: 100px;
    background: linear-gradient(135deg, transparent 15px, red 0),linear-gradient(-135deg, transparent 15px, red 0),linear-gradient(45deg, transparent 15px, red 0),linear-gradient(-45deg, transparent 15px, red 0);
    background-size: 50% 50%, 50% 50%, 50% 50%, 50% 50%;
    background-repeat: no-repeat;
    background-position: left top, right top, left bottom, right bottom;
}
```
这样我们就能得到一个内切角的图形：
![](https://ethanwp.oss-cn-shenzhen.aliyuncs.com/ethanwp/notching.png)

这样的语法看似很复杂，其实很好理解，我们可以把它拆分成四个部分来看：

![](https://ethanwp.oss-cn-shenzhen.aliyuncs.com/ethanwp/notching_step.png)

1号区域对应的代码是：

```css
.notching{
    background: linear-gradient(135deg, transparent 15px, red 0);
    background-size: 50% 50%;
    background-repeat: no-repeat;
    background-position: left top;
}
```
由这些部分组成了左上角的第一部分的渐变，以此类推，第二组第三组第四组的代码也是类似的。同时，当一些属性完全相同时，我们可以省略使用简写，比如：`background-size: 50% 50%, 50% 50%, 50% 50%, 50% 50%;`，由于每一组渐变的大小都是一样的，所以可以简写为：`background-size: 50% 50%;`。


### 技巧四： 利用repeating-linear-gradient节省代码

有的时候，我们需要用到不断重复的渐变。这个时候，除了`background-repeat: repeat;`之外，还可以利用`repeating-linear-gradient`来实现。

<mark>常见于实现进度条装的图形</mark>

```css
.progress{
    width: 200px;
    height: 20px;
    background: repeating-linear-gradient(90deg, #f00, #f00 11px transparent 11px transparent 20px);
}
```
效果如下：
![](https://ethanwp.oss-cn-shenzhen.aliyuncs.com/ethanwp/repeat.png)

如果不是`repeating-linear-gradient`，它会是什么形状

```css
.progress{
    width: 200px;
    height: 20px;
    background: linear-gradient(90deg, #f00, #f00 11px transparent 11px transparent 20px);
}
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a3588ab21ed4b10b3389b17ddfbafb8~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

`repeat-linear-gradient`做了什么事情呢？其实是按照每 11px 绘制一段 `#f00` ，每 9px 安排一段`transparent`

如果只用`linear-gradient`要实现上面的效果，我们需要重复的写很多段代码，而`repeating-linear-gradient`可以帮我们节省很多代码。

通过线性渐变我们可以得到CSS渐变的几个特点，简单总结一下：
1. 渐变的颜色可以是透明色。
2. 渐变可以是一种颜色直接到另外一种颜色，不需要有过渡状态。
3. 渐变是可以叠加多层的。
4. 利用`repeating-linear-gradient`可以节省很多代码，实现片段的重复。


## `radial-gradient` 径向渐变

好，接下来我们讲讲 `radial-gradient` 径向渐变，其实上述 4 个技巧放在径向渐变也是适用的，所以，这里我们讲一些不同的。


### 技巧五：预留衔接空间消除渐变产生的锯齿

在使用渐变生成不同颜色的直接过渡时，非常容易就会产生锯齿效果。

看下面这一种场景：

```css
.radial{
    width: 400px;
    height: 400px;
    background: radial-gradient(#9c27b0 0%, #9c27b0 47%, #ffeb3b 47%, #ffeb3b 100%);
}
```
使用`radial-gradient(#9c27b0 0%, #9c27b0 47%, #ffeb3b 47%, #ffeb3b 100%)`生成的一个图形，从一种颜色直接到另一种颜色，没有过渡状态，这样就会在衔接处产生锯齿效果。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df1cf335ccb5491f8e27cc2590e00f45~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

遇到此类问题的解决方案是：在衔接处，适当的留出一些渐变空间。我们简单改造一下上述代码：

```css
div {
    width: 400px;
    height: 400px;
    background: radial-gradient(#9c27b0 0%, #9c27b0 47%, #ffeb3b 47.3%, #ffeb3b 100%);
}
```

仔细看代码，将从47%到47%的一个变化，改成了从47%到47.3%的一个变化，这样就会在衔接处留出一些空间，从而消除锯齿，实际改变后的效果：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8515a06773204962a72e14280e7d6272~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

**完整代码你可以戳这里：[https://code.juejin.cn/pen/7248826615159849017](https://code.juejin.cn/pen/7248826615159849017)**

### 技巧六：利用多层渐变组合图形

<mark>这是渐变中比较耗费脑力的一个技巧</mark>

上面我们讲了，渐变可以叠加多层，那么，除了利用多层渐变图形，实现所需图形的各个部分，拼接成完整的图形。也可以在此基础上，利用它们的重叠效果，叠加出我们要的图形。（差异点在于多层渐变图层之间，是否有重叠关系。）

此技巧多用于实现优惠券边框。

在 CSS 中，想要实现波浪效果，波浪边框是比较复杂的。其中，利用多层径向渐变叠加，是一种方法。假设我们想使用 CSS 实现如下造型：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f10d7302a69748e6ad629901c90179e6~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

难点就在于，右侧的波浪边框的实现，这里，其实运用的是两层径向渐变的叠加实现。如何叠加实现波浪边框呢？看看代码：

```less
body{
  background-color: #ccc;
  position: relative;
  width: 100vw;
  height: 100vh;
  &:after, &:before{
    position: absolute;
    content:"";
    top: 0;
    left: 0;
    right: 0;
  }
  &:after{
    height: 10px;
    background-image: radial-gradient(circle at 10px -5px, transparent 12px, #fff 13px, #fff 20px);
    background-size: 20px 20px;
    top: 40px;
  }
  &:before{
    height: 15px;
    top: 35px;
    background-image: radial-gradient(circle at 10px 15px, white 12px, transparent 13px);
    background-size: 40px 20px;
  }
}

```
gif示意图

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f64d38380f6944e18a76fa93d267b2c6~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)
