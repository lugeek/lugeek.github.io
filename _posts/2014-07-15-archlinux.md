---
layout: post
title: ArchLinux 安装记录
categories: 技术
tags: Linux
---

![archlinux]({{ site.url }}/images/2014-07-15-archlinux.jpg)

###usbwriter 把archLinux的iso写入到U盘，重启安装。
###安装程序会自动运行 dhcpcd 守护进程以尝试有线连接。可以用 ping 来检查是否连通。
###有线的静态IP。
1. `# systemctl stop dhcpcd`  
   停止dhcp。
2. `# ip link`  
   查看有线的interface。en开头。
3. `# ip link set enp2s0f0 up`  
   激活接口。
4. `# ip addr add 192.168.1.2/24 dev enp2s0f0`  
   添加ip地址和掩码长度。
5. `# ip route add default via 192.168.1.1`  
   添加网关地址。
6. 修改dns。
```bash
    # nano /etc/resolv.conf
    nameserver 223.5.5.5
    nameserver 223.6.6.6
```

###无线连接。
1. 确定无线网络的端口。  

        # iw dev
            phy#0
            Interface wlp3s0
                    ifindex 3
                    wdev 0x1
                    addr 00:21:6a:5e:52:bc
                    type managed

2. `wifi-menu`  
   进行连接。
3. 若`wifi-menu`不成功，可采用以下方法。  
   `# ip link set wlp3s0 up`  
   激活无线接口。  
   `# ip link show wlp3s0`  
   显示`UP`表示激活成功。  
   `iw dev wlp3s0 scan | grep SSID`  
   扫描无线ssid。  
   `# wpa_supplicant -B -i wlp3s0 -c <(wpa_passphrase "ssid" "psk")`  
   将 ssid 替换为实际的网络名称，psk 替换为无线密码，请保留引号。  
   `# dhcpcd wlp3s0`  
   进行连接。

### 分区并挂载。
1. `fdisk -l` 和 `lsblk -f` 可用于查看分区情况。
2. `# fdisk /dev/sda`  
   采用fdisk进行分区。
3. 出现`Command (m for help):` 进行分区。输入 `p` 可查看缓存的分区情况。  
4. `n`+`回车`+`+200M` 产生200M的分区。用于/boot分区。
5. `n`+`回车`+`+2G` 用于SWAP。
6. `n`+`回车`+`+50G` 用于根目录/。
7. `n`+`回车`+`回车` 用于/home目录。
8. `w`保存分区。
9. The partition table has been altered!  
   Calling ioctl() to re-read partition table.  
   Syncing disks.   
   表示分区成功。
10. `fdisk -l`  
   查看刚刚所分的区的sda编号。
11. 创建文件系统。
12. `# mkfs.ext4 /dev/sda5`
13. `# mkswap /dev/sda6`  
    `# swapon /dev/sda6`
14. `# mkfs.ext4 /dev/sda7`
15. `# mkfs.ext4 /dev/sda8`
16. 挂载文件系统。
17. `# mount /dev/sda7 /mnt`  
    首先挂载根分区。
18. `# mkdir /mnt/boot`  
    `# mount /dev/sda5 /mnt/boot`
19. `# mkdir /mnt/home`  
    `# mount /dev/sda8 /mnt/home`

###改镜像源
    nano /etc/pacman.d/mirrorlist
    ##
    ## Arch Linux repository mirrorlist
    ## Sorted by mirror score from mirror status page
    ## Generated on 2012-MM-DD
    ##
    Server = http://mirrors.tuna.tsinghua.edu.cn/archlinux/$repo/os/$arch
    ...
将中国的源都复制到最前面。  
`pacman -Syy`更新源。

### 安装基本系统。
`# pacstrap -i /mnt base base-devel`

### 生成fstab。
`# genfstab -U -p /mnt >> /mnt/etc/fstab`  
`# nano /mnt/etc/fstab`  
查看是否写入成功。

### Chroot 并开始配置新系统。
`# arch-chroot /mnt /bin/bash`  

1. locale配置。

        # nano /etc/locale.gen  
    > ...  
    > \#en_SG ISO-8859-1  
    > en_US.UTF-8 UTF-8  
    > \#en_US ISO-8859-1  
    > ...  
        
    可以把zh_CN的都去掉注释。en_US.UTF-8也注释掉。  
    `# locale-gen`  
    重新生成。  
    `# echo LANG=en_US.UTF-8 > /etc/locale.conf`  
    修改语言为英文，改为中文的话终端中可能会出现乱码。  
    
2. 时区。  
   `# ln -s /usr/share/zoneinfo/Asia/Shanghai /etc/localtime`

3. 时间。  
   `# hwclock --systohc --utc`  
   硬件时间。
   
4. Hostname。  
   `# echo myhostname > /etc/hostname`  
   `# nano /etc/hosts`  
   >\#  
   \# /etc/hosts: static lookup table for host names  
   \#  
   \#<ip-address>	<hostname.domain.org>	<hostname>  
   127.0.0.1	localhost.localdomain	localhost	myhostname  
   ::1		    localhost.localdomain	localhost   myhostname  
   \# End of file
   
5. 配置网络。  
   enable之后下次开机将自启动。  
   **注意**: 在采用有线网络时，由于是校园网的关系，采用网页认证的方式，在命令行进行`pacman -Syy`时会造成下载多余的sig包，产生no data的错误。在校园网通过无线路由器转换后错误消失。在完成桌面打安装后，连接有线网，然后打开浏览器确定可以上网，在这样打情况下，`pacman -Syy`没有产生错误.所以在桌面环境安装好之前不建议使用需要认证的校园有线网。
    1. 有线动态  
       `# systemctl enable dhcpcd@interface_name.service`
    2. 有线动态netctl  
       从 /etc/netctl/examples 复制个配置样本到 /etc/netctl:  
	   `# cd /etc/netctl`  
	   `# cp examples/ethernet-dhcp my_network`  
	   再按需编辑配置文件，也别忘了修改 Interface 为实际的接口名。  
	   `# nano my_network`  
	   启用 my_network 配置：  
	   `# netctl enable my_network`
	3. 有线静态netctl  
	   从 /etc/netctl/examples 复制个配置样本到 /etc/netctl:  
	   ` # cd /etc/netctl`  
	   `# cp examples/ethernet-static my_network`  
	   按需配置配置文件，即修改 Interface, Address, Gateway 和 DNS) 参数：  
	   ` # nano my_network`  
	   Address中的 /24 为掩码 255.255.255.0 的 CIDR 标记方式。  
	   启用 my_network 配置：  
	   `# netctl enable my_network`
	4. 无线wifi-menu  
	   `# pacman -S dialog iw wpa_supplicant`  
	   `# wifi-menu`
	5. 无线netctl  
	   安装必要的包  
	   `pacman -S iw wpa_supplicant wpa_actiond net-tools`  
	   从 /etc/netctl/examples 复制个配置样本到 /etc/netctl:  
	   `# cd /etc/netctl`  
	   `# cp examples/wireless-wpa my_network`  
	   按照需要修改模版，即参数 (Interface、ESSID 与 Key):  
	   `# nano my_network`  
	   自动启动：  
	   `# netctl enable my_network`
6. 设置 Root 密码  
   `# passwd`
7. 安装grub  
   `# pacman -S grub`  
   >通过添加--grub-setup=/bin/true选项,grub-install命令会填充/boot/grub文件夹并生成/boot/grub/i386-pc/core.img,但是不会将grub启动引导代码嵌入到MBR,post-MBR gap和分区引导扇区中:
    
    `# grub-install --target=i386-pc --grub-setup=/bin/true --recheck --debug /dev/sda`  
    `# grub-mkconfig -o /boot/grub/grub.cfg`  
    生成配置文件。  

8. 离开 chroot 环境：  
   `# exit`  
   重启计算机：  
   `# reboot`
   
###用easyBCD配置启动引导，选择Grub 2，将boot分区添加为启动项

###现在开机可以进入archLinux的命令行界面了，开始配置Archlinux。
1. 语言和字体  
   `/etc/locale.conf`改成`LANG=zh_CN.UTF-8`  
   `pacman -S ttf-dejavu wqy-microhei wqy-zenhei`  
   重启解决字体和语言.  
2. yaourt  
   `/etc/pacman.conf` 中加入：
   >[archlinuxfr]  
   SigLevel = Never  
   Server = http://repo.archlinux.fr/$arch  
   [archlinuxcn]  
   SigLevel = Never  
   Server = http://repo.archlinuxcn.org/$arch  

    `pacman -Syy`  
    `pacman -S yaourt`  
    
3. 浏览器  
    `pacman -S firefox firefox-i18n-zh-cn flashplugin`  
    火狐浏览器  
    `yaourt google-chrome`
    谷歌浏览器（此外还有chromium），谷歌浏览器集成了flash和pdf。
4. 输入法  
    `pacman -S fcitx-im`  
    安装输入法  
    
    >如果你采用 KDM、GDM、LightDM 等显示管理器，请在~/.xprofile (没有则新建一个)中加入如下3行，如果你采用 startx 或者 Slim 启动 （即使用.xinitrc的场合），则在 ~/.xinitrc 中加入：  
    export GTK_IM_MODULE=fcitx  
    export QT_IM_MODULE=fcitx  
    export XMODIFIERS="@im=fcitx"  
    
    **注意**：这三行必须加在exec之前，因为exec后面的代码都不会执行。
    
5. NetworkManager  
    `pacman -S networkmanager`  
    安装  
    `pacman -S network-manager-applet xfce4-notifyd`  
    XFCE安装状态栏插件  
    `netctl stop mynetwork`  
    `netctl disable mynetwork`  
    取消其他的网络服务，防止冲突。  
    `systemctl enable NetworkManager`  
    `systemctl start NetworkManager`  
    开启networkmanager

6. 声卡驱动  
    `pacman -S alsa-lib alsa-utils alsa-oss`  
    安装alsa声卡管理  
    `alsamixer`  
    管理声音，上下左右移动箭头，esc退出，移到master按M取消静音，按向上增加音量。按F4,对capture按空格键开启麦克风。
    
7. 调整时间  
    `hwclock --systohc --utc`  
    硬件时间。改成utc时间之后时间会快8小时。  
    `nano /etc/localtime`  
    把最后一个CST-8改成CST-0，重启时间就对了。  
8. goagent  
    `pacman -S goagent`  
    打开 /etc/goagent (默认情况下该文件为空), 增加类似下面的段落:  
    
    >[gae]  
    appid = your_appid  
    password = yourpassword  
    
    浏览器SwitchySharp导入配置  
    `导入导出`->`从文件恢复`->`/usr/share/goagent/local/SwitchyOptions.bak`  
    `systemctl start goagent`  
    开启goagent  
    chrome打开设置－管理证书－授权中心－Authorities，导入 /usr/share/goagent/local/CA.crt，弹出窗口的三条选项均勾选。  
    注意: 如果第一次安装 GoAgent 尝试到此步骤时发现该文件不存在，请先启动一次 GoAgent 后再重新尝试。
    
9. 聊天pidgin  
    `pacman -S pidgin`  
    安装皮筋  
    `pacman -S pidgin-lwqq`  
    安装webqq协议  
10. JDK和Phonon库  
    `pacman -S phonon-qt4-gstreamer`  
    后端库，libreoffice以及其他一些软件的依赖
    `pacman -S jdk7-openjdk jre7-openjdk`  
    安装JDK  
    在`/etc/profile`打path中有`PATH="/usr/local/sbin:/usr/local/bin:/usr/bin"`而java的一些工具已经在这些目录里了，所以不用添加环境变量。
11. libreoffice  
    `# pacman -S ttf-dejavu artwiz-fonts`  
    安装字体  
    `pacman -S libreoffice`  
    安装libreoffice并安装中文字体包（108）  
12. pdf  
    其实google-chrome已经可以看pdf了，现在安装另外一个pdf阅读器evince  
    `pacman -S evince`  
13. 编辑器emacs  
    `pacman -S emacs`  
    在终端下 `emacs -nw` 打开emacs  
    `emacs --daemon` 加入守护进程，提高速度。  
    `emacsclient -nw` 或终端下 `emacsclient -t` 打开加入守护进程打emacs   
    `pacman -S gedit`菜鸟编辑器…
14. 视频播放器  
    `pacman -S mplayer`  
    但是这个播放器貌似只具有最基础的播放功能，没有其他功能。  
    `pacman -S smplayer`  
    smplayer是mplayer打图形前端，一个完整好用打播放器。
15. 日历插件  
    `pacman -S orage`  
    xfce默认打日历小插件，带记事功能。
16. 桌面小部件conky  
    `pacman -S conky`  
    显示当前电脑运行信息在桌面上。  
    `nano /etc/conky/conky.conf`  
    配置conky的配置文件。配置文件如下：  
    ps. 注意里面打网络接口，可以通过`ip link`查看，替换掉`enp9s0`和`wlp5s0`。  
    
        alignment top_right
        #右上角对齐
        background no
        border_width 1
        #边界宽度
        cpu_avg_samples 2
        #cpu监测模式，一般2
        default_color #66CCFF
        #默认颜色
        default_outline_color white
        #默认外边框颜色
        default_shade_color white
        #默认阴影颜色
        draw_borders no
        #外边框
        draw_graph_borders yes
        #图形边框
        draw_outline no
        #字体边框
        draw_shades no
        #字体阴影
        use_xft yes
        #抗锯齿
        xftfont DejaVu Sans Mono:size=9
        gap_x 5
        #左右边距间隔
        gap_y 60
        #上下边距间隔
        minimum_size 5 5
        #最小宽度和高度
        net_avg_samples 2
        #网络传输平均数据监测
        no_buffers yes
        #从内存中清空文件系统缓存
        out_to_console no
        out_to_stderr no
        #取消输出日志
        extra_newline no
        own_window yes
        #own_window_type normal
        own_window_transparent true
        own_window_hints undecorated,below,skip_taskbar,skip_paper
        #桌面窗口透明
        double_buffer yes
        #消除闪烁
        stippled_borders 0
        update_interval 2.0
        #更新间隔
        uppercase no
        #取消大写锁定
        use_spacer none
        show_graph_scale no
        show_graph_range no
        #频谱图最大数值和时间范围关闭
        short_units yes
        #缩写
        
        TEXT
        ${color #66CCFF}$nodename - $sysname $kernel on $machine $color
        ${font Monospace}${color #66CCFF}${time %F %a %T} $color$font
        ${color #66CCFF}Uptime: $uptime $color
        ${color #66CCFF}$hr$color
        ${color #66CCFF}CPU: ${freq}Mhz $cpu% ${acpitemp}C ${cpubar 4} $color
        ${color #66CCFF}${cpugraph 000000 66CCFF}$color
        ${color #66CCFF}Name               PID    CPU%   MEM%$color
        ${color #0000FF} ${top name 1} ${top pid 1} ${top cpu 1} ${top mem 1}$color
        ${color #0033FF} ${top name 2} ${top pid 2} ${top cpu 2} ${top mem 2}$color
        ${color #0066FF} ${top name 3} ${top pid 3} ${top cpu 3} ${top mem 3}$color
        ${color #0099FF} ${top name 4} ${top pid 4} ${top cpu 4} ${top mem 4}$color
        ${color #66CCFF}$hr$color
        ${color #66CCFF}RAM: $mem/$memmax - $memperc% ${membar 4} $color
        ${color #66CCFF}Name               PID    CPU%   MEM%$color
        ${color #0000FF} ${top_mem name 1} ${top_mem pid 1} ${top_mem cpu 1} ${top_mem mem 1}$color
        ${color #0033FF} ${top_mem name 2} ${top_mem pid 2} ${top_mem cpu 2} ${top_mem mem 2}$color
        ${color #0066FF} ${top_mem name 3} ${top_mem pid 3} ${top_mem cpu 3} ${top_mem mem 3}$color
        ${color #0099FF} ${top_mem name 4} ${top_mem pid 4} ${top_mem cpu 4} ${top_mem mem 4}$color
        ${color #66CCFF}$hr$color
        ${color #66CCFF}Swap Usage: $swap/$swapmax - $swapperc% ${swapbar 4} $color
        ${color #66CCFF}/ ${fs_used /}/${fs_size /} ${fs_bar 4 /} $color
        ${color #66CCFF}/home ${fs_used /home}/${fs_size /home} ${fs_bar 4 /home} $color
        ${color #66CCFF}$hr$color
        ${if_match "${addr enp9s0}"!="No Address"}${color #66CCFF}IP:${addr enp9s0}$color
        ${color #66CCFF}Up:${upspeed enp9s0}                 Down:${downspeed enp9s0} $color
        ${color #66CCFF}${upspeedgraph enp9s0 30,150 00CC00 00CCFF} ${downspeedgraph enp9s0 30,150 00CCFF 00CC00}$endif$color
        ${if_match "${addr wlp5s0}"!="No Address"}${color #66CCFF}IP:${addr wlp5s0}$color
        ${color #66CCFF}${wireless_essid wlp5s0}-${wireless_bitrate wlp5s0}-${wireless_link_qual_perc wlp5s0}% ${wireless_link_bar wlp5s0}$color 
        ${color #66CCFF}Up:${upspeed wlp5s0}                 Down:${downspeed wlp5s0} $color
        ${color #66CCFF}${upspeedgraph wlp5s0 30,150 00CC00 00CCFF} ${downspeedgraph wlp5s0 30,150 00CCFF 00CC00}${endif}$color
        #$hr
        #${font Monospace:size=8}${color #66CCFF}${rss http://feed.feedsky.com/my_cnbeta 5 item_titles 10}$color $font
        #$hr
        
17. ntfs文件读取  
    `pacman -S ntfs-3g`  
    `sudo mkdir /mnt/win7d`  
    `sudo mkdir /mnt/win7e`  
    `sudo ntfs-3g /dev/sda2 /mnt/win7d`  
    `sudo ntfs-3g /dev/sda3 /mnt/win7e`  
18. 解压  
    `pacman -S unzip`  
    `pacman -S unrar`  
19. 音乐播放器  
    `pacman -S audacious`  
20. 图片处理  
    `pacman -S gimp`
21. Android开发环境  
    `sudo nano /etc/pacman.conf`  
    
    >[multilib]  
    Include = /etc/pacman.d/mirrorlist
    
    把上面两行注释去掉，因为android-sdk是32位的，在64位的机子上需要multilib的支持。  
    `sudo pacman -Syy`  
    多了multilib的库，刷新列表。  
    `yaourt eclipse-android`  
    自动安装如下依赖的最新版  
    
    >android-sdk>=r23.0.2  
    eclipse>=3.7.2  
    eclipse-wtp  
    java-environment>=6  
    
    **警告**:如果你用 Eclipse 中的插件管理器安装插件，建议使用 root 账户启动 Eclipse。这样插件会安装到/usr/share/eclipse/plugins/；如果用普通账户安装，会安装到 ~/.eclipse/ 中的与版本号相关的文件夹中，因此升级 Eclipse 之后就找不到这些插件了。不要用 root 账户使用 Eclipse 来进行日常工作。  
    `nano /etc/profile`  
    配置环境变量。  
    
    >\# Set our default path  
        ANDROID="/opt/android-sdk/tools"  
        PATH="/usr/local/sbin:/usr/local/bin:/usr/bin"  
        export PATH  
        export ANDROID  
        
    `sudo chown -R $USER /opt/android-sdk`  
    变更所有者。  
    `# groupadd android`  
    创建组。  
    `# gpasswd -a $USER android`  
    添加组。  
    `# chgrp -R android /opt/android-sdk`  
    `# chmod -R g+w /opt/android-sdk`  
    `# find /opt/android-sdk -type d -exec chmod g+s {} \;`  
    添加权限。
    `$ android`
    可以打开sdkmanager了。  
    `yaourt android-sdk-platform-tools`  
    包含adb等工具，其实通过sdkmanager来安装这个应该也可以的。  
    `ANDROID="/opt/android-sdk/tools：/opt/android-sdk/platform-tools/"`  
    修改环境变量。  
    `yaourt android-udev`   
    相当于安卓设备的驱动，只是一些常用打驱动。  
    `yaourt android-studio`  
    android studio.  

22. Jekyll本地环境  
    `pacman -S ruby`  
    安装最新版的ruby。  
    PATH="`ruby -rubygems -e 'puts Gem.user_dir'`/bin:$PATH"   
    环境变量加在~/.bashrc。但是没加也能用gem,所以暂时没加。  
    `gem sources list`  
    `gem sources -a http://ruby.taobao.org/`  
    `gem sources --remove https://rubygems.org/`  
    更换gem的源。  
    `gem install github-pages`  
    安装github-pages的包。  
    
    >RUBYGEM="/home/lugeek/.gem/ruby/2.1.0/bin"  
    export RUBYGEM  
    
    把上面两行加到环境变量/etc/profile中，因为gem安装了像jekyll这样的可执行命令，所以需要把这个文件加到环境变量中，这是gem通过普通用户来安装的方式，如果通过root的方式来安装，添加环境变量的方式就不一样了，再查看Ruby的wiki吧。  
    **警告**: 通过上面的方式添加环境变量，jekyll还是无法在命令行执行。然后发现另外两种可行方法。第一种是在/etc/profile的PATH后面追加~/.gem/ruby/2.1.0/bin 第二种是在~/.bashrc中建立链接，`alias jekyll='~/.gem/ruby/2.1.0/bin/jekyll'` 。  
    
23. Git安装  
    `pacman -S git`  
    `pacman -S tk`  
    图形界面  
    在~/.bashrc文件中添加如下内容以启用自动补全功能：  
    `source /usr/share/git/completion/git-completion.bash`  
24. 解压缩小插件  
    `pacman -S thunar-archive-plugin`  
    只是接口  
    `pacman -S xarchiver`  
    解压管理  
    `pacman -S p7zip`  
    增加7z支持  
    之前已经安装了unzip和unrar。  
    右击压缩包或者双击压缩包都得到了相关的支持，windows保留的习惯……  
25. 即插即用  
    `pacman -S gvfs`  
    虚拟文件系统  
    `pacman -S thunar-volman`  
    可移动存储设备支持，需要在设置里将可移动驱动器和介质的相应选项打勾  
    `pacman -S gvfs-afc gvfs-smb gvfs-gphoto2 gvfs-afp gvfs-mtp`  
    添加各种移动设备支持。  
    
    >gvfs-afc: AFC (mobile devices) support  
    gvfs-smb: SMB/CIFS (Windows client) support  
    gvfs-gphoto2: gphoto2 (PTP camera/MTP media player) support  
    gvfs-afp: Apple Filing Protocol (AFP) support  
    gvfs-mtp: MTP device support  
    gvfs-goa: gnome-online-accounts support  
    
    重启之后插上手机能管理手机文件了，nexus是以MTP的形式挂载的。  
    但是出现了3个win7的ntfs文件格式的卷标，无法打开，gvfs难道不支持ntfs格式的挂载吗，我已经安装了ntfs-3g。  
    这个问题在网上听说是由slim登录管理器引起的，不想换掉slim，但是这些没用的卷标看着碍眼，只能将它们挂载了才会消失，所以通过fstab将它们自动挂载。/etc/fstab添加以下几行  
    
        # /dev/sda1
        UUID=C2681D41681D359F                           /mnt/win7c      ntfs-3g         defaults        0 0
        # /dev/sda2
        UUID=A6EC22B3EC227DA5                           /mnt/win7d      ntfs-3g         defaults        0 0
        # /dev/sda3
        UUID=725A6BEB5A6BAA95                           /mnt/win7e      ntfs-3g         defaults        0 0
        
    uuid可以通过lsblk -f 查看。
    
26. 截图  
    `pacman -S xfce4-screenshooter`  
27. markdown  
    `yaourt retext`  
    `yaourt python-markdown`  
    `yaourt python-docutils`   
    `yaourt python-pyenchant`  
    
28. pygments
    pygments是一款代码高亮工具，基于python，在jekyll中用到了它来使代码高亮。
    `pacman -S python-pygments`本地安装。  
    上述方法安装之后没有`pygmentize`,改用下面的方法。
    `yaourt -Rs python-pygments`  
    `pacman -S python2-pygments`  
    `pygmentize -S monokai -f html > pygments.css`  
    [查看更多style](http://pygments.org/demo/459224/?style=monokai)  
    
    
    

原创文章，转载请注明出处：转自[LUGEEK](http://lugeek.github.io)。