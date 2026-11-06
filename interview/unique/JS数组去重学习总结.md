# unique（数组去重）学习总结

> 目录：`D:\workspace\lcf_ai\interview\unique`
> 整理时间：2026-10-14
> 素材来源：`readme.md`、`1.js` ~ `6.js`、`11.js`

---

## 一、目录内容一览

| 文件 | 写法 | 时间复杂度 | 备注 |
| --- | --- | --- | --- |
| `1.js` | 双层循环 + 标记位 | O(n²) | 带 JSDoc 注释的初版 |
| `2.js` | `indexOf` 判断 | O(n²) | 代码最简洁的入门版 |
| `3.js` | `filter` + `indexOf` | O(n²) | 函数式写法 |
| `4.js` | `sort` 后比较相邻项 | O(n log n) | 第一个性能优化版 |
| `5.js` | 对象字面量（HashMap） | O(n) | 空间换时间 |
| `6.js` | `Set` + 扩展运算符 | O(n) | ES6 一行流 |
| `11.js` | 与 `1.js` 完全相同 | O(n²) | 重复文件，可删除 |
| `readme.md` | 概念笔记 | — | 考点、数组 API、复杂度速记 |

主线很清晰：**从 O(n²) 的暴力解法，一步步优化到 O(n) 的哈希/Set 解法**，这是一道典型的手写代码面试题。

---

## 二、题目与考察点

**题目**：给定 `[1, 2, 3, 4, 5]` 这类数组，写一个函数完成去重。

**形式**：写成一个完成功能的函数，而不是散装代码。

`readme.md` 里记的工程意识，比函数本身更重要：

- **函数注释**：开发者和使用者往往不是同一个人；注释是代码的一部分，能提高可读性、避免日后忘记。
- **一个函数一个功能**：职责单一。
- **封装复杂功能**。
- **保证健壮性**：入口处先校验参数。

统一采用 JSDoc 注释（`1.js` / `11.js` 是范例）：

```js
/**
 * @func 数组去重
 * @param {Array} arr 数组
 * @return {Array} 去重后的数组
 * @author lcf
 * @date 2026-9-28
 */
```

---

## 三、六种解法详解

### 1. 双层循环 + 标记位（`1.js`）—— 打好地基

思路：结果数组 `res` 从第一个元素开始，逐个拿新元素去 `res` 里比对，重复就丢掉。

```js
function unique(arr) {
  if (!Array.isArray(arr)) {
    console.log("type error!");
    return [];
  }
  if (arr.length === 0) return [];        // 原版缺这一步，arr[0] 会得到 undefined
  let res = [arr[0]];
  for (let i = 1; i < arr.length; i++) {
    let flag = true;                       // 是否重复
    for (let j = 0; j < res.length; j++) {
      if (arr[i] === res[j]) {             // === 全等：值相等且类型相等
        flag = false;
        break;
      }
    }
    if (flag) res.push(arr[i]);
  }
  return res;
}
```

要点：

- `===` 是**恒等 / 全等**，值和类型都必须相等；`==` 会做隐式类型转换，判断不可靠。
- 内层一旦命中就 `break`，省掉无意义的比较。
- JS 没有类，只有对象；`Array.isArray` 是数组的**静态方法**，不需要实例化。

### 2. `indexOf` 版（`2.js`）—— 用 API 替掉内层循环

```js
function unique(arr) {
  if (!Array.isArray(arr)) { console.log("type error!"); return []; }
  const res = [];
  for (let i = 0; i < arr.length; i++) {
    if (res.indexOf(arr[i]) === -1) {   // -1 表示 res 里没有这个元素
      res.push(arr[i]);
    }
  }
  return res;
}
console.log(unique([1, 2, 3, 4, 4, 5]));
```

`indexOf` 返回**值在数组中首次出现的下标**，找不到返回 `-1`。代码短了，但本质上仍是“对每个元素扫一遍结果数组”，复杂度还是 O(n²)。

### 3. `filter` 版（`3.js`）—— 函数式写法

```js
function unique(arr) {
  if (!Array.isArray(arr)) { console.log("type error!"); return []; }
  // filter 的回调返回 true 保留、false 过滤
  return Array.prototype.filter.call(arr, function (item, index) {
    return arr.indexOf(item) === index;   // 只保留“首次出现”的那一个
  });
}
```

原理：同一个值**第一次出现的位置**才等于当前下标 `index`，后面重复出现时 `arr.indexOf(item)` 会返回更小的下标，于是被过滤掉。

`Array.prototype.filter.call(arr, ...)` 是把数组方法借给类数组对象用的老写法；现在数组本身就是数组，直接 `arr.filter(...)` 即可。

> 复杂度没有降级：`indexOf` 在循环里，仍然是 O(n²)。

### 4. 排序 + 相邻比较（`4.js`）—— 第一次性能优化

```js
function unique(arr) {
  if (!Array.isArray(arr)) { console.log("type error!"); return []; }
  if (arr.length === 0) return [];
  arr = arr.slice().sort();              // 用副本排序，不污染调用方的数组
  let res = [arr[0]];
  for (let i = 1; i < arr.length; i++) { // 原版从 i = 0 开始，会把首元素重复压入
    if (arr[i] !== arr[i - 1]) res.push(arr[i]);
  }
  return res;
}
console.log(unique([1, 2, 3, 4, 4, 5]));
```

要点：

- 排序后重复元素必然相邻，一次遍历即可，复杂度从 O(n²) 降到 **O(n log n)**。
- **`sort()` 默认按字符串比较**！`[10, 9].sort()` 结果是 `[10, 9]`，数字场景要写 `sort((a, b) => a - b)`。
- 排序会改变原数组顺序，且修改的是入参对象（本例用 `slice()` 规避）。

### 5. 对象字面量 / HashMap（`5.js`）—— 空间换时间

```js
// O(n) 只遍历一次，代价是多开一个对象存状态
function unique(arr) {
  if (!Array.isArray(arr)) { console.log("type error!"); return []; }
  const res = [], obj = {};
  for (let i = 0; i < arr.length; i++) {
    if (!obj[arr[i]]) {        // 读操作：没记录过 → 是新元素
      res.push(arr[i]);
      obj[arr[i]] = 1;
    } else {
      obj[arr[i]]++;           // 记录出现次数，顺便可以扩展成“统计词频”
    }
  }
  return res;
}
```

要点：

- JS 早期只是做页面事件交互的，没有原生的 HashMap；**对象字面量 `{}` 就是最常用的哈希表替身**，`key` 查值平均 O(1)。
- 把当前项 `arr[i]` 当作 key 存进去，靠“查得到 / 查不到”来判重。
- **坑**：对象的 key 会被转成字符串，数字 `1` 和字符串 `"1"` 会互相覆盖；`"__proto__"`、`"toString"` 这类原型上的名字会命中继承属性导致误判；`NaN` 也能作为 key 存进去（这点反而正确）。严格场景应改用 `Map`。

### 6. `Set` 一行流（`6.js`）—— ES6 的标准答案

```js
function unique(arr) {
  if (!Array.isArray(arr)) { console.log("type error!"); return []; }
  return [...new Set(arr)];              // 原版多了一行没用的 let res = []
}
```

要点：

- `Set` 是 ES6 新增的数据结构，**元素不重复**，内部查找平均 O(1)。
- `new Set(arr)` 自动去重，`[...]` 扩展运算符再转回数组。
- `Set` 用的是 SameValueZero 比较：`NaN` 会被认为相等（只留一个），`+0` 和 `-0` 视为同一个。
- 生产代码首选这一种：最短、最快、语义最清楚。

---

## 四、复杂度对比与结论

| 解法 | 时间 | 空间 | 是否改变原数组顺序 |
| --- | --- | --- | --- |
| 双层循环 `1.js` | O(n²) | O(n) | 否 |
| `indexOf` `2.js` | O(n²) | O(n) | 否 |
| `filter` `3.js` | O(n²) | O(n) | 否 |
| `sort` `4.js` | O(n log n) | O(n) | 是（且改变原数组） |
| 对象字面量 `5.js` | O(n) | O(n) | 否 |
| `Set` `6.js` | O(n) | O(n) | 否 |

**结论**：

- 面试时先写得出 `1.js` 那种能跑对的版本，再谈优化路径：`O(n²) → O(n log n) → O(n)`。
- 两重循环、`filter`、`indexOf` 都是 O(n²)；排序相邻比较是 O(n log n)；**哈希 / Set 用空间换时间**得到 O(n)。
- 实际项目里直接用 `[...new Set(arr)]`，需要保留顺序的复杂对象去重才自己写。

---

## 五、代码里发现的问题（建议修正）

| 位置 | 问题 | 修正 |
| --- | --- | --- |
| `1.js` / `11.js` | 空数组入参时 `arr[0]` 为 `undefined`，返回 `[undefined]` | 加 `if (arr.length === 0) return [];` |
| `4.js` | 循环从 `i = 0` 开始，首元素被重复压入；`sort()` 数字默认按字符串排 | 改成 `i = 1`；数字用 `sort((a,b) => a - b)` |
| `4.js` | `console.log(unique[1,2,3,4,4,5])` 是逗号表达式，函数根本没被调用 | 改为 `unique([1,2,3,4,4,5])` |
| `5.js` | 对象 key 会字符串化，`1` 与 `"1"` 冲突；`__proto__` 等原型属性会误判 | 严谨场景换 `Map` |
| `6.js` | `let res = []` 声明后从未使用 | 删除 |
| `5.js` / `6.js` | 没有 `console.log` 示例调用，不便自测 | 补一行调用 |
| `11.js` | 与 `1.js` 内容完全相同 | 删除或改名，避免混淆 |

---

## 六、一句话速记

> 参数先校验（`Array.isArray`）→ 注释写清楚（JSDoc）→ 一个函数一个功能 → 先去重再优化：暴力 O(n²)，排序 O(n log n)，哈希/Set 用空间换 O(n)。
