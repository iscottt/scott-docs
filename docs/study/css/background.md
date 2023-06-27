---
# 这一段可以省略，因为默认布局就是doc
layout: doc

# title定义浏览器标签页上显示的标题
title: CSS学习笔记-Background
---
<div class="title-wrapper">
   <div class="page-title">background 的核心技巧</div>
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

利用这个技巧，我们还可以实现波浪下划线：
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32b1972c8b8a4115b56c2dc13628180b~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

相较于使用`text-decoration`实现的下划线而言，使用渐变实现的优势是它的下划线可以再添加上动画，像是这样：
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8f4a914c1864d9db2fb3406d0b2e602~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)
这里利用的是`background-position`的变化，实现的 hover 效果。代码如下：
```less

.flow-wave{
  display: block;
  background-image: 
    radial-gradient(circle at 10px -7px, transparent 8px, red 8px, red 9px, transparent 9px),
    radial-gradient(circle at 10px 27px, transparent 8px, red 8px, red 9px, transparent 9px);
  background-size: 20px 20px;
  background-position: -10px calc(100% + 18px), 0 calc(100% - 2px);
  background-repeat: repeat-x;
  padding: 20px;
  &:hover{
    animation: wave 1s infinite linear;
  }
}

@keyframes wave{
  from {
    background-position-x: -10px , 0;
  }
  to {
    background-position-x: -30px , -20px;
  }
}
```

**完整代码戳这里：[https://code.juejin.cn/pen/7248979743234588684](https://code.juejin.cn/pen/7248979743234588684)**

总结一下，这里我们又得到了两个技巧：

1. 预留衔接空间消除渐变产生的锯齿；
2. 利用多层渐变的组合，重叠在一起拼出想要的图形。

## `conic-gradient` 角向渐变（圆锥渐变）

接下来，我们再聊聊比较晚进入大家视野的 conci-gradient 角向渐变，在更早之前，它也被翻译成圆锥渐变。
看看它最简单的 API：
```css
{
    background: conic-gradient(deeppink, yellowgreen);
}
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/feb923df74134bc1ad33e3513c0a0881~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

那么它和另外两个渐变的区别在哪里呢？

 - `linear-gradient`线性渐变的方向是一条直线，可以是任何角度。
 - `radial-gradient`径向渐变是从圆心点以椭圆形状向外扩散。

而角向渐变从`渐变的圆心`、`渐变起始角度`以及`渐变方向上`来说，是这样的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9af0b09aabe1476aa37b14d11dc16f36~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

这里要划重点啦！从图中可以看到，角向渐变的起始圆心点、起始角度和渐变方向为：

- 起始点是图形中心；
- 默认渐变角度 0deg 是从上方垂直于圆心的；
- 渐变方向以顺时针方向绕中心实现。

当然，我们也可以控制角向渐变的`起始角度`以及`角向渐变的圆心`。稍微改一下上述代码：

```css
{
  background: conic-gradient(from 270deg at 50px 50px, deeppink, yellowgreen);
}
```
效果如下：
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b58dd65a19624a11b2c8e29d0f67b97c~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

我们改变了`起始角度`以及`角向渐变的圆心`：通过 `from 270deg at 50px 50px`，我们设定了角向渐变的圆心为图案的`50px 50px`处，设定了初始角度为`270deg`。

当然，上述的 6 个技巧对于角向渐变而言，也是一样适用的。在继续讨论渐变的技巧之前，由于大部分同学对角向渐变还比较陌生，因此这里我们再好好学习学习角向渐变的一些特性。

### 使用`conic-gradient`实现颜色表盘

从上面了解了`conic-gradient`最简单的用法，我们使用它实现一个最简单的颜色表盘。

`conic-gradient`不仅仅只是从一种颜色渐变到另一种颜色，与另外两个渐变一样，可以实现多颜色的过渡渐变。

由此，想到了彩虹，我们可以依次列出`赤橙黄绿青蓝紫`七种颜色：`conic-gradient: (red, orange, yellow, green, teal, blue, purple)`。

上面表示，在角向渐变的过程中，颜色从设定的第一个`red`开始，渐变到`orange`，再到`yellow`，一直到最后设定的`purple`。并且每一个区间是等分的。

我们再给加上`border-radius:50%`，假设我们的 CSS 如下：

```css
{
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: conic-gradient(red, orange, yellow, green, teal, blue, purple);
}
```

看看效果：
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ea913134d0847a08d0723314156173a~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

Wow，已经有了初步形状了。但是，总感觉哪里不大自然。

问题出在哪里呢？一是颜色不够丰富不够明亮，二是起始处与结尾处衔接不够自然。再稍微调整一下。

我们知道，表示颜色的方法，除了`rgb()`颜色表示法之外，还有`hsl()`表示法。

::: tip 提示
hsl() 被定义为色相-饱和度-明度（Hue-Saturation-Lightness）。
:::

 - 色相（H）是色彩的基本属性，就是平常所说的颜色名称，如红色、黄色等。
 - 饱和度（S）是指色彩的纯度，越高色彩越纯，低则逐渐变灰，取 0~100% 的数值。
 - 明度（V），亮度（L），取 0～100%。

这里，我们通过改变色相得到一个较为明亮完整的颜色色系。

也就是采用这样一个过渡 `hsl(0%, 100%, 50%)` --> `hsl(100%, 100%, 50%)`，中间只改变色相，生成 20 个过渡状态。借助 SCSS ，CSS 语法如下：

```scss
$colors: ();
$totalStops:20;

@for $i from 0 through $totalStops{
    $colors: append($colors, hsl($i *(360deg/$totalStops), 100%, 50%), comma);
}

.colors {
    width: 200px;
    height: 200px;
    background: conic-gradient($colors);
    border-radius: 50%;
}
```
得到如下效果图，这次的效果很好：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/21ed1427c8e54322916fb8889542f057~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)


### 角向渐变配合百分比使用

当然，我们可以更加具体地指定角向渐变每一段的比例，**配合百分比**，可以很轻松地实现饼图。

假设我们有如下 CSS：

```css
{
    width: 200px;
    height: 200px;
    background: conic-gradient(deeppink 0, deeppink 30%, yellowgreen 30%, yellowgreen 70%, teal 70%, teal 100%);
    border-radius: 50%;
}
```

上图，我们分别指定了 0~30%、30%~70%、70%~100% 三个区间的颜色分别为 `deeppink（深红）`、`yellowgreen（黄绿`） 以及 `teal（青）` ，可以得到如下饼图：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4ab0b7cdb09437cbfabd1296416ccd7~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)
当然，上面只是百分比的第一种写法，还有另一种写法也能实现：

```css
{
    background: conic-gradient(deeppink 0 30%, yellowgreen 0 70%, teal 0 100%);
}
```
这里表示：

1. 0～30% 的区间使用 `deeppink`；
2. 30%～70% 的区间使用 `yellowgreen`；
3. 70%～100% 的区间使用 `teal`。

而且，先定义的颜色的层叠在后定义的颜色之上。

### 角向渐变配合`background-size`使用

使用了百分比控制了区间，再配合使用`background-size`就可以实现各种贴图啦。

我们首先实现一个基础角向渐变图形，如下：

```css
{
    width: 250px;
    height: 250px;
    margin: 50px auto;
    background: conic-gradient(#000 12.5%, #fff 0 37.5%, #000 0 62.5%, #fff 0 87.5%, #000 0);
}
```
效果图：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd3d3167310e40929c025e6b4a91999f~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

再加上 `background-size: 50px 50px;`也就是：
```css
{
    width: 250px;
    height: 250px;
    margin: 50px auto;
    background: conic-gradient(#000 12.5%, #fff 0 37.5%, #000 0 62.5%, #fff 0 87.5%, #000 0);
    background-size: 50px 50px;
}
```
得到：
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1017366f1ab84792afad7f45685915d0~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

### 重复角向渐变`repeating-conic-gradient`

与线性渐变及径向渐变一样，角向渐变也是存在重复角向渐变`repaet-conic-gradient`的。

我们假设希望不断重复的片段是 0~30° 的一个片段，它的 CSS 代码是`conic-gradient(deeppink 0 15deg, yellowgreen 0 30deg)`。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d4f62b439754eba879d4cd070fea1cf~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

那么，使用了`repeating-conic-gradient`之后，会自动填充满整个区域，CSS 代码如下：

```css
{
    width: 200px;
    height: 200px;
    background: repeating-conic-gradient(deeppink 0 15deg, yellowgreen 0 30deg);
    border: 1px solid #000;
}
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f663c47cd4424592a6347bd97adbac8d~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

### 技巧七：利用角向渐变 repeat 配合 position 完成特殊图案

好，我们回归渐变的技巧。上面我们有利用角向渐变，实现这样一个图形：

```css
{
    background: conic-gradient(from 270deg at 50px 50px, deeppink, yellowgreen);
}
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/358c0dcd17334ec3a72cb3c52e8db377~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

简单改造一下
```css
div {
    margin: auto;
    width: 200px;
    height: 200px;
    background: conic-gradient(from 270deg at 50px 50px, deeppink 0%, deeppink 90deg, transparent 90deg, transparent 
 360deg);
    border: 1px solid #000;
}
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dfa8896013ad44c78e3e8a1f0e4a853e~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

起始角度以及角向渐变的圆心没有改变，但是只让前`90deg`的图形为粉色，而后`270deg`的图形，设置为了透明色。

我们利用角向渐变，在图像内部，又实现了一个小的矩形！

接下来，我们再给上述图形，增加一个`background-position: -25px, -25px;`

```css
div {
    margin: auto;
    width: 200px;
    height: 200px;
    background: conic-gradient(from 270deg at 50px 50px, deeppink 0%, deeppink 90deg, transparent 90deg, transparent 
 360deg);
    background-position: -25px -25px;
    border: 1px solid #000;
}
```
这样，我们就神奇地得到了这样一个图形：
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c16161ea98a74076919289cb51c09d26~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

为什么会有这样一种现象？如果我们在代码中加入`background-repeat: no-repeat;`，那么就会只剩下左上角的一个小正方形

因此，这里实际上利用了渐变图形默认会 repeat 的特性，去掉 background-repeat: no-repeat 实际上是这么个意思：

![](https://ethanwp.oss-cn-shenzhen.aliyuncs.com/ethanwp/conic_repeat.webp)

理解了这张图，也就理解了这个技巧的核心所在！

利用渐变图案默认 repeat 的特性，配合`background-position`对图形进行一个位移，使其可以在图形的其他侧边出现，以完成特殊图案！

## 总结

1. 渐变的颜色可以是透明色。
2. 渐变可以是从一种颜色直接到另外一种颜色，不需要有过渡状态。
3. 渐变是可以叠加多层的。
4. 利用 repeating-linear-gradient 节省代码，实现片段的重复。
5. 预留衔接空间消除渐变产生的锯齿。
6. 利用多层渐变的组合，重叠在一起拼出想要的图形。
7. 利用角向渐变 Repeat 配合 position 完成特殊图案。
8. 利用小单位实现造型迥异的图案。
