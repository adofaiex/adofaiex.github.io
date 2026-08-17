---
title: Postfix 补丁
order: 8
---

# Postfix 补丁

Postfix 在目标方法**执行之后**运行，主要用于读取或修改返回值。

## 典型用途

- **修改返回值**：把结果映射、限制或增强
- **读取结果**：在方法结束后获取真实结果（Prefix 里读到的是默认值）
- **副作用逻辑**：方法执行完成后追加逻辑

## 基本形式

```csharp
[HarmonyPatch(typeof(SomeGameClass), nameof(SomeGameClass.GetValue))]
public static class GetValue_Postfix
{
    public static void Postfix(ref float __result)
    {
        __result = Math.Max(__result, 1f);  // 防止结果过小
    }
}
```

- 用 `ref float __result` 才能修改返回值
- 不写 `ref` 则只能读取

## 返回 void 的方法如何拿结果？

游戏里很多方法返回 `void`，但结果写在字段 / 属性里。此时用 `__instance` 读取：

```csharp
// 目标方法: public void UpdateScore()，结果存在 _score 字段
[HarmonyPatch(typeof(Scoring), nameof(Scoring.UpdateScore))]
public static class UpdateScore_Postfix
{
    public static void Postfix(Scoring __instance)
    {
        var score = __instance._score;   // 读取字段
        MyMod.Logger.Log($"当前分数: {score}");
    }
}
```

> 读取**私有字段**用三个下划线：`___fieldName`。

## 搭配 Prefix 使用 `__state`

有时你想在方法**前**记住某个值，在方法**后**用它。用 `__state` 跨补丁传值：

```csharp
[HarmonyPatch(typeof(Player), nameof(Player.Move))]
public static class Move_Patches
{
    public static void Prefix(Player __instance, ref float __state)
    {
        __state = __instance.speed;   // 记住调用前的速度
    }

    public static void Postfix(Player __instance, float __state)
    {
        // 调用后的速度
        var after = __instance.speed;
        // __state 是调用前的速度
        if (after != __state) MyMod.Logger.Log("速度变了");
    }
}
```

规则：

- `__state` 类型在 Prefix 与 Postfix 中必须一致
- Prefix 中必须写 `ref`（存值），Postfix 中不写 `ref`（取值）
- 如果只有 Postfix，Harmony 会为它初始化默认值

## 修改返回值类型

`__result` 的类型必须**与目标方法返回类型兼容**：

```csharp
// 目标方法返回 int
public static void Postfix(ref int __result)
{
    __result = Math.Abs(__result);
}
```

## 你学到了什么

- Postfix 的时机与用途
- 用 `ref __result` 修改返回值
- 用 `__instance` / `___field` 读取状态
- 用 `__state` 跨 Prefix / Postfix 传值

## 下一步

学会处理异常 → [Finalizer 补丁](./harmony-finalizer.md)