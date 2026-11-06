# Git 开发必备技能

- lcf_ai 目录是什么
项目开发目录
缺点？
 - 无法多人协作
 - 单机版本
   中央仓库（remote）  github/gitee/gitlab
   团队（分布在每个人的机器上 local）共享仓库的代码
   分布式 distribute
 - 文件 硬盘可能会坏  找到之前的修改
     版本的概念   
     一个文件 有不同的版本（快照）
 - 不够工程化 
 
## git init 
-  初始化
-  本地的代码项目目录升级为带有版本控制能力的代码仓库
-  目录下多了一个.git 文件夹（隐藏）
     面试提问：
     1.除了在文件夹里查看快照，还有什么方式能看到?
     可以用脚本命令： ls -all 
    （在mac里可以直接在vs终端里用，在windows里得在项目目录下启动 git bash，才能用）
    （补充：需要用 cd .git 进入.git文件夹再用ls -all 才能看到快照）
     ps: git bash --最简版的linux
     2.为什么.git文件是隐藏文件
     因为这个文件不能乱改，需要按照git要求来执行
     
## git add 文件名
-  将read.me 添加进暂存区（stage）
   2 insertions 2行新增 严谨 中途休息、离场

## git status
-  任何你需要清楚当前仓库的状态的时候
-  任何关键时刻 先git status

##  git commit -m'描述'
    把stage区的文件加入到仓库区
-m  --说明 不能乱写 leader 主要看这个
    最终添加到仓库中

## 为什么要用两条命令把文件添加到仓库？
   - 完成某项功能，需要 idex.html common.css common.js
   stage 暂存区 可以多次添加 不会带来仓库版本的改变
   git add index.html
   git add common.css
   git add common.js
   提前后悔一下 



## 文件状态
- untracted    未跟踪状态（红字警告 不可提交 可以用git add 加入stage 然后红字消失）
- to be commit 待提交 （绿字 可提交）
- add 多次， commit 一次（开发任务时）

ps：要保证仓库的干净

- add a repo （repo 远程仓库）
