---
layout: post
title: Freshman in Git
categories:
- 技术
tags:
- git
---

![git]({{ site.url }}/images/2014-04-21-freshman-in-git.png )

+ 关于Git的一些记录，详见：[Learn Version Control with Git](http://www.git-tower.com/learn/ebook/command-line/introduction#start)  
+ Git-简易指南：[点这里](http://www.bootcss.com/p/git-guide/)  
+ 我的github地址：[LUGEEK-github](https://github.com/lugeek)  

###小技巧###
`--help` 可以查看代码的指南。比如：`git add --help` 就会弹出帮助文档。

###初始化###
```bash
    YUMOR@YUMORTOO /f/Github/helloworld2
    $ git init
``` 
###ADD和COMMIT###
```bash
    YUMOR@YUMORTOO /f/Github/helloworld2 (master)
    $ touch test
    
    YUMOR@YUMORTOO /f/Github/helloworld2 (master)
    $ vim test
    
    YUMOR@YUMORTOO /f/Github/helloworld2 (master)
    $ cat test
    Hello world!
    
    YUMOR@YUMORTOO /f/Github/helloworld2 (master)
    $ git add test
    
    YUMOR@YUMORTOO /f/Github/helloworld2 (master)
    $ git status
    # On branch master
    # Changes to be committed:
    # (use "git reset HEAD <file>..." to unstage)
    #
    # modified: test
    #
    
    YUMOR@YUMORTOO /f/Github/helloworld2 (master)
    $ git commit -m "first commit"
    [master (root-commit) 1a7bc25] first commit
     1 file changed, 1 insertion(+)
     create mode 100644 test
    
    YUMOR@YUMORTOO /f/Github/helloworld2 (master)
    $ git log
    commit 1a7bc25558321d3803fb064ef8abc285e35398b2
    Author: Lugeek <goodlu@qq.com>
    Date:   Mon Apr 21 11:02:31 2014 +0800
    
        first commit
```
###PUSH###
```bash
    YUMOR@YUMORTOO /f/Github/helloworld2 (master)
    $ git remote add hw2 https://github.com/lugeek/helloworld2.git
    
    YUMOR@YUMORTOO /f/Github/helloworld2 (master)
    $ git remote -v
    hw2     https://github.com/lugeek/helloworld2.git (fetch)
    hw2     https://github.com/lugeek/helloworld2.git (push)
    origin
    
    YUMOR@YUMORTOO /f/Github/helloworld2 (master)
    $ git push hw2 master
    Counting objects: 3, done.
    Writing objects: 100% (3/3), 212 bytes | 0 bytes/s, done.
    Total 3 (delta 0), reused 0 (delta 0)
    To https://github.com/lugeek/helloworld2.git
     * [new branch]      master -> master
```
###CLONE###
```bash
    YUMOR@YUMORTOO /f/Github
    $ git clone https://github.com/lugeek/helloworld2.git
    Cloning into 'helloworld2'...
    remote: Counting objects: 3, done.
    remote: Total 3 (delta 0), reused 3 (delta 0)
    Unpacking objects: 100% (3/3), done.
    Checking connectivity... done
    
    YUMOR@YUMORTOO /f/Github
    $ ls
    helloworld2/
```
###branch###
```bash
    YUMOR@YUMORTOO /f/Github/helloworld2 (master)
    $ git branch make-readme
    
    YUMOR@YUMORTOO /f/Github/helloworld2 (master)
    $ git branch -va
      make-readme           1a7bc25 first commit
    * master                1a7bc25 first commit
      remotes/origin/HEAD   -> origin/master
      remotes/origin/master 1a7bc25 first commit
    
    YUMOR@YUMORTOO /f/Github/helloworld2 (master)
    $ git status
    # On branch master
    # Changes to be committed:
    #   (use "git reset HEAD <file>..." to unstage)
    #
    #       modified:   test
    #
    
    YUMOR@YUMORTOO /f/Github/helloworld2 (master)
    $ git stash
    Saved working directory and index state WIP on master: 1a7bc25 first commit
    HEAD is now at 1a7bc25 first commit
    
    YUMOR@YUMORTOO /f/Github/helloworld2 (master)
    $ git status
    # On branch master
    nothing to commit, working directory clean
    
    YUMOR@YUMORTOO /f/Github/helloworld2 (master)
    $ git stash list
    stash@{0}: WIP on master: 1a7bc25 first commit
    
    YUMOR@YUMORTOO /f/Github/helloworld2 (master)
    $ git checkout make-readme
    Switched to branch 'make-readme'
    
    YUMOR@YUMORTOO /f/Github/helloworld2 (make-readme)
    $ touch README
    
    YUMOR@YUMORTOO /f/Github/helloworld2 (make-readme)
    $ vim README
    
    YUMOR@YUMORTOO /f/Github/helloworld2 (make-readme)
    $ git add README
    
    YUMOR@YUMORTOO /f/Github/helloworld2 (make-readme)
    $ git commit -m "branch commit"
    [make-readme d2aa53a] branch commit
     1 file changed, 1 insertion(+)
     create mode 100644 README
    
    YUMOR@YUMORTOO /f/Github/helloworld2 (make-readme)
    $ git log
    commit d2aa53a9e78e4259cfd4c6a5ad87a050b7125228
    Author: Lugeek <goodlu@qq.com>
    Date:   Mon Apr 21 13:42:00 2014 +0800
    
        branch commit
    
    commit 1a7bc25558321d3803fb064ef8abc285e35398b2
    Author: Lugeek <goodlu@qq.com>
    Date:   Mon Apr 21 11:02:31 2014 +0800
    
        first commit
    
    YUMOR@YUMORTOO /f/Github/helloworld2 (make-readme)
    $ git checkout master
    Switched to branch 'master'
    
    YUMOR@YUMORTOO /f/Github/helloworld2 (master)
    $ git log
    commit 1a7bc25558321d3803fb064ef8abc285e35398b2
    Author: Lugeek <goodlu@qq.com>
    Date:   Mon Apr 21 11:02:31 2014 +0800
    
        first commit
    
    YUMOR@YUMORTOO /f/Github/helloworld2 (master)
    $ git merge make-readme
    Updating 1a7bc25..d2aa53a
    Fast-forward
     README | 1 +
     1 file changed, 1 insertion(+)
     create mode 100644 README
    
    YUMOR@YUMORTOO /f/Github/helloworld2 (master)
    $ git log
    commit d2aa53a9e78e4259cfd4c6a5ad87a050b7125228
    Author: Lugeek <goodlu@qq.com>
    Date:   Mon Apr 21 13:42:00 2014 +0800
    
        branch commit
    
    commit 1a7bc25558321d3803fb064ef8abc285e35398b2
    Author: Lugeek <goodlu@qq.com>
    Date:   Mon Apr 21 11:02:31 2014 +0800
    
        first commit
```
 
原创文章，转载请注明出处：转自[LUGEEK](http://www.lugeek.com/)