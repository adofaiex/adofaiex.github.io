---
title: 什么是 Mod
order: 2
---

# 什么是 Mod

Mod 是对游戏的修改（Modification）。在 ADOFAI 中，Mod 通常以 **UnityModManager (UMM)** 插件的形式存在，可以扩展游戏的行为、画面与数据。

## Mod 能做什么

以组织内的真实项目为例：

| Mod | 做什么 |
| --- | --- |
| [Iridium](https://github.com/adofaiex/Iridium) | 面向 ADOFAI 的优化 Mod，提升性能 |
| [YqlossClientHarmony](https://github.com/adofaiex/YqlossClientHarmony) | 修复致命装饰物、特效去除、回放录制 |
| [Iris](https://github.com/adofaiex/Iris) | 为游戏提供视觉特效 |
| [JipperKeyViewer](https://github.com/adofaiex/JipperKeyViewer) | 按键查看器 |
| [ADOFAI.EditorTweaks](https://github.com/adofaiex/ADOFAI.EditorTweaks) | 编辑器增强 |

## Mod 的基本原理

绝大多数 ADOFAI Mod 依赖两样东西：

1. **UnityModManager (UMM)** —— 负责加载 Mod、管理启停、提供设置界面
2. **Harmony** —— 运行时补丁库，可以在不改动游戏源码的前提下拦截和修改游戏方法

## 你能做什么

掌握这两个工具后，可以做出非常丰富的功能：

- 移除或添加视觉特效
- 录制与回放
- 优化性能
- 在游戏内绘制 UI
- 扩展编辑器能力

::: warning 开发红线
请勿制作**脱离原版游戏平衡**的 Mod（例如改动判定、精度计算）。游戏判定是官方的雷区，我们不会在教程中介绍相关做法。更多规范见 [模组开发规范](./guidelines.md)。
:::

## 下一步

搭建环境就绪后，写出第一个 Mod → [最小实例](./first-mod.md)