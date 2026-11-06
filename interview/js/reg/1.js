let str ='13000000000';
// 描述一个配置的规则
// 一个字符一个字符的匹配
// []表示匹配的字符范围
let reg = /^1[3-9][0-9]{9}$/;
console.log(typeof reg);
console.log(
    Object.prototype.toString.call(reg)
)
console.log(reg.test(str));
