---
title: Manual Patching
order: 15
---

# Manual Patching

Previous chapters used `[HarmonyPatch]` attributes with `PatchAll` for automatic application. Some scenarios require **manual** patching with code.

## When to Use Manual Patching

- The target method can only be determined at runtime (e.g. dynamically generated, name from a string)
- You need to conditionally apply patches (only when a condition is met)
- Multiple patch methods in the same class need flexible combinations

## Basic API

```csharp
var harmony = MyMod.Harmony;   // Existing Harmony instance

var target = AccessTools.Method(typeof(SomeGameClass), "SomeMethod");
var prefix = AccessTools.Method(typeof(MyPatches), nameof(MyPatches.Prefix));

harmony.Patch(target, prefix: new HarmonyMethod(prefix));
```

`Harmony.Patch` parameters:

| Parameter | Purpose |
| --- | --- |
| `target` | Target `MethodBase` (obtained via `AccessTools.Method`) |
| `prefix` | Prefix patch method (wrapped in `HarmonyMethod`) |
| `postfix` | Postfix patch method |
| `finalizer` | Finalizer patch method |
| `transpiler` | Transpiler patch method |

## Conditional Patches

Only apply a patch when a condition is met:

```csharp
private static bool applied;

public static void Apply()
{
    if (applied) return;
    if (MyMod.Settings.Enabled)   // Condition check
    {
        var target = AccessTools.Method(typeof(SomeGameClass), "SomeMethod");
        var prefix = AccessTools.Method(typeof(MyPatches), nameof(MyPatches.Prefix));
        MyMod.Harmony.Patch(target, prefix: new HarmonyMethod(prefix));
        applied = true;
    }
}
```

## Dynamic Targets: String Method Names

```csharp
var target = AccessTools.Method("SomeGameClass:SomeMethod");
// Or
var target = AccessTools.TypeByName("SomeGameClass")
    .GetMethod("SomeMethod", BindingFlags.Public | BindingFlags.Instance);
```

> Locating methods by string is fragile across game version updates — prefer the strongly-typed API when possible.

## Removing Manual Patches

```csharp
// Remove a specific patch
MyMod.Harmony.Unpatch(target, HarmonyPatchType.Prefix, MyMod.Harmony.Id);
```

`Unpatch` parameter meanings:

- Remove all patches: `UnpatchAll(modEntry.Info.Id)`
- Remove a specific patch type: specify `HarmonyPatchType.Prefix` etc.
- Remove to original state: `Unpatch(target, HarmonyPatchType.All, Harmony.Id)`

## Attributes vs Manual: Mixing Notes

- `PatchAll` applies all classes with `[HarmonyPatch]`
- Manual `Patch` doesn't go through `PatchAll` — it patches the Harmony instance directly
- Both are controlled by `UnpatchAll(modEntry.Info.Id)` (as long as the Harmony instance Id matches)

## What You Learned

- Why manual patching is needed
- Using `Harmony.Patch` and `AccessTools.Method`
- Conditional patches and dynamic targets
- Various ways to remove patches

## Next Step

Learn Reverse Patch to call game methods in reverse → [Reverse Patch](./harmony-reverse.md)
