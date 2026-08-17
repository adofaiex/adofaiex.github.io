---
title: SharpFAI
order: 1
---

# SharpFAI

[SharpFAI](https://github.com/adofaiex/SharpFAI) is a C# ADOFAI level parsing library for parsing, manipulating, and exporting `.adofai` level files. Author: StArray, GPL-v3 license.

## Features

- Parse `.adofai` level files
- Manipulate level settings and events
- Calculate note times
- Add decorations and text
- Export modified levels
- Create and manipulate floor objects (including polygon meshes)
- Convert path data (pathData) to angle data (angleData)
- Batch event operations
- Visual effect removal
- Create levels from scratch

## System Requirements

- .NET Framework 4.8.1 or .NET 6.0+
- Newtonsoft.Json 13.0.4+

## Installation

```bash
dotnet add package SharpFAI
```

## Quick Start

```csharp
using SharpFAI.Serialization;
using SharpFAI.Util;

var level = new Level(pathToLevel: "path/to/level.adofai");

// Get level settings
var bpm = level.GetSetting<double>("bpm");
var artist = level.GetSetting<string>("artist");

// Add event: Twirl at the 10th floor
level.AddEvent(10, EventType.Twirl);

// Calculate note times
var noteTimes = level.GetNoteTimes();

// Remove visual effects (including decorations)
level.RemoveVFXs(includeDecorations: true);

// Get floor index by time (at 5 seconds)
int floorIndex = level.GetFloorIndexByNoteTime(5.0);

// Save the modified level
level.Save("modified-level.adofai");

// Create a level from scratch
var level2 = Level.CreateNewLevel();
level2.Save("new-level.adofai");
```

## Project Structure

| Directory | Description |
| --- | --- |
| `Events/` | Implemented event type classes (Twirl, Hold, SetSpeed, etc.) |
| `Framework/` | Core interfaces for game components and the `Floor` class |
| `Serialization/` | Level serialization/deserialization logic (`Level`, `BaseEvent`, etc.) |
| `Util/` | Utility classes and math functions (`LevelUtils`, `Pitch`, etc.) |
| `Test/` | Unit tests |

## Sections

- [Level Class](./level.md) — Core level API
- [Settings and PresetSettings](./settings.md) — Level settings
- [Event Types](./events.md) — EventType enum and event classes
- [Utility Classes](./utils.md) — LevelUtils extension methods, Floor, Pitch
- [Advanced Examples](./advanced.md) — Analysis, floors, and batch operations

## Interoperability

- TypeScript counterpart: [ADOFAI-JS](../adofai-js/)
- Practical example: [Removing Level Effects](../example-remove-effects.md)
