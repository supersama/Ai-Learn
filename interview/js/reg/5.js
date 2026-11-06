let template = `我是{{name}},年龄{{age}}，性别{{sex}}`;
let person = {
    name:'xxx',
    age:17,
    sex:'man'
}

function render(template,date)
{
     const reg = /\{\{(\w+)\}\}/ // 用\表示它是一个正常匹配的字符，而不是{}代表次数
     if(reg.test(template))
     {
         
        return template.replace(/\{\{(\w+)\}\}/g,(_,key)=>date[key]);
     }
        
}
console.log(render(template,person));