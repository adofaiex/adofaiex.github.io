---
title: 最小实例
order: 4
---

# 你的第一个 Mod

本章基于官方模板，从零写出第一个能被 UMM 加载的 Mod。

## 模板结构

```
MyFirstMod/
├── MyFirstMod.csproj     # 项目文件
├── src/
│   ├── Main.cs           # 主 Mod 类
│   ├── Settings.cs       # Mod 设置类
│   ├── Patches.cs        # Harmony 补丁
│   └── ResourceLoader.cs # 资源加载器
├── Info.json             # UMM Mod 信息文件
└── Properties/
    └── AssemblyInfo.cs   # 程序集信息
```

## 理解入口：Main.cs

UMM 通过静态的 `Load` 方法启动你的 Mod：

```csharp
using System.Reflection;
using HarmonyLib;
using UnityModManagerNet;

namespace MyFirstMod
{
    public static class Main
    {
        public static UnityModManager.ModEntry? Mod { get; private set; }
        public static Harmony? Harmony { get; private set; }
        public static Settings Settings { get; private set; } = null!;

        public static bool Load(UnityModManager.ModEntry modEntry)
        {
            Mod = modEntry;
            Settings = Settings.Load(modEntry);

            modEntry.OnToggle = OnToggle;
            modEntry.OnGUI = Settings.OnGUI;
            modEntry.OnSaveGUI = Settings.OnSaveGUI;

            Harmony = new Harmony(modEntry.Info.Id);
            modEntry.Logger.Log("Mod loaded");
            return true;
        }

        private static bool OnToggle(UnityModManager.ModEntry modEntry, bool value)
        {
            if (value)
            {
                modEntry.Logger.Log("Mod enabled");
                Harmony?.PatchAll(Assembly.GetExecutingAssembly());
            }
            else
            {
                modEntry.Logger.Log("Mod disabled");
                Harmony?.UnpatchAll(modEntry.Info.Id);
            }
            return true;
        }
    }
}
```

## 编写 Info.json

UMM 读取 `Info.json` 来识别你的 Mod。它告诉 UMM：Mod 叫什么、谁来加载它。**没有它，Mod 不会被识别。**

在项目根目录创建 `Info.json`：

```json
{
  "Id": "MyFirstMod",
  "DisplayName": "My First Mod",
  "Author": "you",
  "Version": "1.0.0",
  "ManagerVersion": "0.27.0",
  "AssemblyName": "MyFirstMod.dll",
  "EntryMethod": "MyFirstMod.Main.Load",
  "HomePage": "https://github.com/adofaiex/MyFirstMod"
}
```

| 字段 | 含义 |
| --- | --- |
| `Id` | Mod 唯一标识，不能与其它 Mod 冲突 |
| `DisplayName` | 在 UMM 列表中显示的名字 |
| `Author` | 作者名 |
| `Version` | 版本号，建议遵循语义化版本 |
| `ManagerVersion` | 所需的最低 UMM 版本 |
| `AssemblyName` | 编译产物 DLL 的文件名 |
| `EntryMethod` | 入口方法，格式 `命名空间.类.方法` |
| `HomePage` | 主页 / 仓库地址（可选） |

> `EntryMethod` 必须指向 `Main` 类的静态 `Load` 方法，UMM 靠它启动 Mod。

## 关键点

- **`Load`** —— UMM 加载 Mod 时调用，返回 `true` 表示加载成功
- **`OnToggle`** —— 玩家在 UMM 中启用/禁用 Mod 时调用；启用时通过 `PatchAll` 应用所有 Harmony 补丁
- **`ModEntry`** —— 携带 Mod 信息、日志与回调接口的入口对象
- **`Info.json`** —— UMM 识别 Mod 的清单文件，`EntryMethod` 与 `AssemblyName` 必须与实际一致

## 你学到了什么

- 模板的项目结构
- `Info.json` 各字段的含义
- UMM Mod 的生命周期：`Load` → `OnToggle`

## 下一步

学会编译、部署并调试你的 Mod → [编译、部署与调试](./build-debug.md)