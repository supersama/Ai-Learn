// 早期js没有class 约定大写就是构造函数
function Greeting(name)
{  console.log(this);
   this.name = name;
}
Greeting.prototype.say = function()
{
    console.log(`我叫${this.name}，很高兴认识你`);
}
Greeting.prototype.work = function()
{
    console.log(`我叫${this.name}，我正在工作`);
}

const ss = new Greeting('xxx');
console.log(ss.name);
ss.say();
ss.work();