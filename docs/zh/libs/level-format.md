---
title: 认识关卡文件
order: 0
---

# 认识关卡文件

ADOFAI 的关卡文件 `.adofai` 本质上是一个 JSON 文件。

## 顶层结构

```json
{
  "settings": { ... },      // 关卡设置：BPM、曲名、作者等
  "angleData": [ ... ],     // 每个地板的路径角度
  "pathData": "...",        // 路径数据字符串
  "actions": [ ... ],       // 事件列表：判定、特效、转动等
  "decorations": [ ... ]    // 装饰物
}
```

## 常用字段

| 字段 | 说明 |
| --- | --- |
| `settings.bpm` | 关卡 BPM |
| `settings.artist` | 关卡作者 |
| `settings.song` | 歌曲名称 |
| `angleData` | 每个地板的角度数据 |
| `actions` | 事件列表，例如 `Twirl`、`MoveTrack`、`SetSpeed` |

## 事件示例

```json
{
  "floor": 10,
  "eventType": "Twirl",
  "twirl": true
}
```

上面的事件表示：在第 10 个地板处执行 Twirl（转向）。

## Path Data 编码

`pathData` 是 ADOFAI 用**字符**表示路径方向的字符串，例如 `"REJW"`；`angleData` 则是每个地板的**角度数值数组**。两者表达同一信息，可相互转换。

### 标准方向字符 → 绝对角度

| 字符 | 角度 | 字符 | 角度 | 字符 | 角度 | 字符 | 角度 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R | 0 | p | 15 | J | 30 | E | 45 |
| T | 60 | o | 75 | U | 90 | q | 105 |
| G | 120 | Q | 135 | H | 150 | W | 165 |
| L | 180 | x | 195 | N | 210 | Z | 225 |
| F | 240 | V | 255 | D | 270 | Y | 285 |
| B | 300 | C | 315 | M | 330 | A | 345 |
| `!` | 999（终点） | | | | | | |

### 特殊偏移字符 → 相对角度

| 字符 | 偏移 | 字符 | 偏移 |
| --- | --- | --- | --- |
| 5 | +72 | 6 | -72 |
| 7 | +52 | 8 | -52 |
| 9 | -30 | h | +120 |
| j | -120 | t | +60 |
| y | +300 | | |

偏移字符**不是**绝对角度，而是相对上一角度的变化：

```
result = previous_angle + offset
```

未知字符则沿用当前角度。

### 示例

`"REJW"` 转换结果（按 `R=0, E=45, J=30, W=165`）：

```
[0, 45, 30, 165]
```

### 用库转换

各库都提供 pathData 与 angleData 的互转能力，例如 [ADOFAI-JS](./adofai-js/)：

```ts
import { pathData } from 'adofai'

pathData.pathDataTable                       // 字符 → 角度映射表
const angleData = pathData.parseToangleData("REJW")  // [0, 45, 30, 165]
```

## 为什么需要库

直接用 JSON 操作关卡文件很繁琐：格式不规范（尾部逗号、字符串里的换行）、超大文件性能差、事件类型多。这就是 [ADOFAI-JS](./adofai-js/)、[SharpFAI](./sharpfai/) 等库存在的意义。