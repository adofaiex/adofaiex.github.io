---
title: Understanding Level Files
order: 0
---

# Understanding Level Files

ADOFAI's level file `.adofai` is essentially a JSON file.

## Top-Level Structure

```json
{
  "settings": { ... },      // Level settings: BPM, song title, author, etc.
  "angleData": [ ... ],     // Path angle for each floor
  "pathData": "...",        // Path data string
  "actions": [ ... ],       // Event list: judgment, effects, rotation, etc.
  "decorations": [ ... ]    // Decorations
}
```

## Common Fields

| Field | Description |
| --- | --- |
| `settings.bpm` | Level BPM |
| `settings.artist` | Level author |
| `settings.song` | Song name |
| `angleData` | Angle data for each tile |
| `actions` | Event list, e.g. `Twirl`, `MoveTrack`, `SetSpeed` |

## Event Example

```json
{
  "floor": 10,
  "eventType": "Twirl",
  "twirl": true
}
```

The event above means: execute a Twirl (direction reversal) at the 10th tile.

## Path Data Encoding

`pathData` is a string where ADOFAI uses **characters** to represent path directions, e.g. `"REJW"`; `angleData` is an **array of angle values** for each tile. Both convey the same information and can be converted between each other.

### Standard Direction Characters → Absolute Angles

| Character | Angle | Character | Angle | Character | Angle | Character | Angle |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R | 0 | p | 15 | J | 30 | E | 45 |
| T | 60 | o | 75 | U | 90 | q | 105 |
| G | 120 | Q | 135 | H | 150 | W | 165 |
| L | 180 | x | 195 | N | 210 | Z | 225 |
| F | 240 | V | 255 | D | 270 | Y | 285 |
| B | 300 | C | 315 | M | 330 | A | 345 |
| `!` | 999 (endpoint) | | | | | | |

### Special Offset Characters → Relative Angles

| Character | Offset | Character | Offset |
| --- | --- | --- | --- |
| 5 | +72 | 6 | -72 |
| 7 | +52 | 8 | -52 |
| 9 | -30 | h | +120 |
| j | -120 | t | +60 |
| y | +300 | | |

Offset characters are **not** absolute angles, but rather changes relative to the previous angle:

```
result = previous_angle + offset
```

Unknown characters use the current angle as-is.

### Example

`"REJW"` conversion result (using `R=0, E=45, J=30, W=165`):

```
[0, 45, 30, 165]
```

### Converting with Libraries

Each library provides the ability to convert between pathData and angleData, for example [ADOFAI-JS](./adofai-js/):

```ts
import { pathData } from 'adofai'

pathData.pathDataTable                       // Character → angle mapping table
const angleData = pathData.parseToangleData("REJW")  // [0, 45, 30, 165]
```

## Why Libraries Are Needed

Directly manipulating level files with JSON is cumbersome: non-standard formatting (trailing commas, newlines in strings), poor performance with large files, and many event types. This is why libraries like [ADOFAI-JS](./adofai-js/) and [SharpFAI](./sharpfai/) exist.
