---
title: 高级用法
order: 7
---

# 高级用法

对于渲染管线、超大关卡等场景，库提供两类高级能力。

## 预计算模式

渲染管线需要**确定性的事件回放**时使用。加载期间不再实时触发进度事件，而是缓存起来供轮询。

```ts
import { Level } from 'adofai'

const level = new Level(raw)
level.enablePrecomputeMode()
await level.load()
level.calculateTilePosition()

// 获取所有阶段缓存的事件
const events = level.getPrecomputedEvents()
// { start: [...], pathData: [...], angleData: [...], ... }

// 获取到指定进度百分比为止的事件
const at50 = level.getEventsAtPercent(50)
```

## 轻量数据模式

对超大关卡，完整 `Tile[]` 对象内存开销过大。此模式只预计算**渲染必需**的紧凑数据。

```ts
// 预计算轻量数据（角度 + 位置 + twirl 标记）
level.precomputeLightweight()

// 访问紧凑数据
const data = level.getLightweightData()
// { totalTiles, angles: number[], positions: [number,number][], twirlFlags: boolean[] }

// 按范围分块访问
const chunk = level.getLightweightDataRange(0, 100)
// { angles: [...], positions: [...], twirlFlags: [...] }

// 获取单个地块的渲染数据
const tile = level.getTileRenderData(42)
// { angle, position, hasTwirl }
```

## 结构接口

核心接口通过 `adofai/structure` 子路径导入：

```ts
import type { AdofaiEvent, LevelOptions, Tile, ParseProgressEvent } from 'adofai/structure'

// AdofaiEvent:      { floor: number, eventType: string, [key: string]: any }
// LevelOptions:     { pathData?: string, angleData?: number[], actions, settings, decorations }
// Tile:             { direction?, angle?, actions, addDecorations?, position?, ... }
// ParseProgressEvent: { stage, current, total, percent, data? }
```

- `ParseProgressEvent.stage`：`start` → `pathData` | `angleData` → `relativeAngle` → `tilePosition` → `complete`