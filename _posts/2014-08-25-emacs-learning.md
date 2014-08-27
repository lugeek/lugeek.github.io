---
layout: post
title: Emacs 速查笔记
categories: 技术
tags: Emacs
---

![emacs]({{ site.url }}/images/2014-08-25-emacs-learning.png)

##常用
+ `ctrl+p`: 光标上移
+ `ctrl+n`：光标下移
+ `ctrl+f`：光标右移
+ `ctrl+b`：光标左移
+ `ctrl+v`：下一页
+ `alt+v`：上一页
+ `ctrl+a`：行头
+ `ctrl+e`：行尾
+ `alt+<`：文章头
+ `alt+>`:文章尾
+ `ctrl+z`：挂起最小化
+ `Backspace`：删除左边的字符
+ `alt+d`： 删除光标后面的字符
+ `ctrl+d`：删除光标上的字符
+ `ctrl+k`：剪切整行
+ `ctrl+y`：召回（粘贴）
+ `ctrl+@`: 进入选中模式
+ `ctrl+shift+方向键`：选中文字
+ `ctrl+x ctrl+x`：检查选中的文字
+ `alt+h`：快速选中段落
+ `ctrl+x h`：全选
+ `ctrl+w`：剪切
+ `alt+w`：复制
+ `ctrl+u n`：重复n次操作
+ `ctrl+x u`：撤销
+ `ctrl+l`：重绘屏幕并以当前行为中心
+ `alt+q`：段落重排（段落前后有空白行）
+ `ctrl+t`：交换当前以及前面的字符（alt+t是词）
+ `alt+c`：首字母大写（加alt+-，更好用）
+ `alt+l`：全部小写
+ `alt+u`：全部大写
+ `ctrl+g`：命令终止
+ `ctrl+x ctrl+f`：打开文件
+ `ctrl+x ctrl+v`:重新打开
+ `ctrl+x ctrl+s`：保存文件
+ `ctrl+x s`：保存所有缓冲区文件
+ `ctrl+x ctrl+w`：另存为
+ `ctrl+x ctrl+f filename~ 回车`：打开存盘时的备份文件（再另存为filename即可恢复）
+ `alt+x revert-buffer 回车`：撤销自上次存盘之后的所有修改
+ `alt+x recover-file 回车`：恢复丢失的编辑修改
+ `ctrl+s`：查找（ctrl+s下一个，ctrl+r上一个）
+ `ctrl+s alt+y`：查找粘贴的内容
+ `alt+x replace-string 回车 a 回车 b 回车`：从光标开始查找并替换，全部a替换为b
+ `alt+%`：查询替换，按空格键或y替换，按n不替换，！对后面的内容全部替换不再询问，回车退出
+ `ctrl+x b`:切换编辑缓冲区，可用TAB补全
+ `ctrl+x ctrl+b`:查看编辑缓冲区清单,空格键下移，
    + 按`d`待删除
    + 按`s`待保存
    + 按`u`取消标记
    + 按`x`执行
    + 按`m`键待显示按v执行
    + 按`回车`打开
    + 按`%`改变读写状态
    + 按`1`将编辑缓冲区满屏显示
    + 按`o`（ctrl+o）在新建窗口打开
+ `ctrl+x k`：删除编辑缓冲区
+ `ctrl+x ctrl+q`：只读和读写模式切换
+ `ctrl+x 2`：上下分割两个窗口
+ `ctrl+x 3`：左右分割两个窗口
+ `ctrl+x 1`：只保留当前窗口
+ `ctrl+x 0`：删除当前窗口
+ `ctrl+x o`：切换到另一个窗口
+ `ctrl+x ^`：加高窗口
+ `alt+x shrink-window`：压低窗口
+ `ctrl+x }`：加宽窗口
+ `ctrl+x {`：变窄窗口
+ `ctrl+x -`：将窗口收缩至文本大小
+ `ctrl+x +`：平均分割所有窗口
+ `alt+ctrl+v`：卷动另一个窗口的文本
+ `alt+x compare-windows`：比较两个窗口的不同之处
+ `ctrl+x r m`：设置书签
+ `ctrl+x r b`：打开书签，可用TAB
+ `ctrl+x r l`：书签清单，按d待删除，按x执行，r重命名，s保存，m待显示v执行，
+ `alt+x bookmark-rename`：重命名书签
+ `alt+x bookmark-delete`：删除书签
+ `ctrl+x 5 2`：打开新的emacs
+ `ctrl+x 5 b`：在新的emacs中打开指定编辑缓冲区
+ `ctrl+x 5 f`：在新的emacs中查找并打开文件
+ `ctrl+x 5 o`：切换不同的emacs窗口
+ `ctrl+x 5 0`：关闭emacs窗口
+ `alt+！`：shell命令模式
+ `alt+|`：指定缓冲区域的命令模式
+ `ctrl+u alt+！`：将命令输出到emacs缓冲区域
+ `alt+x shell`：打开shell的编辑缓冲区，（alt+p，上一条命令）
+ `ctrl+x d`：打开目录清单Dired
    + 按`s`可以排序
    + `n`、`p`用来移动
    + `>`下一个目录，`<`上一个目录
    + 按`v`查看不能改（`s`查找，`q`或`ctrl+c`退出）
    + 按`e`或`f`编辑打开
    + `o`在新窗口打开
    + 按`d`待删除，按`D`立刻删除
    + 按`u`取消标记
    + `#`所有自动保存文件待删除，`～`所有备份文件待删除，`*`执行文件，`/`目录，`ctrl+u #`取消标记
    + `（数字）C`复制文件
    + `R`移动重命名
    + `Z`压缩与解压缩
    + `=`开启diff
    + `！`执行shell命令
    + `g`刷新
    + `m`添加待操作标记即选取多个文件
    + `alt+del`去掉待操作标记
    + `+`创建目录
    + `Q`查找替换
    + `q`退出Dired
+ `alt+x man 回车 命令 回车`：查man手册
+ `alt+x display-time`：显示时间
+ `alt+x calendar`：显示日历
+ `ctrl+x (`:宏定义
+ `ctrl+x ）`：宏定义结束，`ctrl+g`可以中断宏录制
+ `ctrl+x e`：执行宏
+ `alt+x name-last-kbd-macro`：给宏起名（`alt+x name`执行这个宏）
+ `(global-set-key "/C-x1" 'help-command)`:按键绑定，在.emacs中添加这一句。`ctrl+x 1`执行help-command这条命令。
+ `ctrl+h p`：查看已安装的Lisp程序

##编程

+ `alt+m`:在程序编写中，跳转到行首非空字符
+ `alt+^`：将当前行合并到上一行
+ `alt ctrl+/`：将选中的代码整形，感觉不好用，选中之后直接按tab可以完成缩进
+ `alt+;`：注释
+ `ctrl+;`：选择并粘贴
+ `ctrl+x ctrl+x`：选中当前行，并将光标头尾切换
+ `alt+j`：换行注释，拆分长注释
+ `alt+a`：移动到语句开头
+ `alt+e`：移动到语句结尾
+ `alt ctrl+a`：移动到函数开头
+ `alt ctrl+e`：移动到函数结尾
+ `alt ctrl+h`：选中整个函数（快捷键冲突）
+ `ctrl+c ctrl+a`：打开自动开始新行，c-toggle-auto-state
+ `ctrl+c ctrl+d`：开启饥饿的删除键，可以一下删除很多空格，命令名：c-toggle-hungry-state
+ `etags *.java`:在emacs的shell里面输入，建立函数标签表TAGS
+ `alt+x visit-tags-table`：选择TAGS，emacs活得函数标签表
+ `alt+.`：查找函数
+ `ctrl+x 4 .`：新窗口查找函数
+ `alt+，`：找下一个同名
+ `alt+x list-tags`：列出所有tags
+ `alt+x compile`:编译，默认编译命令`make k`，然后输入需要编译的文件，回车
    + `ctrl+x 反引号`：编译出错时移动到下一条错误信息并访问源代码
    + `alt+n`：下一条出错信息
    + `alt+p`：上一条出错信息
    + `ctrl+c ctrl+c`：访问对应当前错误信息的源代码

##java

+ `yaourt jdee`:安装jdee，没人维护，变成孤包了，依赖安装cedet、emacs-elib
+ `/usr/share/emacs/site-lisp`: emacs的一个主要目录
+ 还是算了吧，用emacs写java就是自虐，archlinux上面的jdee都没人维护了，安装困难…

##命令行

+ `emacs -nw`:命令行打开emacs
+ `ctrl+z`:挂起最小化，`fg`重新回到emacs
+ `ctrl+x ctrl+c`：退出emacs

##markdown

+ 将markdown-mode.el复制到~/.emacs.d/下面，在~/.emacs中添加

```lisp
    (autoload 'markdown-mode "markdown-mode"
       "Major mode for editing Markdown files" t)
    (add-to-list 'auto-mode-alist '("\\.text\\'" . markdown-mode))
    (add-to-list 'auto-mode-alist '("\\.markdown\\'" . markdown-mode))
    (add-to-list 'auto-mode-alist '("\\.md\\'" . markdown-mode))
```

+ `ctrl+c ctrl+c p`:转换为html文件并打开，可能会没有markdown支持，有两种办法:
    + `pacman -S markdown`:安装markdown
    + `ln -s markdown_py markdown`:在/usr/bin生成markdown的符号链接

##org-mode

+ `alt+x list-packages`:列出所有已安装的包
+ `*`:不同的数量表示不同级别的标题
+ `shift+tab`：标题折叠切换
+ `tab`：当前标题折叠切换
+ `ctrl+c ctrl+n/p`:移动到下一标题或上一标题
+ `ctrl+c ctrl+f/b`：移动到同级的下一标题或上一标题
+ `ctrl+c ctrl+j`：切换到大纲浏览状态
+ `alt+LEFT/RIGHT`：标题降级或升级
+ `alt+shift+LEFT/RIGHT`：子树降级或升级
+ `ctrl+x n s/w`：只显示当前子数/返回
+ `ctrl+c ctrl+x b`：在新缓冲区显示当前分支
+ `alt+x org-indent-mode`：大纲内容缩进(setq org-startup-indented t)
+ `ctrl+c ctrl+l`:创建链接
+ `ctrl+c ctrl+o`：打开链接
+ `*粗体*`
+ `/斜体/`
+ `+删除线+`
+ `_下划线_`
+ `下标： H_2 O`
+ `上标： E=mc^2`
+ `等宽字：  =git=  或者 ～git～`
+ `ctrl+c |`：创建表格，表头“|Name|Pone|Age”之后，按C-c RET生成表格，TAB移动新建，
+ 无序列表项以‘-’、‘+’或者‘*‘开头。
+ 有序列表项以‘1.’或者‘1)’开头。
+ `ctrl+c ctrl+e`：发表

##C/C++ 开发环境搭建
###package管理
```lisp
; start package.el with emacs
(require 'package)
; add MELPA to repository list
(add-to-list 'package-archives '("melpa" . "http://melpa.milkbox.net/packages/"))
; initialize package.el
(package-initialize)
```
ps.加了这个库之后，可以查看更多的包并安装

`alt+x package-list-packages`查看库中的包，可以选择安装，按i待安装，按x执行。

###auto-complete
1. `alt+x package-list-packages`
2. `ctrl+s`搜索auto-complete,用i标记，x安装
3. 修改~/.emacs,加入以下代码

        ; start auto-complete with emacs
        (require 'auto-complete)
        ; do default config for auto-complete
        (require 'auto-complete-config)
        (ac-config-default)
重启emacs，神奇的魔法诞生了，自动补全有了！

4. 同样的方式安装`yasnippet`
5. 配置~/.emacs

        ; start yasnippet with emacs
        (require 'yasnippet)
        (yas-global-mode 1)
yasnippet可以根据语义和语法结构进行补全，比如打`fo`按`TAB`就会出现选择，按`TAB`选择，回车，整个for结构就出来了。

6. 安装`auto-complete-c-headers`
7. `gcc -xc++ -E -v -`查看c++头文件所在的文件夹（感觉非必须）
8. 配置~/.emacs

        ; let's define a function which initializes auto-complete-c-headers and gets called for c/c++ hooks                                    
        (defun my:ac-c-header-init ()
          (require 'auto-complete-c-headers)
          (add-to-list 'ac-sources 'ac-source-c-headers)
          (add-to-list 'achead:include-directories '"/usr/lib/gcc/x86_64-unknown-linux-gnu/4.9.1/include")
        )
        ; now let's call this function from c/c++ hooks                                                                                        
        (add-hook 'c++-mode-hook 'my:ac-c-header-init)
        (add-hook 'c-mode-hook 'my:ac-c-header-init)
其中的路径就是通过第7步查看的，但是不加这一句，头文件照样可以自动不齐，可能非必须。

###cedet

1. Semantic（cedet中的一个，cedet已经内置），只需配置.emacs

        ; turn on Semantic
        (semantic-mode 1)
        ; let's define a function which adds semantic as a suggestion backend to auto complete
        ; and hook this function to c-mode-common-hook
        (defun my:add-semantic-to-autocomplete() 
          (add-to-list 'ac-sources 'ac-source-semantic)
        )
        (add-hook 'c-mode-common-hook 'my:add-semantic-to-autocomplete)
        (global-semantic-idle-scheduler-mode 1)
        
2. EDE

        ; turn on ede mode 
        (global-ede-mode 1)
        ; create a project for our program.
        (ede-cpp-root-project "my project" :file "~/demos/my_program/src/main.cpp"
        		      :include-path '("/../my_inc"))
        ; you can use system-include-path for setting up the system header file locations.
        ; turn on automatic reparsing of open buffers in semantic
        
