showName();
var showName = function()
{
    console.log(2)
}
// 函数是一等对象，变量提升，优先于其他变量
function showName()
{
    console.log(1);
}
