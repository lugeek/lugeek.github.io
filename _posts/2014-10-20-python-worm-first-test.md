---
layout: post
title: Python爬虫初体验
description: Python是一种非常灵活易学的脚本语言，本文写了一个小爬虫实现了非常简单的网页内容抓取。
categories: 技术
tags: Python
---
![Pythonworm]({{ site.url }}/images/2014-10-20/life-is-short.jpg)
Life is short, you need Python.

实验室安全考试，考不到90分就不要来实验室了！我只想说终于有不来实验室的正当理由了！但是大家都那么卖力，不知道哪搞来的题库，个个98分(￣▽￣)。

说到题库，感觉这网站做的很简单，我是不是也可以搞一个呢！(☆_☆)

看了网站源代码，发现这么一个js函数


```javascript
<script type="text/javascript">
function daan_chakan(daan,tihao){
	var daan=daan;
	alert('正确答案是：' + daan);
}
</script>
```

哈哈，调用这个不是就能得到答案了嘛！图样图森破啊，后来才发现这只是个显示答案的，不会js求教啊！囧rz

把整个题库拉出来吧，正好想学一下Python，嗯，就这么干！开始搜资料，[知乎传送门](http://www.zhihu.com/question/20899988),好多干货。在对Python语法不熟的情况下，连猜带蒙地写了第一个脚本。

![python爬虫]({{ site.url }}/images/2014-10-20/python-worm-first-test.png)

Build之后，题目和答案嗖嗖嗖地出现了！突然有一股当了黑客的赶脚！也同时发现了python的简单直接，真是人生苦短，我用python啊！

不说了，我要去改变世界了！