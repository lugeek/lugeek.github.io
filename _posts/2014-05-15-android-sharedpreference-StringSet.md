---
layout: post
title: Android的SharedPreferences中StringSet不更新的问题
description: 关于SharedPreferences中putStringSet和getStringSet失败的解决办法。
categories: 技术
tags: android
---

![faceimage]({{ site.url }}/images/2014-05-15/android-sharedpreference-StringSet.jpg)  
一般我们需要用到SharedPreferences来存储简单的配置项，比如说Boolean、String、Float、Long或Int值，这些值存储之后，在下次打开应用的时候就能取出来，然后采取相应的措施。
 
当我们需要存储复杂的数据的时候，api当中引入了Set，这是一种集合，跟List类似，只是不能存储重复变量，而且是无序的。

>public abstract SharedPreferences.Editor putStringSet (String key, Set<String> values)  
Added in API level 11  
Set a set of String values in the preferences editor, to be written back once commit() is called.  
Parameters  
>
+ key：The name of the preference to modify.
+ values：	The set of new values for the preference. Passing null for this argument is equivalent to calling remove(String) with this key.
+ Returns: Returns a reference to the same Editor object, so you can chain put calls together.  

以上就是google开发指南的说明。

```java
    public void addone(String string){
    		channelSet.add(string); //channelSet是外部的一个Set<String>
    		SharedPreferences.Editor spEditor = getSharedPreferences("ninitest", 0).edit();
    		spEditor.putStringSet("channelSet", channelSet);
    		spEditor.commit();
    	}
```

上面是一个测试用的方法，就是将set增加一个字符串之后重新写入到本地，这个方法在第一次调用的时候还是可以写入的，但是之后调用，就不能写入了。下面是google给出的getStringSet的注意事项：

>Note that you must not modify the set instance returned by this call. The consistency of the stored data is not guaranteed if you do, nor is your ability to modify the instance at all.

不能更新的问题就出在getStringSet的object和putStringSet的object不能是同一个，不能在get之后，进行更改，然后又put进去，这样是无法更改的。

解决办法：

```java
    public void addone2(String string){
    		channelSet = new HashSet<String>(channelSet);
    		channelSet.add(string);
    		SharedPreferences.Editor spEditor = getSharedPreferences("ninitest", 0).edit();
    		spEditor.putStringSet("channelSet", channelSet);
    		spEditor.commit();
    	}
```

增加了一句`channelSet = new HashSet<String>(channelSet);` new 了一个HashSet，并且channelSet还是原来的channelSet，但是这个channelSet已经是一个全新的object了，然后每次更新都能将数据写入进去了。这是对数据本身进行操作，还有其他办法，就是对SharedPreferences的Editor进行操作：

1. 在putStringSet之前先清空Editor，即`editor.clear()`。  
2. editor增加一个数据项，在putStringSet后面再写个putString，这个putString里面可以是Set的size等等。  

上面两种对editor进行操作的方法也能解决这个问题。  

原创文章，转载请注明出处：转自[LUGEEK](http://www.lugeek.com/)