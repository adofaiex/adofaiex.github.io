---
title: Magic Parameters
order: 10
---

# Magic Parameters

Harmony patch methods can declare **special parameters** (prefixed with double underscore) that are automatically injected by Harmony at call time. Mastering them is fundamental to writing patches.

## Parameter Overview

| Parameter | Where | Description |
| --- | --- | --- |
| `__instance` | Any patch | The current object instance of the target method (for instance methods) |
| `__result` | Prefix / Postfix / Finalizer | Return value |
| `__state` | Prefix / Postfix / Finalizer | Cross-patch value passing (Prefix→Postfix) |
| `__args` | Any patch | All parameters of the target method (`object[]`) |
| `__originalMethod` | Any patch | The original `MethodBase` (the method before patching) |
| `___fieldName` | Any patch | Read a field of the target class (triple underscore) |

## `__instance`: Current Instance

Available when the target method is an **instance method**. The type can be the target class or any of its base classes:

```csharp
public static void Prefix(Player __instance)
{
    var speed = __instance.speed;
}
```

- Using `object` as the type is also valid (cast when needed)
- For static methods / constructors, this is `null`

## `__result`: Return Value

- **Prefix**: initially the default value for the type (`0`, `null`, `false`)
- **Postfix / Finalizer**: the actual return value after the target method executes
- To modify the return value, you must use `ref`:

```csharp
public static void Postfix(ref int __result)
{
    __result = Math.Abs(__result);
}
```

## `__state`: Cross-Patch Value Passing

Store a value in Prefix (must use `ref`), read it in Postfix / Finalizer:

```csharp
public static void Prefix(ref float __state)
{
    __state = Time.deltaTime;   // Remember the time before method execution
}

public static void Postfix(float __state)
{
    // __state is the value from before execution
}
```

- The type must be consistent between Prefix and Postfix
- If only Postfix exists, `__state` is the type's default value

## `__args`: All Parameters

Get all input parameters of the target method as `object[]` (read-only view):

```csharp
public static void Prefix(object[] __args)
{
    foreach (var a in __args) MyMod.Logger.Log(a?.ToString() ?? "null");
}
```

> To modify parameters, the "parameter name + `ref`" approach is clearer (see [Prefix Patch](./harmony-prefix.md)).

## `__originalMethod`: Original Method

When manually patching or needing to call the original method, you can get the original `MethodBase`:

```csharp
public static void Prefix(MethodBase __originalMethod)
{
    MyMod.Logger.Log($"Calling {__originalMethod.Name}");
}
```

## `___fieldName`: Reading Private Fields

Triple underscore + field name lets you read **private fields** of the target class:

```csharp
// Read the private field _score of the Scoring class
public static void Postfix(Scoring __instance)
{
    var score = __instance._score;    // Public/internal field
    var raw = __instance.___rawScore; // Private field: triple underscore
}
```

::: warning
The field name must **exactly match** the decompiled result (case-sensitive). Reading fields with `___` is essentially reflection — frequent access has performance overhead, use sparingly in hot paths.
:::

## Combining

Magic parameters can be freely combined:

```csharp
public static void Prefix(Player __instance, ref float __state, object[] __args)
{
    // ...
}
```

## What You Learned

- The purpose of the six magic parameters
- How to modify `__result` (with `ref`)
- Cross-patch value passing with `__state`
- Reading private fields with `___`

## Next Step

Dive deeper into the various syntaxes of `[HarmonyPatch]` → [HarmonyPatch Details](./harmony-attributes.md)
