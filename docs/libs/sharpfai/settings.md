---
title: Settings and PresetSettings
order: 3
---

# Settings and PresetSettings

`LevelSetting` inherits from `JObject`, constructing a setting entry via `(key, value)`; the `PresetSettings` static class provides a complete set of **preset default setting values**, located in the `SharpFAI.Serialization` namespace.

## LevelSetting

```csharp
var setting = new LevelSetting("bpm", 180);
```

## Common Presets

### Track Info

| Preset | Default Value |
| --- | --- |
| `PresetSettings.Song` | `""` |
| `PresetSettings.SongFilename` | `""` |
| `PresetSettings.SongURL` | `""` |
| `PresetSettings.Author` | `"Created Level by SharpFAI"` |
| `PresetSettings.Artist` | `""` |
| `PresetSettings.Bpm` | `100` |
| `PresetSettings.Volume` | `100` |
| `PresetSettings.Offset` | `0` |
| `PresetSettings.Pitch` | `100` |
| `PresetSettings.Hitsound` | `"Kick"` |
| `PresetSettings.HitsoundVolume` | `100` |
| `PresetSettings.CountdownTicks` | `4` |
| `PresetSettings.PreviewSongStart` | `0` |
| `PresetSettings.PreviewSongDuration` | `10` |
| `PresetSettings.PreviewImage` / `PreviewIcon` | `""` |
| `PresetSettings.PreviewIconColor` | `"003f52"` |
| `PresetSettings.SeperateCountdownTime` | `true` |

### Track

| Preset | Default Value |
| --- | --- |
| `PresetSettings.TileShape` | `"Long"` |
| `PresetSettings.TrackColorType` | `"Single"` |
| `PresetSettings.TrackColor` | `"debb7b"` |
| `PresetSettings.SecondaryTrackColor` | `"ffffff"` |
| `PresetSettings.TrackColorAnimDuration` | `2` |
| `PresetSettings.TrackColorPulse` | `"None"` |
| `PresetSettings.TrackPulseLength` | `10` |
| `PresetSettings.TrackStyle` | `"Standard"` |
| `PresetSettings.TrackTexture` / `TrackTextureScale` | `""` / `1` |
| `PresetSettings.TrackGlowIntensity` | `100` |
| `PresetSettings.TrackAnimation` | `"None"` |
| `PresetSettings.BeatsAhead` | `3` |
| `PresetSettings.BeatsBehind` | `4` |

### Background

| Preset | Default Value |
| --- | --- |
| `PresetSettings.BackgroundColor` | `"000000"` |
| `PresetSettings.BgImage` | `""` |
| `PresetSettings.BgImageColor` | `"ffffff"` |
| `PresetSettings.BgDisplayMode` | `"FitToScreen"` |
| `PresetSettings.Parallax` | `[100, 100]` |
| `PresetSettings.ShowDefaultBGIfNoImage` | `true` |
| `PresetSettings.ShowDefaultBGTile` | `true` |
| `PresetSettings.DefaultBGTileColor` | `"101121"` |
| `PresetSettings.DefaultBGShapeType` | `"Default"` |
| `PresetSettings.DefaultBGShapeColor` | `"ffffff"` |

### Others

| Preset | Default Value |
| --- | --- |
| `PresetSettings.Version` | `15` |
| `PresetSettings.Difficulty` | `1` |
| `PresetSettings.SpeedTrialAim` | `0` |
| `PresetSettings.RequiredMods` | `[]` |
| `PresetSettings.SeizureWarning` | `false` |
| `PresetSettings.LockRot` | `false` |
| `PresetSettings.LoopBG` | `false` |
| `PresetSettings.LevelDesc` / `LevelTags` | `""` |

## Usage

Writing preset values into a level:

```csharp
var level = Level.CreateNewLevel();

level.PutSetting("bpm", PresetSettings.Bpm);
level.PutSetting("songFilename", PresetSettings.SongFilename);
level.PutSetting("trackColor", PresetSettings.TrackColor);
level.PutSetting("backgroundColor", PresetSettings.BackgroundColor);
```

> The complete preset list is defined in the source file `Serialization/LevelSetting.cs`.
