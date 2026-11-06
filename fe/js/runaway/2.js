// v8引擎的眼里
var myname
showName() // 变量提升
function showName(){
    console.log('执行showName')
}

showName();
console.log(myname);
myname = 'xx';