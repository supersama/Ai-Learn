// var 变量提升 这是不对的
// let 提升了 但不和var同流合污
// 他的内存空间是在词法环境中
// 代码执行时候，分支
// 在变量环境中的可以在声明前执行
// 在词法环境中的不可以在声明前执行9
let myname = undefined; // 没有提升
console.log(myname); // 词法环境
myname = 'jksj';


