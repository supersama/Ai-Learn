# CLAUDE.md

此文件为 Claude Code（claude.ai/code）在此仓库中工作时提供指导。

## 项目

一个使用原生 HTML/CSS/JS 和 Web Audio API 构建的静态电子鼓。无构建工具、无依赖、无测试、无包管理器 —— 仅三个文件，直接在浏览器中加载。

## 运行

没有构建步骤。直接在浏览器中打开 `index.html`，或静态托管该目录（例如 `python -m http.server` 或 `npx serve`）。由于 `AudioContext` 是惰性创建的，音频只能在用户手势（点击/按键）之后播放。

## 架构

- `index.html` —— 静态 DOM：9 个鼓垫，形如 `<button class="pad" data-key="<字母>">`（A–L），外加一个 `<kbd>` 提示列表。所有文本均为中文（zh-CN）。
- `script.js` —— 单个 IIFE（`'use strict'`），包含全部行为。音频是**合成的，而非采样** —— 没有任何音频文件。
- `style.css` —— 通过 `:root` 中的 CSS 自定义属性实现主题；鼓垫以 3 列网格布局；`.active` 类驱动敲击高亮效果。

### Web Audio 信号链

`ensureAudio()` 惰性地创建一个 `AudioContext`，并构建一条固定链路：`master` 增益（0.9）→ `DynamicsCompressor` → `ctx.destination`。所有声音都连接到 `master`。一个 2 秒的白噪声 `AudioBuffer`（`getNoiseBuffer()`）只创建一次，并由所有基于噪声的声音复用。

九种乐器（`playKick`、`playSnare`、`playHiHat(open)`、`playTom(freq)`、`playCrash`、`playRide`）分别由正弦/三角振荡器和经过滤波的噪声（通过 `noiseHit(...)`）构建。

### 键位映射

`script.js` 中的 `pads` 对象将键盘字母映射到播放函数：

| 按键 | 音色 |
|------|------|
| a | 底鼓（kick） |
| s | 军鼓（snare） |
| d / f | 闭合/开放踩镲（closed/open hi-hat） |
| g / h / j | 低/中/高音通鼓（low/mid/high tom） |
| k | 吊镲（crash） |
| l | 叮叮镲（ride） |

### 添加新的鼓垫

这是唯一跨多个文件的改动 —— DOM 的 `data-key` 值、JS 的 `pads` 条目以及屏幕上的提示必须保持一致：

1. 在 `index.html` 中添加 `<button class="pad" data-key="x">`（并在头部提示中加入对应的 `<kbd>`）。
2. 在 `script.js` 中添加 `pads.x = { play: ... }` 条目，必要时再写一个 `playX()` 合成函数。
3. 无需修改 CSS —— 网格和 `.active` 样式是基于 `.pad` / `data-key` 触发的。

事件处理分为两部分：每个 `.pad` 上的指针事件（`pointerdown`/`up`/`leave`/`cancel`），以及 `window` 上的 `keydown`/`keyup`（带有 `e.repeat` 防护，避免按键自动重复触发）。`hit(key)` 在播放前会先调用 `ensureAudio()`，因此音频图在声音触发时始终已经就绪。
