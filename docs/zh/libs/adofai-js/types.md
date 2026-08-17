---
title: 共享类型
order: 4
---

# 共享类型

`Types` 模块导出一系列 ADOFAI 共享类型与常量枚举。

## 基础类型

```ts
import { Types } from 'adofai'

// 二维坐标
type Vec2 = [number, number]

// 位置坐标（数组或对象形式）
type Vec2Like = [number, number] | { x: number; y: number }

// 布尔或 ADOFAI 字符串布尔（'Enabled' | 'Disabled' | 'true' | 'false'）
type ABoolean = boolean | 'Enabled' | 'Disabled' | 'true' | 'false'

// 地块引用
type TileReference = [number, 'ThisTile' | 'Start' | 'End']
type TileReferenceType = 'ThisTile' | 'Start' | 'End'
```

## 常量枚举

| 枚举 | 值 |
| --- | --- |
| `TextAnchor` | UpperLeft / UpperCenter / UpperRight / MiddleLeft / MiddleCenter / MiddleRight / LowerLeft / LowerCenter / LowerRight |
| `Hitbox` | None / Kill / PassThrough / NoEffect |
| `FilterType` | Grayscale / Sepia / Invert / Pixellate / Blur / Glitch / Bloom / VHS / Warp / RadialBlur / Custom |
| `FlashStyle` | Flash / Reverse / StayBlack / Kill / FlashEx |
| `RelativeTo` | Tile / LastPosition / Player |
| `TargetPlanet` | All / Current / Specific |
| `AngleCorrectionDir` | None / CW / CCW |
| `InputEventState` | Subscribe / Unsubscribe |
| `InputEventTarget` | Pressed / Released / Held / Neutral |
| `Condition` | IfPassed / IfFailed |
| `BgDisplayMode` | FitToScreen / Unscaled / Tiled |
| `BgShapeType` | Disabled / Tile / Circle / Diamond / Triangle / Hexagon / Donut / Pentagon / Custom |
| `HitsoundType` | Kick / Snare / Hat / Clap / Custom |
| `HoldMidSoundTimingRelativeTo` | Start / End |

## 工具函数

```ts
import { Types } from 'adofai'

// 判断事件是否启用（处理 ABoolean 语义）
const enabled = Types.isEventEnabled(value, true)

// 解析相对地块引用
Types.resolveTileReference([2, 'End'], currentTileId, totalTiles)
// = totalTiles - 1 + 2

Types.resolveTileReference([-1, 'ThisTile'], 5, 100)
// = 4

// 规范化 ADOFAI 位置格式（数组与对象形式）
Types.normalizeVec2([3, 5])           // [3, 5]
Types.normalizeVec2({ x: 3, y: 5 })   // [3, 5]
```

### `isEventEnabled` 行为

- 值为 `undefined` → 返回 `defaultValue`
- 值为布尔 → 原样返回
- 值为字符串 → `'Enabled'` 或 `'true'` 视为开启

## 用法

```ts
import { Types } from 'adofai'

const hitbox: Types.Hitbox = 'NoEffect'

const filter = {
  eventType: 'SetFilter' as const,
  filterType: Types.FilterType.Bloom,
  enabled: Types.isEventEnabled('Enabled', true)
}
```