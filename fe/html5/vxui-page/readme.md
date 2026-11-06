# btn 页面
## 先写结构
- 优秀的套路

## 再写样式



## BEM 国际命名规范
- .page 页面
   开启一个区块 block
- 分上下两部分？
   .page_hd 头部
   .page_bd 主体
   hd、bd 是block 下的元素 elemnt
   block 和 element 之间用_ 分隔

## BEM优势
- 国际规范、大家都遵守
- 结构清晰  搭建盒模型方便
  - 有一个区块要表达 block
  - 有几个元素要表达 elements
- 简单易读
- 解决了写页命名难的问题
  最简单的英文单词，结构相关
  .page
    .page_hd
    .page_titile
   没有BEM命名规范，就要写三个单词

## css规则
- css reset 重置样式
  normalize.css
  * 是不用的 会列出要匹配的所有元素