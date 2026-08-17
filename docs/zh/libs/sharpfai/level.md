---
title: Level 类
order: 2
---

# Level 类

`Level` 是库的主要入口，提供加载、操作与保存 ADOFAI 关卡的方法。位于 `SharpFAI.Serialization` 命名空间。

## 构造函数

```csharp
// 从文件路径加载
var level = new Level("path/to/level.adofai");

// 从关卡信息字典初始化
var level = new Level(levelInfoDict);

// 创建带有默认设置的新关卡
var level = Level.CreateNewLevel();
```

## 属性

| 属性 | 说明 |
| --- | --- |
| `root` | 关卡根 JSON 对象（`angleData` / `settings` / `actions` / `decorations` 始终同步） |
| `settings` | 关卡设置 `JObject` |
| `angleData` | 角度数组 `JArray` |
| `actions` | 事件列表 `JArray` |
| `decorations` | 装饰列表 `JArray`（版本 > 10 时存在） |
| `angles` | 只读角度数组 `ReadOnlyCollection<double>` |
| `pathToLevel` | 加载时的文件路径 |
| `deserializedEvents` | 反序列化后的只读事件列表 |

构造函数会自动处理：存在 `angleData` 时直接读取；只有 `pathData` 时调用 `InitAngleData()` 转换；并预先反序列化事件。

## 设置管理

```csharp
var bpm = level.GetSetting<double>("bpm");        // 读取
level.PutSetting("bpm", 180);                     // 写入
bool has = level.HasSetting("artist");            // 是否存在
level.RemoveSettings("offset", "pitch");          // 移除多个设置

level.SetSong("song.mp3");                        // 设置歌曲
var audioPath = level.GetAudioPath();             // 音频文件绝对路径
```

| 方法 | 说明 |
| --- | --- |
| `GetSetting<T>(string)` | 获取设置值 |
| `PutSetting<T>(string, T)` | 设置设置值 |
| `HasSetting(string)` | 检查设置是否存在 |
| `RemoveSettings(params string[])` | 移除多个设置 |
| `SetSong(string)` | 设置关卡歌曲 |
| `GetAudioPath()` | 获取音频文件绝对路径 |

## 事件管理

```csharp
// 在指定地板添加事件
level.AddEvent(10, EventType.Twirl);

// 用事件对象添加
var hold = new Hold(duration: 4) { Floor = 5 };
level.AddEvent(hold);

// 查询
var events = level.GetFloorEvents(10);            // 地板 10 的所有事件
var twirls = level.GetEvents(EventType.Twirl);    // 全部 Twirl
var longPauses = level.GetEventsIf(e =>
    e.EventType == EventType.Pause && e.ToEvent<Pause>().Duration > 2.0);

// 检查
bool hasAny = level.HasEvents(10);
bool hasTwirl = level.HasEvents(10, EventType.Twirl);

// 移除
level.RemoveEventsIf(e => e.EventType == EventType.MoveCamera);
level.RemoveFloorEvents(5, EventType.Twirl, 2);
```

| 方法 | 说明 |
| --- | --- |
| `AddEvent(int floor, EventType type, JObject data)` | 向地板添加事件 |
| `AddEvent(BaseEvent)` | 从事件对象添加事件 |
| `GetEvents(int floor, EventType type)` | 获取特定地板特定类型的事件 |
| `GetFloorEvents(int floor)` | 获取地板的所有事件 |
| `GetEvents(EventType type)` | 获取所有特定类型的事件 |
| `GetEventsIf(Func<BaseEvent, bool>)` | 获取满足条件的事件 |
| `HasEvents(int floor)` / `HasEvents(int floor, EventType)` | 检查地板是否有事件 |
| `RemoveEventsIf(Func<BaseEvent, bool>)` | 移除满足条件的事件 |
| `RemoveFloorEvents(int floor, EventType type, int count)` | 从地板移除事件 |
| `DeserializeEvents(bool includeDecorations)` | 把事件反序列化为对象 |

## 装饰管理

```csharp
// 添加文本装饰
level.AddTextToDecorations(10, "Hello", tag: "title", relativeToScreen: true);

// 添加装饰
level.AddDecoration(10, EventType.AddText, "title", false, null);
```

| 方法 | 说明 |
| --- | --- |
| `AddTextToDecorations(int floor, string text, string tag, bool relativeToScreen, JObject data)` | 添加文本装饰 |
| `AddDecoration(int floor, EventType type, string tag, bool relativeToScreen, JObject data)` | 添加装饰 |

## 序列化

```csharp
level.Save("modified-level.adofai");     // 保存到文件
string json = level.ToString();          // 转为 JSON 字符串
```

| 方法 | 说明 |
| --- | --- |
| `Save(string newLevelPath, bool indent = true)` | 保存关卡到文件 |
| `ToString(bool indent = true)` | 转换为 JSON 字符串 |

## 相等比较

`Level` 重载了 `==` / `!=`：两者都有文件路径时按路径比较，否则按 `root`、`decorations`、`settings`、`angleData`、`actions` 逐项深比较。