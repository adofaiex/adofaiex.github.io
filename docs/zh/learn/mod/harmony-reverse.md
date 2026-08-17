---
title: Reverse Patch
order: 16
---

# Reverse Patch（反向补丁）

前三章学会了「往游戏方法上加东西」。Reverse Patch 是相反的操作：**把游戏方法「拿出来」，变成我们自己可以调用的方法**。

## 为什么需要 Reverse Patch

有时游戏的方法没有 public 访问、或逻辑无法通过参数触发。Reverse Patch 能让我们**调用任意游戏方法**，包括私有方法、静态方法、甚至构造函数。

## 声明一个 Reverse Patch

```csharp
[HarmonyPatch(typeof(SomeGameClass), nameof(SomeGameClass.SomePrivateMethod))]
public static class SomePrivateMethod_Reverse
{
    // 签名与目标方法一致即可，Harmony 会生成它的实现
    public static void SomePrivateMethod(SomeGameClass instance) { }
}
```

关键点：

- 类用 `[HarmonyPatch]` 声明目标
- 补丁方法名**任意**，但**签名必须与目标方法兼容**
- 实例方法的第一个参数传 `instance`

## 使用它

```csharp
// 之前：SomePrivateMethod 是私有方法，无法调用
// 之后：
var game = new SomeGameClass();
SomePrivateMethod_Reverse.SomePrivateMethod(game);
```

## 声明为特性：ReversePatchType

更常见的写法是用 `[HarmonyReversePatch]`：

```csharp
[HarmonyPatch(typeof(SomeGameClass), nameof(SomeGameClass.SomePrivateMethod))]
public static class SomePrivateMethod_Reverse
{
    [HarmonyReversePatch]
    public static void SomePrivateMethod(SomeGameClass instance)
    {
        // 这个方法体不会被真正执行，Harmony 会把它替换成对目标方法的调用
        throw new NotImplementedException();
    }
}
```

> 方法体写 `throw new NotImplementedException()` 是约定俗成的占位，真实调用时会被 Harmony 生成的 IL 替换掉。

## 手动创建 Reverse Patch

不依赖特性，用代码生成：

```csharp
var target = AccessTools.Method(typeof(SomeGameClass), "SomePrivateMethod");
var stub = AccessTools.Method(typeof(MyPatches), nameof(MyPatches.SomePrivateMethod));

var instance = new Harmony(MyMod.Harmony.Id);
var reverse = instance.CreateReversePatcher(target, new HarmonyMethod(stub));
reverse.Patch();
```

## 你学到了什么

- Reverse Patch 能调用任意游戏方法（含私有）
- `[HarmonyReversePatch]` 与占位方法体
- 手动创建 Reverse Patch 的方式

## 下一步

回到核心主题：为 Mod 添加设置 → [设置系统](./settings.md)