# Generative AI
英伟达证书

- apiKey
  - gitignore + .env
- npm init -y
  初始化node 项目 package.json

- npm i openai
  安装openai模块 事实标准
  - 安装需要花时间 占空间
  - pnpm
  只需要安装一次，在不同的项目中软链接

  npm install -g pnpm
  - gitignore
    git 提交可以忽略的文件申明
    apiKey 不能提交
    留在本地
    写在.env文件中，.gitignore中忽略 .env文件
  - apiKey 读取进来的流程
   - dotenv库 默认读取根目录下的 .env 文件
     .env 文件有格式要求
     key(大写)=value 换行
     读取到process 进程对象中
     .env文件就是环境变量的配置文件
     .gitignore 中忽略 .env文件 本地跑，远程不提交
     process 全局对象
   