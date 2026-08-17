---
title: Patch Lifecycle
order: 12
---

# Patch Lifecycle

Patches don't "stay forever once written" — they are applied and removed as the Mod is enabled / disabled.

## PatchAll: Auto-Scan and Apply

Call `PatchAll` in `OnToggle(true)` to scan the current assembly for all classes with `[HarmonyPatch]` and apply them:

```csharp
private static bool OnToggle(UnityModManager.ModEntry modEntry, bool value)
{
    if (value)   // value=true: Mod is being enabled
    {
        Harmony?.PatchAll(Assembly.GetExecutingAssembly());   // Scan assembly, apply all [HarmonyPatch]
    }
    else         // value=false: Mod is being disabled
    {
        Harmony?.UnpatchAll(modEntry.Info.Id);   // Only remove this Mod's patches
    }
    return true;   // Tell UMM the toggle operation succeeded
}
```

## UnpatchAll: Remove by Mod

`UnpatchAll(string)` only removes patches **belonging to a specific HarmonyId**. Our `Harmony` instance is created with `modEntry.Info.Id`, so `UnpatchAll(modEntry.Info.Id)` only removes this Mod's patches without affecting other Mods.

```csharp
Harmony = new Harmony(modEntry.Info.Id);   // HarmonyId = Mod's Id
```

> Never use the parameterless `UnpatchAll()` — that removes ALL patches from ALL Mods!

## Execution Order of Multiple Patches

When the same method is modified by multiple Mods / patches, ordering follows rules:

- **PatchAll** applies in **metadata token order** within the assembly (roughly class declaration order)
- Patches follow a "first declared, first executed" rule: later Prefixes run **before** earlier ones (LIFO), Postfixes are the reverse
- Harmony allows specifying priority via `[HarmonyPriority]` on `[HarmonyPatch]`

```csharp
[HarmonyPriority(Priority.First)]
[HarmonyPatch(typeof(SomeGameClass), nameof(SomeGameClass.SomeMethod))]
public static class First_Prefix { /* ... */ }
```

Common priority constants: `Priority.High / Normal / Low / First / Last`.

## Modifying Target Method Signature

Harmony locates targets by "class + method name + parameter types". If the game has multiple same-name overloads, you need to specify parameter types:

```csharp
// Only patch the (int) overload
[HarmonyPatch(typeof(SomeGameClass), nameof(SomeGameClass.SomeMethod), new Type[] { typeof(int) })]
public static class SomeMethodInt_Prefix { /* ... */ }
```

## Checking if Patches Are Active at Runtime

```csharp
// Get patch info for the target method (use reflection to get MethodInfo)
var info = Harmony.GetPatchInfo(typeof(SomeGameClass).GetMethod(nameof(SomeGameClass.SomeMethod)));
if (info != null)   // Patches were indeed applied to the target method
{
    MyMod.Logger.Log($"Prefix count: {info.Prefixes.Count}");
}
```

## Debugging Patches Not Taking Effect

When patches "don't work", check in order:

1. **Was it scanned by PatchAll**: the class must be `public static class` with `[HarmonyPatch]`
2. **Is the target correct**: method name, class name, parameter types (overloads) must match
3. **Was it called before OnToggle**: if game code called the target method before the Mod was enabled, the patch "missed" it
4. **Was it unpatched by another Mod**: check with `GetPatchInfo`

## What You Learned

- `PatchAll` / `UnpatchAll` application and removal
- Execution order and priority of multiple patches
- Using `GetPatchInfo` to check patch status

## Next Step

Enter the world of IL and learn Transpiler → [Transpiler Introduction](./harmony-transpiler.md)
