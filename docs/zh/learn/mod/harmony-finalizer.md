---
title: Finalizer 补丁
order: 9
---

# Finalizer 补丁

Finalizer 在目标方法**结束后**运行——无论方法是正常返回还是**抛出了异常**。它用于异常处理。

## 为什么需要 Finalizer

游戏方法抛异常时，如果没有任何处理，游戏可能直接崩溃。Finalizer 可以：

- **记录异常**：把异常写进日志，方便排查
- **吞掉异常**：不让异常冒泡（注意：这掩盖了问题，谨慎使用）
- **补充清理**：确保资源被释放

## 基本形式

```csharp
[HarmonyPatch(typeof(SomeGameClass), nameof(SomeGameClass.SomeMethod))]  // 声明目标：哪个类、哪个方法
public static class SomeMethod_Finalizer
{
    // __exception：目标方法抛出的异常；没异常时为 null
    public static void Finalizer(Exception __exception)
    {
        if (__exception != null)
        {
            MyMod.Logger.Log($"方法抛出了异常: {__exception}");
        }
    }
}
```

- `__exception`：目标方法抛出的异常，没有异常时为 `null`
- 不写 `__exception` 参数也能定义 Finalizer（此时仅作清理）

## 吞掉异常

```csharp
public static void Finalizer(Exception __exception)
{
    if (__exception != null)
    {
        MyMod.Logger.Log("已捕获并吞掉异常");
        // 不重新抛出：异常被抑制
    }
}
```

> 注意：默认情况下 Finalizer 运行完后异常**仍然会传播**。要吞掉异常，必须配合 `Exception __exception` 参数并把补丁方法返回值设为 `void`，且**不重新抛出**。若你想在吞掉异常的同时改变行为，通常配合 Prefix / Postfix 一起用更清晰。

## 异常传播规则

| 情况 | 行为 |
| --- | --- |
| Finalizer 只记录，不重抛 | 异常继续传播（最常见的用法） |
| Finalizer 里 `throw` 新异常 | 新异常替换原异常 |
| Prefix 返回 `false`（拦截） | 原方法不会执行，`__exception` 为 `null` |
| 目标是 async / iterator 方法 | 异常在移动器内部，行为与同步方法不同，需谨慎 |

## 完整示例：保护方法不崩溃

```csharp
[HarmonyPatch(typeof(Scoring), nameof(Scoring.UpdateScore))]
public static class UpdateScore_Finalizer
{
    public static void Finalizer(Exception __exception)
    {
        if (__exception != null)   // 目标方法抛异常时才进来
        {
            // 记录但不崩溃，同时标记状态
            MyMod.Logger.Log($"UpdateScore 异常: {__exception.Message}");
        }
    }
}
```

## 三种补丁配合

Finalizer 常与 Prefix / Postfix 配合，覆盖一个方法的完整生命周期：

```csharp
public static class Full_Patches
{
    public static void Prefix() { /* 执行前 */ }
    public static void Postfix() { /* 执行后（成功） */ }
    public static void Finalizer(Exception __exception) { /* 无论成功失败都会运行 */ }
}
```

## 你学到了什么

- Finalizer 的执行时机（总是运行）
- 用 `__exception` 捕获异常
- 异常传播与吞掉的规则

## 下一步

了解补丁如何应用与移除 → [补丁生命周期](./harmony-lifecycle.md)