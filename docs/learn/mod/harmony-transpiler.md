---
title: Transpiler Introduction
order: 13
---

# Transpiler Introduction

Prefix / Postfix can only insert logic "before and after" a method. If you need to modify logic **inside** a method (e.g. replace an operation, change a branch), you need a Transpiler — which rewrites the method directly at the **IL level**.

## What is IL?

C# doesn't compile directly to machine code — it compiles to Intermediate Language **IL**. The CLR then JIT-compiles IL to machine code before execution. A Transpiler rewrites IL **before** JIT.

```
C# source → compile → IL (modifiable) → JIT → machine code
                           ↑
                    Transpiler works here
```

## A Simple IL Example

```csharp
// C# source
public int AddOne(int x) => x + 1;
```

The compiled IL looks roughly like:

```cil
ldarg.1    // Push parameter x
ldc.i4.1   // Push constant 1
add        // Add
ret        // Return
```

Each line of IL corresponds to a `CodeInstruction` object with these fields:

| Field | Meaning |
| --- | --- |
| `opcode` | Operation code, e.g. `Ldarg.1`, `Add`, `Ret` |
| `operand` | Operand, e.g. constant `1`, a field, a method |
| `labels` | Jump labels (for branching) |

## Basic Transpiler Form

```csharp
[HarmonyPatch(typeof(SomeGameClass), nameof(SomeGameClass.SomeMethod))]
public static class SomeMethod_Transpiler
{
    public static IEnumerable<CodeInstruction> Transpiler(
        IEnumerable<CodeInstruction> instructions)
    {
        // instructions is the original method's IL; inspect/replace each and return
        return instructions;
    }
}
```

## Your First Transpiler: Change +1 to +2

```csharp
public static IEnumerable<CodeInstruction> Transpiler(
    IEnumerable<CodeInstruction> instructions)
{
    var list = instructions.ToList();
    for (int i = 0; i < list.Count; i++)
    {
        if (list[i].opcode == OpCodes.Ldc_I4_1)   // Find "push constant 1"
        {
            list[i].opcode = OpCodes.Ldc_I4_2;    // Change to "push constant 2"
        }
    }
    return list;
}
```

> ⚠️ This example is for demonstration only. In real code, `ldc.i4.1` could come from anywhere — always verify with context to avoid unintended changes.

## Common Opcode Quick Reference

| Opcode | Meaning |
| --- | --- |
| `Ldarg_0` / `Ldarg_1` | Push parameter (index 0 is `this`) |
| `Ldc_I4_*` | Push integer constant |
| `Call` / `Callvirt` | Call a method |
| `Add` / `Sub` / `Mul` / `Div` | Arithmetic operations |
| `Bne_Un` / `Br` | Jump (branching) |
| `Ret` | Return |
| `Pop` | Pop the stack top |

## When to Use Transpiler

Transpiler is powerful but complex. **Prefer Prefix / Postfix**; only use Transpiler when:

- You need to modify operations or logic **inside** a method
- You need to replace a method call (e.g. swap `Damage()` for `Heal()`)
- The method's internal state can't be expressed through pre/post patches

## What You Learned

- What IL is and where Transpiler sits in the compilation chain
- The structure of `CodeInstruction`
- Basic Transpiler syntax and a first example

## Next Step

Learn the more practical CodeMatcher → [Transpiler Practice](./harmony-transpiler-practice.md)
