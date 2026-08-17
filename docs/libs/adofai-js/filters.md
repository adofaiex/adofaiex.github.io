---
title: Effect Filtering
order: 6
---

# Effect Filtering

The library provides two approaches — **preset filtering** and **custom filtering** — for cleaning up levels by event type (e.g., creating "no-effect" practice charts).

## Presets

The `Presets` module exports 5 built-in presets, used with `level.clearEffect()`:

| Preset | Description |
| --- | --- |
| `preset_noeffect` | Removes screen effect events (Flash, SetFilter, Bloom, ScreenScroll, etc. — 9 types) |
| `preset_noeffect_completely` | Completely removes all visual/decoration/track events (preserves MultiPlanet / FreeRoam) |
| `preset_noholds` | Removes all Hold events |
| `preset_nomovecamera` | Removes all MoveCamera events |
| `preset_inner_no_deco` | Internal preset (used by `clearDeco`), removes decoration-related events |

### Events Removed by preset_noeffect

`Flash`, `SetFilter`, `SetFilterAdvanced`, `HallOfMirrors`, `Bloom`, `ScalePlanets`, `ScreenTile`, `ScreenScroll`, `ShakeScreen`

### Events Removed by preset_noeffect_completely

`AddDecoration`, `AddText`, `AddObject`, `Checkpoint`, `SetHitsound`, `PlaySound`, `SetPlanetRotation`, `ScalePlanets`, `ColorTrack`, `AnimateTrack`, `RecolorTrack`, `MoveTrack`, `PositionTrack`, `MoveDecorations`, `SetText`, `SetObject`, `SetDefaultText`, `CustomBackground`, `Flash`, `MoveCamera`, `SetFilter`, `HallOfMirrors`, `ShakeScreen`, `Bloom`, `ScreenTile`, `ScreenScroll`, `SetFrameRate`, `RepeatEvents`, `SetConditionalEvents`, `EditorComment`, `Bookmark`, `Hold`, `SetHoldSound`, `Hide`, `ScaleMargin`, `ScaleRadius`

::: tip
`preset_noeffect_completely` intentionally **preserves** `MultiPlanet`, `FreeRoam`, `FreeRoamTwirl`, `FreeRoamRemove` to avoid breaking chart gameplay.
:::

## Using Presets

```ts
import { Level } from 'adofai'

const level = new Level(raw)
await level.load()

level.clearEffect('preset_noeffect')          // Remove screen effects
level.clearEffect('preset_noeffect_completely') // Completely remove visual elements
```

## Custom Filtering

```ts
// Keep only specified events
level.clearEvent({ type: 'include', events: ['SetSpeed', 'Twirl'] })

// Exclude specified events
level.clearEvent({ type: 'exclude', events: ['Flash', 'Bloom'] })
```

## Clearing Decorations

```ts
level.clearDeco() // Clear decorations on all tiles
```

## Under the Hood

Filtering is based on `effectProcessor` (`type: 'include' | 'exclude' | 'special'`) and `Presets`. All operations modify `level.tiles` in place; during export, `angleData` / `actions` / `decorations` are rebuilt from `tiles`.

## Practical Example

For the complete workflow, see [Practical: Removing Level Effects](../example-remove-effects.md).
