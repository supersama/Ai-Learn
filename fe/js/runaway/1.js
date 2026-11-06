// JS 执行机制对于开发者来说
// 代码是怎么执行的
showName()
console.log(myname)

var myname = 'xx';
function showName(name)
{   var b = 1;
    console.log('函数showName执行',name);
}