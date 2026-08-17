---
title: Utility Classes
order: 5
---

# Utility Classes

`SharpFAI.Util` provides `LevelUtils` extension methods, the `Pitch` pitch enum, and math utilities.

## LevelUtils

Extension methods for level operations. Some methods are cached (e.g. `GetNoteTimes`), and the cache is automatically invalidated when switching `Level` instances.

| Method | Description |
| --- | --- |
| `GetNoteTimes(bool addOffset)` | Calculate the list of (time, valid) for each note |
| `GetAllSpeedChange()` | Get all speed change values |
| `GenerateGlide(startFloor, startNote, endNote, duration)` | Generate a glide (start/end pitch uses `Pitch`) |
| `RemoveVFXs(includeDecorations, includeTracks, onDelete)` | Remove visual effects |
| `AddCube(cubeImage, position, size, floorCount, floor, tag, relativeToScreen)` | Add a cube decoration with depth effect |
| `CreateFloors(usePositionTrack)` | Create a list of `Floor` objects from level data |
| `GetFloorIndexByNoteTime(noteTimeSecond)` | Get the floor index by note time |

```csharp
var noteTimes = level.GetNoteTimes();
var speeds = level.GetAllSpeedChange();
var floors = level.CreateFloors(usePositionTrack: true);
int idx = level.GetFloorIndexByNoteTime(5.0);
```

### RemoveVFXs

```csharp
level.RemoveVFXs(includeDecorations: true);
```

### GenerateGlide

```csharp
level.GenerateGlide(startFloor: 10, Pitch.C4, Pitch.E4, duration: 4);
```

## Floor Class

`SharpFAI.Framework.Floor` represents a floor tile with polygon mesh data:

| Member | Description |
| --- | --- |
| `entryAngle` / `exitAngle` | Entry / exit angle (read-only) |
| `angle` | Current angle |
| `position` | Position `Vector2` |
| `bpm` / `entryTime` | BPM and entry time for this floor |
| `events` | Event list for this floor `List<BaseEvent>` |
| `index` | Floor index |
| `isMidspin` / `isCW` | Mid-spin flag / clockwise flag |
| `lastFloor` / `nextFloor` | Previous / next floor references |
| `length` / `width` / `outline` | Static geometric dimensions (75 / 41.75 / 2) |
| `GeneratePolygon()` | Generate or return cached polygon mesh |

```csharp
var floors = level.CreateFloors(usePositionTrack: true);
foreach (var floor in floors)
{
    var polygon = floor.GeneratePolygon();
    // Use polygon for rendering
}
```

## Pitch

The `Pitch` enum covers C0–B8 (including semitones `Cs`/`Ds`/...); `PitchHelper` provides pitch utilities:

```csharp
using SharpFAI.Util;

double freq = PitchHelper.GetFrequency(Pitch.A4);   // 440.0
Pitch p = PitchHelper.ParsePitch("C#4");            // Parse pitch name string
```

The start/end pitch for `GenerateGlide` uses `Pitch`.

## Other Utilities

- `FloatMath`: Floating-point math functions
- `GraphicUtils`: Graphics utilities
- `MoreMethods`: Other extensions
- `EventUtils`: Event utilities
