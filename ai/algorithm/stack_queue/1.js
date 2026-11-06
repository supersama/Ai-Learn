// 函数表达式
// 类MyQueue
// 早期的js没有类
// 不需要class也能完成面向对象
// 函数+prototype

const MyQueue = function(){
  // 构造函数 属性
  console.log('实例化',this);
//   this.x=1;
this.stack1 = [];
this.stack2 = [];
}
MyQueue.prototype.push = function(){
    console.log('push方法');
}
// new 运算符 this 指向我们的实例
const queue = new MyQueue();
console.log(queue,queue.push());