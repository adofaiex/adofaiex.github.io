---
title: ADOFAI-JS
order: 1
---

# ADOFAI-JS

[ADOFAI-JS](https://github.com/adofaiex/ADOFAI-JS) 是一个零依赖的 JavaScript / TypeScript 关卡库，用于解析、编辑和导出 ADOFAI 关卡文件，完全兼容浏览器。

## 特性

- **多种解析器** —— `StringParser`、`BufferParser`、`ArrayBufferParser`、`LargeFileParser`（超大文件增量解析）
- **Level 管理** —— 加载、编辑、导出 `.adofai` 文件，完整的地块与事件访问
- **类型化事件** —— 56 种 ADOFAI 事件类型的类型定义
- **共享类型** —— 常量枚举与工具类型（角度、判定、滤镜等）
- **PathData 转换** —— `pathData` 字符串与 `angleData` 数组互转
- **特效过滤** —— 预设与自定义事件过滤（去除特效、保留/排除事件）
- **预计算模式** —— 批量处理并缓存进度事件，供渲染管线轮询
- **轻量数据** —— 大关卡的内存优化数据提取

> 开始前建议先读[认识关卡文件](../level-format.md)，了解 `.adofai` 文件的结构与 Path Data 编码。

## 安装

```bash
npm install adofai
# 或
yarn add adofai
# 或
pnpm add adofai
```

## 导入

**ESM：**

```ts
import * as adofai from 'adofai'
import { Level, Parsers, Types, Events, Structure } from 'adofai'
```

**CommonJS：**

```ts
const adofai = require('adofai')
```

**子路径导入：**

```ts
import { StringParser } from 'adofai/parser/string'
import { BufferParser } from 'adofai/parser/buffer'
import { ArrayBufferParser } from 'adofai/parser/array-buffer'
import * as Types from 'adofai/types'
import * as Events from 'adofai/event'
```

### 包导出一览

| 导入路径 | 内容 |
| --- | --- |
| `adofai` | 主入口：Level、Parsers、Types、Events、Structure、Presets、pathData |
| `adofai/parser` | 解析器类 |
| `adofai/parser/string` | StringParser |
| `adofai/parser/buffer` | BufferParser |
| `adofai/parser/array-buffer` | ArrayBufferParser |
| `adofai/types` | Types（常量枚举、工具类型与函数） |
| `adofai/event` | 全部事件类型接口 |
| `adofai/structure` | 核心接口（LevelOptions、Tile 等） |
| `adofai/filter` | 过滤预设 |
| `adofai/filter/effect-processor` | 底层特效处理器 |
| `adofai/pathdata` | PathData 转换表 |

## 快速开始

```ts
import { Level } from 'adofai'
import fs from 'node:fs'

const raw = fs.readFileSync('level.adofai', 'utf-8')
const level = new Level(raw)
await level.load()

// 地块数
console.log(level.tiles.length)

// 读取设置
console.log(level.settings.bpm, level.settings.artist)

// 去除所有特效
level.clearEffect('preset_noeffect')

// 导出回 ADOFAI JSON
fs.writeFileSync('output.adofai', level.export('string', 0, true))
```

## 章节

- [解析器](./parsers.md) —— 四种解析器的选择与使用
- [Level 类](./level.md) —— 关卡数据的加载、编辑与导出
- [共享类型](./types.md) —— 类型与常量枚举
- [事件类型](./events.md) —— 56 种事件定义
- [特效过滤](./filters.md) —— 预设与自定义事件过滤
- [高级用法](./advanced.md) —— 预计算模式与轻量数据

## 联动

- [Re_ADOJAS](https://github.com/adofaiex/Re_ADOJAS)（谱面播放器）基于本库构建，见[使用指南](../../mods/online-tools/re_adojas.md)
- 对应的 C# 版本：[SharpFAI](../sharpfai/)