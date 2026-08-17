---
title: Prefix Patch
order: 7
---

# Prefix Patch

A Prefix runs **before** the target method executes — it's the most commonly used of the patch types.

## Typical Uses

- **Intercept methods**: prevent the original method from executing (e.g. block an action)
- **Modify parameters**: change input arguments before the game reads them
- **Pre-logic**: insert your own logic before the method body

## Basic Form

```csharp
[HarmonyPatch(typeof(SomeGameClass), nameof(SomeGameClass.SomeMethod))]
public static class SomeMethod_Prefix
{
    public static bool Prefix()
    {
        // Your code runs before the target method
        return true;  // Return true: continue executing the original method
    }
}
```

## Using bool Return to Control Execution

- Return `true`: the original method executes normally
- Return `false`: **skip** the original method (interception successful)

```csharp
public static bool Prefix()
{
    if (MyMod.Settings.DisableFeature)
    {
        return false;  // Intercept: the original method won't execute
    }
    return true;
}
```

> Note: if `Prefix` returns `void` (no return value), the original method always continues to execute.

## Modifying Parameters

In a Prefix, you can read and write parameters by matching the target method's parameter names:

```csharp
// Target method: public void TakeDamage(float amount)
[HarmonyPatch(typeof(Player), nameof(Player.TakeDamage))]
public static class TakeDamage_Prefix
{
    public static void Prefix(ref float amount)
    {
        amount *= 0.5f;  // Halve damage
    }
}
```

- The parameter name **must match the target method's parameter name**
- Use `ref` prefix to write changes back to the game

## Reading Instance State: `__instance`

When the target method is an **instance method**, use the `__instance` parameter to read the current object:

```csharp
// Target method: public void Play(), Player has a speed field
[HarmonyPatch(typeof(Player), nameof(Player.Play))]
public static class Play_Prefix
{
    public static void Prefix(Player __instance)
    {
        var speed = __instance.speed;   // Read field
    }
}
```

> `__instance` is a Harmony **magic parameter** (prefixed with double underscore), automatically injected with the current instance. The type can be the target class or any of its base classes.

## More Magic Parameters

| Parameter | Description |
| --- | --- |
| `__instance` | Current object instance (for instance methods) |
| `__result` | Return value (initially the default value in Prefix) |
| `__state` | Cross-patch value passing (Prefix→Postfix) |
| `___fieldName` | Read private fields (triple underscore) |

## Complete Example: Intercept and Log

```csharp
[HarmonyPatch(typeof(Player), nameof(Player.TakeDamage))]
public static class TakeDamage_Prefix
{
    public static bool Prefix(Player __instance, ref float amount)
    {
        if (MyMod.Settings.Invincible)
        {
            return false;  // Invincible: fully intercept damage
        }
        amount *= MyMod.Settings.DamageMultiplier;
        return true;
    }
}
```

## What You Learned

- Prefix execution timing and use cases
- Using return values to control interception
- Modifying parameters and reading `__instance` state
- Common magic parameters

## Next Step

Learn to modify results after method execution → [Postfix Patch](./harmony-postfix.md)
