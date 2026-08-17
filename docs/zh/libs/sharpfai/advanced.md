---
title: 高级示例
order: 6
---

# 高级示例

综合运用库的各部分能力。

## 分析关卡

```csharp
var level = new Level("level.adofai");

// 获取所有速度变化
var speeds = level.GetAllSpeedChange();
Console.WriteLine($"Max BPM: {speeds.Max()}");

// 按类型统计事件
var events = level.DeserializeEvents();
var eventStats = events.GroupBy(e => e.EventType)
    .Select(g => new { Type = g.Key, Count = g.Count() });

foreach (var stat in eventStats)
{
    Console.WriteLine($"{stat.Type}: {stat.Count}");
}
```

## 创建地板对象

```csharp
var level = new Level("level.adofai");
var floors = level.CreateFloors(usePositionTrack: true);

foreach (var floor in floors)
{
    Console.WriteLine($"Floor {floor.index}: Angle {floor.angle}°, BPM {floor.bpm}");
    var polygon = floor.GeneratePolygon();
    // 用 polygon 数据做渲染
}
```

## 批量事件操作

```csharp
// 移除所有相机移动
level.RemoveEventsIf(e => e.EventType == EventType.MoveCamera);

// 找出所有时长超过 2 秒的 Pause 事件
var longPauses = level.GetEventsIf(e =>
    e.EventType == EventType.Pause &&
    e.ToEvent<Pause>().Duration > 2.0);

// 移除指定地板上的指定事件
level.RemoveFloorEvents(5, EventType.Twirl, 2);
```

## 无特效谱面

```csharp
// 移除所有视觉特效（含装饰）
level.RemoveVFXs(includeDecorations: true);
level.Save("no-effect.adofai");
```

## 生成滑音

```csharp
// 从第 10 个地板开始，C4 → E4 持续 4 拍
level.GenerateGlide(startFloor: 10, Pitch.C4, Pitch.E4, duration: 4);
```

## 你学到了什么

- 用 `DeserializeEvents` + LINQ 分析关卡
- 用 `CreateFloors` 拿到带几何数据的地板
- 用 `RemoveEventsIf` / `GetEventsIf` 批量操作事件
- 用 `RemoveVFXs` 一键制作无特效谱面