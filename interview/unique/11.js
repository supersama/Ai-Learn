/**
 * @func 数组去重
 * @param {Array} arr 数组
 * @return {Array} 去重后的数组 
 * @author lcf
 * @date 2026-9-28
 */
function unique(arr)
{
      // 参数校验
      // JS没有类 只有对象
      // 数组的静态方法 没有实例化
      // Array.isArray 判断是否是数组
      if(!Array.isArray(arr))
      {
            console.log("type error!")
            return [];
      }
      let res = [arr[0]];
      for(let i =1;i<arr.length;i++)
      {
            let flag = true;  //是否重复
            for(let j =0;j<res.length;j++)
            {     // === 恒等， 全等 值相等 类型相等
                  if(arr[i] === res[j])
                  {
                        flag = false;
                        break;
                  }
            
            }
            if(flag)
            {
                  res.push(arr[i]);
            }
      }
      return res;
}

// 数组.indexOf(值) ——返回值在数组中的下标

console.log([1,2,3,4,5].indexOf(3));

