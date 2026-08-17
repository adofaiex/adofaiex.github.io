---
title: Level Class
order: 2
---

# Level Class

`Level` is the main entry point of the library, providing methods to load, manipulate, and save ADOFAI levels. It is located in the `SharpFAI.Serialization` namespace.

## Constructor

```csharp
// Load from file path
var level = new Level("path/to/level.adofai");

// Initialize from level info dictionary
var level = new Level(levelInfoDict);

// Create a new level with default settings
var level = Level.CreateNewLevel();
```

## Properties

| Property | Description |
| --- | --- |
| `root` | Root JSON object of the level (`angleData` / `settings` / `actions` / `decorations` always in sync) |
| `settings` | Level settings `JObject` |
| `angleData` | Angle array `JArray` |
| `actions` | Event list `JArray` |
| `decorations` | Decoration list `JArray` (exists when version > 10) |
| `angles` | Read-only angle array `ReadOnlyCollection<double>` |
| `pathToLevel` | File path when loaded |
| `deserializedEvents` | Read-only deserialized event list |

The constructor automatically handles the following: reads directly when `angleData` exists; calls `InitAngleData()` to convert when only `pathData` exists; and pre-deserializes events.

## Settings Management

```csharp
var bpm = level.GetSetting<double>("bpm");        // Read
level.PutSetting("bpm", 180);                     // Write
bool has = level.HasSetting("artist");            // Whether it exists
level.RemoveSettings("offset", "pitch");          // Remove multiple settings

level.SetSong("song.mp3");                        // Set song
var audioPath = level.GetAudioPath();             // Absolute path of audio file
```

| Method | Description |
| --- | --- |
| `GetSetting<T>(string)` | Get a setting value |
| `PutSetting<T>(string, T)` | Set a setting value |
| `HasSetting(string)` | Check if a setting exists |
| `RemoveSettings(params string[])` | Remove multiple settings |
| `SetSong(string)` | Set the level song |
| `GetAudioPath()` | Get the absolute path of the audio file |

## Event Management

```csharp
// Add event at specified floor
level.AddEvent(10, EventType.Twirl);

// Add using an event object
var hold = new Hold(duration: 4) { Floor = 5 };
level.AddEvent(hold);

// Query
var events = level.GetFloorEvents(10);            // All events on floor 10
var twirls = level.GetEvents(EventType.Twirl);    // All Twirls
var longPauses = level.GetEventsIf(e =>
    e.EventType == EventType.Pause && e.ToEvent<Pause>().Duration > 2.0);

// Check
bool hasAny = level.HasEvents(10);
bool hasTwirl = level.HasEvents(10, EventType.Twirl);

// Remove
level.RemoveEventsIf(e => e.EventType == EventType.MoveCamera);
level.RemoveFloorEvents(5, EventType.Twirl, 2);
```

| Method | Description |
| --- | --- |
| `AddEvent(int floor, EventType type, JObject data)` | Add an event to a floor |
| `AddEvent(BaseEvent)` | Add an event from an event object |
| `GetEvents(int floor, EventType type)` | Get events of a specific type on a specific floor |
| `GetFloorEvents(int floor)` | Get all events on a floor |
| `GetEvents(EventType type)` | Get all events of a specific type |
| `GetEventsIf(Func<BaseEvent, bool>)` | Get events matching a condition |
| `HasEvents(int floor)` / `HasEvents(int floor, EventType)` | Check if a floor has events |
| `RemoveEventsIf(Func<BaseEvent, bool>)` | Remove events matching a condition |
| `RemoveFloorEvents(int floor, EventType type, int count)` | Remove events from a floor |
| `DeserializeEvents(bool includeDecorations)` | Deserialize events into objects |

## Decoration Management

```csharp
// Add text decoration
level.AddTextToDecorations(10, "Hello", tag: "title", relativeToScreen: true);

// Add decoration
level.AddDecoration(10, EventType.AddText, "title", false, null);
```

| Method | Description |
| --- | --- |
| `AddTextToDecorations(int floor, string text, string tag, bool relativeToScreen, JObject data)` | Add a text decoration |
| `AddDecoration(int floor, EventType type, string tag, bool relativeToScreen, JObject data)` | Add a decoration |

## Serialization

```csharp
level.Save("modified-level.adofai");     // Save to file
string json = level.ToString();          // Convert to JSON string
```

| Method | Description |
| --- | --- |
| `Save(string newLevelPath, bool indent = true)` | Save the level to a file |
| `ToString(bool indent = true)` | Convert to JSON string |

## Equality Comparison

`Level` overloads `==` / `!=`: when both have file paths, they are compared by path; otherwise, they are compared item by item via deep comparison of `root`, `decorations`, `settings`, `angleData`, and `actions`.
