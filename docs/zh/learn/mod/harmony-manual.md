---
title: 手动补丁
order: 15
---

# 手动补丁

前几章都用 `[HarmonyPatch]` 特性，靠 `PatchAll` 自动应用。有些场景需要**手动**用代码打补丁。

## 什么时候用手动补丁

- 目标方法在运行时才能确定（例如动态生成、名字靠字符串）
- 需要给目标方法指定条件（条件满足才打补丁）
- 同一个类里有多个补丁方法需要灵活组合

## 基础 API

```csharp
var harmony = MyMod.Harmony;   // 已有的 Harmony 实例

var target = AccessTools.Method(typeof(SomeGameClass), "SomeMethod");
var prefix = AccessTools.Method(typeof(MyPatches), nameof(MyPatches.Prefix));

harmony.Patch(target, prefix: new HarmonyMethod(prefix));
```

`Harmony.Patch` 参数：

| 参数 | 用途 |
| --- | --- |
| `target` | 目标 `MethodBase`（用 `AccessTools.Method` 获取） |
| `prefix` | Prefix 补丁方法（`HarmonyMethod` 包装） |
| `postfix` | Postfix 补丁方法 |
| `finalizer` | Finalizer 补丁方法 |
| `transpiler` | Transpiler 补丁方法 |

## 带条件的补丁

只有满足某个条件时才应用补丁：

```csharp
private static bool applied;

public static void Apply()
{
    if (applied) return;
    if (MyMod.Settings.Enabled)   // 条件判断
    {
        var target = AccessTools.Method(typeof(SomeGameClass), "SomeMethod");
        var prefix = AccessTools.Method(typeof(MyPatches), nameof(MyPatches.Prefix));
        MyMod.Harmony.Patch(target, prefix: new HarmonyMethod(prefix));
        applied = true;
    }
}
```

## 动态目标：字符串方法名

```csharp
var target = AccessTools.Method("SomeGameClass:SomeMethod");
// 或者
var target = AccessTools.TypeByName("SomeGameClass")
    .GetMethod("SomeMethod", BindingFlags.Public | BindingFlags.Instance);
```

> 用字符串定位方法在「游戏版本变化」后容易失效，尽量用强类型 API。

## 撤销手动补丁

```csharp
// 移除某个补丁
MyMod.Harmony.Unpatch(target, HarmonyPatchType.Prefix, MyMod.Harmony.Id);
```

`Unpatch` 的参数含义：

- 移除所有补丁：`UnpatchAll(modEntry.Info.Id)`
- 移除某类型补丁：指定 `HarmonyPatchType.Prefix` 等
- 移除到原始状态：`Unpatch(target, HarmonyPatchType.All, Harmony.Id)`

## 特性与手动：混用注意

- `PatchAll` 会应用所有带 `[HarmonyPatch]` 的类
- 手动 `Patch` 不打补丁到 `PatchAll`，而是直接打到 Harmony 实例
- 两者都受 `UnpatchAll(modEntry.Info.Id)` 控制（只要 Harmony 实例的 Id 一致）

## 你学到了什么

- 为什么需要手动补丁
- `Harmony.Patch` 与 `AccessTools.Method` 的用法
- 条件补丁与动态目标
- 撤销补丁的几种方式

## 下一步

学会 Reverse Patch 反向调用游戏方法 → [Reverse Patch](./harmony-reverse.md)