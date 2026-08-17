---
title: Harmony Introduction
order: 6
---

# Harmony Introduction

Harmony is the most essential capability for ADOFAI Mods: **intercepting and modifying game methods without touching the game source code**.

## Why Harmony?

The game is a compiled Unity program — we can't directly edit its source. Harmony rewrites methods at runtime, letting our code execute **before, after, or even inside** game methods.

## Four Patch Types

| Type | Timing | Purpose |
| --- | --- | --- |
| **Prefix** | Before method execution | Modify parameters, early return (intercept) |
| **Postfix** | After method execution | Read / modify return value |
| **Finalizer** | After method ends (regardless of exceptions) | Exception handling |
| **Transpiler** | IL level | Deep modification of method internals |

This series covers each in 11 chapters:

| Chapter | Content |
| --- | --- |
| [Prefix Patch](./harmony-prefix.md) | Intercept methods, modify parameters |
| [Postfix Patch](./harmony-postfix.md) | Read / modify return values |
| [Finalizer Patch](./harmony-finalizer.md) | Exception handling |
| [Magic Parameters](./harmony-magic-params.md) | `__instance` / `__result` / `__state` etc. |
| [HarmonyPatch Details](./harmony-attributes.md) | Target syntax and priorities |
| [Patch Lifecycle](./harmony-lifecycle.md) | How patches are applied and removed |
| [Transpiler Introduction](./harmony-transpiler.md) | What IL is, how to write patches |
| [Transpiler Practice](./harmony-transpiler-practice.md) | CodeMatcher advanced usage |
| [Manual Patching](./harmony-manual.md) | Dynamic patching with code |
| [Reverse Patch](./harmony-reverse.md) | Call game methods in reverse |

## What a Complete Patch Looks Like

```csharp
using HarmonyLib;

namespace MyFirstMod
{
    [HarmonyPatch(typeof(SomeGameClass), nameof(SomeGameClass.SomeMethod))]
    public static class SomeMethod_Prefix
    {
        public static bool Prefix()
        {
            // Returning false skips the original method (interception)
            return false;
        }
    }
}
```

Three essential elements:

1. **`[HarmonyPatch]`** — declares the patch target (class + method)
2. **Patch method name** — `Prefix` / `Postfix` / `Finalizer` / `Transpiler`; Harmony identifies by name
3. **Patch class** — must be a `static class`; `PatchAll` scans automatically

## Finding the Target Method

Finding the target method is one of the hardest parts of Mod development. We recommend using **dnSpy** or **ILSpy** to decompile the game assembly. See the full guide in [Finding Target Methods](./finding-methods.md).

## What You Learned

- Why Harmony exists
- The four patch types and their timing
- The three essential elements of a patch

## Next Step

Learn the most common Prefix patch → [Prefix Patch](./harmony-prefix.md)
