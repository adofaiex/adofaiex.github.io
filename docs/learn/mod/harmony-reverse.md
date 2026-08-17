---
title: Reverse Patch
order: 16
---

# Reverse Patch

Previous chapters covered "adding things to game methods." Reverse Patch is the opposite: **taking a game method "out" and turning it into a method you can call yourself**.

## Why Reverse Patch?

Sometimes game methods aren't publicly accessible, or their logic can't be triggered through parameters. Reverse Patch lets you **call any game method** — including private methods, static methods, and even constructors.

## Declaring a Reverse Patch

```csharp
[HarmonyPatch(typeof(SomeGameClass), nameof(SomeGameClass.SomePrivateMethod))]
public static class SomePrivateMethod_Reverse
{
    // Signature must be compatible with the target method; Harmony generates the implementation
    public static void SomePrivateMethod(SomeGameClass instance) { }
}
```

Key points:

- The class declares the target with `[HarmonyPatch]`
- The patch method name is **arbitrary**, but the **signature must be compatible** with the target method
- For instance methods, the first parameter is `instance`

## Using It

```csharp
// Before: SomePrivateMethod is private and can't be called
// After:
var game = new SomeGameClass();
SomePrivateMethod_Reverse.SomePrivateMethod(game);
```

## Declaring with Attribute: ReversePatchType

A more common approach uses `[HarmonyReversePatch]`:

```csharp
[HarmonyPatch(typeof(SomeGameClass), nameof(SomeGameClass.SomePrivateMethod))]
public static class SomePrivateMethod_Reverse
{
    [HarmonyReversePatch]
    public static void SomePrivateMethod(SomeGameClass instance)
    {
        // This method body won't actually execute; Harmony replaces it with a call to the target method
        throw new NotImplementedException();
    }
}
```

> Writing `throw new NotImplementedException()` as the method body is a convention — at runtime, Harmony replaces it with generated IL that calls the target method.

## Creating a Reverse Patch Manually

Without attributes, generate with code:

```csharp
var target = AccessTools.Method(typeof(SomeGameClass), "SomePrivateMethod");
var stub = AccessTools.Method(typeof(MyPatches), nameof(MyPatches.SomePrivateMethod));

var instance = new Harmony(MyMod.Harmony.Id);
var reverse = instance.CreateReversePatcher(target, new HarmonyMethod(stub));
reverse.Patch();
```

## What You Learned

- Reverse Patch can call any game method (including private ones)
- `[HarmonyReversePatch]` and the placeholder method body
- Creating a Reverse Patch manually

## Next Step

Back to the main topic: adding settings to your Mod → [Settings System](./settings.md)
