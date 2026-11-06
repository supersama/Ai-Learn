#  数组去重
## 手写代码、业务场景题目
[1，2，3，4，5]

## 形式
- 完成功能的函数

## 函数注释
- 有利于协作 
  代码的开发者和使用者不是一个人
  避免忘记
  注释是代码的一部分
  注释提高代码的可读性

- 一个函数一个功能
- 封装 复杂功能
- 保证健壮性  校验参数

## 数组API
- Array.isArray ——判断是否是数组
- arr.indexOf(item)  ——返回值再数组中出现的下标
- filter 过滤(arr,function(item,index){
  //true item   留下
  //flase item  离开
  return ture/false
  })
- sort() 排序

## 时间复杂度和空间复杂度
O(n^2) 两重循环、filter、indexOf
O(nlogn) 排序 相邻
O(n) 空间换时间 对象字面量|HashMap