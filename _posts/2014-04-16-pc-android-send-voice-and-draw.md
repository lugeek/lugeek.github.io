---
layout: post
title: PC端与Android端音频的实时传输与绘制波形
categories:
- 技术
tags:
- java
- android
---

![显示效果]({{ site.url }}/images/2014-04-16/pc-android-send-voice-and-draw.png)  
**摘要**：在PC端通过麦克风获取音频数据，并将音频数据通过UDP的方式实时地发送出去。在Android端接收PC端传送过来的音频数据，通过扬声器播放出来，并且绘制音频的波形图，对实时性要求非常高。

##PC端关键代码分析##
+ recordthread：

```java
class recordThread extends Thread{
    String hisIP = "192.168.23.108";//无线平板
	public recordThread(){
		super("录音线程");
	}
	TargetDataLine tDataLine;
	byte [] buf=new byte[1024];
	DatagramSocket socket=null;
	DatagramPacket packet=null;
	public void run()
	{
		try {
			socket=new DatagramSocket();
		} catch (SocketException e1) {
			e1.printStackTrace();
		}
		AudioFormat format = new AudioFormat(8000, 16, 1, true, false);
		DataLine.Info info = new DataLine.Info(TargetDataLine.class, format);
		try {
			tDataLine = (TargetDataLine) AudioSystem.getLine(info);
			tDataLine.open(format, tDataLine.getBufferSize());
		} catch (LineUnavailableException e1) {
			e1.printStackTrace();
		}
		tDataLine.start();
		while(Main.flag){
			int readnum = tDataLine.read(buf, 0, 1024);
			try
			{
				packet=new DatagramPacket(buf,buf.length,
									InetAddress.getByName(hisIP),20011);
				socket.send(packet);
			}
			catch(IOException e)
			{
			}
		}
		tDataLine.stop();
		tDataLine.close();
		tDataLine = null;	
	}
}
```
**分析：**  
这是一个PC端录音并发送的线程。  
第2行：我的Android接收端的IP，和我的PC在一个局域网内。  
第17~25行：AudioFormat记录了音频编码的一些参数，(8000, 16, 1, true, false)，采样率是8000Hz，每秒采样8000个点，然后采用了16比特的PCM编码，除了16比特之外还有8比特的编码，16比特量化更精准，所以音质也更好。数字1代表单声道MONO，此外数字2可以代表立体声STEREO，第四个参数true代表signed，false代表unsigned。最后一个false代表小端模式，true代表大端模式。tDataline初始化了音频输入设备，调用start启动。  
第27行：tDataline将麦克风捕捉到的音频数据（已经量化成数字音频，16bit编码，小端模式存储）存储到长度为1024的Byte数组当中，外面是一个死循环，也就是源源不断的将捕获的音频写入进去。byte是8bit的，一个16bit的数据需要两个8bit的byte进行存储，所以1024长度的byte数组实际存储的是512个量化后后的音频数据。  
第30~32行：在获得一个1024长度的byte数组之后，就通过socket来发送出去了。packet是负责将数据打包的，并附上目的ip地址和端口号，打包之后就通过socket来send出去了。不停地产生byte数组，然后不停地发送出去。  

+ wavthread：

```java
class wavthread extends Thread{
	String hisIP = "192.168.23.108";    //无线平板
	public wavthread(){
		super("wav线程");
	}
	byte [] buf=new byte[1024];
	DatagramSocket socket=null;
	DatagramPacket packet=null;
	AudioInputStream ais;
	DataInputStream dis;
	public void run(){
		try {
			socket = new DatagramSocket();
		} catch (SocketException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		try {
			ais = AudioSystem.getAudioInputStream(
                            new File("C:\\Users\\YUMOR\\Desktop\\sin.wav"));	
		} catch (UnsupportedAudioFileException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		dis = new DataInputStream(new BufferedInputStream(ais));
		while(Main.flag){
			try {
				int readresult = dis.read(buf,0,1024);
				if(readresult==-1){
					break;
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
			try {
				packet=new DatagramPacket(buf,buf.length,
                                    InetAddress.getByName(hisIP),20011);
				socket.send(packet);
			} catch (UnknownHostException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}	
		}
		ais = null;
		dis = null;
	}
}
```
这是读取本地wav波形并将数据发送出去，原理同recordthread。  

##Android端代码分析##
Android端是负责接收的，所以定义了一个接收线程playthread。

```java
class playthread extends Thread{
	public playthread(){
		super("语音播放线程");
	}
	byte [] buf=new byte[1024];
	DatagramSocket socket=null;
	DatagramPacket packet=null;
	public void run()
	{
		try
		{		
			socket=new DatagramSocket(20011);
			packet=new DatagramPacket(buf,buf.length);
		}
		catch(Exception f)
		{
		}
		while(MainActivity.flag)
		{			
			try
			{			
				socket.receive(packet);
				MainActivity.audioTrack.write(packet.getData(), 0,
                                    packet.getData().length);
				MySurfaceView.update(packet.getData());
			}
			catch(IOException e)
			{
			}
		}
	}
}
```
socket在20011端口监听从pc端发来的数据，通过死循环来receive packet。AudioTrack是播放用的，它的优点在于实时播放，通过write来不停地写入实现播放。与它对应的有AudioRecord，是用来录音的，在这里我只用到了AudioTrack。播放之后调用MySurfaceView的update方法将数据再传递给画图的类。  

```java
public static void update(byte[] bytes){
		mShort[0] = 0;
		for (int i = 0; i < mShort.length-1; i++) {
			mPoints[4*i] = i/(float)512*tableW+initx;
			mPoints[4*i+1] = inity+mShort[i]/(float)65535*(tableH/2);
			int high = bytes[2*(i+1)+1];
			int low = bytes[2*(i+1)];
			mShort[i+1] = (short) ((high << 8) + (low & 0x00ff));
			mPoints[4*i+2] = (i+1)/(float)512*tableW+initx;
			mPoints[4*i+3] = inity+mShort[i+1]/(float)65535*(tableH/2);
		}
		draw();
}
```
在update里面，接收1024长度的byte数组，其中mShort是一个512长度的Short类型数组，之前已经提到过了，两个8bit的byte组成一个16bit的short，所以要进行转化。两个8bit的byte分高低位，将高位和低位分别取出来之后，高位左移8位xxxxxxxx00000000，然后低位与上0000000011111111变成00000000xxxxxxxx，然后相加之后变成了一个16bit的数了。mPoints是因为画图需要，一条线是有两个点确定，一个点是两个坐标值，所以一条线是4个坐标值，每一个数对应一条线，所以又做了一系列的变化，其中还涉及到一些平移操作，是为了显示到一定区域内。数据都初始化之后，调用draw画图。  

```java
private static void draw(){
    	try {
    		canvas = sfh.lockCanvas(new Rect(0, 0, ScreenW, ScreenH));	
		canvas.drawColor(Color.TRANSPARENT,Mode.CLEAR);
                canvas.drawLines(mPoints, mPaint);  //mPoints每4个点绘制一条线
		} catch (Exception e) {
		} finally {
			if (canvas != null){
				sfh.unlockCanvasAndPost(canvas);
			}
		}
}
```
draw方法很简单，锁定画布，然后通过drawlines画多条线，unlockCanvasAndPost来提交画布完成画线。 
 
**原创文章，转载请注明出处：转自[LUGEEK](http://lugeek.com)**