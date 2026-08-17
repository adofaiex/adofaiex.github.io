---
title: 实战：去除关卡特效
order: 2
---

# 实战：去除关卡特效

这个示例综合运用多个库，完成「读取关卡 → 移除特效事件 → 导出」的完整流程。

## 场景

很多玩家想要「无特效」版本的谱面用于练习。做法：把所有特效事件（如 `MoveDecorations`、`ScreenScroll` 等）移除。

> 在线版：[NoEffect 工具](../mods/online-tools/noeffect.md)
> 游戏内版：[YqlossClientHarmony](../mods/yqlossclientharmony.md)

## 用 ADOFAI-JS（TypeScript）实现

```ts
import { Level } from 'adofai'

const level = new Level(raw)
await level.load()

// 使用内置预设一键去除所有特效
level.clearEffect('preset_noeffect')

// 或自定义过滤：仅排除指定特效事件
level.clearEvent({ type: 'exclude', events: ['Flash', 'Bloom'] })

// 导出
const out = level.export('string', 0, true)
fs.writeFileSync('no-effect.adofai', out)
```

## 用 SharpFAI（C#）实现

```csharp
var level = new Level("input.adofai");

// 移除所有视觉特效（含装饰）
level.RemoveVFXs(includeDecorations: true);

level.Save("no-effect.adofai");
```

> 不同版本的具体 API 可能有差异，请以对应库的文档为准。

## 导出并验证

1. 把导出的文件放进 ADOFAI 的关卡目录
2. 在游戏内加载，确认特效已移除、判定不受影响

## 你学到了什么

- 「读取 → 过滤 → 导出」的完整流程
- 特效移除的基本思路（预设过滤 / 条件过滤）