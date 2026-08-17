---
title: 工具类
order: 5
---

# 工具类

`SharpFAI.Util` 提供 `LevelUtils` 扩展方法、`Pitch` 音高枚举与数学工具。

## LevelUtils

关卡操作的扩展方法。部分方法带缓存（如 `GetNoteTimes`），切换 `Level` 实例时自动失效。

| 方法 | 说明 |
| --- | --- |
| `GetNoteTimes(bool addOffset)` | 计算每个音符的（时间, 是否有效）列表 |
| `GetAllSpeedChange()` | 获取全部速度变化值 |
| `GenerateGlide(startFloor, startNote, endNote, duration)` | 生成滑音（起止音高用 `Pitch`） |
| `RemoveVFXs(includeDecorations, includeTracks, onDelete)` | 移除视觉特效 |
| `AddCube(cubeImage, position, size, floorCount, floor, tag, relativeToScreen)` | 添加带深度效果的立方体装饰 |
| `CreateFloors(usePositionTrack)` | 从关卡数据创建 `Floor` 对象列表 |
| `GetFloorIndexByNoteTime(noteTimeSecond)` | 通过音符时间获取地板索引 |

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

## Floor 类

`SharpFAI.Framework.Floor` 表示带有多边形网格数据的地板瓦片：

| 成员 | 说明 |
| --- | --- |
| `entryAngle` / `exitAngle` | 进入 / 退出角度（只读） |
| `angle` | 当前角度 |
| `position` | 位置 `Vector2` |
| `bpm` / `entryTime` | 该地板的 BPM 与进入时间 |
| `events` | 该地板的事件列表 `List<BaseEvent>` |
| `index` | 地板索引 |
| `isMidspin` / `isCW` | 中旋标记 / 顺时针标记 |
| `lastFloor` / `nextFloor` | 前后地板引用 |
| `length` / `width` / `outline` | 静态几何尺寸（75 / 41.75 / 2） |
| `GeneratePolygon()` | 生成或返回缓存的多边形网格 |

```csharp
var floors = level.CreateFloors(usePositionTrack: true);
foreach (var floor in floors)
{
    var polygon = floor.GeneratePolygon();
    // 用 polygon 做渲染
}
```

## Pitch 音高

`Pitch` 枚举覆盖 C0–B8（含半音 `Cs`/`Ds`/...）；`PitchHelper` 提供音高工具：

```csharp
using SharpFAI.Util;

double freq = PitchHelper.GetFrequency(Pitch.A4);   // 440.0
Pitch p = PitchHelper.ParsePitch("C#4");            // 解析字符串音名
```

`GenerateGlide` 的起止音高就使用 `Pitch`。

## 其他工具

- `FloatMath`：浮点数学函数
- `GraphicUtils`：图形工具
- `MoreMethods`：其他扩展
- `EventUtils`：事件工具