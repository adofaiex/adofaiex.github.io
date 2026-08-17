---
title: SharpFAI
order: 1
---

# SharpFAI

[SharpFAI](https://github.com/adofaiex/SharpFAI) 是面向 C# 的 ADOFAI 关卡解析库，用于解析、操作和导出 `.adofai` 关卡文件。作者：StArray，GPL-v3 许可。

## 特性

- 解析 `.adofai` 关卡文件
- 操作关卡设置与事件
- 计算音符时间
- 添加装饰和文本
- 导出修改后的关卡
- 创建和操作地板对象（含多边形网格）
- 路径数据（pathData）到角度数据（angleData）的转换
- 批量事件操作
- 视觉特效移除
- 从零创建关卡

## 系统要求

- .NET Framework 4.8.1 或 .NET 6.0+
- Newtonsoft.Json 13.0.4+

## 安装

```bash
dotnet add package SharpFAI
```

## 快速开始

```csharp
using SharpFAI.Serialization;
using SharpFAI.Util;

var level = new Level(pathToLevel: "path/to/level.adofai");

// 获取关卡设置
var bpm = level.GetSetting<double>("bpm");
var artist = level.GetSetting<string>("artist");

// 添加事件：在第 10 个地板处 Twirl
level.AddEvent(10, EventType.Twirl);

// 计算音符时间
var noteTimes = level.GetNoteTimes();

// 移除视觉特效（含装饰）
level.RemoveVFXs(includeDecorations: true);

// 通过时间获取地板索引（第 5 秒）
int floorIndex = level.GetFloorIndexByNoteTime(5.0);

// 保存修改后的关卡
level.Save("modified-level.adofai");

// 从零创建关卡
var level2 = Level.CreateNewLevel();
level2.Save("new-level.adofai");
```

## 项目结构

| 目录 | 说明 |
| --- | --- |
| `Events/` | 已实现的事件类型类（Twirl、Hold、SetSpeed 等） |
| `Framework/` | 游戏组件的核心接口与 `Floor` 地板类 |
| `Serialization/` | 关卡序列化/反序列化逻辑（`Level`、`BaseEvent` 等） |
| `Util/` | 工具类与数学函数（`LevelUtils`、`Pitch` 等） |
| `Test/` | 单元测试 |

## 章节

- [Level 类](./level.md) —— 关卡核心 API
- [设置与 PresetSettings](./settings.md) —— 关卡设置
- [事件类型](./events.md) —— EventType 枚举与事件类
- [工具类](./utils.md) —— LevelUtils 扩展方法、Floor、Pitch
- [高级示例](./advanced.md) —— 分析、地板与批量操作

## 联动

- TypeScript 对应版本：[ADOFAI-JS](../adofai-js/)
- 实战示例：[去除关卡特效](../example-remove-effects.md)