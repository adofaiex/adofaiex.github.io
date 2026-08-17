---
title: 认识 UMM
order: 3
---

# 认识 UnityModManager（UMM）

在写第一个 Mod 之前，先搞懂 UMM 是如何把 Mod「塞进」游戏里的。

## UMM 是什么

**UnityModManager** 是一个通用的 Unity 游戏 Mod 加载器。它通过运行时注入的方式，把 Mod 的 DLL 加载进游戏进程，并负责：

- 发现 `Mods/` 目录下的所有 Mod
- 按 `Info.json` 识别每个 Mod 的身份
- 启用 / 禁用 Mod（对应 `OnToggle`）
- 提供一个设置面板（`Ctrl+F10`）
- 记录与输出 Mod 日志

## Mod 目录结构

```
ADOFAI/
├── Mods/
│   └── MyFirstMod/            # 每个 Mod 一个文件夹
│       ├── MyFirstMod.dll     # 编译产物
│       └── Info.json          # 清单文件
```

> UMM 通过「Mod 文件夹名 / `Info.json` / DLL」三者的组合来识别一个 Mod。三者缺一不可。

## UMM 是如何加载 Mod 的

1. UMM 扫描 `Mods/` 下每个文件夹
2. 读取 `Info.json`，找到 `EntryMethod`（例如 `MyFirstMod.Main.Load`）
3. 通过反射调用 `Load(UnityModManager.ModEntry)` 静态方法
4. `Load` 返回 `true` 表示加载成功；返回 `false` 则 UMM 判定该 Mod 加载失败
5. 玩家启用 Mod 时，UMM 调用 `OnToggle(entry, true)`

## ModEntry：你与 UMM 的接口

`ModEntry` 是 UMM 交给你的「联络对象」，常用成员：

| 成员 | 说明 |
| --- | --- |
| `Info` | `Info.json` 解析结果（Id、Version、Author 等） |
| `Logger.Log(msg)` | 输出日志到 UMM 界面 |
| `OnToggle` | 启停回调，Mod 的开关逻辑写在这里 |
| `OnGUI` | 设置面板绘制回调 |
| `OnSaveGUI` | 设置保存回调 |
| `Path` | Mod 在磁盘上的目录（存配置、资源用） |
| `Error(msg)` | 输出错误日志并标记 Mod 加载失败 |

## 日志去哪了

- 游戏内按 `Ctrl+F10` 打开 UMM 界面，右下角可以查看日志
- `Logger.Log` 与 `Debug.Log` 都会进入游戏日志文件
- Windows 下游戏日志位于 `%APPDATA%\..\LocalLow\7th Beat Games\A Dance of Fire and Ice\Player.log`

## 你学到了什么

- UMM 如何发现并加载 Mod
- Mod 目录结构与 `Info.json` 的作用
- `ModEntry` 提供了哪些接口
- 在哪里看日志

## 下一步

用模板写一个能加载的最小 Mod → [最小实例](./first-mod.md)