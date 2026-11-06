# 如何用栈模拟队列
数据结构
线性(栈、队列、链表)
非线性(树)
- 栈 stack
  FILO
- 队列 queue
  FIFO

push(x) 将一个元素放入队列的尾部
pop()   从队列首部移除元素
peek()  返回队列尾部的元素
empty() 返回队列是否为空

## JS的面向对象
- 不走寻常路
  不需要class 也可以完成面向对象
  函数是一等对象
  普通函数
  new + 构造函数
    this 指向新创建的对象
  原型式的面向对象
    js 没有类 只有对象 MyQueue 对象
    MyQueue.prototpye

## new 的过程
- 创建一个空对象 this 指向新创建的对象
- 构造函数有一个prototype 属性 指向原型对象
  原型对象上拥有的方法，实例也会拥有这些方法

## JS设计哲学
- 一切都是对象，没有类
- Object 是顶层对象
  Object() 函数对象
  Object.prototype是一个原型对象
  let obj = {} new Object();
  Function、Array、Date、RegExp 函数对象
  下一站Object原型链

- 实例对象有__proto__ 私有属性指向 原型对象
- 沿着__proto__ 一直查找 沿着原型链查找
  终点是null
- 任何函数有prototype 属性 指向原型对象
  负责给实例们提供共享方法
- 原型对象上有const
