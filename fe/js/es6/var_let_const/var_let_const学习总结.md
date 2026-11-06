# var / let / const 学习总结

> 目录：`D:\workspace\lcf_ai\fe\js\es6\var_let_const`
> 整理时间：2026-10-14

---

## 一、先搞懂 ES6 是什么

- JavaScript 是**弱类型的动态语言**，名字蹭了 Java 的热度，但两者没有关系。
- 早期设计目标很单纯：**给网页加交互**（幻灯片、按钮响应），所以是浏览器的副产品，语言本身有些没经过深思熟虑的瑕疵。
- JS 的语言标准是 **ECMAScript（ES）**，JS 是这套标准的实现。
- **ES6（2015）是一个分水岭**：此前是 ES5，此后叫 ES6+。从这一版起，JS 开始向**企业级大型项目开发**演进。
- 学习路径：`DOM 编程 → ES5 → ES6+`。

---

## 二、作用域（scope）

### 1. 三种作用域

| 作用域 | 产生方式 |
| --- | --- |
| 全局作用域 | 在最外层声明 |
| 函数局部作用域 | 函数体内的变量 |
| 块级作用域 `{}` | `if`、`for`、单独的代码块 |

**变量属于作用域**——这是理解一切的前提。JS 是弱类型，变量声明时不用写类型，**类型由值决定**。

```js
// 全局作用域
var height = 200;

function setWidth() {
  // 函数局部作用域
  var width = 100;
  console.log(width, height);   // 100 200，内层可以读到外层
}
setWidth();
// console.log(width);         // ReferenceError：局部变量在外面不存在
```

### 2. 变量查找规则：逐层向外冒泡

1. 先在当前作用域找；
2. 找不到就向**外层作用域**找（冒泡查找）；
3. 一直找到全局作用域还没有，就停下来**报错**。

### 3. 内存视角：变量的生命周期

- 声明一个变量 = 在内存中申请了一块区域。
- 函数 / 代码块执行结束后，作用域销毁，**内存被垃圾回收**，变量随之消亡。

### 4. 三种典型报错

| 报错 | 触发场景 |
| --- | --- |
| `Assignment to constant variable` | 给 `const` 重新赋值 |
| `ReferenceError: XXX is not defined` | 变量从未声明 / 拼写错误 / 不在当前作用域 |
| `ReferenceError: Cannot access 'pizza' before initialization` | 在 `let`/`const` 声明之前访问它（暂时性死区） |

---

## 三、var / let / const 三者对比

早期 JS 只有 `var`，**没有常量**，靠程序员自己用代码规范约束「这个值不许改」（比如全大写命名 `PI`、`CHATMODEL`）。ES6 补上了 `let` 和 `const`。

| | `var` | `let` | `const` |
| --- | --- | --- | --- |
| 块级作用域 | ❌ 不支持 | ✅ 支持 | ✅ 支持 |
| 声明时赋值 | 可选 | 可选 | **必须**（除声明对象属性外不能留空） |
| 能否改变值 | 可以 | 可以 | 简单类型不可改；复杂类型「值可改、指向不可改」 |
| 能否改变类型 | 可以 | 可以 | 不可以 |
| 变量提升 | 有（值为 `undefined`） | 有提升但处于暂时性死区（TDZ） | 同 `let` |

`const` = constant variable，字面意思「不可变的变量」。

```js
const PI = 3.1415926;
let a;                 // undefined，let 允许先声明后赋值
```

### 使用建议

- **默认用 `const`**，确认这个值后面要变，再换成 `let`。
- **不要再用 `var`**：它不支持块级作用域，是历史遗留。
- `let` 虽然可以改类型，但不要这么写，不好维护：

```js
let point = 50;
point = 21;        // 正常：值变了，类型仍是 number
point = "21";      // 语法允许，但不好维护
```

---

## 四、核心考点：for + setTimeout

这是最能体现 `var` 与 `let` 差异的场景。

```js
for (let i = 0; i < 10; i++) {
  console.log(i);                        // 同步代码，尽快执行
  setTimeout(function () {
    console.log(`this number is ${i}`);  // 异步代码，延迟执行
  }, 1000);
}
```

- `for` 循环**每一轮都会创建一个块级作用域**，`if` 语句每次执行同理。
- **用 `let`**：每轮循环的 `i` 都是独立的局部变量，回调里捕获的是各自的 `i`，1 秒后依次打印 `0 1 2 ... 9`。
- **换成 `var`**：整段只有一个 `i`，循环结束时同步代码已经把 `i` 加到 10，1 秒后所有回调打印的都是 **10**。
- 根因是 `var` 不支持块级作用域，闭包捕获的是同一个变量。

---

## 五、const 与复杂数据类型

`const` 锁住的是**绑定（引用）**，不是对象内部的属性。

```js
const person = {
  name: 'i',
  age: 18
};

person.age++;        // ✅ 合法：对象内部的值可以改
console.log(person); // { name: 'i', age: 19 }

person = "111";      // ❌ TypeError: Assignment to constant variable
```

一句话记忆：**简单数据类型不可改值，复杂数据类型值可改、类型和指向不可改。**

---

## 六、变量提升（hoisting）

JS 的执行分两个阶段，这是提升现象的来源：

1. **编译阶段**：准备执行上下文（变量环境）。此阶段就已经登记了变量名，所以 `var pizza` 在编译后是 `undefined`。
2. **执行阶段**：赋值操作在这一阶段才真正发生。

```js
console.log(pizza);        // undefined —— var 提升后能读到，但值是 undefined
var pizza = 'Deep Dish';
```

提升被认为是个**不好的设计**：它让代码的行为和书写顺序、人的直觉不一致，容易出现「变量莫名其妙是 `undefined`」的 bug。**应当主动避免依赖变量提升。**

```js
console.log(pizza);        // ❌ ReferenceError: Cannot access 'pizza' before initialization
let pizza = 'Deep Dish';
```

需要精确表述的一点：`let` / `const` **并非没有提升**——它们同样会被登记到作用域中，只是从块开始到声明语句之间处于**暂时性死区（TDZ）**，在死区内访问会直接抛错，而不是得到 `undefined`。所以实践上表现为「必须先声明后使用」。

---

## 七、易错点清单

| 现象 | 原因 | 正确做法 |
| --- | --- | --- |
| 循环里回调全打印同一个值 | `var` 没有块级作用域，共用一个变量 | 用 `let` 声明循环变量 |
| `ReferenceError: flase is not defined` | 关键字拼写错误（`flase`） | 拼写检查：`false` |
| 对 `const` 对象改属性报错 | 误以为 `const` 冻结了对象内部 | 记住只冻结引用；要真冻结用 `Object.freeze()` |
| 对象属性写着 `aga`、却用 `person.age++` | 属性名拼错，读到 `undefined`，自增得到 `NaN` | 字段名前后保持一致 |
| 在声明前访问变量得到 `undefined` | `var` 提升 | 先声明后使用，并且不用 `var` |
| 在声明前访问 `let` 变量直接报错 | 暂时性死区 | 把声明提到使用之前 |
| 变量在块外访问不到 | 块级作用域 | 需要外部使用时，在块外层声明 |
| `const` 声明后没赋值 | `const` 必须初始化 | 声明时就赋值 |

---

## 八、一句话速记

> ES6 用 `let` / `const` 补上了**块级作用域**和**常量**：`const` 优先，`let` 次之，`var` 不用；变量属于作用域，查找逐层向外冒泡，用完即被回收；警惕 `var` 的变量提升，`let`/`const` 的暂时性死区才是更安全的行为。
