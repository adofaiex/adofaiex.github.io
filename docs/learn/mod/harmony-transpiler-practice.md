---
title: "Transpiler Practice"
order: 14
---

# Transpiler Practice: CodeMatcher

Manually iterating `CodeInstruction` is tedious. Harmony provides **CodeMatcher**, a fluent API for clearer IL matching and replacement.

## Basic CodeMatcher Usage

```csharp
public static IEnumerable<CodeInstruction> Transpiler(
    IEnumerable<CodeInstruction> instructions)   // instructions: the target method's full IL
{
    return new CodeMatcher(instructions)
        .MatchStartForward(                        // Search forward from the start for "push constant 1"
            new CodeInstruction(OpCodes.Ldc_I4_1)
        )
        .SetOpcodeAndAdvance(OpCodes.Ldc_I4_2)     // Replace it with "push constant 2"
        .InstructionEnumeration();                 // Return the modified full IL
}
```

- `MatchStartForward(...)`: match a sequence of IL from the current position forward
- `SetOpcodeAndAdvance(...)`: replace the current instruction's opcode
- `.InstructionEnumeration()`: return the modified full IL

## Matching a Sequence

You can match **multiple consecutive instructions**:

```csharp
new CodeMatcher(instructions)
    .MatchStartForward(
        new CodeInstruction(OpCodes.Ldarg_0),
        new CodeInstruction(OpCodes.Call, AccessTools.Method(typeof(Math), nameof(Math.Abs)))
    )
    ...
```

> When matching method calls, use `AccessTools.Method(typeof(Math), nameof(Math.Abs))` to specify exactly, avoiding matching same-name methods.

## Practical Example: Replacing a Damage Calculation

Suppose the target method has `result = rawDamage * damageMultiplier` and you want `rawDamage / 4`:

```csharp
[HarmonyPatch(typeof(Player), nameof(Player.CalculateDamage))]   // Patch target: damage calculation method
public static class CalculateDamage_Transpiler
{
    // Cache Math.Abs MethodInfo for matching call instructions in IL (avoid repeated reflection)
    private static readonly MethodInfo Abs =
        AccessTools.Method(typeof(Math), nameof(Math.Abs));

    public static IEnumerable<CodeInstruction> Transpiler(
        IEnumerable<CodeInstruction> instructions)
    {
        return new CodeMatcher(instructions)
            .MatchStartForward(                    // Find the IL segment for damage multiplier constants
                new CodeInstruction(OpCodes.Ldc_R4, 1f),
                new CodeInstruction(OpCodes.Ldc_R4, 2f)
            )
            .SetOperandAndAdvance(0.25f)   // Change to 0.25f
            .InstructionEnumeration();
    }
}
```

> ⚠️ In real code, adjust based on the actual IL structure — don't blindly copy numbers. Use dnSpy / ILSpy to inspect the target method's IL first.

## Inserting New Instructions

Use `Insert` to add logic at the current position:

```csharp
new CodeMatcher(instructions)
    .MatchStartForward(
        new CodeInstruction(OpCodes.Ret)   // Find return
    )
    .Insert(
        new CodeInstruction(OpCodes.Ldc_I4_0),   // Push 0
        new CodeInstruction(OpCodes.Ret)          // Return 0
    )
    .InstructionEnumeration();
```

## Debugging Transpiler

When a Transpiler goes wrong, the game may crash or behave unexpectedly. Recommendations:

1. First write a `MonoBehaviour` / test method that runs `CodeMatcher` on `instructions` and outputs each instruction
2. Use **dnSpy** to view the target method's IL and confirm the matched instruction sequence actually exists
3. If matching fails, CodeMatcher throws `InvalidOperationException` by default — use `.ThrowOnInvalid` or manual checks to avoid this

```csharp
var matcher = new CodeMatcher(instructions);
if (!matcher.MatchStartForward(...).IsValid)
{
    MyMod.Logger.Log("Match failed, not modifying");
    return instructions;
}
```

## What You Learned

- CodeMatcher's fluent API: matching, replacing, inserting
- Using `AccessTools.Method` for precise method call matching
- Degradation and debugging when matching fails

## Next Step

Learn to patch dynamically with code instead of attributes → [Manual Patching](./harmony-manual.md)
