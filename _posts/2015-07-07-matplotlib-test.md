---
layout: post
title: Python-Matplotlib专业绘图
description: Matplotlib的绘图实践
categories: 技术
tags: Python
---

![face]({{ site.url }}/images/2015-07-07/allkinds.png)

最近写论文需要处理一些数据并绘图，首先想到的是MATLAB，但是MATLAB感觉太重了，而且是个商业软件于是自然就想到了Python。曾经看到过Matplotlib的强大，所以也来实践一下。

### 一 pylab
Matplotlib主要有两种用法，实际的效果都是一样的，但是应用场景不一样。第一种便是pylab，主要应用于IPython这样的终端，可以像使用MATLAB一样使用Matplotlib。

下面是一个简单的例子：

```python
# -*- coding: utf-8 -*-
from pylab import *

#绘图窗口
figure(figsize=(10,6), dpi=80)
subplot(1,1,1)

#产生数据
X = np.linspace(-np.pi, np.pi, 256, endpoint=True)
C,S = np.cos(X), np.sin(X)

#绘图
plot(X, C, color="blue", linewidth=2.0, linestyle="-", label="$cos(x)$")
plot(X, S, color="green", linewidth=2.0, linestyle="-", label="$sin(x)$")

#坐标范围
xlim(X.min(),X.max())
ylim(C.min()*1.1,C.max()*1.1)
#坐标刻度
xticks([-np.pi, -np.pi/2, 0, np.pi/2, np.pi],
       [r'$-\pi$', r'$-\pi/2$', r'$0$', r'$+\pi/2$', r'$+\pi$'])
yticks([-1, 0, +1],
       [r'$-1$', r'$0$', r'$+1$'])
#移动坐标
ax = gca()
ax.spines['right'].set_color('none')
ax.spines['top'].set_color('none')
ax.xaxis.set_ticks_position('bottom')
ax.spines['bottom'].set_position(('data',0))
ax.yaxis.set_ticks_position('left')
ax.spines['left'].set_position(('data',0))
#图示
legend(loc='upper left')
#标注特殊点
t = 2*np.pi/3
plot([t,t],[0,np.cos(t)], color ='blue', linewidth=2, linestyle="--")
scatter([t,],[np.cos(t),], 50, color ='blue')
#\为转义符，frac{}{}为分子比上分母，\pi为pai，两个美元符号表示这中间的是LaTax公式
annotate(r'$cos(\frac{2\pi}{3})=-\frac{1}{2}$',
         xy=(t, np.cos(t)), xycoords='data',
         xytext=(-90, -50), textcoords='offset points', fontsize=15,
         arrowprops=dict(arrowstyle="->", connectionstyle="arc3,rad=.2"))

plot([t,t],[0,np.sin(t)], color ='green', linewidth=2, linestyle="--")
scatter([t,],[np.sin(t),], 50, color ='green')
annotate(r'$sin(\frac{2\pi}{3})=\frac{\sqrt{3}}{2}$',
         xy=(t, np.sin(t)), xycoords='data',
         xytext=(+10, +20), textcoords='offset points', fontsize=15,
         arrowprops=dict(arrowstyle="->", connectionstyle="arc3,rad=.2"))

# savefig("exercice_2.png",dpi=72)
# 显示
show()
```

效果图如下：

![pic]({{ site.url }}/images/2015-07-07/test1.png)

### 二 pyplot
使用pyplot绘图，它具有函数式的绘图方式，也具有面向对象式的绘图方式。和上述的pylab类似。代码如下：

```python
# -*- coding: utf-8 -*-
import numpy as np
import matplotlib
import matplotlib.pyplot as plt

# 数据产生
X = np.linspace(-np.pi, +np.pi, 256)
Y = np.sin(X)

# 绘图及坐标设置
fig = plt.figure(figsize=(8,6), dpi=72,facecolor="white")
axes = plt.subplot(111)
axes.plot(X, Y, color='blue', linewidth=2, linestyle="-", label='$sin(x)$')
axes.set_xlim(X.min(), X.max())
axes.set_ylim(1.01*Y.min(),1.01*Y.max())
axes.set_xticks([-np.pi, -np.pi/2, 0, np.pi/2, np.pi])
axes.set_xticklabels([r'$-\pi$', r'$-\pi/2$', r'$0$', r'$+\pi/2$', r'$+\pi$'])
axes.set_yticks([-1, 0, 1])
axes.set_yticklabels([r'-1', r'0', r'1'])


#移动坐标轴
axes.spines['right'].set_color('none')
axes.spines['top'].set_color('none')
axes.xaxis.set_ticks_position('bottom')
axes.spines['bottom'].set_position(('data',0))
axes.yaxis.set_ticks_position('left')
axes.spines['left'].set_position(('data',0))

#图示
axes.legend(loc='lower right', shadow=True, fontsize='x-large')

#标注
t = 2*np.pi/3
axes.plot([t,t],[0,np.sin(t)], color ='blue', linewidth=2, linestyle="--")
axes.scatter([t,],[np.sin(t),], 50, color ='blue')
axes.annotate(r'$sin(\frac{2\pi}{3})=\frac{\sqrt{3}}{2}$',
         xy=(t, np.sin(t)), xycoords='data',
         xytext=(+10, +20), textcoords='offset points', fontsize=15,
         arrowprops=dict(arrowstyle="->", connectionstyle="arc3,rad=.2"))

plt.show()
```

效果图如下：

![pic]({{ site.url }}/images/2015-07-07/test2.png)

下面这个是我实际使用中画的图，这个相对复杂一些，其实也就是subplot设置的多了一些：

![pic]({{ site.url }}/images/2015-07-07/figure_mydata.png)

### 好玩！
最后展示一个好玩的功能！最近大家都很关心炒股，让我们用Matplotlib来绘制股票的涨跌图，看看股市的行情吧！

![pic]({{ site.url }}/images/2015-07-07/figure_dapan.png)

使用requests请求新浪接口的数据，解析数据并使用Matplotlib绘制动态图。其实好好弄的话可以很强大，没有精力折腾了，况且我也不炒股，纯粹凑个热闹，哈哈！现已开源到[Github](https://github.com/lugeek/matplotlib-stock)。

#### 参考文献：

+ [Vamei-matplotlib核心剖析](http://www.cnblogs.com/vamei/archive/2013/01/30/2879700.html)
+ [Python图表绘制：matplotlib绘图库入门](http://www.cnblogs.com/wei-li/archive/2012/05/23/2506940.html)
+ [matplotlib输出图象的中文显示问题](http://blog.sina.com.cn/s/blog_4d4afb6d010008xq.html)
+ [matplotlib-绘制精美的图表](http://sebug.net/paper/books/scipydoc/matplotlib_intro.html)
+ [Matplotlib Tutorial(译)](http://reverland.org/python/2012/09/07/matplotlib-tutorial/)
+ [Matplotlib官方-axes](http://matplotlib.org/api/axes_api.html?highlight=markersize)
+ [Matplotlib官方-gallery](http://matplotlib.org/gallery.html)
