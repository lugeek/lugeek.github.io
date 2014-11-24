---
layout: post
title: 记一次挖坑之旅
description: 使用Python的爬虫获取网站上的信息，再存储到数据库中，采用基于Java的Play框架负责接受json请求并返回从数据库中取出的json数据，Android端作为客户端，采用Volley的Http框架来通信。
categories: 技术
tags: android, java, python, mysql
---

![dighole]({{ site.url }}/images/2014-11-24/dighole.png)

##一、想法
1. 用Python写爬虫，把想要的东西给爬出来，然后存到数据库。
2. 后端：搭建一个后端，响应app端的请求，负责将爬虫抓的数据库信息发送到app端。
3. 前端：写一个Android的app，将数据库信息接受下来，然后进行展示。
4. 知识点: 
	* Python: 写爬虫并操作数据库
	* MySQL: 数据库
	* PlayFramework(ORM, MVC, Java):轻量级的Java Web框架
	* Http: 负责服务端和客户端的通信
	* Json: 数据封装
	* Android(Volley): 客户端

##二、Python
####爬虫
直接用正则表达式获取标题、描述、图片、链接什么的还是很困难的，坑啊！后来知道有专门解析html的方法，Python中有HTMLParser、SGMLParser和BeautifulSoup（第三方）,BeautifulSoup功能很强大，但是用起来也是很复杂，后来用HTMLParser虽然功能单一，但是简单粗暴。

```python
import urllib2
from urllib2 import Request, urlopen, URLError, HTTPError

def getPage(url):
	headers = { 'User-Agent' : 'Mozilla/4.0 (compatible; MSIE 5.5; Windows NT)' }
	req = urllib2.Request(url,'',headers)
	try:
		response = urlopen(req)
	except HTTPError as e:
	    print 'The server couldn\'t fulfill the request.'
	    print 'Error code: ', e.code
	except URLError as e:
	    print 'We failed to reach a server.'
	    print 'Reason: ', e.reason
	else:
		the_page = response.read()
    	return the_page
```
▲ Python拉取整个页面的内容。

```python
	import re
	
	the_page = getPage('http://www.lugeek.com')
	#the_page = the_page.decode('utf-8').encode('utf-8')
	reg_page = re.compile(r"<span class='pages'>1/(.*?)</span>")
	pages = reg_page.findall(the_page)
	#返回的pages是list类型的
```
▲ 正则表达式的使用

```python
	from HTMLParser import HTMLParser
	
	# create a subclass and override the handler methods
	class MyHTMLParser(HTMLParser):
		def __init__(self):
			HTMLParser.__init__(self)
			self.ish2 = False
			self.isp = False
	    def handle_starttag(self, tag, attrs):
	        print "Encountered a start tag:", tag
	        if tag == 'h2':
	        	self.ish2 = True
	        elif tag == 'p':
	        	for name,value in attrs:
	        		if name == 'class' and value == 'entry':
	    				self.isp = True
	    				break    			
	    def handle_endtag(self, tag):
	        print "Encountered an end tag :", tag
	        if tag == 'h2':
	        	self.ish2 = False
	        elif tag == 'p':
	        	self.isp = False
	    def handle_data(self, data):
	        print "Encountered some data  :", data
			if self.ish2:
				print data
			if self.isp:
				print data
	# instantiate the parser and fed it some HTML
	parser = MyHTMLParser()
	parser.feed('<html><head><title>Test</title></head>'
	            '<body><h1>Parse me!</h1></body></html>')
```
▲ Python中使用HTMLParser进行解析网页。HTMLParser需要继承使用，覆写三个主要方法就能使用了，十分简单。`handle_starttag`是开始一个标签就调用，然后给一个标识位，在`handle_data`中发现相应标识位就把data取出来，在`handle_endtag`中将标识位复位。

####数据库

```python
import MySQLdb

def isexit(str):
	#连接数据库,记得加上charset不然乱码
	db = MySQLdb.connect("localhost", "lugeek","*****","apps_db", charset='utf8')
	#获取操作游标
	cursor = db.cursor()
	#语句
	sql = "select name from apps where name = '%s';" % str
	try:
		#执行sql语句
		cursor.execute(sql)
		results = cursor.fetchall()
		if len(results) == 0:
			return False
		else:
			return True
		#提交到数据库
		#db.commit()
	except:
		#出错则回滚
		db.rollback()
		print '出错'
	#关闭数据库
	db.close()
```
▲ 查询数据库中是否存在name为str的记录。

```python
def inputdata(mdate, name, describes, images, links, sources):
	#连接数据库,记得加上charset不然乱码
	db = MySQLdb.connect("localhost", "lugeek","dxxmcccxiv","apps_db", charset='utf8')
	#获取操作游标
	cursor = db.cursor()
	#语句
	sql = "insert into apps (mdate, name, describes, images, links, sources) values ('%s', '%s', '%s', '%s', '%s', '%s')" % \
			(mdate, name, describes, images, links, sources)
	try:
		#执行sql语句
		cursor.execute(sql)
		#提交到数据库
		db.commit()
	except:
		#出错则回滚
		db.rollback()
	#关闭数据库
	db.close()

```
▲ 插入数据库(ps. 这里需要注意的是编码，insert的数据的编码如果有错，会出现decodeerror,可以事先查看type()来看一下格式是否符合要求。)


##三、MySQL数据库

####安装配置

一. Mac下MySQL安装：

去[mysql官方](http://www.mysql.com)下载mac下面的dmg包，直接双击安装没有什么注意的。但是安装完发现命令行下面不能用，机智的我意识到肯定又是环境变量问题。修改`/etc/paths`加入一行`/usr/local/mysql/bin`完成！

二. Python下MySQL安装:

1. 下载: [MySQL-python](https://pypi.python.org/pypi/MySQL-python/1.2.5)
2. cd到MySQL-python的目录下面
3. `python setup.py build`编译
4. `sudo python setup.py install`安装
5. `import MySQLdb`报错
6. `vi .bash_profile`添加`export DYLD_LIBRARY_PATH="/usr/local/mysql/lib"`
7. end
8. 有问题参考[Mac环境下为Python安装MySQLdb库时遇到的诸多问题](http://segmentfault.com/blog/daodao/1190000000329202)

三. IDEA数据库配置，导入JDBC驱动，步骤如下：

1. View -> Tool Windows -> Database
2. Driver files 这里要安装JDBC驱动
3. 在左边Drivers -> Mysql下的drivers files下可以看到JDBC的路径
4. 这个工具很好用，可以测试数据库
5. 在需要用到mysql的工程中，File -> Project Structure,点击下面的＋号，导入JDBC的jar包即可

####数据库简单指令：

1. ps.`[]`方括号中的内容可省略
2. `create database samp_db character set utf8;`创建数据库,在mac下这里要设置utf8,不然insert中文会报错，坑啊！
2. `mysql [-D dbname] [-h host] -u user -p` 打开数据库
3. `mysql`->`show databases;`->`use dbname;` 同上
4. `create table tablename(columns);`创建表
5. `id int unsigned not null auto_increment primary key` columns中的id主键唯一
6. `show tables;`,`describe tablename;`,`SHOW COLUMNS FROM 数据表`,`SHOW INDEX FROM 数据表`,`SHOW TABLE STATUS LIKE 数据表\G` 表相关操纵
7. `insert [into] tablename [(colmn1,colmn2...)] values (v1,v2,...);` 插入一行数据
8. `select colmn1,colmn2,... from tablename [条件]`查询操作
9. `select * from tablename;`查询表中所有数据
10. `select colmn1,colmn2,... from tablename where colmn=value` 根据where的条件来查询
11. `where`支持=,>,<,<=,>=,!=,is,not,in,like,or,and等
12. `update tablename set colmn=value where 条件`更新值
13. `delete from tablename where 条件` 删除行
14. `alter table tablename add colmn 数据类型 [after 位置]`增加列
15. `alter table tablename change colmn newname 数据类型;`列改名改类型
16. `alter table tablename drop colname;`删除列
17. `alter table tablename rename newname;`更改表名
18. `drop table tablename;`删除表
19. `drop database name;`删除数据库
20. `mysqladmin -u root -p password 新密码` 改密
21. `mysql`的数据库中的`user`表管理用户信息，`describe user`可查看相关表项（权限）,通过插入数据来增加用户,如下.
22. `insert into user (host, user, password, select_priv, insert_priv, update_priv,) values ('localhost', 'guest', password('guest12345'),'Y','Y','Y');`增加本地用户guest，密码为guest12345(加密),具有3个权限
23. `create user 'lugeek'@'localhost' identified by 'dxxmcccxiv';` 创建用户
24. `grant select,insert,update,delete on db.table to 'lugeek'@'localhost';`增加权限
25. `grant select,insert,update,delete,create,drop,alter on lugeek_db.* to 'lugeek'@'localhost';`增加数据库下所有表的权限。（推荐）

####数据库测试
```bash
create table apps(
    -> id int unsigned not null auto_increment primary key,
    -> mdate date not null,
    -> name char(255) not null,    
    -> describes text not null,    
    -> images text not null,    
    -> links text not null);
```
▲ ps:小心mysql的保留字段，有些变量名字是不允许的。

```java
public static final String DRIVER = "com.mysql.jdbc.Driver";
public static final String URL = "jdbc:mysql://localhost:3306/lugeek_db";
//连接数据库
Class.forName(DRIVER);
connection = DriverManager.getConnection(URL, USERNAME, PASSWORD);
//查询数据库
preparedStatement = connection.prepareStatement(sql);
resultSet = preparedStatement.executeQuery();
//更新数据库
preparedStatement = connection.prepareStatement(sql);
for(int i=0; i<obj.length; i++){
    preparedStatement.setObject(i+1, obj[i]);
}
```
▲ Java操作数据库的操作要点

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class BaseDao {
    public static final String DRIVER = "oracle.jdbc.driver.OracleDriver";
    public static final String URL = "jdbc:oracle:thin:@localhost:1521:ORCL";
    public static final String USERNAME = "ma";
    public static final String PASSWORD = "malei";
    
    Connection connection = null;
    PreparedStatement preparedStatement = null;
    ResultSet resultSet = null;
     
    public Connection getConnection() throws Exception {
        Class.forName(DRIVER);
        connection = DriverManager.getConnection(URL,USERNAME,PASSWORD);
        return connection;
    }
    
    public ResultSet executeQuery(String sql) throws Exception {
        connection = this.getConnection();
        preparedStatement = connection.prepareStatement(sql);
        resultSet = preparedStatement.executeQuery();
        return resultSet;
        
    }
    
    public int executeUpdate(String sql,Object[] obj) throws Exception {
        connection = this.getConnection();
        preparedStatement = connection.prepareStatement(sql);
        for(int i =0;i<obj.length;i++){
            preparedStatement.setObject(i+1, obj[i]);
        }
        return preparedStatement.executeUpdate();
    }
    
    public void closeAll() throws Exception {
        if(null != resultSet){
            resultSet.close();
        }         if(null != preparedStatement){
            preparedStatement.close();
        }
        if(null != connection){
            connection.close();
        }
    }
}
```
▲ Java的数据库操作封装

####ORM

**ORM**(Object Relation Mapping)对象关系映射，主要实现程序对象到关系数据库数据的映射。数据库一般都是关系型数据库，从上面可以看到对于数据库的操作非常繁琐，基于面向对象的原理如果将这种关系转换为对象，则自然就包含了继承、接口等面向对象的优点，可以像操作对象一样对数据库进行增删改查。这在Play框架中也有应用，就是Ebean的ORM框架。坑啊！得学一下ORM了！学完Java的数据库之后发现play里面的数据库根本就不是这么玩的，坑啊！继续学！

这里包含了play中数据库的配置，操作数据库的方法，json的封装，处理请求返回响应的方法。

1. build.sbt 中已经enable了javaJdbc,javaEbean,mysql

	```bash
	libraryDependencies ++= Seq(
	javaJdbc,
	javaEbean,
	cache,
	javaWs,
	"mysql" % "mysql-connector-java" % "5.1.18"
	)
	```
	
2. conf/application.conf中增加如下:
	
	```bash
	# Database configuration
	db.default.driver=com.mysql.jdbc.Driver
	db.default.url="jdbc:mysql://127.0.0.1:3306/testing"
	db.default.user="player"
	db.default.password="player"
	
	# Ebean configuration
	ebean.default="models.*"
	```

3. app中新建文件夹models,新建students的class,如下：
	
	```java
	package models;
	
	import play.db.ebean.Model;
	
	import javax.persistence.Entity;
	import javax.persistence.Id;
	
	@Entity
	public class Students extends Model{
	    @Id
	    public Integer id;
	    public String name;
	    public String sex;
	    public Integer age;
	
	    public static Finder<Integer,Students> finder = new Finder<Integer, Students>(Integer.class, Students.class);
	}
	```
	▲ @Entity下的类名对应mysql下的table名，@Id下的变量对应table中的列，新建Finder实例用于数据操作。在Dash中的play中可以查找到Finder中的各种操作方法。

4. 在Application中的操作如下：
	
	```java
	public static Result mysql(){
     	List<Students> students = Students.finder.all();
     	return ok(views.html.nameList.render(students));
 	}
 	```
	▲ finder.all()返回为List，传给views下的nameList.scala.html做展示

5. nameList.scala.html写法如下:
	
	```html
	@(nameList: List[models.Students])
	
	<!DOCTYPE html>
	<html>
	<head lang="en">
	  <meta charset="UTF-8">
	  <title></title>
	</head>
	<body>
	  <ul>
	    @for(name <- nameList){
	      <li>@name.name</li>
	    }
	  </ul>
	</body>
	</html>
	```
	▲ 第一行是传进来的参数，类型为List[models.Students],名字为nameList。在for循环中取出所有行，并将其中的name参数列出来

6. Json数据
	
	```java
	@BodyParser.Of(BodyParser.Json.class)
	   public static Result getall(){
	       JsonNode json = request().body().asJson();
	       String appid = json.findPath("appid").textValue();
	       if(appid == null){
	           return badRequest("Missing parameter [appid]!");
	       }else {
	           int n = Students.finder.findRowCount();
	           if (n >= Integer.parseInt(appid)){
	               List<Students> newStudents = Students.finder.where().le("id",n).ge("id",Integer.parseInt(appid)).findList();
	               return ok(Json.toJson(newStudents));
	           }else {
	               return ok("It is already updated!");
	           }
	       }
	
	   }
	```
	▲ 上面是play端的接受Json数据，返回Json数据的代码

7. curl 发送json请求
	
	```bash
	curl 
	--header "Content-type: application/json" 
	--request POST 
	--data '{"appid":"5"}' 
	http://localhost:9000/getall
	```
	▲ 返回的是id大于等于appid小于等于n的数据

##四、Play 框架
这部分是难点，大坑啊！

在学习Python的时候注意到了一个Django框架，这是一个比较轻量的web框架，然后配合Django REST framework可以开发出适合app的API，这样一个后端就完成了。考虑到自己Python底子薄，学习这个框架的时间可能会比较长，所以就当备用方案了。还有一个flask框架，据说也是十分小巧可爱的，值得一试。

然后选择了一个Java框架——Play，这个也是Java端比较小巧的框架，自己对Java还是比较有信心的，所以试着搞一搞！正式走上不归路。

####Play框架搭建
1. 下载

	[play官方下载](https://www.playframework.com/download),可以选择离线版本。
2. 添加到环境变量

	Mac下打开`/etc/paths`加入一行当前activator的地址如`/Users/admin/activator-1.2.10`。
3. 运行

	`activator new mytestapp play-java`创建一个play应用。
	
	创建完之后可以导入到IDEA中进行开发。
	
	在命令行cd到对应的app目录`activator run`运行，然后在浏览器`localhost:9000`查看效果
	
**注意**:此处gfw出来捣乱了！第一次创建应用的时候可能需要下载好多架包，有些被墙，所以需要科学上网。真是个坑啊！数据库和请求响应的部分上面已经有了，具体操作见[官方文档](https://www.playframework.com/documentation)。

##五、Android客户端开发
对于Android的HTTP通信,底层有两种实现方式，分别是HttpURLConnection(推荐)和HttpClient,直接使用会出现很多重复代码，所以最好先进行封装。网上有一些现成的框架可以使用AsyncHttp的框架听说也是很不错的选择，扩展也很容易。谷歌官方也推出了一个网络框架——Volley，这个框架简单健壮，适合小流量的频繁通信，普通的App绝对够用了。

####Volley
1. 获取源码:`git clone https://android.googlesource.com/platform/frameworks/volley `
2. 打包(坑啊，搞了好久,虽然只有短短几行)
	* eclipse -> import 源码
	* export -> java -> jar file
	* 只选取src文件夹,勾选`Export generated class files and resources`和`Export java source files and resources`,选择导出的路径并命名xxx.jar,next
	* 去掉勾选`Export class files with compile errors`和`Export class files with compile warnings`,finsh
3. 导入jar包到工程(AndroidStudio)

	将jar包拷贝到libs目录下，File->ProjectStruct,app->Dependence中＋倒入文件
4. StringRequest的GET请求
	
	`RequestQueue requestQueue = Volley.newRequestQueue(context); `发送队列,具有异步并发的特性，只要把Request`add`进去就发送出去了.
	
	```java
	StringRequest stringRequest = new StringRequest(
               "http://10.0.3.2:9000",
               new Response.Listener<String>() {
                   @Override
                   public void onResponse(String s) {
                       Log.i("ok",s);
                       textView.setText(s);
                   }
               },
               new Response.ErrorListener(){
                   @Override
                   public void onErrorResponse(VolleyError volleyError) {
                       textView.setText(volleyError.getMessage());
                   }
               }
       );
	```
	StringRequest传入URL地址，然后复写了两个回调函数，分别是响应成功和失败。这里需要注意的是url地址，因为Android模拟器要访问PC的地址，所以不能用localhost，自带模拟器访问PC的地址是`10.0.2.2`,而genymotion访问pc的地址是`10.0.3.2`。
	
	`requestQueue.add(stringRequest);`将请求添加到发送队列进行发送请求。
	
	`<uses-permission android:name="android.permission.INTERNET" />`记得添加网络权限
	
5. JsonObjectRequest 的POST请求
	
	发送的3个主要步骤同上， JsonObjectRequest的代码如下
	
	```java
	jsonRequest = new JsonObjectRequest(Request.Method.POST,
                "http://10.0.3.2:9000/getall",
                obj,
                new Response.Listener<JSONObject>(){
                    @Override
                    public void onResponse(JSONObject jsonObject) {
                        textView.setText(jsonObject.toString());
                    }
                },
                new Response.ErrorListener(){
                    @Override
                    public void onErrorResponse(VolleyError volleyError) {
                        textView.setText(volleyError.getMessage());
                    }
                }
        );
    ```
    其中有5个参数，一个Post的请求，url地址，Post的JSONObject，两个回调监听器，其中obj的代码如下：
    
    ```java
    JSONObject obj = new JSONObject();
    try {
        obj.put("appid","4");
    }catch (Exception e){
        e.printStackTrace();
    }
    ```
6. JsonArrayRequest 的POST请求
	
	这里遇到一个坑，官方的Volley代码中只有JsonArrayRequest的GET请求，所以POST请求还得自己造轮子，不过参考JsonObjectRequest的代码就能很容易写出来，只是在原来JsonArrayRequest的基础上添加一个构造函数并实现父类JsonRequest的方法就行了,可以修改Volley的源代码，或者自定义一个类来实现。
		
	```java
	package com.lugeek.httpdemo;

	import android.util.Log;
	
	import com.android.volley.NetworkResponse;
	import com.android.volley.ParseError;
	import com.android.volley.Response;
	import com.android.volley.toolbox.HttpHeaderParser;
	import com.android.volley.toolbox.JsonRequest;
	
	import org.json.JSONArray;
	import org.json.JSONException;
	import org.json.JSONObject;
	
	import java.io.UnsupportedEncodingException;
	
	/**
	 * A request for retrieving a {@link JSONArray} response body at a given URL, allowing for an
	 * optional {@link JSONObject} to be passed in as part of the request body.
	 */
	public class MyJsonArrayRequest extends JsonRequest<JSONArray>{
	
	    /**
	     * Creates a new request.
	     * @param method the HTTP method to use
	     * @param url URL to fetch the JSON from
	     * @param jsonRequest A {@link JSONObject} to post with the request. Null is allowed and
	     *   indicates no parameters will be posted along with request.
	     * @param listener Listener to receive the JSON response
	     * @param errorListener Error listener, or null to ignore errors.
	     */
	    public MyJsonArrayRequest(int method, String url, JSONObject jsonRequest,
	                              Response.Listener<JSONArray> listener, Response.ErrorListener errorListener) {
	        super(method, url, (jsonRequest == null) ? null : jsonRequest.toString(), listener,
	                errorListener);
	    }
	
	    /**
	     * Creates a new request.
	     * @param url URL to fetch the JSON from
	     * @param listener Listener to receive the JSON response
	     * @param errorListener Error listener, or null to ignore errors.
	     */
	    public MyJsonArrayRequest(String url, Response.Listener<JSONArray> listener, Response.ErrorListener errorListener) {
	        super(Method.GET, url, null, listener, errorListener);
	    }
	
	    @Override
	    protected Response<JSONArray> parseNetworkResponse(NetworkResponse response) {
	        try {
	            String jsonString =
	                    new String(response.data, HttpHeaderParser.parseCharset(response.headers));
	            return Response.success(new JSONArray(jsonString),
	                    HttpHeaderParser.parseCacheHeaders(response));
	        } catch (UnsupportedEncodingException e) {
	            return Response.error(new ParseError(e));
	        } catch (JSONException je) {
	            return Response.error(new ParseError(je));
	        }
	    }
	}

    ```
    JsonArrayRequest的写法和JsonObjectRequest如出一辙。

##六、服务器实战

之前都是在本地测试，这次直接在VPS上面进行测试。用的是BandwagonHost，安装Ubuntu 14.04，然后修改密码……Python已经安装好，然后`apt-get update`,在`apt-get install mysql-server`安装数据库,`apt-get install openjdk-7-jdk`安装java环境,`wget http://downloads.typesafe.com/typesafe-activator/1.2.10/typesafe-activator-1.2.10-minimal.zip`下载activator，然后unzip 解压，添加环境变量，`echo "export PATH=$PATH:/root/play/activator-1.2.10-minimal" >> ~/.bashrc`,重新登录就能使用activator了。

那么问题来了……

我的vps是入门级的，参数非常低，内存才512MB，让我出乎意料的是activator根本运行不起来……

修改jvm的内存Xms之类的，用尽了各种方法始终不行，java的应用就这么吃内存？我算是见识到了…坑啊，这个坑我已经填不上了…买不起配置高的vps啊…

![zisha]({{ site.url }}/images/2014-11-24/zisha.png)

有人会说这跟开头说好的不一样啊！我只能说，小伙子，看文章要看完再实践！233333…

![hanxiao]({{ site.url }}/images/2014-11-24/hanxiao.png)

什么Tomcat，Spring，Apache之类的，下次再试试看吧…

一部出色的电影结局未必美好，但总是让人意犹未尽的…喂，别走啊，我还没说完呢！

![wakengshou]({{ site.url }}/images/2014-11-24/wakengshou.png)

##七、参考资料：

[来玩Play框架--Vamei](http://www.cnblogs.com/vamei/p/3691398.html)

[Playframework官方指南](https://www.playframework.com/documentation/2.3.x/JavaDatabase)

[Handling and serving JSON](https://www.playframework.com/documentation/2.3.x/JavaJsonActions)

[Java构造和解析Json数据的两种方法详解二](http://www.cnblogs.com/lanxuezaipiao/archive/2013/05/24/3096437.html)

[JSON for java入门总结](http://blog.csdn.net/xiazdong/article/details/7059573)

[Android 网络通信框架Volley简介(Google IO 2013)](http://blog.csdn.net/t12x3456/article/details/9221611)

[Android Volley完全解析(一)，初识Volley的基本用法](http://blog.csdn.net/guolin_blog/article/details/17482095)

[Android Volley完全解析(二)，使用Volley加载网络图片](http://blog.csdn.net/guolin_blog/article/details/17482165)

[Android Volley完全解析(三)，定制自己的Request](http://blog.csdn.net/guolin_blog/article/details/17612763)

[Android Volley完全解析(四)，带你从源码的角度理解Volley](http://blog.csdn.net/guolin_blog/article/details/17656437)

[Connecting to the Network--Google](http://developer.android.com/training/basics/network-ops/connecting.html)

[Transmitting Network Data Using Volley--Google](http://developer.android.com/training/volley/index.html)

[Android异步加载](http://android-developers.blogspot.jp/2010/07/multithreading-for-performance.html)

[android 异步http请求服务器（解析json）](http://quhaichao.diandian.com/post/2012-10-31/40041758091)

[Python写爬虫——抓取网页并解析HTML](http://www.lovelucy.info/python-crawl-pages.html)

[解析html与xhtml的神器——HTMLParser与SGMLParser](http://www.cnblogs.com/sysu-blackbear/p/3639600.html)

[Beautiful Soup 4.2.0 文档](http://www.crummy.com/software/BeautifulSoup/bs4/doc/index.zh.html)

[HTMLParser — Simple HTML and XHTML parser](https://docs.python.org/2/library/htmlparser.html?highlight=html)

[Python正则表达式操作指南](http://wiki.ubuntu.org.cn/Python正则表达式操作指南)

[python操作mysql数据库](http://www.w3cschool.cc/python/python-mysql.html)

[python操作MySQL数据库](http://www.cnblogs.com/rollenholt/archive/2012/05/29/2524327.html)

[【MYSQL数据库开发】](http://www.himigame.com/category/mysql)

[MySQL 教程](http://www.w3cschool.cc/mysql/mysql-tutorial.html)

[mysql数据类型](http://www.cnblogs.com/zbseoag/archive/2013/03/19/2970004.html)

[Android数据库高手秘籍](http://blog.csdn.net/column/details/android-database-pro.html)

[21分钟 MySQL 入门教程](http://www.cnblogs.com/mr-wid/archive/2013/05/09/3068229.html)

[Java 操作MySQL](http://www.cnblogs.com/harrysun/archive/2012/09/17/2688109.html)

[Ebean ORM](http://www.avaje.org)

[play framework 2.0 实战-Ebean](http://www.verydemo.com/demo_c161_i13234.html)
