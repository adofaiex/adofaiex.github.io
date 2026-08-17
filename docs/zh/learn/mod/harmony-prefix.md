---
title: Prefix 补丁
order: 7
---

# Prefix 补丁

Prefix 在目标方法**执行之前**运行，是三种补丁里最常用的一种。

## 典型用途

- **拦截方法**：阻止原方法执行（例如阻止某个操作）
- **修改参数**：在游戏读取之前改写入参
- **前置逻辑**：在方法体前插入自己的逻辑

## 基本形式

```csharp
[HarmonyPatch(typeof(SomeGameClass), nameof(SomeGameClass.SomeMethod))]
public static class SomeMethod_Prefix
{
    public static bool Prefix()
    {
        // 你的代码在目标方法之前执行
        return true;  // 返回 true：继续执行原方法
    }
}
```

## 返回 bool 控制是否执行原方法

- 返回 `true`：原方法正常执行
- 返回 `false`：**跳过**原方法（拦截成功）

```csharp
public static bool Prefix()
{
    if (MyMod.Settings.DisableFeature)
    {
        return false;  // 拦截：原方法不会执行
    }
    return true;
}
```

> 注意：如果 `Prefix` 返回 `void`（无返回值），则总是继续执行原方法。

## 修改参数

在 Prefix 中，用参数名匹配目标方法形参即可读写参数：

```csharp
// 目标方法: public void TakeDamage(float amount)
[HarmonyPatch(typeof(Player), nameof(Player.TakeDamage))]
public static class TakeDamage_Prefix
{
    public static void Prefix(ref float amount)
    {
        amount *= 0.5f;  // 伤害减半
    }
}
```

- 参数名**必须与目标方法形参名一致**
- 用 `ref` 前缀才能把修改写回游戏

## 读取实例状态：`__instance`

目标方法是**实例方法**时，用 `__instance` 参数读取当前对象：

```csharp
// 目标方法: public void Play()，Player 有 speed 字段
[HarmonyPatch(typeof(Player), nameof(Player.Play))]
public static class Play_Prefix
{
    public static void Prefix(Player __instance)
    {
        var speed = __instance.speed;   // 读取字段
    }
}
```

> `__instance` 是 Harmony 的**魔法参数**（以双下划线开头），自动注入当前实例，类型可以是目标类或其基类。

## 更多魔法参数

| 参数 | 说明 |
| --- | --- |
| `__instance` | 当前对象实例（实例方法） |
| `__result` | 返回值（Prefix 中初始为默认值） |
| `__state` | 跨补丁传值（Prefix→Postfix） |
| `___fieldName` | 读取私有字段（三个下划线） |

## 完整示例：拦截并记录

```csharp
[HarmonyPatch(typeof(Player), nameof(Player.TakeDamage))]
public static class TakeDamage_Prefix
{
    public static bool Prefix(Player __instance, ref float amount)
    {
        if (MyMod.Settings.Invincible)
        {
            return false;  // 无敌：完全拦截伤害
        }
        amount *= MyMod.Settings.DamageMultiplier;
        return true;
    }
}
```

## 你学到了什么

- Prefix 的执行时机与用途
- 用返回值控制是否拦截原方法
- 修改参数与读取 `__instance` 状态
- 常用的魔法参数

## 下一步

学会在方法执行后修改结果 → [Postfix 补丁](./harmony-postfix.md)