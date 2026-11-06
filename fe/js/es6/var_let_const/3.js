// 常量一开始就需要赋值

const PI = 3.1415926;
let a; // undefined;
// 简单数据类型
const key = 'abc123';
let points = 50;
let point = 50;
point = 21;
// let 不止是值可以改变，类型也可以
// 不要这么做   不好维护
point = "21";// 不好的
let winner = flase ;
winner = 'li';

// 复杂数据类型 对象
// 值可以改变  但是类型不能变
const person ={
    name:'i',
    aga:18
}

person.age++
console.log(person);
person = "111";// 报错