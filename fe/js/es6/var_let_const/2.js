// 全局作用域
{
    // 块级作用域
    // 代码块
    // 申明了变量，属于当前块级作用域

}
// for 循环每一次循环，都会创建一个块级作用域
// if 语句 每一次执行，都会创建一个块级作用域
for (let i = 0; i < 10; i++) {
    console.log(i);// 同步代码 尽快执行
    setTimeout(function(){
        console.log( `this number is ${i}` );
    }, 1000) // 异步代码 延迟执行
}