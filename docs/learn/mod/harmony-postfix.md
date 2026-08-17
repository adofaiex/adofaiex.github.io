---
title: Postfix Patch
order: 8
---

# Postfix Patch

A Postfix runs **after** the target method executes — primarily used to read or modify the return value.

## Typical Uses

- **Modify return value**: map, clamp, or enhance the result
- **Read result**: get the actual result after the method finishes (in Prefix you'd only get the default value)
- **Side-effect logic**: append logic after method execution completes

## Basic Form

```csharp
[HarmonyPatch(typeof(SomeGameClass), nameof(SomeGameClass.GetValue))]
public static class GetValue_Postfix
{
    public static void Postfix(ref float __result)
    {
        __result = Math.Max(__result, 1f);  // Prevent result from being too small
    }
}
```

- Use `ref float __result` to modify the return value
- Without `ref`, you can only read it

## Getting Results from void Methods?

Many game methods return `void`, but the result is stored in a field / property. In this case, use `__instance` to read it:

```csharp
// Target method: public void UpdateScore(), result stored in _score field
[HarmonyPatch(typeof(Scoring), nameof(Scoring.UpdateScore))]
public static class UpdateScore_Postfix
{
    public static void Postfix(Scoring __instance)
    {
        var score = __instance._score;   // Read field
        MyMod.Logger.Log($"Current score: {score}");
    }
}
```

> To read **private fields**, use triple underscore: `___fieldName`.

## Using `__state` with Prefix

Sometimes you want to remember a value **before** the method and use it **after**. Use `__state` to pass values across patches:

```csharp
[HarmonyPatch(typeof(Player), nameof(Player.Move))]
public static class Move_Patches
{
    public static void Prefix(Player __instance, ref float __state)
    {
        __state = __instance.speed;   // Remember speed before the call
    }

    public static void Postfix(Player __instance, float __state)
    {
        // Speed after the call
        var after = __instance.speed;
        // __state is the speed before the call
        if (after != __state) MyMod.Logger.Log("Speed changed");
    }
}
```

Rules:

- The `__state` type must be consistent between Prefix and Postfix
- In Prefix you must use `ref` (to store), in Postfix you don't use `ref` (to retrieve)
- If only Postfix exists, Harmony initializes `__state` with the default value

## Modifying Return Value Type

The `__result` type must be **compatible with the target method's return type**:

```csharp
// Target method returns int
public static void Postfix(ref int __result)
{
    __result = Math.Abs(__result);
}
```

## What You Learned

- Postfix timing and use cases
- Using `ref __result` to modify return values
- Using `__instance` / `___field` to read state
- Using `__state` to pass values across Prefix / Postfix

## Next Step

Learn to handle exceptions → [Finalizer Patch](./harmony-finalizer.md)
