function foo()
{
    var a =1;
    let b= 2;
    var c =4;
    {   // 词法环境里做块级作用域的文章
        let b =3;
        let c =3;
        
        console.log(b);
    }
    var c =6;
    console.log(b);
    console.log(c);
}
foo();