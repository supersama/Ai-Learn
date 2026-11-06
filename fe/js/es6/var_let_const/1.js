//局部作用域 global scope 全局作用域    
var height = 200;
function setWidth()
{   //局部作用域变量
    var width = 100;
    console.log(width,height);   
}
setWidth();
// cosolelog.log(width); 不能行，因为width是局部变量
typeof level
'undefined'
level =10;
10
typeof level
'number'

setWidth();

var age = 100;
if(age>12){
    // 块级作用域
    // es6 常量 不可以改变
    const dog = age * 7;
    console.log(dog);
    // dog++; 不能行，因为dog是常量
}
    // console.log(dog); 不能行，因为dog是块级作用域
