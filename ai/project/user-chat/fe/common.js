// js 不太严格
// 单引号 双引号 分号  类型声明  都不强求
// js 不需要怎么学习，直接用
//常数 数组 弱类型的语言
//[] 数组
//数据
//对象 Object 属性和方法 {}
let users = 
[];
fetch('http://localhost:3000/users')//等
   .then(response => response.json())
   .then(date => 
    {
     console.log(date);
     users = date;
     const oBody = document.querySelector('.table tbody')
     let i =1;
     let user
     for(let user of users)
        {
            oBody.innerHTML += 
            `
            <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.nickname}</td>
            <td>${user.hometown}</td>
            </tr>
            i++
            `
        };
   })
// dom 期待动态的填入   编程
// dom 节点对象
// oBody o 表示类型
// 挂载点

// console.log(oBody);
// 计数循环 块， cpu 计算规则
// 缺点  可读性差
// for(let i = 0;i<users.length;i++)
//{    let user = users[i];
//     console.log(user);
//}
// js es6 新的for 循环 不需要计数


