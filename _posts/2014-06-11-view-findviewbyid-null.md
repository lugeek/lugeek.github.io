---
layout: post
title: 自定义的view通过findviewbyid返回为null的解决办法
categories: 技术
tags: android
---

![view]({{ site.url }}/images/2014-06-11/view-findviewbyid-null.png)

有时候我们会自定义一个view，然后在XML里面进行静态的设置，比如下面的代码： 
 
```java
    public class MySurfaceView extends SurfaceView implements Callback{
    ......
    }
```
上面是自定义的view的代码，surfaceview是View的子类。 
 
```java
    <com.lugeek.pinputu.MySurfaceView
    	        android:id="@+id/surfaceview"
    	        android:layout_width="fill_parent"
    	        android:layout_height="fill_parent"/>
```
上面是XML的代码  
中间有一个非常重要的步骤就是给代码定义一个构造函数。  

```java
    public MySurfaceView(Context context, AttributeSet attrs) {
            super(context,attrs); 
            init();
    }
```
`AttributeSet attrs` 这个参数可以获取XML中定义的参数，比如说id，没有这个的话，也就是说findviewbyid就无法获取这个view的id了。  
原创文章，转载请注明出处：转自[LUGEEK](http://www.lugeek.com/)
