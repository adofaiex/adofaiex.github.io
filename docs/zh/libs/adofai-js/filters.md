---
title: 特效过滤
order: 6
---

# 特效过滤

库提供**预设过滤**与**自定义过滤**两种方式，用于按事件类型清洗关卡（例如做「无特效」练习谱）。

## 预设

`Presets` 模块导出 5 个内置预设，配合 `level.clearEffect()` 使用：

| 预设 | 说明 |
| --- | --- |
| `preset_noeffect` | 去除屏幕特效类事件（Flash、SetFilter、Bloom、ScreenScroll 等 9 种） |
| `preset_noeffect_completely` | 彻底去除所有视觉/装饰/轨道类事件（保留 MultiPlanet / FreeRoam） |
| `preset_noholds` | 去除所有 Hold |
| `preset_nomovecamera` | 去除所有 MoveCamera |
| `preset_inner_no_deco` | 内部预设（`clearDeco` 使用），去除装饰相关事件 |

### preset_noeffect 移除的事件

`Flash`、`SetFilter`、`SetFilterAdvanced`、`HallOfMirrors`、`Bloom`、`ScalePlanets`、`ScreenTile`、`ScreenScroll`、`ShakeScreen`

### preset_noeffect_completely 移除的事件

`AddDecoration`、`AddText`、`AddObject`、`Checkpoint`、`SetHitsound`、`PlaySound`、`SetPlanetRotation`、`ScalePlanets`、`ColorTrack`、`AnimateTrack`、`RecolorTrack`、`MoveTrack`、`PositionTrack`、`MoveDecorations`、`SetText`、`SetObject`、`SetDefaultText`、`CustomBackground`、`Flash`、`MoveCamera`、`SetFilter`、`HallOfMirrors`、`ShakeScreen`、`Bloom`、`ScreenTile`、`ScreenScroll`、`SetFrameRate`、`RepeatEvents`、`SetConditionalEvents`、`EditorComment`、`Bookmark`、`Hold`、`SetHoldSound`、`Hide`、`ScaleMargin`、`ScaleRadius`

::: tip
`preset_noeffect_completely` 特意**保留**了 `MultiPlanet`、`FreeRoam`、`FreeRoamTwirl`、`FreeRoamRemove`，避免破坏谱面玩法。
:::

## 使用预设

```ts
import { Level } from 'adofai'

const level = new Level(raw)
await level.load()

level.clearEffect('preset_noeffect')          // 去除屏幕特效
level.clearEffect('preset_noeffect_completely') // 彻底去除视觉元素
```

## 自定义过滤

```ts
// 仅保留指定事件
level.clearEvent({ type: 'include', events: ['SetSpeed', 'Twirl'] })

// 排除指定事件
level.clearEvent({ type: 'exclude', events: ['Flash', 'Bloom'] })
```

## 清除装饰

```ts
level.clearDeco() // 清除所有地块的装饰
```

## 底层原理

过滤基于 `effectProcessor`（`type: 'include' | 'exclude' | 'special'`）与 `Presets`。所有操作就地修改 `level.tiles`，导出时会从 `tiles` 重建 `angleData` / `actions` / `decorations`。

## 实战示例

完整流程见[实战：去除关卡特效](../example-remove-effects.md)。