---
title: Transpiler 实战
order: 14
---

# Transpiler 实战：CodeMatcher

手动遍历 `CodeInstruction` 很繁琐。Harmony 提供了 **CodeMatcher**，用链式 API 更清晰地匹配和替换 IL。

## CodeMatcher 基本用法

```csharp
public static IEnumerable<CodeInstruction> Transpiler(
    IEnumerable<CodeInstruction> instructions)   // instructions：目标方法的完整 IL
{
    return new CodeMatcher(instructions)
        .MatchStartForward(                        // 从头向后找「压入常量 1」这条指令
            new CodeInstruction(OpCodes.Ldc_I4_1)
        )
        .SetOpcodeAndAdvance(OpCodes.Ldc_I4_2)     // 把它替换成「压入常量 2」
        .InstructionEnumeration();                 // 返回修改后的完整 IL
}
```

- `MatchStartForward(...)`：从当前位置向后匹配一段 IL
- `SetOpcodeAndAdvance(...)`：把当前指令的操作码替换掉
- `.InstructionEnumeration()`：返回修改后的完整 IL

## 匹配一段代码

可以匹配**连续的多个指令**：

```csharp
new CodeMatcher(instructions)
    .MatchStartForward(
        new CodeInstruction(OpCodes.Ldarg_0),
        new CodeInstruction(OpCodes.Call, AccessTools.Method(typeof(Math), nameof(Math.Abs)))
    )
    ...
```

> 匹配方法调用时，用 `AccessTools.Method(typeof(Math), nameof(Math.Abs))` 精确指定，避免匹配到同名方法。

## 实战：替换一次伤害计算

假设目标方法里有 `result = rawDamage * damageMultiplier`，想改成 `rawDamage / 4`：

```csharp
[HarmonyPatch(typeof(Player), nameof(Player.CalculateDamage))]   // 补丁目标：伤害计算方法
public static class CalculateDamage_Transpiler
{
    // 缓存 Math.Abs 的 MethodInfo，匹配 IL 里的 call 指令用（避免每次反射）
    private static readonly MethodInfo Abs =
        AccessTools.Method(typeof(Math), nameof(Math.Abs));

    public static IEnumerable<CodeInstruction> Transpiler(
        IEnumerable<CodeInstruction> instructions)
    {
        return new CodeMatcher(instructions)
            .MatchStartForward(                    // 找到伤害倍率常量那段 IL
                new CodeInstruction(OpCodes.Ldc_R4, 1f),
                new CodeInstruction(OpCodes.Ldc_R4, 2f)
            )
            .SetOperandAndAdvance(0.25f)   // 改成 0.25f
            .InstructionEnumeration();
    }
}
```

> ⚠️ 真实代码中请根据实际 IL 结构调整，不要盲目套用数字。先用 dnSpy / ILSpy 打开目标方法查看 IL。

## 插入新的指令

用 `Insert` 在当前位置插入一段逻辑：

```csharp
new CodeMatcher(instructions)
    .MatchStartForward(
        new CodeInstruction(OpCodes.Ret)   // 找到 return
    )
    .Insert(
        new CodeInstruction(OpCodes.Ldc_I4_0),   // 压入 0
        new CodeInstruction(OpCodes.Ret)          // 返回 0
    )
    .InstructionEnumeration();
```

## 调试 Transpiler

Transpiler 出错时，游戏可能直接崩溃或行为异常。推荐：

1. 先写一个 `MonoBehaviour` / 测试方法，用 `CodeMatcher` 对 `instructions` 做一遍并输出每条指令
2. 使用 **dnSpy** 查看目标方法的 IL，确认匹配的指令序列确实存在
3. 万一匹配不上，CodeMatcher 默认抛出 `InvalidOperationException`，可以通过 `.ThrowOnInvalid` / 手动检查避免

```csharp
var matcher = new CodeMatcher(instructions);
if (!matcher.MatchStartForward(...).IsValid)
{
    MyMod.Logger.Log("匹配失败，不修改");
    return instructions;
}
```

## 你学到了什么

- CodeMatcher 的链式 API：匹配、替换、插入
- 用 `AccessTools.Method` 精确匹配方法调用
- 匹配失败时的降级与调试

## 下一步

学习不用特性、用代码动态打补丁 → [手动补丁](./harmony-manual.md)