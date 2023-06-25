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


## linear-gradient 线性渐变

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
