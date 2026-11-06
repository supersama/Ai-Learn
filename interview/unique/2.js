function unique(arr)
{
    if(!Array.isArray(arr))
        {
              console.log("type error!")
              return [];
        }
    //indexOf
    const res = [];
    for(let i =0;i<arr.length;i++)
    {
        if(res.indexOf(arr[i]) === -1)
        {   // res 没有这个元素
            res.push(arr[i]);
        }
    }
    return res;
}

console.log(unique([1,2,3,4,4,5]));
