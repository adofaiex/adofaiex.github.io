---
title: Harmony 入门
order: 6
---

# Harmony 入门

Harmony 是 ADOFAI Mod 最核心的能力：**在不修改游戏源码的前提下，拦截并修改游戏方法**。

## 为什么需要 Harmony

游戏是一个已编译的 Unity 程序，我们不能直接改它的源码。Harmony 通过运行时改写方法，让我们的代码在游戏方法**之前、之后、甚至内部**执行。

## 四种补丁类型

| 类型 | 时机 | 用途 |
| --- | --- | --- |
| **Prefix** | 方法执行前 | 修改参数、提前返回（拦截） |
| **Postfix** | 方法执行后 | 读取 / 修改返回值 |
| **Finalizer** | 方法结束后（无论是否异常） | 异常处理 |
| **Transpiler** | IL 层面 | 深度修改方法内部逻辑 |

本系列将用 11 章逐个讲透：

| 章节 | 内容 |
| --- | --- |
| [Prefix 补丁](./harmony-prefix.md) | 拦截方法、修改参数 |
| [Postfix 补丁](./harmony-postfix.md) | 读取 / 修改返回值 |
| [Finalizer 补丁](./harmony-finalizer.md) | 异常处理 |
| [魔法参数详解](./harmony-magic-params.md) | `__instance` / `__result` / `__state` 等 |
| [HarmonyPatch 详解](./harmony-attributes.md) | 各种目标写法与优先级 |
| [补丁生命周期](./harmony-lifecycle.md) | 补丁如何应用与移除 |
| [Transpiler 入门](./harmony-transpiler.md) | IL 是什么、补丁怎么写 |
| [Transpiler 实战](./harmony-transpiler-practice.md) | CodeMatcher 高级用法 |
| [手动补丁](./harmony-manual.md) | 用代码动态打补丁 |
| [Reverse Patch](./harmony-reverse.md) | 反向调用游戏方法 |

## 一个完整的补丁长什么样

```csharp
using HarmonyLib;

namespace MyFirstMod
{
    [HarmonyPatch(typeof(SomeGameClass), nameof(SomeGameClass.SomeMethod))]
    public static class SomeMethod_Prefix
    {
        public static bool Prefix()
        {
            // 返回 false 会跳过原方法，实现拦截
            return false;
        }
    }
}
```

三个要素缺一不可：

1. **`[HarmonyPatch]`** —— 声明要补丁的目标（类 + 方法）
2. **补丁方法名** —— `Prefix` / `Postfix` / `Finalizer` / `Transpiler`，Harmony 靠名字识别
3. **补丁类** —— 必须是 `static class`，`PatchAll` 会自动扫描

## 找到目标方法

找到目标方法是 Mod 开发中最困难的部分之一。推荐用 **dnSpy** 或 **ILSpy** 反编译游戏程序集来定位。完整的定位教程见 [定位目标方法](./finding-methods.md)。

## 你学到了什么

- Harmony 为什么存在
- 四种补丁类型与时机
- 一个补丁的三个要素

## 下一步

学习最常用的 Prefix 补丁 → [Prefix 补丁](./harmony-prefix.md)