//  O(n) 遍历一次
//  空间换时间
function unique(arr)
{
    if(!Array.isArray(arr))
        {
              console.log("type error!")
              return [];
        }
    let res = [], obj = {};
    // js 是简单的语言 没有哈希表
    // 早期js就是用来做点事件交互的  没有HashMap
    // HashMap 数据结构
    // obj = {}; 对象字面量 
    for(let i=0;i< arr.length;i++)
    {
        // get 读操作
        // arr[i] 当前项 作为key 
        // .name 常量
        if(!obj[arr[i]])
        {
           res.push(arr[i]);
           obj[arr[i]] = 1;
        }
        else
            {
                obj[arr[i]]++;
            }
    }

     return res;    
}