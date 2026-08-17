---
title: Level Class
order: 3
---

# Level Class

`Level` is the core data structure of the library. It accepts ADOFAI file content (string, object, ArrayBuffer, Uint8Array, etc.) and provides tile management and export capabilities.

## Creating and Loading

```ts
import { Level } from 'adofai'

// Load from string
const level = new Level(adofaiJsonString)
await level.load()

// Use a custom parser
const level = new Level(rawData, bufferParser)
await level.load()

// Load from a pre-parsed object
const level = new Level({
  angleData: [...],
  settings: { ... },
  actions: [...],
  decorations: [...]
})
await level.load()

// Event-based loading (listen to progress)
level.on('parse:progress', (event) => {
  // { stage: 'relativeAngle', current: 500, total: 1000, percent: 50 }
  console.log(`${event.stage}: ${event.percent}%`)
})
level.load()
```

Progress stages: `start` → `pathData` | `angleData` → `relativeAngle` → `tilePosition` → `complete`

## Data Model

After loading, data is split into two layers:

```
┌──────────────────────────────────────────┐
│  Source data (read-only initial values)   │
│  level.angleData       — raw angle array   │
│  level.actions         — flat event list   │
│  level.__decorations   — flat deco list     │
│  level.settings        — level settings     │
├──────────────────────────────────────────┤
│  Working data (primary operation target) │
│  level.tiles           — Tile[]          │
└──────────────────────────────────────────┘
```

**All data operations are performed on `level.tiles`**. The source arrays (`angleData` / `actions` / `decorations`) are the initial input and are **not** synced when modifying tiles; they are rebuilt from `level.tiles` during export.

### Tile Structure

```ts
interface Tile {
  direction?: number;          // Raw angle value (including 999)
  angle?: number;              // Calculated relative angle
  _lastdir?: number;           // Previous tile's direction
  twirl?: number;              // Accumulated twirl count
  actions: ActionData[];       // Events on this tile
  addDecorations?: ActionData[]; // Decorations on this tile
  position?: number[];         // Calculated [x, y]
  extraProps?: Record<string, any>; // Additional computed data
}
```

## Reading and Modifying Tiles

```ts
// Read
const tile = level.tiles[42]
tile.direction;       // Raw angle value
tile.angle;           // Relative angle
tile.actions;         // Events on this tile
tile.addDecorations;  // Decorations on this tile
tile.twirl;           // Twirl count
tile.position;        // [x, y] (must be calculated first)

// Append
level.floorOperation({ type: 'append', direction: 180 })

// Insert at specified index
level.floorOperation({ type: 'insert', direction: 90, id: 10 })

// Delete
level.floorOperation({ type: 'delete', id: 10 })
```

## Querying Events

```ts
// Find all tiles containing the specified event type
const results = level.filterActionsByEventType('Flash')
// Returns { index: number, action: ActionData }[]

// Get events at the specified tile index
const { count, actions } = level.getActionsByIndex('MoveTrack', 5)
```

## Calculating Tile Positions

```ts
const positions = level.calculateTilePosition()
// Returns number[][] — [x, y] for each tile (including endpoint)

level.tiles[5].position   // [x, y]
level.tiles[5].extraProps // { angle1, angle2, cangle }
```

## Effect Filtering

All effect operations modify `level.tiles` in place:

```ts
import { Presets } from 'adofai'

// Use a preset (e.g. remove all effects)
level.clearEffect('preset_noeffect')

// Custom filter — keep only specified events
level.clearEvent({ type: 'include', events: ['SetSpeed', 'Twirl'] })

// Custom filter — exclude specified events
level.clearEvent({ type: 'exclude', events: ['Flash', 'Bloom'] })

// Clear all decorations
level.clearDeco()
```

## Export (Rebuild from Tiles)

```ts
// Export as a formatted ADOFAI JSON string
const str = level.export('string', 0, true)
// fs.writeFileSync('output.adofai', str)

// Export as an object
const obj = level.export('object', 0, true)
// { angleData, settings, actions, decorations }
// All three arrays are rebuilt from level.tiles
```

## Event System

```ts
// Listen to lifecycle events
const guid = level.on('load', (level) => { /* ... */ })

// Remove listener by GUID
level.off(guid)

// Trigger a custom event
level.trigger('custom:event', data)
```

## Events and Types

```ts
import { Events } from 'adofai'
import * as Types from 'adofai/types'
```
