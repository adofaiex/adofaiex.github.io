---
title: Advanced Usage
order: 7
---

# Advanced Usage

For rendering pipelines, extra large levels, and other scenarios, the library provides two categories of advanced capabilities.

## Precompute Mode

Used when a rendering pipeline requires **deterministic event playback**. During loading, progress events are no longer triggered in real time; instead, they are cached for polling.

```ts
import { Level } from 'adofai'

const level = new Level(raw)
level.enablePrecomputeMode()
await level.load()
level.calculateTilePosition()

// Get cached events for all stages
const events = level.getPrecomputedEvents()
// { start: [...], pathData: [...], angleData: [...], ... }

// Get events up to a specified progress percentage
const at50 = level.getEventsAtPercent(50)
```

## Lightweight Data Mode

For extra large levels, the full `Tile[]` object has too much memory overhead. This mode precomputes only the compact data **necessary for rendering**.

```ts
// Precompute lightweight data (angle + position + twirl flag)
level.precomputeLightweight()

// Access compact data
const data = level.getLightweightData()
// { totalTiles, angles: number[], positions: [number,number][], twirlFlags: boolean[] }

// Access by range chunk
const chunk = level.getLightweightDataRange(0, 100)
// { angles: [...], positions: [...], twirlFlags: [...] }

// Get render data for a single tile
const tile = level.getTileRenderData(42)
// { angle, position, hasTwirl }
```

## Structure Interfaces

Core interfaces are imported via the `adofai/structure` subpath:

```ts
import type { AdofaiEvent, LevelOptions, Tile, ParseProgressEvent } from 'adofai/structure'

// AdofaiEvent:      { floor: number, eventType: string, [key: string]: any }
// LevelOptions:     { pathData?: string, angleData?: number[], actions, settings, decorations }
// Tile:             { direction?, angle?, actions, addDecorations?, position?, ... }
// ParseProgressEvent: { stage, current, total, percent, data? }
```

- `ParseProgressEvent.stage`: `start` → `pathData` | `angleData` → `relativeAngle` → `tilePosition` → `complete`
