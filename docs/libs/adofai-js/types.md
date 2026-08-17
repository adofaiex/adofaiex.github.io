---
title: Shared Types
order: 4
---

# Shared Types

The `Types` module exports a series of ADOFAI shared types and constant enums.

## Basic Types

```ts
import { Types } from 'adofai'

// 2D coordinate
type Vec2 = [number, number]

// Position coordinate (array or object form)
type Vec2Like = [number, number] | { x: number; y: number }

// Boolean or ADOFAI string boolean ('Enabled' | 'Disabled' | 'true' | 'false')
type ABoolean = boolean | 'Enabled' | 'Disabled' | 'true' | 'false'

// Tile reference
type TileReference = [number, 'ThisTile' | 'Start' | 'End']
type TileReferenceType = 'ThisTile' | 'Start' | 'End'
```

## Constant Enums

| Enum | Values |
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

## Utility Functions

```ts
import { Types } from 'adofai'

// Check if an event is enabled (handles ABoolean semantics)
const enabled = Types.isEventEnabled(value, true)

// Resolve a relative tile reference
Types.resolveTileReference([2, 'End'], currentTileId, totalTiles)
// = totalTiles - 1 + 2

Types.resolveTileReference([-1, 'ThisTile'], 5, 100)
// = 4

// Normalize ADOFAI position format (array and object forms)
Types.normalizeVec2([3, 5])           // [3, 5]
Types.normalizeVec2({ x: 3, y: 5 })   // [3, 5]
```

### `isEventEnabled` Behavior

- Value is `undefined` → returns `defaultValue`
- Value is boolean → returned as-is
- Value is string → `'Enabled'` or `'true'` is treated as enabled

## Usage

```ts
import { Types } from 'adofai'

const hitbox: Types.Hitbox = 'NoEffect'

const filter = {
  eventType: 'SetFilter' as const,
  filterType: Types.FilterType.Bloom,
  enabled: Types.isEventEnabled('Enabled', true)
}
```
