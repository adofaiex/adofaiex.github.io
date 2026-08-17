---
title: 解析器
order: 2
---

# 解析器

库提供四种解析器，按输入类型选择。所有解析器零依赖且兼容浏览器。

## StringParser —— 从字符串解析

处理不规范格式（尾部逗号、字符串中的原生换行）：

```ts
import { StringParser } from 'adofai'

const parser = new StringParser()
const data = parser.parse(`{ "angleData": [...], "settings": {...}, "actions": [...] }`)
```

## BufferParser —— 从字节流解析

直接解析 `Uint8Array` 二进制流，自动处理 BOM：

```ts
import { BufferParser } from 'adofai'

const parser = new BufferParser()
const u8 = new Uint8Array(await file.arrayBuffer())
const data = parser.parse(u8)
```

## ArrayBufferParser

接受 `ArrayBuffer` 或字符串，处理 BOM 剥离、尾逗号规范化与 UTF-8 解码：

```ts
import { ArrayBufferParser } from 'adofai'

const parser = new ArrayBufferParser()
const buffer = await response.arrayBuffer()
const data = parser.parse(buffer)
```

## LargeFileParser —— 超大关卡

内存优化的增量解析器，适合包含巨量 `angleData` / `actions` 的关卡：

```ts
import { LargeFileParser } from 'adofai'

const parser = new LargeFileParser((stage, percent) => {
  console.log(`[${stage}] ${percent}%`)
}, {
  skipLargeActions: false, // 超过 100MB 时跳过 actions
  maxActions: 0            // 限制解析的 actions 数量
})

const result = parser.parse(arrayBuffer)
// result: { settings?, angleData?, pathData?, actions?, decorations? }
```

关键行为：

- **< 50MB** —— 正常完整解析
- **> 50MB** —— `actions` 逐条增量解析
- **> 100MB** —— 可通过 `skipLargeActions: true` 完全跳过 actions
- **任意大小** —— `angleData` 始终逐数字增量解析