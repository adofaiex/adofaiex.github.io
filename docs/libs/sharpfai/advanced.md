---
title: Advanced Examples
order: 6
---

# Advanced Examples

Comprehensive use of various parts of the library's capabilities.

## Analyzing Levels

```csharp
var level = new Level("level.adofai");

// Get all speed changes
var speeds = level.GetAllSpeedChange();
Console.WriteLine($"Max BPM: {speeds.Max()}");

// Count events by type
var events = level.DeserializeEvents();
var eventStats = events.GroupBy(e => e.EventType)
    .Select(g => new { Type = g.Key, Count = g.Count() });

foreach (var stat in eventStats)
{
    Console.WriteLine($"{stat.Type}: {stat.Count}");
}
```

## Creating Floor Objects

```csharp
var level = new Level("level.adofai");
var floors = level.CreateFloors(usePositionTrack: true);

foreach (var floor in floors)
{
    Console.WriteLine($"Floor {floor.index}: Angle {floor.angle}°, BPM {floor.bpm}");
    var polygon = floor.GeneratePolygon();
    // Use polygon data for rendering
}
```

## Batch Event Operations

```csharp
// Remove all camera movements
level.RemoveEventsIf(e => e.EventType == EventType.MoveCamera);

// Find all Pause events with duration over 2 seconds
var longPauses = level.GetEventsIf(e =>
    e.EventType == EventType.Pause &&
    e.ToEvent<Pause>().Duration > 2.0);

// Remove specified events on a specified floor
level.RemoveFloorEvents(5, EventType.Twirl, 2);
```

## No-Effect Chart

```csharp
// Remove all visual effects (including decorations)
level.RemoveVFXs(includeDecorations: true);
level.Save("no-effect.adofai");
```

## Generating a Glide

```csharp
// Start from the 10th floor, C4 → E4 for 4 beats
level.GenerateGlide(startFloor: 10, Pitch.C4, Pitch.E4, duration: 4);
```

## What You Learned

- Use `DeserializeEvents` + LINQ to analyze levels
- Use `CreateFloors` to get floors with geometric data
- Use `RemoveEventsIf` / `GetEventsIf` for batch event operations
- Use `RemoveVFXs` to create no-effect charts in one step
