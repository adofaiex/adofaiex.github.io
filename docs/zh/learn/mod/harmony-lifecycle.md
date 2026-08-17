---
title: 补丁生命周期
order: 12
---

# 补丁生命周期

补丁不是「写进去就一直在」，它随 Mod 的启用 / 禁用而应用 / 移除。

## PatchAll：自动扫描应用

在 `OnToggle(true)` 时调用 `PatchAll`，扫描当前程序集里所有带 `[HarmonyPatch]` 的类并应用：

```csharp
private static bool OnToggle(UnityModManager.ModEntry modEntry, bool value)
{
    if (value)   // value=true：Mod 被启用
    {
        Harmony?.PatchAll(Assembly.GetExecutingAssembly());   // 扫描程序集，应用所有 [HarmonyPatch]
    }
    else         // value=false：Mod 被禁用
    {
        Harmony?.UnpatchAll(modEntry.Info.Id);   // 只移除本 Mod 的补丁
    }
    return true;   // 告诉 UMM 启停操作成功
}
```

## UnpatchAll：按 Mod 移除

`UnpatchAll(string)` 只移除**属于某个 HarmonyId** 的补丁。我们的 `Harmony` 实例用 `modEntry.Info.Id` 创建，所以 `UnpatchAll(modEntry.Info.Id)` 只会移除本 Mod 的补丁，不影响其它 Mod。

```csharp
Harmony = new Harmony(modEntry.Info.Id);   // HarmonyId = Mod 的 Id
```

> 千万别用无参的 `UnpatchAll()`，那会把所有 Mod 的补丁全部移除！

## 多个补丁的执行顺序

同一个方法被多个 Mod / 多个补丁修改时，顺序是有规则的：

- **PatchAll** 按程序集中的**元数据 token 顺序**应用（大致是类定义顺序）
- 补丁之间按「先声明先执行」的规则：后面的 Prefix 在前面的**前面**运行（后进先出），Postfix 相反
- Harmony 允许在 `[HarmonyPatch]` 上通过 `[HarmonyPriority]` 指定优先级

```csharp
[HarmonyPriority(Priority.First)]
[HarmonyPatch(typeof(SomeGameClass), nameof(SomeGameClass.SomeMethod))]
public static class First_Prefix { /* ... */ }
```

常用优先级常量：`Priority.High / Normal / Low / First / Last`。

## 修改目标方法签名

Harmony 用「类 + 方法名 + 参数类型」来定位目标。如果游戏有多个同名重载，需要指定参数类型：

```csharp
// 只补丁 (int) 这个重载
[HarmonyPatch(typeof(SomeGameClass), nameof(SomeGameClass.SomeMethod), new Type[] { typeof(int) })]
public static class SomeMethodInt_Prefix { /* ... */ }
```

## 在运行时检查补丁是否生效

```csharp
// 取出目标方法的补丁信息（用反射获取 MethodInfo）
var info = Harmony.GetPatchInfo(typeof(SomeGameClass).GetMethod(nameof(SomeGameClass.SomeMethod)));
if (info != null)   // 目标方法上确实挂过补丁
{
    MyMod.Logger.Log($"Prefix 数量: {info.Prefixes.Count}");
}
```

## 调试补丁没生效

补丁「不生效」时，按顺序排查：

1. **是否被 PatchAll 扫描到**：类必须是 `public static class`，且带 `[HarmonyPatch]`
2. **目标是否找对**：方法名、类名、参数类型（重载）是否匹配
3. **是否在 OnToggle 前已调用**：如果游戏代码在 Mod 启用之前就调用了目标方法，补丁就「错过」了
4. **是否被其它 Mod 卸载**：检查 `GetPatchInfo`

## 你学到了什么

- `PatchAll` / `UnpatchAll` 的应用与移除
- 多个补丁的执行顺序与优先级
- 用 `GetPatchInfo` 检查补丁状态

## 下一步

进入 IL 世界，学习 Transpiler → [Transpiler 入门](./harmony-transpiler.md)