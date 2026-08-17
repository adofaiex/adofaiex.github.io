---
title: Event Types
order: 4
---

# Event Types

The `EventType` enum covers all ADOFAI event types; the library provides **concrete event classes** for some of them in the `Events/` directory (the rest can be handled via `BaseEvent`'s `ToEvent<T>()` or by passing a `JObject` directly).

## EventType Enum

```csharp
level.AddEvent(10, EventType.Twirl);
level.AddEvent(5, EventType.Hold);
```

Enum members include: `SetSpeed`, `Twirl`, `Checkpoint`, `MoveCamera`, `CustomBackground`, `ChangeTrack`, `ColorTrack`, `AnimateTrack`, `RecolorTrack`, `MoveTrack`, `AddDecoration`, `AddText`, `SetText`, `Flash`, `SetHitsound`, `SetFilter`, `SetFilterAdvanced`, `SetPlanetRotation`, `HallOfMirrors`, `ShakeScreen`, `MoveDecorations`, `PositionTrack`, `RepeatEvents`, `Bloom`, `Hold`, `SetHoldSound`, `SetConditionalEvents`, `ScreenTile`, `ScreenScroll`, `EditorComment`, `Bookmark`, `CallMethod`, `AddComponent`, `PlaySound`, `MultiPlanet`, `FreeRoam`, `FreeRoamTwirl`, `FreeRoamRemove`, `FreeRoamWarning`, `Pause`, `AutoPlayTiles`, `Hide`, `ScaleMargin`, `ScaleRadius`, `Multitap`, `TileDimensions`, `KillPlayer`, `ScalePlanets`, `SetFloorIcon`, `AddObject`, `SetObject`, `SetDefaultText`, `SetFrameRate`, `AddParticle`, `SetParticle`, `EmitParticle`, `SetInputEvent`, and more.

## Implemented Event Classes

Located in the `SharpFAI.Events` namespace, all inheriting from `BaseEvent`:

| Event Class | Key Fields |
| --- | --- |
| `SetSpeed` | `SpeedType` (Bpm / BpmMultiplier), `BeatsPerMinute`, `BpmMultiplier`, `AngleOffset` |
| `Twirl` | `Twirl` (true/false) |
| `Hold` | `Duration`, `DistanceMultiplier`, `LandingAnimation` |
| `MoveCamera` | `Duration`, `RelativeTo`, `Position`, `Rotation`, `Zoom`, `AngleOffset`, `Ease`, `EventTag` |
| `Pause` | `Duration`, `CountdownTicks`, `AngleCorrectionDir` |
| `FreeRoam` | Free roam related fields |
| `PositionTrack` | Track positioning related fields |
| `MultiPlanet` | Multi-planet related fields |
| `Bookmark` | Bookmark marker |
| `Unknown` | Unrecognized unknown event |

Event classes all have field constructor parameters (e.g. `new Hold(duration: 4)`, `new Pause(duration: 1)`), and `Floor` can be set via object initializer.

## BaseEvent

The base class for all events, located in `SharpFAI.Serialization`:

```csharp
public class BaseEvent
{
    [JsonProperty("eventType")]
    public EventType EventType;

    [JsonProperty("floor")]
    public int Floor;

    public static BaseEvent Empty { get; }

    public override string ToString();   // Serialize to JSON
    public T ToEvent<T>() where T : BaseEvent;  // Convert to concrete event type
}
```

### ToEvent\<T\>

Converts an event to a concrete type to access its fields:

```csharp
var longPauses = level.GetEventsIf(e =>
    e.EventType == EventType.Pause &&
    e.ToEvent<Pause>().Duration > 2.0);
```

Throws `InvalidCastException` when the type does not match.

## Event Enums

`SharpFAI.Serialization.EventEnums` provides enums used by events:

| Enum | Values |
| --- | --- |
| `SpeedType` | `Bpm` / `BpmMultiplier` |
| `CamMovementType` | Camera movement relative mode |
| `Ease` | Easing functions |
| `AngleCorrectionDirection` | Angle correction direction |

## Usage Example

```csharp
// Add using an event object
var setSpeed = new SetSpeed(EventEnums.SpeedType.Bpm)
{
    Floor = 0,
    BeatsPerMinute = 180
};
level.AddEvent(setSpeed);

// Count events
var events = level.DeserializeEvents();
var stats = events.GroupBy(e => e.EventType)
    .Select(g => new { Type = g.Key, Count = g.Count() });
```
