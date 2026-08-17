---
title: 事件类型
order: 4
---

# 事件类型

`EventType` 枚举覆盖全部 ADOFAI 事件类型；库在 `Events/` 目录下为其中一部分提供了**具体的事件类**（其余可用 `BaseEvent` 的 `ToEvent<T>()` 或直接传 `JObject` 处理）。

## EventType 枚举

```csharp
level.AddEvent(10, EventType.Twirl);
level.AddEvent(5, EventType.Hold);
```

枚举成员包括：`SetSpeed`、`Twirl`、`Checkpoint`、`MoveCamera`、`CustomBackground`、`ChangeTrack`、`ColorTrack`、`AnimateTrack`、`RecolorTrack`、`MoveTrack`、`AddDecoration`、`AddText`、`SetText`、`Flash`、`SetHitsound`、`SetFilter`、`SetFilterAdvanced`、`SetPlanetRotation`、`HallOfMirrors`、`ShakeScreen`、`MoveDecorations`、`PositionTrack`、`RepeatEvents`、`Bloom`、`Hold`、`SetHoldSound`、`SetConditionalEvents`、`ScreenTile`、`ScreenScroll`、`EditorComment`、`Bookmark`、`CallMethod`、`AddComponent`、`PlaySound`、`MultiPlanet`、`FreeRoam`、`FreeRoamTwirl`、`FreeRoamRemove`、`FreeRoamWarning`、`Pause`、`AutoPlayTiles`、`Hide`、`ScaleMargin`、`ScaleRadius`、`Multitap`、`TileDimensions`、`KillPlayer`、`ScalePlanets`、`SetFloorIcon`、`AddObject`、`SetObject`、`SetDefaultText`、`SetFrameRate`、`AddParticle`、`SetParticle`、`EmitParticle`、`SetInputEvent` 等。

## 已实现的事件类

位于 `SharpFAI.Events` 命名空间，均继承 `BaseEvent`：

| 事件类 | 关键字段 |
| --- | --- |
| `SetSpeed` | `SpeedType`（Bpm / BpmMultiplier）、`BeatsPerMinute`、`BpmMultiplier`、`AngleOffset` |
| `Twirl` | `Twirl`（true/false） |
| `Hold` | `Duration`、`DistanceMultiplier`、`LandingAnimation` |
| `MoveCamera` | `Duration`、`RelativeTo`、`Position`、`Rotation`、`Zoom`、`AngleOffset`、`Ease`、`EventTag` |
| `Pause` | `Duration`、`CountdownTicks`、`AngleCorrectionDir` |
| `FreeRoam` | 自由漫游相关字段 |
| `PositionTrack` | 轨道定位相关字段 |
| `MultiPlanet` | 多星球相关字段 |
| `Bookmark` | 书签标记 |
| `Unknown` | 未识别的未知事件 |

事件类都带有字段构造参数（如 `new Hold(duration: 4)`、`new Pause(duration: 1)`），并可通过对象初始化器设置 `Floor`。

## BaseEvent

所有事件的基类，位于 `SharpFAI.Serialization`：

```csharp
public class BaseEvent
{
    [JsonProperty("eventType")]
    public EventType EventType;

    [JsonProperty("floor")]
    public int Floor;

    public static BaseEvent Empty { get; }

    public override string ToString();   // 序列化为 JSON
    public T ToEvent<T>() where T : BaseEvent;  // 转为具体事件类型
}
```

### ToEvent\<T\>

把事件转成具体类型以访问其字段：

```csharp
var longPauses = level.GetEventsIf(e =>
    e.EventType == EventType.Pause &&
    e.ToEvent<Pause>().Duration > 2.0);
```

类型不匹配时会抛出 `InvalidCastException`。

## 事件枚举

`SharpFAI.Serialization.EventEnums` 提供事件使用的枚举：

| 枚举 | 值 |
| --- | --- |
| `SpeedType` | `Bpm` / `BpmMultiplier` |
| `CamMovementType` | 相机移动相对模式 |
| `Ease` | 缓动函数 |
| `AngleCorrectionDirection` | 角度校正方向 |

## 用法示例

```csharp
// 用事件对象添加
var setSpeed = new SetSpeed(EventEnums.SpeedType.Bpm)
{
    Floor = 0,
    BeatsPerMinute = 180
};
level.AddEvent(setSpeed);

// 统计事件
var events = level.DeserializeEvents();
var stats = events.GroupBy(e => e.EventType)
    .Select(g => new { Type = g.Key, Count = g.Count() });
```