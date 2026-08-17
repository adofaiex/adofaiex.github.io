---
title: Transpiler 入门
order: 13
---

# Transpiler 入门

Prefix / Postfix 只能在方法的「前后」插入逻辑。如果要在方法**内部**修改逻辑（比如替换一次运算、改一个分支），就需要 Transpiler —— 直接在 **IL 层面**改写方法。

## IL 是什么

C# 编译后不会直接变成机器码，而是变成中间语言 **IL（Intermediate Language）**。CLR 执行前再把 IL 即时编译（JIT）为机器码。Transpiler 就是在 JIT **之前**改写 IL。

```
C# 源码 → 编译 → IL（可被修改）→ JIT → 机器码
                       ↑
                Transpiler 在这里
```

## 一个简单的 IL 例子

```csharp
// C# 源码
public int AddOne(int x) => x + 1;
```

编译成的 IL 大致是：

```cil
ldarg.1    // 压入参数 x
ldc.i4.1   // 压入常量 1
add        // 相加
ret        // 返回
```

每一行 IL 对应一个 `CodeInstruction` 对象，字段有：

| 字段 | 含义 |
| --- | --- |
| `opcode` | 操作码，如 `Ldarg.1`、`Add`、`Ret` |
| `operand` | 操作数，如常量 `1`、字段、方法 |
| `labels` | 跳转标签（分支用） |

## Transpiler 基本形式

```csharp
[HarmonyPatch(typeof(SomeGameClass), nameof(SomeGameClass.SomeMethod))]
public static class SomeMethod_Transpiler
{
    public static IEnumerable<CodeInstruction> Transpiler(
        IEnumerable<CodeInstruction> instructions)
    {
        // instructions 是原方法的 IL，逐条检查 / 替换后返回
        return instructions;
    }
}
```

## 第一个 Transpiler：把 +1 改成 +2

```csharp
public static IEnumerable<CodeInstruction> Transpiler(
    IEnumerable<CodeInstruction> instructions)
{
    var list = instructions.ToList();
    for (int i = 0; i < list.Count; i++)
    {
        if (list[i].opcode == OpCodes.Ldc_I4_1)   // 找到「压入常量 1」
        {
            list[i].opcode = OpCodes.Ldc_I4_2;    // 改成「压入常量 2」
        }
    }
    return list;
}
```

> ⚠️ 示例仅为演示。真实代码中 `ldc.i4.1` 可能来自任何地方，请务必结合上下文判断，避免误伤。

## 常用操作码速查

| 操作码 | 含义 |
| --- | --- |
| `Ldarg_0` / `Ldarg_1` | 压入参数（第 0 个是 `this`） |
| `Ldc_I4_*` | 压入整数常量 |
| `Call` / `Callvirt` | 调用方法 |
| `Add` / `Sub` / `Mul` / `Div` | 算术运算 |
| `Bne_Un` / `Br` | 跳转（分支） |
| `Ret` | 返回 |
| `Pop` | 弹出栈顶 |

## 什么时候该用 Transpiler

Transpiler 强大但复杂。**优先用 Prefix / Postfix**，只在以下情况使用：

- 需要修改方法**内部**的运算或逻辑
- 需要替换一个方法调用（例如把 `Damage()` 换成 `Heal()`）
- 方法内部的状态无法通过前后补丁表达

## 你学到了什么

- IL 是什么，Transpiler 在编译链中的位置
- `CodeInstruction` 的结构
- Transpiler 的基本写法和第一个示例

## 下一步

学习更实用的 CodeMatcher → [Transpiler 实战](./harmony-transpiler-practice.md)