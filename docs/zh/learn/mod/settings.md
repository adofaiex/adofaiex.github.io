---
title: 设置系统
order: 17
---

# 设置系统

一个合格的 Mod 通常需要可配置选项。模板基于 UMM 提供了完整的设置系统。

## 设置类：Settings.cs

继承 `UnityModManager.ModSettings`，定义的属性会被自动持久化到本地配置文件：

```csharp
using UnityModManagerNet;

namespace MyFirstMod
{
    public class Settings : UnityModManager.ModSettings
    {
        public bool EnableFeature { get; set; } = true;
        public float Sensitivity { get; set; } = 1f;

        public static Settings Load(UnityModManager.ModEntry entry)
        {
            return (Settings)Read<Settings>(entry);
        }

        public override void Save(UnityModManager.ModEntry entry)
        {
            Write(this, entry);
        }
    }
}
```

要点：

- 属性必须是**可读写**的，UMM 用反射读写它们
- 默认值在声明处初始化
- 配置文件存放在 Mod 的本地配置目录，更新 Mod 时不会覆盖

## 与主类接线

在 `Main.Load` 中把设置加载并绑定回调：

```csharp
public static bool Load(UnityModManager.ModEntry modEntry)
{
    Settings = Settings.Load(modEntry);
    modEntry.OnGUI = Settings.OnGUI;
    modEntry.OnSaveGUI = Settings.OnSaveGUI;
    // ...
    return true;
}
```

- `OnGUI`：绘制设置面板
- `OnSaveGUI`：保存设置

## 在游戏中使用

1. 启用 Mod 后按 `Ctrl+F10` 打开 UMM 设置
2. 在 Mod 列表中找到你的 Mod
3. 调整选项并保存

## 设置文件的保存

`Settings.Load` 会读取已存在的配置文件；`Save` 写入。UMM 在玩家点击保存或退出时调用 `OnSaveGUI`，从而触发 `Save`。

## 常见问题

### 设置没保存？

确认 `OnSaveGUI` 绑定了 `Settings.OnSaveGUI`，且 `Settings.Save` 方法调用正确。

### 类型不支持？

UMM 的 `ModSettings` 支持常见类型（`bool`、`int`、`float`、`string`、枚举）。复杂类型建议拆成简单属性或自行序列化。

## 你学到了什么

- 如何定义并持久化 Mod 设置
- 设置如何与主类绑定
- 设置文件的读取与保存

## 下一步

学会绘制设置界面 → [绘制设置界面](./settings-ui.md)