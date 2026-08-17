---
title: 设置与 PresetSettings
order: 3
---

# 设置与 PresetSettings

`LevelSetting` 继承自 `JObject`，通过 `(键, 值)` 构造一个设置项；`PresetSettings` 静态类则提供了一整套**预设的默认设置值**，位于 `SharpFAI.Serialization` 命名空间。

## LevelSetting

```csharp
var setting = new LevelSetting("bpm", 180);
```

## 常用预设

### 曲目信息

| 预设 | 默认值 |
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

### 轨道

| 预设 | 默认值 |
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

### 背景

| 预设 | 默认值 |
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

### 其他

| 预设 | 默认值 |
| --- | --- |
| `PresetSettings.Version` | `15` |
| `PresetSettings.Difficulty` | `1` |
| `PresetSettings.SpeedTrialAim` | `0` |
| `PresetSettings.RequiredMods` | `[]` |
| `PresetSettings.SeizureWarning` | `false` |
| `PresetSettings.LockRot` | `false` |
| `PresetSettings.LoopBG` | `false` |
| `PresetSettings.LevelDesc` / `LevelTags` | `""` |

## 用法

把预设值写入关卡：

```csharp
var level = Level.CreateNewLevel();

level.PutSetting("bpm", PresetSettings.Bpm);
level.PutSetting("songFilename", PresetSettings.SongFilename);
level.PutSetting("trackColor", PresetSettings.TrackColor);
level.PutSetting("backgroundColor", PresetSettings.BackgroundColor);
```

> 完整预设列表以源码 `Serialization/LevelSetting.cs` 为准。