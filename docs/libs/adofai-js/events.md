---
title: Event Types
order: 5
---

# Event Types

The `Events` module exports TypeScript definitions for **56** ADOFAI event types, covering all events including gameplay, track, camera, decoration, and more. They are categorized by function below.

## Gameplay and Judgment

| Event | Description |
| --- | --- |
| SetSpeed | Change note speed (BPM scaling) |
| Twirl | Path reversal (reverse direction) |
| Checkpoint | Checkpoint |
| Hold | Long press |
| SetHoldSound | Set hold sound effect |
| SetHitsound | Set hit sound effect |
| KillPlayer | Kill the player |
| Pause | Pause |
| Multitap | Multi-tap |
| SetInputEvent | Subscribe/unsubscribe to input events |
| AutoPlayTiles | Auto-play tiles |
| MultiPlanet | Multi-planet |
| FreeRoam / FreeRoamTwirl / FreeRoamRemove | Free roam / turn / remove |
| RepeatEvents | Repeat events |
| SetConditionalEvents | Conditional events (pass/fail) |
| SetFrameRate | Set frame rate |
| TileDimensions | Tile dimensions |
| ScalePlanets | Scale planets |
| ScaleRadius | Scale radius |
| ScaleMargin | Scale margin |

## Track

| Event | Description |
| --- | --- |
| MoveTrack | Move track |
| PositionTrack | Position track |
| ColorTrack | Color track |
| RecolorTrack | Recolor track |
| AnimateTrack | Animate track |
| ChangeTrack | Change track |
| SetPlanetRotation | Set planet rotation |
| Hide | Hide (track/player, etc.) |
| MoveDecorations | Move decorations |

## Camera and Screen

| Event | Description |
| --- | --- |
| MoveCamera | Move camera |
| ScreenScroll | Screen scroll |
| ScreenTile | Screen tile |
| ShakeScreen | Screen shake |
| Flash | Screen flash |

## Filters and Post-Processing

| Event | Description |
| --- | --- |
| SetFilter | Set filter |
| SetFilterAdvanced | Advanced filter |
| HallOfMirrors | Hall of mirrors |
| Bloom | Bloom |

## Decoration, Objects, and Text

| Event | Description |
| --- | --- |
| AddDecoration | Add decoration |
| AddText | Add text |
| AddObject | Add object |
| SetObject | Set object |
| SetText | Set text |
| SetDefaultText | Set default text |
| AddComponent | Add component |
| SetFloorIcon | Set floor icon |
| CustomBackground | Custom background |

## Particles

| Event | Description |
| --- | --- |
| AddParticle | Add particle |
| SetParticle | Set particle |
| EmitParticle | Emit particle |

## Others

| Event | Description |
| --- | --- |
| PlaySound | Play sound |
| EditorComment | Editor comment |
| Bookmark | Bookmark |
| CallMethod | Call method |

## Usage

```ts
import { Events } from 'adofai'
import type { SetSpeed } from 'adofai'

const ev: Events.SetSpeed = {
  floor: 0,
  eventType: 'SetSpeed',
  speedType: 'Bpm',
  beatsPerMinute: 180
}
```

> The specific fields for each event are defined in the type definitions under `src/events/` in the repository.
