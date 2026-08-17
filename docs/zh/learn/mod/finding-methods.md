---
title: 定位目标方法
order: 19
---

# 定位目标方法

写补丁前，必须先搞清楚「要修改游戏的哪个方法」。这是 Harmony 开发中最耗时的部分之一。

## 工具选择

| 工具 | 说明 |
| --- | --- |
| [dnSpy](https://github.com/dnSpyEx/dnSpy) | 反编译 + 调试一体，最常用 |
| [ILSpy](https://github.com/icsharpcode/ILSpy) | 轻量反编译，可看 IL |
| [Il2CppInspector](https://github.com/djkaty/Il2CppInspector) | 反编译 Il2Cpp 转储 |

ADOFAI 是 **Mono** 游戏，直接反编译游戏目录下的托管 DLL 即可：

```
A Dance of Fire and Ice\ADofAI_Data\Managed\Assembly-CSharp.dll
```

## 搜索思路

### 1. 从游戏功能反推方法名

想研究「判定」→ 搜 `judge`、`hit`、`perfect`（注意：只研究、不修改，见[开发规范](./guidelines.md)）；想改「相机」→ 搜 `camera`。dnSpy 的 **Analyze / 搜索** 都能用关键字定位。

### 2. 从字符串搜索

游戏内 UI 文案（如按钮文字「Play」）会作为字符串出现在 IL 里。在 dnSpy 中搜索字符串，再查看引用它的方法，能快速定位到相关逻辑。

### 3. 从字段 / 属性反查

知道某个值存在哪个字段里 → 右键字段 → **Analyze** → 看「谁读写它」，就能找到操作它的方法。

## 确认签名

找到候选方法后，记录三样东西：

```csharp
// 类名
// 方法名
// 参数类型（重载区分的关键）
```

示例：想补丁 `Scoring.UpdateScore`，查看它的签名是 `public void UpdateScore(float add)`。

对应补丁：

```csharp
[HarmonyPatch(typeof(Scoring), nameof(Scoring.UpdateScore))]
public static class UpdateScore_Postfix
{
    public static void Postfix(ref float __result) { /* ... */ }
}
```

> 如果方法在多个重载，必须用 `new Type[] { typeof(float) }` 指定。

## 查看 IL（为 Transpiler 做准备）

dnSpy 中把方法视图切到 **IL** 标签，即可看到与 `CodeInstruction` 一一对应的指令序列。

## 反编译受版权保护的二进制

::: warning
反编译游戏二进制仅供**理解与调试**使用。请勿把原版 DLL 或其他游戏二进制文件放入你的 Mod 产物、发布包或 GitHub 仓库，它们受版权保护。详见[模组开发规范](./guidelines.md)。
:::

## 验证目标是否「真的对」

打上补丁后，用日志验证补丁确实被调用：

```csharp
public static void Postfix()
{
    MyMod.Logger.Log("UpdateScore 被调用了");
}
```

如果日志没出现，回到[补丁生命周期](./harmony-lifecycle.md)排查。

## 你学到了什么

- 用 dnSpy / ILSpy 定位方法
- 三种搜索思路：功能、字符串、字段反查
- 记录签名与确认补丁生效

## 下一步

为你的 Mod 添加可配置的设置 → [设置系统](./settings.md)