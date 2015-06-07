---
layout: post
title: 花儿
description: 以智能养花为中心的社交App。
categories: 生活
tags: App
---

![face]({{ site.url }}/images/2015-06-07/fanhua-min.jpg)

范爷是我们花儿App的形象代言人！哈哈！

历时两个月，终于完成了花儿的开发，把这个坑给填上了！

开发一个完成度比较高的App，中间经历了非常多的问题。可以说获得了非常多的经验值，也对开发方面有了很多新的认识。废话不多说，上图！

![arduino]({{ site.url }}/images/2015-06-07/arduino-min.jpg)

硬件方面采用了Arduino进行开发，配合各种传感器，完成数据的获取和上传。

之前学了点Python和Flask这个web框架，这次是第一次运用到实践中，效果拔群！只不过前期学习花了不少时间，熟悉之后体会到了Flask的小巧强悍啊。文章后面分享一些学习资料吧。

![app]({{ site.url }}/images/2015-06-07/app-min.jpg)

花儿一听名字就是走小清新路线嘛！所以配色什么的都走的清新淡雅的路线。Android里面运用到了很多开源的类库，在这里向开源世界的小伙伴表示感谢！下面放出我们的花儿App！

![app]({{ site.url }}/images/2015-06-07/image_huaer_1_3-min.png)

[花儿下载地址](http://7xiq48.com1.z0.glb.clouddn.com/huaer_1_3.apk)

最后分享一些项目开发过程中用到的小技巧和小玩意儿吧！

####1. 正则表达式小工具
顺手写了一个非常简单的正则表达式小工具App，可以实时输出匹配结果。

[Github](https://github.com/lugeek/android_regular)

[apk下载地址](http://7xiq48.com1.z0.glb.clouddn.com/regular.apk)

####2. 色彩
谷歌的color设计推荐[google color style](https://www.google.com/design/spec/style/color.html#color-color-palette)

一个非常棒的调色工具[color generator](http://coolors.co/browser)

####3. 图标
团队没有美工，只能借助一些小工具了。

google自己的[Material icons](https://www.google.com/design/icons/)

各种图片格式的图标大全[flaticon](http://www.flaticon.com/)

图标制作小工具[free icon maker](https://freeiconmaker.com/)

转换图片格式工具[online converter](http://image.online-convert.com/convert-to-png)

如果需要透明的icon，则在flaticon里面找到喜欢图标的svg文件，自己在做些颜色之类的小修改(比如`fill = "#ffffff"`)，然后通过转换工具转换到png之类的格式。

如果需要一个美化的图标，则可以通过free icon maker制作，它同时支持导入flaticon的svg文件。

####4. App原型设计小工具
[墨刀](https://xn--ebr05n.com/)

####5. 9 patch image
[Draw 9 patch image for android online](http://draw9patch.com/)


####6. Material UI和layout列表
虽然项目中没怎么用到，但还是忍不住分享了！这个之前记得没有很多，这次点开发现搜集的相当全面了！[许许多多非常棒的开源组件](https://github.com/wasabeef/awesome-android-ui)

####参考资料
#####1.后端
+ [欢迎使用 Flask](http://docs.jinkan.org/docs/flask/)
+ [Flask-SQLAlchemy](http://docs.jinkan.org/docs/flask-sqlalchemy/index.html) 
+ [Flask之旅](https://spacewander.github.io/explore-flask-zh/index.html)
+ [Flask 开发从小白开始](http://segmentfault.com/bookmark/1230000001707093)
+ [The Flask Mega-Tutorial](http://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world)
+ [使用 Python 和 Flask 设计 RESTful API](http://www.pythondoc.com/flask-restful/first.html)
+ [Let’s Build A Web Server--最近看到的一个非常好的server入门教程](http://ruslanspivak.com/archives.html)

#####2. Android端
+ Material风格的导航抽屉[MaterialDrawer](https://github.com/mikepenz/MaterialDrawer)
+ [android：ToolBar详解（手把手教程）](http://www.jcodecraeer.com/a/anzhuokaifa/androidkaifa/2014/1118/2006.html)
+ [使用Toolbar + DrawerLayout快速实现高大上菜单侧滑](http://www.jcodecraeer.com/a/anzhuokaifa/androidkaifa/2015/0303/2522.html)
+ [在列表滚动的时候显示或者隐藏Toolbar](http://www.jcodecraeer.com/a/anzhuokaifa/androidkaifa/2015/0317/2612.html)
+ Android的ORM工具类[greenDAO](https://github.com/greenrobot/greenDAO)
+ [RecyclerView使用详解](https://frank-zhu.github.io/android/2015/01/16/android-recyclerview-part-1/)
+ [实用的开源框架（UI框架）](http://www.androidchina.net/1992.html#rd)
+ RecyclerView动画[RecyclerView Animators](https://github.com/wasabeef/recyclerview-animators)
+ [emoji](https://github.com/rockerhieu/emojicon)
+ [Creating custom Android views ](http://www.jayway.com/2012/12/12/creating-custom-android-views-part-4-measuring-and-how-to-force-a-view-to-be-square/)
+ [FlyRefresh](https://github.com/race604/FlyRefresh)
+ [Charts for Android](https://stackoverflow.com/questions/9741300/charts-for-android)
+ 图表[MPAndroidChart](https://github.com/PhilJay/MPAndroidChart)
+ 一个不错的Android教程网站有源码[101apps](http://www.101apps.co.za/)
+ 网络框架[okhttp](https://github.com/square/okhttp)
+ 图片框架[picasso](https://github.com/square/picasso)


#####App完成后看到的一些非常有启发性的文章
+ android软件架构方面，软件大了之后不好维护。[Android中的MVP](http://zhengxiaopeng.com/2015/02/06/Android%E4%B8%AD%E7%9A%84MVP/)
+ 回调接口的处理[Otto: No more callbacks](http://segmentfault.com/a/1190000002811995)
+ 一个完整系统的方方面面 [一步步搭建物联网系统](https://github.com/phodal/designiot)