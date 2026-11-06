# notebook 学习总结

> 目录：`D:\workspace\lcf_ai\ai\notebook`
> 整理时间：2026-10-14
> 素材来源：`list/readme.md`、`list/1.ipynb`、`list/2.ipynb`

---

## 一、目录内容一览

| 文件 | 大小 | 说明 |
| --- | --- | --- |
| `list/readme.md` | 1.4 KB | 概念笔记：Python 列表、切片、LLM 接口与 Prompt |
| `list/1.ipynb` | 3.3 KB | 列表与切片实操练习（含一道 trim 自实现题） |
| `list/2.ipynb` | 2.6 KB | 第一次调用 DeepSeek 接口：电商文案 + 结构化输出 |
| `1.md` | 0 字节 | 空文件，可删除 |

环境：Python 3.11.11，Jupyter（ipykernel）。

---

## 二、阶段一：Python 基础 —— 列表与切片

### 1. 为什么是 list

- Python 中没有 Java / C++ 那样的内置数组，`array` 很少用。
- `list` 是**灵活、有序、可修改**的通用容器列表：
  - 长度动态可变，不需要提前指定容量；
  - 不约束元素类型（同一列表里可以混放字符串、数字……）。
- 和 JavaScript 的 `Array` 很像，语言之间在互相借鉴（JS 吸收了不少 Python 特性）。

### 2. Python 与 JS 的分工

| | JavaScript | Python |
| --- | --- | --- |
| 数值类型 | 只有 `Number` | 整数 / 浮点 / 高精度（`decimal`）等 |
| 擅长 | 页面展示与交互 | 机器学习、爬虫、数据分析 |
| 短板 | 不适合做计算（缺浮点、高精度类型） | 前端交互不是强项 |

### 3. 切片的写法

切片大大简化了“取一段元素”的操作，不用写循环。

```python
L = ["xxx1", "xxx2", "xxx3", "xxx4"]

L[0:3]    # ['xxx1', 'xxx2', 'xxx3']
L[:3]     # 省略起始下标，默认从 0 开始
L[1:3]    # ['xxx2', 'xxx3']
L[-2:]    # ['xxx3', 'xxx4']   负数下标 = 从末尾数

L = list(range(100))
L[:10]     # 前 10 个
L[-10:]    # 倒数第 10 个开始到结尾
L[:10:2]   # 前 10 个，每 2 个取 1 个（步长 2）
L[::5]     # 从头到尾，每 5 个取 1 个
```

**切片不止用于列表**，字符串同样适用：

```python
'ABCDEFG'[:3]   # 'ABC'
'ABCDEFG'[::2]  # 'ACEG'
```

语法统一写作 `s[起:止:步长]`，起止可省，正负下标混用，步长为负时还能反向取。

### 4. 练习：不用 `strip()` 实现 `trim(s)`

**思路（双指针 + 切片）**：先从左找到第一个非空格的位置 `left`，再从右找到第一个非空格的位置 `right`，最后切片截取中间部分。

```python
def trim(s):
    left = 0
    while left < len(s) and s[left] == ' ':
        left += 1
    right = len(s)
    while right > left and s[right - 1] == ' ':
        right -= 1
    return s[left:right]

print(trim("    hello world   "))   # hello world
```

> 原始 notebook 里这个函数有三处错误，已在此修正：
> 1. `return [left:right]` 是语法错误，应为 `return s[left:right]`；
> 2. `while rigth > left` 拼写错误，应为 `right`；
> 3. `print(...)` 写在 `return` 之后，永远不会执行。

---

## 三、阶段二：LLM 接口与 Prompt

### 1. 行业背景

- OpenAI 基于 Google 开源的 **Transformer** 架构；Transformer 引领了 2022 年底开始的生成式 AI 浪潮。
- DeepSeek **兼容 OpenAI 接口**，已成业内事实标准；Gemini（Google）、Claude（Anthropic）接口略有差异。
- 阿里 **ModelScope（魔搭）**：Model = 模型，Scope = 空间；开源模型发布在这里，同时提供 datasets 数据集和 NLP 实验环境。
- **notebook / `.ipynb` 的定位**：边写代码边记录，适合数据分析、学习过程和出报告（markdown 文件则用于纯文字笔记）。

### 2. Prompt 三原则

1. **清晰且详细地表达目标**（例：明确要求 “Amazon U.S.” 场景）。
2. **分步骤**：用 1、2、3 把任务拆开。
3. **约束返回格式**：例如要求返回 JSON，并明确字段名，方便程序后续直接解析使用。

### 3. 实战代码（`2.ipynb`）

场景：输入中文商品名「工厂现货 PVC 充气青蛙 夜市地摊热卖 充气玩具 发光蛙 儿童水上玩具」，让模型输出亚马逊英文标题、5 条卖点、美元价格区间。

```python
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["DEEPSEEK_API_KEY"],   # 原 notebook 为明文，已改为环境变量
    base_url="https://api.deepseek.com/v1"
)

COMPLETION_MODEL = "deepseek-chat"

prompt = """
Consideration product:工厂现货PVC充气青蛙夜市地摊热卖充气玩具发光蛙儿童水上玩具
1.Compose human readable product title used on Amazon in english within 20 words.
2.Write 5 selling points for the products in Amazon
3.Evaluate a price range for this product in U.S.

Output the result in json formate with three properties
called title,selling_point and price_range
"""

def get_response(prompt):
    response = client.chat.completions.create(
        model=COMPLETION_MODEL,
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

print(get_response(prompt))
```

要点回顾：

- Python 不用 `new`，直接调用构造函数实例化对象：`client = OpenAI(...)`。
- 接口调用的固定四件套：`model` + `messages` + 取值路径 `choices[0].message.content`。
- `messages` 里 `role` 为 `user`，内容就是 prompt。
- 因为 prompt 里约束了 JSON 格式，返回结果可以直接被程序解析（示例输出）：

```json
{
  "title": "Light-Up PVC Inflatable Frog Toy for Kids, Pool & Party Fun",
  "selling_point": [
    "Bright LED glow makes it a hit at night markets, parties, and pool games",
    "Durable PVC construction is water-resistant and safe for kids to play with",
    "Inflates quickly and deflates flat for easy storage and travel",
    "Versatile fun for swimming pools, beaches, bath time, and outdoor play",
    "Eye-catching frog design appeals to children and drives impulse sales"
  ],
  "price_range": "$4.99 - $12.99"
}
```

---

## 四、关键知识点速查

| 知识点 | 记法 |
| --- | --- |
| `L[:3]` / `L[-2:]` | 起止省略即到底；负下标从尾部数 |
| `L[:10:2]` / `L[::5]` | 第三个数是步长 |
| `'ABCDEFG'[::2]` | 切片同样作用于字符串 |
| `strip()` | 去除首尾空白 |
| `range(n)` | 生成 0 到 n-1 的整数序列 |
| `client.chat.completions.create` | OpenAI 兼容接口的统一入口 |
| `choices[0].message.content` | 取模型返回文本 |
| Prompt 三原则 | 讲清楚 / 分步骤 / 定格式 |

---

## 五、待办与注意事项

1. **API Key 泄露风险**：原 `2.ipynb` 里明文写了 DeepSeek 的 `sk-...` 密钥。本总结已不含该密钥，建议：
   - 把 notebook 里的 key 改为读环境变量（`os.environ[...]`）；
   - 去 DeepSeek 控制台把旧 key 轮换 / 删除。
2. **`1.ipynb` 的报错 cell** 已在上文第二节修正，可直接回填到 notebook。
3. **变量名复用**：`1.ipynb` 中 `L` 先为字符串列表、后又被重定义为 `list(range(100))`，建议换名以免混淆。
4. **空文件**：`1.md` 长度为 0，可删除或补充内容。
5. **下一步可学**：元组 / 字典 / 集合、列表推导式、`json.loads` 解析模型结构化输出、异常处理与重试。
