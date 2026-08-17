---
title: Finding Target Methods
order: 19
---

# Finding Target Methods

Before writing a patch, you must first figure out "which game method to modify." This is one of the most time-consuming parts of Harmony development.

## Tool Selection

| Tool | Description |
| --- | --- |
| [dnSpy](https://github.com/dnSpyEx/dnSpy) | Decompiler + debugger in one, most commonly used |
| [ILSpy](https://github.com/icsharpcode/ILSpy) | Lightweight decompiler, can view IL |
| [Il2CppInspector](https://github.com/djkaty/Il2CppInspector) | Decompiler for Il2Cpp dumps |

ADOFAI is a **Mono** game, so you can directly decompile the managed DLL in the game directory:

```
A Dance of Fire and Ice\ADofAI_Data\Managed\Assembly-CSharp.dll
```

## Search Strategies

### 1. Infer Method Names from Game Features

Want to research "judgment" → search `judge`, `hit`, `perfect` (note: research only, do not modify — see [Development Guidelines](./guidelines.md)); want to modify "camera" → search `camera`. dnSpy's **Analyze / Search** can locate by keyword.

### 2. Search from Strings

In-game UI text (like button text "Play") appears as strings in IL. Search for strings in dnSpy, then look at methods that reference them to quickly locate relevant logic.

### 3. Backtrace from Fields / Properties

If you know which field a value is stored in → right-click the field → **Analyze** → see "who reads/writes it" to find methods that operate on it.

## Confirming the Signature

Once you find a candidate method, record three things:

```csharp
// Class name
// Method name
// Parameter types (key for distinguishing overloads)
```

Example: you want to patch `Scoring.UpdateScore`, and its signature is `public void UpdateScore(float add)`.

The corresponding patch:

```csharp
[HarmonyPatch(typeof(Scoring), nameof(Scoring.UpdateScore))]
public static class UpdateScore_Postfix
{
    public static void Postfix(ref float __result) { /* ... */ }
}
```

> If the method has multiple overloads, you must specify with `new Type[] { typeof(float) }`.

## Viewing IL (Preparing for Transpiler)

In dnSpy, switch the method view to the **IL** tab to see the instruction sequence that corresponds one-to-one with `CodeInstruction`.

## Decompiling Copyright-Protected Binaries

::: warning
Decompiling game binaries is for **understanding and debugging** only. Do not put original DLLs or other game binaries into your Mod artifacts, release packages, or GitHub repositories — they are copyright-protected. See [Development Guidelines](./guidelines.md).
:::

## Verifying the Target is "Really Correct"

After applying a patch, verify it's actually being called with a log:

```csharp
public static void Postfix()
{
    MyMod.Logger.Log("UpdateScore was called");
}
```

If the log doesn't appear, go back to [Patch Lifecycle](./harmony-lifecycle.md) to troubleshoot.

## What You Learned

- Locating methods with dnSpy / ILSpy
- Three search strategies: features, strings, field backtracing
- Recording signatures and confirming patches work

## Next Step

Add configurable settings to your Mod → [Settings System](./settings.md)
