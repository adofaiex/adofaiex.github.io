---
title: HarmonyPatch 详解
order: 11
---

# HarmonyPatch 详解

`[HarmonyPatch]` 特性是声明补丁的入口。它有很多写法，本系列之前的章节只用到了最基础的一种。

## 声明目标类

```csharp
// 对整个类补丁（类内所有标记的方法）
[HarmonyPatch(typeof(SomeGameClass))]
public static class SomeClass_Patches
{
    [HarmonyPatch(nameof(SomeGameClass.MethodA))]
    public static void PrefixA() { /* ... */ }

    [HarmonyPatch(nameof(SomeGameClass.MethodB))]
    public static void PrefixB() { /* ... */ }
}
```

> 补丁类上的 `[HarmonyPatch(typeof(X))]` 只是「默认目标」，方法级 `[HarmonyPatch]` 指定具体方法。

## 指定方法

```csharp
// 方法名
[HarmonyPatch(typeof(SomeGameClass), nameof(SomeGameClass.SomeMethod))]

// 字符串形式（不推荐，重构易失效）
[HarmonyPatch(typeof(SomeGameClass), "SomeMethod")]
```

## 指定重载（参数类型）

游戏里常有同名重载，需要指定参数类型：

```csharp
// 只补丁 void SomeMethod(int)
[HarmonyPatch(typeof(SomeGameClass), nameof(SomeGameClass.SomeMethod),
    new Type[] { typeof(int) })]

// 补充：new Type[0] 表示无参重载
[HarmonyPatch(typeof(SomeGameClass), nameof(SomeGameClass.SomeMethod),
    new Type[0])]
```

## 补丁构造函数

```csharp
[HarmonyPatch(typeof(SomeGameClass), MethodType.Constructor)]
public static class Ctor_Patches
{
    public static void Postfix(SomeGameClass __instance)
    {
        // 构造完成后执行
    }
}
```

> `MethodType.Constructor` 补丁构造函数。带参数的构造函数需同时指定参数类型。

## 补丁属性（getter / setter）

```csharp
[HarmonyPatch(typeof(SomeGameClass), "SomeProperty", MethodType.Getter)]
public static class Getter_Postfix
{
    public static void Postfix(ref int __result) { /* ... */ }
}

[HarmonyPatch(typeof(SomeGameClass), "SomeProperty", MethodType.Setter)]
public static class Setter_Prefix
{
    public static void Prefix(int value) { /* ... */ }
}
```

## 优先级与执行顺序

```csharp
[HarmonyPatch(typeof(SomeGameClass), nameof(SomeGameClass.SomeMethod))]
[HarmonyPriority(Priority.First)]
public static class Early_Prefix { /* ... */ }
```

- `Priority.High / Normal / Low / First / Last`
- 同优先级按类声明顺序

## 显式声明补丁类型

补丁方法名决定类型（`Prefix` / `Postfix` / `Finalizer` / `Transpiler`）。也可以改成任何名字并显式标注：

```csharp
[HarmonyPatch(typeof(SomeGameClass), nameof(SomeGameClass.SomeMethod))]
public static class MyPatch
{
    [HarmonyPrefix]
    public static void Before() { /* 相当于 Prefix */ }
}
```

> 一个补丁类内可以有多个不同方法，分别用 `[HarmonyPrefix]` / `[HarmonyPostfix]` / `[HarmonyFinalizer]` / `[HarmonyTranspiler]` 标注。

## 在运行时选择目标

`[HarmonyPatch]` 只适合静态目标。动态目标用手动补丁（见 [手动补丁](./harmony-manual.md)）。

## 你学到了什么

- `[HarmonyPatch]` 的多种目标写法：方法、重载、构造函数、属性
- 类级 + 方法级补丁的组合
- `[HarmonyPriority]` 与显式补丁类型标注

## 下一步

了解补丁的应用与移除机制 → [补丁生命周期](./harmony-lifecycle.md)