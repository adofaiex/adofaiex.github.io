---
title: Finalizer Patch
order: 9
---

# Finalizer Patch

A Finalizer runs **after the target method ends** — whether the method returned normally or **threw an exception**. It's used for exception handling.

## Why Finalizer?

When a game method throws an exception and nothing handles it, the game may crash outright. A Finalizer can:

- **Log exceptions**: write the exception to the log for debugging
- **Swallow exceptions**: prevent the exception from bubbling (use with caution — this masks problems)
- **Cleanup**: ensure resources are released

## Basic Form

```csharp
[HarmonyPatch(typeof(SomeGameClass), nameof(SomeGameClass.SomeMethod))]  // Declare target: which class, which method
public static class SomeMethod_Finalizer
{
    // __exception: the exception thrown by the target method; null when no exception
    public static void Finalizer(Exception __exception)
    {
        if (__exception != null)
        {
            MyMod.Logger.Log($"Method threw an exception: {__exception}");
        }
    }
}
```

- `__exception`: the exception thrown by the target method; `null` when no exception
- You can define a Finalizer without the `__exception` parameter (for cleanup only)

## Swallowing Exceptions

```csharp
public static void Finalizer(Exception __exception)
{
    if (__exception != null)
    {
        MyMod.Logger.Log("Caught and swallowed exception");
        // Not re-throwing: the exception is suppressed
    }
}
```

> Note: by default, after the Finalizer runs, the exception **still propagates**. To swallow an exception, you must use the `Exception __exception` parameter, set the patch method return type to `void`, and **not re-throw**. If you want to change behavior while swallowing, it's usually clearer to combine with Prefix / Postfix.

## Exception Propagation Rules

| Scenario | Behavior |
| --- | --- |
| Finalizer only logs, doesn't re-throw | Exception continues to propagate (most common usage) |
| Finalizer `throw`s a new exception | New exception replaces the original |
| Prefix returns `false` (intercept) | Original method doesn't execute, `__exception` is `null` |
| Target is async / iterator method | Exceptions are internal to the enumerator, behavior differs from sync methods — use with caution |

## Complete Example: Protecting a Method from Crashing

```csharp
[HarmonyPatch(typeof(Scoring), nameof(Scoring.UpdateScore))]
public static class UpdateScore_Finalizer
{
    public static void Finalizer(Exception __exception)
    {
        if (__exception != null)   // Only enters when the target method threw
        {
            // Log but don't crash, and mark status
            MyMod.Logger.Log($"UpdateScore exception: {__exception.Message}");
        }
    }
}
```

## Combining All Three Patch Types

Finalizer is often combined with Prefix / Postfix to cover a method's complete lifecycle:

```csharp
public static class Full_Patches
{
    public static void Prefix() { /* Before execution */ }
    public static void Postfix() { /* After execution (success) */ }
    public static void Finalizer(Exception __exception) { /* Runs regardless of success or failure */ }
}
```

## What You Learned

- Finalizer execution timing (always runs)
- Using `__exception` to catch exceptions
- Exception propagation and swallowing rules

## Next Step

Learn how patches are applied and removed → [Patch Lifecycle](./harmony-lifecycle.md)
