const str = '验证码是114514,你已欠费50元';
const reg = /\d+/;
// console.log(reg.test(str));
const result = str.match(reg);
console.log(result)