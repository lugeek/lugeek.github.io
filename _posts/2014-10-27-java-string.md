---
layout: post
title: Java中的String小记
description: 关于Java中的String的一个总结小记，包含String的详细分析，同时阐述了StringBuffer，比较了他们之间的不同，同时阐述了线程安全的概念包括测试。
categories: 技术
tags: Java
---

![钢之炼金术师]({{ site.url }}/images/2014-10-27/fullmedal.jpg)

##String

```java
public final class String
extends Object
implements Serializable, Comparable<String>, CharSequence
```
* `final`表明字符串是常量，属于不可变数据类型，创建之后无法修改。通过`replace`改变字符串的值，实际上是重新创建了一个新的字符串对象。
* `String`相当于`char[]`的封装类,类似于`Integer`与`int`
* `String`采用直接赋值和用new出的对象赋值的区别仅仅在于存储方式不同。直接赋值存储在栈(常量池)中，new对象赋值存储在内存堆中。对于直接赋值，字符串存在常量池中，多个相同的字符串指向同一个常量，可以用==判断。new赋值的字符串在自己的内存地址中，不能用==比较。
* `String`虽然不是基本数据类型，但是采用的是值传递。
* 以下两种创建字符串的方法是等价的：
	
	```java
	String str = "abc";
	char data[] = {'a', 'b', 'c'};
	String str = new String(data);	
	```
* 关于equals()和==: equals对于String简单来说就是比较两字符串的Unicode序列是否相当，如果相等返回true;而==是比较两字符串的地址是否相同，也就是是否是同一个字符串的引用

####构造函数
1. `String(byte[] bytes, int offset, int length, Charset charset)`:根据指定的`charset`字符表将字节数组的指定长度解码成字符串。
2. `String(char[] value, int offset, int count)`:将制定长度的字符数组转换成字符串。
3. `String(String original)`:复制拷贝字符串。
4. `String(int[] codePoints, int offset, int count)`:将Unicode代码点指定长度的内容转换为string。
5. `String(StringBuffer buffer)`:stringbuffer转换为string。
6. `String(StringBuilder builder)`:stringbuilder转换为string。

####方法

|Return|Method|Describe|
|:------|:------|:--------|
|1char  |`charAt`(int index)|返回指定位置（0 ~ length()-1）的字符|
|int   |`codePointAt`(int index)|返回字符串指定位置的Unicode代码点(ps.Java中的char占用两个字节，采用Unicode编码)|
|int|`codePointBefore`(int index)|返回字符串所在索引－1的Unicode代码点|
|int|`codePointCount`(int beginIndex, int endIndex)|返回制定范围内的Unicode代码点的个数|
|int|`compareTo`(String anotherString)|若两个字符串相同返回0，若一个字符串和另一个字符串的头几位相同长度不同则返回长度相减，若两个字符串长度不同包含的字符也不同则返回第一个不同的字符的ASCII码相减值。|
|int|`compareToIgnoreCase`(String str)|同上，忽略大小写|
|String|`concat`(String str)|将两个字符串串联，类似String中的`+`|
|boolean|`contains`(CharSequence s)|返回String中是否包含s。|
|boolean|`contentEquals`(CharSequence cs)|比较String与这个charsequence是否相同|
|boolean|`contentEquals`(StringBuffer sb)|比较String与这个stringbuffer是否相同|
|boolean|`endsWith`(String suffix)|是否以指定字符串结尾|
|boolean|`equals`(Object anObject)|是否与给定的字符串内容相同,字符串比较内容不能用==|
|boolean|`equalsIgnoreCase`(String anotherString)|是否与给定字符串相同，忽略大小写|
|static String|`format`(Locale l,String format,Object... args)|语言编码格式化之类…｜
|byte[]|`getBytes`()|根据默认字符表将字符串转化为字节数组|
|byte[]|`getBytes`(Charset charset)|根据指定字符表将字符串转化为字节数组|
|byte[]|`getBytes`(String charsetName)|根据指定名字的字符表将字符串转化为字节数组|
|void|`getChars`(int srcBegin,int srcEnd,char[] dst,int dstBegin)|将string中的srcbegin到srcend－1的字符拷贝到dst的char［］指定位置之后，注意长度|
|int|`hashCode()`|根据字符的ASCII码按公式计算返回hash码|
|int|`indexOf`(int ch)|返回字符串中指定字符(unicode代码数字)的索引|
|int|`indexOf`(int ch, int fromIndex)|从指定索引开始搜索给定字符的索引|
|int|`indexOf`(String str)|返回字符串中包含的子字符串的第一个字符的索引|
|int|`indexOf`(String str, int fromIndex)|从指定位置开始搜索|
|String|`intern`()|当一个String实例str调用intern()方法时，Java查找常量池中是否有相同Unicode的字符串常量，如果有，则返回其的引用， 如果没有，则在常量池中增加一个Unicode等于str的字符串并返回它的引用|
|boolean|`isEmpty`()|如果length()为0则返回true|
|static String|`join`(CharSequence delimiter, CharSequence... elements)|在相邻的elements之间插入delimiter|
|int|`lastIndexOf`(int ch)|返回string中最后一次出现给定字符的索引|
|int|`lastIndexOf`(int ch, int fromIndex)|从给定位置开始|
|int|`lastIndexOf`(String str)|返回string中最后一次出现给定字符串的索引|
|int|`lastIndexOf`(String str, int fromIndex)|从给定位置开始|
|int|`length`()|返回字符串的长度，字符个数|
|boolean|`matches`(String regex)|是否符合给定的正则表达式|
|int|`offsetByCodePoints`(int index, int codePointOffset)|返回此String 中从给定的 index 处偏移 codePointOffset 个代码点的索引|
|boolean|`regionMatches`(boolean ignoreCase, int toffset, String other, int ooffset, int len)|返回这个string从toffset开始长度为len的子串和other字符串指定位置指定长度的子串是否相同|
|String|`replace`(char oldChar, char newChar)|将字符串中的给定字符替换成其他字符|
|String|`replace`(CharSequence target, CharSequence replacement)|将字符串中的给定字符串替换成其他字符串|
|String|`replaceAll`(String regex, String replacement)|将符合正则表达式的子串全部替换成给定字符串|
|String|`replaceFirst`(String regex, String replacement)|将符合正则表达式的第一个子串替换成给定字符串|
|String[]|`split`(String regex)|将字符串按正则表达式分割成字符串数组,这个regex可以是一个字符串，则以这个字符串为分割线切割字符串|
|String[]|`split`(String regex, int limit)|将字符串按正则表达式分割成字符串数组,limit为分割出来的数量，0为不分割，这个regex可以是一个字符串，则以这个字符串为分割线切割字符串|
|boolean|`startsWith`(String prefix)|字符串是否以指定字符串开头|
|String|`substring`(int beginIndex)|截取从给定索引开始的字符串|
|String|`substring`(int beginIndex, int endIndex)|截取给定范围的(end-begin)个字符|
|char[]|`toCharArray`()|将字符串转化为char[]|
|String|`toLowerCase`()|将字符串变成小写|
|String|`toUpperCase`()|将字符串变成大写|
|String|`toString`()|返回字符串自身|
|String|`trim`()|去除字符串中的空格|
|static String|`valueOf`(基本数据类型)|将其他基本数据类型转化为字符串|

* **引用**:
	* `charAt`
* **比较**:
	* `compareTo`
	* `equals`
	* `matches`
* **合成**:
	* `concat`
	* `+`
	* `join`
* **截取**
	* `split`
	* `substring`
	* `trim`
* **查找**:
	* `contains`
	* `endsWith`
	* `startsWith`
	* `indexOf`
	* `lastIndexOf`
	* `length`
	* `replace`
* **转换**:
	* `getBytes`
	* `getChars`
	* `toCharArray`
	* `toLowerCase`
	* `toUpperCase`
	* `toString`
	* `valueOf`

##StringBuffer
```java
public final class StringBuffer
extends Object
implements Serializable, CharSequence
```

####构造函数
1. `StringBuffer(CharSequence seq)`:stringbuffer初始化为给定序列
2. `StringBuffer(String str)`:同上
3. `StringBuffer(int capacity)`:初始化指定容量的StringBuffer(建议)

####方法

|Return|Method|Describe|
|:------|:------|:--------|
|int|`capacity`()|获取stringbuffer的当前容量|
|void|`ensureCapacity`(int minimumCapacity)|使stringbuffer的容量大于指定的容量|
|StringBuffer|`delete`(int start, int end)|删除（end－start）个字符，从start到end-1的字符|
|StringBuffer|`deleteCharAt`(int index)|删除指定位置的字符|
|StringBuffer|`append`()|可以将各种基本数据类型的变量或者stringbuffer附加进去|
|StringBuffer|`insert`(int offset, boolean b)|在指定位置前面插入数据|
|StringBuffer|`replace`(int start, int end, String str)|替换指定位置的数据|
|StringBuffer|`reverse`()|将stringbuffer中的数据头尾颠倒|
|void|`setCharAt`(int index, char ch)|修改指定位置的字符|
|void|`setLength`(int newLength)|改变数据长度，同时会改变容量，保持容量大于等于长度|
|String|`substring`(int start, int end)|截取（end－start）个字符，从start到end－1|
|void|`trimToSize`()|将stringbuffer的capacity减小到length，压缩空间|
|String|`toString`()|返回字符串类型|
||其他|同string|

* string:字符串常量
* StringBuffer:字符串变量，线程安全（Synchronized），
* StringBuilder:字符串变量，非线程安全
* **基本原则**：如果要操作少量的数据，用String ；单线程操作大量数据，用StringBuilder ；多线程操作大量数据，用StringBuffer。
* 为了获得更好的性能，在构造 StirngBuffer 或 StirngBuilder 时应尽可能指定它们的容量。

####StringBuilder非线程安全测试

```java

import java.util.concurrent.CountDownLatch;

public class Main {
    public static void main(String[] args) {
        for (int i = 0; i < 10; i++) {
            test();
        }
    }
    public static void test()
    {
        StringBuilder sb = new StringBuilder();

        // 线程数量(1000)
        int threadCount = 1000;

        // 用来让主线程等待threadCount个子线程执行完毕
        CountDownLatch countDownLatch = new CountDownLatch(threadCount);

        // 启动threadCount个子线程
        for(int i = 0; i < threadCount; i++)
        {
            Thread thread = new Thread(new MyThread(sb, countDownLatch));
            thread.start();
        }

        try
        {
            // 主线程等待所有子线程执行完成，再向下执行
            countDownLatch.await();
        }
        catch (InterruptedException e)
        {
            e.printStackTrace();
        }

        // List的size
        System.out.println(sb.length());
    }

}

class MyThread implements Runnable
{
    private StringBuilder sb;

    private CountDownLatch countDownLatch;

    public MyThread(StringBuilder sb, CountDownLatch countDownLatch)
    {
        this.sb = sb;
        this.countDownLatch = countDownLatch;
    }

    public void run()
    {
        // 每个线程向List中添加100个元素
        for(int i = 0; i < 100; i++)
        {
            sb.append("a");
        }

        // 完成一个子线程
        countDownLatch.countDown();
    }
}
```
```
99961
100000
100000
100000
100000
100000
100000
100000
99982
100000
```
* 非线程安全中间有出错
* 将StringBuilder改成StringBuffer之后线程安全了，结果如下

```
100000
100000
100000
100000
100000
100000
100000
100000
100000
100000
```
* `ArrayList`是非线程安全的，`Vector`是线程安全的；`HashMap`是非线程安全的，`HashTable`是线程安全的；`StringBuilder`是非线程安全的，`StringBuffer`是线程安全的。